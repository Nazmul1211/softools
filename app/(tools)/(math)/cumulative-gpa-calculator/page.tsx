"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Plus, Trash2 } from "lucide-react";

interface Semester {
  id: number;
  label: string;
  gpa: string;
  credits: string;
}

let nextId = 1;

function createSemester(label: string): Semester {
  return { id: nextId++, label, gpa: "", credits: "" };
}

export default function CumulativeGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>(() => [
    createSemester("Semester 1"),
    createSemester("Semester 2"),
    createSemester("Semester 3"),
    createSemester("Semester 4"),
  ]);
  const [cumulativeGpa, setCumulativeGpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);

  const calculate = useCallback(() => {
    let totalPoints = 0;
    let totalCreds = 0;

    for (const s of semesters) {
      const gpa = parseFloat(s.gpa);
      const creds = parseFloat(s.credits);
      if (isNaN(gpa) || isNaN(creds) || creds <= 0) continue;
      totalPoints += gpa * creds;
      totalCreds += creds;
    }

    if (totalCreds === 0) {
      setCumulativeGpa(null);
      setTotalCredits(0);
      return;
    }

    setCumulativeGpa(totalPoints / totalCreds);
    setTotalCredits(totalCreds);
  }, [semesters]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const updateSemester = (
    id: number,
    field: keyof Semester,
    value: string
  ) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addSemester = () =>
    setSemesters((prev) => [
      ...prev,
      createSemester(`Semester ${prev.length + 1}`),
    ]);

  const removeSemester = (id: number) => {
    if (semesters.length <= 1) return;
    setSemesters((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ToolLayout
      title="Cumulative GPA Calculator"
      description="Combine multiple semesters or terms to calculate your overall cumulative GPA. Enter each semester's GPA and credit hours to get your weighted cumulative average."
      category={{ name: "Math Calculators", slug: "math" }}
      relatedTools={[
        { name: "College GPA Calculator", href: "/college-gpa-calculator" },
        { name: "High School GPA Calculator", href: "/high-school-gpa-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      content={
        <>
          <h2>What is Cumulative GPA?</h2>
          <p>
            While a semester GPA measures your performance during a single term, your <strong>cumulative GPA</strong> is the weighted average of all your semester GPAs across your entire academic career. It represents your overall standing and is the number that appears on your official transcript when you graduate. Employers, graduate schools, and scholarship committees almost always evaluate your cumulative GPA rather than any individual semester&apos;s performance.
          </p>

          <h2>How is Cumulative GPA Calculated?</h2>
          <p>
            Cumulative GPA is calculated by weighting each semester&apos;s GPA by the number of credit hours taken during that term. The formula is:
          </p>
          <p>
            <strong>Cumulative GPA = Σ(Semester GPA × Semester Credits) / Σ(Total Credits)</strong>
          </p>
          <p>
            This ensures that semesters where you took more courses have a proportionally greater impact on your overall average. For example, a semester where you took 18 credit hours counts three times more heavily than a summer session of 6 credit hours.
          </p>

          <h3>Step-by-Step Example</h3>
          <p>
            Suppose you completed four semesters: Fall Year 1 (GPA 3.5, 15 credits), Spring Year 1 (GPA 3.2, 16 credits), Fall Year 2 (GPA 3.8, 15 credits), and Spring Year 2 (GPA 3.6, 14 credits). Your total quality points are: (3.5 × 15) + (3.2 × 16) + (3.8 × 15) + (3.6 × 14) = 52.5 + 51.2 + 57.0 + 50.4 = 211.1. Your total credits are 15 + 16 + 15 + 14 = 60. Therefore, your cumulative GPA = 211.1 / 60 = <strong>3.52</strong>.
          </p>

          <h2>Why Does Cumulative GPA Matter?</h2>
          <ul>
            <li><strong>Graduate school admissions:</strong> Most graduate programs have a minimum cumulative GPA requirement, typically between 3.0 and 3.5, depending on the program&apos;s competitiveness.</li>
            <li><strong>Scholarships and financial aid:</strong> Many scholarships require you to maintain a minimum cumulative GPA (often 3.0 or higher) to retain funding.</li>
            <li><strong>Honors and Dean&apos;s List:</strong> These designations are awarded based on cumulative or semester GPA thresholds (e.g., 3.5 for Dean&apos;s List, 3.9 for summa cum laude).</li>
            <li><strong>Employment:</strong> Some employers screen entry-level candidates by cumulative GPA, especially in finance, consulting, and engineering.</li>
          </ul>

          <h2>Strategies to Raise a Low Cumulative GPA</h2>
          <ul>
            <li><strong>Take strategic course loads:</strong> A heavier semester with strong grades impacts your cumulative GPA more than a light semester due to the credit-hour weighting.</li>
            <li><strong>Retake courses strategically:</strong> If your school has a grade replacement policy, retaking courses where you received D&apos;s or F&apos;s can significantly boost your cumulative average.</li>
            <li><strong>Maintain consistency in later semesters:</strong> As you accumulate more credits, each semester has diminishing impact on your total. However, consistently strong performance in junior and senior year demonstrates an upward trend that graduate schools value.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>Can my cumulative GPA go down with more credits?</h3>
          <p>
            Yes. If you earn a semester GPA that is lower than your current cumulative GPA, your cumulative GPA will decrease. The larger the credit load of the weak semester, the greater the negative impact.
          </p>

          <h3>Is cumulative GPA the same as overall GPA?</h3>
          <p>
            Yes. The terms &quot;cumulative GPA&quot; and &quot;overall GPA&quot; are used interchangeably. Both refer to the credit-weighted average of all semesters completed.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Semester Rows */}
        <div className="space-y-4">
          <div className="hidden sm:grid sm:grid-cols-[1fr_120px_120px_40px] sm:gap-3 sm:text-sm sm:font-medium sm:text-muted-foreground">
            <span>Semester / Term</span>
            <span>GPA</span>
            <span>Credits</span>
            <span />
          </div>

          {semesters.map((sem) => (
            <div
              key={sem.id}
              className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_120px_120px_40px] sm:items-end sm:border-none sm:bg-transparent sm:p-0"
            >
              <Input
                placeholder="e.g. Fall 2024"
                value={sem.label}
                onChange={(e) =>
                  updateSemester(sem.id, "label", e.target.value)
                }
              />
              <Input
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.50"
                value={sem.gpa}
                onChange={(e) => updateSemester(sem.id, "gpa", e.target.value)}
              />
              <Input
                type="number"
                placeholder="15"
                value={sem.credits}
                onChange={(e) =>
                  updateSemester(sem.id, "credits", e.target.value)
                }
                suffix="cr"
              />
              <button
                onClick={() => removeSemester(sem.id)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 sm:h-auto sm:w-auto"
                title="Remove semester"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={addSemester}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Semester
        </Button>

        {/* Results */}
        {cumulativeGpa !== null && (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Cumulative GPA"
              value={cumulativeGpa.toFixed(2)}
              highlight
            />
            <ResultCard
              label="Total Credits Earned"
              value={totalCredits}
              unit="cr"
            />
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
