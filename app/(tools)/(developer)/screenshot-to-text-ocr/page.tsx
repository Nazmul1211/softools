"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

const faqs: FAQItem[] = [
  {
    question: "Does this OCR tool run in the browser?",
    answer:
      "Yes. OCR processing is performed client-side in your browser using a local OCR worker.",
  },
  {
    question: "What images work best for OCR?",
    answer:
      "Use clear, high-contrast screenshots with readable font sizes and minimal blur.",
  },
  {
    question: "Can I copy extracted text?",
    answer:
      "Yes. After OCR completes, use the Copy button to copy recognized text.",
  },
];

type OCRProgressMessage = {
  status: string;
  progress?: number;
};

export default function ScreenshotToTextOCRPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const stats = useMemo(() => {
    if (!extractedText.trim()) return null;
    const words = extractedText.trim().split(/\s+/).length;
    const characters = extractedText.length;
    const lines = extractedText.split("\n").length;
    return { words, characters, lines };
  }, [extractedText]);

  const handleExtract = async () => {
    if (!selectedFile) return;

    setErrorMessage("");
    setIsProcessing(true);
    setProgress(0);
    setExtractedText("");

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (message: OCRProgressMessage) => {
          if (message.status === "recognizing text" && typeof message.progress === "number") {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(selectedFile);
      await worker.terminate();

      const finalText = data.text?.trim() ?? "";
      setExtractedText(finalText);
      if (!finalText) {
        setErrorMessage("No readable text detected in the image.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "OCR failed.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <ToolLayout
      title="Screenshot to Text (OCR)"
      slug="screenshot-to-text-ocr"
      description="Upload a screenshot and extract text quickly with browser-based OCR."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Upload screenshot", text: "Choose a PNG, JPG, or WEBP image from your device." },
        { name: "Run OCR", text: "Click Extract Text to process the image in your browser." },
        { name: "Copy output", text: "Review and copy recognized text for reuse." },
      ]}
      relatedTools={[
        { name: "Markdown to PDF Converter", href: "/markdown-to-pdf-converter/" },
        { name: "JSON Formatter", href: "/json-formatter/" },
        { name: "AI Prompt Formatter", href: "/ai-prompt-formatter/" },
      ]}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Upload image</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
              setExtractedText("");
              setErrorMessage("");
              setProgress(0);
            }}
            className="block w-full cursor-pointer rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium dark:bg-muted"
          />
        </div>

        {previewUrl && (
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">Preview</p>
            <img src={previewUrl} alt="Selected screenshot preview" className="max-h-80 w-auto rounded-lg border border-border" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExtract}
            disabled={!selectedFile || isProcessing}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? `Extracting... ${progress}%` : "Extract Text"}
          </button>
          {isProcessing && (
            <div className="h-2 w-52 overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">{errorMessage}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Extracted Text</label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!extractedText}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={extractedText}
            onChange={(event) => setExtractedText(event.target.value)}
            rows={10}
            placeholder="OCR output appears here."
            className="w-full rounded-lg border border-border bg-white px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
          />
        </div>

        {stats && (
          <ResultsGrid columns={3}>
            <ResultCard label="Words" value={stats.words.toLocaleString()} />
            <ResultCard label="Characters" value={stats.characters.toLocaleString()} />
            <ResultCard label="Lines" value={stats.lines.toLocaleString()} />
          </ResultsGrid>
        )}
      </div>
    </ToolLayout>
  );
}
