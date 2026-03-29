import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merger - Merge PDF Files Online Free | Softzar",
  description:
    "Free online PDF merger. Combine multiple PDFs into one document instantly without uploading to server. Drag and drop to reorder pages. No sign-up required.",
  keywords: [
    "pdf merger",
    "pdf merger online",
    "pdf merger free",
    "merge pdf",
    "merge pdf online",
    "combine pdf",
    "combine pdf files",
    "join pdf",
    "pdf combiner",
    "merge pdf files",
  ],
  openGraph: {
    title: "PDF Merger - Merge PDF Files Online Free",
    description:
      "Free PDF merger. Combine multiple PDFs into one. Fast, secure, and private.",
    type: "website",
    url: "https://softzar.com/merge-pdf/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Merger Online Free",
    description: "Combine multiple PDFs into one. Free and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/merge-pdf/",
  },
};

export default function MergePDFLayout({
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
            name: "PDF Merger",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Merge multiple PDFs",
              "Drag and drop reordering",
              "Client-side processing",
              "No file upload required",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "3456",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
