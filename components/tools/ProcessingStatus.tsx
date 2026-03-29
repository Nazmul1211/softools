"use client";

import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ProcessingStatusProps {
  status: "idle" | "processing" | "done" | "error";
  message?: string;
  className?: string;
}

export function ProcessingStatus({ status, message, className }: ProcessingStatusProps) {
  if (status === "idle") return null;

  const statusConfig = {
    processing: {
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      text: message || "Processing...",
      classes: "text-primary bg-primary/10 border-primary/20",
    },
    done: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      text: message || "Complete!",
      classes: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    },
    error: {
      icon: <XCircle className="h-5 w-5" />,
      text: message || "An error occurred",
      classes: "text-destructive bg-destructive/10 border-destructive/20",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border",
        config.classes,
        className
      )}
    >
      {config.icon}
      <span className="font-medium">{config.text}</span>
    </div>
  );
}

interface ProcessingProgressProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export function ProcessingProgress({
  current,
  total,
  label,
  className,
}: ProcessingProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground text-center">
        {current} of {total} completed
      </p>
    </div>
  );
}

interface ResultStatsProps {
  original: number;
  compressed: number;
  label?: string;
  className?: string;
}

export function ResultStats({
  original,
  compressed,
  label = "File Size",
  className,
}: ResultStatsProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const saved = original - compressed;
  const percentage = original > 0 ? Math.round((saved / original) * 100) : 0;
  const increased = compressed > original;

  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-1">Original {label}</p>
        <p className="text-xl font-bold text-foreground">{formatSize(original)}</p>
      </div>
      
      <div className="text-center p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-1">New {label}</p>
        <p className="text-xl font-bold text-foreground">{formatSize(compressed)}</p>
      </div>
      
      <div className={cn(
        "text-center p-4 rounded-lg",
        increased ? "bg-orange-50 dark:bg-orange-950/30" : "bg-green-50 dark:bg-green-950/30"
      )}>
        <p className="text-sm text-muted-foreground mb-1">
          {increased ? "Increased" : "Saved"}
        </p>
        <p className={cn(
          "text-xl font-bold",
          increased ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
        )}>
          {increased ? "+" : "-"}{Math.abs(percentage)}%
        </p>
      </div>
    </div>
  );
}
