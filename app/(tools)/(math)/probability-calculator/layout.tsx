import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Probability Calculator - Calculate Event Probabilities",
  description:
    "Free probability calculator for single and multiple events. Calculate probability of A and B, A or B, conditional probability, and complement with step-by-step solutions.",
  keywords: [
    "probability calculator",
    "calculate probability",
    "probability of events",
    "conditional probability",
    "probability formula",
    "statistics calculator",
    "odds calculator",
    "chance calculator",
  ],
  openGraph: {
    title: "Probability Calculator - Calculate Event Probabilities",
    description:
      "Calculate probabilities for single and multiple events with step-by-step solutions.",
    type: "website",
  },
};

export default function ProbabilityCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
