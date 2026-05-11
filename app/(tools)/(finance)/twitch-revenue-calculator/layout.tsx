import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitch Revenue Calculator - Estimate Monthly Earnings | SoftZaR",
  description:
    "Estimate Twitch income from subscriptions, bits, ad revenue, and donations. Forecast monthly and yearly creator earnings.",
  keywords: [
    "twitch revenue calculator",
    "twitch income calculator",
    "twitch earnings estimator",
    "twitch subscription revenue",
    "twitch bits calculator",
  ],
  openGraph: {
    title: "Twitch Revenue Calculator",
    description:
      "Estimate Twitch monthly and annual earnings from subs, bits, ads, and donations.",
    type: "website",
    url: "https://softzar.com/twitch-revenue-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/twitch-revenue-calculator/",
  },
};

export default function TwitchRevenueCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
