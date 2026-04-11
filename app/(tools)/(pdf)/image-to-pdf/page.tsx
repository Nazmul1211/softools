"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { imagesToPDF } from "@/lib/pdf";
import {
  GripVertical,
  Shield,
  Zap,
  FileDown,
  Settings2,
  X,
  Image as ImageIcon,
  RefreshCcw,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "What image formats can I convert to PDF?",
    answer:
      "Our tool natively supports JPEG/JPG and PNG images — the two most common image formats worldwide. For other formats like WebP, BMP, GIF, and TIFF, the tool automatically converts them to JPEG in your browser before embedding them in the PDF. This means virtually any browser-supported image format will work. For best results, use high-resolution JPEG or PNG files.",
  },
  {
    question: "Can I combine multiple images into a single PDF?",
    answer:
      "Yes, this is one of the tool's primary features. Upload as many images as you need, drag and drop to reorder them, and click Convert. Each image becomes a separate page in the resulting PDF document. This is perfect for creating photo albums, portfolio presentations, combining scanned receipts, or assembling image-based reports into a single, easy-to-share PDF file.",
  },
  {
    question: "What page sizes are available?",
    answer:
      "We offer three page size options: A4 (210 × 297 mm, the international standard used in 95% of countries), US Letter (8.5 × 11 inches, standard in North America), and Fit to Image (the PDF page is sized exactly to the image dimensions with optional margins). A4 and Letter modes also support landscape orientation for wide images.",
  },
  {
    question: "Does the conversion reduce image quality?",
    answer:
      "For JPEG and PNG files, images are embedded directly into the PDF without recompression — the quality is identical to the original. For non-native formats (WebP, BMP, etc.), the image is converted to JPEG at 95% quality, which produces visually lossless results. The resulting PDF preserves the full resolution and color depth of your original images.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. All processing happens entirely in your web browser using the pdf-lib JavaScript library. Your images never leave your device — no data is transmitted to our servers or any third-party service. This makes our tool safe for converting sensitive photos, confidential documents, medical images, and personal photographs.",
  },
  {
    question: "Is there a limit on the number of images I can convert?",
    answer:
      "There is no hard limit on the number of images. Since processing happens in your browser, the practical limit depends on your device's available memory. Most modern devices can handle 50–100 standard-resolution images without issues. For very large batches (100+ high-resolution images), we recommend processing in smaller groups of 20–30 images at a time.",
  },
];

// ─── Types ─────────────────────────────────────────
type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

// ─── Constants ─────────────────────────────────────
const PAGE_SIZE_OPTIONS: { value: PageSize; label: string; description: string }[] = [
  { value: "a4", label: "A4", description: "210 × 297 mm" },
  { value: "letter", label: "Letter", description: "8.5 × 11 in" },
  { value: "fit", label: "Fit to Image", description: "Auto sized" },
];

const ORIENTATION_OPTIONS: { value: Orientation; label: string }[] = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

const MARGIN_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "None" },
  { value: 18, label: "Small (0.25″)" },
  { value: 36, label: "Normal (0.5″)" },
  { value: 72, label: "Large (1″)" },
];

