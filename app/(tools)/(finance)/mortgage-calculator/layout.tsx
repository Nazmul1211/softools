import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Calculator - Calculate Monthly Payments & Amortization",
  description:
    "Free mortgage calculator to estimate your monthly home loan payments, total interest, and amortization schedule. Compare different loan terms and interest rates instantly.",
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "monthly payment calculator",
    "amortization calculator",
    "mortgage payment",
    "house payment calculator",
    "loan calculator",
    "home buying calculator",
  ],
  openGraph: {
    title: "Free Mortgage Calculator - Estimate Your Home Loan Payments",
    description: "Calculate your monthly mortgage payments, total interest, and view a complete amortization schedule. Plan your home purchase with confidence.",
    type: "website",
  },
};

export default function MortgageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
