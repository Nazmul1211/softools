import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Calculator — Add & Subtract Time | Softzar",
  description:
    "Add and subtract time durations easily. Calculate hours, minutes, and seconds, convert between time units, and track work hours with our free time calculator.",
  keywords: [
    "time calculator",
    "add time",
    "subtract time",
    "hours calculator",
    "time duration calculator",
    "hours and minutes calculator",
    "time converter",
    "work hours calculator",
  ],
  openGraph: {
    title: "Time Calculator — Add & Subtract Time",
    description:
      "Add and subtract time durations easily. Calculate hours, minutes, seconds and convert between time units.",
    type: "website",
  },
};

export default function TimeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
