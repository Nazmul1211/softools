import { Metadata } from "next";

export function constructMetadata({
  title,
  description,
  slug,
  keywords,
}: {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `/${slug}/`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
