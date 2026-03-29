"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Check, Copy, Download, Link as LinkIcon, ListTree } from "lucide-react";

type Separator = "-" | "_";

interface SlugOptions {
  separator: Separator;
  lowercase: boolean;
  removeStopWords: boolean;
  removeNumbers: boolean;
  keepUnicode: boolean;
  maxLength: number;
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "for",
  "to",
  "in",
  "on",
  "at",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
]);

const faqs: FAQItem[] = [
  {
    question: "What is a slug in SEO?",
    answer:
      "A slug is the readable final part of a URL, usually describing page content. Clean slugs improve usability and help search engines understand topical relevance.",
  },
  {
    question: "Should slugs always be lowercase?",
    answer:
      "Lowercase slugs are recommended for consistency and fewer edge cases across servers, analytics tools, and shared links.",
  },
  {
    question: "Is it good to include keywords in a slug?",
    answer:
      "Yes, as long as the slug stays natural and concise. Include core intent terms, but avoid keyword stuffing and unnecessary words.",
  },
  {
    question: "What length should a slug be?",
    answer:
      "Shorter is usually better for readability. In many workflows, 40 to 80 characters is a practical range that keeps URLs clean and descriptive.",
  },
];

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createSlug(raw: string, options: SlugOptions): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  let working = trimmed.replace(/&/g, " and ").replace(/[’']/g, "");

  if (!options.keepUnicode) {
    working = working.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  if (options.lowercase) {
    working = working.toLowerCase();
  }

  let words = working.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  if (!options.keepUnicode) {
    words = words.map((word) => word.replace(/[^a-zA-Z0-9]/g, "")).filter(Boolean);
  }

  if (options.removeNumbers) {
    words = words.filter((word) => !/^\p{N}+$/u.test(word));
  }

  if (options.removeStopWords) {
    words = words.filter((word, index) => index === 0 || !STOP_WORDS.has(word.toLowerCase()));
  }

  let slug = words.join(options.separator);
  const escapedSeparator = escapeForRegExp(options.separator);

  slug = slug
    .replace(new RegExp(`${escapedSeparator}{2,}`, "g"), options.separator)
    .replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, "g"), "");

  if (options.maxLength > 0 && slug.length > options.maxLength) {
    slug = slug.slice(0, options.maxLength);
    const lastSeparator = slug.lastIndexOf(options.separator);
    if (lastSeparator > Math.floor(options.maxLength * 0.45)) {
      slug = slug.slice(0, lastSeparator);
    }
    slug = slug.replace(new RegExp(`${escapedSeparator}+$`), "");
  }

  return slug || "untitled";
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function SlugGeneratorPage() {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [input, setInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [domain, setDomain] = useState("https://softzar.com");
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedBulk, setCopiedBulk] = useState(false);
  const [options, setOptions] = useState<SlugOptions>({
    separator: "-",
    lowercase: true,
    removeStopWords: true,
    removeNumbers: false,
    keepUnicode: false,
    maxLength: 80,
  });

  const singleSlug = useMemo(() => createSlug(input, options), [input, options]);

  const bulkResults = useMemo(() => {
    const lines = bulkInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const duplicateTracker = new Map<string, number>();

    return lines.map((original) => {
      const base = createSlug(original, options) || "untitled";
      const count = (duplicateTracker.get(base) ?? 0) + 1;
      duplicateTracker.set(base, count);
      const slug = count === 1 ? base : `${base}${options.separator}${count}`;
      return { original, slug };
    });
  }, [bulkInput, options]);

  const previewUrl = singleSlug ? `${domain.replace(/\/$/, "")}/${singleSlug}/` : `${domain.replace(/\/$/, "")}/`;

  const copySingle = async () => {
    if (!singleSlug) return;

    try {
      await navigator.clipboard.writeText(singleSlug);
      setCopiedSingle(true);
      window.setTimeout(() => setCopiedSingle(false), 1800);
    } catch (caughtError) {
      console.error("Failed to copy slug:", caughtError);
    }
  };

  const copyBulk = async () => {
    if (bulkResults.length === 0) return;

    const content = bulkResults.map((item) => item.slug).join("\n");

    try {
      await navigator.clipboard.writeText(content);
      setCopiedBulk(true);
      window.setTimeout(() => setCopiedBulk(false), 1800);
    } catch (caughtError) {
      console.error("Failed to copy bulk slugs:", caughtError);
    }
  };

  const bulkExportContent = useMemo(
    () =>
      bulkResults.length > 0
        ? bulkResults.map((item) => `${item.original}\t${item.slug}`).join("\n")
        : "",
    [bulkResults]
  );

  return (
    <ToolLayout
      title="Slug Generator"
      description="Generate clean SEO-friendly URL slugs from titles and bulk text. Control separators, stop words, casing, and slug length with live preview."
      category={{ name: "Text Tools", slug: "text-tools" }}
      relatedTools={[
        { name: "Character Counter", href: "/character-counter/" },
        { name: "Word Counter", href: "/word-counter/" },
        { name: "URL Encoder/Decoder", href: "/url-encoder/" },
        { name: "JSON Validator", href: "/json-validator/" },
      ]}
      howToSteps={[
        { name: "Add Text", text: "Enter a page title or paste multiple lines in bulk mode." },
        { name: "Tune Rules", text: "Set separator, casing, stop words, and max length." },
        { name: "Copy or Export", text: "Copy the generated slug or export bulk mappings." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>Why Slug Quality Matters for SEO, UX, and Content Operations</h2>
          <p>
            Slugs are one of the most visible structural elements of a URL. They influence how users interpret links, how teams manage content architecture, and how search engines read page topics. A clear slug improves trust because people can quickly understand what a page is about before clicking. It also supports better organization inside analytics dashboards, CMS workflows, and internal linking strategies. When slug quality is inconsistent, even strong content can become harder to manage and less intuitive to navigate.
          </p>
          <p>
            A practical slug strategy should prioritize clarity, consistency, and maintainability. Random parameters, overly long phrases, and noisy stop words can make links harder to scan. In contrast, concise keyword-focused slugs create cleaner experiences across search results, social shares, email campaigns, and documentation systems.
          </p>

          <h2>How Search Engines and Users Benefit from Clean URL Slugs</h2>
          <p>
            Search engines use multiple signals to understand page relevance, and readable URLs can reinforce topical intent. While slugs alone do not guarantee rankings, they contribute to a stronger semantic package when combined with quality titles, structured headings, and focused content. Users also tend to trust and share descriptive links more than cryptic URLs. This is especially important in competitive SERPs where clarity can influence click behavior.
          </p>
          <p>
            From a UX standpoint, clean slugs improve wayfinding. When users see logical paths, they can infer site structure and navigate with more confidence. This helps reduce friction in ecommerce, education, and SaaS documentation flows where users often move through multiple related pages.
          </p>

          <h2>Slug Best Practices for Editorial and Product Teams</h2>
          <ul>
            <li>Use lowercase formatting for consistency across systems and environments.</li>
            <li>Prefer hyphens for readability in standard web publishing workflows.</li>
            <li>Remove filler words unless they add meaningful intent context.</li>
            <li>Keep slugs short enough to scan quickly, usually under 80 characters.</li>
            <li>Avoid dates unless time specificity is essential to the content.</li>
            <li>Minimize frequent slug changes to prevent redirect complexity and link decay.</li>
          </ul>
          <p>
            These guidelines are especially helpful for teams working in high-volume publishing environments. Standardization reduces review overhead and lowers the risk of inconsistent URL patterns across departments.
          </p>

          <h2>Why Bulk Slug Generation Is a Major Productivity Upgrade</h2>
          <p>
            Manual slug cleanup becomes expensive when teams migrate content, launch multilingual sites, or publish large product catalogs. Bulk generation automates repetitive transformations and helps maintain naming conventions across hundreds of pages. With duplicate handling and rule-based normalization, teams can move from raw title lists to publish-ready URL segments in minutes.
          </p>
          <p>
            Bulk workflows also improve cross-team collaboration. SEO specialists can define slug rules once, then editors and developers can apply them consistently without manual interpretation each time. This creates more predictable URL governance and fewer post-publish fixes.
          </p>

          <h2>Handling Edge Cases in Real-World Slug Workflows</h2>
          <p>
            In production systems, slug generation should account for accents, punctuation, repeated separators, numeric-only phrases, and duplicate titles. Depending on your stack, you may choose ASCII-only slugs for compatibility or preserve Unicode characters for language fidelity. This tool supports both strategies so teams can align with CMS behavior, routing constraints, and localization requirements.
          </p>
          <p>
            It is also useful to define a maximum slug length. Long URLs can be harder to read and may introduce unnecessary complexity in analytics and campaign tracking. By trimming intelligently at separator boundaries, you keep slugs human-readable while staying concise.
          </p>

          <h2>Recommended Slug Governance Model for Growing Websites</h2>
          <ol>
            <li>Set global slug rules in your content operations playbook.</li>
            <li>Use one canonical separator and casing standard across all teams.</li>
            <li>Document when stop words should be preserved for clarity.</li>
            <li>Review redirects before changing existing published slugs.</li>
            <li>Run periodic audits to find duplicate or low-quality URL patterns.</li>
            <li>Train contributors to generate slugs during drafting, not after publishing.</li>
          </ol>
          <p>
            A disciplined slug process improves site hygiene over time. It strengthens SEO foundations, makes links more user-friendly, and reduces technical debt in routing, redirects, and analytics tracking.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/12 via-background to-emerald-500/10 p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <LinkIcon className="h-5 w-5 text-primary" />
            SEO Slug Workshop
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Build cleaner URLs for articles, product pages, and landing pages with flexible normalization rules.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={mode === "single" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode("single")}
          >
            Single Mode
          </Button>
          <Button
            variant={mode === "bulk" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode("bulk")}
          >
            <ListTree className="mr-1 h-4 w-4" />
            Bulk Mode
          </Button>
        </div>

        <section className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30 lg:grid-cols-2">
          <div className="space-y-3">
            {mode === "single" ? (
              <label className="block text-sm text-muted-foreground">
                Page title or phrase
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="How to Build a Better Content Strategy in 2026"
                  className="mt-1 h-36 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </label>
            ) : (
              <label className="block text-sm text-muted-foreground">
                One title per line
                <textarea
                  value={bulkInput}
                  onChange={(event) => setBulkInput(event.target.value)}
                  placeholder={"Top 10 Email Subject Line Examples\\nHow to Write Product Descriptions That Convert\\nBest Running Shoes for Flat Feet"}
                  className="mt-1 h-44 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </label>
            )}

            {mode === "single" && (
              <>
                <label className="block text-sm text-muted-foreground">
                  Domain preview
                  <input
                    type="text"
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </label>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Preview URL</p>
                  <p className="mt-1 break-all font-medium text-foreground">{previewUrl}</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-muted-foreground">
              Separator
              <select
                value={options.separator}
                onChange={(event) =>
                  setOptions((prev) => ({ ...prev, separator: event.target.value as Separator }))
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
              </select>
            </label>

            <label className="block text-sm text-muted-foreground">
              Max length ({options.maxLength})
              <input
                type="range"
                min={20}
                max={120}
                value={options.maxLength}
                onChange={(event) => setOptions((prev) => ({ ...prev, maxLength: Number(event.target.value) }))}
                className="mt-2 w-full accent-primary"
              />
            </label>

            <div className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(event) => setOptions((prev) => ({ ...prev, lowercase: event.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Lowercase
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <input
                  type="checkbox"
                  checked={options.removeStopWords}
                  onChange={(event) =>
                    setOptions((prev) => ({ ...prev, removeStopWords: event.target.checked }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                Remove Stop Words
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <input
                  type="checkbox"
                  checked={options.removeNumbers}
                  onChange={(event) => setOptions((prev) => ({ ...prev, removeNumbers: event.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Remove Number-Only Tokens
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <input
                  type="checkbox"
                  checked={options.keepUnicode}
                  onChange={(event) => setOptions((prev) => ({ ...prev, keepUnicode: event.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Keep Unicode
              </label>
            </div>
          </div>
        </section>

        {mode === "single" ? (
          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
            <h3 className="mb-3 text-lg font-semibold text-foreground">Generated Slug</h3>
            <div className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground">
              {singleSlug || "Type a title to generate a slug"}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void copySingle()} variant="outline" size="sm" disabled={!singleSlug}>
                {copiedSingle ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                {copiedSingle ? "Copied" : "Copy Slug"}
              </Button>
              <Button
                onClick={() => singleSlug && downloadText(singleSlug, "slug.txt")}
                variant="outline"
                size="sm"
                disabled={!singleSlug}
              >
                <Download className="mr-1 h-4 w-4" />
                Download
              </Button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground">Bulk Results</h3>
              <p className="text-sm text-muted-foreground">{bulkResults.length} rows generated</p>
            </div>

            <div className="max-h-72 overflow-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Original</th>
                    <th className="px-3 py-2">Slug</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResults.map((item, index) => (
                    <tr key={`${item.slug}-${index}`} className="border-t border-border">
                      <td className="px-3 py-2 text-foreground">{item.original}</td>
                      <td className="px-3 py-2 font-mono text-primary">{item.slug}</td>
                    </tr>
                  ))}
                  {bulkResults.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-3 py-4 text-center text-muted-foreground">
                        Add one title per line to generate bulk slugs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void copyBulk()} variant="outline" size="sm" disabled={bulkResults.length === 0}>
                {copiedBulk ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                {copiedBulk ? "Copied" : "Copy All Slugs"}
              </Button>
              <Button
                onClick={() => bulkExportContent && downloadText(bulkExportContent, "bulk-slugs.tsv")}
                variant="outline"
                size="sm"
                disabled={!bulkExportContent}
              >
                <Download className="mr-1 h-4 w-4" />
                Export TSV
              </Button>
            </div>
          </section>
        )}

        <p className="text-xs text-muted-foreground">
          Tip: Keep final URLs stable after publishing. If you change existing slugs on live pages, apply proper 301 redirects to preserve SEO value.
        </p>
      </div>
    </ToolLayout>
  );
}
