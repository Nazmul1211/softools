import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Adobe InDesign Review | Softzar",
  description: "Professional review of Adobe InDesign for editorial design, publication workflows, and multi-page layout production.",
  alternates: {
    canonical: "https://softzar.com/adobe-indesign-free-download/",
  },
  openGraph: {
    title: "Adobe InDesign Review | Softzar",
    description: "Professional review of Adobe InDesign for editorial design, publication workflows, and multi-page layout production.",
    url: "https://softzar.com/adobe-indesign-free-download/",
    type: "article",
  },
};

export default function ReviewPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/category/review/" className="hover:text-primary">Review</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Adobe InDesign Review</span>
      </nav>

      <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-muted/30">
        <header className="border-b border-border p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Software Review</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Adobe InDesign Review</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">InDesign remains the industry standard for multi-page publishing, editorial layout, and professional print production. It is especially effective for teams creating brochures, magazines, eBooks, and marketing collateral.</p>
        </header>

        <figure className="border-b border-border p-6 sm:p-8">
          <Image
            src="/legacy-images/adobe-indesign-free-download.png"
            alt="Adobe InDesign Review screenshot"
            width={1200}
            height={630}
            className="h-auto w-full rounded-xl border border-border object-cover"
            unoptimized
          />
        </figure>

        <section className="space-y-6 p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
          <div className="rounded-xl border border-border bg-background p-4">
            <h2 className="text-lg font-semibold text-foreground">Review Summary</h2>
            <p className="mt-2">InDesign remains the industry standard for multi-page publishing, editorial layout, and professional print production. It is especially effective for teams creating brochures, magazines, eBooks, and marketing collateral.</p>
            <p className="mt-2">
              <strong className="text-foreground">Best for:</strong> Publishing teams, marketers, and designers building high-quality multi-page documents.
            </p>
            <p className="mt-1">
              <strong className="text-foreground">Softzar review score:</strong> 8.7/10
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Key Features and Workflow Notes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Excellent typography and layout grid control.</li>
            <li>Reliable long-document management for publications.</li>
            <li>Strong integration with Illustrator and Photoshop assets.</li>
            <li>Professional output controls for print and digital exports.</li>
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
                href="https://www.adobe.com/products/indesign.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.adobe.com/products/indesign.html
              </a>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h3 className="text-base font-semibold text-foreground">Pros</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Best-in-class workflow for structured page design.</li>
              <li>Efficient management of reusable layout systems.</li>
              <li>Strong PDF export and print-ready delivery options.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h3 className="text-base font-semibold text-foreground">Cons</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Overkill for simple one-page tasks.</li>
              <li>Requires time to master advanced layout features.</li>
              <li>Subscription may not suit infrequent publishing needs.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Related Reviews</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><Link href="/adobe-illustrator-2025/" className="text-primary hover:underline">Adobe Illustrator 2025 Review</Link></li>
            <li><Link href="/adobe-photoshop-2025/" className="text-primary hover:underline">Adobe Photoshop 2025 Review</Link></li>
            <li><Link href="/adobe-acrobat-pro-dc-free-download/" className="text-primary hover:underline">Adobe Acrobat Pro DC Review</Link></li>
              <li><Link href="/category/review/" className="text-primary hover:underline">View all review posts</Link></li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
