import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protein Intake Calculator — Daily Protein Needs by Goal & Activity | SoftZaR",
  description:
    "Calculate your optimal daily protein intake based on body weight, activity level, and fitness goals. Evidence-based recommendations from ISSN and WHO guidelines. Free online calculator.",
  keywords: [
    "protein intake calculator",
    "how much protein do I need",
    "daily protein calculator",
    "protein per day",
    "protein for muscle gain",
    "protein for weight loss",
    "protein calculator bodybuilding",
    "protein needs by weight",
  ],
  openGraph: {
    title: "Protein Intake Calculator — How Much Protein Do You Need Daily?",
    description:
      "Calculate your optimal daily protein intake based on body weight, activity level, and fitness goals. Free calculator with evidence-based ISSN recommendations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protein Intake Calculator — Daily Protein Needs | SoftZaR",
    description:
      "Find your optimal daily protein target based on weight, activity, and goals. Free evidence-based calculator.",
  },
};

export default function ProteinIntakeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
