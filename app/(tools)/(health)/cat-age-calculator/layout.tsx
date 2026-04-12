import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cat Age Calculator — Cat Years to Human Years | SoftZaR",
  description:
    "Convert cat years to human years using a stage-aware feline formula. See life stages, projected aging, and practical care guidance for every age.",
  keywords: [
    "cat age calculator",
    "cat years to human years",
    "how old is my cat in human years",
    "cat age chart",
    "feline life stage calculator",
    "senior cat age",
    "indoor cat lifespan",
    "cat age conversion",
  ],
  openGraph: {
    title: "Cat Age Calculator — Convert Cat Years to Human Years",
    description:
      "Calculate your cat's human-equivalent age, life stage, and aging projection with clear feline care guidance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cat Age Calculator | SoftZaR",
    description:
      "Find your cat's human-equivalent age and life stage with practical, vet-friendly guidance.",
  },
  alternates: {
    canonical: "https://softzar.com/cat-age-calculator/",
  },
};

export default function CatAgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
