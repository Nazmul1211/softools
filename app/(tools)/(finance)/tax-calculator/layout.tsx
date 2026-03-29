import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Calculator - Estimate Income Tax & Take-Home Pay",
  description:
    "Free income tax calculator to estimate federal and state taxes, take-home pay, and effective tax rate. Supports 2024 US tax brackets and deductions.",
  keywords: [
    "tax calculator",
    "income tax",
    "federal tax",
    "state tax",
    "tax brackets",
    "take home pay",
    "effective tax rate",
  ],
};

export default function TaxCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
