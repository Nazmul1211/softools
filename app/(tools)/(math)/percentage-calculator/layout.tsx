import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator - Calculate Percentages Online",
  description:
    "Free online percentage calculator. Calculate what percent a number is of another, find percentage increase or decrease, and solve percentage problems easily.",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "calculate percentage",
    "percentage increase",
    "percentage decrease",
    "what percent",
  ],
};

export default function PercentageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
