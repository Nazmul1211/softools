import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Excel Converter - Extract PDF Text to XLSX | SoftZaR",
  description:
    "Convert PDF text content into Excel (XLSX) format. Extract page-wise lines and download as spreadsheet.",
  keywords: [
    "pdf to excel",
    "pdf to xlsx",
    "convert pdf to excel",
    "extract pdf text to excel",
    "online pdf to spreadsheet",
  ],
  openGraph: {
    title: "PDF to Excel Converter",
    description: "Extract PDF text and export to Excel in your browser.",
    type: "website",
    url: "https://softzar.com/pdf-to-excel/",
  },
  alternates: {
    canonical: "https://softzar.com/pdf-to-excel/",
  },
};

export default function PDFToExcelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
