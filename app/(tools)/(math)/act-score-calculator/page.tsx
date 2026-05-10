"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { BarChart4, BookOpenCheck, Gauge, Target } from "lucide-react";

interface ACTResult {
  averageScore: number;
  compositeScore: number;
  percentileEstimate: number;
  sectionBenchmarksMet: number;
}

const BENCHMARKS = {
  english: 18,
  math: 22,
  reading: 22,
  science: 23,
} as const;

const percentileByComposite: Record<number, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 2,
  11: 3,
  12: 6,
  13: 9,
  14: 13,
  15: 19,
  16: 25,
  17: 31,
  18: 39,
  19: 46,
  20: 53,
  21: 59,
  22: 63,
  23: 67,
  24: 72,
  25: 76,
  26: 80,
  27: 84,
  28: 87,
  29: 90,
  30: 93,
  31: 95,
  32: 97,
  33: 98,
  34: 99,
  35: 99,
  36: 99,
};

const faqs: FAQItem[] = [
  {
    question: "How is ACT composite score calculated?",
    answer:
      "ACT composite score is the average of your four section scores: English, Math, Reading, and Science, rounded to the nearest whole number. Example: 23, 25, 24, 26 gives an average of 24.5, which rounds to 25. This calculator follows that exact method and also estimates percentile so you can interpret competitiveness quickly.",
  },
  {
    question: "What is considered a good ACT score for college admissions?",
    answer:
      "A good ACT score depends on target schools. Around 20 is near national average performance, 24-27 is often competitive for many public universities, and 30+ is typically strong for selective admissions. The most useful approach is comparing your composite and section subscores against each college's middle 50% admitted range.",
  },
  {
    question: "Do colleges care about section scores or only composite?",
    answer:
      "Many colleges start with composite score, but section scores still matter, especially for major-specific readiness. Engineering and quantitative programs look closely at Math and Science, while humanities-heavy programs review English and Reading strength. Benchmark-level section scores can improve placement outcomes and scholarship competitiveness in some institutions.",
  },
  {
    question: "How accurate is percentile estimation in this tool?",
    answer:
      "Percentile is an approximation based on commonly published ACT national percentile distributions. It is useful for planning and self-benchmarking, but exact percentile can vary slightly across test years and cohorts. Treat this as directional guidance, and use official score reports for final applications and institutional reporting.",
  },
  {
    question: "What if one section score is much lower than the others?",
    answer:
      "An uneven section profile can limit certain opportunities even when composite looks competitive. If one section is below readiness benchmarks, improving that section usually yields better admissions leverage than splitting time evenly. Focus on targeted weak-skill drills, timing strategy, and error-type review for faster score gains.",
  },
  {
    question: "Should I retake the ACT to improve scholarships?",
    answer:
      "Retesting can be worthwhile when your projected improvement moves you into a higher scholarship bracket or a target college's middle 50% score band. Review each school's superscore and merit policy first. If your practice tests consistently exceed current score by 2-3 points, a retake often has strong expected return.",
  },
];

function parseSectionScore(value: string): number {
  return Number.parseFloat(value);
}

