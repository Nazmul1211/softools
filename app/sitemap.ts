import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { categories, siteConfig } from "@/config/site";
import { client } from "@/sanity";

// Fetch all Sanity content for sitemap
async function getSanityContent() {
  const [blogPosts, reviews, softwareReviews, comparisons, pages] = await Promise.all([
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "blogPost" && status == "published"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "review" && status == "published"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "softwareReview" && status == "published"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "comparison" && status == "published"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<{ slug: string; _updatedAt: string }[]>(
      `*[_type == "page" && status == "published"]{ "slug": slug.current, _updatedAt }`
    ),
  ]);

  return { blogPosts, reviews, softwareReviews, comparisons, pages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const absoluteUrl = (path: string) =>
    new URL(path, siteConfig.url).toString();

  // Fetch Sanity content
  const { blogPosts, reviews, softwareReviews, comparisons, pages } = await getSanityContent();

  const reviewPaths = [
    "/adobe-premiere-pro-cc-2024/",
    "/adobe-after-effects-latest/",
    "/adobe-after-effects-2024/",
    "/adobe-photoshop-for-macos/",
    "/adobe-after-effects-cc-2023/",
    "/adobe-illustrator-cc-2022/",
    "/adobe-premiere-pro-2025-free-download/",
    "/adobe-photoshop-2023-free-download/",
    "/adobe-premiere-pro-cc-2023/",
    "/adobe-illustrator-cc-2023/",
    "/adobe-photoshop-2024-free-download/",
    "/adobe-illustrator-2024-free-download/",
    "/adobe-photoshop-2025/",
    "/adobe-acrobat-pro-dc-free-download/",
    "/edius-free-download/",
    "/adobe-photoshop-cc-2021/",
    "/edius-pro-9-free-download-for-lifetime/",
    "/minecraft-apk-1-20-81-01-apk-free-download/",
    "/adobe-illustrator-2025/",
    "/adobe-indesign-free-download/",
  ];

  const toolPages = tools.map((tool) => ({
    url: absoluteUrl(`/${tool.slug}/`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((category) => ({
    url: absoluteUrl(`/${category.slug}/`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticPages = [
    { path: "/about/", priority: 0.5 },
    { path: "/contact/", priority: 0.4 },
    { path: "/privacy-policy/", priority: 0.3 },
    { path: "/terms-and-conditions/", priority: 0.3 },
    { path: "/disclaimer/", priority: 0.3 },
    { path: "/review/", priority: 0.7 },
    { path: "/blog/", priority: 0.8 },
    { path: "/reviews/", priority: 0.8 },
    { path: "/software-reviews/", priority: 0.8 },
    { path: "/compare/", priority: 0.8 },
  ].map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));

  const legacyReviewPages = reviewPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  // Sanity CMS content pages
  const sanityBlogPages = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}/`),
    lastModified: new Date(post._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sanityReviewPages = reviews.map((review) => ({
    url: absoluteUrl(`/reviews/${review.slug}/`),
    lastModified: new Date(review._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sanitySoftwareReviewPages = softwareReviews.map((review) => ({
    url: absoluteUrl(`/software-reviews/${review.slug}/`),
    lastModified: new Date(review._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sanityComparisonPages = comparisons.map((comparison) => ({
    url: absoluteUrl(`/compare/${comparison.slug}/`),
    lastModified: new Date(comparison._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sanitySimplePages = pages.map((page) => ({
    url: absoluteUrl(`/${page.slug}/`),
    lastModified: new Date(page._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/tools/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryPages,
    ...toolPages,
    ...staticPages,
    ...legacyReviewPages,
    // Sanity CMS content
    ...sanityBlogPages,
    ...sanityReviewPages,
    ...sanitySoftwareReviewPages,
    ...sanityComparisonPages,
    ...sanitySimplePages,
  ];
}
