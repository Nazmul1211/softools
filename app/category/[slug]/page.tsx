import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/config/site";
import { tools } from "@/lib/tools";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryTools = tools.filter((t) => t.category === category.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {categoryTools.length} calculators
        </p>
        <p className="mt-4 text-base text-muted-foreground max-w-3xl leading-relaxed">
          {category.description}. Browse all free{" "}
          {category.name.toLowerCase()} available on Softzar. Every tool runs
          in your browser for instant results and complete privacy.
        </p>
      </div>

      {/* Tool List — 2-Column Bullet List */}
      <div className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-1">
          {categoryTools.map((tool) => (
            <div key={tool.slug} className="flex items-center gap-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <Link
                href={`/${tool.slug}`}
                className="text-primary hover:underline underline-offset-4 text-[15px]"
              >
                {tool.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Article */}
      <article
        id="journey-content-target"
        className="border-t border-border pt-10 text-muted-foreground"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">
          About {category.name}
        </h2>
        <p className="leading-relaxed mb-4">
          Softzar offers a comprehensive collection of free{" "}
          {category.name.toLowerCase()} designed for students, professionals,
          and anyone who needs quick, accurate results. All calculations are
          performed locally in your browser for instant results and complete
          data privacy. No sign-up required — just pick a tool and start
          calculating.
        </p>
        <p className="leading-relaxed">
          Whether you are a student working on homework, a professional
          handling complex computations, or someone managing personal finances
          and health metrics, our {category.name.toLowerCase()} provide the
          accuracy and convenience you need. Each tool includes detailed
          explanations, formulas, and frequently asked questions to help you
          understand not just the answer, but the methodology behind it.
        </p>
      </article>
    </div>
  );
}
