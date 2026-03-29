import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Intake Calculator - Daily Hydration Needs",
  description:
    "Free water intake calculator to determine how much water you should drink daily based on your weight, activity level, and climate. Stay properly hydrated for optimal health.",
  keywords: [
    "water intake calculator",
    "hydration calculator",
    "daily water needs",
    "how much water to drink",
    "water calculator",
    "hydration needs",
  ],
  openGraph: {
    title: "Water Intake Calculator - Daily Hydration Needs",
    description:
      "Calculate how much water you should drink daily based on your weight and activity level.",
    type: "website",
  },
};

export default function WaterIntakeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
