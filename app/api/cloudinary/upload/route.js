import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_PRODUCT_IMAGES = 8;

export const runtime = "nodejs";

function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return {
    cloudName,
    apiKey,
    apiSecret,
    missingKeys: [
      ["CLOUDINARY_CLOUD_NAME", cloudName],
      ["CLOUDINARY_API_KEY", apiKey],
      ["CLOUDINARY_API_SECRET", apiSecret],
    ]
      .filter(([, value]) => !value)
      .map(([key]) => key),
  };
}

function getSafeFileName(file, index) {
  const name = typeof file.name === "string" ? file.name : `image-${index + 1}`;
  return name.replace(/[^\w.-]+/g, "-").slice(0, 120);
}

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    stream.end(buffer);
  });
}

export async function POST(request) {
  try {
    const { cloudName, apiKey, apiSecret, missingKeys } = getCloudinaryConfig();

    if (missingKeys.length > 0) {
      console.error("[cloudinary-upload] missing environment variables", {
        missingKeys,
      });
      return NextResponse.json(
        {
          error: `Cloudinary is not configured. Missing: ${missingKeys.join(", ")}.`,
        },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const formData = await request.formData();
    const files = formData.getAll("images");

    if (!files.length) {
      return NextResponse.json(
        { error: "Please choose at least one product image." },
        { status: 400 },
      );
    }

    if (files.length > MAX_PRODUCT_IMAGES) {
      return NextResponse.json(
        { error: `Please upload ${MAX_PRODUCT_IMAGES} images or fewer per product.` },
        { status: 400 },
      );
    }

    console.log("[cloudinary-upload] upload start", {
      fileCount: files.length,
      totalBytes: files.reduce((total, file) => total + (file.size || 0), 0),
    });

    const uploads = [];

    for (const [index, file] of files.entries()) {
      if (!file || typeof file.arrayBuffer !== "function") {
        throw new Error("Invalid image upload.");
      }

      if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
        throw new Error("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error("Image must be 5MB or smaller.");
      }

      const originalFilename = getSafeFileName(file, index);
      console.log("[cloudinary-upload] uploading image", {
        index,
        originalFilename,
        type: file.type,
        bytes: file.size,
      });

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadBuffer(buffer, {
        folder: "affiliate-store/products",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        context: {
          original_filename: originalFilename,
          source: "affiliate-store-admin",
          slot: index === 0 ? "primary" : "gallery",
        },
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      });

      uploads.push({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      });

      console.log("[cloudinary-upload] uploaded image", {
        index,
        publicId: result.public_id,
        url: result.secure_url,
        bytes: result.bytes,
      });
    }

    console.log("[cloudinary-upload] upload success", {
      uploadCount: uploads.length,
    });
    return NextResponse.json({ uploads });
  } catch (error) {
    console.error("[cloudinary-upload] upload failure", error);
    return NextResponse.json(
      { error: error?.message || "Unable to upload images to Cloudinary." },
      { status: 400 },
    );
  }
}
