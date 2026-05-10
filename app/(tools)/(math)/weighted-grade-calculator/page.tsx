"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { BarChart3, PieChart, Plus, Target, Trash2 } from "lucide-react";

interface GradeCategory {
  id: string;
  name: string;
  score: string;
  weight: string;
}

interface WeightedResult {
  weightedGrade: number;
  totalWeight: number;
  missingWeight: number;
  neededOnRemaining: number | null;
}

const faqs: FAQItem[] = [
  {
    question: "How do I calculate a weighted grade correctly?",
    answer:
      "Multiply each category score by its category weight, add all weighted contributions, then divide by total assigned weight. Example: Homework 92% at 20%, Quizzes 84% at 30%, Exams 88% at 50% gives (92x20 + 84x30 + 88x50) / 100 = 87.6%. If weights do not sum to 100 yet, divide by assigned weight to get your current standing.",
  },
  {
    question: "What if my category weights do not add up to 100% yet?",
    answer:
      "That is common mid-semester. In-progress gradebooks often leave future assessments ungraded. This calculator still gives an accurate current weighted grade across assigned categories and shows missing weight. You can also set a target course grade to estimate what average score you need across the remaining percentage.",
  },
  {
    question: "Is weighted grade different from simple average?",
    answer:
      "Yes. A simple average treats every item equally, while weighted grading gives larger categories more influence. A final exam worth 40% can shift your class grade much more than five low-weight quizzes combined. Schools use weighted systems to align grading with course priorities and learning outcomes.",
  },
  {
    question: "Can I use this for college and high school classes?",
    answer:
      "Yes. The math is universal for any percent-based weighted syllabus, including high school, college, AP, and many online courses. The only requirement is that you know category weights and scores from your instructor's gradebook. If your course uses points-only grading, use a points-based calculator instead.",
  },
  {
    question: "How accurate is 'needed on remaining weight' projection?",
    answer:
      "It is mathematically exact for a fixed-weight model with known current standing. Accuracy depends on input quality: current weighted grade, assigned weight, and target grade. Real courses may include policies like dropped assignments, extra credit, and category normalization, so treat projection as a planning number and verify against your syllabus rules.",
  },
  {
    question: "What is a good strategy when needed score is very high?",
    answer:
      "If the required average on remaining work is above 95% or over 100%, shift from target chasing to damage control. Prioritize high-weight categories first, avoid zeros, and improve consistency on core assignments. In parallel, confirm policy details such as lowest-score drops or retakes, which can change the effective weight dynamics.",
  },
];

