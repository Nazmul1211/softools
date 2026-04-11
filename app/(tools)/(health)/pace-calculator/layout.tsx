import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pace Calculator — Running, Walking & Cycling Pace | SoftZaR",
  description:
    "Calculate running pace, finish time, or distance for any race. Supports miles and kilometers with splits for 5K, 10K, half marathon, and marathon. Free pace calculator.",
  keywords: [
    "pace calculator",
    "running pace calculator",
    "race pace calculator",
    "marathon pace calculator",
    "5k pace",
    "10k pace",
    "half marathon pace",
    "pace per mile",
    "pace per km",
  ],
  openGraph: {
    title: "Pace Calculator — Find Your Running Pace & Finish Time",
    description:
      "Calculate running pace, finish time, or distance. Get pace splits for 5K, 10K, half marathon, and marathon distances. Free tool for runners.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pace Calculator | SoftZaR",
    description:
      "Calculate your running, walking, or cycling pace. Get finish time predictions and race splits.",
  },
};

export default function PaceCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
