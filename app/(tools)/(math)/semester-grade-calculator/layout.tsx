import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semester Grade Calculator - GPA and Cumulative Projection",
  description:
    "Calculate semester GPA from course credits and grades, then project updated cumulative GPA using prior credits and GPA.",
  keywords: [
    "semester grade calculator",
    "semester gpa calculator",
    "term gpa calculator",
    "projected cumulative gpa",
    "college semester grade calculator",
    "credit weighted gpa calculator",
    "deans list gpa calculator",
    "quality points calculator",
  ],
  openGraph: {
    title: "Semester Grade Calculator - GPA + Cumulative Forecast",
    description:
      "Estimate your semester GPA and updated cumulative GPA with credit-weighted grade math.",
    type: "website",
    url: "https://softzar.com/semester-grade-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semester Grade Calculator | SoftZaR",
    description: "Calculate semester GPA and forecast cumulative GPA outcomes.",
  },
  alternates: {
    canonical: "https://softzar.com/semester-grade-calculator/",
  },
};

export default function SemesterGradeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
