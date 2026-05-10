import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance Percentage Calculator",
  description:
    "Calculate class attendance percentage and determine how many classes you can miss while maintaining your target attendance rate.",
  keywords: [
    "attendance percentage calculator",
    "class attendance calculator",
    "school attendance calculator",
    "attendance rate calculator",
    "classes missed calculator",
    "college attendance",
    "minimum attendance requirement",
  ],
  openGraph: {
    title: "Attendance Percentage Calculator",
    description: "Calculate your attendance rate and plan for future absences.",
    type: "website",
    url: "https://softzar.com/attendance-percentage-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Attendance Percentage Calculator | SoftZaR",
    description: "Calculate class attendance percentage and target maintenance.",
  },
  alternates: {
    canonical: "https://softzar.com/attendance-percentage-calculator/",
  },
};

export default function AttendancePercentageCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
