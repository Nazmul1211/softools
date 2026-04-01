import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "401k Calculator - Retirement Savings & Growth Projections",
  description:
    "Free 401k calculator to project your retirement savings. Calculate employer match, contribution limits, tax savings, and see how your 401k will grow over time.",
  keywords: [
    "401k calculator",
    "retirement calculator",
    "401k contribution calculator",
    "employer match calculator",
    "401k growth calculator",
    "retirement savings calculator",
    "401k projections",
    "401k retirement planning",
  ],
  openGraph: {
    title: "401k Calculator - Retirement Savings & Growth Projections",
    description:
      "Calculate your 401k growth with employer match and tax benefits. Free 401k retirement calculator.",
    type: "website",
  },
};

export default function Calculator401kLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
