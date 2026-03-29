import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/config/site";

const reviewLinks = [
  { href: "/adobe-premiere-pro-cc-2024/", name: "Adobe Premiere Pro CC 2024 Review" },
  { href: "/adobe-after-effects-latest/", name: "Adobe After Effects Latest Review" },
  { href: "/adobe-after-effects-2024/", name: "Adobe After Effects 2024 Review" },
  { href: "/adobe-photoshop-for-macos/", name: "Adobe Photoshop for macOS Review" },
  { href: "/adobe-photoshop-2025/", name: "Adobe Photoshop 2025 Review" },
  { href: "/adobe-illustrator-2025/", name: "Adobe Illustrator 2025 Review" },
  { href: "/adobe-acrobat-pro-dc-free-download/", name: "Adobe Acrobat Pro DC Review" },
  { href: "/edius-free-download/", name: "Edius Pro 11 Review" },
  { href: "/edius-pro-9-free-download-for-lifetime/", name: "Edius Pro 9 Review" },
  { href: "/minecraft-apk-1-20-81-01-apk-free-download/", name: "Minecraft 1.20.81.01 Review" },
];

export default function ContentPreservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-[1fr_336px]">
        <div id="journey-content-target" className="min-w-0">
          {children}
        </div>

        {/* Sidebar - Journey/Mediavine compatible */}
        <aside id="secondary" className="mb-12 hidden overflow-visible lg:block">
          <div className="sticky top-24 space-y-6">
            {/* ATF Ad Target - Mediavine/Journey */}
            <div id="sidebar_atf" className="widget" />

            <div className="widget rounded-xl border border-border bg-white p-5 dark:border-border dark:bg-muted/50">
              <h3 className="font-semibold text-foreground">Related Reviews</h3>
              <ul className="mt-4 space-y-3">
                {reviewLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="line-clamp-1">{item.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/review/"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View all reviews →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="widget rounded-xl border border-border bg-white p-5 dark:border-border dark:bg-muted/50">
              <h3 className="font-semibold text-foreground">Popular Categories</h3>
              <ul className="mt-4 space-y-3">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/${cat.slug}/`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/tools/"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View all tools →
                  </Link>
                </li>
              </ul>
            </div>

            {/* BTF Ad Target - Mediavine/Journey */}
            <div id="sidebar_btf" className="widget" />

            {/* Sidebar Stopper - Mediavine/Journey */}
            <div id="mv-sidebar-stopper" />
          </div>
        </aside>
      </div>
    </div>
  );
}
