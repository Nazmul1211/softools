import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slope Calculator — Find Slope from Two Points | Softzar",
  description:
    "Calculate slope from two points, rise and run, or equation form. Get slope as decimal, fraction, degrees, percent grade, plus slope-intercept and standard form equations.",
  keywords: [
    "slope calculator",
    "find slope",
    "slope from two points",
    "rise over run",
    "slope formula",
    "slope intercept form",
    "line equation calculator",
    "gradient calculator",
  ],
  openGraph: {
    title: "Slope Calculator — Find Slope from Two Points",
    description:
      "Calculate slope from two points, rise and run, or equation form. Get slope as decimal, fraction, degrees, percent grade, and all equation forms.",
    type: "website",
  },
};

export default function SlopeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
