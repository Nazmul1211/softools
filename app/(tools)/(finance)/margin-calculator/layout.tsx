import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Margin Calculator - Calculate Profit Margin Easily",
  description:
    "Free margin calculator to calculate gross profit margin, net profit margin, and markup. Enter cost and selling price to determine your business profitability.",
  keywords: [
    "margin calculator",
    "profit margin calculator",
    "gross margin calculator",
    "net margin calculator",
    "business margin calculator",
    "calculate profit margin",
    "markup vs margin",
    "profit percentage calculator",
  ],
  openGraph: {
    title: "Margin Calculator - Calculate Profit Margin Easily",
    description:
      "Calculate profit margins and markup for your business. Free margin calculator for pricing decisions.",
    type: "website",
  },
};

export default function MarginCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
