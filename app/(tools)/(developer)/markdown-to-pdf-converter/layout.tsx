import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter — Convert Markdown to PDF | SoftZaR",
  description:
    "Convert markdown text to PDF instantly. Customize fonts, colors, and formatting. Preview PDF before download. Free, no installation required.",
  keywords: [
    "markdown to PDF converter",
    "convert markdown to PDF",
    "markdown PDF generator",
    "online markdown converter",
    "free PDF converter",
    "markdown formatter",
    "PDF export tool",
  ],
  openGraph: {
    title: "Markdown to PDF Converter — Create PDFs from Markdown",
    description:
      "Instantly convert markdown to beautifully formatted PDFs. Customize fonts, colors, and styling.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to PDF Converter | SoftZaR",
    description:
      "Convert your markdown notes to professional PDFs with custom formatting options.",
  },
  alternates: {
    canonical: "https://softzar.com/markdown-to-pdf-converter/",
  },
};

export default function MarkdownToPDFConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
