"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  className?: string;
  description?: string;
  disabled?: boolean;
}

export function FileDropzone({
  accept,
  maxSize = 50,
  multiple = false,
  onFileSelect,
  className,
  description,
  disabled = false,
}: FileDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const validFiles: File[] = [];
      const fileArray = Array.from(files);
      const maxSizeBytes = maxSize * 1024 * 1024;

      for (const file of fileArray) {
        if (file.size > maxSizeBytes) {
          setError(`File "${file.name}" exceeds ${maxSize}MB limit`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setError(null);
      }

      return multiple ? validFiles : validFiles.slice(0, 1);
    },
    [maxSize, multiple]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = validateFiles(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [disabled, validateFiles, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = validateFiles(e.target.files);
        if (files.length > 0) {
          onFileSelect(files);
        }
      }
    },
    [validateFiles, onFileSelect]
  );

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const getAcceptDescription = () => {
    if (description) return description;
    
    const acceptTypes = accept.split(",").map((t) => t.trim().toUpperCase());
    if (acceptTypes.includes(".PDF")) return "PDF files";
    if (acceptTypes.some((t) => [".JPG", ".JPEG", ".PNG", ".WEBP", ".GIF"].includes(t))) {
      return "Images (JPG, PNG, WebP, GIF)";
    }
    return accept;
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] p-8",
          "border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
          "bg-muted/30 hover:bg-muted/50",
          dragActive && "border-primary bg-primary/5 scale-[1.02]",
          disabled && "opacity-50 cursor-not-allowed",
          !dragActive && !disabled && "border-border hover:border-primary/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <div className={cn(
          "flex flex-col items-center gap-4 text-center transition-transform duration-200",
          dragActive && "scale-110"
        )}>
          <div className={cn(
            "p-4 rounded-full transition-colors duration-200",
            dragActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-foreground">
              {dragActive ? "Drop file here" : "Drop file here or click to upload"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {getAcceptDescription()} • Max {maxSize}MB
              {multiple && " • Multiple files allowed"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  progress?: number;
  status?: "idle" | "processing" | "done" | "error";
  className?: string;
}

export function FilePreview({
  file,
  onRemove,
  progress,
  status = "idle",
  className,
}: FilePreviewProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = () => {
    const type = file.type.toLowerCase();
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    return "📁";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border border-border bg-white dark:bg-muted/30",
        status === "done" && "border-green-500/50 bg-green-50 dark:bg-green-950/20",
        status === "error" && "border-destructive/50 bg-destructive/10",
        className
      )}
    >
      <div className="text-2xl">{getFileIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{file.name}</p>
        <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
        
        {status === "processing" && progress !== undefined && (
          <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {status === "idle" && (
        <button
          onClick={onRemove}
          className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {status === "done" && (
        <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Done</span>
      )}

      {status === "error" && (
        <span className="text-destructive text-sm font-medium">Failed</span>
      )}
    </div>
  );
}
