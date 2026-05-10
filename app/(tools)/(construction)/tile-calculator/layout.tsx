import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tile Calculator - Pieces, Boxes, Thinset, Grout, Cost",
  description:
    "Estimate tile quantity, box count, thinset, grout, and material cost from area dimensions, tile size, grout joints, and pattern waste.",
  keywords: [
    "tile calculator",
    "tile quantity calculator",
    "how many tiles do i need",
    "tile box calculator",
    "floor tile estimator",
    "wall tile calculator",
    "thinset calculator",
    "grout calculator",
  ],
  openGraph: {
    title: "Tile Calculator - Material and Cost Estimator",
    description:
      "Calculate tile count, boxes, thinset, and grout for flooring or wall tiling projects.",
    type: "website",
    url: "https://softzar.com/tile-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/tile-calculator/",
  },
};

export default function TileCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
