import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Square Footage Calculator — Calculate Area in Sq Ft | SoftZaR",
  description:
    "Calculate the square footage of rooms, flooring, walls, and land. Supports rectangular, triangular, circular, and L-shaped areas. Convert between sq ft, sq m, and acres. Free online area calculator.",
  keywords: [
    "square footage calculator",
    "area calculator",
    "sq ft calculator",
    "how to calculate square footage",
    "room square footage",
    "flooring calculator",
    "square feet to square meters",
    "land area calculator",
    "wall area calculator",
    "square footage of a room",
  ],
  openGraph: {
    title: "Square Footage Calculator — Calculate Area | SoftZaR",
    description: "Calculate square footage for rooms, flooring, walls, and land. Free and instant.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Footage Calculator | SoftZaR",
    description: "Calculate area in square feet for any shape. Free.",
  },
  alternates: { canonical: "https://softzar.com/square-footage-calculator/" },
};

export default function SquareFootageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
