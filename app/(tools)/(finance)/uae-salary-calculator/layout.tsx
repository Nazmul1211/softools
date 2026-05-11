import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UAE Salary Calculator - No Income Tax | SoftZaR",
  description:
    "Calculate UAE take-home salary with no income tax, optional allowances, and deductions.",
  keywords: [
    "uae salary calculator",
    "dubai salary calculator",
    "uae take home pay",
    "emirates salary calculator",
    "no tax salary calculator uae",
  ],
  openGraph: {
    title: "UAE Salary Calculator",
    description:
      "Calculate UAE net salary with optional allowances and deductions. No income tax in UAE.",
    type: "website",
    url: "https://softzar.com/uae-salary-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/uae-salary-calculator/",
  },
};

export default function UAESalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
