import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator - Generate UUIDs Online",
  description:
    "Generate random UUIDs (v4) and timestamp-based UUIDs (v1) instantly. Create single or bulk UUIDs with customizable formatting options. Free online UUID generator.",
  keywords: [
    "UUID generator",
    "GUID generator",
    "random UUID",
    "UUID v4",
    "UUID v1",
    "unique identifier",
    "generate UUID",
  ],
  openGraph: {
    title: "UUID Generator - Free Online Tool",
    description: "Generate random UUIDs instantly. Support for UUID v1 (timestamp) and v4 (random). Generate single or bulk UUIDs.",
    type: "website",
  },
};

export default function UUIDGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
