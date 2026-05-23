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

/**
 * Validates and retrieves Cloudinary configuration from environment variables.
 */
function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || null;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || null;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "affiliate_products";

  // We only require the cloud name. API key/secret are optional so the route
  // can support unsigned uploads (client-side unsigned preset) or server-side
  // signed uploads when credentials are available.
  const missing = [];
  if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");

  const isSigned = Boolean(apiKey && apiSecret);

  return {
    cloudName,
    apiKey,
    apiSecret,
    uploadPreset,
    isSigned,
    missingKeys: missing,
  };
}

/**
 * Sanitizes a filename for Cloudinary.
 */
function getSafeFileName(file, index) {
  const name = typeof file.name === "string" ? file.name : `image-${index + 1}`;
  return name.replace(/[^\w.-]+/g, "-").slice(0, 120);
}

/**
 * Wraps Cloudinary's upload_stream in a Promise with timeout protection.
 */
function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    console.log("[cloudinary-api] uploadBuffer starting", { 
      folder: options.folder, 
      resource_type: options.resource_type,
      bufferSize: buffer.length 
    });
    
    let isFinished = false;
    const timeoutMs = 60000; // 60 second server-side timeout (reduced from 90s for better feedback)
    
    const timer = setTimeout(() => {
      if (isFinished) return;
      isFinished = true;
      console.error("[cloudinary-api] Cloudinary upload_stream timed out after 60s");
      reject(new Error("Cloudinary upload timed out (server-side)."));
    }, timeoutMs);

    try {
      console.log("[cloudinary-api] Creating upload_stream...");
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (isFinished) return;
        isFinished = true;
        clearTimeout(timer);
        
        if (error) {
          console.error("[cloudinary-api] Cloudinary callback error", { error });
          reject(error);
          return;
        }

        if (!result) {
          console.error("[cloudinary-api] Cloudinary returned empty result");
          reject(new Error("Cloudinary returned an empty response."));
          return;
        }

        console.log("[cloudinary-api] Cloudinary callback success", { 
          public_id: result.public_id,
          url: result.secure_url || result.url 
        });
        resolve(result);
      });

      console.log("[cloudinary-api] Writing buffer to stream...");
      uploadStream.on("error", (streamError) => {
        console.error("[cloudinary-api] Stream error event:", streamError);
        if (!isFinished) {
          isFinished = true;
          clearTimeout(timer);
          reject(streamError);
        }
      });

      uploadStream.end(buffer);
      console.log("[cloudinary-api] Stream ended, waiting for callback...");
    } catch (err) {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timer);
      console.error("[cloudinary-api] Cloudinary stream catch error", { err });
      
      // Fallback: try uploading via base64 if stream fails
      try {
        console.log("[cloudinary-api] Attempting base64 fallback upload");
        const base64 = buffer.toString("base64");
        const dataUri = `data:image/png;base64,${base64}`; 
        
        cloudinary.uploader.upload(dataUri, options, (error, result) => {
          if (error) {
            console.error("[cloudinary-api] Fallback upload failed", error);
            reject(error);
          } else {
            console.log("[cloudinary-api] Fallback upload success");
            resolve(result);
          }
        });
      } catch (fallbackErr) {
        console.error("[cloudinary-api] Fallback logic failed", fallbackErr);
        reject(err); // Prefer the original stream error
      }
    }
  });
}

/**
 * Perform an unsigned upload to Cloudinary's REST endpoint using FormData.
 * This is used as a fallback when API credentials are not available on the server.
 */
