import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PNG Converter - Convert Images to PNG Online | Softzar",
  description:
    "Free Image to PNG converter. Convert JPG, WEBP, GIF, and BMP files to high-quality PNG format in your browser. Fast, private, and no upload required.",
  keywords: [
    "image to png",
    "convert image to png",
    "jpg to png",
    "webp to png",
    "png converter",
    "image converter",
  ],
  openGraph: {
    title: "Image to PNG Converter - Free Online Tool",
    description:
      "Convert image files to PNG instantly. Browser-based processing for privacy and speed.",
    type: "website",
    url: "https://softzar.com/image-to-png-converter/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PNG Converter",
    description: "Convert JPG, WEBP, GIF, and BMP files to PNG online for free.",
  },
  alternates: {
    canonical: "https://softzar.com/image-to-png-converter/",
  },
};

export default function ImageToPNGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
