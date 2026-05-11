import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australia Salary Calculator - Tax, Medicare Levy | SoftZaR",
  description:
    "Estimate Australian take-home salary after PAYG tax, Medicare levy, and superannuation contributions.",
  keywords: [
    "australia salary calculator",
    "australian tax calculator",
    "payg tax calculator",
    "medicare levy calculator",
    "superannuation calculator australia",
  ],
  openGraph: {
    title: "Australia Salary Calculator",
    description:
      "Calculate Australian net salary with tax, Medicare levy, and super deductions.",
    type: "website",
    url: "https://softzar.com/australia-salary-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/australia-salary-calculator/",
  },
};

export default function AustraliaSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
