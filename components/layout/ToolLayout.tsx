import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, ChevronDown, HelpCircle } from "lucide-react";

// FAQ Item type for structured data
export interface FAQItem {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  category?: { name: string; slug: string };
  relatedTools?: { name: string; href: string }[];
  content?: ReactNode;
  // New SEO-focused props
  heroImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  faqs?: FAQItem[];
  lastUpdated?: string;
  author?: string;
}

// FAQ Accordion Component with Schema.org structured data
function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 
        id="faq-heading"
        className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
      >
        <HelpCircle className="h-6 w-6 text-primary" />
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-xl border border-border bg-white dark:bg-muted/30 overflow-hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium text-foreground hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
              <span className="text-left">{faq.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-border px-5 py-4 text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
      
      {/* FAQ Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}

export function ToolLayout({
  title,
  description,
  children,
  category,
  relatedTools,
  content,
  heroImage,
  faqs,
  lastUpdated,
  author = "Softzar Team",
}: ToolLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb with Schema.org */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol 
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/" className="hover:text-foreground" itemProp="item">
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <ChevronRight className="h-4 w-4" />
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link href="/tools" className="hover:text-foreground" itemProp="item">
              <span itemProp="name">Tools</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          {category && (
            <>
              <ChevronRight className="h-4 w-4" />
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href={`/category/${category.slug}`} className="hover:text-foreground" itemProp="item">
                  <span itemProp="name">{category.name}</span>
                </Link>
                <meta itemProp="position" content="3" />
              </li>
            </>
          )}
          <ChevronRight className="h-4 w-4" />
          <li 
            className="text-foreground font-medium"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <span itemProp="name">{title}</span>
            <meta itemProp="position" content={category ? "4" : "3"} />
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_336px]">
        <main>
          {/* Hero Section - Compact, engaging */}
          <header className="mb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              {/* Hero Image Placeholder */}
              {heroImage && (
                <div className="relative flex-shrink-0 w-full lg:w-48 h-32 lg:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
                  <Image
                    src={heroImage.src}
                    alt={heroImage.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              
              {/* Title & Description */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] leading-tight">
                  {title}
                </h1>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {description}
                </p>
                
                {/* Meta info */}
                {(lastUpdated || author) && (
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {author && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium">By:</span> {author}
                      </span>
                    )}
                    {lastUpdated && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Updated:</span> 
                        <time dateTime={lastUpdated}>{lastUpdated}</time>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Calculator Card - Above the fold, prominent */}
          <div 
            id="calculator"
            className="rounded-2xl border border-border bg-white p-6 shadow-xl dark:border-border dark:bg-muted/50 sm:p-8 lg:p-10"
          >
            {children}
          </div>

          {/* In-content Ad Placeholder - Mediavine/Journey compatible */}
          <div 
            id="mv-incontent-ad" 
            className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-4"
          >
            <div className="flex h-[90px] items-center justify-center text-sm text-muted-foreground">
              Advertisement
            </div>
          </div>

          {/* SEO Content Section - Rich, semantic content */}
          {content && (
            <article
              id="content"
              className="prose prose-slate dark:prose-invert max-w-none mt-12"
              itemScope
              itemType="https://schema.org/Article"
            >
              <meta itemProp="headline" content={title} />
              <meta itemProp="author" content={author} />
              {lastUpdated && <meta itemProp="dateModified" content={lastUpdated} />}
              
              <div className="text-foreground [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-foreground [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-2 [&>p]:mt-4 [&>p]:leading-relaxed [&>p]:text-muted-foreground [&>ul]:mt-4 [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:leading-relaxed [&>ul>li]:text-muted-foreground [&>ol]:mt-4 [&>ol]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:leading-relaxed [&>ol>li]:text-muted-foreground [&>strong]:font-semibold [&>strong]:text-foreground [&>table]:mt-6 [&>table]:w-full [&>table]:border-collapse [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-border [&>table>thead>tr>th]:bg-muted/50 [&>table>thead>tr>th]:px-4 [&>table>thead>tr>th]:py-2 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-border [&>table>tbody>tr>td]:px-4 [&>table>tbody>tr>td]:py-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground">
                {content}
              </div>
            </article>
          )}

          {/* FAQ Section with Schema */}
          {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}

          {/* Related Tools for Mobile */}
          {relatedTools && relatedTools.length > 0 && (
            <section className="mt-12 rounded-xl border border-border bg-white p-6 lg:hidden dark:border-border dark:bg-muted/50">
              <h3 className="text-lg font-semibold text-foreground">
                Related Tools
              </h3>
              <ul className="mt-4 space-y-3">
                {relatedTools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="group flex items-center justify-between font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span>{tool.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Bottom Ad - Journey/Mediavine */}
          <div 
            id="mv-bottom-ad"
            className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-4"
          >
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              Advertisement
            </div>
          </div>
        </main>

        {/* Sidebar - Sticky, ad-optimized */}
        <aside id="secondary" className="hidden overflow-visible lg:block">
          <div className="sticky top-24 space-y-6">
            {/* ATF Ad Target - Mediavine */}
            <div id="sidebar_atf" className="widget rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                Advertisement
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools && relatedTools.length > 0 && (
              <div className="widget rounded-xl border border-border bg-white p-5 dark:border-border dark:bg-muted/50">
                <h3 className="font-semibold text-foreground">
                  Related Tools
                </h3>
                <ul className="mt-4 space-y-3">
                  {relatedTools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <span>{tool.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Links */}
            <div className="widget rounded-xl border border-border bg-white p-5 dark:border-border dark:bg-muted/50">
              <h3 className="font-semibold text-foreground">
                Popular Categories
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/category/math-calculators"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Math Calculators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/finance-tools"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Finance Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/health-fitness"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Health & Fitness
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/date-time"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Date & Time
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View All Tools →
                  </Link>
                </li>
              </ul>
            </div>

            {/* BTF Ad Target - Mediavine */}
            <div id="sidebar_btf" className="widget rounded-xl border border-dashed border-border bg-muted/30 p-4">
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                Advertisement
              </div>
            </div>

            {/* Sidebar Stopper - Mediavine */}
            <div id="mv-sidebar-stopper" />
          </div>
        </aside>
      </div>

      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            description: description,
            url: `https://softzar.com/${title.toLowerCase().replace(/\s+/g, '-')}/`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            author: {
              "@type": "Organization",
              name: "Softzar",
              url: "https://softzar.com",
            },
          }),
        }}
      />
    </div>
  );
}
