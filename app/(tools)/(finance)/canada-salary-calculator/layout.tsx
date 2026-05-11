import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canada Salary Calculator - Federal, Provincial, CPP, EI | SoftZaR",
  description:
    "Estimate Canada take-home salary after federal tax, provincial tax, CPP, and EI deductions with province-specific assumptions.",
  keywords: [
    "canada salary calculator",
    "canadian take home pay calculator",
    "cpp ei calculator",
    "province tax salary calculator",
    "net salary canada",
  ],
  openGraph: {
    title: "Canada Salary Calculator",
    description:
      "Calculate Canadian net salary with federal + provincial tax and payroll deductions.",
    type: "website",
    url: "https://softzar.com/canada-salary-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/canada-salary-calculator/",
  },
};

export default function CanadaSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
