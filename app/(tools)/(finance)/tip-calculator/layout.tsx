import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tip Calculator - Calculate Tips & Split Bills Easily",
  description:
    "Free tip calculator to quickly calculate tips and split bills. Calculate 15%, 18%, 20% tips or custom amounts. Perfect for restaurants, delivery, and service tipping.",
  keywords: [
    "tip calculator",
    "gratuity calculator",
    "restaurant tip",
    "bill splitter",
    "tip percentage",
    "how much to tip",
    "split bill calculator",
    "service tip",
  ],
  openGraph: {
    title: "Tip Calculator - Quick Tip & Bill Split Calculator",
    description: "Calculate tips and split bills in seconds. Works for restaurants, delivery, salons, and any service. Free and easy to use.",
    type: "website",
  },
};

export default function TipCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
