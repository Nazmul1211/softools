import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Calculator - Calculate Sale Prices & Savings",
  description:
    "Calculate discounts, sale prices, and savings instantly. Find the final price after percentage or fixed amount discounts. Free discount calculator for shopping and business.",
  keywords: [
    "discount calculator",
    "sale price calculator",
    "percent off calculator",
    "savings calculator",
    "price calculator",
    "calculate discount",
    "percent discount",
    "shopping calculator",
  ],
  openGraph: {
    title: "Free Discount Calculator - Calculate Sale Prices Instantly",
    description: "Calculate discounts, final prices, and savings. Support for percentage off, fixed discounts, and multiple discount stacking.",
    type: "website",
  },
};

export default function DiscountCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
