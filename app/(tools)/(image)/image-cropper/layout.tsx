import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Cropper - Crop Images Online Free",
  description:
    "Crop images online with pixel-perfect controls, aspect ratio presets, and instant browser-based processing. Free, fast, and private image cropping tool.",
  keywords: [
    "image cropper",
    "crop image online",
    "photo cropper",
    "crop jpg",
    "crop png",
    "crop webp",
    "square crop",
    "image crop tool",
    "free image cropper",
  ],
  openGraph: {
    title: "Image Cropper - Crop Images Online Free",
    description:
      "Crop JPG, PNG, and WEBP images with precise controls and common aspect ratios.",
    type: "website",
    url: "https://softzar.com/image-cropper/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Cropper Online Free",
    description: "Crop and export images instantly with privacy-first browser processing.",
  },
  alternates: {
    canonical: "https://softzar.com/image-cropper/",
  },
};

export default function ImageCropperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
