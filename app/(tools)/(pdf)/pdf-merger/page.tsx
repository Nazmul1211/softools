"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { mergePDFs } from "@/lib/pdf";
import { GripVertical, Shield, Zap, Layers, FileDown, X } from "lucide-react";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
    setStatus("idle");
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
    setResult(null);
    setStatus("idle");
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveFile(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    setStatus("processing");
    setError(null);

    try {
      const mergedPdf = await mergePDFs(files);
      setResult(mergedPdf);
      setStatus("done");
    } catch (err) {
      console.error("Merge failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to merge PDFs. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setStatus("idle");
    setError(null);
  };

  return (
    <ToolLayout
      title="PDF Merger"
      description="Combine multiple PDF files into one document instantly. Drag and drop to reorder pages. 100% free, private, and secure."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "Split PDF", href: "/pdf-splitter/" },
        { name: "PDF to JPG", href: "/pdf-to-jpg/" },
        { name: "Image Compressor", href: "/image-compressor/" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-03-28"
      howToSteps={[
        {
          name: "Upload PDFs",
          text: "Drop multiple PDF files or click to browse. Add as many PDFs as you need.",
        },
        {
          name: "Arrange Order",
          text: "Drag and drop to reorder the PDFs in your preferred sequence.",
        },
        {
          name: "Merge",
          text: "Click Merge button. Processing happens instantly in your browser.",
        },
        {
          name: "Download",
          text: "Download your merged PDF file.",
        },
      ]}
      faqs={[
        {
          question: "How many PDFs can I merge at once?",
          answer:
            "There's no strict limit. Since processing happens in your browser, the practical limit depends on your device's memory. Most devices can handle 20-50 PDFs easily.",
        },
        {
          question: "Can I reorder the PDFs before merging?",
          answer:
            "Yes! Simply drag and drop the files in the list to arrange them in your preferred order before merging.",
        },
        {
          question: "Will the merged PDF be compressed?",
          answer:
            "The merger preserves original quality. If you need to reduce file size, use our PDF Compressor tool after merging.",
        },
        {
          question: "Are my files uploaded to a server?",
          answer:
            "No! All processing happens in your browser. Your PDFs never leave your device.",
        },
      ]}
      content={
        <>
          <h2>How to Merge PDF Files</h2>
          <p>
            Our free PDF merger combines multiple PDF documents into a single file
            quickly and easily. Simply upload your PDFs, arrange them in the
            desired order, and click merge. The entire process happens in your
            browser for maximum privacy.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Merge unlimited PDF files</li>
            <li>Drag and drop reordering</li>
            <li>Preserves original quality</li>
            <li>No file size limits</li>
            <li>100% client-side processing</li>
            <li>No registration required</li>
          </ul>

          <h2>When to Use PDF Merger</h2>
          <ul>
            <li>Combining multiple reports into one document</li>
            <li>Merging scanned pages into a single PDF</li>
            <li>Creating a portfolio from separate PDFs</li>
            <li>Combining invoices or receipts</li>
            <li>Assembling presentation materials</li>
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
            { icon: Layers, text: "Unlimited", sub: "No file limits" },
            { icon: FileDown, text: "Free", sub: "No watermark" },
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
        <FileDropzone
          accept=".pdf,application/pdf"
          maxSize={100}
          multiple
          onFileSelect={handleFileSelect}
          description="PDF files up to 100MB each"
          disabled={status === "processing"}
        />

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {files.length} PDF{files.length !== 1 ? "s" : ""} selected
              </h3>
              {files.length >= 2 && status === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Drag to reorder
                </p>
              )}
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  draggable={status === "idle"}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-muted/30 transition-all ${
                    draggedIndex === index
                      ? "border-primary opacity-50"
                      : "border-border"
                  } ${status === "idle" ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {status === "idle" && (
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {status === "idle" && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Status */}
            {status === "processing" && (
              <ProcessingStatus
                status="processing"
                message="Merging PDFs..."
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
                  message={`Successfully merged ${files.length} PDFs!`}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton
                    blob={result}
                    filename="merged.pdf"
                    className="flex-1"
                    size="lg"
                  >
                    Download Merged PDF
                  </DownloadButton>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    Merge More PDFs
                  </button>
                </div>
              </div>
            )}

            {/* Merge Button */}
            {status === "idle" && files.length >= 2 && (
              <button
                onClick={handleMerge}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
              >
                Merge {files.length} PDFs
              </button>
            )}

            {status === "idle" && files.length === 1 && (
              <p className="text-center text-muted-foreground">
                Add at least 2 PDFs to merge
              </p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
