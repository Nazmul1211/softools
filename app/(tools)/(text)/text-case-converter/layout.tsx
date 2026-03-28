import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Case Converter - Change Text Case Online",
  description:
    "Convert text between uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more. Free online text transformation tool for writers and developers.",
  keywords: [
    "text case converter",
    "uppercase converter",
    "lowercase converter",
    "title case",
    "camelCase",
    "snake_case",
    "text transformer",
  ],
  openGraph: {
    title: "Text Case Converter - Free Online Tool",
    description: "Instantly convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case, and more.",
    type: "website",
  },
};

export default function TextCaseConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
