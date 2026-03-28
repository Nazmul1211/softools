import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Number Generator - Generate Random Numbers Online",
  description:
    "Free random number generator tool. Generate single or multiple random numbers within any range. Perfect for games, raffles, and random sampling.",
  keywords: [
    "random number generator",
    "random number",
    "RNG",
    "lottery numbers",
    "random picker",
    "dice roller",
  ],
};

export default function RandomNumberGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
