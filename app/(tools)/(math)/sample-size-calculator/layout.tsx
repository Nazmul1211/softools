import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Size Calculator — Survey and Research Planning | SoftZaR",
  description:
    "Calculate required sample size for proportions or means using confidence level, margin of error, and variability assumptions. Includes finite population correction.",
  keywords: [
    "sample size calculator",
    "survey sample size",
    "required sample size",
    "margin of error sample size",
    "confidence level sample size",
    "finite population correction",
    "research sample calculator",
    "statistics calculator",
  ],
  openGraph: {
    title: "Sample Size Calculator — Plan Reliable Surveys and Studies",
    description:
      "Estimate minimum sample size for proportion and mean studies with confidence and error targets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample Size Calculator | SoftZaR",
    description:
      "Plan your study with confidence-based sample size estimates.",
  },
};

export default function SampleSizeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

