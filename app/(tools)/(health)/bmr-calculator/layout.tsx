import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMR Calculator - Calculate Basal Metabolic Rate",
  description:
    "Calculate your Basal Metabolic Rate (BMR) with multiple formulas including Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle. Learn your daily calorie needs at rest.",
  keywords: [
    "BMR calculator",
    "basal metabolic rate",
    "metabolism calculator",
    "calories at rest",
    "daily calorie calculator",
    "metabolic rate",
    "Mifflin-St Jeor",
    "Harris-Benedict",
  ],
  openGraph: {
    title: "Free BMR Calculator - Calculate Your Metabolic Rate",
    description: "Calculate your Basal Metabolic Rate (BMR) using scientifically validated formulas. Understand how many calories your body burns at rest.",
    type: "website",
  },
};

export default function BMRCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
