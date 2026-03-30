import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer - Resize Images Online Free",
  description:
    "Free online image resizer. Change image dimensions, scale by percentage, or use preset sizes for social media. No upload required - 100% private.",
  keywords: [
    "image resizer",
    "image resizer online",
    "image resizer free",
    "resize image",
    "resize image online",
    "photo resizer",
    "picture resizer",
    "resize image for instagram",
    "resize image for facebook",
    "change image size",
  ],
  openGraph: {
    title: "Image Resizer - Resize Images Online Free",
    description:
      "Free online image resizer with social media presets. Fast, secure, and private.",
    type: "website",
    url: "https://softzar.com/image-resizer/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Resizer Online Free",
    description: "Resize images instantly with presets. Free and secure.",
  },
  alternates: {
    canonical: "https://softzar.com/image-resizer/",
  },
};

export default function ResizeImageLayout({
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
            name: "Image Resizer",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Resize images to any dimension",
              "Social media presets",
              "Maintain aspect ratio",
              "Export as JPG, PNG, WEBP",
              "Client-side processing",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "2134",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
