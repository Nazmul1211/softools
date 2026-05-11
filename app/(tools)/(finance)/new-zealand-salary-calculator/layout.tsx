import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Zealand Salary Calculator - PAYE, ACC, KiwiSaver | SoftZaR",
  description:
    "Estimate New Zealand take-home salary after PAYE income tax, ACC levies, and KiwiSaver contributions.",
  keywords: [
    "new zealand salary calculator",
    "nz salary calculator",
    "paye calculator nz",
    "kiwisaver calculator",
    "acc levy calculator",
    "new zealand net pay calculator",
  ],
  openGraph: {
    title: "New Zealand Salary Calculator",
    description:
      "Calculate NZ net salary with PAYE tax, ACC, and KiwiSaver deductions.",
    type: "website",
    url: "https://softzar.com/new-zealand-salary-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/new-zealand-salary-calculator/",
  },
};

export default function NewZealandSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
