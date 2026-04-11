import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Future Value Calculator — Project Investment Growth | SoftZaR",
  description:
    "Calculate the future value of investments with compound interest. Enter present value, interest rate, and time period to project how much your money will grow. Free online FV calculator.",
  keywords: [
    "future value calculator",
    "future value of investment",
    "FV calculator",
    "compound interest future value",
    "time value of money",
    "investment growth calculator",
    "future value formula",
    "future value of annuity",
    "money growth projection",
    "investment projection calculator",
  ],
  openGraph: {
    title: "Future Value Calculator — Project Investment Growth | SoftZaR",
    description:
      "Calculate how much your investments will be worth in the future with compound interest.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Value Calculator | SoftZaR",
    description: "Project investment growth with compound interest. Free and instant.",
  },
  alternates: {
    canonical: "https://softzar.com/future-value-calculator/",
  },
};

export default function FutureValueCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
