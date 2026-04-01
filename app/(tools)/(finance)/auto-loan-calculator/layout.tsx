import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Loan Calculator - Calculate Car Payment & Interest",
  description:
    "Free auto loan calculator to estimate your monthly car payment, total interest, and amortization schedule. Compare loan terms and make informed car buying decisions.",
  keywords: [
    "auto loan calculator",
    "car loan calculator",
    "car payment calculator",
    "vehicle loan calculator",
    "auto financing calculator",
    "car finance calculator",
    "monthly car payment",
    "auto loan interest",
  ],
  openGraph: {
    title: "Auto Loan Calculator - Calculate Car Payment & Interest",
    description:
      "Calculate your monthly car payment, total interest, and view amortization schedule. Free auto loan calculator for car buyers.",
    type: "website",
  },
};

export default function AutoLoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
