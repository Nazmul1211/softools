import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flooring Calculator - Area, Boxes, Waste, Cost Estimate",
  description:
    "Estimate flooring quantity by room with waste factor, box coverage, and material cost. Includes underlayment budget support.",
  keywords: [
    "flooring calculator",
    "flooring estimate calculator",
    "how much flooring do i need",
    "laminate flooring calculator",
    "vinyl plank flooring calculator",
    "flooring box calculator",
    "flooring waste calculator",
    "flooring cost estimator",
  ],
  openGraph: {
    title: "Flooring Calculator - Boxes and Cost Estimator",
    description:
      "Calculate flooring area, waste-adjusted quantity, box count, and material cost for home projects.",
    type: "website",
    url: "https://softzar.com/flooring-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/flooring-calculator/",
  },
};

export default function FlooringCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
