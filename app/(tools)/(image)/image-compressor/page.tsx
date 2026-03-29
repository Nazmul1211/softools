"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import {
  ProcessingStatus,
  ProcessingProgress,
  ResultStats,
} from "@/components/tools/ProcessingStatus";
import { DownloadButton, DownloadAllButton } from "@/components/tools/DownloadButton";
import { compressImage, ImageCompressionResult } from "@/lib/image";
import { Image as ImageIcon, Settings2, Shield, Zap, HardDrive, FileDown } from "lucide-react";

interface ProcessedImage {
  file: File;
  result: ImageCompressionResult;
}

export default function CompressImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    setResults([]);
    setStatus("idle");
    setError(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setError(null);
    setProgress({ current: 0, total: files.length });
    setResults([]);

    const processedImages: ProcessedImage[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i, total: files.length });

        const result = await compressImage(file, {
          maxSizeMB,
          maxWidthOrHeight: maxWidth,
          quality: quality / 100,
        });

        processedImages.push({ file, result });
      }

      setResults(processedImages);
      setProgress({ current: files.length, total: files.length });
      setStatus("done");
    } catch (err) {
      console.error("Compression failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to compress images. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setStatus("idle");
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  const getTotalStats = () => {
    const original = results.reduce((sum, r) => sum + r.result.originalSize, 0);
    const compressed = results.reduce((sum, r) => sum + r.result.compressedSize, 0);
    return { original, compressed };
  };

  const downloadFiles = results.map((r) => ({
    blob: r.result.blob,
    filename: `compressed-${r.file.name}`,
  }));

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress JPG, PNG, and WebP images instantly without uploading to any server. Reduce file size while maintaining quality. 100% free and private."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image Resizer", href: "/image-resizer/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "PDF Compressor", href: "/pdf-compressor/" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-03-28"
      howToSteps={[
        {
          name: "Upload Images",
          text: "Drop your images or click to browse. Supports JPG, PNG, WebP, and GIF. Files stay in your browser.",
        },
        {
          name: "Adjust Settings",
          text: "Set compression quality (1-100), maximum dimensions, and target file size.",
        },
        {
          name: "Compress",
          text: "Click Compress button. Processing happens instantly in your browser using Web Workers.",
        },
        {
          name: "Download",
          text: "Download compressed images individually or all at once as a ZIP file.",
        },
      ]}
      faqs={[
        {
          question: "Are my images uploaded to a server?",
          answer:
            "No! All compression happens directly in your browser using JavaScript Web Workers. Your images never leave your device, ensuring 100% privacy.",
        },
        {
          question: "What image formats are supported?",
          answer:
            "We support JPG/JPEG, PNG, WebP, and GIF images. You can also convert between formats during compression.",
        },
        {
          question: "How much can I reduce my image size?",
          answer:
            "Typically 50-90% size reduction depending on the original image and quality settings. Photos with lots of details may compress more than simple graphics.",
        },
        {
          question: "Will compression affect image quality?",
          answer:
            "Some quality loss is normal with lossy compression. Use higher quality settings (70-90) for important images. For lossless compression, use PNG format.",
        },
        {
          question: "Can I compress multiple images at once?",
          answer:
            "Yes! You can upload and compress multiple images at once. Download them individually or all together as a ZIP file.",
        },
      ]}
      content={
        <>
          <h2>What is Image Compression?</h2>
          <p>
            Image compression reduces the file size of images by removing redundant
            data and optimizing how pixel information is stored. This makes images
            faster to load on websites, easier to share via email, and takes up
            less storage space.
          </p>

          <h2>How Does Our Image Compressor Work?</h2>
          <p>
            Our tool uses advanced browser-based compression with Web Workers for
            non-blocking performance. The process includes:
          </p>
          <ul>
            <li>
              <strong>Smart Quality Reduction:</strong> Removes imperceptible
              details while preserving visual quality
            </li>
            <li>
              <strong>Dimension Optimization:</strong> Optionally resize images to
              target dimensions
            </li>
            <li>
              <strong>Format Optimization:</strong> Uses optimal encoding for each
              format
            </li>
            <li>
              <strong>Metadata Handling:</strong> Optionally preserve or remove
              EXIF data
            </li>
          </ul>

          <h2>Compression Quality Guide</h2>
          <p>
            <strong>90-100%:</strong> Minimal compression, best quality. Use for
            professional photos and important images.
          </p>
          <p>
            <strong>70-89%:</strong> Balanced compression. Good for web images and
            social media sharing.
          </p>
          <p>
            <strong>50-69%:</strong> Higher compression. Suitable for thumbnails
            and preview images.
          </p>
          <p>
            <strong>Below 50%:</strong> Maximum compression. Quality loss will be
            visible. Use only when file size is critical.
          </p>

          <h2>When to Use Image Compression</h2>
          <ul>
            <li>Uploading images to websites and blogs</li>
            <li>Sending photos via email or messaging apps</li>
            <li>Optimizing images for social media</li>
            <li>Reducing storage usage on your device</li>
            <li>Improving website loading speed</li>
          </ul>

          <h2>JPEG vs PNG vs WebP</h2>
          <p>
            <strong>JPEG:</strong> Best for photographs and complex images with
            many colors. Lossy compression. Smallest file size for photos.
          </p>
          <p>
            <strong>PNG:</strong> Best for graphics, logos, and images requiring
            transparency. Lossless compression. Larger file sizes but perfect
            quality.
          </p>
          <p>
            <strong>WebP:</strong> Modern format with best compression. Supports
            both lossy and lossless. 25-34% smaller than JPEG at same quality.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, text: "100% Private", sub: "No upload" },
            { icon: Zap, text: "Fast", sub: "Web Workers" },
            { icon: HardDrive, text: "Up to 90%", sub: "Size reduction" },
            { icon: FileDown, text: "Batch", sub: "Multiple files" },
          ].map(({ icon: Icon, text, sub }) => (
            <div
              key={text}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <Icon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">{text}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* File Upload */}
        {files.length === 0 ? (
          <FileDropzone
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            maxSize={50}
            multiple
            onFileSelect={handleFileSelect}
            description="Images (JPG, PNG, WebP, GIF) up to 50MB each"
          />
        ) : (
          <div className="space-y-4">
            {/* File List */}
            <div className="space-y-2">
              {files.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => removeFile(index)}
                  status={
                    status === "processing" && progress.current === index
                      ? "processing"
                      : status === "done"
                      ? "done"
                      : "idle"
                  }
                />
              ))}
            </div>

            {/* Add More Button */}
            {status === "idle" && (
              <button
                onClick={() => document.getElementById("add-more-input")?.click()}
                className="w-full py-2 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                + Add more images
              </button>
            )}
            <input
              id="add-more-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileSelect(Array.from(e.target.files));
                }
              }}
            />

            {/* Compression Settings */}
            {status !== "done" && (
              <div className="p-4 rounded-lg border border-border bg-white dark:bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Compression Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quality Slider */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Smaller</span>
                      <span>Higher Quality</span>
                    </div>
                  </div>

                  {/* Max Width */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max Width/Height
                    </label>
                    <select
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                    >
                      <option value={640}>640px (Small)</option>
                      <option value={1280}>1280px (Medium)</option>
                      <option value={1920}>1920px (Full HD)</option>
                      <option value={2560}>2560px (2K)</option>
                      <option value={3840}>3840px (4K)</option>
                      <option value={99999}>Original Size</option>
                    </select>
                  </div>

                  {/* Max File Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Max Size
                    </label>
                    <select
                      value={maxSizeMB}
                      onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                    >
                      <option value={0.1}>100 KB</option>
                      <option value={0.25}>250 KB</option>
                      <option value={0.5}>500 KB</option>
                      <option value={1}>1 MB</option>
                      <option value={2}>2 MB</option>
                      <option value={5}>5 MB</option>
                      <option value={10}>10 MB</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            {status === "processing" && (
              <ProcessingProgress
                current={progress.current}
                total={progress.total}
                label="Compressing images..."
              />
            )}

            {status === "error" && error && (
              <ProcessingStatus status="error" message={error} />
            )}

            {/* Results */}
            {status === "done" && results.length > 0 && (
              <div className="space-y-4">
                <ProcessingStatus
                  status="done"
                  message={`${results.length} image${results.length !== 1 ? "s" : ""} compressed successfully!`}
                />

                {/* Total Stats */}
                <ResultStats {...getTotalStats()} />

                {/* Individual Results */}
                <div className="space-y-2">
                  {results.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-white dark:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">
                            {item.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(item.result.originalSize / 1024).toFixed(1)} KB →{" "}
                            {(item.result.compressedSize / 1024).toFixed(1)} KB
                            <span className="text-green-600 dark:text-green-400 ml-2">
                              (-
                              {Math.round(
                                (1 - item.result.compressedSize / item.result.originalSize) * 100
                              )}
                              %)
                            </span>
                          </p>
                        </div>
                      </div>
                      <DownloadButton
                        blob={item.result.blob}
                        filename={`compressed-${item.file.name}`}
                        variant="secondary"
                        size="sm"
                      >
                        Download
                      </DownloadButton>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {results.length > 1 && (
                    <DownloadAllButton
                      files={downloadFiles}
                      zipFilename="compressed-images.zip"
                      className="flex-1"
                    />
                  )}
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    Compress More Images
                  </button>
                </div>
              </div>
            )}

            {/* Compress Button */}
            {status === "idle" && (
              <button
                onClick={handleCompress}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
              >
                Compress {files.length} Image{files.length !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
