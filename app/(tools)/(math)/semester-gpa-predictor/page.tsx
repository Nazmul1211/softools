"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

interface PredictorResult {
  projectedCumulativeGpa: number;
  requiredSemesterGpa: number;
  gpaGap: number;
  feasibility: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does this semester GPA predictor work?",
    answer:
      "It combines your current cumulative quality points with expected semester quality points, then divides by total credits. It also computes the required semester GPA to reach a target cumulative GPA.",
  },
  {
    question: "Can required semester GPA be above 4.0?",
    answer:
      "Yes. If the required value exceeds 4.0, your target is not reachable in one semester under a standard 4.0 scale.",
  },
  {
    question: "Is this official transcript GPA?",
    answer:
      "No. This is a planning estimate. Official GPA may differ based on institutional rules for repeats, withdrawals, and grade replacement.",
  },
];

function getFeasibility(requiredSemesterGpa: number): string {
  if (requiredSemesterGpa <= 0) return "Target already secured";
  if (requiredSemesterGpa <= 3.5) return "Achievable with steady performance";
  if (requiredSemesterGpa <= 4.0) return "Aggressive but achievable";
  return "Not achievable in one semester (4.0 scale)";
}

export default function SemesterGPAPredictorPage() {
  const [currentCumulativeGpa, setCurrentCumulativeGpa] = useState("3.20");
  const [completedCredits, setCompletedCredits] = useState("45");
  const [plannedSemesterCredits, setPlannedSemesterCredits] = useState("15");
  const [expectedSemesterGpa, setExpectedSemesterGpa] = useState("3.50");
  const [targetCumulativeGpa, setTargetCumulativeGpa] = useState("3.40");

  const result = useMemo<PredictorResult | null>(() => {
    const current = Number.parseFloat(currentCumulativeGpa);
    const priorCredits = Number.parseFloat(completedCredits);
    const semesterCredits = Number.parseFloat(plannedSemesterCredits);
    const expectedTerm = Number.parseFloat(expectedSemesterGpa);
    const target = Number.parseFloat(targetCumulativeGpa);

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(priorCredits) ||
      !Number.isFinite(semesterCredits) ||
      !Number.isFinite(expectedTerm) ||
      !Number.isFinite(target) ||
      priorCredits < 0 ||
      semesterCredits <= 0
    ) {
      return null;
    }

    const currentQualityPoints = current * priorCredits;
    const expectedSemesterQualityPoints = expectedTerm * semesterCredits;
    const totalCreditsAfterSemester = priorCredits + semesterCredits;

    const projectedCumulativeGpa =
      totalCreditsAfterSemester > 0
        ? (currentQualityPoints + expectedSemesterQualityPoints) /
          totalCreditsAfterSemester
        : 0;

    const requiredSemesterGpa =
      semesterCredits > 0
        ? (target * totalCreditsAfterSemester - currentQualityPoints) /
          semesterCredits
        : 0;

    const gpaGap = target - projectedCumulativeGpa;

    return {
      projectedCumulativeGpa,
      requiredSemesterGpa,
      gpaGap,
      feasibility: getFeasibility(requiredSemesterGpa),
    };
  }, [
    currentCumulativeGpa,
    completedCredits,
    plannedSemesterCredits,
    expectedSemesterGpa,
    targetCumulativeGpa,
  ]);

  return (
    <ToolLayout
      title="Semester GPA Predictor"
      slug="semester-gpa-predictor"
      description="Forecast your cumulative GPA after this semester and calculate the semester GPA required for your target."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter current profile",
          text: "Add your current cumulative GPA and completed credits.",
        },
        {
          name: "Set semester plan",
          text: "Input planned semester credits and expected semester GPA.",
        },
        {
          name: "Set target cumulative GPA",
          text: "Add your desired post-semester cumulative GPA.",
        },
        {
          name: "Review projection and required GPA",
          text: "Compare projected outcome with required semester GPA feasibility.",
        },
      ]}
      relatedTools={[
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "Cumulative GPA Calculator", href: "/cumulative-gpa-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Weighted Grade Calculator", href: "/weighted-grade-calculator/" },
      ]}
      content={
        <>
          <h2>What this predictor solves</h2>
          <p>
            This tool helps you answer two planning questions before finals: what
            your cumulative GPA may become, and what semester GPA you need to
            hit a specific target. It is ideal for scholarship planning, honors
            eligibility checks, and graduation goal tracking.
          </p>

          <h2>Core formulas</h2>
          <p>
            <strong>
              Projected Cumulative GPA = (Current GPA x Completed Credits + Expected Semester GPA x Semester Credits) / (Completed Credits + Semester Credits)
            </strong>
          </p>
          <p>
            <strong>
              Required Semester GPA = (Target Cumulative GPA x Total Credits After Semester - Current Quality Points) / Semester Credits
            </strong>
          </p>

          <p>
            If you want to build expected semester GPA from individual courses,
            start with the{" "}
            <Link
              href="/semester-grade-calculator/"
              className="text-primary hover:underline"
            >
              Semester Grade Calculator
            </Link>
            .
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Current Cumulative GPA"
            type="number"
            inputMode="decimal"
            min={0}
            max={4}
            step="0.01"
            value={currentCumulativeGpa}
            onChange={(event) => setCurrentCumulativeGpa(event.target.value)}
          />
          <Input
            label="Completed Credits"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={completedCredits}
            onChange={(event) => setCompletedCredits(event.target.value)}
          />
          <Input
            label="Planned Semester Credits"
            type="number"
            inputMode="decimal"
            min={0.5}
            step="0.5"
            value={plannedSemesterCredits}
            onChange={(event) => setPlannedSemesterCredits(event.target.value)}
          />
          <Input
            label="Expected Semester GPA"
            type="number"
            inputMode="decimal"
            min={0}
            max={4}
            step="0.01"
            value={expectedSemesterGpa}
            onChange={(event) => setExpectedSemesterGpa(event.target.value)}
          />
          <Input
            label="Target Cumulative GPA"
            type="number"
            inputMode="decimal"
            min={0}
            max={4}
            step="0.01"
            value={targetCumulativeGpa}
            onChange={(event) => setTargetCumulativeGpa(event.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Projected Cumulative GPA"
              value={result.projectedCumulativeGpa.toFixed(2)}
              highlight
            />
            <ResultCard
              label="Required Semester GPA"
              value={result.requiredSemesterGpa.toFixed(2)}
              subValue={result.feasibility}
            />
            <ResultCard
              label="Target Gap"
              value={
                result.gpaGap > 0
                  ? `${result.gpaGap.toFixed(2)} below target`
                  : `${Math.abs(result.gpaGap).toFixed(2)} above target`
              }
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to predict semester and cumulative GPA outcomes.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
