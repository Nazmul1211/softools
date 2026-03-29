import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Body Fat Calculator - Estimate Your Body Fat Percentage",
  description:
    "Free body fat calculator using the US Navy method, BMI method, and body measurements. Get accurate body fat percentage estimates for men and women.",
  keywords: [
    "body fat calculator",
    "body fat percentage",
    "Navy method",
    "body composition",
    "fat percentage",
    "fitness calculator",
  ],
  openGraph: {
    title: "Body Fat Calculator - Estimate Your Body Fat Percentage",
    description:
      "Calculate your body fat percentage using multiple methods including the US Navy formula and BMI method.",
    type: "website",
  },
};

export default function BodyFatCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
