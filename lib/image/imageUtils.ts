import imageCompression from "browser-image-compression";

export interface ImageCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
}

export interface ImageCompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
  fileType?: "image/jpeg" | "image/png" | "image/webp";
  preserveExif?: boolean;
}

/**
 * Compress an image using browser-image-compression
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<ImageCompressionResult> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    quality = 0.8,
    fileType,
    preserveExif = false,
  } = options;

  // Get original dimensions
  const originalDimensions = await getImageDimensions(file);

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: fileType || (file.type as "image/jpeg" | "image/png" | "image/webp"),
    initialQuality: quality,
    preserveExif,
  };

  const compressedFile = await imageCompression(file, compressionOptions);
  const blob = new Blob([compressedFile], { type: compressedFile.type });

  // Get new dimensions
  const newDimensions = await getImageDimensions(compressedFile);

  return {
    blob,
    originalSize: file.size,
    compressedSize: blob.size,
    originalDimensions,
    newDimensions,
  };
}

/**
 * Resize an image to specific dimensions
 */
export async function resizeImage(
  file: File,
  width: number,
  height: number,
  options: {
    maintainAspectRatio?: boolean;
    quality?: number;
    outputFormat?: "image/jpeg" | "image/png" | "image/webp";
    format?: "jpg" | "png" | "webp";
    rotation?: number;
  } = {}
): Promise<Blob> {
  const {
    maintainAspectRatio = true,
    quality = 0.9,
    format,
    rotation = 0,
  } = options;
  
  // Determine output format
  let outputFormat = options.outputFormat || (file.type as "image/jpeg" | "image/png" | "image/webp");
  if (format) {
    outputFormat = format === "jpg" ? "image/jpeg" : `image/${format}` as "image/jpeg" | "image/png" | "image/webp";
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let targetWidth = width;
      let targetHeight = height;

      if (maintainAspectRatio) {
        const aspectRatio = img.width / img.height;
        if (width / height > aspectRatio) {
          targetWidth = Math.round(height * aspectRatio);
        } else {
          targetHeight = Math.round(width / aspectRatio);
        }
      }

      // Handle rotation - swap dimensions for 90/270 degrees
      const isRotated = rotation === 90 || rotation === 270;
      const canvasWidth = isRotated ? targetHeight : targetWidth;
      const canvasHeight = isRotated ? targetWidth : targetHeight;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Use better quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // For JPEG, fill with white background (no transparency)
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply rotation if needed
      if (rotation !== 0) {
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
      } else {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(img.src);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        outputFormat,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert image to different format
 */
export async function convertImage(
  file: File,
  outputFormat: "image/jpeg" | "image/png" | "image/webp",
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // For JPEG, fill with white background (no transparency)
      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        outputFormat,
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Crop an image
 */
export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  options: {
    quality?: number;
    outputFormat?: "image/jpeg" | "image/png" | "image/webp";
  } = {}
): Promise<Blob> {
  const {
    quality = 0.9,
    outputFormat = file.type as "image/jpeg" | "image/png" | "image/webp",
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        outputFormat,
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Rotate an image
 */
export async function rotateImage(
  file: File,
  degrees: number,
  options: {
    quality?: number;
    outputFormat?: "image/jpeg" | "image/png" | "image/webp";
  } = {}
): Promise<Blob> {
  const {
    quality = 0.9,
    outputFormat = file.type as "image/jpeg" | "image/png" | "image/webp",
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const radians = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));

      const newWidth = Math.floor(img.width * cos + img.height * sin);
      const newHeight = Math.floor(img.width * sin + img.height * cos);

      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        outputFormat,
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get image dimensions from a file
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get image preview URL
 */
export function getImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Get file extension from mime type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mimeType] || "jpg";
}
