"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Target, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";

interface FinalGradeResult {
  requiredFinal: number;
  projectedCourseGrade: number;
  neededDelta: number;
  difficultyBand: "comfortable" | "stretch" | "high-risk";
}

const faqs: FAQItem[] = [
  {
    question: "What score do I need on my final to get an A in the class?",
    answer:
      "Use your current class average, your final exam weight, and your target course grade. The core formula is: Required Final = (Target - Current × (1 - Final Weight)) / Final Weight. For example, if your current grade is 87%, your final is 30%, and you want 90%, you need about 97%. This calculator runs that math instantly and shows whether the target is realistic.",
  },
  {
    question: "Why does final exam weight change the required score so much?",
    answer:
      "Final weight determines how much influence the exam has on your overall grade. A final worth 15% has limited impact, so raising your course grade is harder late in the term. A final worth 40% can move your course average much more. This is why two students with the same current grade can need very different final scores depending on course policy.",
  },
  {
    question: "What if the calculator says I need more than 100%?",
    answer:
      "A required score above 100% means the target is mathematically unreachable under the current weighting system. It does not mean failure; it means you should set a revised target and optimize for the highest possible score. You can also review whether extra credit, dropped assignments, or grading policy adjustments are allowed by your instructor.",
  },
  {
    question: "Can this help if I only want to pass the class?",
    answer:
      "Yes. Replace your target with the minimum passing grade used by your school, such as 60%, 65%, or 70%. The calculator then gives the minimum final score needed for a pass outcome. This is useful for risk management when balancing multiple classes, part-time work, or exam-heavy weeks near the end of term.",
  },
  {
    question: "Should I rely on this calculator if my class drops low scores?",
    answer:
      "Use it as a planning baseline first, then adjust for your syllabus rules. Policies such as dropped quizzes, curved grading, attendance bonuses, and extra credit can materially change final outcomes. If your instructor publishes a weighted gradebook with category overrides, prioritize those official rules and use this tool to model best-case and conservative scenarios.",
  },
  {
    question: "How accurate is final grade prediction when I have an expected exam score?",
    answer:
      "Prediction is accurate if your expected exam score is realistic and your course weights are correct. The model is deterministic: Projected Course Grade = Current × (1 - Final Weight) + Expected Final × Final Weight. Most real-world variance comes from wrong assumptions, not math. Update inputs as you complete practice tests for a more reliable estimate.",
  },
];

