import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGPA to Percentage Converter",
  description:
    "Convert CGPA (Cumulative Grade Point Average) to percentage equivalent. Support for 4.0, 5.0, and 10.0 scale conversions.",
  keywords: [
    "cgpa to percentage converter",
    "gpa to percentage calculator",
    "cumulative gpa to percentage",
    "4.0 to percentage",
    "5.0 scale to percentage",
    "10 point scale converter",
    "cgpa calculator",
  ],
  openGraph: {
    title: "CGPA to Percentage Converter",
    description: "Convert your CGPA to percentage across different scales.",
    type: "website",
    url: "https://softzar.com/cgpa-to-percentage-calculator/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA to Percentage Converter | SoftZaR",
    description: "Quick CGPA to percentage conversion tool.",
  },
  alternates: {
    canonical: "https://softzar.com/cgpa-to-percentage-calculator/",
  },
};

export default function CGPAToPercentageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
