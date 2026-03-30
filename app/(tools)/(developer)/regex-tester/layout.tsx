import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester - Test Regular Expressions Online",
  description:
    "Free online regex tester and debugger. Test JavaScript regular expressions with real-time matching, highlighting, and detailed match information.",
  keywords: [
    "regex tester",
    "regular expression",
    "regex debugger",
    "pattern matching",
    "regex online",
    "JavaScript regex",
    "regex validator",
  ],
  openGraph: {
    title: "Regex Tester - Test Regular Expressions Online",
    description:
      "Test and debug regular expressions with real-time matching and highlighting. Perfect for developers.",
    url: "https://softzar.com/regex-tester/",
  },
};

export default function RegexTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
