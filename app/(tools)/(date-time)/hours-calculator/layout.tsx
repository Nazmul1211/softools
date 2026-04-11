import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hours Calculator — Add, Subtract & Convert Hours and Minutes | SoftZaR",
  description:
    "Add or subtract hours, minutes, and seconds. Calculate total hours between two times, convert hours to decimal, and compute work hours. Free hours calculator.",
  keywords: [
    "hours calculator",
    "add hours and minutes",
    "hours between two times",
    "time duration calculator",
    "hours to decimal",
    "work hours calculator",
    "subtract hours",
    "time math calculator",
    "total hours calculator",
  ],
  openGraph: {
    title: "Hours Calculator — Time Math & Duration Tool",
    description:
      "Add, subtract, and calculate total hours between times. Convert to decimal hours and minutes. Free tool for payroll and scheduling.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hours Calculator | SoftZaR",
    description:
      "Add or subtract hours and minutes. Calculate duration between times. Free hours calculator.",
  },
};

export default function HoursCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
