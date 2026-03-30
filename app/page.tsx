import Link from "next/link";
import type { Metadata } from "next";
import {
  Calculator,
  DollarSign,
  Heart,
  ArrowLeftRight,
  FileText,
  Clock,
  Shuffle,
  Code,
  CheckCircle,
  Zap,
  Shield,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { categories, siteConfig } from "@/config/site";
import { tools } from "@/lib/tools";
import { HomeSearch } from "@/components/ui/HomeSearch";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Free Online Tools & Calculators`,
  description:
    "Explore 100+ free online calculators and tools for math, finance, health, conversions, and more. Fast, accurate, and privacy-focused. No signup required.",
  keywords: [
    "free online calculator",
    "free online tools",
    "calculator online",
    "math calculator",
    "percentage calculator",
    "BMI calculator",
    "loan calculator",
    "unit converter",
    "finance calculator",
    "health calculator",
    "scientific calculator",
    "mortgage calculator",
    "GPA calculator",
    "calorie calculator",
    "currency converter",
    "date calculator",
    "age calculator",
    "time calculator",
    "softzar",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} - Free Online Tools & Calculators `,
    description:
      "Explore 100+ free online calculators and tools for math, finance, health, conversions, and more. Fast, accurate, and privacy-focused.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Free Online Tools & Calculators`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Free Online Tools & Calculators `,
    description:
      "Explore 100+ free online calculators and tools for math, finance, health, conversions, and more.",
    images: [siteConfig.ogImage],
    creator: "@softzar",
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-8 w-8" strokeWidth={1.5} />,
  finance: <DollarSign className="h-8 w-8" strokeWidth={1.5} />,
  health: <Heart className="h-8 w-8" strokeWidth={1.5} />,
  conversion: <ArrowLeftRight className="h-8 w-8" strokeWidth={1.5} />,
  text: <FileText className="h-8 w-8" strokeWidth={1.5} />,
  "date-time": <Clock className="h-8 w-8" strokeWidth={1.5} />,
  random: <Shuffle className="h-8 w-8" strokeWidth={1.5} />,
  developer: <Code className="h-8 w-8" strokeWidth={1.5} />,
  pdf: <FileText className="h-8 w-8" strokeWidth={1.5} />,
  image: <ImageIcon className="h-8 w-8" strokeWidth={1.5} />,
};

const categorySmallIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-5 w-5" strokeWidth={1.5} />,
  finance: <DollarSign className="h-5 w-5" strokeWidth={1.5} />,
  health: <Heart className="h-5 w-5" strokeWidth={1.5} />,
  conversion: <ArrowLeftRight className="h-5 w-5" strokeWidth={1.5} />,
  text: <FileText className="h-5 w-5" strokeWidth={1.5} />,
  "date-time": <Clock className="h-5 w-5" strokeWidth={1.5} />,
  random: <Shuffle className="h-5 w-5" strokeWidth={1.5} />,
  developer: <Code className="h-5 w-5" strokeWidth={1.5} />,
  pdf: <FileText className="h-5 w-5" strokeWidth={1.5} />,
  image: <ImageIcon className="h-5 w-5" strokeWidth={1.5} />,
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════
          HERO — Theme-aware (InchCalculator Style)
         ═══════════════════════════════════════════ */}
      <section className="bg-hero-bg px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Find Your Calculator
          </h1>
          <p className="mt-4 text-base text-hero-muted sm:text-lg">
            Explore{" "}
            <span className="font-semibold text-primary">
              {tools.length}+ free calculators
            </span>{" "}
            designed to solve everyday problems accurately and easily.
          </p>

          {/* Search */}
          <HomeSearch />

          {/* Category Icon Grid — 4 columns */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const count = tools.filter(
                (t) => t.category === category.id
              ).length;

              return (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-card-border bg-card-bg px-4 py-6 transition-all hover:border-card-hover-border hover:shadow-md"
                >
                  <div className="text-primary transition-transform duration-200 group-hover:scale-110">
                    {categoryIcons[category.id] || (
                      <Calculator className="h-8 w-8" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                  {count > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {count} calculators
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Discover More Calculators
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED IN — OmniCalculator Style
         ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-y border-border bg-gradient-to-b from-background via-background to-muted/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(225,29,99,0.1),transparent)]" />
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
            Trusted by Students &amp; Professionals Worldwide
          </p>
          <h2 className="mx-auto mb-8 max-w-2xl text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            A clean, dependable toolkit designed for everyday flow.
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { name: "Google Scholar", svg: "M12 14l-2-1-4 2V4a1 1 0 011-1h10a1 1 0 011 1v11l-4-2-2 1z" },
              { name: "Medium", svg: "M4 4h16v16H4z" },
              { name: "Stack Overflow", svg: "M15 21H3v-8h2v6h10v-6h2v8zM12.9 9.8l-1.4-1L6 13.5l1.4 1 5.5-4.7zM9 16h6v2H9z" },
              { name: "Product Hunt", svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
              { name: "Reddit", svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
            ].map((brand) => (
              <div
                key={brand.name}
                className="group flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/90 px-3 py-4 text-muted-foreground shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground hover:shadow-[0_12px_24px_rgba(225,29,99,0.12)] dark:bg-card-bg/80 dark:shadow-none"
              >
                <svg className="h-5 w-5 text-primary/80 transition-colors group-hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d={brand.svg} />
                </svg>
                <span className="text-sm font-semibold tracking-tight">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          POPULAR CALCULATORS — InchCalculator Style
          3-col grid of category cards
         ═══════════════════════════════════════════ */}
      <section className="bg-section-bg px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Popular Calculators
            </h2>
            <p className="mt-3 text-section-foreground">
              Browse our most-used calculators, converters, and utilities.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryTools = tools.filter(
                (t) => t.category === category.id
              );
              if (categoryTools.length === 0) return null;
              const featured = categoryTools.slice(0, 4);

              return (
                <div
                  key={category.id}
                  className="rounded-xl border border-card-border bg-card-bg p-6"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-center gap-2.5 border-b border-border pb-4">
                    <span className="text-primary">
                      {categorySmallIcons[category.id] || (
                        <Calculator className="h-5 w-5" />
                      )}
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {category.name}
                    </h3>
                  </div>

                  {/* Tool Links */}
                  <ul className="space-y-3 mb-5">
                    {featured.map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          href={`/${tool.slug}`}
                          className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          <span>{tool.name}</span>
                          <ChevronRight className="h-4 w-4 text-primary opacity-60 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* See All */}
                  <Link
                    href={`/${category.slug}`}
                    className="block w-full rounded-lg border border-card-border py-2 text-center text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    See All
                  </Link>
                </div>
              );
            })}
          </div>

          {/* View All */}
          <div className="mt-10 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY CHOOSE SOFTZAR — Trust
         ═══════════════════════════════════════════ */}
      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Softzar?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Professional-grade tools optimized for speed, accuracy, and
              privacy.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <CheckCircle className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                100% Free Forever
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Every tool is entirely free. No paywalls, hidden fees, or
                subscriptions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Zap className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Instant Results
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Client-side computation means zero server lag. Get answers
                instantly as you type.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <Shield className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Total Privacy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your data never leaves your browser. All calculations happen
                locally on your device.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
