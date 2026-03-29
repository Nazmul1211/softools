import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ratio Calculator - Solve Ratios & Proportions",
  description:
    "Free ratio calculator to solve ratios and proportions. Find missing values, simplify ratios, and scale proportionally for cooking, DIY, and math homework.",
  keywords: [
    "ratio calculator",
    "proportion calculator",
    "ratio solver",
    "simplify ratio",
    "scale ratio",
    "golden ratio",
  ],
  openGraph: {
    title: "Ratio Calculator - Solve Ratios & Proportions",
    description: "Solve ratio and proportion problems, simplify ratios, and find missing values.",
    type: "website",
  },
};

export default function RatioCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
