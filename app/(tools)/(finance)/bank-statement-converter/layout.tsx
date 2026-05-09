import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Statement Converter - PDF to Excel & CSV Free Online",
  description:
    "Convert PDF bank statements to Excel (XLSX) and CSV format instantly. Free online tool with smart transaction extraction. No signup required, 100% secure.",
  alternates: {
    canonical: "https://softzar.com/bank-statement-converter/",
  },
  keywords: [
    "bank statement converter",
    "pdf to excel",
    "pdf to csv",
    "bank statement to excel",
    "bank statement to csv",
    "convert bank statement",
    "extract transactions from pdf",
    "bank pdf converter",
    "statement converter online",
    "free bank statement converter",
  ],
  openGraph: {
    title: "Bank Statement Converter - PDF to Excel & CSV Free Online",
    description:
      "Convert PDF bank statements to Excel and CSV format instantly. Free, secure, no signup required.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
