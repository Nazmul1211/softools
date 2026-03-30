import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Compressor - Compress PDF Online Free",
  description:
    "Free online PDF compressor. Reduce PDF file size up to 90% while maintaining quality. No upload to server - 100% private. No sign-up required.",
  keywords: [
    "pdf compressor",
    "pdf compressor online",
    "pdf compressor free",
    "compress pdf",
    "compress pdf online",
    "reduce pdf size",
    "shrink pdf",
    "pdf size reducer",
    "compress pdf file",
    "compress pdf without losing quality",
  ],
  openGraph: {
    title: "PDF Compressor - Compress PDF Online Free",
    description:
      "Free PDF compressor. Reduce file size up to 90%. Fast, secure, and private.",
    type: "website",
    url: "https://softzar.com/compress-pdf/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Compressor Online Free",
    description: "Compress PDF files up to 90%. Free, fast, and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/compress-pdf/",
  },
};

export default function CompressPDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PDF Compressor",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Compress PDF files",
              "Reduce PDF size up to 90%",
              "Client-side processing",
              "No file upload required",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "2847",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
