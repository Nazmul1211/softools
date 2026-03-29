import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Square Root Calculator - Calculate √x, Cube Roots & Nth Roots",
  description:
    "Free square root calculator to find square roots, cube roots, and nth roots of any number. Includes step-by-step solutions and perfect square detection.",
  keywords: [
    "square root calculator",
    "cube root",
    "nth root",
    "radical calculator",
    "√ calculator",
    "root finder",
  ],
  openGraph: {
    title: "Square Root Calculator - Calculate √x, Cube Roots & Nth Roots",
    description: "Calculate square roots, cube roots, and any nth root with step-by-step solutions.",
    type: "website",
  },
};

export default function SquareRootCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
