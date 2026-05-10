import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Days Calculator - Working Days Between Dates",
  description:
    "Calculate business days between dates or add/subtract working days with optional US federal holiday exclusion. Ideal for deadlines, SLAs, and invoicing terms.",
  keywords: [
    "business days calculator",
    "working days between dates",
    "add business days",
    "subtract business days",
    "deadline calculator",
    "weekday calculator",
    "invoice due date calculator",
    "sla response calculator",
  ],
  openGraph: {
    title: "Business Days Calculator - Count and Shift Working Days",
    description:
      "Get accurate weekday-only counts and date shifts for operations, contracts, and planning workflows.",
    type: "website",
    url: "https://softzar.com/business-days-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/business-days-calculator/",
  },
};

export default function BusinessDaysCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
