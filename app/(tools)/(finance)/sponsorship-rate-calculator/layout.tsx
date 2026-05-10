import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsorship Rate Calculator - Influencer Pricing",
  description:
    "Calculate influencer sponsorship rates based on followers and engagement. Get fair pricing for brand partnerships and collaborations.",
  keywords: [
    "sponsorship rate calculator",
    "influencer pricing calculator",
    "brand deal rate calculator",
    "influencer rate card",
    "content creator pricing",
    "sponsorship agreement rates",
    "influencer marketing calculator",
  ],
  openGraph: {
    title: "Sponsorship Rate Calculator - Fair Influencer Pricing",
    description:
      "Calculate fair influencer sponsorship rates based on followers, engagement, and niche.",
    type: "website",
    url: "https://softzar.com/sponsorship-rate-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsorship Rate Calculator | SoftZaR",
    description: "Get fair influencer rates for brand sponsorships.",
  },
  alternates: {
    canonical: "https://softzar.com/sponsorship-rate-calculator/",
  },
};

export default function SponsorshipRateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
