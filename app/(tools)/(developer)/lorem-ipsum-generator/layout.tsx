import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text",
  description:
    "Free Lorem Ipsum generator to create placeholder text for web design, mockups, and documents. Generate paragraphs, sentences, or words instantly.",
  keywords: [
    "lorem ipsum",
    "placeholder text",
    "dummy text",
    "filler text",
    "lorem ipsum generator",
    "design placeholder",
  ],
  openGraph: {
    title: "Lorem Ipsum Generator - Generate Placeholder Text",
    description: "Generate Lorem Ipsum placeholder text for your design projects.",
    type: "website",
  },
  alternates: {
    canonical: "https://softzar.com/lorem-ipsum-generator/",
  },
};

export default function LoremIpsumGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
