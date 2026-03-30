import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slug Generator - Create SEO-Friendly URL Slugs",
  description:
    "Generate clean SEO-friendly slugs from titles and text. Convert to lowercase, choose separators, remove stop words, and create bulk slugs instantly.",
  keywords: [
    "slug generator",
    "url slug",
    "seo slug",
    "slugify",
    "seo url generator",
    "blog slug generator",
    "clean url",
    "bulk slug generator",
  ],
  openGraph: {
    title: "Slug Generator - Create SEO-Friendly URL Slugs",
    description:
      "Convert titles into readable, search-friendly URL slugs for blogs, product pages, and docs.",
    type: "website",
    url: "https://softzar.com/slug-generator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slug Generator Online Free",
    description: "Create SEO-ready slugs with smart normalization and bulk conversion.",
  },
  alternates: {
    canonical: "https://softzar.com/slug-generator/",
  },
};

export default function SlugGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
