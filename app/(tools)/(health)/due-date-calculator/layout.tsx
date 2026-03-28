import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Due Date Calculator - Pregnancy Due Date & Week Calculator",
  description:
    "Calculate your pregnancy due date based on your last menstrual period or conception date. Track your pregnancy week by week with our free due date calculator.",
  keywords: [
    "due date calculator",
    "pregnancy calculator",
    "pregnancy due date",
    "conception date calculator",
    "how many weeks pregnant",
    "baby due date",
    "pregnancy week calculator",
    "EDD calculator",
  ],
  openGraph: {
    title: "Pregnancy Due Date Calculator - Free Online Tool",
    description: "Calculate your baby's due date based on your last period or conception date. Track pregnancy progress week by week.",
    type: "website",
  },
};

export default function DueDateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
