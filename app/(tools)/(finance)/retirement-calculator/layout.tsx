import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retirement Calculator - Plan Your Financial Future",
  description:
    "Calculate how much you need to save for retirement. See projected savings, retirement income, and create a personalized retirement plan with our free calculator.",
  keywords: [
    "retirement calculator",
    "retirement planning",
    "retirement savings",
    "401k calculator",
    "retirement income",
    "when can I retire",
    "retirement fund",
    "pension calculator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
