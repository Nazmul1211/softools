import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to JPG Converter - Convert Images to JPG Online",
  description:
    "Free Image to JPG converter. Convert PNG, WEBP, GIF, and BMP images to JPG format instantly with adjustable quality. Private browser-based conversion.",
  keywords: [
    "image to jpg",
    "convert image to jpg",
    "png to jpg",
    "webp to jpg",
    "jpg converter",
    "image converter",
  ],
  openGraph: {
    title: "Image to JPG Converter - Free Online Tool",
    description:
      "Convert PNG and other image formats to JPG quickly in your browser.",
    type: "website",
    url: "https://softzar.com/image-to-jpg-converter/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to JPG Converter",
    description: "Convert PNG, WEBP, GIF, and BMP files to JPG online for free.",
  },
  alternates: {
    canonical: "https://softzar.com/image-to-jpg-converter/",
  },
};

export default function ImageToJPGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
