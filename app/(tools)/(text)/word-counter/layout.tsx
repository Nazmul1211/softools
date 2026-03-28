import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter - Count Words, Characters & Reading Time",
  description:
    "Free word counter tool to count words, characters, sentences, and paragraphs. Estimate reading and speaking time. Perfect for essays, articles, and social media posts.",
  keywords: [
    "word counter",
    "character counter",
    "word count",
    "character count",
    "reading time",
    "text analysis",
    "essay word count",
    "twitter character counter",
  ],
  openGraph: {
    title: "Word Counter - Free Online Text Analysis Tool",
    description: "Count words, characters, sentences and paragraphs instantly. Check reading time and analyze your text for better writing.",
    type: "website",
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
