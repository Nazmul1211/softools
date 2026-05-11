"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { FileText, FileType, Shield, Zap } from "lucide-react";

type Status = "idle" | "processing" | "done" | "error";

function splitLongLine(
  text: string,
  maxCharsPerLine = 95
): string[] {
  if (text.length <= maxCharsPerLine) return [text];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function extractDocxText(documentXml: string): string {
  const paragraphParts = documentXml
    .split("</w:p>")
    .map((chunk) =>
      chunk
        .replace(/<w:tab\/>/g, "\t")
        .replace(/<w:br\/>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .trim()
    )
    .filter(Boolean);

  return paragraphParts.join("\n");
}

export default function WordToPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setStatus("idle");
    setMessage("");
    setResult(null);
  }, []);

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
    setResult(null);
  };

  const processFile = async () => {
    if (!file) return;

    try {
      setStatus("processing");
      setMessage("Reading source file...");

      let textContent = "";
      if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
        textContent = await file.text();
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        const documentXmlFile = zip.file("word/document.xml");
        if (!documentXmlFile) {
          throw new Error("Could not read DOCX content.");
        }
        const documentXml = await documentXmlFile.async("text");
        textContent = extractDocxText(documentXml);
      }

      if (!textContent.trim()) {
        throw new Error("No readable text found in the document.");
      }

      setMessage("Creating PDF...");
      const { PDFDocument, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      const lineHeight = 16;
      const fontSize = 11;
      let y = pageHeight - margin;
      let page = pdfDoc.addPage([pageWidth, pageHeight]);

      const lines = textContent
        .replace(/\r\n/g, "\n")
        .split("\n")
        .flatMap((line) => (line.trim() ? splitLongLine(line.trim()) : [""]));

      for (const line of lines) {
        if (y < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          maxWidth: pageWidth - margin * 2,
        });
        y -= lineHeight;
      }

      const bytes = await pdfDoc.save();
      const outputBuffer = new ArrayBuffer(bytes.length);
      new Uint8Array(outputBuffer).set(bytes);
      setResult(new Blob([outputBuffer], { type: "application/pdf" }));
      setStatus("done");
      setMessage("Conversion completed.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Conversion failed.");
    }
  };

  const outputFilename = file
    ? `${file.name.replace(/\.(docx|txt)$/i, "")}.pdf`
    : "document.pdf";

  return (
    <ToolLayout
      title="Word to PDF Converter"
      slug="word-to-pdf"
      description="Convert DOCX and TXT files to PDF directly in your browser."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "PDF to Word Converter", href: "/pdf-to-word/" },
        { name: "PDF Compressor", href: "/pdf-compressor/" },
        { name: "PDF to Excel Converter", href: "/pdf-to-excel/" },
      ]}
      howToSteps={[
        { name: "Upload DOCX or TXT", text: "Drop a Word or text document file." },
        { name: "Convert", text: "Click convert to generate a PDF." },
        { name: "Download", text: "Save the generated PDF to your device." },
      ]}
      faqs={[
        {
          question: "Does this preserve advanced DOCX layout?",
          answer:
            "This version focuses on text extraction and clean PDF output. Complex tables, images, and advanced formatting are simplified.",
        },
        {
          question: "Is my file uploaded?",
          answer:
            "No. Processing runs in your browser.",
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: FileType, text: "DOCX + TXT", sub: "Input support" },
            { icon: FileText, text: "PDF Output", sub: "Ready to share" },
            { icon: Shield, text: "Private", sub: "Local processing" },
            { icon: Zap, text: "Fast", sub: "In-browser conversion" },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} className="rounded-lg bg-muted/40 p-3">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold">{text}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <FileDropzone
          accept=".docx,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          maxSize={20}
          onFileSelect={handleFileSelect}
          description="DOCX or TXT files up to 20MB"
          disabled={status === "processing"}
        />

        {file && (
          <FilePreview
            file={file}
            onRemove={handleReset}
            status={status === "done" ? "done" : status === "error" ? "error" : "idle"}
          />
        )}

        <ProcessingStatus status={status} message={message} />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={processFile}
            disabled={!file || status === "processing"}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Convert to PDF
          </button>
          <DownloadButton
            blob={result}
            filename={outputFilename}
            disabled={!result}
          >
            Download PDF
          </DownloadButton>
          {file && (
            <button
              onClick={handleReset}
              className="rounded-lg border border-border px-4 py-3 font-medium text-foreground hover:bg-muted"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
