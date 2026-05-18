export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 8;

export function validateImageFile(file) {
  if (!file) {
    throw new Error("Please select an image to upload.");
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, JPEG, PNG, and WEBP images are allowed.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }
}

export function validateImageFiles(files) {
  const imageFiles = Array.from(files || []);

  if (imageFiles.length === 0) {
    throw new Error("Please choose at least one image before listing the product.");
  }

  if (imageFiles.length > MAX_PRODUCT_IMAGES) {
    throw new Error(`Please upload ${MAX_PRODUCT_IMAGES} images or fewer per product.`);
  }

  imageFiles.forEach((file) => validateImageFile(file));
  return imageFiles;
}

function parseUploadError(responseText, fallbackMessage) {
  try {
    const data = JSON.parse(responseText);
    return data.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function parseUploadResponse(responseText) {
  try {
    return JSON.parse(responseText || "{}");
  } catch {
    return {};
  }
}

export async function uploadProductImages(files, onProgress) {
  const imageFiles = validateImageFiles(files);
  const formData = new FormData();

  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  console.log("[product-upload] upload start", {
    fileCount: imageFiles.length,
    totalBytes: imageFiles.reduce((total, file) => total + file.size, 0),
  });

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", "/api/cloudinary/upload");
    request.timeout = 120000;

    request.upload.onprogress = (event) => {
      if (typeof onProgress !== "function") {
        return;
      }

      if (event.lengthComputable) {
        onProgress({
          progress: Math.min(95, Math.round((event.loaded / event.total) * 95)),
          loaded: event.loaded,
          totalBytes: event.total,
          total: imageFiles.length,
        });
        return;
      }

      onProgress({
        progress: 35,
        loaded: event.loaded,
        totalBytes: null,
        total: imageFiles.length,
      });
    };

    request.onload = () => {
      const data = parseUploadResponse(request.responseText);

      if (request.status < 200 || request.status >= 300) {
        const message = data.error || parseUploadError(
          request.responseText,
          "Unable to upload images to Cloudinary.",
        );
        console.error("[product-upload] upload failure", {
          status: request.status,
          message,
          response: data,
        });
        reject(new Error(message));
        return;
      }

      if (!Array.isArray(data.uploads) || data.uploads.length === 0) {
        const message = "Cloudinary upload completed without returning image URLs.";
        console.error("[product-upload] upload failure", { message, response: data });
        reject(new Error(message));
        return;
      }

      if (typeof onProgress === "function") {
        onProgress({
          progress: 100,
          loaded: null,
          totalBytes: null,
          total: imageFiles.length,
        });
      }

      console.log("[product-upload] upload success", {
        uploads: data.uploads.map((upload) => ({
          publicId: upload.publicId,
          url: upload.url,
          bytes: upload.bytes,
        })),
      });
      resolve(data.uploads);
    };

    request.onerror = () => {
      const message = "Network error while uploading images to Cloudinary.";
      console.error("[product-upload] upload failure", { message });
      reject(new Error(message));
    };

    request.ontimeout = () => {
      const message = "Cloudinary upload timed out. Try smaller images or fewer files.";
      console.error("[product-upload] upload failure", { message });
      reject(new Error(message));
    };

    request.onabort = () => {
      const message = "Cloudinary upload was cancelled.";
      console.error("[product-upload] upload failure", { message });
      reject(new Error(message));
    };

    if (typeof onProgress === "function") {
      onProgress({
        progress: 1,
        loaded: 0,
        totalBytes: null,
        total: imageFiles.length,
      });
    }

    request.send(formData);
  });
}
