import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Zone Converter - Convert Times Between Time Zones",
  description:
    "Free time zone converter to convert times between any time zones worldwide. Perfect for scheduling international meetings, calls, and travel planning.",
  keywords: [
    "time zone converter",
    "time zone calculator",
    "world clock",
    "convert time",
    "international time",
    "meeting scheduler",
  ],
  openGraph: {
    title: "Time Zone Converter - Convert Times Between Time Zones",
    description: "Convert times between any time zones worldwide instantly.",
    type: "website",
  },
};

export default function TimeZoneConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
