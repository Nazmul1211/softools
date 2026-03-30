import type { Metadata } from "next";
import Link from "next/link";

const reviewPosts = [
  {
    href: "/adobe-premiere-pro-cc-2024/",
    title: "Adobe Premiere Pro CC 2024 Review",
    snippet:
      "Timeline performance, color workflow, and production reliability for current editing teams.",
  },
  {
    href: "/adobe-after-effects-latest/",
    title: "Adobe After Effects Latest Review",
    snippet:
      "A practical look at the newest After Effects release for motion design and VFX pipelines.",
  },
  {
    href: "/adobe-after-effects-2024/",
    title: "Adobe After Effects 2024 Review",
    snippet:
      "Core animation workflow quality, plugin compatibility, and export reliability in active projects.",
  },
  {
    href: "/adobe-photoshop-for-macos/",
    title: "Adobe Photoshop for macOS Review",
    snippet:
      "macOS-specific workflow notes, performance considerations, and ecosystem fit for creators.",
  },
  {
    href: "/adobe-after-effects-cc-2023/",
    title: "Adobe After Effects CC 2023 Review",
    snippet:
      "Whether this version still makes sense for legacy setups and lower-spec motion workflows.",
  },
  {
    href: "/adobe-illustrator-cc-2022/",
    title: "Adobe Illustrator CC 2022 Review",
    snippet:
      "A stability-first Illustrator option for users with older assets, presets, and hardware profiles.",
  },
  {
    href: "/adobe-premiere-pro-2025-free-download/",
    title: "Adobe Premiere Pro 2025 Review",
    snippet:
      "How the 2025 cycle improves speed, automation, and day-to-day editing comfort for teams.",
  },
  {
    href: "/adobe-photoshop-2023-free-download/",
    title: "Adobe Photoshop 2023 Review",
    snippet:
      "A balanced version with broad compatibility and enough modern features for many creators.",
  },
  {
    href: "/adobe-premiere-pro-cc-2023/",
    title: "Adobe Premiere Pro CC 2023 Review",
    snippet:
      "Reviewing performance, codec behavior, and practical fit for existing media workflows.",
  },
  {
    href: "/adobe-illustrator-cc-2023/",
    title: "Adobe Illustrator CC 2023 Review",
    snippet:
      "Solid vector design workflow quality for branding, social content, and print production.",
  },
  {
    href: "/adobe-photoshop-2024-free-download/",
    title: "Adobe Photoshop 2024 Review",
    snippet:
      "A modern Photoshop release focused on faster selection, retouching, and AI-assisted work.",
  },
  {
    href: "/adobe-illustrator-2024-free-download/",
    title: "Adobe Illustrator 2024 Review",
    snippet:
      "A refined Illustrator release for vector-heavy work where consistency matters most.",
  },
  {
    href: "/adobe-photoshop-2025/",
    title: "Adobe Photoshop 2025 Review",
    snippet:
      "Our verdict on the latest Photoshop generation for production editing and campaign design.",
  },
  {
    href: "/adobe-acrobat-pro-dc-free-download/",
    title: "Adobe Acrobat Pro DC Review",
    snippet:
      "Editing, organizing, and securing PDF workflows for business and document-heavy teams.",
  },
  {
    href: "/edius-free-download/",
    title: "Edius Pro 11 Review",
    snippet:
      "A fast NLE option for editors who value stability, low-latency playback, and fast turnaround.",
  },
  {
    href: "/adobe-photoshop-cc-2021/",
    title: "Adobe Photoshop CC 2021 Review",
    snippet:
      "Legacy Photoshop coverage for users balancing familiarity, plugin support, and hardware limits.",
  },
  {
    href: "/edius-pro-9-free-download-for-lifetime/",
    title: "Edius Pro 9 Review",
    snippet:
      "A legacy Edius release still useful for certain archive-first and compatibility-first workflows.",
  },
  {
    href: "/minecraft-apk-1-20-81-01-apk-free-download/",
    title: "Minecraft 1.20.81.01 Review",
    snippet:
      "Compatibility and gameplay experience notes for users searching this specific Android build.",
  },
  {
    href: "/adobe-illustrator-2025/",
    title: "Adobe Illustrator 2025 Review",
    snippet:
      "What changed in Illustrator 2025 and whether it is worth upgrading right now.",
  },
  {
    href: "/adobe-indesign-free-download/",
    title: "Adobe InDesign Review",
    snippet:
      "Layout and publishing workflow analysis for magazines, reports, and print-ready documents.",
  },
];

export const metadata: Metadata = {
  title: "Software Review Category",
  description:
    "Browse all software review preservation posts on Softzar. Compare Adobe, Edius, and related software reviews in one clean category page.",
  alternates: {
    canonical: "https://softzar.com/review/",
  },
  openGraph: {
    title: "Software Review Category",
    description:
      "Browse all software review preservation posts on Softzar in one organized review category.",
    url: "https://softzar.com/review/",
    type: "website",
  },
};

export default function ReviewCategoryPage() {
  return (
    <main className="mx-auto max-w-5xl mt-4 px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Review</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-border bg-card-bg p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Review Category
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Trusted Software Reviews
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          This category preserves high-performing legacy review URLs so returning users can still
          find familiar pages. Each post has been standardized into a cleaner review format with
          updated structure, better readability, and official-source linking for safer downloads
          and product information.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card-bg p-6 mb-12 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground">All Review Posts</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          20 content-preservation review posts are listed below.
        </p>

        <ul className="mt-6 list-disc space-y-4 pl-5 marker:text-primary">
          {reviewPosts.map((post) => (
            <li key={post.href}>
              <Link
                href={post.href}
                className="text-base font-semibold text-primary hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{post.snippet}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
