import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standard Deviation Calculator - Calculate Variance & Statistics",
  description:
    "Free standard deviation calculator to compute variance, standard deviation, mean, and other statistics for population and sample data sets.",
  keywords: [
    "standard deviation calculator",
    "variance calculator",
    "statistics calculator",
    "population standard deviation",
    "sample standard deviation",
  ],
  openGraph: {
    title: "Standard Deviation Calculator - Calculate Variance & Statistics",
    description: "Calculate standard deviation, variance, and other statistical measures.",
    type: "website",
  },
};

export default function StandardDeviationCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
