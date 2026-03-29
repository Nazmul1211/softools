import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TDEE Calculator - Calculate Total Daily Energy Expenditure",
  description:
    "Free TDEE calculator to estimate your Total Daily Energy Expenditure. Find out how many calories you burn per day based on your activity level for weight loss or muscle gain.",
  keywords: [
    "TDEE calculator",
    "total daily energy expenditure",
    "calories burned",
    "calorie calculator",
    "maintenance calories",
    "weight loss calculator",
  ],
  openGraph: {
    title: "TDEE Calculator - Calculate Total Daily Energy Expenditure",
    description:
      "Calculate how many calories you burn daily based on your BMR and activity level.",
    type: "website",
  },
};

export default function TDEECalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
