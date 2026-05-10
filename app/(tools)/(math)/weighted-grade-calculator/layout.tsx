import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weighted Grade Calculator - Category & Assignment Weights",
  description:
    "Calculate your weighted class grade by category, track missing weight, and estimate what score you need on remaining coursework.",
  keywords: [
    "weighted grade calculator",
    "category grade calculator",
    "assignment weight calculator",
    "class grade by category",
    "grade weight percentage calculator",
    "what grade do i need calculator",
    "weighted average grade tool",
    "course grade estimator",
  ],
  openGraph: {
    title: "Weighted Grade Calculator - Accurate Category Weighting",
    description:
      "Compute weighted class grades instantly with category percentages and clear interpretation.",
    type: "website",
    url: "https://softzar.com/weighted-grade-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weighted Grade Calculator | SoftZaR",
    description:
      "Calculate weighted class grades and required scores on remaining coursework.",
  },
  alternates: {
    canonical: "https://softzar.com/weighted-grade-calculator/",
  },
};

export default function WeightedGradeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
