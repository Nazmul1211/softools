import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age Calculator - Calculate Your Exact Age",
  description:
    "Free age calculator to find your exact age in years, months, and days. Also calculates total days lived and days until your next birthday.",
  keywords: [
    "age calculator",
    "calculate age",
    "how old am I",
    "birthday calculator",
    "date of birth calculator",
    "age in days",
  ],
};

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
