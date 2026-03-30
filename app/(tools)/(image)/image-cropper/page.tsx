"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { cropImage, getImageDimensions } from "@/lib/image";
import {
  Crop,
  Expand,
  Image as ImageIcon,
  Move,
  RefreshCcw,
  Replace,
  Shield,
  Sparkles,
  WandSparkles,
} from "lucide-react";

type OutputFormat = "original" | "jpg" | "png" | "webp";
type AspectPreset = "free" | "1:1" | "4:3" | "16:9" | "9:16";
type DragHandle = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Dimensions {
  width: number;
  height: number;
}

const DEFAULT_DIMS: Dimensions = { width: 0, height: 0 };
const MIN_CROP_SIZE = 20;

const ASPECT_MAP: Record<Exclude<AspectPreset, "free">, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
};

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function normalizeCrop(crop: CropArea, dims: Dimensions, aspectRatio?: number): CropArea {
  if (dims.width === 0 || dims.height === 0) {
    return crop;
  }

  let width = clamp(Math.round(crop.width), MIN_CROP_SIZE, dims.width);
  let height = clamp(Math.round(crop.height), MIN_CROP_SIZE, dims.height);

  if (aspectRatio) {
    const currentRatio = width / height;
    if (Math.abs(currentRatio - aspectRatio) > 0.01) {
      if (width / aspectRatio <= dims.height) {
        height = Math.round(width / aspectRatio);
      } else {
        width = Math.round(height * aspectRatio);
      }
    }
  }

  const x = clamp(Math.round(crop.x), 0, dims.width - width);
  const y = clamp(Math.round(crop.y), 0, dims.height - height);

  return { x, y, width, height };
}

function centeredInitialCrop(dims: Dimensions): CropArea {
  const width = Math.max(MIN_CROP_SIZE, Math.floor(dims.width * 0.8));
  const height = Math.max(MIN_CROP_SIZE, Math.floor(dims.height * 0.8));
  const x = Math.floor((dims.width - width) / 2);
  const y = Math.floor((dims.height - height) / 2);
  return { x, y, width, height };
}

function getSafeOutputMime(file: File): "image/jpeg" | "image/png" | "image/webp" {
  if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp") {
    return file.type;
  }
  return "image/png";
}

