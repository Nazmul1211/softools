"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import {
  ProcessingStatus,
  ResultStats,
} from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { compressPDF, CompressionResult } from "@/lib/pdf";
import { FileDown, Settings2, Shield, Zap, HardDrive } from "lucide-react";

type CompressionQuality = "low" | "medium" | "high";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<CompressionQuality>("medium");
  const [removeMetadata, setRemoveMetadata] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">(
    "idle"
  );
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
      setStatus("idle");
      setError(null);
    }
  }, []);

  const handleCompress = async () => {
    if (!file) return;

    setStatus("processing");
    setError(null);

    try {
      const compressionResult = await compressPDF(file, {
        quality,
        removeMetadata,
      });
      setResult(compressionResult);
      setStatus("done");
    } catch (err) {
      console.error("Compression failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to compress PDF. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setError(null);
  };

  const qualityOptions = [
    {
      value: "high" as const,
      label: "High Quality",
      description: "Minimal compression, best quality",
    },
    {
      value: "medium" as const,
      label: "Balanced",
      description: "Good compression with quality",
    },
    {
      value: "low" as const,
      label: "Maximum Compression",
      description: "Smallest file size",
    },
  ];

  return (
    <ToolLayout
      title="PDF Compressor"
      description="Compress PDF files instantly without uploading to any server. Reduce file size while maintaining quality. 100% free and private."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "Merge PDF", href: "/pdf-merger/" },
        { name: "Split PDF", href: "/pdf-splitter/" },
        { name: "PDF to JPG", href: "/pdf-to-jpg/" },
        { name: "Image Compressor", href: "/image-compressor/" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-03-28"
      howToSteps={[
        {
          name: "Upload PDF",
          text: "Drop your PDF file or click to browse. Files stay in your browser - nothing is uploaded.",
        },
        {
          name: "Choose Quality",
          text: "Select compression level: High Quality, Balanced, or Maximum Compression.",
        },
        {
          name: "Compress",
          text: "Click the Compress button. Processing happens instantly in your browser.",
        },
        {
          name: "Download",
          text: "Download your compressed PDF. See the size reduction stats.",
        },
      ]}
      faqs={[
        {
          question: "Is my PDF uploaded to a server?",
          answer:
            "No! All processing happens directly in your browser using JavaScript. Your PDF never leaves your device, ensuring 100% privacy.",
        },
        {
          question: "How much can I reduce my PDF size?",
          answer:
            "Compression results vary based on the PDF content. Image-heavy PDFs typically see 40-90% size reduction. Text-only PDFs may see 10-30% reduction.",
        },
        {
          question: "Will compression affect PDF quality?",
          answer:
            "Our tool optimizes PDF structure without significantly degrading quality. For important documents, use 'High Quality' mode for best results.",
        },
        {
          question: "What's the maximum file size I can compress?",
          answer:
            "Since processing happens in your browser, the limit depends on your device's memory. Most devices can handle PDFs up to 50MB easily.",
        },
        {
          question: "Is this tool really free?",
          answer:
            "Yes, completely free with no hidden costs, no sign-up required, and no watermarks added to your PDFs.",
        },
      ]}
      content={
        <>
          <h2>What is PDF Compression?</h2>
          <p>
            PDF compression reduces the file size of PDF documents by optimizing
            internal structures, removing redundant data, and adjusting image
            quality. This makes PDFs easier to share via email, upload to websites,
            or store on devices with limited space.
          </p>

          <h2>How Does Our PDF Compressor Work?</h2>
          <p>
            Unlike traditional online PDF compressors that upload your files to
            remote servers, our tool uses client-side JavaScript processing. Your
            PDF is processed entirely within your web browser using the pdf-lib
            library, ensuring:
          </p>
          <ul>
            <li>
              <strong>Complete Privacy:</strong> Your files never leave your
              device
            </li>
            <li>
              <strong>Instant Processing:</strong> No upload/download wait times
            </li>
            <li>
              <strong>Unlimited Use:</strong> No daily limits or file count
              restrictions
            </li>
            <li>
              <strong>Works Offline:</strong> Once loaded, works without internet
            </li>
          </ul>

          <h2>When to Use PDF Compression</h2>
          <ul>
            <li>Sending PDFs via email with size limits</li>
            <li>Uploading documents to websites with file size restrictions</li>
            <li>Archiving documents to save storage space</li>
            <li>Sharing large PDF reports or presentations</li>
            <li>Optimizing PDFs for web viewing</li>
          </ul>

          <h2>Compression Quality Settings</h2>
          <p>
            <strong>High Quality:</strong> Minimal compression that preserves
            image quality. Best for documents with important graphics or photos.
          </p>
          <p>
            <strong>Balanced:</strong> Good compression with acceptable quality
            loss. Recommended for most documents.
          </p>
          <p>
            <strong>Maximum Compression:</strong> Aggressive compression for
            smallest file size. Best for text-heavy documents or when file size is
            critical.
          </p>

          <h2>Tips for Better PDF Compression</h2>
          <ul>
            <li>
              Remove unnecessary pages before compressing to reduce file size
              further
            </li>
            <li>
              Use &quot;Remove Metadata&quot; option to strip hidden information
              and reduce size
            </li>
            <li>
              For scanned documents, consider using our Image Compressor first on
              individual images
            </li>
            <li>
              If quality is important, start with High Quality and adjust if
              needed
            </li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, text: "100% Private", sub: "No upload" },
            { icon: Zap, text: "Instant", sub: "Browser processing" },
            { icon: HardDrive, text: "Up to 90%", sub: "Size reduction" },
            { icon: FileDown, text: "Free", sub: "No limits" },
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

        {/* File Upload or Preview */}
        {!file ? (
          <FileDropzone
            accept=".pdf,application/pdf"
            maxSize={100}
            onFileSelect={handleFileSelect}
            description="PDF files up to 100MB"
          />
        ) : (
          <div className="space-y-4">
            <FilePreview
              file={file}
              onRemove={handleReset}
              status={status === "processing" ? "processing" : "idle"}
            />

            {/* Compression Options */}
            {status !== "done" && (
              <div className="p-4 rounded-lg border border-border bg-white dark:bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Compression Settings</h3>
                </div>

                <div className="space-y-4">
                  {/* Quality Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Compression Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {qualityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setQuality(option.value)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            quality === option.value
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Option */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeMetadata}
                      onChange={(e) => setRemoveMetadata(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-medium text-sm">Remove Metadata</span>
                      <p className="text-xs text-muted-foreground">
                        Strip title, author, and other hidden information
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {status === "processing" && (
              <ProcessingStatus
                status="processing"
                message="Compressing your PDF..."
              />
            )}

            {status === "error" && error && (
              <ProcessingStatus status="error" message={error} />
            )}

            {/* Results */}
            {status === "done" && result && (
              <div className="space-y-4">
                <ProcessingStatus
                  status="done"
                  message={`Compression complete! ${result.pageCount} page${
                    result.pageCount !== 1 ? "s" : ""
                  } processed.`}
                />

                <ResultStats
                  original={result.originalSize}
                  compressed={result.compressedSize}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton
                    blob={result.blob}
                    filename={`compressed-${file.name}`}
                    className="flex-1"
                    size="lg"
                  >
                    Download Compressed PDF
                  </DownloadButton>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    Compress Another
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
                Compress PDF
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
