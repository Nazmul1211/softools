import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { categories, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const absoluteUrl = (path: string) =>
    new URL(path, siteConfig.url).toString();

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
  ].map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.priority,
  }));

  const reviewPages = reviewPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
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
    ...reviewPages,
    ...staticPages,
  ];
}
