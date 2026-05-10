"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { BookOpen, Calculator, TrendingUp, Award } from "lucide-react";

interface SATResult {
  compositeScore: number;
  percentile: number;
  competitiveness: string;
  collegeLevel: string;
}

const faqs: FAQItem[] = [
  {
    question: "How is SAT score calculated?",
    answer:
      "The SAT has two main sections: Evidence-Based Reading & Writing (200-800) and Math (200-800). Composite Score = RW Score + Math Score (ranges 400-1600). Each section is scored based on correct answers, with a score scale used to normalize results across test dates.",
  },
  {
    question: "What is a good SAT score?",
    answer:
      "Average SAT: 1050-1060. Good: 1200+. Very good: 1350+. Excellent: 1450+. Perfect: 1600. For top 20 universities, typical scores are 1470-1570. For selective schools, 1300+. For state universities, 1100-1250. Check specific college score ranges on their admissions website.",
  },
  {
    question: "How does SAT percentile work?",
    answer:
      "Percentile tells you what percentage of test-takers you scored better than. 90th percentile = scored better than 90% of test-takers. 99th percentile is excellent (top 1%). Percentiles vary slightly by test date as more students take the SAT.",
  },
  {
    question: "Can I retake the SAT to improve my score?",
    answer:
      "Yes. Most students take the SAT 2-3 times. Score improvements between attempts: 30-50 points is typical, 100+ is excellent. Colleges typically see all scores but most use your highest score or superscore (best section from each attempt).",
  },
  {
    question: "What colleges require what SAT scores?",
    answer:
      "Ivy League/Top 20: 1470-1570. Top 50: 1300-1500. State universities: 1100-1300. Regional colleges: 1000-1200. Community colleges: 900+. Many colleges are test-optional now. Check CollegeBoard or school websites for specific ranges.",
  },
  {
    question: "How does SAT compare to ACT?",
    answer:
      "SAT: 1600 scale, Evidence-Based Reading vs. Math. ACT: 36 scale, English/Reading/Science/Math. Most top universities accept either. SAT vs. ACT preference varies by region. Rough conversion: SAT 1200 ≈ ACT 26, SAT 1400 ≈ ACT 32.",
  },
];

function getPercentile(score: number): number {
  const percentiles: Record<number, number> = {
    1600: 99,
    1550: 98,
    1500: 96,
    1450: 93,
    1400: 89,
    1350: 85,
    1300: 80,
    1250: 73,
    1200: 66,
    1150: 57,
    1100: 49,
    1050: 41,
    1000: 33,
    950: 26,
    900: 19,
    850: 13,
    800: 8,
    750: 4,
    700: 1,
  };

  for (let i = 1600; i >= 700; i -= 50) {
    if (score >= i && percentiles[i]) {
      const nextScore = i - 50;
      const nextPercentile = percentiles[nextScore] || 1;
      const currentPercentile = percentiles[i];
      const ratio = (score - i) / 50;
      return Math.round(currentPercentile - (currentPercentile - nextPercentile) * ratio);
    }
  }

  return 1;
}

