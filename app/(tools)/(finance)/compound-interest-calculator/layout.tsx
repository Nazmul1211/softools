import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description:
    "See how your money grows over time with compound interest. Enter your initial investment, interest rate, compounding frequency, and monthly contributions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
