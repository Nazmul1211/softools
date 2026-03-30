import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calories Burned Calculator - Track Exercise Calories",
  description:
    "Calculate how many calories you burn during exercise and daily activities. Enter your weight, activity type, and duration to get accurate calorie estimates.",
  keywords: [
    "calories burned calculator",
    "exercise calories",
    "workout calories",
    "calories burned running",
    "calories burned walking",
    "MET calculator",
    "activity calories",
    "fitness calculator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
