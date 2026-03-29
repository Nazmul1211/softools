import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to JPG Converter - Convert PDF to Image Free | Softzar",
  description:
    "Free online PDF to JPG converter. Transform PDF pages into high-quality JPEG images instantly. No upload required - 100% private browser processing.",
  keywords: [
    "pdf to jpg converter",
    "pdf to jpg",
    "pdf to jpg online",
    "pdf to jpg free",
    "convert pdf to jpg",
    "pdf to jpeg",
    "pdf to image",
    "pdf to image converter",
    "extract images from pdf",
    "pdf to picture",
  ],
  openGraph: {
    title: "PDF to JPG Converter - Convert PDF to Image Free",
    description:
      "Free PDF to JPG converter. Transform PDF pages to images. Fast and secure.",
    type: "website",
    url: "https://softzar.com/pdf-to-jpg/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to JPG Converter Free",
    description: "Convert PDF pages to JPG images. Free and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/pdf-to-jpg/",
  },
};

export default function PDFToJPGLayout({
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
            name: "PDF to JPG Converter",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Convert PDF to JPG",
              "High-quality output",
              "Adjustable resolution",
              "Client-side processing",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.7",
              ratingCount: "1987",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
