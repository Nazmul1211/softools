import { Metadata } from "next";

export const metadata: Metadata = {
  title: "College GPA Calculator",
  description:
    "Calculate your college GPA by entering courses, credit hours, and letter grades. Instantly see your weighted GPA on the standard 4.0 scale used by US colleges and universities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
