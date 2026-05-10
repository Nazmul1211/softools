import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Score Calculator - Percent, Points, and Scaled Score",
  description:
    "Calculate test scores from correct, incorrect, and blank answers. Get percentage, points, letter grade, and optional scaled score instantly.",
  keywords: [
    "test score calculator",
    "exam score calculator",
    "quiz score percentage calculator",
    "raw score to percent",
    "scaled score calculator",
    "multiple choice score calculator",
    "points based grading calculator",
    "letter grade score calculator",
  ],
  openGraph: {
    title: "Test Score Calculator - Fast Exam Score Breakdown",
    description:
      "Convert raw answers into percent score, points, and grade interpretation for quizzes and exams.",
    type: "website",
    url: "https://softzar.com/test-score-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Score Calculator | SoftZaR",
    description: "Calculate raw, percentage, and scaled test scores in seconds.",
  },
  alternates: {
    canonical: "https://softzar.com/test-score-calculator/",
  },
};

export default function TestScoreCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
