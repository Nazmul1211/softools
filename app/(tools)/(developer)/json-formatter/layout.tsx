import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Beautify and Minify JSON",
  description:
    "Free JSON formatter, validator, and beautifier. Format, validate, minify, and fix JSON data online. Syntax highlighting and error detection for developers.",
  keywords: [
    "JSON formatter",
    "JSON beautifier",
    "JSON validator",
    "JSON minify",
    "prettify JSON",
    "format JSON",
    "JSON viewer",
    "JSON parser",
  ],
  openGraph: {
    title: "JSON Formatter & Validator - Free Online Tool",
    description: "Format, beautify, validate, and minify JSON data instantly. Includes syntax highlighting and detailed error messages.",
    type: "website",
  },
};

export default function JSONFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
