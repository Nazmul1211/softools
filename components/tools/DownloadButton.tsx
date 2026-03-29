"use client";

import { useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveAs } from "file-saver";

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children?: React.ReactNode;
}

export function DownloadButton({
  blob,
  filename,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  children,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!blob || disabled) return;

    setDownloading(true);
    
    try {
      // Small delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 300));
      saveAs(blob, filename);
      setDownloaded(true);
      
      // Reset downloaded state after 2 seconds
      setTimeout(() => setDownloaded(false), 2000);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: cn(
      "bg-primary text-primary-foreground hover:bg-primary/90",
      "disabled:bg-muted disabled:text-muted-foreground"
    ),
    secondary: cn(
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      "border border-border"
    ),
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!blob || disabled || downloading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg",
        "transition-all duration-200 disabled:cursor-not-allowed",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {downloading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Downloading...</span>
        </>
      ) : downloaded ? (
        <>
          <Check className="h-5 w-5" />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span>{children || "Download"}</span>
        </>
      )}
    </button>
  );
}

interface DownloadAllButtonProps {
  files: { blob: Blob; filename: string }[];
  zipFilename?: string;
  className?: string;
}

export function DownloadAllButton({
  files,
  zipFilename = "files.zip",
  className,
}: DownloadAllButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (files.length === 0) return;

    setDownloading(true);

    try {
      // Dynamic import for code splitting
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      files.forEach(({ blob, filename }) => {
        zip.file(filename, blob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, zipFilename);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadAll}
      disabled={files.length === 0 || downloading}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {downloading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Creating ZIP...</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span>Download All ({files.length} files)</span>
        </>
      )}
    </button>
  );
}
