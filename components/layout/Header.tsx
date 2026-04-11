"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Gamepad2,
  HardHat,
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
  gaming: Gamepad2,
  construction: HardHat,
};

const navigationItemClassName =
  "rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const activeNavigationItemClassName =
  "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary";

const dropdownItemClassName =
  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const activeDropdownItemClassName =
  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary";

const iconButtonClassName =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
  const [isVisible, setIsVisible] = useState(true);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollStopTimeoutRef = useRef<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Hide header while scrolling (up or down), show only after scrolling stops.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setCategoryDropdownOpen(false);
        setSearchOpen(false);
      }

      if (scrollStopTimeoutRef.current) {
        window.clearTimeout(scrollStopTimeoutRef.current);
      }

      scrollStopTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollStopTimeoutRef.current) {
        window.clearTimeout(scrollStopTimeoutRef.current);
      }
    };
  }, []);

  // Keep sidebar ads clear of header when header is visible.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sticky-sidebar-top", isVisible ? "80px" : "16px");
  }, [isVisible]);

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
    setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark");
  };

  const isDarkTheme = (resolvedTheme ?? theme) === "dark";

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
        id: "page-blog",
        title: "Blog",
        description: "Read guides, tutorials, and product insights.",
        href: "/blog/",
        type: "page",
        keywords: ["blog", "articles", "guides", "tutorials"],
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

  const isActivePath = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg dark:border-border dark:bg-background/80 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
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
                className={`${navigationItemClassName} ${
                  categoryDropdownOpen ? activeNavigationItemClassName : ""
                } flex items-center gap-1`}
              >
                Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 top-full z-[60] mt-2 w-64 rounded-xl border border-border bg-background p-2 shadow-xl">
                {categories.map((category) => {
                  const CategoryIcon = categoryIconMap[category.id] ?? Menu;
                  const categoryHref = `/${category.slug}/`;

                  return (
                    <Link
                      key={category.id}
                      href={categoryHref}
                      className={`${dropdownItemClassName} ${
                        isActivePath(categoryHref) ? activeDropdownItemClassName : ""
                      }`}
                      onClick={() => setCategoryDropdownOpen(false)}
                    >
                      <CategoryIcon className="h-4 w-4 text-primary" strokeWidth={1.7} />
                      <span>{category.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/tools/"
            className={`${navigationItemClassName} ${
              isActivePath("/tools") ? activeNavigationItemClassName : ""
            }`}
          >
            All Tools
          </Link>

          <Link
            href="/review/"
            className={`${navigationItemClassName} ${
              isActivePath("/review") ? activeNavigationItemClassName : ""
            }`}
          >
            Reviews
          </Link>

          <Link
            href="/blog/"
            className={`${navigationItemClassName} ${
              isActivePath("/blog") ? activeNavigationItemClassName : ""
            }`}
          >
            Blog
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
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-foreground">
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
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-foreground">
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
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            {isDarkTheme ? (
              <Moon className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Sun className="h-5 w-5" strokeWidth={1.5} />
            )}
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
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="space-y-1">
            <Link
              href="/tools/"
              className={`block ${navigationItemClassName} ${
                isActivePath("/tools") ? activeNavigationItemClassName : ""
              }`}
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
                    className={`${dropdownItemClassName} ${
                      isActivePath(`/${category.slug}/`) ? activeDropdownItemClassName : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CategoryIcon className="h-4 w-4 text-primary" strokeWidth={1.7} />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/review/"
              className={`block ${navigationItemClassName} ${
                isActivePath("/review") ? activeNavigationItemClassName : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link
              href="/blog/"
              className={`block ${navigationItemClassName} ${
                isActivePath("/blog") ? activeNavigationItemClassName : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
