import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, suffix, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-stretch overflow-hidden rounded-lg border border-border bg-white transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-border dark:bg-muted",
            error &&
              "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
          )}
        >
          <input
            id={id}
            ref={ref}
            className={cn(
              "block w-full appearance-none bg-transparent px-4 py-3 text-foreground placeholder-zinc-400 focus:outline-none dark:text-foreground dark:placeholder-zinc-500",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="flex items-center border-l border-border bg-muted/30 px-4 text-sm font-medium text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground whitespace-nowrap">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
