"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { rotatePDF, getPDFInfo } from "@/lib/pdf";
import {
  RotateCw,
  RotateCcw,
  Shield,
  Zap,
  FileDown,
  RefreshCcw,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "Does rotating a PDF affect the text or image quality?",
    answer:
      "No. Rotating a PDF using our tool is a lossless operation — it modifies the page's orientation metadata without recompressing or resampling the content. Text remains searchable, images retain their original resolution, and all annotations, bookmarks, and hyperlinks are preserved exactly as they were before rotation.",
  },
  {
    question: "Can I rotate only specific pages in my PDF?",
    answer:
      "Yes. After uploading your PDF, you can see a page preview with individual rotation controls for each page. Use the rotation buttons on any individual page to rotate it independently, or use the 'Rotate All' button to apply the same rotation to every page at once. This is especially useful for scanned documents where some pages were fed in the wrong orientation.",
  },
  {
    question: "What rotation angles are supported?",
    answer:
      "Our tool supports three rotation angles: 90° clockwise (turns the page right), 180° (flips the page upside down), and 270° clockwise — which is equivalent to a 90° counter-clockwise rotation (turns the page left). These cover all standard page orientation corrections defined in the PDF/A specification (ISO 19005).",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. Our Rotate PDF tool processes your files entirely within your web browser using client-side JavaScript and the pdf-lib library. Your PDF never leaves your device — no data is transmitted to any server. This makes it ideal for confidential documents, legal contracts, medical records, or any sensitive files that should not be uploaded to third-party servers.",
  },
  {
    question: "Is there a file size limit for rotating PDFs?",
    answer:
      "Because processing happens in your browser, the effective limit depends on your device's available memory (RAM). Most modern devices can handle PDFs up to 100 MB with no issues. For very large files (100+ pages with high-resolution images), performance may vary. We recommend using Google Chrome or Edge for the best performance with large PDFs.",
  },
  {
    question: "Why do some scanned PDFs appear sideways or upside down?",
    answer:
      "This is a common issue with document scanners and multifunction printers. When pages are fed into the automatic document feeder (ADF) in the wrong orientation — or when a scanner does not properly detect page direction — the resulting PDF pages can be rotated 90° or 180° from their intended orientation. Our tool corrects this instantly without requiring you to re-scan the original documents.",
  },
];

// ─── Types ─────────────────────────────────────────
type RotationAngle = 0 | 90 | 180 | 270;

interface PageInfo {
  pageNumber: number;
  rotation: RotationAngle;
}

// ─── Constants ─────────────────────────────────────
const ROTATION_OPTIONS: { value: RotationAngle; label: string; icon: string }[] = [
  { value: 90, label: "90° CW", icon: "↻" },
  { value: 180, label: "180°", icon: "↕" },
  { value: 270, label: "90° CCW", icon: "↺" },
];

// ─── Helper Functions ──────────────────────────────
function rotateAngle(current: RotationAngle, direction: "cw" | "ccw"): RotationAngle {
  if (direction === "cw") {
    return ((current + 90) % 360) as RotationAngle;
  }
  return ((current - 90 + 360) % 360) as RotationAngle;
}

