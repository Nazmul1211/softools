import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator — Find Your Minimum Hourly Rate | SoftZaR",
  description:
    "Calculate your ideal freelance hourly rate based on desired income, expenses, and billable hours. Get daily, weekly, and monthly rates with tax-adjusted estimates. Free calculator for freelancers and contractors.",
  keywords: [
    "freelance rate calculator",
    "freelance hourly rate calculator",
    "how much to charge as a freelancer",
    "freelance pricing calculator",
    "contractor rate calculator",
    "consulting rate calculator",
    "freelance income calculator",
    "self-employed hourly rate",
  ],
  openGraph: {
    title: "Freelance Rate Calculator — What Should You Charge Per Hour?",
    description:
      "Calculate your minimum freelance hourly rate based on income goals, business expenses, and available billable hours. Free tool for freelancers and contractors.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelance Rate Calculator | SoftZaR",
    description:
      "Calculate your ideal freelance hourly rate. Input income, expenses, and hours — get your minimum rate instantly.",
  },
};

export default function FreelanceRateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
