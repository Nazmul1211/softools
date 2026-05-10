import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Engagement Rate Calculator",
  description:
    "Calculate Instagram engagement rate from likes, comments, and views. Benchmark your engagement and compare against industry standards.",
  keywords: [
    "instagram engagement rate calculator",
    "instagram engagement calculator",
    "engagement rate formula",
    "instagram analytics calculator",
    "social media engagement metrics",
    "influencer engagement calculator",
    "instagram performance metrics",
  ],
  openGraph: {
    title: "Instagram Engagement Rate Calculator",
    description:
      "Measure and benchmark your Instagram engagement rate against industry standards.",
    type: "website",
    url: "https://softzar.com/instagram-engagement-rate-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Engagement Calculator | SoftZaR",
    description: "Calculate your Instagram engagement rate and compare benchmarks.",
  },
  alternates: {
    canonical: "https://softzar.com/instagram-engagement-rate-calculator/",
  },
};

export default function InstagramEngagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