// ─── Component ─────────────────────────────────────
export default function RotatePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRotations, setPageRotations] = useState<PageInfo[]>([]);
  const [globalRotation, setGlobalRotation] = useState<RotationAngle>(90);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFiles: File[]) => {
    const selectedFile = selectedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setStatus("loading");
    setError(null);

    try {
      const info = await getPDFInfo(selectedFile);
      setPageCount(info.pageCount);
      setPageRotations(
        Array.from({ length: info.pageCount }, (_, i) => ({
          pageNumber: i + 1,
          rotation: 0 as RotationAngle,
        }))
      );
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to read the PDF. The file may be corrupted or password-protected."
      );
      setStatus("error");
    }
  }, []);

  const rotateAllPages = (angle: RotationAngle) => {
    setPageRotations((prev) =>
      prev.map((p) => ({ ...p, rotation: angle }))
    );
    setGlobalRotation(angle);
    setResult(null);
    setStatus("ready");
  };

  const rotateSinglePage = (pageIndex: number, direction: "cw" | "ccw") => {
    setPageRotations((prev) =>
      prev.map((p, i) =>
        i === pageIndex
          ? { ...p, rotation: rotateAngle(p.rotation, direction) }
          : p
      )
    );
    setResult(null);
    setStatus("ready");
  };

  const handleRotate = async () => {
    if (!file) return;

    setStatus("processing");
    setError(null);

    try {
      // Check if all pages have the same rotation
      const allSame = pageRotations.every(
        (p) => p.rotation === pageRotations[0].rotation
      );

      let rotatedBlob: Blob;

      if (allSame && pageRotations[0].rotation !== 0) {
        // Use the simpler rotatePDF for uniform rotation
        rotatedBlob = await rotatePDF(file, pageRotations[0].rotation);
      } else if (!allSame) {
        // Use rotateSpecificPages for mixed rotations
        const { rotateSpecificPages } = await import("@/lib/pdf/pdfUtils");
        const rotationMap = new Map<number, RotationAngle>();
        pageRotations.forEach((p, i) => {
          if (p.rotation !== 0) {
            rotationMap.set(i, p.rotation);
          }
        });

        if (rotationMap.size === 0) {
          setError("No rotation applied. Please select a rotation angle for at least one page.");
          setStatus("ready");
          return;
        }

        rotatedBlob = await rotateSpecificPages(file, rotationMap);
      } else {
        setError("No rotation applied. Please select a rotation angle.");
        setStatus("ready");
        return;
      }

      setResult(rotatedBlob);
      setStatus("done");
    } catch (err) {
      console.error("Rotation failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to rotate PDF. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPageRotations([]);
    setResult(null);
    setStatus("idle");
    setError(null);
  };

  const hasRotation = pageRotations.some((p) => p.rotation !== 0);

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate PDF pages 90°, 180°, or 270° instantly. Select specific pages or rotate them all at once. 100% client-side — your files never leave your device."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Upload Your PDF",
          text: "Drag and drop your PDF file or click to browse and select it from your device.",
        },
        {
          name: "Choose Rotation",
          text: "Select a rotation angle — 90° clockwise, 180°, or 90° counter-clockwise. Apply to all pages or rotate individual pages.",
        },
        {
          name: "Rotate & Download",
          text: "Click the Rotate button. Processing happens instantly in your browser. Download the rotated PDF.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merger", href: "/pdf-merger/" },
        { name: "PDF Splitter", href: "/pdf-splitter/" },
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "PDF to JPG", href: "/pdf-to-jpg/" },
        { name: "Add Page Numbers to PDF", href: "/add-page-numbers-to-pdf/" },
      ]}
      content={
        <>
          <h2>What Is a PDF Rotator?</h2>
          <p>
            A PDF rotator is a tool that changes the orientation of pages within a PDF document. Whether a scanned page came out sideways, a presentation slide needs to be flipped, or an entire document was exported in the wrong orientation, a PDF rotator corrects these issues without altering the content, quality, or structure of the document. Our free online PDF rotator processes everything in your browser — your files are never uploaded to any server.
          </p>

          <h2>How Does PDF Rotation Work?</h2>
          <p>
            PDF rotation works by modifying the <strong>/Rotate</strong> entry in the page dictionary of the PDF, as defined in the PDF specification (ISO 32000-2:2020). This is a metadata-level change — the actual content streams (text, images, vector graphics) remain untouched. The rotation value tells PDF viewers how to orient the page when displaying it.
          </p>
          <h3>The PDF Rotation Model</h3>
          <p>
            The PDF format supports four rotation values: <strong>0°</strong> (default, no rotation), <strong>90°</strong> (quarter turn clockwise), <strong>180°</strong> (half turn), and <strong>270°</strong> (quarter turn counter-clockwise, or three-quarter turn clockwise). These are the only valid values per the PDF/A standard — arbitrary angles like 45° are not supported at the page level.
          </p>
          <h3>Worked Example</h3>
          <p>
            Consider a 10-page scanned document where pages 3, 5, and 7 were fed into the scanner in landscape orientation while the rest are in portrait. Using our tool, you would: (1) upload the PDF, (2) click the 90° CW button on pages 3, 5, and 7 individually, and (3) click Rotate. The result is a corrected document where all 10 pages display in the same portrait orientation — no re-scanning required.
          </p>

          <h2>Understanding Rotation Directions</h2>
          <p>
            <strong>90° Clockwise (CW):</strong> The top of the page moves to the right side. Use this when a page appears rotated 90° to the left (counter-clockwise). This is the most common correction for landscape-scanned pages.
          </p>
          <p>
            <strong>180°:</strong> The page is flipped upside down. Use this when a page is completely inverted — text appears upside down. This often happens with double-sided scanning when the back side is fed incorrectly.
          </p>
          <p>
            <strong>90° Counter-Clockwise (CCW) / 270° CW:</strong> The top of the page moves to the left side. Use this for pages that appear rotated 90° to the right (clockwise). Less common than CW rotation but needed for certain scanner configurations.
          </p>

          <h2>Common Scenarios for PDF Rotation</h2>
          <ul>
            <li><strong>Scanned documents:</strong> Automatic document feeders (ADF) frequently produce pages in mixed orientations, especially when mixing letter and legal-size paper.</li>
            <li><strong>Mobile photos:</strong> PDFs created from phone camera captures often inherit the device's orientation metadata, resulting in sideways pages.</li>
            <li><strong>Merged documents:</strong> When combining PDFs from different sources, some pages may be in portrait while others are in landscape.</li>
            <li><strong>Presentation exports:</strong> PowerPoint-to-PDF exports sometimes rotate slides incorrectly, particularly when mixing slide orientations.</li>
            <li><strong>Architectural plans:</strong> Engineering and architectural drawings are often in landscape format and may need rotation for printing on portrait printers.</li>
          </ul>

          <h2>Rotate PDF vs. Re-Scanning</h2>
          <p>
            Re-scanning a document takes time, wastes paper, and risks damaging originals. PDF rotation is instantaneous, lossless, and non-destructive. The original document data is preserved bit-for-bit — only the orientation metadata changes. For organizations processing hundreds of scanned documents per day, this saves significant time and reduces operational costs.
          </p>

          <h2>Privacy and Security</h2>
          <p>
            Our PDF rotation tool uses the <strong>pdf-lib</strong> library to process your files entirely within your web browser. No file data is transmitted to our servers or any third-party service. Your PDF is read into your browser's memory, the rotation metadata is modified, and the resulting file is generated locally on your device. This makes our tool safe for rotating confidential legal documents, medical records, financial statements, and other sensitive files.
          </p>

          <h2>Technical Specifications</h2>
          <table>
            <thead>
              <tr><th>Feature</th><th>Specification</th></tr>
            </thead>
            <tbody>
              <tr><td>Supported Angles</td><td>90° CW, 180°, 270° CW (90° CCW)</td></tr>
              <tr><td>Page Selection</td><td>All pages or individual pages</td></tr>
              <tr><td>Processing</td><td>100% client-side (browser)</td></tr>
              <tr><td>Quality Loss</td><td>None (lossless metadata operation)</td></tr>
              <tr><td>Max File Size</td><td>~100 MB (device-dependent)</td></tr>
              <tr><td>PDF Standard</td><td>Compatible with PDF 1.0–2.0, PDF/A</td></tr>
              <tr><td>Preserves</td><td>Text, images, annotations, bookmarks, links, form fields</td></tr>
            </tbody>
          </table>

          <h2>Sources and References</h2>
          <ul>
            <li>ISO 32000-2:2020 — Document management — Portable document format — Part 2: PDF 2.0. International Organization for Standardization.</li>
            <li>ISO 19005-4:2020 — Document management — Electronic document file format for long-term preservation — Part 4: Use of ISO 32000-2 (PDF/A-4).</li>
            <li>Adobe Systems Inc. (2008). PDF Reference, Sixth Edition, version 1.7. Adobe Developer Connection.</li>
            <li>pdf-lib — Open-source JavaScript library for creating and modifying PDF documents. github.com/Hopding/pdf-lib.</li>
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
            { icon: RotateCw, text: "Flexible", sub: "Per-page control" },
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
        {status === "idle" && (
          <FileDropzone
            accept=".pdf,application/pdf"
            maxSize={100}
            onFileSelect={handleFileSelect}
            description="PDF files up to 100MB"
          />
        )}

        {/* Loading State */}
        {status === "loading" && (
          <ProcessingStatus status="processing" message="Reading PDF..." />
        )}

        {/* File Info + Rotation Controls */}
        {file && (status === "ready" || status === "processing" || status === "done") && (
          <div className="space-y-6">
            {/* File Preview */}
            <FilePreview
              file={file}
              onRemove={handleReset}
              status={status === "done" ? "done" : "idle"}
            />

            {/* Global Rotation Controls */}
            {status === "ready" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    Rotate All Pages ({pageCount} {pageCount === 1 ? "page" : "pages"})
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {ROTATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => rotateAllPages(opt.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                        globalRotation === opt.value &&
                        pageRotations.every((p) => p.rotation === opt.value)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Per-Page Controls */}
                {pageCount > 1 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Or rotate individual pages:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {pageRotations.map((page, index) => (
                        <div
                          key={page.pageNumber}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                            page.rotation !== 0
                              ? "border-primary/50 bg-primary/5"
                              : "border-border bg-white dark:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center justify-center w-12 h-16 rounded bg-muted/50 text-sm font-medium text-muted-foreground"
                            style={{ transform: `rotate(${page.rotation}deg)` }}
                          >
                            <span style={{ transform: `rotate(-${page.rotation}deg)` }}>
                              {page.pageNumber}
                            </span>
                          </div>
                          <p className="text-xs font-medium">Page {page.pageNumber}</p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => rotateSinglePage(index, "ccw")}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              aria-label={`Rotate page ${page.pageNumber} counter-clockwise`}
                              title="Rotate CCW"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => rotateSinglePage(index, "cw")}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              aria-label={`Rotate page ${page.pageNumber} clockwise`}
                              title="Rotate CW"
                            >
                              <RotateCw className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {page.rotation !== 0 && (
                            <span className="text-xs text-primary font-medium">
                              {page.rotation}°
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Processing */}
            {status === "processing" && (
              <ProcessingStatus status="processing" message="Rotating PDF pages..." />
            )}

            {/* Results */}
            {status === "done" && result && (
              <div className="space-y-4">
                <ProcessingStatus
                  status="done"
                  message="PDF rotated successfully!"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton
                    blob={result}
                    filename={`rotated-${file.name}`}
                    className="flex-1"
                    size="lg"
                  >
                    Download Rotated PDF
                  </DownloadButton>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Rotate Another PDF
                  </button>
                </div>
              </div>
            )}

            {/* Rotate Button */}
            {status === "ready" && hasRotation && (
              <button
                onClick={handleRotate}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="h-5 w-5" />
                Rotate PDF
              </button>
            )}

            {status === "ready" && !hasRotation && (
              <p className="text-center text-muted-foreground text-sm">
                Select a rotation angle above, then click Rotate.
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="space-y-4">
            <ProcessingStatus status="error" message={error} />
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
