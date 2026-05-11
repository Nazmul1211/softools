import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Detector Comparison Tool - Consensus Score Calculator | SoftZaR",
  description:
    "Compare multiple AI detector percentages in one place and estimate consensus risk from average and score spread.",
  keywords: [
    "ai detector comparison tool",
    "ai detector score comparison",
    "gptzero turnitin comparison",
    "ai content risk calculator",
    "ai detection consensus",
  ],
  openGraph: {
    title: "AI Detector Comparison Tool",
    description:
      "Compare AI detector scores and calculate a consensus risk level quickly.",
    type: "website",
    url: "https://softzar.com/ai-detector-comparison-tool/",
  },
  alternates: {
    canonical: "https://softzar.com/ai-detector-comparison-tool/",
  },
};

export default function AIDetectorComparisonToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
