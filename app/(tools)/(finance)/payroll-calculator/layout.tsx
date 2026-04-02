import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payroll Calculator - Estimate Gross-to-Net Pay | Softzar",
  description:
    "Calculate gross pay, estimated taxes, deductions, and take-home pay with this payroll calculator for hourly and salaried employees.",
  keywords: [
    "payroll calculator",
    "take home pay calculator",
    "gross to net pay",
    "salary payroll calculator",
    "hourly payroll calculator",
    "paycheck estimator",
  ],
  openGraph: {
    title: "Payroll Calculator - Estimate Gross-to-Net Pay",
    description:
      "Estimate payroll outcomes including gross wages, taxes, deductions, and net pay for common pay schedules.",
    type: "website",
  },
};

export default function PayrollCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

