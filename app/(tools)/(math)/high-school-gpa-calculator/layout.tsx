import { Metadata } from "next";

export const metadata: Metadata = {
  title: "High School GPA Calculator",
  description:
    "Calculate your weighted and unweighted high school GPA. Supports Regular, Honors, and AP/IB course types on the 4.0 and 5.0 scales.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
