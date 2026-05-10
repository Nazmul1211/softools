import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Commission Calculator - Estimate Earnings",
  description:
    "Calculate affiliate commission earnings from sales and conversion rates. Estimate monthly affiliate marketing revenue and ROI.",
  keywords: [
    "affiliate commission calculator",
    "affiliate earnings calculator",
    "commission percentage calculator",
    "affiliate marketing revenue",
    "epc calculator",
    "conversion rate calculator",
    "affiliate income calculator",
  ],
  openGraph: {
    title: "Affiliate Commission Calculator - Estimate Earnings",
    description:
      "Calculate affiliate commission earnings from traffic, conversion rate, and product price.",
    type: "website",
    url: "https://softzar.com/affiliate-commission-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Affiliate Commission Calculator | SoftZaR",
    description: "Estimate your affiliate marketing earnings.",
  },
  alternates: {
    canonical: "https://softzar.com/affiliate-commission-calculator/",
  },
};

export default function AffiliateCommissionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
