export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: string;
  keywords: string[];
}

export type ToolCategory =
  | "math"
  | "finance"
  | "health"
  | "conversion"
  | "text"
  | "image"
  | "date-time"
  | "random"
  | "developer";

export interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}

export interface CalculatorResult {
  value: number | string;
  label: string;
  unit?: string;
}