export default function SATScoreCalculatorPage() {
  const [readingScore, setReadingScore] = useState("700");
  const [mathScore, setMathScore] = useState("750");

  const result = useMemo<SATResult | null>(() => {
    const reading = Number.parseFloat(readingScore);
    const math = Number.parseFloat(mathScore);

    if (
      !Number.isFinite(reading) ||
      !Number.isFinite(math) ||
      reading < 200 ||
      reading > 800 ||
      math < 200 ||
      math > 800
    ) {
      return null;
    }

    const composite = reading + math;
    const percentile = getPercentile(composite);

    let competitiveness = "Below Average";
    let collegeLevel = "Community/Open enrollment";

    if (composite >= 1470) {
      competitiveness = "Excellent";
      collegeLevel = "Ivy League / Top 20";
    } else if (composite >= 1350) {
      competitiveness = "Very Good";
      collegeLevel = "Top 50 Universities";
    } else if (composite >= 1200) {
      competitiveness = "Good";
      collegeLevel = "Selective State Universities";
    } else if (composite >= 1100) {
      competitiveness = "Average";
      collegeLevel = "State Universities";
    } else if (composite >= 1000) {
      competitiveness = "Below Average";
      collegeLevel = "Community/Regional Colleges";
    }

    return {
      compositeScore: composite,
      percentile,
      competitiveness,
      collegeLevel,
    };
  }, [readingScore, mathScore]);

  return (
    <ToolLayout
      title="SAT Score Calculator"
      slug="sat-score-calculator"
      description="Calculate your SAT composite score and percentile. See how your score compares to college admission benchmarks."
      category={{ name: "Education Tools", slug: "education-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter Reading & Writing score",
          text: "Your Evidence-Based Reading & Writing section score (200-800).",
        },
        {
          name: "Enter Math score",
          text: "Your Math section score (200-800).",
        },
        {
          name: "See composite score",
          text: "View combined score and percentile ranking.",
        },
        {
          name: "Check college match",
          text: "See which universities typically accept your score range.",
        },
      ]}
      relatedTools={[
        { name: "ACT Score Calculator", href: "/act-score-calculator/" },
        { name: "Study Time Calculator", href: "/study-time-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Test Score Calculator", href: "/test-score-calculator/" },
      ]}
      content={
        <>
          <h2>How is the SAT score calculated?</h2>
          <p>
            The SAT is scored out of 1600 points, divided into two sections: <strong>Evidence-Based Reading &amp; Writing (200-800)</strong>{" "}
            and <strong>Math (200-800)</strong>. Your composite score is the sum of both sections.
          </p>
          <p>
            <strong>SAT Composite Score = Reading &amp; Writing Score + Math Score</strong>
          </p>
          <p>
            Each section is scored based on raw score (number of correct answers), then converted to a scaled score from 200-800. This
            scaling accounts for test difficulty variations across different test dates.
          </p>

          <h2>SAT score ranges and benchmarks</h2>
          <table>
            <thead>
              <tr>
                <th>Score Range</th>
                <th>Percentile</th>
                <th>Rating</th>
                <th>College Competitiveness</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1500–1600</td>
                <td>93–99</td>
                <td>Excellent</td>
                <td>Ivy League, Top 10</td>
              </tr>
              <tr>
                <td>1400–1490</td>
                <td>82–92</td>
                <td>Very Good</td>
                <td>Top 20–50 Universities</td>
              </tr>
              <tr>
                <td>1300–1390</td>
                <td>71–81</td>
                <td>Good</td>
                <td>Top 100 Universities</td>
              </tr>
              <tr>
                <td>1200–1290</td>
                <td>59–70</td>
                <td>Above Average</td>
                <td>Selective State Schools</td>
              </tr>
              <tr>
                <td>1050–1190</td>
                <td>34–58</td>
                <td>Average</td>
                <td>State Universities</td>
              </tr>
              <tr>
                <td>900–1040</td>
                <td>11–33</td>
                <td>Below Average</td>
                <td>Community Colleges</td>
              </tr>
              <tr>
                <td>&lt;900</td>
                <td>&lt;11</td>
                <td>Low</td>
                <td>Open Enrollment</td>
              </tr>
            </tbody>
          </table>

          <h2>College admission SAT score expectations</h2>
          <table>
            <thead>
              <tr>
                <th>University Type</th>
                <th>Typical SAT Range</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ivy League</td>
                <td>1470–1570</td>
                <td>Harvard, Yale, Princeton</td>
              </tr>
              <tr>
                <td>Top 20</td>
                <td>1400–1500</td>
                <td>MIT, Stanford, Northwestern</td>
              </tr>
              <tr>
                <td>Top 50</td>
                <td>1300–1450</td>
                <td>Boston University, NYU, UC Berkeley</td>
              </tr>
              <tr>
                <td>State University (Flagship)</td>
                <td>1200–1350</td>
                <td>Michigan, Virginia, UNC Chapel Hill</td>
              </tr>
              <tr>
                <td>State University (Regional)</td>
                <td>1050–1200</td>
                <td>Most state school branches</td>
              </tr>
              <tr>
                <td>Community College</td>
                <td>Varies</td>
                <td>Test-optional, rolling admission</td>
              </tr>
            </tbody>
          </table>

          <h2>Understanding SAT percentiles</h2>
          <ul>
            <li><strong>Percentile definition:</strong> Percentage of test-takers you scored better than.</li>
            <li><strong>99th percentile (1550+):</strong> Top 1% of all SAT takers. Ivy League competitive.</li>
            <li><strong>90th percentile (1350+):</strong> Top 10%. Competitive for selective schools.</li>
            <li><strong>75th percentile (1200+):</strong> Top 25%. Above average, good for state schools.</li>
            <li><strong>50th percentile (1050):</strong> Median score. Average SAT taker.</li>
            <li><strong>Percentiles change:</strong> As more students take the SAT, percentile rankings shift slightly each year.</li>
          </ul>

          <h2>SAT vs. ACT comparison</h2>
          <ul>
            <li><strong>SAT:</strong> 1600 scale. Evidence-Based Reading vs. Math. Reading-heavy.</li>
            <li><strong>ACT:</strong> 36 scale (4 sections). English/Reading/Science/Math. Science section unique.</li>
            <li><strong>Rough conversion:</strong> SAT 1000 ≈ ACT 20, SAT 1200 ≈ ACT 26, SAT 1400 ≈ ACT 32.</li>
            <li><strong>College preference:</strong> Most universities accept both equally. Some have slight preferences by region.</li>
            <li><strong>Test-optional:</strong> Many colleges don&apos;t require either test now. Check school-specific policies.</li>
          </ul>

          <h2>How to improve your SAT score</h2>
          <ul>
            <li><strong>Diagnostic practice test:</strong> Take full-length SAT under timed conditions first. Identify weak areas.</li>
            <li><strong>Target weak sections:</strong> If Math is weak, focus 60% of prep time on Math.</li>
            <li><strong>Practice tests:</strong> Take 4-6 full practice tests. Official College Board tests best.</li>
            <li><strong>Review mistakes:</strong> Analyze every wrong answer. Understand why you got it wrong.</li>
            <li><strong>Timing strategies:</strong> Practice time management. Work on pace without sacrificing accuracy.</li>
            <li><strong>Retake smartly:</strong> Most score improvements come from first to second attempt. Diminishing returns after 3 attempts.</li>
            <li><strong>Professional help:</strong> Tutoring helps 20-30 point improvement for most students.</li>
          </ul>

          <h2>SAT test structure (current)</h2>
          <ul>
            <li><strong>Evidence-Based Reading &amp; Writing (200-800):</strong> 154 questions, 2 hours 54 min.</li>
            <li><strong>Math (200-800):</strong> 58 questions, 1 hour 20 min.</li>
            <li><strong>Total time:</strong> 3 hours (without essay; no essay since 2021).</li>
            <li><strong>Scoring:</strong> All sections count equally. No penalty for wrong answers.</li>
            <li><strong>Format:</strong> Multiple choice and grid-in. No fill-in-the-blank.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>College Board Official SAT documentation and score ranges.</li>
            <li>SAT percentile data (updated annually).</li>
            <li>University SAT admission score requirements.</li>
            <li>SAT preparation guides and official practice tests.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: "Reading & Writing", sub: "200-800" },
            { icon: Calculator, title: "Math", sub: "200-800" },
            { icon: TrendingUp, title: "Composite Score", sub: "400-1600" },
            { icon: Award, title: "Percentile", sub: "Your ranking" },
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
            label="Reading &amp; Writing Score"
            type="number"
            inputMode="numeric"
            min={200}
            max={800}
            value={readingScore}
            onChange={(e) => setReadingScore(e.target.value)}
            suffix="points"
          />
          <Input
            label="Math Score"
            type="number"
            inputMode="numeric"
            min={200}
            max={800}
            value={mathScore}
            onChange={(e) => setMathScore(e.target.value)}
            suffix="points"
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Composite Score"
                value={result.compositeScore.toString()}
                unit="out of 1600"
                highlight
              />
              <ResultCard
                label="Percentile Rank"
                value={result.percentile.toString() + "th"}
              />
            </ResultsGrid>

            <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">{result.competitiveness}</p>
              <p className="text-sm text-muted-foreground">{result.collegeLevel}</p>
            </div>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              Your SAT score of <strong>{result.compositeScore}</strong> puts you in the <strong>{result.percentile}th percentile</strong>,
              making you competitive for {result.collegeLevel.toLowerCase()}.
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid SAT section scores to calculate composite score and percentile.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
