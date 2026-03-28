import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Savings Goal Calculator",
  description:
    "Find out exactly how much you need to save each month to reach your financial goal. Factor in current savings, interest rate, and timeline.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
