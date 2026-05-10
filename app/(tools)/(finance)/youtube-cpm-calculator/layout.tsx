import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube CPM Calculator - Estimate Ad Revenue",
  description:
    "Calculate estimated YouTube ad revenue (CPM) from views and RPM. See earnings projections based on video performance and audience location.",
  keywords: [
    "youtube cpm calculator",
    "youtube revenue calculator",
    "youtube ad revenue estimator",
    "cpm rpm calculator",
    "youtube earnings calculator",
    "video creator revenue tool",
    "youtube monetization calculator",
  ],
  openGraph: {
    title: "YouTube CPM Calculator - Estimate Ad Revenue",
    description:
      "Calculate YouTube CPM, RPM, and estimated earnings from video views instantly.",
    type: "website",
    url: "https://softzar.com/youtube-cpm-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube CPM Calculator | SoftZaR",
    description: "Estimate YouTube ad revenue from views and CPM rates.",
  },
  alternates: {
    canonical: "https://softzar.com/youtube-cpm-calculator/",
  },
};

export default function YouTubeCPMCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