function getDifficultyBand(requiredFinal: number): FinalGradeResult["difficultyBand"] {
  if (requiredFinal <= 80) return "comfortable";
  if (requiredFinal <= 95) return "stretch";
  return "high-risk";
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export default function FinalGradeCalculatorPage() {
  const [currentGrade, setCurrentGrade] = useState("84");
  const [targetGrade, setTargetGrade] = useState("90");
  const [finalWeight, setFinalWeight] = useState("30");
  const [expectedFinalScore, setExpectedFinalScore] = useState("88");

  const result = useMemo<FinalGradeResult | null>(() => {
    const current = Number.parseFloat(currentGrade);
    const target = Number.parseFloat(targetGrade);
    const weightPercent = Number.parseFloat(finalWeight);
    const expected = Number.parseFloat(expectedFinalScore);

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(target) ||
      !Number.isFinite(weightPercent) ||
      !Number.isFinite(expected) ||
      weightPercent <= 0 ||
      weightPercent > 100
    ) {
      return null;
    }

    const finalWeightDecimal = weightPercent / 100;
    const courseworkWeight = 1 - finalWeightDecimal;
    const requiredFinal = (target - current * courseworkWeight) / finalWeightDecimal;
    const projectedCourseGrade = current * courseworkWeight + expected * finalWeightDecimal;
    const neededDelta = projectedCourseGrade - target;

    return {
      requiredFinal,
      projectedCourseGrade,
      neededDelta,
      difficultyBand: getDifficultyBand(requiredFinal),
    };
  }, [currentGrade, targetGrade, finalWeight, expectedFinalScore]);

  const difficultyText =
    result?.difficultyBand === "comfortable"
      ? "Comfortable target"
      : result?.difficultyBand === "stretch"
      ? "Stretch target"
      : "High-risk target";

  return (
    <ToolLayout
      title="Final Grade Calculator"
      slug="final-grade-calculator"
      description="Calculate the exact score you need on your final exam to hit your target course grade, then compare it with your expected performance."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your current class grade",
          text: "Use your latest weighted course average from the syllabus gradebook.",
        },
        {
          name: "Set your final exam weight",
          text: "Input the percentage of your course grade assigned to the final exam.",
        },
        {
          name: "Choose your target course grade",
          text: "Set the final grade you want, such as A, B, or minimum passing mark.",
        },
        {
          name: "Review required score and projection",
          text: "Compare required final score against your expected exam score to assess risk.",
        },
      ]}
      relatedTools={[
        { name: "Weighted Grade Calculator", href: "/weighted-grade-calculator/" },
        { name: "Grade Calculator", href: "/grade-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "College GPA Calculator", href: "/college-gpa-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
      ]}
      content={
        <>
          <h2>What this final grade calculator does</h2>
          <p>
            This calculator answers one of the most common end-of-term questions: <strong>what do I need on my final exam?</strong>
            It combines your current course grade, final exam weight, and target grade to compute the exact score required.
            It also projects your ending course grade based on an expected final exam score. That means you can use it for
            both target planning and risk planning without manually rebuilding formulas in a spreadsheet.
          </p>

          <h2>How final grade math works</h2>
          <p>
            Most courses use weighted grading. Your current grade contributes only the non-final portion of the course, while
            the final exam contributes the remaining percentage. The core formula is:
          </p>
          <p>
            <strong>Required Final = (Target - Current x (1 - Final Weight)) / Final Weight</strong>
          </p>
          <p>
            Where Final Weight is entered as a decimal (30% = 0.30). A separate projection formula estimates your final course
            outcome from your expected exam score:
          </p>
          <p>
            <strong>Projected Course Grade = Current x (1 - Final Weight) + Expected Final x Final Weight</strong>
          </p>

          <h3>Worked example</h3>
          <p>
            Suppose your current class average is 84%, your final exam is worth 30%, and your goal is 90% overall.
            Coursework contributes 84 x 0.70 = 58.8 points. To finish at 90, you still need 31.2 points from the final.
            Divide by exam weight (0.30), and the required final exam score is <strong>104%</strong>. That is above the
            normal maximum, so this target is mathematically out of reach without extra credit or policy adjustments.
          </p>

          <h2>Understanding your result and next action</h2>
          <p>
            If your required final score is under 80%, you are usually in a manageable range with disciplined review.
            Between 80% and 95%, the target is still possible but typically demands targeted practice and fewer execution errors.
            Above 95%, treat the scenario as high risk and switch to an optimization strategy: maximize score gain where your
            improvement is fastest, and align expectations to realistic grade bands. For recovery planning, compare this output
            with the{" "}
            <Link href="/weighted-grade-calculator/" className="text-primary hover:underline">
              Weighted Grade Calculator
            </Link>
            {" "}to see which category-level improvements matter most.
          </p>

          <h2>Key factors that change required final score</h2>
          <ul>
            <li><strong>Final exam weight:</strong> Higher weight gives the exam more power to change your course grade.</li>
            <li><strong>Current grade accuracy:</strong> A small input error can materially change the required score.</li>
            <li><strong>Target selection:</strong> Moving from 89 to 90 can push the required score sharply upward.</li>
            <li><strong>Course policy:</strong> Curves, extra credit, and dropped assignments can shift real outcomes.</li>
          </ul>

          <h2>Quick benchmark table</h2>
          <table>
            <thead>
              <tr>
                <th>Required Final Score</th>
                <th>Interpretation</th>
                <th>Suggested Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0% to 80%</td>
                <td>Comfortable</td>
                <td>Maintain consistency and avoid careless mistakes.</td>
              </tr>
              <tr>
                <td>80% to 95%</td>
                <td>Stretch</td>
                <td>Focus on high-yield topics and timed practice.</td>
              </tr>
              <tr>
                <td>95% to 100%</td>
                <td>Very difficult</td>
                <td>Prioritize precision and ask instructor about policy details.</td>
              </tr>
              <tr>
                <td>Above 100%</td>
                <td>Unreachable (standard scale)</td>
                <td>Set revised target or explore extra-credit opportunities.</td>
              </tr>
            </tbody>
          </table>

          <h2>Common planning mistakes to avoid</h2>
          <ul>
            <li>Using unweighted course average when the class uses category weighting.</li>
            <li>Ignoring syllabus rules for dropped assignments or replacement exams.</li>
            <li>Setting an unrealistic expected exam score without timed mock tests.</li>
            <li>Assuming a curve will apply when no official curve policy exists.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>University of California grading guidance and weighted average policies.</li>
            <li>Purdue University academic success resources on exam-weighted grading math.</li>
            <li>Khan Academy: weighted averages and linear equations for grade planning.</li>
            <li>ACT student study planning framework for target-score preparation.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, title: "Target-Based", sub: "Set grade goal first" },
            { icon: GraduationCap, title: "Exam Weight Aware", sub: "Syllabus-weighted math" },
            { icon: TrendingUp, title: "Projection Ready", sub: "Compare expected performance" },
            { icon: AlertTriangle, title: "Risk Signal", sub: "See feasibility instantly" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Current Course Grade"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="0.01"
            value={currentGrade}
            onChange={(event) => setCurrentGrade(event.target.value)}
            suffix="%"
          />
          <Input
            label="Target Course Grade"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="0.01"
            value={targetGrade}
            onChange={(event) => setTargetGrade(event.target.value)}
            suffix="%"
          />
          <Input
            label="Final Exam Weight"
            type="number"
            inputMode="decimal"
            min={0.01}
            max={100}
            step="0.01"
            value={finalWeight}
            onChange={(event) => setFinalWeight(event.target.value)}
            suffix="%"
          />
          <Input
            label="Expected Final Exam Score"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="0.01"
            value={expectedFinalScore}
            onChange={(event) => setExpectedFinalScore(event.target.value)}
            suffix="%"
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Required Final Exam Score"
                value={formatPercent(result.requiredFinal)}
                highlight
              />
              <ResultCard
                label="Projected Course Grade"
                value={formatPercent(result.projectedCourseGrade)}
              />
              <ResultCard
                label="Projected vs Target"
                value={result.neededDelta >= 0 ? `+${formatPercent(result.neededDelta)}` : formatPercent(result.neededDelta)}
              />
              <ResultCard label="Difficulty Band" value={difficultyText ?? "—"} />
            </ResultsGrid>

            {result.requiredFinal > 100 && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                Your target currently needs more than 100% on the final exam. That is typically unreachable on a standard scale.
                Consider lowering your target or checking whether extra credit and policy adjustments are available.
              </p>
            )}
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid numeric values to calculate your required final exam score.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
