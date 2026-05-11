import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word to PDF Converter - DOCX to PDF Online | SoftZaR",
  description:
    "Convert Word documents (DOCX) and text files to PDF in your browser. Fast, free, and privacy-friendly conversion.",
  keywords: [
    "word to pdf",
    "docx to pdf converter",
    "convert word to pdf",
    "text to pdf",
    "online word to pdf",
  ],
  openGraph: {
    title: "Word to PDF Converter",
    description: "Convert DOCX and TXT files to PDF instantly in your browser.",
    type: "website",
    url: "https://softzar.com/word-to-pdf/",
  },
  alternates: {
    canonical: "https://softzar.com/word-to-pdf/",
  },
};

export default function WordToPDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
