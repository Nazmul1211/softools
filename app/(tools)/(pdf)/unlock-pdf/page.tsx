"use client";

import { useCallback, useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { Input } from "@/components/ui/Input";
import { LockOpen, Shield, Zap, KeyRound } from "lucide-react";

type Status = "idle" | "processing" | "done" | "error";

export default function UnlockPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
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
    setPassword("");
    setStatus("idle");
    setMessage("");
    setResult(null);
  };

  const handleUnlock = async () => {
    if (!file) return;

    try {
      setStatus("processing");
      setMessage("Reading protected PDF...");

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const sourceBytes = await file.arrayBuffer();
      const inputPdf = await pdfjsLib.getDocument({
        data: sourceBytes,
        password: password || undefined,
      }).promise;

      const { PDFDocument } = await import("pdf-lib");
      const outputPdf = await PDFDocument.create();

      for (let pageNumber = 1; pageNumber <= inputPdf.numPages; pageNumber++) {
        setMessage(`Processing page ${pageNumber} of ${inputPdf.numPages}...`);
        const page = await inputPdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not create render context.");
        }

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const imageBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode page image."))),
            "image/jpeg",
            0.95
          );
        });
        const imageBytes = new Uint8Array(await imageBlob.arrayBuffer());
        const jpg = await outputPdf.embedJpg(imageBytes);
        const outputPage = outputPdf.addPage([viewport.width, viewport.height]);
        outputPage.drawImage(jpg, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      const outBytes = await outputPdf.save({ useObjectStreams: false });
      const outputBuffer = new ArrayBuffer(outBytes.length);
      new Uint8Array(outputBuffer).set(outBytes);

      setResult(new Blob([outputBuffer], { type: "application/pdf" }));
      setStatus("done");
      setMessage("Unlocked copy generated.");
    } catch (error) {
      const raw = error instanceof Error ? error.message : "Unlock failed.";
      const lower = raw.toLowerCase();
      const friendly =
        lower.includes("password") || lower.includes("encrypted")
          ? "Wrong or missing password. Enter the correct PDF password and try again."
          : raw;
      setStatus("error");
      setMessage(friendly);
    }
  };

  const outputFilename = file
    ? `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf`
    : "unlocked.pdf";

  return (
    <ToolLayout
      title="Unlock PDF"
      slug="unlock-pdf"
      description="Remove password protection from PDFs (with valid password) and download an unlocked copy."
      category={{ name: "PDF Tools", slug: "pdf-tools" }}
      relatedTools={[
        { name: "PDF Merger", href: "/pdf-merger/" },
        { name: "PDF Splitter", href: "/pdf-splitter/" },
        { name: "Rotate PDF", href: "/rotate-pdf/" },
      ]}
      howToSteps={[
        { name: "Upload PDF", text: "Choose a password-protected PDF file." },
        { name: "Enter password", text: "Provide the current document password." },
        { name: "Unlock and download", text: "Generate and save an unlocked copy." },
      ]}
      faqs={[
        {
          question: "Can this unlock PDFs without knowing the password?",
          answer:
            "No. You must provide the correct existing password.",
        },
        {
          question: "Will formatting stay exactly the same?",
          answer:
            "The unlocked file is rebuilt from page render output, so text becomes flattened page content. Visual layout remains close to the original.",
        },
        {
          question: "Are my files uploaded?",
          answer: "No. Processing happens locally in your browser.",
        },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: LockOpen, text: "Unlock", sub: "Remove lock" },
            { icon: KeyRound, text: "Password", sub: "Required" },
            { icon: Shield, text: "Private", sub: "No upload" },
            { icon: Zap, text: "Instant", sub: "Local processing" },
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

        <Input
          label="PDF Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter current PDF password"
        />

        <ProcessingStatus status={status} message={message} />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleUnlock}
            disabled={!file || status === "processing"}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Unlock PDF
          </button>
          <DownloadButton
            blob={result}
            filename={outputFilename}
            disabled={!result}
          >
            Download Unlocked PDF
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