function toLetterGrade(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

function createCategory(id: string, name: string, score: string, weight: string): GradeCategory {
  return { id, name, score, weight };
}

export default function WeightedGradeCalculatorPage() {
  const [categories, setCategories] = useState<GradeCategory[]>([
    createCategory("1", "Homework", "92", "20"),
    createCategory("2", "Quizzes", "84", "25"),
    createCategory("3", "Projects", "89", "20"),
    createCategory("4", "Exams", "86", "25"),
  ]);
  const [targetGrade, setTargetGrade] = useState("90");

  const result = useMemo<WeightedResult | null>(() => {
    const validRows = categories
      .map((row) => ({
        score: Number.parseFloat(row.score),
        weight: Number.parseFloat(row.weight),
      }))
      .filter((row) => Number.isFinite(row.score) && Number.isFinite(row.weight) && row.weight > 0);

    if (validRows.length === 0) return null;

    const totalWeight = validRows.reduce((sum, row) => sum + row.weight, 0);
    if (totalWeight <= 0) return null;

    const weightedPoints = validRows.reduce((sum, row) => sum + row.score * row.weight, 0);
    const weightedGrade = weightedPoints / totalWeight;
    const missingWeight = Math.max(0, 100 - totalWeight);

    const target = Number.parseFloat(targetGrade);
    let neededOnRemaining: number | null = null;
    if (Number.isFinite(target) && missingWeight > 0 && totalWeight <= 100) {
      const neededPoints = target * 100 - weightedGrade * totalWeight;
      neededOnRemaining = neededPoints / missingWeight;
    }

    return {
      weightedGrade,
      totalWeight,
      missingWeight,
      neededOnRemaining,
    };
  }, [categories, targetGrade]);

  const updateCategory = (id: string, field: keyof GradeCategory, value: string) => {
    setCategories((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      createCategory(`${Date.now()}`, `Category ${prev.length + 1}`, "0", "0"),
    ]);
  };

  const removeCategory = (id: string) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <ToolLayout
      title="Weighted Grade Calculator"
      slug="weighted-grade-calculator"
      description="Compute your weighted class grade by category, see unassigned weight, and estimate what average you need on remaining coursework."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter category scores",
          text: "Add each graded category and its current percentage score.",
        },
        {
          name: "Add category weights",
          text: "Use syllabus percentages such as Homework 20%, Midterm 30%, Final 50%.",
        },
        {
          name: "Review weighted result",
          text: "Check current weighted grade, letter equivalent, and assigned weight coverage.",
        },
        {
          name: "Plan remaining coursework",
          text: "Set a target grade to estimate required average on the unassigned weight.",
        },
      ]}
      relatedTools={[
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Grade Calculator", href: "/grade-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "College GPA Calculator", href: "/college-gpa-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
      ]}
      content={
        <>
          <h2>What this weighted grade calculator does</h2>
          <p>
            This calculator helps you compute your current class grade in courses that use weighted categories instead
            of equal averages. Enter category-level scores and syllabus weights, and the tool returns your weighted
            percentage, letter grade estimate, and remaining unassigned weight. It also projects the average score
            needed on remaining coursework to reach a target final grade.
          </p>

          <h2>Weighted grade formula and worked example</h2>
          <p>
            The core formula is:
          </p>
          <p>
            <strong>Weighted Grade = Sum(Score x Weight) / Sum(Assigned Weights)</strong>
          </p>
          <p>
            Example: Homework 92% (20%), Quizzes 84% (25%), Projects 89% (20%), Exams 86% (25%).
            Weighted points = 92x20 + 84x25 + 89x20 + 86x25 = 7870.
            Assigned weight = 90. Current weighted grade = 7870 / 90 = <strong>87.44%</strong>.
          </p>
          <p>
            If your target is 90% with 10% weight remaining, needed average on remaining work is:
            (90x100 - 87.44x90) / 10 = <strong>112.96%</strong>. That indicates target risk is high unless policy
            factors (extra credit, drops, curves) change the model.
          </p>

          <h2>Interpreting your weighted grade result</h2>
          <p>
            A weighted grade around 87% can represent very different risk levels depending on remaining weight.
            If only 5% is left, your final outcome is mostly locked. If 35% is still open, your course trajectory can
            move significantly. Use both values together: <strong>current weighted score</strong> and
            <strong> unassigned weight</strong>. For final-exam-specific planning, move to the{" "}
            <Link href="/final-grade-calculator/" className="text-primary hover:underline">
              Final Grade Calculator
            </Link>
            .
          </p>

          <h2>Why category weighting changes strategy</h2>
          <ul>
            <li><strong>High-weight categories:</strong> Midterms and finals have outsize influence.</li>
            <li><strong>Low-weight categories:</strong> Homework consistency prevents avoidable grade drag.</li>
            <li><strong>Unassigned weight:</strong> Determines how much your grade can still move.</li>
            <li><strong>Target realism:</strong> Needed score on remaining weight is the best risk signal.</li>
          </ul>

          <h2>Category planning benchmark table</h2>
          <table>
            <thead>
              <tr>
                <th>Remaining Weight</th>
                <th>Planning Meaning</th>
                <th>Recommended Focus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0% to 10%</td>
                <td>Grade mostly locked</td>
                <td>Protect performance, avoid zeros, submit everything.</td>
              </tr>
              <tr>
                <td>10% to 25%</td>
                <td>Moderate movement possible</td>
                <td>Prioritize highest-weight remaining tasks first.</td>
              </tr>
              <tr>
                <td>25% to 40%</td>
                <td>Large movement possible</td>
                <td>Use weekly recovery plan and exam-focused review blocks.</td>
              </tr>
              <tr>
                <td>Above 40%</td>
                <td>Outcome still very flexible</td>
                <td>Model multiple scenarios and optimize by category leverage.</td>
              </tr>
            </tbody>
          </table>

          <h2>Common mistakes in weighted grade tracking</h2>
          <ul>
            <li>Using assignment count averages instead of syllabus category weights.</li>
            <li>Ignoring categories with zeroed missing submissions.</li>
            <li>Adding future categories at 0% before they are graded and distorting current standing.</li>
            <li>Forgetting to normalize when assigned weights are below 100%.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>Khan Academy: weighted averages and grade weighting fundamentals.</li>
            <li>University learning center grading policy guides on weighted category systems.</li>
            <li>ACT college readiness resources on progress tracking and score planning.</li>
            <li>Common US syllabus grading frameworks used across secondary and higher education.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: PieChart, title: "Category Weighting", sub: "Syllabus-accurate averaging" },
            { icon: BarChart3, title: "Progress Tracking", sub: "Assigned vs missing weight" },
            { icon: Target, title: "Target Planning", sub: "Needed score on remaining work" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {categories.map((row, index) => (
            <div key={row.id} className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_120px_120px_48px] sm:items-end sm:border-none sm:bg-transparent sm:p-0">
              <Input
                label={index === 0 ? "Category" : undefined}
                value={row.name}
                onChange={(event) => updateCategory(row.id, "name", event.target.value)}
              />
              <Input
                label={index === 0 ? "Score" : undefined}
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="0.01"
                value={row.score}
                onChange={(event) => updateCategory(row.id, "score", event.target.value)}
                suffix="%"
              />
              <Input
                label={index === 0 ? "Weight" : undefined}
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="0.01"
                value={row.weight}
                onChange={(event) => updateCategory(row.id, "weight", event.target.value)}
                suffix="%"
              />
              <button
                onClick={() => removeCategory(row.id)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                aria-label={`Remove ${row.name || "category"}`}
                disabled={categories.length <= 1}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={addCategory} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Category
          </Button>
          <div className="w-full sm:w-64">
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
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Current Weighted Grade"
                value={`${result.weightedGrade.toFixed(2)}%`}
                subValue={`Letter estimate: ${toLetterGrade(result.weightedGrade)}`}
                highlight
              />
              <ResultCard label="Assigned Weight" value={`${result.totalWeight.toFixed(2)}%`} />
              <ResultCard label="Unassigned Weight" value={`${result.missingWeight.toFixed(2)}%`} />
              <ResultCard
                label="Needed Average on Remaining"
                value={
                  result.neededOnRemaining === null
                    ? "—"
                    : `${result.neededOnRemaining.toFixed(2)}%`
                }
              />
            </ResultsGrid>

            {result.totalWeight > 100 && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                Total category weight is above 100%. Check your syllabus inputs to avoid inflated weighting.
              </p>
            )}
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter at least one valid category score and weight to calculate your weighted grade.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
