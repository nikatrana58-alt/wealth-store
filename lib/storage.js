export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

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

export function uploadProductImages(files, onProgress) {
  const formData = new FormData();

  files.forEach((file) => {
    validateImageFile(file);
    formData.append("images", file);
  });

  if (typeof onProgress === "function") {
    onProgress({ progress: 20, total: files.length });
  }

  return fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to upload images to Cloudinary.");
      }

      if (typeof onProgress === "function") {
        onProgress({ progress: 100, total: files.length });
      }

      return data.uploads;
    });
}
