import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "APR Calculator - Compare Loan Cost Beyond Interest | Softzar",
  description:
    "Use this APR calculator to estimate true borrowing cost by including loan fees. Compare APR vs interest rate and evaluate monthly payment impact.",
  keywords: [
    "apr calculator",
    "annual percentage rate",
    "loan apr calculator",
    "apr vs interest rate",
    "loan fee calculator",
    "borrowing cost calculator",
  ],
  openGraph: {
    title: "APR Calculator - Compare Loan Cost Beyond Interest",
    description:
      "Estimate annual percentage rate by combining nominal rate and upfront fees for a clearer loan comparison.",
    type: "website",
  },
};

export default function AprCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

