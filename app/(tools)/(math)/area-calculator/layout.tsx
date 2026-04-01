import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area Calculator - Calculate Area of Any Shape",
  description:
    "Free area calculator for all shapes: circle, rectangle, triangle, trapezoid, ellipse, parallelogram, and more. Get instant results with formulas and step-by-step calculations.",
  keywords: [
    "area calculator",
    "calculate area",
    "area of circle",
    "area of rectangle",
    "area of triangle",
    "square footage calculator",
    "geometry calculator",
    "shape area",
  ],
  openGraph: {
    title: "Area Calculator - Calculate Area of Any Shape",
    description:
      "Calculate the area of any geometric shape instantly. Includes circles, rectangles, triangles, and more.",
    type: "website",
  },
};

export default function AreaCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
