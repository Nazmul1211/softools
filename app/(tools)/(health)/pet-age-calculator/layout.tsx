import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Age Calculator — Convert Dog & Cat Years | SoftZaR",
  description:
    "Convert pet age to human years with cat and dog formulas, size-aware dog aging, life-stage insights, and practical care guidance. Free interactive pet age calculator.",
  keywords: [
    "pet age calculator",
    "dog and cat age calculator",
    "pet years to human years",
    "dog years to human years",
    "cat years to human years",
    "pet life stage calculator",
    "how old is my pet in human years",
    "dog age chart by size",
  ],
  openGraph: {
    title: "Pet Age Calculator — Dog & Cat Years to Human Years",
    description:
      "Calculate your pet's human-equivalent age with species-specific formulas, size-aware dog conversion, and life-stage guidance.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Age Calculator | SoftZaR",
    description:
      "Convert dog and cat years to human years instantly with life-stage context and care tips.",
  },
  alternates: {
    canonical: "https://softzar.com/pet-age-calculator/",
  },
};

export default function PetAgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
