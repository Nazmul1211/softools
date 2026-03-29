import { Metadata } from "next";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "High School GPA Calculator",
  description:
    "Calculate your weighted and unweighted high school GPA. Supports Regular, Honors, and AP/IB course types on the 4.0 and 5.0 scales.",
  slug: "high-school-gpa-calculator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
