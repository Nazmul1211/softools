"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import Image from "next/image";
import {
  Wand2,
  Shield,
  Sparkles,
  Image as ImageIcon,
  Zap,
  RefreshCcw,
  Trash2,
} from "lucide-react";

interface ProcessingState {
  status: "idle" | "processing" | "done" | "error";
  message?: string;
  progress: number;
}

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    if (!selectedFile.type.startsWith("image/")) {
      setProcessing({
        status: "error",
        message: "Please select a valid image file",
        progress: 0,
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setProcessing({
        status: "error",
        message: "Image size must be less than 10MB",
        progress: 0,
      });
      return;
    }

    setFile(selectedFile);
    setResultBlob(null);
    setResultPreview(null);
    setProcessing({ status: "idle", progress: 0 });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const processImage = async () => {
    if (!file) return;

    try {
      setProcessing({ status: "processing", message: "Loading AI model...", progress: 10 });

      // Dynamically import the library
      const { removeBackground } = await import("@imgly/background-removal");

      setProcessing({ status: "processing", message: "Removing background...", progress: 30 });

      // Configure and run background removal
      const config = {
        progress: (key: string, current: number, total: number) => {
          const progressPercent = 30 + Math.round((current / total) * 60);
          setProcessing({
            status: "processing",
            message: "Removing background...",
            progress: progressPercent,
          });
        },
        output: {
          format: "image/png" as const,
          quality: 1,
        },
      };

      const blob = await removeBackground(file, config);

      // Create preview URL
      const previewUrl = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultPreview(previewUrl);
      setProcessing({ status: "done", message: "Background removed!", progress: 100 });
    } catch (error) {
      console.error("Background removal failed:", error);
      setProcessing({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to remove background",
        progress: 0,
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalPreview(null);
    setResultBlob(null);
    if (resultPreview) {
      URL.revokeObjectURL(resultPreview);
    }
    setResultPreview(null);
    setProcessing({ status: "idle", progress: 0 });
  };

  const getOutputFilename = () => {
    if (!file) return "image-no-bg.png";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return `${baseName}-no-bg.png`;
  };

  return (
    <ToolLayout
      title="Remove Background"
      description="Remove backgrounds from images instantly using AI. Create transparent PNG images for photos, products, portraits, and more. Works entirely in your browser - your images never leave your device."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image Cropper", href: "/image-cropper/" },
        { name: "Image Resizer", href: "/image-resizer/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
      ]}
      howToSteps={[
        {
          name: "Upload Image",
          text: "Drop an image or click to browse. Supports JPG, PNG, WebP formats up to 10MB.",
        },
        {
          name: "Process Image",
          text: "Click 'Remove Background' to start. Our AI will analyze and remove the background.",
        },
        {
          name: "Preview Result",
          text: "View the result with transparent background displayed on a checkerboard pattern.",
        },
        {
          name: "Download PNG",
          text: "Download your image with transparent background as a PNG file.",
        },
      ]}
      faqs={[
        {
          question: "Is this tool free to use?",
          answer:
            "Yes, our background remover is completely free with no signup required. All processing happens locally in your browser.",
        },
        {
          question: "What types of images work best?",
          answer:
            "Images with clear subjects work best - portraits, product photos, objects with distinct edges. Complex backgrounds with similar colors to the subject may be more challenging.",
        },
        {
          question: "Are my images uploaded to a server?",
          answer:
            "No! All processing happens locally in your browser using AI technology. Your images never leave your device, ensuring complete privacy.",
        },
        {
          question: "What image formats are supported?",
          answer:
            "You can upload JPG, PNG, WebP, and other common image formats. The result is always downloaded as a PNG to preserve transparency.",
        },
        {
          question: "Why does the first image take longer?",
          answer:
            "On first use, the AI model needs to be downloaded to your browser (about 30MB). After that, subsequent images process much faster.",
        },
        {
          question: "Can I remove backgrounds from multiple images?",
          answer:
            "Currently, the tool processes one image at a time. After downloading your result, click 'New Image' to process another. This ensures optimal quality for each image.",
        },
        {
          question: "What resolution images can I process?",
          answer:
            "You can process images up to 10MB in size. For best results, use images with at least 500x500 pixels. Very large images may take longer to process.",
        },
        {
          question: "How accurate is the AI background removal?",
          answer:
            "Our AI achieves excellent results on most images, especially portraits and product photos. Complex scenes with fine details like hair or transparent objects may require some manual touch-up in an image editor.",
        },
      ]}
      content={
        <>
          <h2>How AI Background Removal Works</h2>
          <p>
            Our background remover uses advanced machine learning technology called semantic segmentation to identify the main subject in your image and separate it from the background. The AI model has been trained on millions of images to recognize people, objects, animals, and products with remarkable accuracy.
          </p>
          <p>
            Unlike traditional green screen or manual selection methods, AI background removal works automatically on any image without special preparation. The technology analyzes edges, colors, textures, and shapes to create precise cutouts that preserve fine details like hair strands and semi-transparent elements.
          </p>

          <h2>Common Use Cases for Background Removal</h2>
          <p>
            Background removal is essential for many creative and professional applications. E-commerce sellers use it to create clean product photos with white or transparent backgrounds that meet marketplace requirements. Social media creators use it for profile pictures, thumbnails, and creative compositions.
          </p>
          <p>
            Graphic designers frequently need to extract subjects for posters, flyers, and digital artwork. Real estate professionals use background removal for property listings. Job seekers need professional headshots with neutral backgrounds. The applications are virtually endless across industries.
          </p>

          <h2>Why Browser-Based Processing Matters</h2>
          <p>
            Unlike cloud-based background removal services, our tool processes images entirely in your browser. This provides several important benefits: your images never leave your device ensuring complete privacy, there's no upload wait time, and the tool works offline after the first use.
          </p>
          <p>
            Browser-based AI is possible through WebGL acceleration that leverages your device's graphics card for fast processing. Modern smartphones and computers can handle sophisticated AI models locally, making professional-quality background removal accessible to everyone without subscription fees or per-image charges.
          </p>

          <h2>Tips for Best Background Removal Results</h2>
          <p>
            To get the cleanest cutouts, start with high-quality images that have good lighting and contrast between the subject and background. Avoid very busy backgrounds or scenes where the subject color closely matches the background. Images with clear edges and good focus produce the best results.
          </p>
          <p>
            For portraits, images where the subject is centered and clearly separated from the background work best. Product photography benefits from even lighting and simple backgrounds. If the automatic result isn't perfect, try adjusting your original image's brightness and contrast before processing.
          </p>

          <h2>Working with Transparent PNG Images</h2>
          <p>
            The result of background removal is a PNG file with transparency. PNG (Portable Network Graphics) is the standard format for images that need transparent areas. Unlike JPG which doesn't support transparency, PNG preserves the alpha channel that defines which pixels are transparent.
          </p>
          <p>
            You can use transparent PNG files in design software like Photoshop, Canva, or Figma to layer over other images or backgrounds. Web developers use transparent PNGs for logos and graphics that need to appear on different colored backgrounds. Most social media platforms also support PNG uploads with transparency.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!file && (
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={10}
            multiple={false}
            description="Drop an image here or click to upload. Supports JPG, PNG, WebP • Max 10MB"
          />
        )}

        {/* Processing Status */}
        {processing.status !== "idle" && processing.status !== "done" && (
          <ProcessingStatus status={processing.status} message={processing.message} />
        )}

        {/* Error State */}
        {processing.status === "error" && (
          <ProcessingStatus status="error" message={processing.message} />
        )}

        {/* Image Preview */}
        {file && (
          <div className="space-y-6">
            {/* Image Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Original
                </h3>
                <div className="relative aspect-square bg-muted rounded-xl overflow-hidden border">
                  {originalPreview && (
                    <Image
                      src={originalPreview}
                      alt="Original image"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <FilePreview
                  file={file}
                  onRemove={handleReset}
                />
              </div>

              {/* Result */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Result
                </h3>
                <div
                  className="relative aspect-square rounded-xl overflow-hidden border"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='%23e5e5e5'/%3E%3Crect x='10' width='10' height='10' fill='%23ffffff'/%3E%3Crect y='10' width='10' height='10' fill='%23ffffff'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e5e5e5'/%3E%3C/svg%3E")`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  {resultPreview ? (
                    <Image
                      src={resultPreview}
                      alt="Background removed"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        {processing.status === "processing"
                          ? "Processing..."
                          : "Click 'Remove Background' to start"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Success Message */}
            {processing.status === "done" && (
              <ProcessingStatus status="done" message="Background removed successfully!" />
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!resultBlob && processing.status !== "processing" && (
                <button
                  onClick={processImage}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Wand2 className="h-4 w-4" />
                  Remove Background
                </button>
              )}

              {resultBlob && (
                <DownloadButton
                  blob={resultBlob}
                  filename={getOutputFilename()}
                >
                  Download PNG
                </DownloadButton>
              )}

              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
                New Image
              </button>
            </div>
          </div>
        )}

        {/* Features Grid (when no file) */}
        {!file && (
          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">AI-Powered</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Advanced ML for precise cutouts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">100% Private</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Processing in your browser
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Free Forever</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  No signup or watermarks
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
