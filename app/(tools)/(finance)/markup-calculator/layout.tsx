import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markup Calculator - Calculate Product Markup & Selling Price",
  description:
    "Free markup calculator to determine selling price from cost and markup percentage. Calculate profit, margin, and set competitive prices for your products.",
  keywords: [
    "markup calculator",
    "price markup calculator",
    "retail markup calculator",
    "calculate selling price",
    "markup percentage calculator",
    "product pricing calculator",
    "cost plus markup",
    "markup formula",
  ],
  openGraph: {
    title: "Markup Calculator - Calculate Product Markup & Selling Price",
    description:
      "Calculate selling price from cost and markup percentage. Free markup calculator for retail and business pricing.",
    type: "website",
  },
};

export default function MarkupCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