export default function ImageCropperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<Dimensions>(DEFAULT_DIMS);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>("free");
  const [format, setFormat] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState(92);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Interactive drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<DragHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const aspectRatio = aspectPreset === "free" ? undefined : ASPECT_MAP[aspectPreset];

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [previewUrl, resultUrl]);

  const handleFileSelect = useCallback(async (files: File[]) => {
    const selected = files[0];
    if (!selected || !selected.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setStatus("idle");
    setError(null);
    setResultBlob(null);
    setAspectPreset("free");

    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });

    setFile(selected);

    try {
      const dims = await getImageDimensions(selected);
      setOriginalDimensions(dims);
      setCrop(centeredInitialCrop(dims));
    } catch (caughtError) {
      console.error("Failed to read image dimensions:", caughtError);
      setError("We could not load this image. Please try another file.");
      setFile(null);
      setOriginalDimensions(DEFAULT_DIMS);
    }
  }, []);

  const updateCrop = useCallback(
    (next: CropArea) => {
      setCrop(normalizeCrop(next, originalDimensions, aspectRatio));
    },
    [originalDimensions, aspectRatio]
  );

  const setCropField = (field: keyof CropArea, value: number) => {
    if (!Number.isFinite(value)) return;

    const rounded = Math.max(0, Math.round(value));
    const proposed = { ...crop, [field]: rounded };

    if (aspectPreset !== "free" && (field === "width" || field === "height")) {
      const ratio = ASPECT_MAP[aspectPreset];
      if (field === "width") {
        proposed.height = Math.max(MIN_CROP_SIZE, Math.round(rounded / ratio));
      } else {
        proposed.width = Math.max(MIN_CROP_SIZE, Math.round(rounded * ratio));
      }
    }

    updateCrop(proposed);
  };

  const applyAspectPreset = (preset: AspectPreset) => {
    setAspectPreset(preset);
    if (preset === "free" || originalDimensions.width === 0) {
      return;
    }

    const ratio = ASPECT_MAP[preset];
    let width = crop.width;
    let height = Math.round(width / ratio);

    if (height > originalDimensions.height) {
      height = originalDimensions.height;
      width = Math.round(height * ratio);
    }

    if (width > originalDimensions.width) {
      width = originalDimensions.width;
      height = Math.round(width / ratio);
    }

    const centerX = crop.x + crop.width / 2;
    const centerY = crop.y + crop.height / 2;

    updateCrop({
      x: Math.round(centerX - width / 2),
      y: Math.round(centerY - height / 2),
      width,
      height,
    });
  };

  const centerCrop = () => {
    updateCrop({
      ...crop,
      x: Math.round((originalDimensions.width - crop.width) / 2),
      y: Math.round((originalDimensions.height - crop.height) / 2),
    });
  };

  const resetToFullImage = () => {
    updateCrop({
      x: 0,
      y: 0,
      width: originalDimensions.width,
      height: originalDimensions.height,
    });
    setAspectPreset("free");
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setOriginalDimensions(DEFAULT_DIMS);
    setCrop({ x: 0, y: 0, width: 0, height: 0 });
    setAspectPreset("free");
    setFormat("original");
    setQuality(92);
    setStatus("idle");
    setError(null);
  };

  const outputName = useMemo(() => {
    if (!file) return "cropped-image.png";
    const base = file.name.split(".").slice(0, -1).join(".") || "image";
    const originalExt = file.name.split(".").pop() || "png";
    const ext = format === "original" ? originalExt : format;
    return `${base}-cropped-${crop.width}x${crop.height}.${ext}`;
  }, [crop.height, crop.width, file, format]);

  // Calculate preview dimensions to fit container while maintaining aspect ratio
  const previewScale = useMemo(() => {
    if (originalDimensions.width === 0 || originalDimensions.height === 0) return 1;
    const maxWidth = 600;
    const maxHeight = 450;
    return Math.min(1, maxWidth / originalDimensions.width, maxHeight / originalDimensions.height);
  }, [originalDimensions.height, originalDimensions.width]);

  const previewSize = useMemo(
    () => ({
      width: Math.max(1, Math.round(originalDimensions.width * previewScale)),
      height: Math.max(1, Math.round(originalDimensions.height * previewScale)),
    }),
    [originalDimensions.height, originalDimensions.width, previewScale]
  );

  // Convert crop coordinates to preview percentages for overlay positioning
  const overlayStyle = useMemo(() => {
    if (originalDimensions.width === 0) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    return {
      left: (crop.x / originalDimensions.width) * previewSize.width,
      top: (crop.y / originalDimensions.height) * previewSize.height,
      width: (crop.width / originalDimensions.width) * previewSize.width,
      height: (crop.height / originalDimensions.height) * previewSize.height,
    };
  }, [crop, originalDimensions, previewSize]);

  // Handle mouse/touch events for interactive cropping
  const getEventPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!previewContainerRef.current) return { x: 0, y: 0 };
    const rect = previewContainerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, handle: DragHandle) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getEventPosition(e);
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart(pos);
    setCropStart({ ...crop });
  }, [crop, getEventPosition]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragHandle) return;

    const pos = getEventPosition(e);
    const deltaX = (pos.x - dragStart.x) / previewScale;
    const deltaY = (pos.y - dragStart.y) / previewScale;

    let newCrop = { ...cropStart };

    if (dragHandle === "move") {
      newCrop.x = cropStart.x + deltaX;
      newCrop.y = cropStart.y + deltaY;
    } else {
      // Resize handles
      const ratio = aspectRatio;

      if (dragHandle.includes("w")) {
        const newX = cropStart.x + deltaX;
        const newWidth = cropStart.width - deltaX;
        if (newWidth >= MIN_CROP_SIZE) {
          newCrop.x = newX;
          newCrop.width = newWidth;
          if (ratio) newCrop.height = newWidth / ratio;
        }
      }
      if (dragHandle.includes("e")) {
        const newWidth = cropStart.width + deltaX;
        if (newWidth >= MIN_CROP_SIZE) {
          newCrop.width = newWidth;
          if (ratio) newCrop.height = newWidth / ratio;
        }
      }
      if (dragHandle.includes("n")) {
        if (ratio) {
          // For locked ratio, compute from width change
          const newHeight = cropStart.height - deltaY;
          if (newHeight >= MIN_CROP_SIZE) {
            const newWidth = newHeight * ratio;
            newCrop.y = cropStart.y + deltaY;
            newCrop.height = newHeight;
            newCrop.width = newWidth;
          }
        } else {
          const newY = cropStart.y + deltaY;
          const newHeight = cropStart.height - deltaY;
          if (newHeight >= MIN_CROP_SIZE) {
            newCrop.y = newY;
            newCrop.height = newHeight;
          }
        }
      }
      if (dragHandle.includes("s")) {
        if (ratio) {
          const newHeight = cropStart.height + deltaY;
          if (newHeight >= MIN_CROP_SIZE) {
            newCrop.height = newHeight;
            newCrop.width = newHeight * ratio;
          }
        } else {
          const newHeight = cropStart.height + deltaY;
          if (newHeight >= MIN_CROP_SIZE) {
            newCrop.height = newHeight;
          }
        }
      }
    }

    updateCrop(newCrop);
  }, [isDragging, dragHandle, dragStart, cropStart, previewScale, aspectRatio, updateCrop, getEventPosition]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  // Global mouse/touch event listeners for drag operations
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e as unknown as React.MouseEvent);
    };
    const handleTouchMove = (e: TouchEvent) => {
      handleDragMove(e as unknown as React.TouchEvent);
    };
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const runCrop = async () => {
    if (!file) {
      setError("Upload an image to begin cropping.");
      return;
    }

    if (crop.width < 1 || crop.height < 1) {
      setError("Crop size must be at least 1x1 pixel.");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      const outputFormat =
        format === "original"
          ? getSafeOutputMime(file)
          : format === "jpg"
            ? "image/jpeg"
            : format === "png"
              ? "image/png"
              : "image/webp";

      const blob = await cropImage(file, crop, {
        quality: quality / 100,
        outputFormat,
      });

      setResultBlob(blob);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setStatus("done");
    } catch (caughtError) {
      console.error("Cropping failed:", caughtError);
      setError(caughtError instanceof Error ? caughtError.message : "Image crop failed.");
      setStatus("error");
    }
  };

  // Handle cursor style based on drag handle
  const getCursorStyle = (handle: DragHandle): string => {
    switch (handle) {
      case "move": return "cursor-move";
      case "nw": case "se": return "cursor-nwse-resize";
      case "ne": case "sw": return "cursor-nesw-resize";
      case "n": case "s": return "cursor-ns-resize";
      case "e": case "w": return "cursor-ew-resize";
      default: return "cursor-default";
    }
  };

  return (
    <ToolLayout
      title="Image Cropper"
      description="Crop JPG, PNG, and WEBP images with precise pixel controls, smart aspect ratios, and secure browser-based processing. No uploads to servers."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image Resizer", href: "/image-resizer/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "QR Code Generator", href: "/qr-code-generator/" },
      ]}
      howToSteps={[
        { name: "Upload Image", text: "Add your image and load its dimensions instantly." },
        { name: "Set Crop Area", text: "Adjust x, y, width, height, and aspect ratio for your target output." },
        { name: "Export", text: "Generate a cropped image in original format, JPG, PNG, or WEBP." },
      ]}
      faqs={[
        {
          question: "Does this image cropper upload files to a server?",
          answer:
            "No. Cropping runs fully in your browser using local processing, so your image does not need to leave your device.",
        },
        {
          question: "Can I keep the original image format?",
          answer:
            "Yes. Choose Original format to export in the source file type when supported, or switch to JPG, PNG, or WEBP.",
        },
        {
          question: "Will cropping reduce quality?",
          answer:
            "Cropping removes unused pixels but does not have to degrade quality. For lossy formats like JPG/WEBP, keep quality near 90-100 for minimal loss.",
        },
        {
          question: "What is the best aspect ratio for social media?",
          answer:
            "Common options are 1:1 for profile-style posts, 4:3 for balanced visuals, and 16:9 for landscape thumbnails or video-first content.",
        },
      ]}
      content={
        <>
          <h2>Why a Dedicated Image Cropper Is Essential for Modern Content Workflows</h2>
          <p>
            Cropping sounds simple, but it has a direct effect on clarity, branding, conversion, and technical performance. A strong image cropper does more than cut pixels. It helps teams shape visual focus, align creative assets to platform standards, and prepare media that feels intentional instead of accidental. Whether you are running an e-commerce catalog, publishing educational resources, building social campaigns, or preparing UI assets for product development, precise cropping is one of the fastest ways to improve visual quality without expensive software.
          </p>
          <p>
            The most common issue with images on websites is not low resolution. It is poor composition. Important details can sit too close to edges, text overlays may hide key subjects, and hero banners can lose meaning when resized across breakpoints. By choosing exact crop coordinates and target dimensions, you protect the focal point before the image ever reaches your page template. That means cleaner thumbnails, stronger first impressions, and fewer layout problems on mobile screens.
          </p>

          <h2>How Smart Cropping Supports SEO and Better User Experience</h2>
          <p>
            Search engines evaluate user behavior, and user behavior is heavily influenced by visual trust. Pages with properly framed media tend to feel more professional, easier to scan, and more relevant to search intent. Cropped images also help maintain consistent dimensions, which reduces visual jumping in grids and cards. Consistency improves perceived quality and supports faster decision-making for users comparing products, articles, or tools.
          </p>
          <p>
            Cropping can also reduce file payload when it removes unnecessary background space. Smaller assets improve Core Web Vitals, especially on mobile networks. Faster paint times can contribute to improved engagement and stronger rankings over time. In practical terms, a focused crop helps users understand content instantly while giving your page performance a meaningful boost.
          </p>

          <h2>Best Practices for Professional Cropping</h2>
          <p>
            Start by defining the destination of the image. A blog hero, a product listing thumbnail, and an ad creative each need different framing. Next, choose an aspect ratio that matches the placement context. Square crops often work well for product catalogs and social feeds. Landscape ratios like 16:9 fit video covers and header banners. Vertical ratios can improve results for story-driven channels. After selecting ratio and size, center the crop around the subject, not around the original image boundaries.
          </p>
          <p>
            For images that contain people, keep eyes and facial expressions in the upper-middle region whenever possible. For product photos, prioritize the object silhouette and leave enough breathing room around edges to avoid cramped composition. For screenshots and UI visuals, ensure critical labels remain fully visible after cropping. Finally, export using a suitable format. JPG is ideal for photos, PNG for transparency-focused graphics, and WEBP for balanced quality and file efficiency.
          </p>

          <h2>Who Benefits Most from an Online Crop Tool</h2>
          <p>
            Content marketers use cropping to match campaign dimensions without waiting on design queues. Students and educators crop diagrams and references to keep presentations concise and focused. Developers prepare visual assets for cards, docs, and changelog previews. Freelancers and agencies rely on rapid browser tools to standardize client deliverables. Ecommerce teams crop product photos into uniform templates that increase trust and reduce bounce rates in catalog pages.
          </p>
          <p>
            A browser-based cropper is especially useful when you need speed and privacy. You do not have to upload files to remote servers or install desktop software. You can make adjustments immediately, compare versions, and export production-ready assets in seconds.
          </p>

          <h2>Practical Cropping Workflow You Can Reuse</h2>
          <ol>
            <li>Upload the original image and review current dimensions.</li>
            <li>Select an aspect preset based on where the image will be published.</li>
            <li>Set crop width and height, then fine-tune x/y positioning.</li>
            <li>Center the crop or reset to full frame when needed.</li>
            <li>Export in the best format and quality for your target channel.</li>
            <li>Reuse the same crop strategy across similar assets for consistent branding.</li>
          </ol>
          <p>
            Consistent cropping is one of those small habits that compound over time. It improves visual systems, supports SEO performance through cleaner page experience, and helps your content look professionally produced across light and dark themes, desktop and mobile layouts, and every channel where your brand appears.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/12 via-background to-emerald-500/10 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <WandSparkles className="h-5 w-5 text-primary" />
                Precision Crop Workspace
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Fine-tune crop coordinates, lock aspect ratios, and export clean assets with client-side privacy.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" />
              Private Browser Processing
            </div>
          </div>
        </div>

        {!file && (
          <FileDropzone
            accept=".jpg,.jpeg,.png,.webp,.gif,.bmp"
            maxSize={25}
            onFileSelect={handleFileSelect}
            description="Upload image files (JPG, PNG, WEBP, GIF, BMP)"
          />
        )}

        {file && previewUrl && (
          <>
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Crop Preview
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => replaceInputRef.current?.click()}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Replace className="h-4 w-4" />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </div>

                <input
                  ref={replaceInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.bmp"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files ? Array.from(event.target.files) : [];
                    if (selected.length > 0) {
                      void handleFileSelect(selected);
                    }
                    event.target.value = "";
                  }}
                />

                {/* Interactive Crop Preview */}
                <div className="flex min-h-[350px] items-center justify-center overflow-auto rounded-xl border border-border bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_50%/16px_16px] p-4 dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)_50%/16px_16px]">
                  <div
                    ref={previewContainerRef}
                    className={`relative select-none ${isDragging ? getCursorStyle(dragHandle) : ""}`}
                    style={{ width: previewSize.width, height: previewSize.height }}
                  >
                    <img
                      src={previewUrl}
                      alt="Original uploaded image"
                      style={{ width: previewSize.width, height: previewSize.height }}
                      className="rounded-lg border border-border object-cover"
                      draggable={false}
                    />

                    {/* Dark overlay outside crop area */}
                    <div 
                      className="pointer-events-none absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(to right, 
                          rgba(0,0,0,0.5) 0%, 
                          rgba(0,0,0,0.5) ${(crop.x / originalDimensions.width) * 100}%, 
                          transparent ${(crop.x / originalDimensions.width) * 100}%, 
                          transparent ${((crop.x + crop.width) / originalDimensions.width) * 100}%, 
                          rgba(0,0,0,0.5) ${((crop.x + crop.width) / originalDimensions.width) * 100}%, 
                          rgba(0,0,0,0.5) 100%
                        )`,
                      }}
                    />
                    <div 
                      className="pointer-events-none absolute rounded-lg"
                      style={{
                        left: `${(crop.x / originalDimensions.width) * 100}%`,
                        top: 0,
                        width: `${(crop.width / originalDimensions.width) * 100}%`,
                        height: `${(crop.y / originalDimensions.height) * 100}%`,
                        background: "rgba(0,0,0,0.5)",
                      }}
                    />
                    <div 
                      className="pointer-events-none absolute rounded-lg"
                      style={{
                        left: `${(crop.x / originalDimensions.width) * 100}%`,
                        top: `${((crop.y + crop.height) / originalDimensions.height) * 100}%`,
                        width: `${(crop.width / originalDimensions.width) * 100}%`,
                        height: `${((originalDimensions.height - crop.y - crop.height) / originalDimensions.height) * 100}%`,
                        background: "rgba(0,0,0,0.5)",
                      }}
                    />

                    {/* Crop Selection Box - Draggable */}
                    <div
                      className="absolute border-2 border-white/90 cursor-move"
                      style={{
                        left: overlayStyle.left,
                        top: overlayStyle.top,
                        width: overlayStyle.width,
                        height: overlayStyle.height,
                      }}
                      onMouseDown={(e) => handleDragStart(e, "move")}
                      onTouchStart={(e) => handleDragStart(e, "move")}
                    >
                      {/* Grid lines */}
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute left-1/3 top-0 h-full w-px bg-white/40" />
                        <div className="absolute left-2/3 top-0 h-full w-px bg-white/40" />
                        <div className="absolute left-0 top-1/3 h-px w-full bg-white/40" />
                        <div className="absolute left-0 top-2/3 h-px w-full bg-white/40" />
                      </div>

                      {/* Corner Handles */}
                      <div
                        className="absolute -left-2 -top-2 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-white bg-primary shadow-md"
                        onMouseDown={(e) => handleDragStart(e, "nw")}
                        onTouchStart={(e) => handleDragStart(e, "nw")}
                      />
                      <div
                        className="absolute -right-2 -top-2 h-4 w-4 cursor-nesw-resize rounded-sm border-2 border-white bg-primary shadow-md"
                        onMouseDown={(e) => handleDragStart(e, "ne")}
                        onTouchStart={(e) => handleDragStart(e, "ne")}
                      />
                      <div
                        className="absolute -bottom-2 -left-2 h-4 w-4 cursor-nesw-resize rounded-sm border-2 border-white bg-primary shadow-md"
                        onMouseDown={(e) => handleDragStart(e, "sw")}
                        onTouchStart={(e) => handleDragStart(e, "sw")}
                      />
                      <div
                        className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-white bg-primary shadow-md"
                        onMouseDown={(e) => handleDragStart(e, "se")}
                        onTouchStart={(e) => handleDragStart(e, "se")}
                      />

                      {/* Edge Handles */}
                      <div
                        className="absolute -top-1.5 left-1/2 h-3 w-8 -translate-x-1/2 cursor-ns-resize rounded-sm border border-white bg-primary/80"
                        onMouseDown={(e) => handleDragStart(e, "n")}
                        onTouchStart={(e) => handleDragStart(e, "n")}
                      />
                      <div
                        className="absolute -bottom-1.5 left-1/2 h-3 w-8 -translate-x-1/2 cursor-ns-resize rounded-sm border border-white bg-primary/80"
                        onMouseDown={(e) => handleDragStart(e, "s")}
                        onTouchStart={(e) => handleDragStart(e, "s")}
                      />
                      <div
                        className="absolute -left-1.5 top-1/2 h-8 w-3 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-primary/80"
                        onMouseDown={(e) => handleDragStart(e, "w")}
                        onTouchStart={(e) => handleDragStart(e, "w")}
                      />
                      <div
                        className="absolute -right-1.5 top-1/2 h-8 w-3 -translate-y-1/2 cursor-ew-resize rounded-sm border border-white bg-primary/80"
                        onMouseDown={(e) => handleDragStart(e, "e")}
                        onTouchStart={(e) => handleDragStart(e, "e")}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Original: {originalDimensions.width} × {originalDimensions.height}px</span>
                  <span className="font-medium text-primary">Crop: {crop.width} × {crop.height}px</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drag the crop area to move it. Drag corners or edges to resize.
                </p>
              </section>

              <section className="space-y-4">
                <div className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Crop className="h-5 w-5 text-primary" />
                    Crop Controls
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm text-muted-foreground">
                      X Position
                      <input
                        type="number"
                        min={0}
                        max={Math.max(0, originalDimensions.width - crop.width)}
                        value={crop.x}
                        onChange={(event) => setCropField("x", Number(event.target.value))}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-sm text-muted-foreground">
                      Y Position
                      <input
                        type="number"
                        min={0}
                        max={Math.max(0, originalDimensions.height - crop.height)}
                        value={crop.y}
                        onChange={(event) => setCropField("y", Number(event.target.value))}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-sm text-muted-foreground">
                      Width
                      <input
                        type="number"
                        min={1}
                        max={originalDimensions.width}
                        value={crop.width}
                        onChange={(event) => setCropField("width", Number(event.target.value))}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-sm text-muted-foreground">
                      Height
                      <input
                        type="number"
                        min={1}
                        max={originalDimensions.height}
                        value={crop.height}
                        onChange={(event) => setCropField("height", Number(event.target.value))}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block text-sm text-muted-foreground">
                    Aspect Ratio
                    <select
                      value={aspectPreset}
                      onChange={(event) => applyAspectPreset(event.target.value as AspectPreset)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="1:1">1:1 (Square)</option>
                      <option value="4:3">4:3</option>
                      <option value="16:9">16:9</option>
                      <option value="9:16">9:16 (Portrait)</option>
                    </select>
                  </label>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={centerCrop}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Move className="h-4 w-4" />
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={resetToFullImage}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Expand className="h-4 w-4" />
                      Full Image
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Export Settings
                  </h3>

                  <label className="block text-sm text-muted-foreground">
                    Output Format
                    <select
                      value={format}
                      onChange={(event) => setFormat(event.target.value as OutputFormat)}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="original">Original Format</option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WEBP</option>
                    </select>
                  </label>

                  <label className="mt-4 block text-sm text-muted-foreground">
                    Quality ({quality}%)
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={quality}
                      onChange={(event) => setQuality(Number(event.target.value))}
                      className="mt-2 w-full accent-primary"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => void runCrop()}
                    disabled={status === "processing"}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "processing" ? "Cropping..." : "Crop Image"}
                  </button>
                </div>
              </section>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {resultBlob && resultUrl && (
              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">Cropped Result</h3>
                  <DownloadButton blob={resultBlob} filename={outputName} />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr]">
                  <img
                    src={resultUrl}
                    alt="Cropped result preview"
                    className="h-48 w-full rounded-lg border border-border object-contain bg-muted/20"
                  />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Output size: <strong className="text-foreground">{crop.width} x {crop.height}px</strong>
                    </p>
                    <p>
                      File size: <strong className="text-foreground">{(resultBlob.size / 1024).toFixed(1)} KB</strong>
                    </p>
                    <p>
                      Format: <strong className="text-foreground">{format === "original" ? getSafeOutputMime(file) : format.toUpperCase()}</strong>
                    </p>
                    <p>
                      Your crop is ready. If you want a different composition, adjust the coordinates and crop again.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
