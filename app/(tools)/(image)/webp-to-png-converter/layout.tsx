import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WEBP to PNG Converter - Convert WEBP to PNG Online | Softzar",
  description:
    "Free WEBP to PNG converter. Convert WEBP images to PNG format online without uploading files. Fast browser-side conversion with full privacy.",
  keywords: [
    "webp to png",
    "convert webp to png",
    "webp converter",
    "png converter",
    "image converter",
  ],
  openGraph: {
    title: "WEBP to PNG Converter - Free Online Tool",
    description: "Convert WEBP images to PNG format instantly in your browser.",
    type: "website",
    url: "https://softzar.com/webp-to-png-converter/",
  },
  twitter: {
    card: "summary_large_image",
    title: "WEBP to PNG Converter",
    description: "Convert WEBP image files to PNG online for free.",
  },
  alternates: {
    canonical: "https://softzar.com/webp-to-png-converter/",
  },
};

export default function WebpToPngLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
