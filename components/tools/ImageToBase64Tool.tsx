"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadButton } from "@/components/tools/DownloadButton";
import { Clipboard, Copy, FileText, Image as ImageIcon } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageToBase64Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Result, setBase64Result] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setBase64Result("");
    setStatus("idle");
    setError(null);
    setCopied(false);
  }, [previewUrl]);

  const resetAll = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setBase64Result("");
    setStatus("idle");
    setError(null);
    setCopied(false);
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
      });

      setBase64Result(dataUrl);
      setStatus("done");
    } catch (caughtError) {
      console.error("Image to Base64 conversion failed:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Conversion failed. Please try again."
      );
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    if (!base64Result) return;

    try {
      await navigator.clipboard.writeText(base64Result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy automatically. Please copy manually.");
    }
  };

  const textBlob = useMemo(
    () =>
      base64Result
        ? new Blob([base64Result], { type: "text/plain;charset=utf-8" })
        : null,
    [base64Result]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { title: "Private", subtitle: "Local-only conversion" },
          { title: "Data URI", subtitle: "Ready for HTML/CSS" },
          { title: "Fast", subtitle: "Instant Base64 output" },
          { title: "Free", subtitle: "No limits" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {!file ? (
        <FileDropzone
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg"
          maxSize={20}
          onFileSelect={handleFileSelect}
          description="Upload image files up to 20MB to convert into Base64 Data URI"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Input Image</h3>
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              <button
                onClick={resetAll}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                Reset
              </button>
            </div>

            <button
              onClick={handleConvert}
              disabled={status === "processing"}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "processing" ? "Converting..." : "Convert to Base64"}
            </button>

            {base64Result && (
              <div className="space-y-2">
                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy Base64"}
                </button>
                {textBlob && (
                  <DownloadButton blob={textBlob} filename="image-base64.txt" className="w-full" size="lg">
                    Download TXT
                  </DownloadButton>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span>Image Preview</span>
                </div>
                <div className="text-xs text-muted-foreground">Base64 ready</div>
              </div>
              <div className="flex min-h-[220px] items-center justify-center bg-background p-4 dark:bg-muted/20">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className="max-h-[200px] w-auto max-w-full rounded-lg border border-border object-contain"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Preview unavailable.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clipboard className="h-4 w-4 text-primary" />
                <span>Base64 Output</span>
              </div>
              <textarea
                value={base64Result}
                readOnly
                placeholder="Base64 output will appear here after conversion"
                className="h-56 w-full resize-none rounded-lg border border-border bg-background p-3 text-xs text-foreground focus:outline-none"
              />
              {base64Result && (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Length: {base64Result.length.toLocaleString()} characters
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {status === "error" && error && <ProcessingStatus status="error" message={error} />}
      {status === "done" && base64Result && (
        <ProcessingStatus
          status="done"
          message="Image converted to Base64 successfully. You can copy or download the result."
        />
      )}
    </div>
  );
}
