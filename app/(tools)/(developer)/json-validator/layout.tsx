import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Validator - Validate JSON Online Free",
  description:
    "Validate JSON instantly with line and column error hints, format and minify options, and browser-based privacy. Free JSON validator for developers.",
  keywords: [
    "json validator",
    "validate json",
    "json checker",
    "json lint",
    "json parse error",
    "json format",
    "json minify",
    "developer tools",
  ],
  openGraph: {
    title: "JSON Validator - Validate JSON Online Free",
    description:
      "Find JSON syntax errors quickly with precise position hints and clean formatting tools.",
    type: "website",
    url: "https://softzar.com/json-validator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Validator Online Free",
    description: "Validate, format, and minify JSON with instant browser-side processing.",
  },
  alternates: {
    canonical: "https://softzar.com/json-validator/",
  },
};

export default function JSONValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
