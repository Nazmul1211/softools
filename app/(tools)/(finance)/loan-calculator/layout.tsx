import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Calculator - Calculate Monthly Payments & Interest",
  description:
    "Free loan calculator to compute monthly payments, total interest, and total cost of any loan. Perfect for mortgages, auto loans, and personal loans.",
  keywords: [
    "loan calculator",
    "monthly payment calculator",
    "interest calculator",
    "mortgage calculator",
    "auto loan calculator",
    "EMI calculator",
  ],
};

export default function LoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
