import { v2 as cloudinary } from "cloudinary";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

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
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return Response.json(
        { error: "Cloudinary is not configured for this project." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images");

    if (!files.length) {
      return Response.json(
        { error: "Please choose at least one product image." },
        { status: 400 },
      );
    }

    const uploads = await Promise.all(
      files.map(async (file, index) => {
        if (!file || typeof file.arrayBuffer !== "function") {
          throw new Error("Invalid image upload.");
        }

        if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
          throw new Error("Only JPG, JPEG, PNG, and WEBP images are allowed.");
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
          throw new Error("Image must be 5MB or smaller.");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadBuffer(buffer, {
          folder: "affiliate-store/products",
          resource_type: "image",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          context: {
            original_filename: file.name,
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

        return {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        };
      }),
    );

    return Response.json({ uploads });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Unable to upload images to Cloudinary." },
      { status: 400 },
    );
  }
}
