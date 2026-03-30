"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import {
  FileText,
  FileType,
  Shield,
  Zap,
  RefreshCcw,
  FileDown,
  CheckCircle2,
} from "lucide-react";

interface ProcessingState {
  status: "idle" | "processing" | "done" | "error";
  message?: string;
}

interface ExtractedContent {
  pages: string[];
  pageCount: number;
}

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({ status: "idle" });
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];

    if (selectedFile.type !== "application/pdf") {
      setProcessing({
        status: "error",
        message: "Please select a valid PDF file",
      });
      return;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (selectedFile.size > maxSize) {
      setProcessing({
        status: "error",
        message: "PDF size must be less than 20MB",
      });
      return;
    }

    setFile(selectedFile);
    setResultBlob(null);
    setExtractedContent(null);
    setProcessing({ status: "idle" });
  }, []);

  const processFile = async () => {
    if (!file) return;

    try {
      setProcessing({ status: "processing", message: "Loading PDF library..." });

      // Dynamically import PDF.js
      const pdfjsLib = await import("pdfjs-dist");

      // Set worker source to local file
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      setProcessing({ status: "processing", message: "Extracting text from PDF..." });

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const pages: string[] = [];

      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        setProcessing({
          status: "processing",
          message: `Extracting page ${i} of ${numPages}...`,
        });

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Combine text items with proper spacing
        let pageText = "";
        let lastY = -1;

        for (const item of textContent.items) {
          if ("str" in item) {
            const y = (item as { transform: number[] }).transform[5];

            // Add newline if Y position changed significantly
            if (lastY !== -1 && Math.abs(y - lastY) > 5) {
              pageText += "\n";
            } else if (pageText && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
              pageText += " ";
            }

            pageText += item.str;
            lastY = y;
          }
        }

        pages.push(pageText.trim());
      }

      setExtractedContent({ pages, pageCount: numPages });
      setProcessing({ status: "processing", message: "Creating Word document..." });

      // Create Word document
      const docx = await import("docx");

      const doc = new docx.Document({
        sections: pages.map((pageText, index) => ({
          properties: {},
          children: [
            // Page header
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `Page ${index + 1}`,
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),
            // Page content - split by newlines
            ...pageText.split("\n").map(
              (line) =>
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: line || " ",
                      size: 24,
                    }),
                  ],
                  spacing: { after: 100 },
                })
            ),
            // Page break (except for last page)
            ...(index < pages.length - 1
              ? [
                  new docx.Paragraph({
                    children: [],
                    pageBreakBefore: true,
                  }),
                ]
              : []),
          ],
        })),
      });

      // Generate the document blob
      const blob = await docx.Packer.toBlob(doc);
      setResultBlob(blob);
      setProcessing({ status: "done", message: "PDF converted successfully!" });
    } catch (error) {
      console.error("Processing failed:", error);
      setProcessing({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to process PDF",
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setResultBlob(null);
    setExtractedContent(null);
    setProcessing({ status: "idle" });
  };

  const getOutputFilename = () => {
    if (!file) return "document.docx";
    const baseName = file.name.replace(/\.pdf$/i, "");
    return `${baseName}.docx`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <ToolLayout
      title="PDF to Word Converter"
      description="Convert PDF files to editable Word documents (DOCX) for free. Extract text from PDFs while preserving basic formatting. All processing happens in your browser - your files never leave your device."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "PDF Merger", href: "/pdf-merger/" },
        { name: "PDF Splitter", href: "/pdf-splitter/" },
        { name: "PDF to JPG Converter", href: "/pdf-to-jpg/" },
      ]}
      howToSteps={[
        {
          name: "Upload PDF",
          text: "Drop your PDF file or click to browse. Maximum file size is 20MB.",
        },
        {
          name: "Extract Text",
          text: "Click 'Convert to Word' to extract text from all pages in your PDF.",
        },
        {
          name: "Create Document",
          text: "The tool creates a Word document with the extracted text content.",
        },
        {
          name: "Download DOCX",
          text: "Download your converted Word document and edit it in any word processor.",
        },
      ]}
      faqs={[
        {
          question: "Is this tool free to use?",
          answer:
            "Yes, our PDF to Word converter is completely free with no signup required. All processing happens locally in your browser.",
        },
        {
          question: "Will my PDF formatting be preserved?",
          answer:
            "This tool extracts text content from PDFs and creates a Word document with basic formatting. Complex layouts, images, and tables may not be perfectly preserved.",
        },
        {
          question: "Are my files uploaded to a server?",
          answer:
            "No! All processing happens entirely in your browser. Your PDF files never leave your device, ensuring complete privacy and security.",
        },
        {
          question: "What is the maximum file size?",
          answer:
            "You can convert PDFs up to 20MB in size. For larger files, consider splitting them first using our PDF Splitter tool.",
        },
        {
          question: "Can I convert scanned PDFs?",
          answer:
            "This tool works best with text-based PDFs. Scanned PDFs (images of text) require OCR technology which is not currently supported.",
        },
        {
          question: "What Word format is the output?",
          answer:
            "The tool creates DOCX files, which is the modern Word format compatible with Microsoft Word, Google Docs, LibreOffice, and other word processors.",
        },
        {
          question: "Can I convert password-protected PDFs?",
          answer:
            "Currently, password-protected PDFs cannot be converted. You'll need to remove the password protection first using the original software that created the PDF.",
        },
        {
          question: "Why are images not included in the output?",
          answer:
            "This tool focuses on text extraction for editing purposes. Images embedded in PDFs are not transferred to maintain fast browser-based processing and privacy.",
        },
      ]}
      content={
        <>
          <h2>Understanding PDF to Word Conversion</h2>
          <p>
            PDF (Portable Document Format) files are designed to preserve document formatting across different devices and operating systems. While this makes PDFs great for sharing final documents, it also makes them difficult to edit. Converting PDF to Word (DOCX) format unlocks your content for editing in Microsoft Word, Google Docs, or any compatible word processor.
          </p>
          <p>
            Our converter extracts text content from your PDF and rebuilds it in Word format. This process works best with text-based PDFs created from word processors, as opposed to scanned documents which are essentially images of text. The resulting DOCX file can be freely edited, reformatted, and restyled to meet your needs.
          </p>

          <h2>How Browser-Based PDF Conversion Works</h2>
          <p>
            Unlike traditional online converters that upload your files to remote servers, our tool processes everything locally in your web browser. We use PDF.js, Mozilla's open-source PDF rendering library, to read and parse PDF files directly on your device. The extracted text is then formatted into a Word document using the docx library.
          </p>
          <p>
            This approach offers significant privacy advantages—your sensitive documents never leave your computer. There's no upload time, no waiting for server processing, and no concerns about third parties accessing your files. The trade-off is that complex formatting may not transfer perfectly, but for text editing purposes, this is often acceptable.
          </p>

          <h2>When to Use PDF to Word Conversion</h2>
          <p>
            PDF to Word conversion is ideal when you need to make significant edits to document content. Common scenarios include updating outdated information in reports, extracting content for repurposing, translating documents, or reformatting content for different purposes. If you only need to make minor annotations, consider using a PDF editor instead.
          </p>
          <p>
            This tool is particularly useful for academic and research work where you need to quote or cite text from PDF sources, legal document review where extracted text is needed for analysis, and business situations where PDF content needs to be incorporated into new documents or presentations.
          </p>

          <h2>Tips for Best Conversion Results</h2>
          <p>
            For optimal results, use PDFs that were created digitally from word processors or design software, rather than scanned documents. These "native" PDFs contain actual text data that can be extracted accurately. The cleaner and simpler the original PDF layout, the better the conversion quality.
          </p>
          <p>
            After conversion, you may need to adjust formatting in Word—paragraph spacing, fonts, and alignment might need refinement. Complex elements like tables, columns, and text boxes may not convert perfectly and might require manual cleanup. Consider the conversion as a starting point that saves you from retyping content manually.
          </p>

          <h2>Privacy and Security Considerations</h2>
          <p>
            Document privacy is a critical concern when converting files online. Many free PDF converters upload your documents to their servers, where they may be stored, analyzed, or even used to train AI models. Our browser-based approach eliminates these risks entirely—your files are processed using your device's own computing power.
          </p>
          <p>
            This makes our tool suitable for sensitive business documents, legal files, medical records, or any content you prefer to keep private. The conversion happens in milliseconds on modern devices, and once complete, you can immediately download your Word file without it ever touching an external server.
          </p>

          <h2>Limitations and Alternatives</h2>
          <p>
            While our tool handles most text-based PDFs well, some limitations exist. Scanned PDFs require OCR (Optical Character Recognition) technology to convert images of text into editable text—this is not currently supported. Similarly, complex layouts with multiple columns, embedded forms, or intricate table structures may not convert perfectly.
          </p>
          <p>
            For PDFs with these characteristics, you might consider Adobe Acrobat's built-in conversion features, which offer more sophisticated formatting preservation. However, for straightforward document editing needs where privacy is paramount, our free browser-based tool provides an excellent balance of convenience, security, and functionality.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {!file && (
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept=".pdf,application/pdf"
            maxSize={20}
            multiple={false}
            description="Drop a PDF file here or click to upload. Maximum file size: 20MB"
          />
        )}

        {/* Processing Status */}
        {processing.status === "processing" && (
          <ProcessingStatus status="processing" message={processing.message} />
        )}

        {/* Error State */}
        {processing.status === "error" && (
          <ProcessingStatus status="error" message={processing.message} />
        )}

        {/* File Preview and Results */}
        {file && (
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                  {extractedContent && ` • ${extractedContent.pageCount} page${extractedContent.pageCount !== 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove file"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </div>

            {/* Success State */}
            {processing.status === "done" && resultBlob && (
              <>
                <ProcessingStatus status="done" message="PDF converted successfully!" />

                {/* Content Preview */}
                {extractedContent && extractedContent.pages[0] && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Content Preview</h3>
                    <div className="max-h-48 overflow-y-auto p-4 bg-muted/30 rounded-lg border text-sm font-mono">
                      {extractedContent.pages[0].slice(0, 500)}
                      {extractedContent.pages[0].length > 500 && "..."}
                    </div>
                  </div>
                )}

                {/* Result File Info */}
                <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <FileType className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{getOutputFilename()}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(resultBlob.size)} • Ready to download
                    </p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!resultBlob && processing.status !== "processing" && (
                <button
                  onClick={processFile}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <FileDown className="h-4 w-4" />
                  Convert to Word
                </button>
              )}

              {resultBlob && (
                <DownloadButton
                  blob={resultBlob}
                  filename={getOutputFilename()}
                >
                  Download Word Document
                </DownloadButton>
              )}

              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
                Convert Another
              </button>
            </div>
          </div>
        )}

        {/* Features Grid (when no file) */}
        {!file && (
          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileDown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Easy Conversion</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload and convert in seconds
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
                  Files stay in your browser
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileType className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Editable Output</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Edit in Word or Google Docs
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
