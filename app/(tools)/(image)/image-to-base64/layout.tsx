import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Base64 Converter - Encode Images to Base64 Online",
  description:
    "Free Image to Base64 converter. Encode JPG, PNG, WEBP, GIF, BMP, and SVG files as Base64 Data URIs directly in your browser.",
  keywords: [
    "image to base64",
    "base64 image encoder",
    "convert image to base64",
    "data uri generator",
    "base64 converter",
  ],
  openGraph: {
    title: "Image to Base64 Converter - Free Online Tool",
    description:
      "Encode image files as Base64 Data URIs instantly for web and development use.",
    type: "website",
    url: "https://softzar.com/image-to-base64/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Base64 Converter",
    description: "Encode image files as Base64 strings quickly and privately.",
  },
  alternates: {
    canonical: "https://softzar.com/image-to-base64/",
  },
};

export default function ImageToBase64Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