// ─── Component ─────────────────────────────────────
export default function ImageToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<number>(36);
  const [showSettings, setShowSettings] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
    setResult(null);
    setStatus("idle");
    setError(null);

    // Generate previews for new files
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
    setPreviews((prev) => {
      const newPreviews = [...prev];
      const [removed] = newPreviews.splice(fromIndex, 1);
      newPreviews.splice(toIndex, 0, removed);
      return newPreviews;
    });
    setResult(null);
    setStatus("idle");
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveFile(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setError(null);

    try {
      const pdfBlob = await imagesToPDF(files, {
        pageSize,
        orientation,
        margin,
      });
      setResult(pdfBlob);
      setStatus("done");
    } catch (err) {
      console.error("Conversion failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to convert images to PDF. Please try again."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPreviews([]);
    setResult(null);
    setStatus("idle");
    setError(null);
  };

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Convert JPG, PNG, and WebP images to PDF online. Combine multiple images into a single PDF document with custom page size, orientation, and margins. 100% free, private, and secure."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Upload Images",
          text: "Drag and drop your images or click to browse. Add JPG, PNG, WebP, or other image formats.",
        },
        {
          name: "Arrange & Configure",
          text: "Drag images to reorder pages. Choose page size (A4, Letter, or Fit), orientation, and margin.",
        },
        {
          name: "Convert to PDF",
          text: "Click Convert. Each image becomes a PDF page. Download your combined PDF document.",
        },
      ]}
      relatedTools={[
        { name: "PDF to JPG", href: "/pdf-to-jpg/" },
        { name: "PDF Merger", href: "/pdf-merger/" },
        { name: "Image Compressor", href: "/image-compressor/" },
        { name: "Image Resizer", href: "/image-resizer/" },
        { name: "PDF Compressor", href: "/pdf-compressor/" },
      ]}
      content={
        <>
          <h2>What Is an Image to PDF Converter?</h2>
          <p>
            An image to PDF converter transforms individual image files — such as JPEG photographs, PNG graphics, or WebP illustrations — into pages of a Portable Document Format (PDF) file. This is one of the most commonly needed file conversion operations on the internet, used daily by millions of people to share, archive, and print image-based content in a universally compatible format. Our free converter processes everything in your browser for maximum privacy and speed.
          </p>

          <h2>How Does Image-to-PDF Conversion Work?</h2>
          <p>
            The conversion process embeds each image as a full-page element within a new PDF document. The PDF format (defined by ISO 32000-2:2020) supports inline embedding of JPEG and PNG image data directly into the file structure — meaning the original image bytes are placed inside the PDF without recompression or quality loss.
          </p>
          <h3>The Conversion Process</h3>
          <p>
            <strong>Step 1:</strong> Each image file is read into memory. <strong>Step 2:</strong> The image dimensions (width × height in pixels) are calculated and mapped to the chosen page size using a scaling algorithm that preserves the original aspect ratio. <strong>Step 3:</strong> The image is centered on the PDF page with optional margins. <strong>Step 4:</strong> All pages are assembled into a single PDF document and saved.
          </p>
          <h3>Worked Example</h3>
          <p>
            Suppose you have a 3000 × 4000 pixel JPEG photo that you want to convert to an A4 PDF with normal (0.5 inch) margins. The A4 page is 595.28 × 841.89 points. Subtracting margins (36 points each side) gives an available area of 523.28 × 769.89 points. The image aspect ratio is 3:4, which fits naturally within the portrait A4 frame. The scaling factor is min(523.28/3000, 769.89/4000) = min(0.174, 0.192) = 0.174. The image is rendered at 523.28 × 697.71 points, centered horizontally and vertically on the page.
          </p>

          <h2>Understanding Page Size Options</h2>
          <p>
            <strong>A4 (210 × 297 mm):</strong> The international standard paper size used by 95% of countries worldwide (ISO 216). Choose this for documents that will be printed or shared internationally. At 72 DPI, an A4 page is 595 × 842 points.
          </p>
          <p>
            <strong>US Letter (8.5 × 11 inches):</strong> The standard paper size in the United States, Canada, and parts of Latin America. Choose this for documents intended for North American printing. At 72 DPI, a Letter page is 612 × 792 points.
          </p>
          <p>
            <strong>Fit to Image:</strong> The PDF page is sized exactly to match the image dimensions (plus margins). This produces the most compact PDF and preserves the exact visual proportions of your images without any white space.
          </p>

          <h2>When to Use Image to PDF Conversion</h2>
          <ul>
            <li><strong>Sharing photos:</strong> PDFs are universally openable — every device and operating system supports them, unlike WebP or HEIC which require specific viewers.</li>
            <li><strong>Creating portfolios:</strong> Designers, photographers, and artists can compile work samples into a single, professionally presented document.</li>
            <li><strong>Scanning and archiving:</strong> Phone camera captures of receipts, business cards, whiteboards, and documents can be organized into PDF archives.</li>
            <li><strong>Printing:</strong> PDFs maintain exact layout and sizing when printed — images in PDFs print at the exact dimensions you specified.</li>
            <li><strong>Email attachments:</strong> One PDF is easier to manage than 20 separate image files, reduces total attachment size, and prevents images from displaying inline in email threads.</li>
            <li><strong>Legal and government forms:</strong> Many agencies require document scans submitted as PDF, not as individual image files.</li>
          </ul>

          <h2>Image Format Compatibility</h2>
          <table>
            <thead>
              <tr><th>Format</th><th>Embedding Method</th><th>Quality</th></tr>
            </thead>
            <tbody>
              <tr><td>JPEG/JPG</td><td>Direct embedding (native)</td><td>Identical to original</td></tr>
              <tr><td>PNG</td><td>Direct embedding (native)</td><td>Identical to original</td></tr>
              <tr><td>WebP</td><td>Canvas conversion → JPEG</td><td>95% quality (visually lossless)</td></tr>
              <tr><td>BMP</td><td>Canvas conversion → JPEG</td><td>95% quality (visually lossless)</td></tr>
              <tr><td>GIF</td><td>Canvas conversion → JPEG</td><td>95% quality (first frame only)</td></tr>
            </tbody>
          </table>

          <h2>Privacy and Security</h2>
          <p>
            Our Image to PDF converter uses the <strong>pdf-lib</strong> JavaScript library to process your files entirely within your web browser. No images are uploaded to any server. The conversion happens in your browser's memory, and the resulting PDF is generated locally on your device. This architecture makes our tool safe for converting confidential photographs, medical images, identification documents, and personal content.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>ISO 32000-2:2020 — Document management — Portable document format — Part 2: PDF 2.0. International Organization for Standardization.</li>
            <li>ISO 216:2007 — Writing paper and certain classes of printed matter — Trimmed sizes — A and B series. International Organization for Standardization.</li>
            <li>W3C. (2023). WebP Image Format. World Wide Web Consortium Specification.</li>
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
            { icon: ImageIcon, text: "Multi-format", sub: "JPG, PNG, WebP" },
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
          accept=".jpg,.jpeg,.png,.webp,.bmp,.gif,image/jpeg,image/png,image/webp,image/bmp,image/gif"
          maxSize={50}
          multiple
          onFileSelect={handleFileSelect}
          description="JPG, PNG, WebP, BMP, GIF — up to 50MB each"
          disabled={status === "processing"}
        />

        {/* Image List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {files.length} image{files.length !== 1 ? "s" : ""} selected
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showSettings
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "hover:bg-muted border border-border"
                  }`}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Settings
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Page Size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Page Size</label>
                    <div className="space-y-1.5">
                      {PAGE_SIZE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setPageSize(opt.value)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            pageSize === opt.value
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "hover:bg-muted border border-transparent"
                          }`}
                        >
                          <span className="font-medium">{opt.label}</span>
                          <span className="text-muted-foreground ml-1">({opt.description})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Orientation</label>
                    <div className="space-y-1.5">
                      {ORIENTATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setOrientation(opt.value)}
                          disabled={pageSize === "fit"}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            orientation === opt.value && pageSize !== "fit"
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "hover:bg-muted border border-transparent"
                          } ${pageSize === "fit" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {pageSize === "fit" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Orientation is auto-detected in Fit mode
                      </p>
                    )}
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Margin</label>
                    <div className="space-y-1.5">
                      {MARGIN_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setMargin(opt.value)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            margin === opt.value
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "hover:bg-muted border border-transparent"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Thumbnails with drag/drop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  draggable={status !== "processing"}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group rounded-lg border overflow-hidden transition-all ${
                    draggedIndex === index
                      ? "border-primary opacity-50 scale-95"
                      : "border-border hover:border-primary/50"
                  } ${status !== "processing" ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {/* Preview */}
                  <div className="aspect-[3/4] bg-muted/50 relative">
                    {previews[index] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[index]}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Page number badge */}
                    <div className="absolute top-1.5 left-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white text-xs font-medium">
                      {index + 1}
                    </div>
                    {/* Remove button */}
                    {status !== "processing" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    {/* Drag handle */}
                    {status !== "processing" && files.length > 1 && (
                      <div className="absolute bottom-1.5 right-1.5 p-1 rounded bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            {status === "processing" && (
              <ProcessingStatus
                status="processing"
                message="Converting images to PDF..."
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
                  message={`Successfully converted ${files.length} image${files.length !== 1 ? "s" : ""} to PDF!`}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <DownloadButton
                    blob={result}
                    filename="images-to-pdf.pdf"
                    className="flex-1"
                    size="lg"
                  >
                    Download PDF
                  </DownloadButton>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Convert More Images
                  </button>
                </div>
              </div>
            )}

            {/* Convert Button */}
            {status === "idle" && files.length > 0 && (
              <button
                onClick={handleConvert}
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <ImageIcon className="h-5 w-5" />
                Convert {files.length} Image{files.length !== 1 ? "s" : ""} to PDF
              </button>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
