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

        {/* Sidebar - Same ad/sidebar method as tool pages */}
        <aside id="secondary" className="mb-12 hidden overflow-visible lg:block">
          <div className="sticky top-24 space-y-6">
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
