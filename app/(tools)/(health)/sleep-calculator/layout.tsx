import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep Calculator - Find Your Perfect Bedtime & Wake Time",
  description:
    "Calculate optimal sleep and wake times based on sleep cycles. Wake up refreshed by timing your sleep to complete full 90-minute cycles. Free sleep cycle calculator.",
  keywords: [
    "sleep calculator",
    "sleep cycle calculator",
    "bedtime calculator",
    "wake up time calculator",
    "sleep cycles",
    "REM sleep",
    "optimal sleep",
    "sleep schedule",
  ],
  openGraph: {
    title: "Sleep Calculator - Find Your Optimal Bedtime",
    description: "Calculate the best times to sleep and wake based on 90-minute sleep cycles. Wake up feeling refreshed instead of groggy.",
    type: "website",
  },
};

export default function SleepCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
