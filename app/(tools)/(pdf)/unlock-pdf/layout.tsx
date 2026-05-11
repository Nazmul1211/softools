import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock PDF - Remove Password Protection | SoftZaR",
  description:
    "Unlock password-protected PDF files and download an unlocked copy in your browser.",
  keywords: [
    "unlock pdf",
    "remove pdf password",
    "pdf password remover",
    "decrypt pdf",
    "unprotect pdf file",
  ],
  openGraph: {
    title: "Unlock PDF",
    description:
      "Remove PDF password protection and download an unlocked copy.",
    type: "website",
    url: "https://softzar.com/unlock-pdf/",
  },
  alternates: {
    canonical: "https://softzar.com/unlock-pdf/",
  },
};

export default function UnlockPDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
