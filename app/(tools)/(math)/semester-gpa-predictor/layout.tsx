import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semester GPA Predictor - Forecast Cumulative GPA | SoftZaR",
  description:
    "Predict your cumulative GPA after the current semester and calculate the semester GPA required to hit a target GPA.",
  keywords: [
    "semester gpa predictor",
    "gpa predictor",
    "required semester gpa",
    "target cumulative gpa calculator",
    "college gpa forecast",
  ],
  openGraph: {
    title: "Semester GPA Predictor - Forecast Cumulative GPA",
    description:
      "Estimate projected cumulative GPA and required semester GPA for your target.",
    type: "website",
    url: "https://softzar.com/semester-gpa-predictor/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semester GPA Predictor | SoftZaR",
    description: "Forecast your cumulative GPA and required term GPA.",
  },
  alternates: {
    canonical: "https://softzar.com/semester-gpa-predictor/",
  },
};

export default function SemesterGPAPredictorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
