import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Adobe Illustrator CC 2022 Review | Softzar",
  description: "Professional review of Adobe Illustrator CC 2022 for vector design workflows and long-term compatibility needs.",
  alternates: {
    canonical: "https://softzar.com/adobe-illustrator-cc-2022/",
  },
  openGraph: {
    title: "Adobe Illustrator CC 2022 Review | Softzar",
    description: "Professional review of Adobe Illustrator CC 2022 for vector design workflows and long-term compatibility needs.",
    url: "https://softzar.com/adobe-illustrator-cc-2022/",
    type: "article",
  },
};

export default function ReviewPage() {
  return (
    <main className="mx-auto mt-4 mb-12 max-w-5xl px-4 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/review/" className="hover:text-primary">Review</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Adobe Illustrator CC 2022 Review</span>
      </nav>

      <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-muted/30">
        <header className="border-b border-border p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Software Review</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Adobe Illustrator CC 2022 Review</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Illustrator CC 2022 still provides a dependable vector design environment for logos, icon systems, and print-ready artwork. It is especially useful in teams maintaining long-standing brand libraries.</p>
        </header>

        <figure className="border-b border-border p-6 sm:p-8">
          <Image
            src="/legacy-images/adobe-illustrator-cc-2022.png"
            alt="Adobe Illustrator CC 2022 Review screenshot"
            width={1200}
            height={630}
            className="h-auto w-full rounded-xl border border-border object-cover"
            unoptimized
          />
        </figure>

        <section className="space-y-6 p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
          <div className="rounded-xl border border-border bg-background p-4">
            <h2 className="text-lg font-semibold text-foreground">Review Summary</h2>
            <p className="mt-2">Illustrator CC 2022 still provides a dependable vector design environment for logos, icon systems, and print-ready artwork. It is especially useful in teams maintaining long-standing brand libraries.</p>
            <p className="mt-2">
              <strong className="text-foreground">Best for:</strong> Designers maintaining vector archives and stable branding pipelines.
            </p>
            <p className="mt-1">
              <strong className="text-foreground">Softzar review score:</strong> 7.9/10
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Key Features and Workflow Notes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Reliable vector drawing engine for scalable design work.</li>
            <li>Strong path editing and precision alignment controls.</li>
            <li>Good compatibility with established .ai production files.</li>
            <li>Well-suited for packaging, branding, and print outputs.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Performance and Stability</h2>
            <p className="mt-2">
              In practical day-to-day use, this version is most successful when the host system meets modern CPU, GPU, and storage expectations. For production reliability, keep GPU drivers updated, allocate fast SSD space for media/cache, and test project templates before switching active client work.
            </p>
            <p className="mt-2">
              Compared with older builds, this release line is generally better suited to mixed workflows that include social delivery, long-form exports, and frequent revisions. Teams with archive-heavy projects should still validate compatibility before major migrations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Pricing, Licensing, and Official Download</h2>
            <p className="mt-2">
              This review page is maintained for SEO preservation and user continuity. For safe installation, licensing, and latest release details, always use the official vendor source.
            </p>
            <p className="mt-2">
              Official source:{" "}
              <a
                href="https://www.adobe.com/products/illustrator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.adobe.com/products/illustrator.html
              </a>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h3 className="text-base font-semibold text-foreground">Pros</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Mature toolset for professional vector workflows.</li>
              <li>Predictable behavior in long-running design systems.</li>
              <li>Broad educational and plugin ecosystem support.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h3 className="text-base font-semibold text-foreground">Cons</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Lacks newer productivity upgrades from recent versions.</li>
              <li>Large files can feel heavy on older systems.</li>
              <li>Subscription costs continue regardless of version preferences.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Related Reviews</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><Link href="/adobe-illustrator-cc-2023/" className="text-primary hover:underline">Adobe Illustrator CC 2023 Review</Link></li>
            <li><Link href="/adobe-illustrator-2024-free-download/" className="text-primary hover:underline">Adobe Illustrator 2024 Review</Link></li>
            <li><Link href="/adobe-illustrator-2025/" className="text-primary hover:underline">Adobe Illustrator 2025 Review</Link></li>
              <li><Link href="/review/" className="text-primary hover:underline">View all review posts</Link></li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
