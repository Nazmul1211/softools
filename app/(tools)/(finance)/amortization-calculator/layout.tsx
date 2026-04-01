import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amortization Calculator - Loan Payment Schedule & Breakdown",
  description:
    "Free amortization calculator to view your loan payment schedule. See monthly payments, principal vs interest breakdown, and full amortization table for mortgages and loans.",
  keywords: [
    "amortization calculator",
    "loan amortization",
    "mortgage amortization",
    "payment schedule",
    "amortization schedule",
    "loan payment breakdown",
    "principal and interest",
    "amortization table",
  ],
  openGraph: {
    title: "Amortization Calculator - Loan Payment Schedule & Breakdown",
    description:
      "Calculate your loan amortization schedule with monthly payment breakdown. Free amortization calculator.",
    type: "website",
  },
};

export default function AmortizationCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
