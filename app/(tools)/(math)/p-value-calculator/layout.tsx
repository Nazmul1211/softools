import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "P-Value Calculator — Left, Right, and Two-Tailed Tests | SoftZaR",
  description:
    "Calculate p-values from z-test statistics for left-tailed, right-tailed, and two-tailed hypotheses. Fast significance testing tool for statistics.",
  keywords: [
    "p-value calculator",
    "p value calculator",
    "hypothesis test calculator",
    "two tailed test",
    "left tailed test",
    "right tailed test",
    "z test p-value",
    "statistical significance calculator",
  ],
  openGraph: {
    title: "P-Value Calculator — Statistical Significance Testing",
    description:
      "Find p-values for one-tailed and two-tailed z-tests with clear interpretation against alpha levels.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "P-Value Calculator | SoftZaR",
    description:
      "Compute p-values and significance decisions from z-statistics instantly.",
  },
};

export default function PValueCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

