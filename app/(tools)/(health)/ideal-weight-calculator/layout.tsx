import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideal Weight Calculator - Find Your Healthy Weight Range",
  description:
    "Calculate your ideal body weight using multiple scientific formulas including Devine, Robinson, Miller, and Hamwi. Get personalized healthy weight recommendations.",
  keywords: [
    "ideal weight calculator",
    "healthy weight",
    "ideal body weight",
    "IBW calculator",
    "Devine formula",
    "target weight",
  ],
  openGraph: {
    title: "Ideal Weight Calculator - Find Your Healthy Weight Range",
    description:
      "Find your ideal body weight using scientifically validated formulas for men and women.",
    type: "website",
  },
};

export default function IdealWeightCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
