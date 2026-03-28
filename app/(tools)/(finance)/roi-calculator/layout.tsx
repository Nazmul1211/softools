import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI Calculator",
  description:
    "Calculate your Return on Investment (ROI) to evaluate any investment's profitability. Get basic ROI, annualized ROI, and net profit instantly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
