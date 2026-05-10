import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Card Calculator - Weekly Hours, Overtime, Gross Pay",
  description:
    "Calculate weekly worked hours, overtime, and gross pay from daily start/end times. Supports breaks, overnight shifts, and configurable overtime rules.",
  keywords: [
    "time card calculator",
    "weekly hours calculator",
    "overtime calculator",
    "timesheet calculator",
    "work hours and pay calculator",
    "employee time tracker calculator",
    "gross pay from hours",
    "shift hours calculator",
  ],
  openGraph: {
    title: "Time Card Calculator - Work Hours and Overtime",
    description:
      "Turn shift times into payroll-ready regular hours, overtime totals, and estimated gross pay.",
    type: "website",
    url: "https://softzar.com/time-card-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/time-card-calculator/",
  },
};

export default function TimeCardCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
