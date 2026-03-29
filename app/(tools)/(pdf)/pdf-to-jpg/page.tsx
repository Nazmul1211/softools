"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import {
  ProcessingStatus,
  ProcessingProgress,
} from "@/components/tools/ProcessingStatus";
import { DownloadButton, DownloadAllButton } from "@/components/tools/DownloadButton";
import { getPDFInfo } from "@/lib/pdf";
import { Settings2, Shield, Zap, FileImage, FileDown } from "lucide-react";

interface ConvertedPage {
  pageNumber: number;
  blob: Blob;
  width: number;
  height: number;
}

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(2);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<ConvertedPage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pdfjs, setPdfjs] = useState<typeof import("pdfjs-dist") | null>(null);

  // Load PDF.js dynamically
  useEffect(() => {
    const loadPdfjs = async () => {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      setPdfjs(pdfjsLib);
    };
    loadPdfjs();
  }, []);

  const handleFileSelect = useCallback(
    async (files: File[]) => {
      if (files.length > 0) {
        const selectedFile = files[0];
        setFile(selectedFile);
        setResults([]);
        setStatus("idle");
        setError(null);

        try {
          const info = await getPDFInfo(selectedFile);
          setPageCount(info.pageCount);
        } catch (err) {
          console.error("Failed to read PDF:", err);
          setError("Failed to read PDF. Please try a different file.");
        }
      }
    },
    []
  );

  const convertToImages = async () => {
    if (!file || !pdfjs) return;

    setStatus("processing");
    setError(null);
    setProgress({ current: 0, total: pageCount });
    setResults([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const convertedPages: ConvertedPage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress({ current: i - 1, total: pageCount });

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Failed to create blob"));
            },
            "image/jpeg",
            quality / 100
          );
        });

        convertedPages.push({
          pageNumber: i,
          blob,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
        });
      }

      setResults(convertedPages);
      setProgress({ current: pageCount, total: pageCount });
      setStatus("done");
    } catch (err) {
      console.error("Conversion failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to convert PDF. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setResults([]);
    setStatus("idle");
    setError(null);
  };

  const downloadFiles = results.map((r) => ({
    blob: r.blob,
    filename: `page-${r.pageNumber}.jpg`,
  }));

  const scaleOptions = [
    { value: 1, label: "1x (72 DPI)", desc: "Smaller files" },
    { value: 1.5, label: "1.5x (108 DPI)", desc: "Good quality" },
    { value: 2, label: "2x (144 DPI)", desc: "High quality" },
    { value: 3, label: "3x (216 DPI)", desc: "Best quality" },
  ];

  return (
    <ToolLayout
      title="PDF to JPG Converter"
      description="Convert PDF pages to high-quality JPG images instantly. All processing happens in your browser - 100% private and secure."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Split PDF", href: "/pdf-splitter/" },
        { name: "Merge PDF", href: "/pdf-merger/" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-03-28"
      howToSteps={[
        {
          name: "Upload PDF",
          text: "Drop your PDF file or click to browse.",
        },
        {
          name: "Adjust Settings",
          text: "Choose output quality and resolution scale.",
        },
        {
          name: "Convert",
          text: "Click Convert button. Each page becomes a JPG image.",
        },
        {
          name: "Download",
          text: "Download images individually or all at once as a ZIP.",
        },
      ]}
      faqs={[
        {
          question: "What resolution will my images be?",
          answer:
            "The resolution depends on the scale setting. 2x (default) produces high-quality images at 144 DPI. Use 3x for printing or when you need maximum quality.",
        },
        {
          question: "Can I convert a large PDF?",
          answer:
            "Yes! Since processing happens in your browser, you can convert PDFs up to 50MB. Larger PDFs may take more time to process.",
        },
        {
          question: "Will text in the PDF be selectable in the JPG?",
          answer:
            "No. JPG is a raster image format, so text becomes pixels. If you need selectable text, keep the PDF format.",
        },
        {
          question: "Are my files secure?",
          answer:
            "Yes! Your PDF never leaves your device. All conversion happens locally in your browser.",
        },
      ]}
      content={
        <>
          <h2>How to Convert PDF to JPG</h2>
          <p>
            Our free PDF to JPG converter transforms each page of your PDF into a
            separate high-quality JPEG image. The conversion happens entirely in
            your browser using the PDF.js library from Mozilla.
          </p>

          <h2>Quality Settings</h2>
          <ul>
            <li>
              <strong>Quality (1-100%):</strong> Higher values produce better
              image quality but larger files
            </li>
            <li>
              <strong>Scale:</strong> Multiplier for the output resolution. 2x is
              recommended for most uses
            </li>
          </ul>

          <h2>When to Use PDF to JPG</h2>
          <ul>
            <li>Sharing PDF content on social media</li>
            <li>Creating thumbnails or previews</li>
            <li>Inserting PDF pages into documents or presentations</li>
            <li>Archiving documents as images</li>
            <li>When the recipient cannot view PDFs</li>
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
            { icon: FileImage, text: "High Quality", sub: "Adjustable DPI" },
            { icon: FileDown, text: "Batch", sub: "All pages at once" },
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

            {/* Conversion Settings */}
            {status !== "done" && pageCount > 0 && (
              <div className="p-4 rounded-lg border border-border bg-white dark:bg-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Conversion Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <span>Smaller file</span>
                      <span>Better quality</span>
                    </div>
                  </div>

                  {/* Scale Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Resolution Scale
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {scaleOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setScale(option.value)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            scale === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {option.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            {status === "processing" && (
              <ProcessingProgress
                current={progress.current}
                total={progress.total}
                label="Converting pages..."
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
                  message={`Converted ${results.length} pages to JPG!`}
                />

                {/* Image Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {results.map((result) => (
                    <div
                      key={result.pageNumber}
                      className="group relative aspect-[3/4] bg-muted rounded-lg overflow-hidden border border-border"
                    >
                      <img
                        src={URL.createObjectURL(result.blob)}
                        alt={`Page ${result.pageNumber}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <DownloadButton
                          blob={result.blob}
                          filename={`page-${result.pageNumber}.jpg`}
                          size="sm"
                        >
                          Page {result.pageNumber}
                        </DownloadButton>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                        Page {result.pageNumber}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadAllButton
                    files={downloadFiles}
                    zipFilename="pdf-images.zip"
                    className="flex-1"
                  />
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    Convert Another PDF
                  </button>
                </div>
              </div>
            )}

            {/* Convert Button */}
            {status === "idle" && pageCount > 0 && (
              <button
                onClick={convertToImages}
                disabled={!pdfjs}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {pdfjs
                  ? `Convert ${pageCount} Pages to JPG`
                  : "Loading PDF processor..."}
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
