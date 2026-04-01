import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volume Calculator - Calculate Volume of 3D Shapes",
  description:
    "Free volume calculator for all 3D shapes: cube, sphere, cylinder, cone, pyramid, and more. Get instant results with formulas and step-by-step calculations.",
  keywords: [
    "volume calculator",
    "calculate volume",
    "volume of sphere",
    "volume of cylinder",
    "volume of cube",
    "3D shape calculator",
    "cubic calculator",
    "geometry calculator",
  ],
  openGraph: {
    title: "Volume Calculator - Calculate Volume of 3D Shapes",
    description:
      "Calculate the volume of any 3D shape instantly. Includes spheres, cubes, cylinders, cones, and more.",
    type: "website",
  },
};

export default function VolumeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
