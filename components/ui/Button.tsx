import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-white hover:bg-blue-700 focus:ring-primary":
              variant === "primary",
            "bg-muted text-foreground hover:bg-zinc-200 focus:ring-zinc-500 dark:bg-muted dark:text-foreground dark:hover:bg-zinc-700":
              variant === "secondary",
            "border border-border bg-transparent text-foreground hover:bg-muted/50 focus:ring-zinc-500 dark:border-border dark:text-zinc-300 dark:hover:bg-muted":
              variant === "outline",
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
