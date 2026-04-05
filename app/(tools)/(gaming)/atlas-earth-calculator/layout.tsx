import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlas Earth Calculator (AE Calculator) - Calculate Earnings & ROI",
  description:
    "Free Atlas Earth Calculator to estimate your parcel earnings, badge boosts, rent income, and ROI. Plan your AE strategy with accurate daily, monthly, and yearly projections.",
  keywords: [
    "atlas earth calculator",
    "ae calculator",
    "atlas earth earnings",
    "atlas earth roi",
    "atlas earth rent calculator",
    "atlas earth badge calculator",
    "atlas earth parcel calculator",
    "atlas bucks calculator",
    "atlas earth profit",
    "atlas earth investment calculator",
  ],
  openGraph: {
    title: "Atlas Earth Calculator (AE Calculator) - Earnings & ROI Calculator",
    description:
      "Calculate your Atlas Earth earnings, badge boosts, and ROI. Free online tool to plan your virtual land investment strategy.",
    type: "website",
  },
};

export default function AtlasEarthCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
