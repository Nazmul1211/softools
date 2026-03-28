import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator - Calculate Your Body Mass Index",
  description:
    "Free BMI calculator to determine your body mass index. Get instant results with health category and healthy weight range for your height.",
  keywords: [
    "BMI calculator",
    "body mass index",
    "calculate BMI",
    "healthy weight",
    "weight calculator",
    "BMI chart",
  ],
};

export default function BMICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
