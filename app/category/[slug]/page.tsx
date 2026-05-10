import { categories } from "@/config/site";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyCategoryRedirectPage({ params }: Props) {
  const { slug } = await params;
  const isKnownCategory = categories.some((category) => category.slug === slug);
  if (!isKnownCategory) {
    notFound();
  }
  redirect(`/${slug}/`);
}
