import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Hour Calculator - Semester & Degree Planning",
  description:
    "Calculate credit hours needed for semester completion, degree progress, and graduation timeline. Plan course load and credit requirements.",
  keywords: [
    "credit hour calculator",
    "semester credit hours",
    "degree progress calculator",
    "credit requirements calculator",
    "graduation timeline calculator",
    "course credits calculator",
    "academic credit planner",
  ],
  openGraph: {
    title: "Credit Hour Calculator",
    description: "Calculate credit hours needed for your degree and semester planning.",
    type: "website",
    url: "https://softzar.com/credit-hour-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Hour Calculator | SoftZaR",
    description: "Plan your degree progress and semester credit requirements.",
  },
  alternates: {
    canonical: "https://softzar.com/credit-hour-calculator/",
  },
};

export default function CreditHourCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
