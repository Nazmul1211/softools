import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Time Calculator — Estimate Read & Speaking Time | SoftZaR",
  description:
    "Calculate estimated reading time and speaking time for any text. Paste your content to get word count, reading minutes, speaking duration, and readability stats. Free tool for writers and content creators.",
  keywords: [
    "reading time calculator",
    "reading time estimator",
    "how long to read",
    "speaking time calculator",
    "words to minutes",
    "article reading time",
    "content reading time",
    "blog post reading time",
  ],
  openGraph: {
    title: "Reading Time Calculator — How Long Will It Take to Read?",
    description:
      "Estimate reading and speaking time for any text. Perfect for bloggers, content creators, and presenters. Free online calculator.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reading Time Calculator | SoftZaR",
    description:
      "Paste your text and instantly see reading time, speaking time, word count, and readability stats.",
  },
};

export default function ReadingTimeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
