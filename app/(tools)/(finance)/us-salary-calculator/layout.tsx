import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "US Salary Calculator - Federal, State, FICA Take-Home | SoftZaR",
  description:
    "Estimate US net salary after federal tax, state tax, Social Security, and Medicare. Compare single and married filing scenarios.",
  keywords: [
    "us salary calculator",
    "take home pay usa",
    "federal state tax salary calculator",
    "fica paycheck calculator",
    "net salary usa",
  ],
  openGraph: {
    title: "US Salary Calculator",
    description:
      "Calculate US annual and monthly take-home salary with federal, state, and FICA deductions.",
    type: "website",
    url: "https://softzar.com/us-salary-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/us-salary-calculator/",
  },
};

export default function USSalaryCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
