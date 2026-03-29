"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeftRight,
  Clock,
  Code,
  DollarSign,
  FileText,
  Heart,
  Image,
  Menu,
  X,
  Sun,
  Moon,
  Calculator,
  ChevronDown,
  Search,
  Shuffle,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/config/site";
import { tools } from "@/lib/tools";

const categoryIconMap: Record<string, LucideIcon> = {
  math: Calculator,
  finance: DollarSign,
  health: Heart,
  conversion: ArrowLeftRight,
  text: FileText,
  "date-time": Clock,
  random: Shuffle,
  developer: Code,
  pdf: FileText,
  image: Image,
};

const navigationItemClassName =
  "rounded-lg px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-slate-100 hover:text-black dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50";

const dropdownItemClassName =
  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-black transition-colors hover:bg-slate-100 hover:text-black dark:text-white dark:hover:bg-slate-800 dark:hover:text-white";

const iconButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-200/90 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50";

type SearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "tool" | "category" | "page";
  keywords: string[];
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDarkTheme = (resolvedTheme ?? theme) === "dark";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 30);

    return () => window.clearTimeout(timeoutId);
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (event.key === "/" && !isTypingField) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cycleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const ThemeIcon = theme === "dark" ? Moon : Sun;

  const searchItems = useMemo<SearchItem[]>(() => {
    const toolItems: SearchItem[] = tools.map((tool) => ({
      id: `tool-${tool.slug}`,
      title: tool.name,
      description: tool.description,
      href: `/${tool.slug}/`,
      type: "tool",
      keywords: tool.keywords ?? [],
    }));

    const categoryItems: SearchItem[] = categories.map((category) => ({
      id: `category-${category.slug}`,
      title: category.name,
      description: category.description,
      href: `/${category.slug}/`,
      type: "category",
      keywords: [category.slug, category.id, "category", "tools"],
    }));

    const pageItems: SearchItem[] = [
      {
        id: "page-home",
        title: "Home",
        description: "Softzar homepage and featured tools.",
        href: "/",
        type: "page",
        keywords: ["home", "start", "dashboard"],
      },
      {
        id: "page-tools",
        title: "All Tools",
        description: "Browse all calculators and utility tools.",
        href: "/tools/",
        type: "page",
        keywords: ["all tools", "search tools", "directory"],
      },
      {
        id: "page-about",
        title: "About",
        description: "Learn about Softzar and our free tools mission.",
        href: "/about/",
        type: "page",
        keywords: ["about", "company", "team"],
      },
      {
        id: "page-review",
        title: "Review Category",
        description: "Browse all legacy software review preservation posts.",
        href: "/review/",
        type: "page",
        keywords: ["review", "software review", "preservation", "category"],
      },
      {
        id: "page-contact",
        title: "Contact",
        description: "Get in touch with Softzar support and team.",
        href: "/contact/",
        type: "page",
        keywords: ["contact", "support", "help"],
      },
      {
        id: "page-privacy",
        title: "Privacy Policy",
        description: "Read data handling and privacy details.",
        href: "/privacy-policy/",
        type: "page",
        keywords: ["privacy", "policy", "data"],
      },
      {
        id: "page-terms",
        title: "Terms and Conditions",
        description: "Terms of use and platform conditions.",
        href: "/terms-and-conditions/",
        type: "page",
        keywords: ["terms", "conditions", "legal"],
      },
      {
        id: "page-disclaimer",
        title: "Disclaimer",
        description: "Important usage and liability disclaimers.",
        href: "/disclaimer/",
        type: "page",
        keywords: ["disclaimer", "notice", "legal"],
      },
    ];

    return [...toolItems, ...categoryItems, ...pageItems];
  }, []);

  const filteredResults = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    const terms = normalized.split(/\s+/).filter(Boolean);

    return searchItems
      .map((item) => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        const href = item.href.toLowerCase();
        const keywords = item.keywords.map((keyword) => keyword.toLowerCase());

        let score = 0;

        if (title.startsWith(normalized)) score += 180;
        if (title.includes(normalized)) score += 110;
        if (description.includes(normalized)) score += 45;
        if (href.includes(normalized)) score += 35;
        if (keywords.some((keyword) => keyword.includes(normalized))) score += 80;

        for (const term of terms) {
          if (title.startsWith(term)) score += 35;
          if (title.includes(term)) score += 25;
          if (keywords.some((keyword) => keyword.includes(term))) score += 18;
          if (description.includes(term)) score += 8;
        }

        if (item.type === "tool") score += 10;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry) => entry.item);
  }, [searchItems, searchQuery]);

  const quickSuggestions = useMemo(() => {
    const preferredIds = [
      "tool-image-compressor",
      "tool-image-resizer",
      "tool-json-formatter",
      "tool-word-counter",
      "tool-percentage-calculator",
      "page-tools",
    ];

    const itemMap = new Map(searchItems.map((item) => [item.id, item]));

    return preferredIds
      .map((id) => itemMap.get(id))
      .filter((item): item is SearchItem => Boolean(item));
  }, [searchItems]);

  const submitSearch = (query: string) => {
    const normalized = query.trim();
    const destination = normalized
      ? `/tools/?q=${encodeURIComponent(normalized)}`
      : "/tools/";

    router.push(destination);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg dark:border-border dark:bg-background/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-primary"
        >
          <span className="font-[family-name:var(--font-wallpoet)] tracking-wider">
            Soft<span className="text-primary">ZaR</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Categories Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className={`${navigationItemClassName} flex items-center gap-1`}
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 top-full z-[60] mt-2 w-64 rounded-xl border border-border bg-white p-2 shadow-xl dark:bg-background">
                {categories.map((category) => {
                  const CategoryIcon = categoryIconMap[category.id] ?? Menu;

                  return (
                    <Link
                      key={category.id}
                      href={`/${category.slug}/`}
                      className={dropdownItemClassName}
                      onClick={() => setCategoryDropdownOpen(false)}
                    >
                      <CategoryIcon className="h-4 w-4 text-primary" strokeWidth={1.7} />
                      <span style={{ color: isDarkTheme ? "#ffffff" : "#000000" }}>
                        {category.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/tools/"
            className={navigationItemClassName}
          >
            All Tools
          </Link>

          <Link
            href="/review/"
            className={navigationItemClassName}
          >
            Reviews
          </Link>
        </div>

        {/* Right Side - Search & Theme */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className={`${iconButtonClassName} ${
                searchOpen ? "border border-primary/40 bg-primary/10 text-foreground" : ""
              }`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.7} />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full z-[70] mt-3 w-[min(96vw,56rem)] overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-border p-3 sm:p-4">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitSearch(searchQuery);
                    }}
                    className="relative"
                  >
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search tools and pages..."
                      className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </form>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Press <kbd className="rounded border border-border px-1">Enter</kbd> to search all
                    or <kbd className="rounded border border-border px-1">Esc</kbd> to close.
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                  {searchQuery.trim() ? (
                    filteredResults.length > 0 ? (
                      <ul className="space-y-1">
                        {filteredResults.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              onClick={() => setSearchOpen(false)}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-200/90 dark:hover:bg-slate-800"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {item.title}
                                </p>
                                <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  {item.type}
                                </span>
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        No tools found for &quot;{searchQuery}&quot;. Try a broader keyword.
                      </p>
                    )
                  ) : (
                    <div>
                      <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Popular Searches
                      </p>
                      <ul className="space-y-1">
                        {quickSuggestions.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              onClick={() => setSearchOpen(false)}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-200/90 dark:hover:bg-slate-800"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {item.title}
                                </p>
                                <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  {item.type}
                                </span>
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border-t border-border p-2">
                  <button
                    onClick={() => submitSearch(searchQuery)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-200/90 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                  >
                    {searchQuery.trim()
                      ? `Search all results for "${searchQuery.trim()}"`
                      : "Browse all tools"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className={iconButtonClassName}
            aria-label="Toggle theme"
          >
            <ThemeIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${iconButtonClassName} md:hidden`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 dark:border-border dark:bg-background md:hidden">
          <div className="space-y-1">
            <Link
              href="/tools/"
              className={`block ${navigationItemClassName}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              All Tools
            </Link>
            <div className="py-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              {categories.map((category) => {
                const CategoryIcon = categoryIconMap[category.id] ?? Menu;

                return (
                  <Link
                    key={category.id}
                    href={`/${category.slug}/`}
                    className={dropdownItemClassName}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CategoryIcon className="h-4 w-4 text-primary" strokeWidth={1.7} />
                    <span style={{ color: isDarkTheme ? "#ffffff" : "#000000" }}>
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/review/"
              className={`block ${navigationItemClassName}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
