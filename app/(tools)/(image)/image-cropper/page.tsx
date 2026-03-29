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

function normalizeCrop(crop: CropArea, dims: Dimensions): CropArea {
  if (dims.width === 0 || dims.height === 0) {
    return crop;
  }

  const width = clamp(Math.round(crop.width), 1, dims.width);
  const height = clamp(Math.round(crop.height), 1, dims.height);
  const x = clamp(Math.round(crop.x), 0, dims.width - width);
  const y = clamp(Math.round(crop.y), 0, dims.height - height);

  return { x, y, width, height };
}

function centeredInitialCrop(dims: Dimensions): CropArea {
  const width = Math.max(1, Math.floor(dims.width * 0.8));
  const height = Math.max(1, Math.floor(dims.height * 0.8));
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
      setCrop(normalizeCrop(next, originalDimensions));
    },
    [originalDimensions]
  );

  const setCropField = (field: keyof CropArea, value: number) => {
    if (!Number.isFinite(value)) return;

    const rounded = Math.max(0, Math.round(value));
    const proposed = { ...crop, [field]: rounded };

    if (aspectPreset !== "free" && (field === "width" || field === "height")) {
      const ratio = ASPECT_MAP[aspectPreset];
      if (field === "width") {
        proposed.height = Math.max(1, Math.round(rounded / ratio));
      } else {
        proposed.width = Math.max(1, Math.round(rounded * ratio));
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

  const moveCrop = (direction: "left" | "right" | "up" | "down", amount: number) => {
    if (amount <= 0) return;
    const delta = Math.round(amount);

    if (direction === "left") updateCrop({ ...crop, x: crop.x - delta });
    if (direction === "right") updateCrop({ ...crop, x: crop.x + delta });
    if (direction === "up") updateCrop({ ...crop, y: crop.y - delta });
    if (direction === "down") updateCrop({ ...crop, y: crop.y + delta });
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

  const previewScale = useMemo(() => {
    if (originalDimensions.width === 0 || originalDimensions.height === 0) return 1;
    return Math.min(1, 720 / originalDimensions.width, 420 / originalDimensions.height);
  }, [originalDimensions.height, originalDimensions.width]);

  const previewSize = useMemo(
    () => ({
      width: Math.max(1, Math.round(originalDimensions.width * previewScale)),
      height: Math.max(1, Math.round(originalDimensions.height * previewScale)),
    }),
    [originalDimensions.height, originalDimensions.width, previewScale]
  );

  const overlayStyle = useMemo(() => {
    if (originalDimensions.width === 0) {
      return { left: "0%", top: "0%", width: "0%", height: "0%" };
    }

    return {
      left: `${(crop.x / originalDimensions.width) * 100}%`,
      top: `${(crop.y / originalDimensions.height) * 100}%`,
      width: `${(crop.width / originalDimensions.width) * 100}%`,
      height: `${(crop.height / originalDimensions.height) * 100}%`,
    };
  }, [crop.height, crop.width, crop.x, crop.y, originalDimensions.height, originalDimensions.width]);

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

                <div className="overflow-auto rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 p-4">
                  <div
                    className="relative mx-auto"
                    style={{ width: previewSize.width, height: previewSize.height }}
                  >
                    <img
                      src={previewUrl}
                      alt="Original uploaded image"
                      style={{ width: previewSize.width, height: previewSize.height }}
                      className="rounded-lg border border-border object-cover"
                    />

                    <div
                      className="pointer-events-none absolute border-2 border-primary bg-primary/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                      style={overlayStyle}
                    >
                      <div className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border border-white bg-primary" />
                      <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border border-white bg-primary" />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Original: {originalDimensions.width} x {originalDimensions.height}px | Crop: {crop.width} x {crop.height}px
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

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => moveCrop("left", Math.max(1, Math.round(crop.width * 0.05)))}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCrop("right", Math.max(1, Math.round(crop.width * 0.05)))}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      Right
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCrop("up", Math.max(1, Math.round(crop.height * 0.05)))}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCrop("down", Math.max(1, Math.round(crop.height * 0.05)))}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      Down
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
