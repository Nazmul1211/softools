import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Variance Calculator — Population and Sample Variance | SoftZaR",
  description:
    "Calculate variance, standard deviation, mean, and spread metrics from a list of numbers. Supports both population and sample formulas.",
  keywords: [
    "variance calculator",
    "sample variance calculator",
    "population variance calculator",
    "statistics calculator",
    "standard deviation calculator",
    "mean and variance",
    "data spread calculator",
    "variance formula",
  ],
  openGraph: {
    title: "Variance Calculator — Data Spread and Dispersion",
    description:
      "Compute variance and related statistics from datasets with population or sample settings.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Variance Calculator | SoftZaR",
    description:
      "Find variance and standard deviation from your data in seconds.",
  },
};

export default function VarianceCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

