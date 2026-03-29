import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { tools } from "@/lib/tools";
import { categories } from "@/config/site";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description:
    "Browse our complete collection of free online tools and calculators. Math, finance, health, conversion, and more.",
};

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ToolsPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const normalizedQuery = q.trim().toLowerCase();

  const groupedTools = categories.map((category) => ({
    ...category,
    tools: tools.filter((tool) => {
      if (tool.category !== category.id) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery)
      );
    }),
  }));

  const hasResults = groupedTools.some((group) => group.tools.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground dark:text-foreground">
          All Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground dark:text-muted-foreground">
          {normalizedQuery
            ? `Showing results for "${q.trim()}"`
            : "Browse our complete collection of free online tools and calculators"}
        </p>
      </div>

      {!hasResults && (
        <div className="mb-10 rounded-xl border border-border bg-card-bg p-6 text-center">
          <p className="text-base font-medium text-foreground">
            No tools matched &quot;{q.trim()}&quot;
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword, or browse all categories below.
          </p>
        </div>
      )}

      <div className="space-y-12">
        {groupedTools
          .filter((group) => group.tools.length > 0)
          .map((group) => (
            <section key={group.id}>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground">
                  {group.name}
                </h2>
                <Link
                  href={`/${group.slug}/`}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}/`}
                    className="group rounded-xl border border-border bg-white p-4 transition-all hover:border-primary/50 hover:shadow-md dark:border-border dark:bg-muted/50 dark:hover:border-primary/50"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary dark:text-foreground dark:group-hover:text-primary">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2">
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
