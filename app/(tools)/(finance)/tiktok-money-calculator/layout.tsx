import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok Money Calculator - Estimate Creator Earnings",
  description:
    "Calculate TikTok Creator Fund earnings, brand deal rates, and monthly revenue. Includes creator fund, livestream donations, and affiliate income projections.",
  keywords: [
    "tiktok money calculator",
    "tiktok earnings calculator",
    "creator fund calculator",
    "tiktok revenue estimator",
    "tiktok creator earnings",
    "livestream money calculator",
    "tiktok brand deal rates",
  ],
  openGraph: {
    title: "TikTok Money Calculator - Estimate Creator Earnings",
    description:
      "Estimate TikTok Creator Fund earnings, brand deals, and total monthly revenue.",
    type: "website",
    url: "https://softzar.com/tiktok-money-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Money Calculator | SoftZaR",
    description: "Calculate TikTok creator earnings from Creator Fund and brand deals.",
  },
  alternates: {
    canonical: "https://softzar.com/tiktok-money-calculator/",
  },
};

export default function TikTokMoneyCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
