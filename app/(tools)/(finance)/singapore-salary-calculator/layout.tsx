import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Singapore Salary Calculator - PAYE, CPF | SoftZaR",
  description:
    "Estimate Singapore take-home salary after PAYE income tax and CPF contributions.",
  keywords: [
    "singapore salary calculator",
    "singapore tax calculator",
    "cpf calculator singapore",
    "paye singapore",
    "singapore net pay calculator",
  ],
  openGraph: {
    title: "Singapore Salary Calculator",
    description:
      "Calculate Singapore net salary with PAYE tax and CPF deductions.",
    type: "website",
    url: "https://softzar.com/singapore-salary-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/singapore-salary-calculator/",
  },
};

export default function SingaporeSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
