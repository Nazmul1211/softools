"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus, ProcessingProgress } from "@/components/tools/ProcessingStatus";
import { DownloadButton, DownloadAllButton } from "@/components/tools/DownloadButton";
import { splitPDF, extractPages, getPDFInfo } from "@/lib/pdf";
import { FileText, Scissors, Shield, Zap, FileDown } from "lucide-react";

type SplitMode = "all" | "range" | "select";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<SplitMode>("all");
  const [pageRange, setPageRange] = useState("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setResults([]);
      setStatus("idle");
      setError(null);

      try {
        const info = await getPDFInfo(selectedFile);
        setPageCount(info.pageCount);
        setSelectedPages([]);
      } catch (err) {
        console.error("Failed to read PDF:", err);
        setError("Failed to read PDF. Please try a different file.");
      }
    }
  }, []);

  const parsePageRange = (range: string): number[] => {
    const pages: number[] = [];
    const parts = range.split(",").map((s) => s.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= pageCount && !pages.includes(num)) {
          pages.push(num);
        }
      }
    }

    return pages.sort((a, b) => a - b);
  };

  const togglePage = (page: number) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page].sort((a, b) => a - b)
    );
  };

  const handleSplit = async () => {
    if (!file) return;

    setStatus("processing");
    setError(null);

    try {
      if (splitMode === "all") {
        setProgress({ current: 0, total: pageCount });
        const splitPages = await splitPDF(file);
        setResults(splitPages);
        setProgress({ current: pageCount, total: pageCount });
      } else {
        const pagesToExtract =
          splitMode === "range" ? parsePageRange(pageRange) : selectedPages;

        if (pagesToExtract.length === 0) {
          throw new Error("Please select at least one page");
        }

        setProgress({ current: 0, total: 1 });
        const extracted = await extractPages(file, pagesToExtract);
        setResults([extracted]);
        setProgress({ current: 1, total: 1 });
      }
      setStatus("done");
    } catch (err) {
      console.error("Split failed:", err);
      setError(err instanceof Error ? err.message : "Failed to split PDF. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setResults([]);
    setStatus("idle");
    setError(null);
    setSelectedPages([]);
    setPageRange("");
  };

  const downloadFiles = results.map((blob, index) => ({
    blob,
    filename:
      splitMode === "all"
        ? `page-${index + 1}.pdf`
        : `extracted-pages.pdf`,
  }));

  return (
    <ToolLayout
      title="PDF Splitter"
      description="Split PDF into individual pages or extract specific pages. All processing happens in your browser - 100% private and secure."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "Merge PDF", href: "/pdf-merger/" },
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "PDF to JPG", href: "/pdf-to-jpg/" },
        { name: "Image Compressor", href: "/image-compressor/" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-03-28"
      howToSteps={[
        {
          name: "Upload PDF",
          text: "Drop your PDF file or click to browse.",
        },
        {
          name: "Choose Split Mode",
          text: "Split all pages, extract a range, or select specific pages.",
        },
        {
          name: "Split",
          text: "Click Split button. Processing happens in your browser.",
        },
        {
          name: "Download",
          text: "Download individual pages or all as a ZIP file.",
        },
      ]}
      faqs={[
        {
          question: "How do I extract specific pages?",
          answer:
            "Choose 'Extract Range' mode and enter page numbers like '1-5, 8, 10-12' to extract those specific pages into a new PDF.",
        },
        {
          question: "Can I split a large PDF?",
          answer:
            "Yes! Since processing happens in your browser, you can split PDFs up to 50MB easily. Larger files may take more time.",
        },
        {
          question: "Are my files secure?",
          answer:
            "Yes! Your PDF never leaves your device. All processing is done locally in your browser.",
        },
      ]}
      content={
        <>
          <h2>How to Split a PDF</h2>
          <p>
            Our free PDF splitter lets you separate PDF pages or extract specific
            pages into new documents. Choose from three modes: split all pages into
            individual PDFs, extract a range of pages, or select specific pages to
            extract.
          </p>

          <h2>Split Modes</h2>
          <ul>
            <li>
              <strong>Split All Pages:</strong> Creates individual PDF files for
              each page
            </li>
            <li>
              <strong>Extract Range:</strong> Enter page numbers like &quot;1-5, 8,
              10-12&quot; to create a new PDF with those pages
            </li>
            <li>
              <strong>Select Pages:</strong> Click on page numbers to select which
              ones to extract
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
            { icon: Scissors, text: "Flexible", sub: "Multiple modes" },
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

        {/* File Upload */}
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

            {/* PDF Info */}
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm">
                <span className="text-muted-foreground">Total pages:</span>{" "}
                <span className="font-medium">{pageCount}</span>
              </p>
            </div>

            {/* Split Mode Selection */}
            {status !== "done" && pageCount > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { value: "all" as const, label: "Split All Pages", desc: "Separate each page" },
                    { value: "range" as const, label: "Extract Range", desc: "Enter page numbers" },
                    { value: "select" as const, label: "Select Pages", desc: "Click to choose" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSplitMode(option.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        splitMode === option.value
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Range Input */}
                {splitMode === "range" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Page Range (e.g., 1-5, 8, 10-12)
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder="1-5, 8, 10-12"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                    {pageRange && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Selected pages: {parsePageRange(pageRange).join(", ") || "None"}
                      </p>
                    )}
                  </div>
                )}

                {/* Page Selection Grid */}
                {splitMode === "select" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Click pages to select ({selectedPages.length} selected)
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-2 border border-border rounded-lg">
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => togglePage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            selectedPages.includes(page)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status */}
            {status === "processing" && (
              <ProcessingProgress
                current={progress.current}
                total={progress.total}
                label="Splitting PDF..."
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
                  message={
                    splitMode === "all"
                      ? `Split into ${results.length} pages!`
                      : `Extracted ${results.length === 1 ? "pages" : results.length + " files"}!`
                  }
                />

                {splitMode === "all" && results.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[200px] overflow-y-auto p-2">
                    {results.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center p-2 rounded-lg bg-muted text-sm"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {index + 1}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  {results.length === 1 ? (
                    <DownloadButton
                      blob={results[0]}
                      filename="extracted-pages.pdf"
                      className="flex-1"
                      size="lg"
                    >
                      Download PDF
                    </DownloadButton>
                  ) : (
                    <DownloadAllButton
                      files={downloadFiles}
                      zipFilename="split-pages.zip"
                      className="flex-1"
                    />
                  )}
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    Split Another PDF
                  </button>
                </div>
              </div>
            )}

            {/* Split Button */}
            {status === "idle" && pageCount > 0 && (
              <button
                onClick={handleSplit}
                disabled={
                  (splitMode === "range" && parsePageRange(pageRange).length === 0) ||
                  (splitMode === "select" && selectedPages.length === 0)
                }
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {splitMode === "all"
                  ? `Split All ${pageCount} Pages`
                  : splitMode === "range"
                  ? `Extract ${parsePageRange(pageRange).length} Pages`
                  : `Extract ${selectedPages.length} Pages`}
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
