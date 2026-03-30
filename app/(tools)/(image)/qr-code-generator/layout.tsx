import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Create QR Codes Online Free",
  description:
    "Generate custom QR codes for URLs, text, email, and contact details. Adjust size, colors, error correction, and download PNG or SVG instantly.",
  keywords: [
    "qr code generator",
    "create qr code",
    "free qr code",
    "qr code png",
    "qr code svg",
    "url qr code",
    "custom qr code",
    "online qr maker",
  ],
  openGraph: {
    title: "QR Code Generator - Create QR Codes Online Free",
    description:
      "Create and download high-quality QR codes in PNG and SVG formats with custom options.",
    type: "website",
    url: "https://softzar.com/qr-code-generator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator Online Free",
    description: "Generate editable QR codes with theme-friendly design and instant downloads.",
  },
  alternates: {
    canonical: "https://softzar.com/qr-code-generator/",
  },
};

export default function QRCodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
