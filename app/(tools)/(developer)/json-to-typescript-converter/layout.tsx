import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to TypeScript Converter — Generate TypeScript Interfaces | SoftZaR",
  description:
    "Convert JSON to TypeScript interfaces instantly. Handle nested objects and arrays. Copy-to-clipboard functionality. Supports strict typing.",
  keywords: [
    "JSON to TypeScript",
    "JSON to TypeScript converter",
    "TypeScript interface generator",
    "JSON type generator",
    "convert JSON to types",
    "TypeScript type converter",
    "interface generator",
  ],
  openGraph: {
    title: "JSON to TypeScript Converter — Generate Types from JSON",
    description:
      "Instantly convert JSON samples to strongly-typed TypeScript interfaces. Handle nested objects, arrays, and complex structures.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to TypeScript Converter | SoftZaR",
    description:
      "Convert JSON data to TypeScript interfaces with proper typing and nested object support.",
  },
  alternates: {
    canonical: "https://softzar.com/json-to-typescript-converter/",
  },
};

export default function JSONToTypeScriptConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
