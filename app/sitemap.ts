import { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { categories, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const absoluteUrl = (path: string) =>
    new URL(path, siteConfig.url).toString();

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
  ].map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.priority,
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
  ];
}
