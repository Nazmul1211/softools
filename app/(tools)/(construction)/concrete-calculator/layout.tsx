import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concrete Calculator — Estimate Yards, Bags & Cost | SoftZaR",
  description:
    "Calculate how much concrete you need for slabs, footings, columns, and walls. Get results in cubic yards, cubic meters, bags of concrete, and estimated cost. Free online concrete estimator.",
  keywords: [
    "concrete calculator",
    "concrete estimator",
    "how much concrete do i need",
    "concrete yardage calculator",
    "concrete bags calculator",
    "concrete cost calculator",
    "concrete slab calculator",
    "cubic yards of concrete",
    "concrete footing calculator",
    "ready mix concrete calculator",
  ],
  openGraph: {
    title: "Concrete Calculator — Estimate Yards, Bags & Cost | SoftZaR",
    description: "Calculate concrete needed for any project. Free and instant.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Calculator | SoftZaR",
    description: "Estimate concrete volume, bags, and cost. Free and instant.",
  },
  alternates: { canonical: "https://softzar.com/concrete-calculator/" },
};

export default function ConcreteCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
