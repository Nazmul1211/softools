import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Margin of Error Calculator — Survey and Estimate Precision | SoftZaR",
  description:
    "Calculate margin of error for proportions and means using sample size, confidence level, and variability assumptions. Includes finite population correction.",
  keywords: [
    "margin of error calculator",
    "survey margin of error",
    "confidence interval margin",
    "poll error margin",
    "sample size margin of error",
    "statistics calculator",
    "finite population correction",
    "estimate precision calculator",
  ],
  openGraph: {
    title: "Margin of Error Calculator — Estimate Precision Quickly",
    description:
      "Find margin of error for survey percentages and mean estimates with confidence-level controls.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Margin of Error Calculator | SoftZaR",
    description:
      "Compute confidence-based margin of error for surveys and statistical estimates.",
  },
};

export default function MarginOfErrorCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

