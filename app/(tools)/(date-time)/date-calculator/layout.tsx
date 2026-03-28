import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Date Calculator - Days Between Dates & Add/Subtract Days",
  description:
    "Calculate the number of days between two dates, add or subtract days from a date. Find business days, weekends, and time differences. Free online date calculator.",
  keywords: [
    "date calculator",
    "days between dates",
    "add days to date",
    "subtract days from date",
    "date difference",
    "business days calculator",
    "how many days until",
    "date duration",
  ],
  openGraph: {
    title: "Date Calculator - Calculate Days Between Dates",
    description: "Calculate days between dates, add or subtract days. Find business days, weekends, and precise time differences instantly.",
    type: "website",
  },
};

export default function DateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
