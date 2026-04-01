import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profit Calculator - Calculate Business Profit & Margins",
  description:
    "Free profit calculator to determine gross profit, net profit, and profit margins. Calculate profitability from revenue, costs, and expenses for your business.",
  keywords: [
    "profit calculator",
    "gross profit calculator",
    "net profit calculator",
    "profit margin",
    "business profit",
    "calculate profit",
    "profitability calculator",
    "revenue profit calculator",
  ],
  openGraph: {
    title: "Profit Calculator - Calculate Business Profit & Margins",
    description:
      "Calculate gross profit, net profit, and profit margins for your business. Free profit calculator.",
    type: "website",
  },
};

export default function ProfitCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
