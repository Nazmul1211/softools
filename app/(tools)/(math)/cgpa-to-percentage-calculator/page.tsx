"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Calculator, TrendingUp, Award, Globe } from "lucide-react";

interface ConversionResult {
  percentageStandard: number;
  percentageAlternate: number;
  gradeEquivalent: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is CGPA and how is it different from GPA?",
    answer:
      "CGPA (Cumulative Grade Point Average) is the overall average of all grades across all semesters. GPA (Grade Point Average) is for a single semester. CGPA gives a complete picture of academic performance over your entire degree program.",
  },
  {
    question: "Why do different countries use different scales?",
    answer:
      "Different educational systems developed independently. USA uses 4.0 scale, India uses 10-point scale, Canada/UK use 4.3-5.0 scales, Europe uses various systems. This calculator helps compare across scales for international applications (scholarships, master&apos;s programs).",
  },
  {
    question: "What is the standard formula for CGPA to percentage conversion?",
    answer:
      "Most universities use: Percentage = (CGPA / Maximum CGPA) × 100. For 4.0 scale: (3.5 / 4.0) × 100 = 87.5%. For 10-point scale: (8.2 / 10) × 100 = 82%. Some use different multipliers; check your institution.",
  },
  {
    question: "Is there an official conversion between 4.0 and 10-point scales?",
    answer:
      "No single official conversion exists. Common approximations: 4.0 ≈ 100%, 3.5 ≈ 87%, 3.0 ≈ 75%, 2.5 ≈ 63%. For 10-point: 10 = 100%, 8 = 80%, 6 = 60%. Different countries and institutions apply different conversions. Always check specific requirements.",
  },
  {
    question: "How do employers view CGPA vs percentage?",
    answer:
      "Employers prioritize high CGPA/percentage (3.5+ on 4.0 or 85%+ on percentage). Many prefer transcript with both metrics. Experience and projects matter more than absolute scores. A 3.2 with internships beats 4.0 with no experience.",
  },
  {
    question: "Can I improve my CGPA? How much impact does one semester have?",
    answer:
      "Yes. If you currently have 3.0 CGPA and score 4.0 next semester, your CGPA will increase based on credit hours. Formula: New CGPA = (Old CGPA × Old Credits + New Score × New Credits) / (Old Credits + New Credits). Earlier semesters count as much as later ones.",
  },
];

