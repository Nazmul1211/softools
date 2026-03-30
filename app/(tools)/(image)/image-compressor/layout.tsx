import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor - Compress Images Online Free",
  description:
    "Free online image compressor. Reduce JPG, PNG, WebP file size up to 90% while maintaining quality. No upload to server - 100% private.",
  keywords: [
    "image compressor",
    "image compressor online",
    "image compressor free",
    "compress image",
    "compress image online",
    "reduce image size",
    "compress jpg",
    "compress png",
    "photo compressor",
    "image size reducer",
  ],
  openGraph: {
    title: "Image Compressor - Compress Images Online Free",
    description:
      "Free image compressor. Reduce file size up to 90%. Fast, secure, and private.",
    type: "website",
    url: "https://softzar.com/image-compressor/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor Online Free",
    description: "Compress images up to 90%. Free, fast, and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/image-compressor/",
  },
};

export default function CompressImageLayout({
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
            name: "Image Compressor",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Compress JPG, PNG, WebP images",
              "Reduce image size up to 90%",
              "Client-side processing",
              "No file upload required",
              "Batch compression support",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "3156",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
