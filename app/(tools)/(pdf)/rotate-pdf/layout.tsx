import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF — Rotate Pages Online Free | SoftZaR",
  description:
    "Rotate PDF pages 90°, 180°, or 270° online for free. Rotate all pages or select specific pages. 100% browser-based, no upload required. Instant results.",
  keywords: [
    "rotate pdf",
    "rotate pdf online",
    "rotate pdf pages",
    "rotate pdf free",
    "pdf page rotation",
    "turn pdf sideways",
    "flip pdf",
    "rotate pdf 90 degrees",
    "pdf rotator",
    "fix pdf orientation",
  ],
  openGraph: {
    title: "Rotate PDF — Rotate Pages Online Free | SoftZaR",
    description:
      "Rotate PDF pages 90°, 180°, or 270° online. Free, private, instant.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Online Free | SoftZaR",
    description: "Rotate PDF pages instantly. Free and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/rotate-pdf/",
  },
};

export default function RotatePDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
