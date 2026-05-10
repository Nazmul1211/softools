import { Metadata } from "next";
import { categories, categorySeoDescriptions } from "@/config/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  const seoDescription =
    categorySeoDescriptions[category.slug] ??
    `Browse all free ${category.name.toLowerCase()} on Softzar. ${category.description}. Fast, accurate, and easy to use.`;

  return {
    title: `${category.name} - Free Online Tools`,
    description: seoDescription,
  };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