export default function CGPAToPercentageCalculatorPage() {
  const [cgpa, setCGPA] = useState("3.5");
  const [scale, setScale] = useState("4.0");

  const result = useMemo<ConversionResult | null>(() => {
    const cgpaValue = Number.parseFloat(cgpa);
    const maxScale = Number.parseFloat(scale);

    if (!Number.isFinite(cgpaValue) || !Number.isFinite(maxScale) || cgpaValue < 0 || maxScale <= 0 || cgpaValue > maxScale) {
      return null;
    }

    const percentage = (cgpaValue / maxScale) * 100;

    let alternatePercentage = percentage;
    if (maxScale === 4.0) {
      alternatePercentage = cgpaValue * 25;
    } else if (maxScale === 5.0) {
      alternatePercentage = cgpaValue * 20;
    } else if (maxScale === 10) {
      alternatePercentage = cgpaValue * 10;
    }

    let gradeEquivalent = "F";
    if (percentage >= 90) gradeEquivalent = "A+";
    else if (percentage >= 85) gradeEquivalent = "A";
    else if (percentage >= 80) gradeEquivalent = "A-";
    else if (percentage >= 77) gradeEquivalent = "B+";
    else if (percentage >= 73) gradeEquivalent = "B";
    else if (percentage >= 70) gradeEquivalent = "B-";
    else if (percentage >= 67) gradeEquivalent = "C+";
    else if (percentage >= 63) gradeEquivalent = "C";
    else if (percentage >= 60) gradeEquivalent = "C-";
    else if (percentage >= 50) gradeEquivalent = "D";

    return {
      percentageStandard: percentage,
      percentageAlternate: alternatePercentage,
      gradeEquivalent,
    };
  }, [cgpa, scale]);

  return (
    <ToolLayout
      title="CGPA to Percentage Converter"
      slug="cgpa-to-percentage-calculator"
      description="Convert your CGPA to percentage equivalent. Supports 4.0, 5.0, and 10.0 scale conversions."
      category={{ name: "Education Tools", slug: "education-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your CGPA",
          text: "Input your cumulative grade point average.",
        },
        {
          name: "Select your scale",
          text: "Choose 4.0 (USA), 5.0 (Canada), or 10 (India) scale.",
        },
        {
          name: "See conversion",
          text: "View percentage equivalent and letter grade.",
        },
        {
          name: "Use for applications",
          text: "Share percentage when percentage-based reporting is required.",
        },
      ]}
      relatedTools={[
        { name: "Percentage to GPA Converter", href: "/percentage-to-gpa-calculator/" },
        { name: "College GPA Calculator", href: "/college-gpa-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Study Time Calculator", href: "/study-time-calculator/" },
      ]}
      content={
        <>
          <h2>What is CGPA and how to convert to percentage?</h2>
          <p>
            CGPA (Cumulative Grade Point Average) is your overall grade average across all semesters. To convert CGPA to percentage,
            use the formula: <strong>Percentage = (CGPA / Maximum Scale) × 100</strong>
          </p>
          <p>
            For example, a 3.5 CGPA on a 4.0 scale = (3.5 ÷ 4.0) × 100 = 87.5%. Different countries and institutions use different
            scales, so conversion is important for international applications.
          </p>

          <h2>CGPA to percentage conversion formulas</h2>
          <table>
            <thead>
              <tr>
                <th>Scale</th>
                <th>Formula</th>
                <th>Example</th>
                <th>Used In</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4.0 Scale</td>
                <td>Percentage = (CGPA / 4.0) × 100</td>
                <td>3.5 → 87.5%</td>
                <td>USA, Canada</td>
              </tr>
              <tr>
                <td>5.0 Scale</td>
                <td>Percentage = (CGPA / 5.0) × 100</td>
                <td>4.2 → 84%</td>
                <td>Canada, India (some)</td>
              </tr>
              <tr>
                <td>10-point Scale</td>
                <td>Percentage = (CGPA / 10) × 100</td>
                <td>8.5 → 85%</td>
                <td>India, Bangladesh</td>
              </tr>
              <tr>
                <td>100-point Scale</td>
                <td>Direct percentage</td>
                <td>87 → 87%</td>
                <td>Many countries</td>
              </tr>
            </tbody>
          </table>

          <h2>CGPA conversion chart (4.0 scale)</h2>
          <table>
            <thead>
              <tr>
                <th>CGPA</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4.0</td>
                <td>100%</td>
                <td>A+</td>
                <td>Excellent</td>
              </tr>
              <tr>
                <td>3.8</td>
                <td>95%</td>
                <td>A+</td>
                <td>Excellent</td>
              </tr>
              <tr>
                <td>3.5</td>
                <td>87.5%</td>
                <td>A</td>
                <td>Very Good</td>
              </tr>
              <tr>
                <td>3.0</td>
                <td>75%</td>
                <td>B</td>
                <td>Good</td>
              </tr>
              <tr>
                <td>2.5</td>
                <td>62.5%</td>
                <td>C</td>
                <td>Average</td>
              </tr>
              <tr>
                <td>2.0</td>
                <td>50%</td>
                <td>D</td>
                <td>Below Average</td>
              </tr>
            </tbody>
          </table>

          <h2>Understanding CGPA standards</h2>
          <ul>
            <li><strong>3.8-4.0:</strong> Exceptional. Top-tier scholarships, PhD programs, competitive internships.</li>
            <li><strong>3.5-3.8:</strong> Excellent. Strong for graduate programs and employer hiring.</li>
            <li><strong>3.0-3.5:</strong> Very good. Meets most job requirements and graduate program minimums (often 3.0 min).</li>
            <li><strong>2.5-3.0:</strong> Average. May face challenges with selective employers or programs.</li>
            <li><strong>&lt;2.5:</strong> Below average. May impact financial aid, scholarships, or job prospects.</li>
          </ul>

          <h2>Factors affecting CGPA</h2>
          <ul>
            <li><strong>All semesters count:</strong> Earlier semesters impact your final CGPA as much as later ones (unless you retake courses).</li>
            <li><strong>Credit hours matter:</strong> Courses with more credits have more weight in CGPA calculation.</li>
            <li><strong>Retakes improve CGPA:</strong> If you retake a course, the new grade typically replaces the old one.</li>
            <li><strong>Pass/Fail courses:</strong> May not count toward CGPA calculation (check your institution).</li>
            <li><strong>Incremental improvement:</strong> One exceptional semester can gradually improve your CGPA over time.</li>
          </ul>

          <h2>How to improve your CGPA</h2>
          <ul>
            <li><strong>Future semesters:</strong> Achieve 4.0 GPA to incrementally raise your CGPA (impact decreases with each semester).</li>
            <li><strong>Retake courses:</strong> Retaking failed or low courses and improving your grade will raise CGPA.</li>
            <li><strong>Focus on high-credit courses:</strong> Prioritize subjects with more credit hours for maximum impact.</li>
            <li><strong>Manage workload:</strong> Don&apos;t overload semesters. Quality beats quantity.</li>
            <li><strong>Seek tutoring:</strong> Invest in help early; improving one course can boost overall CGPA significantly.</li>
          </ul>

          <h2>International conversion notes</h2>
          <ul>
            <li><strong>No universal standard:</strong> Different countries have different conversion formulas. Check target country/university.</li>
            <li><strong>USA:</strong> Typically 4.0 scale. Some schools use 4.3 or weighted GPA.</li>
            <li><strong>UK:</strong> Classification system (First, 2:1, 2:2, Third). Different from GPA.</li>
            <li><strong>Canada:</strong> Mostly 4.0 scale, some use 4.3. British Columbia uses A-F letter grades.</li>
            <li><strong>India:</strong> 10-point scale most common. Some universities use 4.0 or 5.0.</li>
            <li><strong>EU:</strong> ECTS grading system (A-F) not directly comparable to CGPA. See ECTS conversion guides.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>World Education Services (WES) CGPA conversion guidelines.</li>
            <li>University-specific grading scale documentation.</li>
            <li>International student evaluation services.</li>
            <li>Graduate school admissions GPA conversion policies.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calculator, title: "CGPA Input", sub: "Your score" },
            { icon: Globe, title: "Scale Selection", sub: "4.0, 5.0, or 10" },
            { icon: TrendingUp, title: "Percentage", sub: "Converted value" },
            { icon: Award, title: "Grade", sub: "Letter equivalent" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Input
            label="Your CGPA"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={cgpa}
            onChange={(e) => setCGPA(e.target.value)}
            suffix="points"
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <label className="block text-sm font-semibold text-foreground mb-3">GPA Scale</label>
            <div className="space-y-2">
              {[
                { label: "4.0 Scale (USA/Canada)", value: "4.0" },
                { label: "5.0 Scale (Canada/Europe)", value: "5.0" },
                { label: "10-Point Scale (India)", value: "10" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="scale"
                    value={value}
                    checked={scale === value}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Percentage Equivalent"
                value={result.percentageStandard.toFixed(2) + "%"}
                highlight
              />
              <ResultCard
                label="Letter Grade"
                value={result.gradeEquivalent}
              />
            </ResultsGrid>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              Your CGPA of <strong>{cgpa}</strong> on {scale} scale = <strong>{result.percentageStandard.toFixed(2)}%</strong> ({result.gradeEquivalent}).
              Use this for international applications and percentage-based comparisons.
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid CGPA to convert to percentage.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
