import Link from "next/link";
import { Metadata } from "next";
import { tools } from "@/lib/tools";
import { categories } from "@/config/site";
import { Sidebar } from "@/components/layout/Sidebar";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              All Tools
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
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

          <div className="space-y-10">
            {groupedTools
              .filter((group) => group.tools.length > 0)
              .map((group) => (
                <section key={group.id}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                      {group.name}
                    </h2>
                    <Link
                      href={`/${group.slug}/`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View all →
                    </Link>
                  </div>

                  <ul className="columns-1 gap-x-10 space-y-2 pl-5 sm:columns-2">
                    {group.tools.map((tool) => (
                      <li key={tool.slug} className="mb-1 break-inside-avoid list-disc marker:text-primary">
                        <Link
                          href={`/${tool.slug}/`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        </div>

        <Sidebar className="hidden lg:block" />
      </div>
    </div>
  );
}
