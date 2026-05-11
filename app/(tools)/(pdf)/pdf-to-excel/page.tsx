"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { FileSpreadsheet, FileText, Shield, Zap } from "lucide-react";

type Status = "idle" | "processing" | "done" | "error";

interface ExtractedLine {
  page: number;
  line: number;
  text: string;
}

export default function PDFToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [lineCount, setLineCount] = useState(0);

  const handleFileSelect = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setStatus("idle");
    setMessage("");
    setResult(null);
    setLineCount(0);
  }, []);

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
    setResult(null);
    setLineCount(0);
  };

  const processFile = async () => {
    if (!file) return;

    try {
      setStatus("processing");
      setMessage("Loading PDF parser...");

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const pdfData = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

      const extracted: ExtractedLine[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        setMessage(`Reading page ${pageNumber} of ${pdf.numPages}...`);
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const grouped: Record<string, string[]> = {};
        for (const item of textContent.items) {
          if (!("str" in item) || typeof item.str !== "string") continue;
          const y = Math.round(item.transform[5]);
          grouped[y] = grouped[y] || [];
          if (item.str.trim()) grouped[y].push(item.str.trim());
        }

        const sortedY = Object.keys(grouped)
          .map(Number)
          .sort((a, b) => b - a);

        let lineNumber = 1;
        for (const y of sortedY) {
          const line = grouped[y].join(" ").trim();
          if (!line) continue;
          extracted.push({ page: pageNumber, line: lineNumber, text: line });
          lineNumber += 1;
        }
      }

      if (extracted.length === 0) {
        throw new Error("No extractable text found in this PDF.");
      }

      setMessage("Creating Excel workbook...");
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("PDF Text");

      worksheet.columns = [
        { header: "Page", key: "page", width: 10 },
        { header: "Line", key: "line", width: 10 },
        { header: "Text", key: "text", width: 120 },
      ];
      worksheet.getRow(1).font = { bold: true };

      extracted.forEach((row) => worksheet.addRow(row));

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer as BlobPart], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      setResult(blob);
      setLineCount(extracted.length);
      setStatus("done");
      setMessage("PDF converted to Excel.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Conversion failed.");
    }
  };

  const outputFilename = file
    ? `${file.name.replace(/\.pdf$/i, "")}.xlsx`
    : "pdf-export.xlsx";

  return (
    <ToolLayout
      title="PDF to Excel Converter"
      slug="pdf-to-excel"
      description="Extract text lines from PDF pages and export as an XLSX spreadsheet."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "PDF to Word Converter", href: "/pdf-to-word/" },
        { name: "Bank Statement Converter", href: "/bank-statement-converter/" },
        { name: "Word to PDF Converter", href: "/word-to-pdf/" },
      ]}
      howToSteps={[
        { name: "Upload PDF", text: "Drop your PDF file in the converter." },
        { name: "Extract content", text: "Run conversion to capture page-wise text lines." },
        { name: "Download XLSX", text: "Save the spreadsheet output for editing or analysis." },
      ]}
      faqs={[
        {
          question: "Does this detect table structure perfectly?",
          answer:
            "This version extracts text by line order and page context. Complex table layouts may require manual cleanup in Excel.",
        },
        {
          question: "Is conversion private?",
          answer: "Yes, processing runs in your browser.",
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: FileText, text: "PDF Input", sub: "Text extraction" },
            { icon: FileSpreadsheet, text: "XLSX Output", sub: "Excel ready" },
            { icon: Shield, text: "Private", sub: "Local processing" },
            { icon: Zap, text: "Fast", sub: "No upload" },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} className="rounded-lg bg-muted/40 p-3">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold">{text}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <FileDropzone
          accept=".pdf,application/pdf"
          maxSize={25}
          onFileSelect={handleFileSelect}
          description="PDF files up to 25MB"
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

        {lineCount > 0 && (
          <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
            Extracted <strong>{lineCount}</strong> text lines.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={processFile}
            disabled={!file || status === "processing"}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Convert to Excel
          </button>
          <DownloadButton
            blob={result}
            filename={outputFilename}
            disabled={!result}
          >
            Download XLSX
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
