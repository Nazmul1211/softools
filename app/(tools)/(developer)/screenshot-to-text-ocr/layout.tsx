import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screenshot to Text (OCR) - Extract Text From Images | SoftZaR",
  description:
    "Upload a screenshot and extract text with browser-based OCR. Copy recognized text instantly.",
  keywords: [
    "screenshot to text ocr",
    "image to text",
    "ocr online",
    "extract text from screenshot",
    "photo to text converter",
  ],
  openGraph: {
    title: "Screenshot to Text (OCR)",
    description:
      "Convert screenshots and images into editable text with client-side OCR processing.",
    type: "website",
    url: "https://softzar.com/screenshot-to-text-ocr/",
  },
  alternates: {
    canonical: "https://softzar.com/screenshot-to-text-ocr/",
  },
};

export default function ScreenshotToTextOCRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
