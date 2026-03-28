import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calorie Calculator - Daily Calorie Needs for Weight Loss & Gain",
  description:
    "Free calorie calculator to find your daily calorie needs based on age, weight, height, and activity level. Calculate calories for weight loss, maintenance, or muscle gain.",
  keywords: [
    "calorie calculator",
    "daily calories",
    "TDEE calculator",
    "weight loss calories",
    "calorie intake",
    "BMR calculator",
    "macros calculator",
    "how many calories",
  ],
  openGraph: {
    title: "Calorie Calculator - How Many Calories Do You Need?",
    description: "Calculate your daily calorie needs for weight loss, maintenance, or muscle gain. Get personalized recommendations based on your body and goals.",
    type: "website",
  },
};

export default function CalorieCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
