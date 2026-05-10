"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { DownloadButton, DownloadAllButton } from "@/components/tools/DownloadButton";
import { ProcessingProgress, ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { convertImage } from "@/lib/image";
import { Image as ImageIcon, Shield, Zap, FileImage } from "lucide-react";

interface ConvertedImage {
  sourceFile: File;
  blob: Blob;
  filename: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is HEIC and why convert to JPG?",
    answer:
      "HEIC is a modern image format used by iPhones that offers high quality at smaller file sizes. Some websites, government forms, legacy systems, and desktop tools still prefer JPG for compatibility. Converting HEIC to JPG ensures your photos can be uploaded, shared, or printed in more environments without format errors.",
  },
  {
    question: "Does this tool upload my photos to a server?",
    answer:
      "No. Conversion runs entirely in your browser on your device. Your source files are not sent to a remote processing queue. This local-first model improves privacy for personal IDs, financial screenshots, and sensitive images that should not leave your machine during format conversion.",
  },
  {
    question: "Will JPG reduce image quality?",
    answer:
      "JPG uses lossy compression, so quality depends on your selected quality level. Higher values preserve more detail with larger files, while lower values reduce size with more compression artifacts. For document photos and uploads, quality around 85-92 often balances clarity and file size effectively.",
  },
  {
    question: "Can I convert multiple HEIC files at once?",
    answer:
      "Yes. You can batch-convert multiple files in one run and download each JPG individually or as a ZIP archive. This is useful when moving large iPhone photo sets to systems that require JPG and helps reduce repetitive manual conversion work.",
  },
  {
    question: "Is this useful for passport or visa uploads?",
    answer:
      "Yes, many official upload portals request JPG/JPEG rather than HEIC. This converter helps you quickly generate compatible files. Always verify each portal&apos;s exact size, dimensions, and background requirements after conversion, because format compatibility alone does not guarantee acceptance.",
  },
  {
    question: "What if I upload PNG or WEBP by mistake?",
    answer:
      "The converter can still output JPG from common image formats, so non-HEIC uploads are handled too. That means you can use this page as a general compatibility converter when downstream systems only accept JPG files, even if your source is not HEIC.",
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getOutputFilename(inputName: string): string {
  const withoutExt = inputName.replace(/\.[^/.]+$/, "");
  return `${withoutExt}.jpg`;
}

function isHeicLike(file: File): boolean {
  const lower = file.name.toLowerCase();
  return (
    lower.endsWith(".heic") ||
    lower.endsWith(".heif") ||
    file.type.toLowerCase().includes("heic") ||
    file.type.toLowerCase().includes("heif")
  );
}

export default function HEICToJPGConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(90);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setFiles((prev) => [...prev, ...newFiles]);
    setStatus("idle");
    setError(null);
    setResults([]);
    setProgress({ current: 0, total: 0 });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setStatus("idle");
    setResults([]);
    setError(null);
  };

  const resetAll = () => {
    setFiles([]);
    setStatus("idle");
    setResults([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  const convertAll = async () => {
    if (files.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setStatus("processing");
    setError(null);
    setResults([]);
    setProgress({ current: 0, total: files.length });

    try {
      const converted: ConvertedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i, total: files.length });

        let outputBlob: Blob;
        if (isHeicLike(file)) {
          const { default: heic2any } = await import("heic2any");
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: quality / 100,
          });
          outputBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        } else {
          outputBlob = await convertImage(file, "image/jpeg", quality / 100);
        }

        converted.push({
          sourceFile: file,
          blob: outputBlob,
          filename: getOutputFilename(file.name),
        });
      }

      setResults(converted);
      setProgress({ current: files.length, total: files.length });
      setStatus("done");
    } catch (caughtError) {
      setStatus("error");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Conversion failed for one or more files. Please try again."
      );
    }
  };

  const zipFiles = useMemo(
    () => results.map((result) => ({ blob: result.blob, filename: result.filename })),
    [results]
  );

  return (
    <ToolLayout
      title="HEIC to JPG Converter"
      slug="heic-to-jpg-converter"
      description="Convert HEIC and HEIF images to JPG in your browser with batch processing, quality control, and private on-device conversion."
      category={{ name: "Image Tools", slug: "image-tools" }}
      relatedTools={[
        { name: "Image to JPG Converter", href: "/image-to-jpg-converter/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image Resizer", href: "/image-resizer/" },
        { name: "Image to PNG Converter", href: "/image-to-png-converter/" },
      ]}
      howToSteps={[
        { name: "Upload HEIC files", text: "Drop one or multiple HEIC/HEIF images from your device." },
        { name: "Set JPG quality", text: "Choose quality based on file-size vs detail requirements." },
        { name: "Convert batch", text: "Run browser-side conversion without server uploads." },
        { name: "Download outputs", text: "Save individual JPGs or download all as ZIP." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this HEIC to JPG converter does</h2>
          <p>
            This tool converts HEIC and HEIF images into JPG format for broader compatibility across websites, document
            systems, email workflows, and legacy software. Many users receive upload errors because a platform accepts
            only JPG/JPEG files. This converter solves that quickly with local browser processing and no sign-up.
          </p>

          <h2>How conversion works</h2>
          <p>
            HEIC files are decoded in-browser and re-encoded to JPEG with your selected quality level. For non-HEIC
            image files, the same page can still produce JPG output, so the workflow remains consistent for mixed photo
            folders. Batch mode lets you convert multiple files in one run and export all results in a ZIP archive.
          </p>

          <h2>HEIC vs JPG format comparison</h2>
          <table>
            <thead>
              <tr>
                <th>Format</th>
                <th>Compression Model</th>
                <th>Compatibility</th>
                <th>Typical Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HEIC/HEIF</td>
                <td>High-efficiency modern codec container</td>
                <td>Strong on Apple ecosystem, mixed elsewhere</td>
                <td>Mobile photo capture and storage efficiency</td>
              </tr>
              <tr>
                <td>JPG/JPEG</td>
                <td>Lossy DCT-based compression</td>
                <td>Very high cross-platform compatibility</td>
                <td>Web uploads, forms, email, and sharing</td>
              </tr>
            </tbody>
          </table>

          <h2>Quality vs size tradeoff</h2>
          <p>
            JPG compression allows you to control the balance between visual fidelity and file size. Higher quality
            values preserve detail but produce larger files. Lower quality values reduce upload weight but may introduce
            visible artifacts in text edges, gradients, and fine textures. For practical upload workflows, quality
            values around 85-92 are often a strong middle ground.
          </p>

          <h2>Privacy guarantee and data handling</h2>
          <p>
            Conversion runs in your browser session. Files are processed locally on your device and are not uploaded to
            a remote server by this tool. This is particularly useful for personal documents, identity photos, banking
            attachments, and confidential images where data exposure risk should be minimized.
          </p>

          <h2>High-value use cases</h2>
          <ul>
            <li>Uploading iPhone photos to forms that reject HEIC files.</li>
            <li>Preparing images for document portals and office software.</li>
            <li>Batch conversion before importing into CMS or DAM systems.</li>
            <li>Generating compatibility-safe files for clients and stakeholders.</li>
            <li>Preparing JPG images for passport and visa workflows.</li>
          </ul>

          <h2>Best practices for reliable results</h2>
          <p>
            Always verify destination requirements after conversion: file size limits, pixel dimensions, background
            rules, and naming conventions. If a portal rejects a file, try reducing dimensions or quality slightly while
            preserving legibility. Keep original files until your upload or submission is fully accepted.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>ISO/IEC 23008-12 (HEIF specification family).</li>
            <li>ISO/IEC 10918 (JPEG image coding standards).</li>
            <li>W3C image format guidance and web compatibility notes.</li>
            <li>MDN documentation on browser image handling and format support.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Private", sub: "Local browser processing" },
            { icon: Zap, title: "Batch Ready", sub: "Convert multiple files at once" },
            { icon: ImageIcon, title: "Quality Control", sub: "JPG quality slider" },
            { icon: FileImage, title: "Compatibility", sub: "HEIC/HEIF to JPG output" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {files.length === 0 ? (
          <FileDropzone
            accept=".heic,.heif,image/heic,image/heif,image/*"
            maxSize={40}
            multiple
            onFileSelect={handleFileSelect}
            description="HEIC, HEIF, and image files up to 40MB each"
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {files.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => removeFile(index)}
                  status={
                    status === "processing"
                      ? index < progress.current
                        ? "done"
                        : progress.current === index
                        ? "processing"
                        : "idle"
                      : status === "done"
                      ? "done"
                      : "idle"
                  }
                />
              ))}
            </div>

            {status !== "processing" && (
              <div className="rounded-xl border border-border bg-card p-4">
                <label className="block text-sm text-muted-foreground">
                  JPG Quality: <span className="font-semibold text-foreground">{quality}%</span>
                </label>
                <input
                  type="range"
                  min={55}
                  max={100}
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
              </div>
            )}

            {status === "processing" && (
              <ProcessingProgress current={progress.current} total={progress.total} label="Converting files..." />
            )}
            {status === "error" && error && <ProcessingStatus status="error" message={error} />}
            {status === "done" && (
              <ProcessingStatus
                status="done"
                message={`${results.length} file${results.length !== 1 ? "s" : ""} converted successfully.`}
              />
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                {results.map((result, index) => {
                  const delta = Math.round((1 - result.blob.size / result.sourceFile.size) * 100);
                  return (
                    <div
                      key={`${result.filename}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{result.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(result.sourceFile.size)} → {formatBytes(result.blob.size)}{" "}
                          <span className={delta >= 0 ? "text-green-600" : "text-amber-600"}>
                            ({delta >= 0 ? "-" : "+"}
                            {Math.abs(delta)}%)
                          </span>
                        </p>
                      </div>
                      <DownloadButton blob={result.blob} filename={result.filename} variant="secondary" size="sm">
                        Download
                      </DownloadButton>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {status !== "processing" && (
                <button
                  onClick={convertAll}
                  className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Convert to JPG
                </button>
              )}
              {results.length > 1 && (
                <DownloadAllButton files={zipFiles} zipFilename="heic-to-jpg-converted.zip" className="sm:flex-1" />
              )}
              <button
                onClick={resetAll}
                className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
