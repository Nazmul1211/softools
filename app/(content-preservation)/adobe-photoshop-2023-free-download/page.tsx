import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Adobe Photoshop 2023 Review | Softzar",
  description: "Professional review of Adobe Photoshop 2023 for creators comparing older stable builds with newer AI-centric versions.",
  alternates: {
    canonical: "https://softzar.com/adobe-photoshop-2023-free-download/",
  },
  openGraph: {
    title: "Adobe Photoshop 2023 Review | Softzar",
    description: "Professional review of Adobe Photoshop 2023 for creators comparing older stable builds with newer AI-centric versions.",
    url: "https://softzar.com/adobe-photoshop-2023-free-download/",
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
        <span className="text-foreground">Adobe Photoshop 2023 Review</span>
      </nav>

      <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-muted/30">
        <header className="border-b border-border p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Software Review</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Adobe Photoshop 2023 Review</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Photoshop 2023 remains a practical option for users who want a mature environment and broad compatibility with established PSD workflows. It offers strong core editing performance for everyday creative work.</p>
        </header>

        <figure className="border-b border-border p-6 sm:p-8">
          <Image
            src="/legacy-images/adobe-photoshop-2023-free-download.png"
            alt="Adobe Photoshop 2023 Review screenshot"
            width={1200}
            height={630}
            className="h-auto w-full rounded-xl border border-border object-cover"
            unoptimized
          />
        </figure>

        <section className="space-y-6 p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
          <div className="rounded-xl border border-border bg-background p-4">
            <h2 className="text-lg font-semibold text-foreground">Review Summary</h2>
            <p className="mt-2">Photoshop 2023 remains a practical option for users who want a mature environment and broad compatibility with established PSD workflows. It offers strong core editing performance for everyday creative work.</p>
            <p className="mt-2">
              <strong className="text-foreground">Best for:</strong> Designers who prioritize a familiar and proven editing environment.
            </p>
            <p className="mt-1">
              <strong className="text-foreground">Softzar review score:</strong> 8.1/10
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Key Features and Workflow Notes</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Solid retouching, compositing, and typography toolkit.</li>
            <li>Good stability for long-form PSD-based project pipelines.</li>
            <li>Reliable compatibility with common plugin ecosystems.</li>
            <li>Balanced feature set for print and digital output.</li>
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
                href="https://www.adobe.com/products/photoshop.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.adobe.com/products/photoshop.html
              </a>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h3 className="text-base font-semibold text-foreground">Pros</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Stable editing experience for routine design work.</li>
              <li>Extensive training resources and community support.</li>
              <li>Still highly capable for professional-level output.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h3 className="text-base font-semibold text-foreground">Cons</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Misses some newer AI tools from recent versions.</li>
              <li>Not the fastest option for latest hardware acceleration gains.</li>
              <li>Subscription model still applies.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Related Reviews</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><Link href="/adobe-photoshop-2024-free-download/" className="text-primary hover:underline">Adobe Photoshop 2024 Review</Link></li>
            <li><Link href="/adobe-photoshop-2025/" className="text-primary hover:underline">Adobe Photoshop 2025 Review</Link></li>
            <li><Link href="/adobe-photoshop-cc-2021/" className="text-primary hover:underline">Adobe Photoshop CC 2021 Review</Link></li>
              <li><Link href="/category/review/" className="text-primary hover:underline">View all review posts</Link></li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}
