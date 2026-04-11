import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Free Online Tool | SoftZaR",
  description:
    "Add page numbers to PDF files online for free. Choose position, format, and starting page. Supports Arabic numbers, Roman numerals, and 'Page X of Y'. 100% browser-based.",
  keywords: [
    "add page numbers to pdf",
    "pdf page numbers",
    "number pdf pages",
    "pdf page numbering",
    "insert page numbers pdf",
    "add page numbers to pdf free",
    "pdf page numbers online",
    "number pages pdf online",
    "page numbering pdf free",
    "bates numbering pdf",
  ],
  openGraph: {
    title: "Add Page Numbers to PDF — Free Online Tool | SoftZaR",
    description:
      "Add page numbers to PDF pages online. Choose position and format. Free and private.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Page Numbers to PDF Free | SoftZaR",
    description: "Number PDF pages instantly. Free and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/add-page-numbers-to-pdf/",
  },
};

export default function AddPageNumbersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
