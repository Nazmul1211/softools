import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Break-Even Calculator - Find Your Break-Even Point",
  description:
    "Free break-even calculator to determine how many units you need to sell to cover costs. Calculate break-even point in units, revenue, and analyze profitability.",
  keywords: [
    "break-even calculator",
    "break even point",
    "break-even analysis",
    "BEP calculator",
    "fixed costs",
    "variable costs",
    "business calculator",
    "profitability analysis",
  ],
  openGraph: {
    title: "Break-Even Calculator - Find Your Break-Even Point",
    description:
      "Calculate your break-even point to know exactly how many units or dollars in sales you need to cover costs.",
    type: "website",
  },
};

export default function BreakEvenCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
