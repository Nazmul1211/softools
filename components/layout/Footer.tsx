import Link from "next/link";
import {
  Calculator,
  DollarSign,
  Heart,
  ArrowLeftRight,
  FileText,
  Clock,
  Shuffle,
  Code,
  Mail,
  Image,
} from "lucide-react";
import { siteConfig, categories } from "@/config/site";
import { tools } from "@/lib/tools";

const categoryIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-4 w-4" strokeWidth={1.5} />,
  finance: <DollarSign className="h-4 w-4" strokeWidth={1.5} />,
  health: <Heart className="h-4 w-4" strokeWidth={1.5} />,
  conversion: <ArrowLeftRight className="h-4 w-4" strokeWidth={1.5} />,
  text: <FileText className="h-4 w-4" strokeWidth={1.5} />,
  "date-time": <Clock className="h-4 w-4" strokeWidth={1.5} />,
  random: <Shuffle className="h-4 w-4" strokeWidth={1.5} />,
  developer: <Code className="h-4 w-4" strokeWidth={1.5} />,
  pdf: <FileText className="h-4 w-4" strokeWidth={1.5} />,
  image: <Image className="h-4 w-4" strokeWidth={1.5} />,
};

export function Footer() {
  const popularTools = tools.slice(0, 6);
  const moreTools = tools.slice(6, 12);

  return (
    <footer className="mt-auto border-t border-border bg-background dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand — OmniCalculator Style */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-foreground font-[family-name:var(--font-wallpoet)] tracking-wider transition-colors group-hover:text-primary">
                Soft<span className="text-primary">ZaR</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-[220px]">
              Free online tools and calculators for everyday tasks.
            </p>
            {/* Social Links */}
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="mailto:contact@softzar.com"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Calculator Categories — OmniCalculator Style with icons */}
          <div className="col-span-2 sm:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Calculator Categories
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="text-primary/70">
                    {categoryIcons[category.id]}
                  </span>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Popular Tools
            </h3>
            <ul className="space-y-2.5">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Legal — "Meet Omni" equivalent */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Meet Softzar
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar — OmniCalculator Style */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <Link
            href="/privacy-policy"
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Privacy, Cookies & Terms of Service
          </Link>
          <p className="text-xs text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
