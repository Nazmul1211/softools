import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roofing Calculator - Roof Area, Squares, Bundles, Cost",
  description:
    "Estimate roofing squares, shingle bundles, underlayment, drip edge, and cost from roof dimensions, pitch, and waste factor.",
  keywords: [
    "roofing calculator",
    "roof area calculator",
    "roofing squares calculator",
    "shingle bundle calculator",
    "roof replacement cost estimator",
    "roof pitch calculator",
    "how many bundles of shingles",
    "roofing material estimator",
  ],
  openGraph: {
    title: "Roofing Calculator - Material and Cost Estimator",
    description:
      "Calculate roof area, squares, bundles, and budget range for roofing projects using pitch and waste assumptions.",
    type: "website",
    url: "https://softzar.com/roofing-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/roofing-calculator/",
  },
};

export default function RoofingCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
