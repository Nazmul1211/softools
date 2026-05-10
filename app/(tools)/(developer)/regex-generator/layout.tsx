import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Generator & Tester — Test Regular Expressions | SoftZaR",
  description:
    "Test and generate regular expressions. Common regex examples for email, URL, phone numbers, and more. See match results and captured groups instantly.",
  keywords: [
    "regex generator",
    "regex tester",
    "regular expression tester",
    "regex pattern tester",
    "email regex",
    "URL regex",
    "phone number regex",
    "regex examples",
    "test regular expressions",
  ],
  openGraph: {
    title: "Regex Generator & Tester — Test Regular Expressions",
    description:
      "Test regex patterns instantly. Common regex examples and explanations. See matches and captured groups.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Generator & Tester | SoftZaR",
    description:
      "Test and generate regular expressions with instant match results and explanations.",
  },
  alternates: {
    canonical: "https://softzar.com/regex-generator/",
  },
};

export default function RegexGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