async function uploadUnsignedDirect(buffer, { cloudName, uploadPreset, folder, resource_type = "image", use_filename, unique_filename, overwrite, context, filename, contentType }) {
  console.log("[cloudinary-api] uploadUnsignedDirect starting", { cloudName, uploadPreset, folder, filename });

  try {
    const form = new FormData();

    // Construct a Blob from the buffer (Node 18+ / Next.js runtime should support this).
    let blob;
    try {
      blob = new Blob([buffer], { type: contentType || "application/octet-stream" });
    } catch (e) {
      // Fallback for environments where Buffer -> Blob direct constructor is not supported
      const uint8 = new Uint8Array(buffer);
      blob = new Blob([uint8], { type: contentType || "application/octet-stream" });
    }

    form.append("file", blob, filename || "upload");
    form.append("upload_preset", uploadPreset);
    if (folder) form.append("folder", folder);
    if (use_filename) form.append("use_filename", use_filename ? "true" : "false");
    if (unique_filename === false) form.append("unique_filename", "false");
    if (context && typeof context === "object") {
      const ctx = Object.entries(context).map(([k, v]) => `${k}=${v}`).join("|");
      form.append("context", ctx);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resource_type}/upload`;

    const controller = new AbortController();
    const timeoutMs = 60000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(endpoint, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text || "{}");
    } catch (parseErr) {
      throw new Error(`Unsigned upload parse error: ${parseErr.message} - ${text}`);
    }

    if (!res.ok) {
      const message = json?.error?.message || `Cloudinary unsigned upload failed (${res.status})`;
      throw new Error(message);
    }

    return json;
  } catch (err) {
    console.error("[cloudinary-api] uploadUnsignedDirect failed", err);
    throw err;
  }
}

export async function POST(request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[cloudinary-api][${requestId}] POST request received`);
  
  try {
    const { cloudName, apiKey, apiSecret, uploadPreset, isSigned, missingKeys } = getCloudinaryConfig();

    if (missingKeys.length > 0) {
      console.error(`[cloudinary-api][${requestId}] Missing environment variables`, { missingKeys });
      return NextResponse.json(
        { error: `Cloudinary is not configured. Missing: ${missingKeys.join(", ")}.` },
        { status: 500 }
      );
    }

    console.log(`[cloudinary-api][${requestId}] Cloudinary config found`, { isSigned, uploadPreset });

    cloudinary.config({
      cloud_name: cloudName,
      secure: true,
      ...(isSigned ? { api_key: apiKey, api_secret: apiSecret } : {}),
    });

    if (!isSigned) {
      console.warn(`[cloudinary-api][${requestId}] Cloudinary API key/secret not provided — attempting unsigned uploads using preset '${uploadPreset}'`);
    }

    console.log(`[cloudinary-api][${requestId}] Parsing formData...`);
    let formData;
    try {
      formData = await request.formData();
      console.log(`[cloudinary-api][${requestId}] formData parsed successfully`);
    } catch (formError) {
      console.error(`[cloudinary-api][${requestId}] Error parsing formData:`, formError);
      return NextResponse.json(
        { error: "Failed to parse form data. The file might be corrupted or the request was interrupted." },
        { status: 400 }
      );
    }

    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      console.warn(`[cloudinary-api][${requestId}] No images provided in formData`);
      return NextResponse.json(
        { error: "Please choose at least one product image." },
        { status: 400 }
      );
    }

    console.log(`[cloudinary-api][${requestId}] Processing files`, { count: files.length });

    const uploads = [];

    for (const [index, file] of files.entries()) {
      console.log(`[cloudinary-api][${requestId}] Processing file ${index + 1}/${files.length}`, { 
        name: file.name, 
        type: file.type, 
        size: file.size 
      });

      if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
        console.error(`[cloudinary-api][${requestId}] Unsupported file type: ${file.type}`);
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        console.error(`[cloudinary-api][${requestId}] File too large: ${file.size}`);
        throw new Error(`File too large: ${Math.round(file.size / 1024 / 1024)}MB`);
      }

      const originalFilename = getSafeFileName(file, index);
      
      console.log(`[cloudinary-api][${requestId}] Reading file arrayBuffer...`);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`[cloudinary-api][${requestId}] Buffer created (${buffer.length} bytes), preparing upload`);

      const uploadOptions = {
        folder: "affiliate-store/products",
        resource_type: "image",
        upload_preset: uploadPreset,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        context: {
          original_filename: originalFilename,
          source: "affiliate-store-admin",
          slot: index === 0 ? "primary" : "gallery",
        },
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      };

      let result;
      if (isSigned) {
        result = await uploadBuffer(buffer, uploadOptions);
      } else {
        try {
          result = await uploadUnsignedDirect(buffer, {
            cloudName,
            uploadPreset,
            folder: uploadOptions.folder,
            resource_type: uploadOptions.resource_type,
            use_filename: uploadOptions.use_filename,
            unique_filename: uploadOptions.unique_filename,
            overwrite: uploadOptions.overwrite,
            context: uploadOptions.context,
            filename: originalFilename,
            contentType: file.type,
            transformation: uploadOptions.transformation,
          });
        } catch (unsignedErr) {
          console.warn(`[cloudinary-api][${requestId}] Unsigned upload failed, falling back to SDK stream`, { unsignedErr: unsignedErr?.message });
          result = await uploadBuffer(buffer, uploadOptions);
        }
      }

      console.log(`[cloudinary-api][${requestId}] File ${index + 1} uploaded successfully`, { public_id: result.public_id });

      uploads.push({
        url: result.secure_url || result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      });
    }

    console.log(`[cloudinary-api][${requestId}] All files processed. Returning success.`, { count: uploads.length });
    return NextResponse.json({ uploads });
  } catch (error) {
    console.error(`[cloudinary-api][${requestId}] POST failure:`, { error: error.message, stack: error.stack });
    return NextResponse.json(
      { error: error.message || "Unable to upload images to Cloudinary." },
      { status: 400 }
    );
  }
}
