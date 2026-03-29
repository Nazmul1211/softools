"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowRight, ChevronRight, Home, Search, X } from "lucide-react";
import { tools } from "@/lib/tools";
import { categories } from "@/config/site";
import { useState, useMemo } from "react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) {
    notFound();
  }

  const [searchQuery, setSearchQuery] = useState("");
  
  const categoryTools = useMemo(() => {
    return tools.filter((tool) => tool.category === category.id);
  }, [category.id]);
  
  const filteredTools = useMemo(() => {
    if (!searchQuery) return categoryTools;
    const query = searchQuery.toLowerCase();
    return categoryTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords?.some((k) => k.toLowerCase().includes(query))
    );
  }, [categoryTools, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-hero-bg border-b border-border px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="flex items-center hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/tools" className="hover:text-primary transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
            {category.description}. Browse our collection of {categoryTools.length} free {category.name.toLowerCase()}.
          </p>

          {/* Search within category */}
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${category.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-card-bg pl-10 pr-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No tools found matching &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                Showing {filteredTools.length} of {categoryTools.length} tools
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="group rounded-xl border border-card-border bg-card-bg p-6 transition-all hover:border-card-hover-border hover:shadow-md"
                  >
                    <h2 className="font-semibold text-foreground group-hover:text-primary">
                      {tool.name}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {tool.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Use tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Related Categories */}
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Explore Other Categories
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {categories
                .filter((c) => c.id !== category.id)
                .map((cat) => {
                  const count = tools.filter((t) => t.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-card-bg px-4 py-3 transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {count} tools
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}