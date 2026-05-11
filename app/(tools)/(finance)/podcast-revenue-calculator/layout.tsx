import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Podcast Revenue Calculator - Sponsorship Earnings Estimate | SoftZaR",
  description:
    "Estimate podcast earnings from CPM sponsorships, ad slots, affiliate income, and listener support.",
  keywords: [
    "podcast revenue calculator",
    "podcast sponsorship calculator",
    "podcast cpm calculator",
    "podcast monetization estimator",
    "podcast earnings tool",
  ],
  openGraph: {
    title: "Podcast Revenue Calculator",
    description:
      "Estimate monthly and yearly podcast revenue using downloads, CPM, ad slots, and extra income channels.",
    type: "website",
    url: "https://softzar.com/podcast-revenue-calculator/",
  },
  alternates: {
    canonical: "https://softzar.com/podcast-revenue-calculator/",
  },
};

export default function PodcastRevenueCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
