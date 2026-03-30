import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Calculator - Calculate Investment Growth",
  description:
    "Calculate how your investments will grow over time with compound interest. See total returns, interest earned, and create investment projections.",
  keywords: [
    "investment calculator",
    "investment growth",
    "investment returns",
    "compound growth",
    "stock calculator",
    "portfolio calculator",
    "investment projection",
    "future value calculator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
