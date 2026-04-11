"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import {
  addPageNumbers,
  getPDFInfo,
  PageNumberPosition,
  AddPageNumbersOptions,
} from "@/lib/pdf";
import {
  Shield,
  Zap,
  FileDown,
  Hash,
  RefreshCcw,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "What page number formats are available?",
    answer:
      "Our tool supports three numbering formats: Arabic numerals (1, 2, 3...) for standard documents, Roman numerals (i, ii, iii...) commonly used for prefaces and front matter in academic publications, and 'Page X of Y' format (Page 1 of 10) which provides context about document length. These formats follow typography conventions defined by the Chicago Manual of Style (17th edition) and are used universally in professional publishing.",
  },
  {
    question: "Can I choose where page numbers appear on the page?",
    answer:
      "Yes. You can position page numbers in six locations: bottom-center (the most common placement for books and reports), bottom-left, bottom-right, top-center (common in academic papers), top-left, or top-right. Each position places the number 0.5 inches (36 points) from the page edge, which is the standard margin for printed documents per the American Psychological Association (APA) style guide.",
  },
  {
    question: "Can I skip numbering on the first page (like a title page)?",
    answer:
      "Yes. Use the 'Start numbering from page' option to skip the title page or any number of initial pages. For example, if your PDF has a cover page and a table of contents, set 'Start from page' to 3 and 'Start number at' to 1. Pages 1 and 2 will remain unnumbered, and page 3 will display as page 1. This matches the standard convention in book publishing and academic papers.",
  },
  {
    question: "Does adding page numbers change the original content?",
    answer:
      "The original content (text, images, graphics) is preserved exactly as it was. Page numbers are drawn as an overlay on top of existing content using the Helvetica font. The numbers are rendered at a customizable font size with a subtle gray color (RGB 77, 77, 77) that is visible but not distracting. If a number overlaps with existing content in an edge case, adjusting the position (e.g., moving from bottom-center to bottom-right) resolves the issue.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. All processing is performed entirely within your web browser using the pdf-lib JavaScript library. Your PDF file stays on your device — no data is sent to our servers or any third-party service. This makes our tool safe for numbering confidential legal documents, contracts, court filings, medical records, and any sensitive documents that require page numbering.",
  },
  {
    question: "What is 'Bates numbering' and does this tool support it?",
    answer:
      "Bates numbering is a sequential numbering system used in the legal profession to identify and label every page of a document for litigation discovery. While our tool provides basic sequential page numbering, dedicated Bates numbering requires alphanumeric prefixes/suffixes (e.g., 'ABC-000001') and audit-trail metadata. Our tool covers the most common use case: simple numeric, Roman, or 'Page X of Y' numbering for reports, manuscripts, and general documents.",
  },
];

// ─── Types ─────────────────────────────────────────
type NumberFormat = "number" | "page-x-of-y" | "roman";

// ─── Constants ─────────────────────────────────────
const POSITION_OPTIONS: {
  value: PageNumberPosition;
  label: string;
  icon: typeof AlignCenter;
  area: "bottom" | "top";
}[] = [
  { value: "bottom-left", label: "Bottom Left", icon: AlignLeft, area: "bottom" },
  { value: "bottom-center", label: "Bottom Center", icon: AlignCenter, area: "bottom" },
  { value: "bottom-right", label: "Bottom Right", icon: AlignRight, area: "bottom" },
  { value: "top-left", label: "Top Left", icon: AlignLeft, area: "top" },
  { value: "top-center", label: "Top Center", icon: AlignCenter, area: "top" },
  { value: "top-right", label: "Top Right", icon: AlignRight, area: "top" },
];

const FORMAT_OPTIONS: { value: NumberFormat; label: string; example: string }[] = [
  { value: "number", label: "Arabic (1, 2, 3...)", example: "1" },
  { value: "page-x-of-y", label: "Page X of Y", example: "Page 1 of 10" },
  { value: "roman", label: "Roman (i, ii, iii...)", example: "i" },
];

const FONT_SIZE_OPTIONS = [8, 10, 12, 14, 16];

