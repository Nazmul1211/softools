import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Down Payment Calculator - Plan Home Purchase Upfront Cash | Softzar",
  description:
    "Estimate required down payment, loan amount, monthly mortgage, and PMI threshold impact for your next home purchase.",
  keywords: [
    "down payment calculator",
    "house down payment",
    "mortgage down payment calculator",
    "home buying calculator",
    "pmi calculator",
    "loan amount calculator",
  ],
  openGraph: {
    title: "Down Payment Calculator - Plan Home Purchase Upfront Cash",
    description:
      "Calculate down payment amount, financing needed, and estimated monthly mortgage outcomes for different percentages.",
    type: "website",
  },
};

export default function DownPaymentCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

