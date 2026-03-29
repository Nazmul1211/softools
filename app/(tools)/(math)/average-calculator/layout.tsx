import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Average Calculator - Calculate Mean, Median, Mode & Range",
  description:
    "Free average calculator to find the mean, median, mode, and range of any data set. Perfect for statistics homework and data analysis.",
  keywords: [
    "average calculator",
    "mean calculator",
    "median calculator",
    "mode calculator",
    "range calculator",
    "statistics calculator",
  ],
  openGraph: {
    title: "Average Calculator - Calculate Mean, Median, Mode & Range",
    description: "Calculate mean, median, mode, and range from any set of numbers.",
    type: "website",
  },
};

export default function AverageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
