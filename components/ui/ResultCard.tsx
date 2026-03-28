import { cn } from "@/lib/utils";

export interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  highlight?: boolean;
  className?: string;
}

export function ResultCard({
  label,
  value,
  unit,
  subValue,
  highlight = false,
  className,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all duration-300",
        highlight
          ? "border-primary/30 bg-primary/5 shadow-lg dark:border-primary/50 dark:bg-primary/20"
          : "border-border bg-muted/50 dark:border-border dark:bg-muted/50",
        className
      )}
    >
      <p className="text-sm text-muted-foreground dark:text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          highlight
            ? "text-primary dark:text-primary"
            : "text-foreground dark:text-foreground"
        )}
      >
        {value}
        {unit && (
          <span className="ml-1 text-base font-normal text-muted-foreground dark:text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
      {subValue && (
        <p className="mt-1 text-sm text-muted-foreground">{subValue}</p>
      )}
    </div>
  );
}

interface ResultsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ResultsGrid({
  children,
  columns = 2,
  className,
}: ResultsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1": columns === 1,
          "grid-cols-1 sm:grid-cols-2": columns === 2,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-2 sm:grid-cols-4": columns === 4,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
