import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pythagorean Theorem Calculator — Find Missing Side | Softzar",
  description:
    "Calculate the missing side of a right triangle using a² + b² = c². Find the hypotenuse or legs instantly with angles, area, perimeter, and Pythagorean triple detection.",
  keywords: [
    "pythagorean theorem calculator",
    "right triangle calculator",
    "hypotenuse calculator",
    "a2 + b2 = c2",
    "pythagorean triple",
    "find missing side",
    "right angle triangle",
    "geometry calculator",
  ],
  openGraph: {
    title: "Pythagorean Theorem Calculator — Find Missing Side",
    description:
      "Calculate the missing side of a right triangle using a² + b² = c². Find the hypotenuse or legs instantly with full triangle analysis.",
    type: "website",
  },
};

export default function PythagoreanTheoremCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
