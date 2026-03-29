"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { resizeImage, getImageDimensions } from "@/lib/image";
import {
  FileDown,
  Image as ImageIcon,
  Info,
  Maximize,
  RotateCw,
  Shield,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";

type ResizeTab = "size" | "percentage" | "social";
type ExportFormat = "original" | "jpg" | "png" | "webp";
type SizeUnit = "kb" | "mb";

interface Preset {
  name: string;
  width: number;
  height: number;
}

const SOCIAL_PRESETS: Preset[] = [
  { name: "Instagram Post", width: 1080, height: 1080 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Facebook Cover", width: 820, height: 312 },
  { name: "Facebook Post", width: 1200, height: 630 },
  { name: "Twitter Post", width: 1200, height: 675 },
  { name: "LinkedIn Banner", width: 1584, height: 396 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
  { name: "Pinterest Pin", width: 1000, height: 1500 },
  { name: "TikTok Video", width: 1080, height: 1920 },
];

const DEFAULT_PRESET = SOCIAL_PRESETS[0].name;

export default function ResizeImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [activeTab, setActiveTab] = useState<ResizeTab>("size");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percentage, setPercentage] = useState(100);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [targetFileSize, setTargetFileSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>("kb");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("original");
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESET);
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (resultPreviewUrl) {
        URL.revokeObjectURL(resultPreviewUrl);
      }
    };
  }, [previewUrl, resultPreviewUrl]);

  const calculateDimensions = useCallback(() => {
    if (activeTab === "percentage" && originalDimensions.width > 0) {
      return {
        width: Math.max(1, Math.round(originalDimensions.width * (percentage / 100))),
        height: Math.max(1, Math.round(originalDimensions.height * (percentage / 100))),
      };
    }

    if (activeTab === "social") {
      const preset = SOCIAL_PRESETS.find((item) => item.name === selectedPreset);
      if (preset) {
        return { width: preset.width, height: preset.height };
      }
    }

    const parsedWidth = Number.parseInt(width, 10);
    const parsedHeight = Number.parseInt(height, 10);

    return {
      width:
        Number.isFinite(parsedWidth) && parsedWidth > 0
          ? parsedWidth
          : originalDimensions.width,
      height:
        Number.isFinite(parsedHeight) && parsedHeight > 0
          ? parsedHeight
          : originalDimensions.height,
    };
  }, [activeTab, height, originalDimensions.height, originalDimensions.width, percentage, selectedPreset, width]);

  const newDimensions = useMemo(() => calculateDimensions(), [calculateDimensions]);

  const isValidDimensions =
    Number.isFinite(newDimensions.width) &&
    Number.isFinite(newDimensions.height) &&
    newDimensions.width > 0 &&
    newDimensions.height > 0 &&
    newDimensions.width <= 12000 &&
    newDimensions.height <= 12000;

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setStatus("idle");
    setResult(null);
    setError(null);
    setRotation(0);

    setResultPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return null;
    });

    setPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return URL.createObjectURL(selectedFile);
    });

    setFile(selectedFile);

    try {
      const dimensions = await getImageDimensions(selectedFile);
      setOriginalDimensions(dimensions);
      setWidth(dimensions.width.toString());
      setHeight(dimensions.height.toString());
      setActiveTab("size");
    } catch (caughtError) {
      console.error("Failed to read image dimensions:", caughtError);
      setError("We could not read this image. Please try another file.");
      setFile(null);
    }
  }, []);

  const handleWidthChange = (newWidth: string) => {
    setWidth(newWidth);

    if (!maintainRatio || originalDimensions.width <= 0 || !newWidth) {
      return;
    }

    const numericWidth = Number.parseInt(newWidth, 10);
    if (!Number.isFinite(numericWidth) || numericWidth <= 0) {
      return;
    }

    const ratio = originalDimensions.height / originalDimensions.width;
    setHeight(Math.max(1, Math.round(numericWidth * ratio)).toString());
  };

  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);

    if (!maintainRatio || originalDimensions.height <= 0 || !newHeight) {
      return;
    }

    const numericHeight = Number.parseInt(newHeight, 10);
    if (!Number.isFinite(numericHeight) || numericHeight <= 0) {
      return;
    }

    const ratio = originalDimensions.width / originalDimensions.height;
    setWidth(Math.max(1, Math.round(numericHeight * ratio)).toString());
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (resultPreviewUrl) {
      URL.revokeObjectURL(resultPreviewUrl);
    }

    setFile(null);
    setPreviewUrl(null);
    setResultPreviewUrl(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    setOriginalDimensions({ width: 0, height: 0 });
    setWidth("");
    setHeight("");
    setPercentage(100);
    setTargetFileSize("");
    setExportFormat("original");
    setRotation(0);
    setSelectedPreset(DEFAULT_PRESET);
    setActiveTab("size");
  };

  const handleExport = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    if (!isValidDimensions) {
      setError("Please provide valid dimensions between 1 and 12000 pixels.");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      let quality = 0.92;
      const sizeValue = Number.parseFloat(targetFileSize);

      if (sizeValue > 0 && exportFormat !== "png") {
        const targetBytes = sizeValue * (sizeUnit === "kb" ? 1024 : 1024 * 1024);
        quality = Math.min(0.95, Math.max(0.15, targetBytes / file.size));
      }

      const resizedBlob = await resizeImage(file, newDimensions.width, newDimensions.height, {
        maintainAspectRatio: activeTab === "social" ? false : maintainRatio,
        quality,
        format: exportFormat === "original" ? undefined : exportFormat,
        rotation,
      });

      setResult(resizedBlob);
      setResultPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return URL.createObjectURL(resizedBlob);
      });
      setStatus("done");
    } catch (caughtError) {
      console.error("Failed to resize image:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Image resize failed. Please try again."
      );
      setStatus("error");
    }
  };

  const getOutputFilename = () => {
    if (!file) {
      return "resized-image.jpg";
    }

    const base = file.name.split(".").slice(0, -1).join(".") || "image";
    const originalExt = file.name.split(".").pop() || "jpg";
    const ext = exportFormat === "original" ? originalExt : exportFormat;
    return `${base}-${newDimensions.width}x${newDimensions.height}.${ext}`;
  };

  const activePreview = resultPreviewUrl ?? previewUrl;

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images by exact dimensions, percentage, or social presets. Upload instantly and export in JPG, PNG, or WEBP with full browser-side privacy."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "Image to Base64", href: "/image-to-base64/" },
      ]}
      howToSteps={[
        { name: "Upload an Image", text: "Drag your image into the upload area or click to browse." },
        { name: "Choose Resize Mode", text: "Set custom width/height, use percentage scaling, or pick a social media preset." },
        { name: "Adjust Export", text: "Select output format and optional target size for JPG/WEBP." },
        { name: "Download", text: "Click Export and download your resized image instantly." },
      ]}
      faqs={[
        {
          question: "Are my images uploaded to your server?",
          answer:
            "No. All resizing happens locally in your browser. Your image files do not leave your device.",
        },
        {
          question: "Will resizing reduce quality?",
          answer:
            "Reducing dimensions usually keeps visual quality high. Increasing dimensions can make images look softer because pixels are interpolated.",
        },
        {
          question: "Which output formats are supported?",
          answer:
            "You can keep the original format or export as JPG, PNG, or WEBP.",
        },
      ]}
      content={
        <>
          <h2>Resize Images Online with Precision</h2>
          <p>
            This image resizer supports custom dimensions, percentage scaling, and social-media presets. It is optimized for speed, clean output, and privacy-first browser processing.
          </p>
          <h2>Why Use This Image Resizer?</h2>
          <ul>
            <li>Fast image upload and instant local processing</li>
            <li>Aspect ratio lock for distortion-free resizing</li>
            <li>Preset dimensions for common social media platforms</li>
            <li>JPG, PNG, and WEBP export options</li>
            <li>Optional target size control for lighter files</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Shield, title: "100% Private", subtitle: "Local processing" },
            { icon: Zap, title: "Fast", subtitle: "Instant preview" },
            { icon: Maximize, title: "Flexible", subtitle: "Custom + presets" },
            { icon: FileDown, title: "Free", subtitle: "No watermark" },
          ].map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{title}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            </div>
          ))}
        </div>

        {!file ? (
          <div className="space-y-3">
            <FileDropzone
              accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp"
              maxSize={40}
              onFileSelect={handleFileSelect}
              description="Upload JPG, PNG, WEBP, GIF, or BMP (up to 40MB)"
            />
            {error && <ProcessingStatus status="error" message={error} />}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Uploaded Image</h3>
                  <button
                    onClick={handleReset}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {originalDimensions.width} × {originalDimensions.height} px
                </p>
                <button
                  onClick={() => document.getElementById("replace-image-input")?.click()}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Replace Image
                </button>
                <input
                  id="replace-image-input"
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                      handleFileSelect(Array.from(event.target.files));
                    }
                  }}
                />
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Resize Mode</h3>
                <div className="mb-4 grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
                  {[
                    { id: "size" as const, label: "Size" },
                    { id: "percentage" as const, label: "%" },
                    { id: "social" as const, label: "Social" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-background text-foreground shadow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "size" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Width (px)</label>
                        <input
                          type="number"
                          min={1}
                          value={width}
                          onChange={(event) => handleWidthChange(event.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Height (px)</label>
                        <input
                          type="number"
                          min={1}
                          value={height}
                          onChange={(event) => handleHeightChange(event.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={maintainRatio}
                        onChange={(event) => setMaintainRatio(event.target.checked)}
                        className="h-4 w-4 rounded border-border bg-background text-primary"
                      />
                      Lock aspect ratio
                    </label>
                  </div>
                )}

                {activeTab === "percentage" && (
                  <div className="space-y-2">
                    <label className="block text-xs text-muted-foreground">
                      Scale: <span className="font-medium text-foreground">{percentage}%</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={300}
                      value={percentage}
                      onChange={(event) => setPercentage(Number.parseInt(event.target.value, 10))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Output: {newDimensions.width} × {newDimensions.height} px
                    </p>
                  </div>
                )}

                {activeTab === "social" && (
                  <div className="space-y-2">
                    <label className="block text-xs text-muted-foreground">Preset</label>
                    <select
                      value={selectedPreset}
                      onChange={(event) => setSelectedPreset(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      {SOCIAL_PRESETS.map((preset) => (
                        <option key={preset.name} value={preset.name}>
                          {preset.name} ({preset.width}×{preset.height})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Export Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Output Format</label>
                    <select
                      value={exportFormat}
                      onChange={(event) => setExportFormat(event.target.value as ExportFormat)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="original">Original</option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WEBP</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Target Size (optional)</label>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <input
                        type="number"
                        min={0}
                        value={targetFileSize}
                        onChange={(event) => setTargetFileSize(event.target.value)}
                        placeholder="e.g. 250"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      <select
                        value={sizeUnit}
                        onChange={(event) => setSizeUnit(event.target.value as SizeUnit)}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                      >
                        <option value="kb">KB</option>
                        <option value="mb">MB</option>
                      </select>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Best for JPG/WEBP export.</p>
                  </div>

                  <button
                    onClick={() => setRotation((previous) => (previous + 90) % 360)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    Rotate 90°
                  </button>
                </div>
              </div>

              {status !== "done" ? (
                <button
                  onClick={handleExport}
                  disabled={status === "processing" || !isValidDimensions}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "processing" ? "Resizing..." : "Export Resized Image"}
                </button>
              ) : (
                <div className="space-y-2">
                  <DownloadButton blob={result!} filename={getOutputFilename()} className="w-full" size="lg">
                    Download Image
                  </DownloadButton>
                  <button
                    onClick={handleReset}
                    className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Resize Another Image
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {status === "done" ? "Result Preview" : "Original Preview"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{rotation}° rotation</span>
                </div>

                <div className="flex min-h-[360px] items-center justify-center bg-background p-4 dark:bg-muted/20">
                  {activePreview ? (
                    <img
                      src={activePreview}
                      alt="Resized image preview"
                      className="max-h-[330px] w-auto max-w-full rounded-lg border border-border object-contain"
                      style={{ transform: status === "done" ? undefined : `rotate(${rotation}deg)` }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">Preview unavailable.</p>
                  )}
                </div>

                <div className="border-t border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border bg-background px-2 py-1">
                      Original: {originalDimensions.width} × {originalDimensions.height}
                    </span>
                    <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-primary">
                      New: {newDimensions.width} × {newDimensions.height}
                    </span>
                    {result && (
                      <span className="rounded-md border border-border bg-background px-2 py-1">
                        Output: {(result.size / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {status === "error" && error && <ProcessingStatus status="error" message={error} />}

              {status === "done" && result && (
                <ProcessingStatus
                  status="done"
                  message={`Image resized successfully to ${newDimensions.width} × ${newDimensions.height} pixels.`}
                />
              )}

              {!isValidDimensions && (
                <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4" />
                    <p>Please keep width and height between 1 and 12000 pixels.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
