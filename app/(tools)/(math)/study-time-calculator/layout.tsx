import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Time Calculator - Estimate Study Hours Needed",
  description:
    "Calculate total study hours needed based on learning goals, subject difficulty, and available time. Optimize study planning and preparation.",
  keywords: [
    "study time calculator",
    "study hours calculator",
    "how many hours to study",
    "exam preparation calculator",
    "study duration estimator",
    "learning time calculator",
    "homework time calculator",
  ],
  openGraph: {
    title: "Study Time Calculator",
    description: "Calculate how many hours you need to study based on goals and difficulty.",
    type: "website",
    url: "https://softzar.com/study-time-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Time Calculator | SoftZaR",
    description: "Estimate study hours needed for exams and coursework.",
  },
  alternates: {
    canonical: "https://softzar.com/study-time-calculator/",
  },
};

export default function StudyTimeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
