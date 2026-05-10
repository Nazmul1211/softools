"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { BookOpenText, GraduationCap, Plus, Target, TrendingUp, Trash2 } from "lucide-react";

interface CourseRow {
  id: string;
  name: string;
  credits: string;
  grade: string;
}

interface SemesterResult {
  totalCredits: number;
  totalQualityPoints: number;
  semesterGpa: number;
  projectedCumulativeGpa: number | null;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

const gradeOptions = Object.keys(gradePoints).map((grade) => ({ value: grade, label: grade }));

const faqs: FAQItem[] = [
  {
    question: "How do I calculate semester GPA from credits and letter grades?",
    answer:
      "Convert each letter grade to grade points, multiply by course credits, sum all quality points, then divide by total attempted credits. Example: a 4-credit A (16 points) and a 3-credit B+ (9.9 points) gives 25.9 quality points over 7 credits, so GPA is 3.70. This calculator automates the full credit-weighted process.",
  },
  {
    question: "What are quality points in GPA calculation?",
    answer:
      "Quality points are the weighted value of each course grade: Grade Points x Credit Hours. They are the backbone of semester and cumulative GPA math. Because credits scale quality points, high-credit classes affect GPA more than low-credit electives. Tracking quality points helps you understand which courses have the largest GPA impact.",
  },
  {
    question: "Can this estimate my cumulative GPA after this semester?",
    answer:
      "Yes. Enter your prior cumulative GPA and previously completed credits, and the calculator projects your updated cumulative GPA using combined quality points. The formula is: New Cumulative GPA = (Prior GPA x Prior Credits + Semester GPA x Semester Credits) / (Prior Credits + Semester Credits). This helps plan outcomes before final grades post.",
  },
  {
    question: "Why does one low grade in a 4-credit class hurt more?",
    answer:
      "GPA is credit-weighted, so a 4-credit class carries more quality-point weight than a 1-credit seminar. A grade drop in a high-credit course changes your average more because it contributes a larger share of total quality points. This is why strategic effort allocation by credit load can improve GPA outcomes efficiently.",
  },
  {
    question: "What GPA is usually needed for Dean's List?",
    answer:
      "Dean's List thresholds vary by institution, but many colleges use 3.5 or higher with a minimum full-time credit load. Some schools require no grade below a specific letter threshold. Always verify policy on your registrar site. This calculator helps you test whether your projected semester and cumulative GPA align with those requirements.",
  },
  {
    question: "Do pass/fail classes affect semester GPA?",
    answer:
      "Usually pass/fail classes do not contribute grade points to GPA, though they may count toward attempted or earned credits depending on policy. Because institutions differ, this calculator assumes standard letter-grade courses only. For mixed grading systems, include only GPA-bearing classes and confirm final treatment with your academic advisor or registrar.",
  },
];

function createCourse(id: string, name: string, credits: string, grade: string): CourseRow {
  return { id, name, credits, grade };
}

function getStanding(gpa: number): string {
  if (gpa >= 3.8) return "Highest Honors Range";
  if (gpa >= 3.5) return "Dean's List Range";
  if (gpa >= 3.0) return "Good Academic Standing";
  if (gpa >= 2.0) return "Satisfactory / Watchlist";
  return "At-Risk Standing";
}

export default function SemesterGradeCalculatorPage() {
  const [courses, setCourses] = useState<CourseRow[]>([
    createCourse("1", "Calculus II", "4", "A-"),
    createCourse("2", "Physics I", "4", "B+"),
    createCourse("3", "Composition", "3", "A"),
    createCourse("4", "Programming", "3", "B"),
  ]);

  const [previousCumulativeGpa, setPreviousCumulativeGpa] = useState("3.20");
  const [previousCredits, setPreviousCredits] = useState("45");

  const result = useMemo<SemesterResult | null>(() => {
    const validRows = courses
      .map((row) => ({
        credits: Number.parseFloat(row.credits),
        gradePoints: gradePoints[row.grade],
      }))
      .filter((row) => Number.isFinite(row.credits) && row.credits > 0 && Number.isFinite(row.gradePoints));

    if (validRows.length === 0) return null;

    const totalCredits = validRows.reduce((sum, row) => sum + row.credits, 0);
    if (totalCredits <= 0) return null;

    const totalQualityPoints = validRows.reduce(
      (sum, row) => sum + row.credits * row.gradePoints,
      0
    );
    const semesterGpa = totalQualityPoints / totalCredits;

    const prevGpa = Number.parseFloat(previousCumulativeGpa);
    const prevCredits = Number.parseFloat(previousCredits);
    let projectedCumulativeGpa: number | null = null;

    if (Number.isFinite(prevGpa) && Number.isFinite(prevCredits) && prevCredits >= 0) {
      const previousQualityPoints = prevGpa * prevCredits;
      const combinedCredits = prevCredits + totalCredits;
      projectedCumulativeGpa =
        combinedCredits > 0
          ? (previousQualityPoints + totalQualityPoints) / combinedCredits
          : null;
    }

    return {
      totalCredits,
      totalQualityPoints,
      semesterGpa,
      projectedCumulativeGpa,
    };
  }, [courses, previousCumulativeGpa, previousCredits]);

  const updateCourse = (id: string, field: keyof CourseRow, value: string) => {
    setCourses((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      createCourse(`${Date.now()}`, `Course ${prev.length + 1}`, "3", "B"),
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <ToolLayout
      title="Semester Grade Calculator"
      slug="semester-grade-calculator"
      description="Calculate your semester GPA from credit-weighted course grades and project your updated cumulative GPA."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Add semester courses",
          text: "Enter each course with credit hours and expected or earned letter grade.",
        },
        {
          name: "Review semester GPA",
          text: "Check credit-weighted GPA, total quality points, and standing band.",
        },
        {
          name: "Add prior cumulative profile",
          text: "Input previous cumulative GPA and credits completed before this semester.",
        },
        {
          name: "Project updated cumulative GPA",
          text: "Use projected cumulative result to plan honors, scholarship, and progression targets.",
        },
      ]}
      relatedTools={[
        { name: "College GPA Calculator", href: "/college-gpa-calculator/" },
        { name: "Cumulative GPA Calculator", href: "/cumulative-gpa-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Weighted Grade Calculator", href: "/weighted-grade-calculator/" },
        { name: "Grade Calculator", href: "/grade-calculator/" },
      ]}
      content={
        <>
          <h2>What this semester grade calculator does</h2>
          <p>
            This calculator converts your course-by-course semester performance into GPA metrics you can act on.
            It computes total quality points, semester GPA, and projected cumulative GPA using prior academic history.
            That makes it useful for term planning, scholarship checks, Dean&apos;s List targeting, and graduation progress
            forecasting before official grade posting.
          </p>

          <h2>Semester GPA formula and worked example</h2>
          <p>
            Semester GPA uses credit-weighted grade points:
          </p>
          <p>
            <strong>Semester GPA = Sum(Credit Hours x Grade Points) / Sum(Credit Hours)</strong>
          </p>
          <p>
            Example: 4-credit A- (14.8), 4-credit B+ (13.2), 3-credit A (12), 3-credit B (9).
            Total quality points = 49.0 across 14 credits, so semester GPA = 49.0 / 14 =
            <strong> 3.50</strong>.
          </p>

          <h3>Projected cumulative GPA formula</h3>
          <p>
            If you already have prior credits, cumulative projection is:
          </p>
          <p>
            <strong>
              New Cumulative GPA = (Prior GPA x Prior Credits + Semester GPA x Semester Credits) / (Prior Credits + Semester Credits)
            </strong>
          </p>

          <h2>How to interpret your semester and cumulative results</h2>
          <p>
            Semester GPA reflects short-term academic execution, while cumulative GPA reflects long-term consistency.
            A strong semester can lift cumulative average gradually, especially when prior credit volume is large.
            If your cumulative target is aggressive, prioritize high-credit courses where grade improvements produce the
            biggest quality-point gains. For exam-level recovery inside a course, use the{" "}
            <Link href="/final-grade-calculator/" className="text-primary hover:underline">
              Final Grade Calculator
            </Link>
            .
          </p>

          <h2>Academic planning benchmarks</h2>
          <table>
            <thead>
              <tr>
                <th>GPA Band</th>
                <th>Typical Interpretation</th>
                <th>Planning Focus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3.8 to 4.0</td>
                <td>Highest honors trajectory</td>
                <td>Maintain consistency and protect high-credit classes.</td>
              </tr>
              <tr>
                <td>3.5 to 3.79</td>
                <td>Dean&apos;s List level (many schools)</td>
                <td>Stabilize B+ to A- conversions in core courses.</td>
              </tr>
              <tr>
                <td>3.0 to 3.49</td>
                <td>Good academic standing</td>
                <td>Reduce variance and avoid low-grade outliers.</td>
              </tr>
              <tr>
                <td>2.0 to 2.99</td>
                <td>Satisfactory but vulnerable</td>
                <td>Use early intervention and tutoring in high-credit courses.</td>
              </tr>
              <tr>
                <td>Below 2.0</td>
                <td>Academic risk zone</td>
                <td>Work with advisor on recovery and course-load strategy.</td>
              </tr>
            </tbody>
          </table>

          <h2>Common semester GPA planning mistakes</h2>
          <ul>
            <li>Tracking only average letter grades without credit weighting.</li>
            <li>Ignoring the compounded effect of low grades in 4-credit core classes.</li>
            <li>Assuming one strong semester will fully offset many low-credit prior terms.</li>
            <li>Confusing semester GPA with official cumulative GPA on transcript.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>University registrar documentation on GPA and quality-point calculation.</li>
            <li>American Association of Collegiate Registrars and Admissions Officers resources.</li>
            <li>Institutional honors and Dean&apos;s List eligibility policy examples.</li>
            <li>Khan Academy weighted average and grade-point modeling fundamentals.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, title: "Semester GPA", sub: "Credit-weighted result" },
            { icon: BookOpenText, title: "Quality Points", sub: "Course impact visibility" },
            { icon: TrendingUp, title: "Cumulative Forecast", sub: "Long-term projection" },
            { icon: Target, title: "Standing Signal", sub: "Interpretation band" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {courses.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_120px_120px_48px] sm:items-end sm:border-none sm:bg-transparent sm:p-0">
              <Input
                label={index === 0 ? "Course" : undefined}
                value={row.name}
                onChange={(event) => updateCourse(row.id, "name", event.target.value)}
              />
              <Input
                label={index === 0 ? "Credits" : undefined}
                type="number"
                inputMode="decimal"
                min={0.5}
                max={10}
                step="0.5"
                value={row.credits}
                onChange={(event) => updateCourse(row.id, "credits", event.target.value)}
              />
              <Select
                label={index === 0 ? "Grade" : undefined}
                options={gradeOptions}
                value={row.grade}
                onChange={(event) => updateCourse(row.id, "grade", event.target.value)}
              />
              <button
                onClick={() => removeCourse(row.id)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                aria-label={`Remove ${row.name || "course"}`}
                disabled={courses.length <= 1}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <Button onClick={addCourse} variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Course
        </Button>

        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <h2 className="text-base font-semibold text-foreground">Previous Academic Record (Optional)</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Input
              label="Previous Cumulative GPA"
              type="number"
              inputMode="decimal"
              min={0}
              max={4}
              step="0.01"
              value={previousCumulativeGpa}
              onChange={(event) => setPreviousCumulativeGpa(event.target.value)}
            />
            <Input
              label="Previous Completed Credits"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.5"
              value={previousCredits}
              onChange={(event) => setPreviousCredits(event.target.value)}
            />
          </div>
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Semester GPA"
              value={result.semesterGpa.toFixed(2)}
              subValue={getStanding(result.semesterGpa)}
              highlight
            />
            <ResultCard label="Semester Credits" value={result.totalCredits.toFixed(1)} />
            <ResultCard label="Quality Points" value={result.totalQualityPoints.toFixed(2)} />
            <ResultCard
              label="Projected Cumulative GPA"
              value={result.projectedCumulativeGpa === null ? "—" : result.projectedCumulativeGpa.toFixed(2)}
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter at least one valid GPA-bearing course to calculate your semester result.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
