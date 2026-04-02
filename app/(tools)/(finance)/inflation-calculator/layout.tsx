import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inflation Calculator - Measure Buying Power Over Time | Softzar",
  description:
    "Calculate how inflation changes purchasing power over time. Estimate future costs, past value, and annualized inflation impact with a free inflation calculator.",
  keywords: [
    "inflation calculator",
    "purchasing power calculator",
    "future value inflation",
    "cost of inflation",
    "inflation rate calculator",
    "money value over time",
  ],
  openGraph: {
    title: "Inflation Calculator - Measure Buying Power Over Time",
    description:
      "Estimate how inflation affects buying power and what prices become over time using annual inflation assumptions.",
    type: "website",
  },
};

export default function InflationCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