export default function ACTScoreCalculatorPage() {
  const [english, setEnglish] = useState("24");
  const [math, setMath] = useState("25");
  const [reading, setReading] = useState("23");
  const [science, setScience] = useState("24");

  const result = useMemo<ACTResult | null>(() => {
    const eng = parseSectionScore(english);
    const mat = parseSectionScore(math);
    const read = parseSectionScore(reading);
    const sci = parseSectionScore(science);

    const values = [eng, mat, read, sci];
    const valid = values.every((score) => Number.isFinite(score) && score >= 1 && score <= 36);
    if (!valid) return null;

    const averageScore = (eng + mat + read + sci) / 4;
    const compositeScore = Math.round(averageScore);
    const percentileEstimate = percentileByComposite[compositeScore] ?? 1;

    let sectionBenchmarksMet = 0;
    if (eng >= BENCHMARKS.english) sectionBenchmarksMet += 1;
    if (mat >= BENCHMARKS.math) sectionBenchmarksMet += 1;
    if (read >= BENCHMARKS.reading) sectionBenchmarksMet += 1;
    if (sci >= BENCHMARKS.science) sectionBenchmarksMet += 1;

    return {
      averageScore,
      compositeScore,
      percentileEstimate,
      sectionBenchmarksMet,
    };
  }, [english, math, reading, science]);

  const sectionRows = [
    { name: "English", value: Number.parseFloat(english), benchmark: BENCHMARKS.english },
    { name: "Math", value: Number.parseFloat(math), benchmark: BENCHMARKS.math },
    { name: "Reading", value: Number.parseFloat(reading), benchmark: BENCHMARKS.reading },
    { name: "Science", value: Number.parseFloat(science), benchmark: BENCHMARKS.science },
  ];

  return (
    <ToolLayout
      title="ACT Score Calculator"
      slug="act-score-calculator"
      description="Estimate your ACT composite score and percentile from English, Math, Reading, and Science section scores."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter four ACT section scores",
          text: "Input your English, Math, Reading, and Science scores on the 1-36 scale.",
        },
        {
          name: "Review composite result",
          text: "The calculator averages section scores and rounds to nearest integer composite.",
        },
        {
          name: "Check percentile estimate",
          text: "Use percentile to understand your relative national performance band.",
        },
        {
          name: "Inspect readiness benchmarks",
          text: "Compare each section to common ACT college readiness benchmark thresholds.",
        },
      ]}
      relatedTools={[
        { name: "Test Score Calculator", href: "/test-score-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Weighted Grade Calculator", href: "/weighted-grade-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "College GPA Calculator", href: "/college-gpa-calculator/" },
      ]}
      content={
        <>
          <h2>What this ACT score calculator does</h2>
          <p>
            This calculator estimates your ACT composite score from four section scores and provides a practical percentile
            reference. It is designed for planning, not official reporting, and helps students quickly answer: where do I
            currently stand, and how far am I from my target colleges? In addition to composite, it checks section-level
            readiness benchmarks used in many advising and placement contexts.
          </p>

          <h2>ACT composite formula and worked example</h2>
          <p>
            ACT composite is computed as the average of English, Math, Reading, and Science, then rounded to the nearest
            whole number:
          </p>
          <p>
            <strong>Composite = Round((English + Math + Reading + Science) / 4)</strong>
          </p>
          <p>
            Example: E=25, M=27, R=24, S=26. Average = (25 + 27 + 24 + 26) / 4 = 25.5. Composite rounds to <strong>26</strong>.
            That score typically lands near the 80th percentile range in recent national distributions.
          </p>

          <h2>How to interpret your ACT result</h2>
          <p>
            Composite score gives a broad admissions signal, while section scores reveal academic profile strengths.
            A balanced 27 often performs differently from a 27 with one weak section when programs evaluate major fit.
            Use percentile as directional context, then compare against each target school&apos;s admitted-student ranges.
            For scholarship strategy, track whether your next realistic gain crosses specific award cutoffs.
          </p>

          <h2>ACT benchmark context</h2>
          <p>
            Common readiness benchmarks are approximately English 18, Math 22, Reading 22, and Science 23. Meeting more
            benchmarks generally indicates stronger first-year readiness across core domains. If one section misses benchmark,
            prioritize targeted section remediation rather than broad untargeted practice sessions.
          </p>

          <h2>Composite planning table</h2>
          <table>
            <thead>
              <tr>
                <th>Composite Range</th>
                <th>General Interpretation</th>
                <th>Planning Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>18 to 21</td>
                <td>Near national average band</td>
                <td>Focus on weak-section fundamentals and pacing drills.</td>
              </tr>
              <tr>
                <td>22 to 27</td>
                <td>Competitive at many institutions</td>
                <td>Target section consistency and benchmark completion.</td>
              </tr>
              <tr>
                <td>28 to 31</td>
                <td>Strong selective profile</td>
                <td>Optimize question selection and high-difficulty accuracy.</td>
              </tr>
              <tr>
                <td>32 to 36</td>
                <td>Top percentile range</td>
                <td>Refine precision and retest only if strategic upside exists.</td>
              </tr>
            </tbody>
          </table>

          <h2>Common ACT score interpretation mistakes</h2>
          <ul>
            <li>Comparing only composite score without checking section distribution.</li>
            <li>Assuming percentile is fixed across all testing years.</li>
            <li>Retesting without clear score-gap diagnosis and section strategy.</li>
            <li>Ignoring superscore and scholarship policy differences by institution.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>ACT official score interpretation and college readiness benchmark publications.</li>
            <li>ACT national percentile tables and annual technical reporting.</li>
            <li>University admissions pages listing ACT middle 50% ranges.</li>
            <li>College advising best-practice resources for standardized test planning.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Gauge, title: "Composite Score", sub: "Rounded 1-36 result" },
            { icon: BarChart4, title: "Percentile Context", sub: "Relative performance band" },
            { icon: BookOpenCheck, title: "Section Checks", sub: "Benchmark readiness review" },
            { icon: Target, title: "Target Planning", sub: "Admission strategy support" },
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
            label="English"
            type="number"
            inputMode="numeric"
            min={1}
            max={36}
            value={english}
            onChange={(event) => setEnglish(event.target.value)}
          />
          <Input
            label="Math"
            type="number"
            inputMode="numeric"
            min={1}
            max={36}
            value={math}
            onChange={(event) => setMath(event.target.value)}
          />
          <Input
            label="Reading"
            type="number"
            inputMode="numeric"
            min={1}
            max={36}
            value={reading}
            onChange={(event) => setReading(event.target.value)}
          />
          <Input
            label="Science"
            type="number"
            inputMode="numeric"
            min={1}
            max={36}
            value={science}
            onChange={(event) => setScience(event.target.value)}
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard label="ACT Composite Score" value={result.compositeScore} highlight />
              <ResultCard label="Unrounded Average" value={result.averageScore.toFixed(2)} />
              <ResultCard label="Estimated Percentile" value={`${result.percentileEstimate}th`} />
              <ResultCard
                label="Benchmarks Met"
                value={`${result.sectionBenchmarksMet}/4`}
              />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <h2 className="text-base font-semibold text-foreground">Section Benchmark Breakdown</h2>
              <table className="mt-3 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left">Section</th>
                    <th className="py-2 text-left">Your Score</th>
                    <th className="py-2 text-left">Benchmark</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionRows.map((row) => (
                    <tr key={row.name} className="border-b border-border/70">
                      <td className="py-2">{row.name}</td>
                      <td>{Number.isFinite(row.value) ? row.value : "—"}</td>
                      <td>{row.benchmark}</td>
                      <td>
                        {Number.isFinite(row.value) && row.value >= row.benchmark ? "Meets benchmark" : "Below benchmark"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid section scores between 1 and 36.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
