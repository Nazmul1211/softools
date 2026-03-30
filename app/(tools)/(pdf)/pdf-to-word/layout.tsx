import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Word Converter - Convert PDF to DOCX Free",
  description:
    "Convert PDF files to editable Word documents (DOCX) for free. Extract text from PDFs while preserving formatting. No signup required.",
  keywords: [
    "pdf to word",
    "pdf to docx",
    "convert pdf to word",
    "pdf converter",
    "pdf to doc",
    "edit pdf",
    "extract text from pdf",
    "pdf to editable word",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
