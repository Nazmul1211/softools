"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { tools } from "@/lib/tools";
import Link from "next/link";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tools`);
    }
  };

  const filteredTools = query
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mx-auto mt-10 max-w-xl" ref={containerRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a tool..."
          className="w-full rounded-xl border border-search-border bg-search-bg px-5 py-4 pl-12 text-search-text placeholder:text-search-placeholder shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Search
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-search-placeholder"
          strokeWidth={1.5}
        />
      </form>

      {/* Dropdown Results */}
      {isFocused && query && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card-bg shadow-lg">
          {filteredTools.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto p-2">
              {filteredTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    onClick={() => setIsFocused(false)}
                    className="flex flex-col rounded-lg px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <span className="font-semibold text-foreground">
                      {tool.name}
                    </span>
                    <span className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {tool.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No tools found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
