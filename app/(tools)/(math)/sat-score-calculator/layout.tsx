import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAT Score Calculator - Composite & Percentile Estimates",
  description:
    "Calculate SAT composite score and percentile from section scores. Includes Evidence-Based Reading & Writing and Math.",
  keywords: [
    "sat score calculator",
    "sat composite calculator",
    "sat percentile calculator",
    "sat score estimator",
    "sat exam calculator",
    "college entrance exam",
    "sat preparation calculator",
  ],
  openGraph: {
    title: "SAT Score Calculator",
    description: "Calculate your SAT composite score and percentile ranking.",
    type: "website",
    url: "https://softzar.com/sat-score-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAT Score Calculator | SoftZaR",
    description: "Estimate SAT composite score and percentile.",
  },
  alternates: {
    canonical: "https://softzar.com/sat-score-calculator/",
  },
};

export default function SATScoreCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
