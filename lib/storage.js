export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 8;

/**
 * Validates a single image file for type and size.
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error("No file provided for validation.");
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported image type: ${file.type}. Only JPG, JPEG, PNG, and WEBP are allowed.`);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Image is too large (${Math.round(file.size / 1024 / 1024)}MB). Max size is 5MB.`);
  }
  
  return true;
}

/**
 * Validates an array of image files.
 */
export function validateImageFiles(files) {
  const imageFiles = Array.from(files || []);

  if (imageFiles.length === 0) {
    throw new Error("Please choose at least one image before listing the product.");
  }

  if (imageFiles.length > MAX_PRODUCT_IMAGES) {
    throw new Error(`Maximum ${MAX_PRODUCT_IMAGES} images allowed. You selected ${imageFiles.length}.`);
  }

  imageFiles.forEach((file) => validateImageFile(file));
  return imageFiles;
}

/**
 * Parses the JSON response from the upload API safely.
 */
function parseUploadResponse(responseText) {
  try {
    return JSON.parse(responseText || "{}");
  } catch (err) {
    console.error("[lib/storage] Failed to parse upload response JSON", { err, responseText });
    return {};
  }
}

/**
 * Normalizes the raw Cloudinary upload data for client usage.
 */
function normalizeUploads(rawUploads) {
  if (!Array.isArray(rawUploads)) return [];

  return rawUploads.map((u, idx) => ({
    url: u.url || u.secure_url || u.secureUrl || null,
    secure_url: u.secure_url || u.url || null,
    publicId: u.publicId || u.public_id || null,
    public_id: u.public_id || u.publicId || null,
    width: u.width || null,
    height: u.height || null,
    format: u.format || null,
    bytes: u.bytes || u.size || null,
    _index: idx
  }));
}

/**
 * Uploads one or more product images to Cloudinary via our internal API route.
 * Uses XMLHttpRequest to track upload progress.
 */
export async function uploadProductImages(imageFiles, onProgress) {
  console.log("[lib/storage] uploadProductImages starting", { count: imageFiles.length });
  
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const request = new XMLHttpRequest();
    request.open("POST", "/api/cloudinary/upload");
    
    // Set a timeout of 120 seconds
    request.timeout = 120000;

    let isFinished = false;

    // Track state changes
    request.onreadystatechange = () => {
      console.log(`[lib/storage] XHR readyState: ${request.readyState}`);
    };

    // Track progress
    request.upload.onprogress = (event) => {
      if (isFinished) return;
      
      if (event.lengthComputable) {
        // Cap progress at 98% during upload to leave room for server-side processing
        const progress = Math.min(98, Math.round((event.loaded / event.total) * 100));
        console.log(`[lib/storage] upload progress: ${progress}%`, { loaded: event.loaded, total: event.total });
        
        if (typeof onProgress === "function") {
          onProgress({
            progress,
            loaded: event.loaded,
            totalBytes: event.total,
            total: imageFiles.length,
          });
        }
      } else {
        console.log("[lib/storage] upload progress: length not computable");
        if (typeof onProgress === "function") {
          onProgress({ progress: 50, total: imageFiles.length });
        }
      }
    };

    request.onload = () => {
      if (isFinished) return;
      isFinished = true;
      
      console.log("[lib/storage] XHR onload triggered", { 
        status: request.status, 
        statusText: request.statusText,
        responseType: request.responseType 
      });
      
      const data = parseUploadResponse(request.responseText);
      
      if (request.status >= 200 && request.status < 300) {
        const rawUploads = data.uploads || [];
        const normalized = normalizeUploads(rawUploads);
        
        console.log("[lib/storage] upload success", { count: normalized.length });
        
        if (typeof onProgress === "function") {
          onProgress({ progress: 100, total: imageFiles.length });
        }
        
        resolve(normalized);
      } else {
        const errorMsg = data.error || `Upload failed with status ${request.status} (${request.statusText})`;
        console.error("[lib/storage] upload server-side error", { status: request.status, error: errorMsg, response: data });
        reject(new Error(errorMsg));
      }
    };

    request.onerror = (err) => {
      if (isFinished) return;
      isFinished = true;
      console.error("[lib/storage] XHR network error", err);
      reject(new Error("Network error during image upload. Please check your connection."));
    };

    request.ontimeout = () => {
      if (isFinished) return;
      isFinished = true;
      console.error("[lib/storage] XHR timeout triggered after 120s");
      reject(new Error("Upload timed out. The images might be too large or the server is slow."));
    };

    request.onabort = () => {
      if (isFinished) return;
      isFinished = true;
      console.warn("[lib/storage] XHR upload aborted");
      reject(new Error("Upload was cancelled."));
    };

    console.log("[lib/storage] sending XHR request");
    request.send(formData);
  });
}
