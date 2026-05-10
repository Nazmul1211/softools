import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACT Score Calculator - Composite and Percentile Estimate",
  description:
    "Estimate your ACT composite score from English, Math, Reading, and Science section scores. See benchmarks, percentile estimate, and readiness signals.",
  keywords: [
    "act score calculator",
    "act composite calculator",
    "act percentile estimate",
    "act section score average",
    "act benchmark calculator",
    "college readiness act score",
    "act score predictor",
    "act score conversion tool",
  ],
  openGraph: {
    title: "ACT Score Calculator - Composite + Benchmark Insights",
    description:
      "Calculate ACT composite score and compare section performance to college readiness benchmarks.",
    type: "website",
    url: "https://softzar.com/act-score-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACT Score Calculator | SoftZaR",
    description:
      "Estimate ACT composite score and percentile from your section results.",
  },
  alternates: {
    canonical: "https://softzar.com/act-score-calculator/",
  },
};

export default function ACTScoreCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
