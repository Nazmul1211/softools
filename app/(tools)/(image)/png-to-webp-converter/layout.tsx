import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PNG to WEBP Converter - Convert PNG to WEBP Online",
  description:
    "Free PNG to WEBP converter. Convert PNG images to efficient WEBP format to reduce file size while maintaining quality. Browser-based and private.",
  keywords: [
    "png to webp",
    "convert png to webp",
    "webp converter",
    "image optimization",
    "web image format",
  ],
  openGraph: {
    title: "PNG to WEBP Converter - Free Online Tool",
    description:
      "Convert PNG files to WEBP for faster websites and lighter image assets.",
    type: "website",
    url: "https://softzar.com/png-to-webp-converter/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG to WEBP Converter",
    description: "Convert PNG files to WEBP format online for free.",
  },
  alternates: {
    canonical: "https://softzar.com/png-to-webp-converter/",
  },
};

export default function PngToWebpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
