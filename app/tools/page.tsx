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

export default function ToolsPage() {
  const groupedTools = categories.map((category) => ({
    ...category,
    tools: tools.filter((tool) => tool.category === category.id),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground dark:text-foreground">
          All Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground dark:text-muted-foreground">
          Browse our complete collection of free online tools and calculators
        </p>
      </div>

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
                  href={`/category/${group.slug}`}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 dark:text-primary"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="group rounded-xl border border-border bg-white p-6 transition-all hover:border-primary/50 hover:shadow-md dark:border-border dark:bg-muted/50 dark:hover:border-primary/50"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary dark:text-foreground dark:group-hover:text-primary">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
                      {tool.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary dark:text-primary">
                      Use tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
