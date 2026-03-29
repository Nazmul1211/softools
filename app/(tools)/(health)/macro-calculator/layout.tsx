import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Macro Calculator - Calculate Daily Macronutrient Needs",
  description:
    "Free macro calculator to determine your optimal daily protein, carbohydrates, and fat intake based on your goals. Perfect for weight loss, muscle gain, or maintenance.",
  keywords: [
    "macro calculator",
    "macronutrient calculator",
    "protein calculator",
    "carbs calculator",
    "fat calculator",
    "IIFYM calculator",
  ],
  openGraph: {
    title: "Macro Calculator - Calculate Daily Macronutrient Needs",
    description:
      "Calculate your optimal daily macros (protein, carbs, fat) based on your fitness goals.",
    type: "website",
  },
};

export default function MacroCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
