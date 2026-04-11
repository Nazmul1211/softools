import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heart Rate Zones Calculator — Training Zones by Age & Max HR | SoftZaR",
  description:
    "Calculate your 5 heart rate training zones based on age, resting heart rate, and max HR. Supports both standard %Max HR and Karvonen methods. Free fitness calculator.",
  keywords: [
    "heart rate zones calculator",
    "training zones calculator",
    "heart rate zone chart",
    "karvonen formula",
    "max heart rate calculator",
    "fat burning zone calculator",
    "target heart rate",
    "zone 2 training calculator",
  ],
  openGraph: {
    title: "Heart Rate Zones Calculator — Find Your 5 Training Zones",
    description:
      "Calculate personalized heart rate training zones using the Karvonen or standard method. Free calculator for runners, cyclists, and fitness enthusiasts.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heart Rate Zones Calculator | SoftZaR",
    description:
      "Find your 5 heart rate training zones based on age and fitness level. Free online calculator.",
  },
};

export default function HeartRateZonesCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
