import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Counter - Count Characters, Letters & Limits",
  description:
    "Count characters, letters, numbers, words, and line length instantly. Check writing against SEO titles, meta descriptions, social, and SMS limits.",
  keywords: [
    "character counter",
    "character count",
    "letter counter",
    "text counter",
    "meta description length",
    "title tag length",
    "twitter character limit",
    "sms character counter",
  ],
  openGraph: {
    title: "Character Counter - Free Online Text Length Tool",
    description:
      "Analyze text length in real-time and optimize for SEO and social platform limits.",
    type: "website",
    url: "https://softzar.com/character-counter/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Character Counter Online Free",
    description: "Track character limits, word counts, and writing metrics in one tool.",
  },
  alternates: {
    canonical: "https://softzar.com/character-counter/",
  },
};

export default function CharacterCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
