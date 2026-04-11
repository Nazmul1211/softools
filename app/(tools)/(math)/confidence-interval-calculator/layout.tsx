import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidence Interval Calculator — Statistical Confidence Levels | SoftZaR",
  description:
    "Calculate confidence intervals for population means and proportions. Supports 90%, 95%, and 99% confidence levels with margin of error. Free statistics calculator.",
  keywords: [
    "confidence interval calculator",
    "confidence level",
    "margin of error calculator",
    "statistics calculator",
    "confidence interval formula",
    "z-score confidence interval",
    "t-test confidence interval",
    "sample size confidence interval",
    "population mean interval",
  ],
  openGraph: {
    title: "Confidence Interval Calculator — Margin of Error & CI",
    description:
      "Calculate confidence intervals for means and proportions with step-by-step solutions. Supports z-distribution and t-distribution.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Confidence Interval Calculator | SoftZaR",
    description:
      "Free confidence interval calculator with z-scores and t-scores for population means and proportions.",
  },
};

export default function ConfidenceIntervalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
