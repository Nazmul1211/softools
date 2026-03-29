import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grade Calculator - Calculate Final Grade & What You Need",
  description:
    "Free grade calculator to compute your current grade and determine what score you need on your final exam to reach your target grade.",
  keywords: [
    "grade calculator",
    "final grade calculator",
    "what grade do I need",
    "weighted grade",
    "final exam calculator",
    "GPA calculator",
  ],
  openGraph: {
    title: "Grade Calculator - Calculate Final Grade & What You Need",
    description: "Calculate your current grade and find out what you need on finals.",
    type: "website",
  },
};

export default function GradeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