// ─── Component ─────────────────────────────────────
export default function AddPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [format, setFormat] = useState<NumberFormat>("number");
  const [fontSize, setFontSize] = useState<number>(12);
  const [startFrom, setStartFrom] = useState<number>(1);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "processing" | "done" | "error"
  >("idle");
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
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to read PDF. The file may be corrupted or password-protected."
      );
      setStatus("error");
    }
  }, []);

  const handleAddNumbers = async () => {
    if (!file) return;

    setStatus("processing");
    setError(null);

    try {
      const options: AddPageNumbersOptions = {
        position,
        format,
        fontSize,
        startFrom,
        startNumber,
      };

      const numberedBlob = await addPageNumbers(file, options);
      setResult(numberedBlob);
      setStatus("done");
    } catch (err) {
      console.error("Page numbering failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add page numbers. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setResult(null);
    setStatus("idle");
    setError(null);
    setPosition("bottom-center");
    setFormat("number");
    setFontSize(12);
    setStartFrom(1);
    setStartNumber(1);
  };

  // Generate preview text based on current settings
  const getPreviewText = () => {
    const totalPages = pageCount - (startFrom - 1);
    if (format === "number") return `${startNumber}`;
    if (format === "page-x-of-y")
      return `Page ${startNumber} of ${totalPages > 0 ? totalPages : "?"}`;
    if (format === "roman") {
      const romanNumerals: [number, string][] = [
        [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
      ];
      let result = "";
      let num = startNumber;
      for (const [value, symbol] of romanNumerals) {
        while (num >= value) {
          result += symbol;
          num -= value;
        }
      }
      return result;
    }
    return `${startNumber}`;
  };

  return (
    <ToolLayout
      title="Add Page Numbers to PDF"
      description="Add page numbers to any PDF document online for free. Choose from Arabic numbers, Roman numerals, or 'Page X of Y' format. Position numbers at the top or bottom of each page. 100% client-side processing."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Upload Your PDF",
          text: "Drag and drop your PDF file or click to browse. The tool reads your file locally in the browser.",
        },
        {
          name: "Configure Page Numbers",
          text: "Choose number format (Arabic, Roman, or 'Page X of Y'), position (6 options), font size, and which page to start from.",
        },
        {
          name: "Add Numbers & Download",
          text: "Click 'Add Page Numbers'. Processing happens instantly in your browser. Download the numbered PDF.",
        },
      ]}
      relatedTools={[
        { name: "PDF Merger", href: "/pdf-merger/" },
        { name: "PDF Splitter", href: "/pdf-splitter/" },
        { name: "Rotate PDF", href: "/rotate-pdf/" },
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "PDF to JPG", href: "/pdf-to-jpg/" },
      ]}
      content={
        <>
          <h2>What Is PDF Page Numbering?</h2>
          <p>
            PDF page numbering is the process of adding sequential numbers to each page of a PDF document to indicate page order. Page numbers are one of the most fundamental elements of document structure — they enable readers to navigate content, reference specific sections, and verify document completeness. Despite their simplicity, many PDFs are created without page numbers, particularly those generated from scanned images, merged documents, or exported presentations.
          </p>

          <h2>How Does PDF Page Numbering Work?</h2>
          <p>
            Our tool adds page numbers by drawing text directly onto each PDF page using the pdf-lib library. The process modifies the content stream of each page to overlay the number at your chosen position. The original page content — text, images, vector graphics, annotations, and hyperlinks — remains entirely unchanged.
          </p>
          <h3>The Numbering Process</h3>
          <p>
            <strong>Step 1:</strong> The PDF is loaded into your browser's memory. <strong>Step 2:</strong> The Helvetica font is embedded into the document (a standard PDF font that renders correctly on every PDF viewer). <strong>Step 3:</strong> For each page from the starting page onward, the tool calculates the text string (e.g., &quot;1&quot;, &quot;Page 3 of 10&quot;, or &quot;iv&quot;), measures its width using font metrics, and draws it at the specified position with the chosen font size. <strong>Step 4:</strong> The modified PDF is saved as a new file.
          </p>
          <h3>Worked Example</h3>
          <p>
            Consider a 25-page PDF thesis with a cover page and a table of contents on page 2. You want Arabic numbering starting from page 3, beginning at number 1. Configuration: format = &quot;1, 2, 3...&quot;, position = &quot;Bottom Center&quot;, start from page = 3, start number = 1. Result: pages 1–2 are unnumbered, page 3 shows &quot;1&quot;, page 4 shows &quot;2&quot;, and page 25 shows &quot;23&quot;. The total page count in a &quot;Page X of Y&quot; format would show &quot;Page 1 of 23&quot;.
          </p>

          <h2>Understanding Number Formats</h2>
          <p>
            <strong>Arabic Numerals (1, 2, 3...):</strong> The standard numbering system used for the body content of most documents worldwide. Simple, universally understood, and appropriate for reports, manuscripts, contracts, and everyday documents. This is the default format recommended by most style guides including APA, MLA, and Chicago.
          </p>
          <p>
            <strong>Page X of Y (Page 1 of 10):</strong> Provides context about document length. Especially useful for legal documents, contracts, and official submissions where the reader needs to verify that no pages are missing. The format is also used in printed forms and government applications.
          </p>
          <p>
            <strong>Roman Numerals (i, ii, iii...):</strong> Traditionally used for front matter in books and academic publications — prefaces, forewords, acknowledgments, and tables of contents. The standard convention in academic publishing (per the Chicago Manual of Style, 17th edition) is to use lowercase Roman numerals for front matter and switch to Arabic numerals for the body text.
          </p>

          <h2>Positioning Options Explained</h2>
          <table>
            <thead>
              <tr><th>Position</th><th>Best For</th><th>Convention</th></tr>
            </thead>
            <tbody>
              <tr><td>Bottom Center</td><td>Books, reports, manuscripts</td><td>Most common position in publishing</td></tr>
              <tr><td>Bottom Right</td><td>Academic papers (APA style)</td><td>APA 7th edition standard</td></tr>
              <tr><td>Bottom Left</td><td>Legal documents</td><td>Common in legal filings</td></tr>
              <tr><td>Top Center</td><td>Academic papers, running headers</td><td>MLA style standard</td></tr>
              <tr><td>Top Right</td><td>Academic papers (APA body)</td><td>APA header with running head</td></tr>
              <tr><td>Top Left</td><td>Technical documentation</td><td>ISO document standards</td></tr>
            </tbody>
          </table>

          <h2>Common Use Cases for PDF Page Numbering</h2>
          <ul>
            <li><strong>Legal documents:</strong> Court filings, contracts, and discovery documents require sequential page numbering for referencing in proceedings.</li>
            <li><strong>Academic submissions:</strong> Theses, dissertations, and research papers require specific page numbering formats defined by their institution's style guide.</li>
            <li><strong>Merged documents:</strong> After combining multiple PDFs with our PDF Merger, the resulting document often needs renumbering to create a coherent page sequence.</li>
            <li><strong>Scanned documents:</strong> PDFs created from scanned paper pages never have page numbers unless the original paper did — adding numbers helps with organization.</li>
            <li><strong>Business reports:</strong> Annual reports, board presentations, and client deliverables look more professional with consistent page numbering.</li>
            <li><strong>Manuscripts:</strong> Publishers require page-numbered manuscripts for editorial review and copyediting.</li>
          </ul>

          <h2>Privacy and Security</h2>
          <p>
            Our page numbering tool uses the <strong>pdf-lib</strong> JavaScript library to process your files entirely within your web browser. Your PDF never leaves your device — no data is transmitted to any server. The Helvetica font used for page numbers is a standard PDF font (defined in ISO 32000-2:2020, Section 9.6.2) that is built into every PDF viewer, so no external font files need to be downloaded.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>ISO 32000-2:2020 — Document management — Portable document format — Part 2: PDF 2.0. International Organization for Standardization.</li>
            <li>University of Chicago Press. (2017). The Chicago Manual of Style, 17th edition. Chapter 1: Books and Journals — Page Numbering.</li>
            <li>American Psychological Association. (2019). Publication Manual (7th edition). Section 2.18: Page Numbers.</li>
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
            { icon: Hash, text: "3 Formats", sub: "Arabic, Roman, X of Y" },
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

        {/* Upload */}
        {status === "idle" && (
          <FileDropzone
            accept=".pdf,application/pdf"
            maxSize={100}
            onFileSelect={handleFileSelect}
            description="PDF files up to 100MB"
          />
        )}

        {/* Loading */}
        {status === "loading" && (
          <ProcessingStatus status="processing" message="Reading PDF..." />
        )}

        {/* Config + Preview */}
        {file && (status === "ready" || status === "processing" || status === "done") && (
          <div className="space-y-6">
            <FilePreview
              file={file}
              onRemove={handleReset}
              status={status === "done" ? "done" : "idle"}
            />

            {status === "ready" && (
              <div className="space-y-6">
                {/* Page info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span>{pageCount} page{pageCount !== 1 ? "s" : ""} detected</span>
                </div>

                {/* Number Format */}
                <div>
                  <label className="block text-sm font-medium mb-3">Number Format</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {FORMAT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFormat(opt.value)}
                        className={`text-left px-4 py-3 rounded-lg border transition-all ${
                          format === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          e.g., {opt.example}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium mb-3">Position</label>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Top</p>
                      <div className="grid grid-cols-3 gap-2">
                        {POSITION_OPTIONS.filter((p) => p.area === "top").map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setPosition(opt.value)}
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                                position === opt.value
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">{opt.label.replace("Top ", "")}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Bottom</p>
                      <div className="grid grid-cols-3 gap-2">
                        {POSITION_OPTIONS.filter((p) => p.area === "bottom").map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => setPosition(opt.value)}
                              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                                position === opt.value
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">{opt.label.replace("Bottom ", "")}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font Size + Start Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      {FONT_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}pt
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start from page</label>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={startFrom}
                      onChange={(e) =>
                        setStartFrom(
                          Math.max(1, Math.min(pageCount, Number(e.target.value) || 1))
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Pages before this will be unnumbered
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start number at</label>
                    <input
                      type="number"
                      min={1}
                      value={startNumber}
                      onChange={(e) =>
                        setStartNumber(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      First numbered page shows this value
                    </p>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="p-4 rounded-lg border border-dashed border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div className="relative mx-auto w-32 h-44 rounded border border-border bg-white dark:bg-muted/40 shadow-sm">
                    {/* Position indicator */}
                    <div
                      className={`absolute left-0 right-0 flex px-2 ${
                        position.startsWith("top") ? "top-1.5" : "bottom-1.5"
                      } ${
                        position.endsWith("center")
                          ? "justify-center"
                          : position.endsWith("left")
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <span
                        className="text-muted-foreground font-mono"
                        style={{ fontSize: `${Math.max(8, fontSize * 0.6)}px` }}
                      >
                        {getPreviewText()}
                      </span>
                    </div>
                    {/* Page placeholder lines */}
                    <div className="absolute top-6 left-3 right-3 space-y-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 bg-muted rounded"
                          style={{ width: `${70 + Math.random() * 30}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Processing */}
            {status === "processing" && (
              <ProcessingStatus
                status="processing"
                message="Adding page numbers..."
              />
            )}

            {/* Results */}
            {status === "done" && result && (
              <div className="space-y-4">
                <ProcessingStatus
                  status="done"
                  message={`Page numbers added to ${pageCount} pages!`}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton
                    blob={result}
                    filename={`numbered-${file.name}`}
                    className="flex-1"
                    size="lg"
                  >
                    Download Numbered PDF
                  </DownloadButton>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Number Another PDF
                  </button>
                </div>
              </div>
            )}

            {/* Action Button */}
            {status === "ready" && (
              <button
                onClick={handleAddNumbers}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Hash className="h-5 w-5" />
                Add Page Numbers
              </button>
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
