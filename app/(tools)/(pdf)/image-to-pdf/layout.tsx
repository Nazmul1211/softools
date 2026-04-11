import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF — Convert Images to PDF Online Free | SoftZaR",
  description:
    "Convert JPG, PNG, and WebP images to PDF online for free. Combine multiple images into one PDF. Choose page size, orientation, and margins. 100% browser-based.",
  keywords: [
    "image to pdf",
    "jpg to pdf",
    "png to pdf",
    "convert image to pdf",
    "image to pdf converter",
    "photo to pdf",
    "pictures to pdf",
    "image to pdf online free",
    "multiple images to pdf",
    "combine images to pdf",
  ],
  openGraph: {
    title: "Image to PDF — Convert Images to PDF Online Free | SoftZaR",
    description:
      "Convert JPG, PNG, WebP images to PDF. Combine multiple images into one PDF. Free and private.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF Converter Free | SoftZaR",
    description: "Convert images to PDF instantly. Free and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/image-to-pdf/",
  },
};

export default function ImageToPDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
