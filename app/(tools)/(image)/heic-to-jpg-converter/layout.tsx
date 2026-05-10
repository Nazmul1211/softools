import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter - Private Batch iPhone Photo Conversion",
  description:
    "Convert HEIC/HEIF images to JPG with batch processing, quality control, and browser-only privacy. Ideal for forms, uploads, and compatibility workflows.",
  keywords: [
    "heic to jpg converter",
    "heif to jpg",
    "iphone photo converter",
    "convert heic files online",
    "batch heic converter",
    "heic compatibility converter",
    "passport photo heic to jpg",
    "private image converter",
  ],
  openGraph: {
    title: "HEIC to JPG Converter - Batch and Private",
    description:
      "Convert HEIC/HEIF photos to JPG in your browser with no upload, no sign-up, and quality controls.",
    type: "website",
    url: "https://softzar.com/heic-to-jpg-converter/",
  },
  alternates: {
    canonical: "https://softzar.com/heic-to-jpg-converter/",
  },
};

export default function HEICToJPGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
