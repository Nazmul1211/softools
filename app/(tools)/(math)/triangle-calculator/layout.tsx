import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Triangle Calculator — Solve Any Triangle (SSS, SAS, ASA, AAS) | Softzar",
  description:
    "Calculate all triangle properties from sides and angles. Find area, perimeter, altitudes, medians, inradius, circumradius using SSS, SAS, ASA, or AAS methods.",
  keywords: [
    "triangle calculator",
    "solve triangle",
    "triangle area calculator",
    "SSS calculator",
    "SAS calculator",
    "law of cosines",
    "law of sines",
    "geometry calculator",
    "triangle solver",
  ],
  openGraph: {
    title: "Triangle Calculator — Solve Any Triangle",
    description:
      "Calculate all triangle properties from sides and angles. Find area, perimeter, altitudes, medians, and more using SSS, SAS, ASA, or AAS methods.",
    type: "website",
  },
};

export default function TriangleCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
