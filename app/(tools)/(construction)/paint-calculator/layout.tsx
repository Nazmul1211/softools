import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paint Calculator - Wall Area, Gallons, and Cost Estimate",
  description:
    "Estimate paint and primer gallons from room dimensions, openings, coats, and coverage assumptions. Includes material cost planning.",
  keywords: [
    "paint calculator",
    "how much paint do i need",
    "paint coverage calculator",
    "room paint estimator",
    "paint gallons calculator",
    "wall paint calculator",
    "primer calculator",
    "paint cost estimator",
  ],
  openGraph: {
    title: "Paint Calculator - Estimate Gallons and Budget",
    description:
      "Calculate paint quantity, primer, and cost using room dimensions, coat count, and coverage assumptions.",
    type: "website",
    url: "https://softzar.com/paint-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/paint-calculator/",
  },
};

export default function PaintCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
