import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Query Formatter - Beautify and Minify SQL | SoftZaR",
  description:
    "Format SQL queries with readable line breaks and keyword casing, then copy formatted or minified output instantly.",
  keywords: [
    "sql query formatter",
    "sql beautifier",
    "sql prettifier",
    "sql minifier",
    "format sql online",
  ],
  openGraph: {
    title: "SQL Query Formatter",
    description: "Beautify and minify SQL in your browser with quick copy support.",
    type: "website",
    url: "https://softzar.com/sql-query-formatter/",
  },
  alternates: {
    canonical: "https://softzar.com/sql-query-formatter/",
  },
};

export default function SQLQueryFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
