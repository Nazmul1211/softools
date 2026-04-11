"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingProgress, ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { DownloadAllButton, DownloadButton } from "@/components/tools/DownloadButton";
import { convertImage } from "@/lib/image";
import { ArrowRightLeft, Image as ImageIcon, SlidersHorizontal, Trash2, Upload } from "lucide-react";

interface ImageFormatConverterProps {
  accept: string;
  uploadDescription: string;
  outputMimeType: "image/png" | "image/jpeg" | "image/webp";
  outputExtension: "png" | "jpg" | "webp";
  outputLabel: string;
  maxSizeMB?: number;
  multiple?: boolean;
  zipFilename?: string;
}

interface ConvertedFileResult {
  sourceFile: File;
  blob: Blob;
  filename: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageFormatConverter({
  accept,
  uploadDescription,
  outputMimeType,
  outputExtension,
  outputLabel,
  maxSizeMB = 40,
  multiple = false,
  zipFilename,
}: ImageFormatConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(92);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [batchResults, setBatchResults] = useState<ConvertedFileResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState<string | null>(null);

  const supportsQualityControl = outputMimeType !== "image/png";

  useEffect(() => {
    return () => {
      if (inputPreviewUrl) {
        URL.revokeObjectURL(inputPreviewUrl);
      }
      if (outputPreviewUrl) {
        URL.revokeObjectURL(outputPreviewUrl);
      }
    };
  }, [inputPreviewUrl, outputPreviewUrl]);

  const handleFileSelect = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const imageFiles = files.filter((candidate) => candidate.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setError(multiple ? "Please upload valid image files." : "Please upload a valid image file.");
      return;
    }

    setStatus("idle");
    setError(null);
    setProgress({ current: 0, total: 0 });
    setBatchResults([]);

    if (multiple) {
      setFiles((previousFiles) => [...previousFiles, ...imageFiles]);
      return;
    }

    const selectedFile = imageFiles[0];
    setFile(selectedFile);
    setOutputBlob(null);

    setInputPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return URL.createObjectURL(selectedFile);
    });

    setOutputPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return null;
    });
  }, [multiple]);

  const removeBatchFile = (index: number) => {
    setFiles((previousFiles) => previousFiles.filter((_, fileIndex) => fileIndex !== index));
    setStatus("idle");
    setError(null);
    setBatchResults([]);
    setProgress({ current: 0, total: 0 });
  };

  const resetAll = () => {
    if (inputPreviewUrl) {
      URL.revokeObjectURL(inputPreviewUrl);
    }
    if (outputPreviewUrl) {
      URL.revokeObjectURL(outputPreviewUrl);
    }

    setFile(null);
    setFiles([]);
    setInputPreviewUrl(null);
    setOutputPreviewUrl(null);
    setOutputBlob(null);
    setBatchResults([]);
    setProgress({ current: 0, total: 0 });
    setError(null);
    setStatus("idle");
  };

  const handleConvert = async () => {
    if (multiple) {
      if (files.length === 0) {
        setError("Please upload at least one image.");
        return;
      }

      setStatus("processing");
      setError(null);
      setBatchResults([]);
      setProgress({ current: 0, total: files.length });

      const convertedFiles: ConvertedFileResult[] = [];

      try {
        for (let index = 0; index < files.length; index++) {
          const sourceFile = files[index];
          setProgress({ current: index, total: files.length });

          const converted = await convertImage(
            sourceFile,
            outputMimeType,
            supportsQualityControl ? quality / 100 : 0.92
          );

          const baseName = sourceFile.name.split(".").slice(0, -1).join(".") || `image-${index + 1}`;
          convertedFiles.push({
            sourceFile,
            blob: converted,
            filename: `${baseName}.${outputExtension}`,
          });
        }

        setBatchResults(convertedFiles);
        setProgress({ current: files.length, total: files.length });
        setStatus("done");
      } catch (caughtError) {
        console.error("Image conversion failed:", caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Image conversion failed. Please try again."
        );
        setBatchResults(convertedFiles);
        setStatus("error");
      }

      return;
    }

    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      const converted = await convertImage(
        file,
        outputMimeType,
        supportsQualityControl ? quality / 100 : 0.92
      );

      setOutputBlob(converted);
      setOutputPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return URL.createObjectURL(converted);
      });
      setStatus("done");
    } catch (caughtError) {
      console.error("Image conversion failed:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Image conversion failed. Please try again."
      );
      setStatus("error");
    }
  };

  const outputFilename = useMemo(() => {
    if (!file) {
      return `converted-image.${outputExtension}`;
    }

    const baseName = file.name.split(".").slice(0, -1).join(".") || "image";
    return `${baseName}.${outputExtension}`;
  }, [file, outputExtension]);

  const batchDownloadFiles = useMemo(
    () => batchResults.map((result) => ({ blob: result.blob, filename: result.filename })),
    [batchResults]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { title: "Private", subtitle: "Browser-only processing" },
          { title: "Fast", subtitle: "Instant conversion" },
          { title: outputLabel, subtitle: "Clean output format" },
          { title: "Free", subtitle: "No watermark" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {multiple ? (
        files.length === 0 ? (
          <FileDropzone
            accept={accept}
            maxSize={maxSizeMB}
            multiple
            onFileSelect={handleFileSelect}
            description={uploadDescription}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {files.map((selectedFile, index) => (
                <FilePreview
                  key={`${selectedFile.name}-${index}`}
                  file={selectedFile}
                  onRemove={() => removeBatchFile(index)}
                  status={
                    status === "processing"
                      ? index < progress.current
                        ? "done"
                        : progress.current === index
                        ? "processing"
                        : "idle"
                      : status === "done"
                      ? "done"
                      : "idle"
                  }
                />
              ))}
            </div>

            {status === "idle" && (
              <>
                <button
                  onClick={() => document.getElementById("add-more-converter-images")?.click()}
                  className="w-full rounded-lg border-2 border-dashed border-border py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  + Add more images
                </button>
                <input
                  id="add-more-converter-images"
                  type="file"
                  accept={accept}
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                      handleFileSelect(Array.from(event.target.files));
                    }
                  }}
                />
              </>
            )}

            {supportsQualityControl && status !== "processing" && (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Output Quality
                </h3>
                <label className="block text-xs text-muted-foreground">
                  Quality: <span className="font-medium text-foreground">{quality}%</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={quality}
                  onChange={(event) => setQuality(Number.parseInt(event.target.value, 10))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
              </div>
            )}

            {status === "processing" && (
              <ProcessingProgress current={progress.current} total={progress.total} label="Converting images..." />
            )}

            {status === "error" && error && <ProcessingStatus status="error" message={error} />}

            {status === "done" && batchResults.length > 0 && (
              <div className="space-y-3">
                <ProcessingStatus
                  status="done"
                  message={`${batchResults.length} image${batchResults.length !== 1 ? "s" : ""} converted successfully.`}
                />

                <div className="space-y-2">
                  {batchResults.map((result, index) => {
                    const reductionPercent = Math.round(
                      (1 - result.blob.size / result.sourceFile.size) * 100
                    );
                    const reductionLabel =
                      reductionPercent >= 0
                        ? `-${reductionPercent}%`
                        : `+${Math.abs(reductionPercent)}%`;
                    const reductionClass =
                      reductionPercent >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400";

                    return (
                      <div
                        key={`${result.filename}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-3 dark:bg-muted/30"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{result.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatBytes(result.sourceFile.size)} → {formatBytes(result.blob.size)}
                            <span className={`ml-2 ${reductionClass}`}>({reductionLabel})</span>
                          </p>
                        </div>
                        <DownloadButton
                          blob={result.blob}
                          filename={result.filename}
                          variant="secondary"
                          size="sm"
                        >
                          Download
                        </DownloadButton>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {batchResults.length > 1 && (
                    <DownloadAllButton
                      files={batchDownloadFiles}
                      zipFilename={zipFilename || `converted-${outputExtension}-images.zip`}
                      className="flex-1"
                    />
                  )}
                  <button
                    onClick={resetAll}
                    className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:min-w-[190px]"
                  >
                    Convert More Images
                  </button>
                </div>
              </div>
            )}

            {status === "idle" && (
              <button
                onClick={handleConvert}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Convert {files.length} Image{files.length !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )
      ) : (
        !file ? (
          <FileDropzone
            accept={accept}
            maxSize={maxSizeMB}
            onFileSelect={handleFileSelect}
            description={uploadDescription}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Input File</h3>
                  <button
                    onClick={resetAll}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatBytes(file.size)}</p>

                <button
                  onClick={() => document.getElementById("replace-converter-image")?.click()}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Replace Image
                </button>
                <input
                  id="replace-converter-image"
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                      handleFileSelect(Array.from(event.target.files));
                    }
                  }}
                />
              </div>

              {supportsQualityControl && (
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Output Quality
                  </h3>
                  <label className="block text-xs text-muted-foreground">
                    Quality: <span className="font-medium text-foreground">{quality}%</span>
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={quality}
                    onChange={(event) => setQuality(Number.parseInt(event.target.value, 10))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                </div>
              )}

              {status !== "done" ? (
                <button
                  onClick={handleConvert}
                  disabled={status === "processing"}
                  className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "processing" ? "Converting..." : `Convert to ${outputLabel}`}
                </button>
              ) : (
                <div className="space-y-2">
                  <DownloadButton blob={outputBlob!} filename={outputFilename} className="w-full" size="lg">
                    Download {outputLabel}
                  </DownloadButton>
                  <button
                    onClick={resetAll}
                    className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Convert Another Image
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Preview</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    {status === "done" ? "Converted" : "Original"}
                  </div>
                </div>

                <div className="flex min-h-[340px] items-center justify-center bg-background p-4 dark:bg-muted/20">
                  {outputPreviewUrl || inputPreviewUrl ? (
                    <img
                      src={outputPreviewUrl ?? inputPreviewUrl ?? ""}
                      alt="Converted preview"
                      className="max-h-[320px] w-auto max-w-full rounded-lg border border-border object-contain"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">Preview unavailable.</p>
                  )}
                </div>

                <div className="border-t border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border bg-background px-2 py-1">
                      Input: {file ? formatBytes(file.size) : "-"}
                    </span>
                    {outputBlob && (
                      <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-primary">
                        Output: {formatBytes(outputBlob.size)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {status === "error" && error && <ProcessingStatus status="error" message={error} />}
              {status === "done" && outputBlob && (
                <ProcessingStatus status="done" message={`Image converted successfully to ${outputLabel}.`} />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
