import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function constructMetadata({
  title,
  description,
  slug,
  keywords,
  ogImage,
}: {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
  ogImage?: string;
}): Metadata {
  const url = `${siteConfig.url}${slug}/`;
  const image = ogImage || siteConfig.ogImage;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@softzar",
    },
  };
}
