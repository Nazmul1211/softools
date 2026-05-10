import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Salary Calculator 2026/27 - Tax, NI, Pension, Student Loan",
  description:
    "Calculate UK take-home pay for 2026/27 with income tax, National Insurance, pension contributions, and student loan plans. Compare England/Wales/NI and Scotland.",
  keywords: [
    "uk salary calculator 2026/27",
    "uk take home pay calculator",
    "uk tax calculator",
    "national insurance calculator",
    "scotland salary calculator",
    "england salary calculator",
    "student loan repayment calculator uk",
    "net pay calculator uk",
  ],
  openGraph: {
    title: "UK Salary Calculator 2026/27",
    description:
      "Estimate UK annual and monthly take-home pay with region-aware tax assumptions and deduction modeling.",
    type: "website",
    url: "https://softzar.com/uk-salary-calculator",
  },
  alternates: {
    canonical: "https://softzar.com/uk-salary-calculator/",
  },
};

export default function UKSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
