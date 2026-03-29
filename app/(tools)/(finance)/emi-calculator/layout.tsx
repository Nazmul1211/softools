import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator - Calculate Monthly Loan EMI Payments",
  description:
    "Free EMI calculator to compute Equated Monthly Installments for home loans, car loans, and personal loans. See total interest, principal breakdown, and amortization schedule.",
  keywords: [
    "EMI calculator",
    "loan EMI",
    "monthly installment",
    "home loan EMI",
    "car loan EMI",
    "personal loan calculator",
    "equated monthly installment",
  ],
};

export default function EMICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
