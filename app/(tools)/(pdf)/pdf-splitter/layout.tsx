import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Splitter - Split PDF Pages Online Free | Softzar",
  description:
    "Free online PDF splitter. Split PDF into individual pages or extract specific pages. No upload required - 100% private processing in your browser.",
  keywords: [
    "pdf splitter",
    "pdf splitter online",
    "pdf splitter free",
    "split pdf",
    "split pdf online",
    "extract pdf pages",
    "separate pdf pages",
    "pdf page extractor",
    "divide pdf",
    "split pdf pages",
  ],
  openGraph: {
    title: "PDF Splitter - Split PDF Pages Online Free",
    description:
      "Free PDF splitter. Extract pages or split into individual files. Fast and secure.",
    type: "website",
    url: "https://softzar.com/split-pdf/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Splitter Online Free",
    description: "Split PDF into pages. Free, fast, and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/split-pdf/",
  },
};

export default function SplitPDFLayout({
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
            name: "PDF Splitter",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Split PDF into pages",
              "Extract specific pages",
              "Client-side processing",
              "No file upload required",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "2789",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
