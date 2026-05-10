"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Calculator, ClipboardCheck, Percent, Target } from "lucide-react";

interface TestScoreResult {
  attempted: number;
  unanswered: number;
  rawPoints: number;
  maxPoints: number;
  percentScore: number;
  scaledScore: number;
}

const faqs: FAQItem[] = [
  {
    question: "How do I calculate my test percentage from correct answers?",
    answer:
      "For standard tests, divide correct answers by total questions and multiply by 100. Example: 48 correct out of 60 gives 80%. If your exam uses penalties or custom point weights, percentage should be based on points, not just correct count. This calculator supports both methods by letting you enter points for correct, incorrect, and blank responses.",
  },
  {
    question: "What is the difference between raw score and scaled score?",
    answer:
      "Raw score is the direct points you earned from your answer sheet. Scaled score converts that raw performance to another reporting range, such as 100, 200, or 800. Schools and testing systems use scaling to normalize versions of an exam, but classroom tests often use simple percentages. This tool shows both so you can compare across grading formats.",
  },
  {
    question: "How do negative marking exams work?",
    answer:
      "Negative marking subtracts points for wrong answers to reduce random guessing. A common model is +1 for correct and -0.25 for incorrect. In that system, accuracy matters more than volume of attempts. This calculator allows negative points for incorrect responses, helping you model net score strategy and decide when skipping uncertain questions may improve outcomes.",
  },
  {
    question: "If some questions are unanswered, are they counted?",
    answer:
      "Usually yes. Unanswered questions still belong to the total exam and therefore affect percentage relative to full marks. In most classrooms, blank answers receive zero, but some competitive tests assign explicit blank penalties or no-penalty treatment. This calculator treats unfilled questions as unanswered and applies your blank-point setting consistently.",
  },
  {
    question: "Can I use this for quiz, midterm, and final exam planning?",
    answer:
      "Yes. The same scoring logic applies to quizzes, midterms, and finals as long as you know total questions and points policy. You can run scenario planning by changing expected correct and incorrect counts, then compare against your passing target. For final course outcomes, pair this with a final or weighted grade calculator.",
  },
  {
    question: "How should I set a realistic passing target?",
    answer:
      "Use the exact threshold from your syllabus or testing policy (for example 60%, 70%, or 75%). Then compare your projected score under conservative and optimistic assumptions. If your current projection is close to the cutoff, focus revision on high-frequency topics and error patterns from prior tests rather than broad untargeted review.",
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

export default function TestScoreCalculatorPage() {
  const [totalQuestions, setTotalQuestions] = useState("60");
  const [correctAnswers, setCorrectAnswers] = useState("48");
  const [incorrectAnswers, setIncorrectAnswers] = useState("10");
  const [blankAnswers, setBlankAnswers] = useState("2");

  const [pointsPerCorrect, setPointsPerCorrect] = useState("1");
  const [pointsPerIncorrect, setPointsPerIncorrect] = useState("0");
  const [pointsPerBlank, setPointsPerBlank] = useState("0");

  const [scaledMaximum, setScaledMaximum] = useState("100");
  const [passingScore, setPassingScore] = useState("60");

  const result = useMemo<TestScoreResult | null>(() => {
    const total = Number.parseFloat(totalQuestions);
    const correct = Number.parseFloat(correctAnswers);
    const incorrect = Number.parseFloat(incorrectAnswers);
    const blank = Number.parseFloat(blankAnswers);
    const correctPoint = Number.parseFloat(pointsPerCorrect);
    const incorrectPoint = Number.parseFloat(pointsPerIncorrect);
    const blankPoint = Number.parseFloat(pointsPerBlank);
    const scaledMax = Number.parseFloat(scaledMaximum);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(correct) ||
      !Number.isFinite(incorrect) ||
      !Number.isFinite(blank) ||
      !Number.isFinite(correctPoint) ||
      !Number.isFinite(incorrectPoint) ||
      !Number.isFinite(blankPoint) ||
      !Number.isFinite(scaledMax) ||
      total <= 0 ||
      correct < 0 ||
      incorrect < 0 ||
      blank < 0 ||
      scaledMax <= 0
    ) {
      return null;
    }

    const attempted = correct + incorrect + blank;
    const unanswered = Math.max(0, total - attempted);

    const rawPoints = correct * correctPoint + incorrect * incorrectPoint + blank * blankPoint + unanswered * blankPoint;
    const maxPoints = total * correctPoint;
    const percentScore = maxPoints === 0 ? 0 : (rawPoints / maxPoints) * 100;
    const scaledScore = (percentScore / 100) * scaledMax;

    return {
      attempted,
      unanswered,
      rawPoints,
      maxPoints,
      percentScore,
      scaledScore,
    };
  }, [
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    blankAnswers,
    pointsPerCorrect,
    pointsPerIncorrect,
    pointsPerBlank,
    scaledMaximum,
  ]);

  const passValue = Number.parseFloat(passingScore);
  const passed = result && Number.isFinite(passValue) ? result.percentScore >= passValue : null;
  const invalidCount =
    result &&
    Number.parseFloat(correctAnswers) + Number.parseFloat(incorrectAnswers) + Number.parseFloat(blankAnswers) >
      Number.parseFloat(totalQuestions);

  return (
    <ToolLayout
      title="Test Score Calculator"
      slug="test-score-calculator"
      description="Calculate your raw points, percentage, letter grade, and scaled test score from correct, incorrect, and blank responses."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter question counts",
          text: "Add total questions and your correct, incorrect, and blank responses.",
        },
        {
          name: "Set scoring rules",
          text: "Configure points for correct, incorrect, and blank answers to match exam policy.",
        },
        {
          name: "Choose scale and pass threshold",
          text: "Set maximum scaled score and your passing percentage target.",
        },
        {
          name: "Review score breakdown",
          text: "Use raw points, percent score, and letter grade to assess performance and next steps.",
        },
      ]}
      relatedTools={[
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Weighted Grade Calculator", href: "/weighted-grade-calculator/" },
        { name: "ACT Score Calculator", href: "/act-score-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
      ]}
      content={
        <>
          <h2>What this test score calculator does</h2>
          <p>
            This tool converts answer-level performance into actionable score outputs. It supports standard classroom
            scoring and advanced policies like negative marking. After entering total questions, response counts, and
            scoring rules, you get raw points, percentage, letter grade, and scaled score. That makes it useful for
            quiz analysis, mock exam planning, and pre-result scenario checks.
          </p>

          <h2>How test score math works</h2>
          <p>
            Most exams start with raw points:
          </p>
          <p>
            <strong>Raw Points = Correct x Point(Correct) + Incorrect x Point(Incorrect) + Blank x Point(Blank)</strong>
          </p>
          <p>
            Then percentage is calculated against full marks:
          </p>
          <p>
            <strong>Percent Score = Raw Points / Maximum Points x 100</strong>
          </p>
          <p>
            If your school uses a reporting scale (such as 200-point or 800-point), you can convert:
          </p>
          <p>
            <strong>Scaled Score = Percent Score x Scale Maximum / 100</strong>
          </p>

          <h3>Worked example</h3>
          <p>
            Consider a 60-question test with +1 for correct and 0 for incorrect/blank. If you answer 48 correct, 10
            incorrect, 2 blank, your raw points are 48. Maximum points are 60. Percentage = 48 / 60 x 100 = 80%.
            On a 100-point scale, scaled score is also 80. With a 70% passing line, this is a pass outcome.
          </p>

          <h2>Interpreting your score output</h2>
          <p>
            Use percentage for course grading decisions, and use raw points to understand where performance changed.
            If your score misses target by a small margin, examine whether accuracy or attempt strategy is the driver.
            In penalty-based tests, reducing incorrect responses can improve net score more than increasing total attempts.
            For course-level impact, connect this output to the{" "}
            <Link href="/weighted-grade-calculator/" className="text-primary hover:underline">
              Weighted Grade Calculator
            </Link>
            .
          </p>

          <h2>Score planning benchmarks</h2>
          <table>
            <thead>
              <tr>
                <th>Percent Score</th>
                <th>Typical Letter</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>90% to 100%</td>
                <td>A range</td>
                <td>Strong mastery and high consistency.</td>
              </tr>
              <tr>
                <td>80% to 89%</td>
                <td>B range</td>
                <td>Solid understanding with moderate error rate.</td>
              </tr>
              <tr>
                <td>70% to 79%</td>
                <td>C range</td>
                <td>Pass-level performance with notable gaps.</td>
              </tr>
              <tr>
                <td>Below 70%</td>
                <td>D/F range</td>
                <td>Needs focused recovery before next assessment.</td>
              </tr>
            </tbody>
          </table>

          <h2>Common scoring mistakes students make</h2>
          <ul>
            <li>Assuming all tests are percent-only when penalty rules are active.</li>
            <li>Forgetting unanswered questions still count against total possible marks.</li>
            <li>Using simple correct count in courses that grade by weighted point values.</li>
            <li>Confusing raw marks with scaled reporting scores in admissions-style tests.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>ACT and College Board student score interpretation resources.</li>
            <li>Khan Academy exam strategy guidance on accuracy and question-level review.</li>
            <li>University learning center publications on test analysis and grading systems.</li>
            <li>Common US K-12 and college grading scale frameworks.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calculator, title: "Raw Points", sub: "Question-level scoring" },
            { icon: Percent, title: "Percent Grade", sub: "Course-ready percentage" },
            { icon: ClipboardCheck, title: "Pass Check", sub: "Threshold comparison" },
            { icon: Target, title: "Scaled Result", sub: "Optional score scaling" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Total Questions"
            type="number"
            min={1}
            value={totalQuestions}
            onChange={(event) => setTotalQuestions(event.target.value)}
          />
          <Input
            label="Correct Answers"
            type="number"
            min={0}
            value={correctAnswers}
            onChange={(event) => setCorrectAnswers(event.target.value)}
          />
          <Input
            label="Incorrect Answers"
            type="number"
            min={0}
            value={incorrectAnswers}
            onChange={(event) => setIncorrectAnswers(event.target.value)}
          />
          <Input
            label="Blank Answers"
            type="number"
            min={0}
            value={blankAnswers}
            onChange={(event) => setBlankAnswers(event.target.value)}
          />
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <h2 className="text-base font-semibold text-foreground">Scoring Rules</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Input
              label="Points per Correct"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={pointsPerCorrect}
              onChange={(event) => setPointsPerCorrect(event.target.value)}
            />
            <Input
              label="Points per Incorrect"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={pointsPerIncorrect}
              onChange={(event) => setPointsPerIncorrect(event.target.value)}
            />
            <Input
              label="Points per Blank"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={pointsPerBlank}
              onChange={(event) => setPointsPerBlank(event.target.value)}
            />
            <Input
              label="Scaled Maximum"
              type="number"
              inputMode="decimal"
              min={1}
              value={scaledMaximum}
              onChange={(event) => setScaledMaximum(event.target.value)}
            />
            <Input
              label="Passing Percent"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              value={passingScore}
              onChange={(event) => setPassingScore(event.target.value)}
              suffix="%"
            />
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard label="Raw Points" value={result.rawPoints.toFixed(2)} highlight />
              <ResultCard label="Maximum Points" value={result.maxPoints.toFixed(2)} />
              <ResultCard label="Percent Score" value={`${result.percentScore.toFixed(2)}%`} />
              <ResultCard label="Letter Grade" value={toLetterGrade(result.percentScore)} />
              <ResultCard label="Scaled Score" value={result.scaledScore.toFixed(2)} />
              <ResultCard
                label="Pass Status"
                value={passed === null ? "—" : passed ? "Pass" : "Below target"}
              />
            </ResultsGrid>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              Attempted: <strong className="text-foreground">{result.attempted.toFixed(0)}</strong> questions |
              Unanswered: <strong className="text-foreground"> {result.unanswered.toFixed(0)}</strong>
            </p>

            {invalidCount && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                Correct + incorrect + blank exceeds total questions. Verify your counts for accurate results.
              </p>
            )}
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate your test score.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
