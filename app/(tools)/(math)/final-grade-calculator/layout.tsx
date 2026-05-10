import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final Grade Calculator - Score Needed on Final Exam",
  description:
    "Find the exact final exam score you need to reach your course target. Estimate projected final grade, risk level, and recovery path in seconds.",
  keywords: [
    "final grade calculator",
    "what do i need on my final",
    "final exam score needed",
    "course grade calculator",
    "grade target calculator",
    "college final grade calculator",
    "high school final exam calculator",
    "grade recovery calculator",
  ],
  openGraph: {
    title: "Final Grade Calculator - Plan Your Target Score",
    description:
      "Calculate the final exam score required for your target course grade and compare it with your expected exam performance.",
    type: "website",
    url: "https://softzar.com/final-grade-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Final Grade Calculator | SoftZaR",
    description:
      "Calculate the exact final exam score needed to hit your target grade.",
  },
  alternates: {
    canonical: "https://softzar.com/final-grade-calculator/",
  },
};

export default function FinalGradeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
