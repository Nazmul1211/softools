import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage to GPA Converter - 4.0, 5.0, 10.0 Scales | SoftZaR",
  description:
    "Convert percentage scores to GPA on 4.0, 5.0, and 10.0 scales with quick academic planning estimates.",
  keywords: [
    "percentage to gpa converter",
    "percentage to gpa calculator",
    "convert marks to gpa",
    "4.0 gpa converter",
    "10 point gpa converter",
  ],
  openGraph: {
    title: "Percentage to GPA Converter",
    description:
      "Convert percentage grades to GPA scales quickly for academic planning.",
    type: "website",
    url: "https://softzar.com/percentage-to-gpa-converter/",
  },
  alternates: {
    canonical: "https://softzar.com/percentage-to-gpa-converter/",
  },
};

export default function PercentageToGPAConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
