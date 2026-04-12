import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Age Calculator — Dog Years to Human Years | SoftZaR",
  description:
    "Convert dog years to human years with size-aware formulas, life-stage interpretation, and optional DNA log model comparison. Free interactive dog age calculator.",
  keywords: [
    "dog age calculator",
    "dog years to human years",
    "how old is my dog in human years",
    "dog age chart by size",
    "large breed dog age",
    "small dog age conversion",
    "dog senior age calculator",
    "dog life stage calculator",
  ],
  openGraph: {
    title: "Dog Age Calculator — Convert Dog Years to Human Years",
    description:
      "Calculate your dog's human-equivalent age using size-aware logic and compare clinical vs DNA-log models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dog Age Calculator | SoftZaR",
    description:
      "Find your dog's human-equivalent age with size-aware conversion and life-stage planning guidance.",
  },
  alternates: {
    canonical: "https://softzar.com/dog-age-calculator/",
  },
};

export default function DogAgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
