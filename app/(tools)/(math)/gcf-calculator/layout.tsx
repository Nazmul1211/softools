import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCF Calculator — Greatest Common Factor/Divisor (GCD) | SoftZaR",
  description:
    "Find the greatest common factor (GCF) of two or more numbers with step-by-step solutions using prime factorization, division, and Euclidean algorithm. Free GCF calculator.",
  keywords: [
    "GCF calculator",
    "greatest common factor",
    "GCD calculator",
    "greatest common divisor",
    "highest common factor",
    "HCF calculator",
    "find GCF",
    "Euclidean algorithm",
    "prime factorization GCF",
  ],
  openGraph: {
    title: "GCF Calculator — Greatest Common Factor with Steps",
    description:
      "Find the GCF/GCD of any set of numbers. Step-by-step solutions using prime factorization and the Euclidean algorithm. Free math calculator.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GCF Calculator | SoftZaR",
    description:
      "Calculate the greatest common factor of two or more numbers with step-by-step solutions.",
  },
};

export default function GCFCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
