import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "US Paycheck Calculator - Federal + State Take-Home Pay",
  description:
    "Estimate US net pay per paycheck with federal tax brackets, FICA, and state withholding assumptions. Compare salary and hourly scenarios instantly.",
  keywords: [
    "us paycheck calculator",
    "take home pay calculator usa",
    "salary to paycheck calculator",
    "hourly paycheck calculator",
    "federal and state tax calculator",
    "net pay estimator",
    "paycheck withholding calculator",
    "gross to net paycheck",
  ],
  openGraph: {
    title: "US Paycheck Calculator - Federal + State Net Pay Estimator",
    description:
      "Calculate paycheck estimates by state using federal tax brackets, Social Security, Medicare, and customizable deductions.",
    type: "website",
    url: "https://softzar.com/us-paycheck-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/us-paycheck-calculator/",
  },
};

export default function USPaycheckCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
