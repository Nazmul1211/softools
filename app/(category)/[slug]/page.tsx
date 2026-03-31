import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/config/site";
import { tools } from "@/lib/tools";
import { client, PAGE_BY_SLUG_QUERY, urlFor } from "@/sanity";
import { PortableText } from "@/components/sanity/PortableText";
import type { Page } from "@/sanity/types";
import { Sidebar } from "@/components/layout/Sidebar";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params for categories and Sanity pages
export async function generateStaticParams() {
  // Category slugs
  const categorySlugs = categories.map((c) => ({ slug: c.slug }));
  
  // Sanity page slugs
  const sanityPages = await client.fetch<{ slug: string }[]>(
    `*[_type == "page" && status == "published"]{ "slug": slug.current }`
  );
  const sanityPageSlugs = sanityPages.map((page) => ({ slug: page.slug }));
  
  return [...categorySlugs, ...sanityPageSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Check if it's a category
  const category = categories.find((c) => c.slug === slug);
  if (category) {
    return {
      title: `${category.name} - Free Online Tools | Softzar`,
      description: `${category.description}. Browse all free ${category.name.toLowerCase()} available on Softzar.`,
    };
  }
  
  // Check if it's a Sanity page (skip tool slugs)
  const isTool = tools.some((t) => t.slug === slug);
  if (!isTool) {
    const page = await client.fetch<Page>(PAGE_BY_SLUG_QUERY, { slug });
    if (page) {
      return {
        title: page.seo?.metaTitle || page.title,
        description: page.seo?.metaDescription || page.excerpt,
        openGraph: {
          title: page.seo?.metaTitle || page.title,
          description: page.seo?.metaDescription || page.excerpt,
          type: "article",
          images: page.seo?.ogImage?.asset
            ? [urlFor(page.seo.ogImage).width(1200).height(630).url()]
            : page.featuredImage?.asset
            ? [urlFor(page.featuredImage).width(1200).height(630).url()]
            : [],
        },
      };
    }
  }
  
  return { title: "Page Not Found" };
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const revalidate = 3600;

export default async function CategoryOrSanityPage({ params }: Props) {
  const { slug } = await params;
  
  // First, check if it's a category
  const category = categories.find((c) => c.slug === slug);
  if (category) {
    // Render category page
    const categoryTools = tools.filter((t) => t.category === category.id);
    
    return (
      <div className="mx-auto mt-4 mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_336px]">
          <main id="journey-content-target" className="min-w-0">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">{category.name}</span>
            </nav>

            {/* Header */}
            <header className="mb-8 rounded-2xl border border-border bg-card-bg p-6 sm:p-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {category.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {categoryTools.length} tools in this category
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {category.description}. Browse all free {category.name.toLowerCase()} available on
                Softzar. Every tool runs in your browser for instant results and complete privacy.
              </p>
            </header>

            {/* Tool List */}
            <section className="mb-10 rounded-2xl border border-border bg-card-bg p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-foreground">All Tools</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {categoryTools.map((tool) => (
                  <li key={tool.slug} className="flex items-center gap-2">
                    <span className="text-primary text-sm">•</span>
                    <Link
                      href={`/${tool.slug}/`}
                      className="text-base text-primary transition-colors hover:text-primary/80 hover:underline"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* SEO Article */}
            <article className="rounded-2xl border border-border bg-card-bg p-6 text-muted-foreground sm:p-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                About {category.name}
              </h2>
              <p className="mb-4 leading-relaxed">
                Softzar offers a comprehensive collection of free {category.name.toLowerCase()} designed
                for students, professionals, and anyone who needs quick, accurate results. All
                calculations are performed locally in your browser for instant results and complete
                data privacy. No sign-up required, just pick a tool and start calculating.
              </p>
              <p className="leading-relaxed">
                Whether you are a student working on homework, a professional handling complex
                computations, or someone managing personal finance and health metrics, our{" "}
                {category.name.toLowerCase()} provide the accuracy and convenience you need. Each
                tool includes clear inputs, practical output formatting, and helpful guidance so you
                can understand both the answer and the method.
              </p>
            </article>
          </main>

          {/* Sidebar */}
          <aside id="secondary" className="mb-12 hidden overflow-visible lg:block">
            <div className="sticky space-y-6" style={{ top: "var(--sticky-sidebar-top)" }}>
              <div id="sidebar_atf" className="widget" />

              <div className="widget rounded-xl border border-border bg-white p-5 dark:bg-muted/50">
                <h3 className="font-semibold text-foreground">Popular In {category.name}</h3>
                <ul className="mt-4 space-y-3">
                  {categoryTools.slice(0, 5).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${tool.slug}/`}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget rounded-xl border border-border bg-white p-5 dark:bg-muted/50">
                <h3 className="font-semibold text-foreground">Explore More Categories</h3>
                <ul className="mt-4 space-y-3">
                  {categories
                    .filter((c) => c.id !== category.id)
                    .slice(0, 6)
                    .map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/${c.slug}/`}
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  <li>
                    <Link href="/tools/" className="text-sm font-medium text-primary hover:underline">
                      View all tools →
                    </Link>
                  </li>
                </ul>
              </div>

              <div id="sidebar_btf" className="widget" />
              <div id="mv-sidebar-stopper" />
            </div>
          </aside>
        </div>
      </div>
    );
  }
  
  // Second, check if it's a tool slug (let other routes handle it)
  const isTool = tools.some((t) => t.slug === slug);
  if (isTool) {
    notFound();
  }
  
  // Third, check if it's a Sanity page
  const page = await client.fetch<Page>(PAGE_BY_SLUG_QUERY, { slug });
  
  if (page) {
    // Render Sanity page
    return (
      <div className="min-h-screen bg-background">
        <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{page.title}</span>
            </nav>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Main Content */}
              <div className="min-w-0">

          {/* Header */}
          <header className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            
            {page.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">{page.excerpt}</p>
            )}

            {/* Meta */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              {page.author && (
                <div className="flex items-center gap-2">
                  {page.author.image && (
                    <Image
                      src={urlFor(page.author.image).width(32).height(32).url()}
                      alt={page.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{page.author.name}</span>
                </div>
              )}
              {page.publishedAt && (
                <>
                  <span>•</span>
                  <time dateTime={page.publishedAt}>{formatDate(page.publishedAt)}</time>
                </>
              )}
            </div>

            {/* Categories/Tags */}
            {(page.categories?.length || page.tags?.length) && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {page.categories?.map((category) => (
                  <span
                    key={category.slug?.current}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                  >
                    {category.title}
                  </span>
                ))}
                {page.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {page.featuredImage?.asset && (
            <div className="max-w-4xl mx-auto mb-12">
              <Image
                src={urlFor(page.featuredImage).width(1200).height(630).url()}
                alt={page.featuredImage.alt || page.title}
                width={1200}
                height={630}
                className="rounded-lg w-full h-auto"
                priority
              />
            </div>
          )}

          {/* Content */}
          {page.content && (
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <PortableText value={page.content} />
            </div>
          )}

          {/* Related Tools */}
          {page.relatedTools && page.relatedTools.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Related Tools</h3>
              <div className="flex flex-wrap gap-2">
                {page.relatedTools.map((toolSlug) => (
                  <Link
                    key={toolSlug}
                    href={`/${toolSlug}/`}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                  >
                    {toolSlug.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          )}
              </div>

              {/* Sidebar */}
              <Sidebar className="hidden lg:block" />
            </div>
          </div>
        </article>
      </div>
    );
  }
  
  // Nothing found
  notFound();
}
