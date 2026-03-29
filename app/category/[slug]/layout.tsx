import { Metadata } from "next";
import { categories } from "@/config/site";
import { tools } from "@/lib/tools";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const categoryTools = tools.filter((t) => t.category === category.id);
  const toolNames = categoryTools.slice(0, 5).map(t => t.name).join(", ");

  return {
    title: `Free ${category.name} Online | Softzar`,
    description: `${category.description}. Use our ${categoryTools.length}+ free ${category.name.toLowerCase()} including ${toolNames} and more. 100% free, no registration required.`,
    keywords: [
      category.name.toLowerCase(),
      `free ${category.name.toLowerCase()}`,
      `online ${category.name.toLowerCase()}`,
      ...categoryTools.slice(0, 10).map(t => t.name.toLowerCase())
    ],
    openGraph: {
      title: `Free ${category.name} Online | Softzar`,
      description: `${category.description}. Browse ${categoryTools.length}+ free tools.`,
      type: "website",
      url: `https://softzar.com/${slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Free ${category.name} Online | Softzar`,
      description: `${category.description}. Browse ${categoryTools.length}+ free tools.`,
    },
    alternates: {
      canonical: `https://softzar.com/${slug}/`,
    },
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}