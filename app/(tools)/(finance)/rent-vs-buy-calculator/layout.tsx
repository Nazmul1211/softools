import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator — Should You Rent or Buy a Home? | SoftZaR",
  description:
    "Compare the true cost of renting vs buying a home over time. Factor in mortgage, taxes, maintenance, appreciation, and opportunity cost. Free rent or buy calculator.",
  keywords: [
    "rent vs buy calculator",
    "should I rent or buy",
    "rent or buy a house",
    "rent vs buy comparison",
    "cost of renting vs buying",
    "home buying calculator",
    "renting vs owning",
    "breakeven rent buy",
    "rent vs mortgage calculator",
  ],
  openGraph: {
    title: "Rent vs Buy Calculator — Compare the True Cost of Housing",
    description:
      "Compare the total cost of renting vs buying over 5–30 years. Includes mortgage, taxes, maintenance, appreciation, and opportunity cost analysis.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent vs Buy Calculator | SoftZaR",
    description:
      "Should you rent or buy? Compare total housing costs over time with this free calculator.",
  },
};

export default function RentVsBuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
