import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description:
    "See how your money grows over time with compound interest. Enter your initial investment, interest rate, compounding frequency, and monthly contributions.",
  alternates: {
    canonical: "https://softzar.com/compound-interest-calculator/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
