import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cumulative GPA Calculator",
  description:
    "Combine multiple semesters to calculate your overall cumulative GPA. Enter each semester's GPA and credit hours for an accurate weighted average.",
  alternates: {
    canonical: "https://softzar.com/cumulative-gpa-calculator/",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
