import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Z-Score Calculator — Z Value, Percentile, and Probability | SoftZaR",
  description:
    "Calculate z-scores from raw values, convert z to raw scores, and see percentile and tail probabilities instantly. Free online statistics calculator.",
  keywords: [
    "z-score calculator",
    "z score calculator",
    "z value calculator",
    "percentile calculator",
    "normal distribution calculator",
    "standard score calculator",
    "z-score formula",
    "statistics calculator",
  ],
  openGraph: {
    title: "Z-Score Calculator — Percentile and Tail Probability",
    description:
      "Find z-scores, percentiles, and probabilities from normal distribution values with step-by-step formula guidance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z-Score Calculator | SoftZaR",
    description:
      "Convert raw scores to z-scores and percentiles with this free statistics tool.",
  },
};

export default function ZScoreCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

