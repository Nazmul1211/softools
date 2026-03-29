import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Calculator - Convert Hourly, Monthly, Annual Wages",
  description:
    "Free salary calculator to convert between hourly, daily, weekly, bi-weekly, monthly, and annual wages. Estimate take-home pay after taxes and deductions.",
  keywords: [
    "salary calculator",
    "wage converter",
    "hourly to salary",
    "annual salary",
    "take home pay",
    "paycheck calculator",
    "income calculator",
  ],
};

export default function SalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
