"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { BookOpen, Clock, Target, CheckCircle } from "lucide-react";

interface CreditResult {
  creditsRemaining: number;
  creditsPerSemester: number;
  semestersNeeded: number;
  graduationYear: number;
  isOnTrack: boolean;
}

const faqs: FAQItem[] = [
  {
    question: "What is a credit hour?",
    answer:
      "A credit hour is a unit of academic credit representing student learning. Generally, 1 credit hour = 1 hour of class + 2 hours of outside work per week per semester. A typical course is 3 credits (3 hours class, 6 hours homework weekly). Full-time is 12-18 credits/semester.",
  },
  {
    question: "How many credit hours do I need to graduate?",
    answer:
      "Most bachelor&apos;s degrees require 120 credit hours. Some programs: Engineering (128), Fine Arts (132), Education (120). Verify your degree requirements in your college catalog or advisor&apos;s office. Requirements vary by major and institution.",
  },
  {
    question: "What is a standard course load?",
    answer:
      "Full-time student: 12-18 credits/semester (typical 15). Part-time: 6-11 credits. Most students take 4-5 courses (12-15 credits) per semester. Taking 18+ is heavy. Below 12 may not qualify as full-time (affects financial aid, housing, insurance).",
  },
  {
    question: "How do credit hours affect my GPA?",
    answer:
      "Credit-weighted GPA counts each grade by course credits. Example: A (4.0) in 4-credit course + B (3.0) in 3-credit course = [(4.0×4) + (3.0×3)] ÷ 7 = 3.57. Higher-credit courses matter more. Passing/failing low-credit courses impacts GPA less.",
  },
  {
    question: "Can I graduate early with more credits per semester?",
    answer:
      "Yes, but cautiously. Taking 18+ credits is very heavy. Quality suffers (GPA drops by 0.3-0.5 average), burnout risk increases. Better strategy: take normal load, graduate on time, and use saved energy for internships/graduate school prep.",
  },
  {
    question: "What if I take credits at multiple colleges?",
    answer:
      "Transfer credits count toward your degree. Your home institution evaluates which transfer credits apply. Usually 2-3 year transfer credits count toward major; earlier credits apply as general education. Verify with your college&apos;s transfer credit policy.",
  },
];

export default function CreditHourCalculatorPage() {
  const [totalRequired, setTotalRequired] = useState("120");
  const [creditsCompleted, setCreditsCompleted] = useState("60");
  const [creditsThisSemester, setCreditsThisSemester] = useState("15");
  const [semestersRemaining, setSemestersRemaining] = useState("4");

  const result = useMemo<CreditResult | null>(() => {
    const required = Number.parseFloat(totalRequired);
    const completed = Number.parseFloat(creditsCompleted);
    const thisSemester = Number.parseFloat(creditsThisSemester);
    const remaining = Number.parseFloat(semestersRemaining);

    if (
      !Number.isFinite(required) ||
      !Number.isFinite(completed) ||
      !Number.isFinite(thisSemester) ||
      !Number.isFinite(remaining) ||
      required <= 0 ||
      completed < 0 ||
      completed > required ||
      thisSemester <= 0 ||
      remaining <= 0
    ) {
      return null;
    }

    const creditsRemaining = required - completed;
    const needed = creditsRemaining / remaining;
    const isOnTrack = thisSemester >= needed * 0.9;

    return {
      creditsRemaining,
      creditsPerSemester: needed,
      semestersNeeded: remaining,
      graduationYear: new Date().getFullYear() + Math.ceil(remaining / 2),
      isOnTrack,
    };
  }, [totalRequired, creditsCompleted, creditsThisSemester, semestersRemaining]);

  return (
    <ToolLayout
      title="Credit Hour Calculator"
      slug="credit-hour-calculator"
      description="Calculate credit hours needed for degree completion and plan your semester course load. Track graduation progress."
      category={{ name: "Education Tools", slug: "education-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter total credits required",
          text: "Usually 120 for bachelor&apos;s degree. Check your degree requirements.",
        },
        {
          name: "Enter credits completed",
          text: "Total credits earned so far (all semesters).",
        },
        {
          name: "Enter credits this semester",
          text: "Your current semester course load.",
        },
        {
          name: "See graduation timeline",
          text: "View credits remaining and semesters until graduation.",
        },
      ]}
      relatedTools={[
        { name: "Study Time Calculator", href: "/study-time-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "CGPA to Percentage Converter", href: "/cgpa-to-percentage-calculator/" },
        { name: "Attendance Percentage Calculator", href: "/attendance-percentage-calculator/" },
      ]}
      content={
        <>
          <h2>Understanding credit hours</h2>
          <p>
            A credit hour represents one hour of classroom instruction plus two hours of outside preparation per week for one semester.
            It&apos;s the standard unit of academic progress. Most bachelor&apos;s degrees require <strong>120 credit hours</strong> for
            graduation.
          </p>
          <p>
            <strong>Credits Remaining = Total Required Credits - Credits Completed</strong>
          </p>
          <p>
            <strong>Credits Per Semester Needed = Credits Remaining / Semesters Available</strong>
          </p>

          <h2>Typical credit requirements by degree</h2>
          <table>
            <thead>
              <tr>
                <th>Degree Type</th>
                <th>Typical Credits</th>
                <th>Typical Timeline</th>
                <th>Per Semester</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Associate Degree</td>
                <td>60</td>
                <td>2 years</td>
                <td>15/semester</td>
              </tr>
              <tr>
                <td>Bachelor&apos;s (Liberal Arts)</td>
                <td>120</td>
                <td>4 years</td>
                <td>15/semester</td>
              </tr>
              <tr>
                <td>Bachelor&apos;s (Engineering)</td>
                <td>128</td>
                <td>4 years</td>
                <td>16/semester</td>
              </tr>
              <tr>
                <td>Bachelor&apos;s (Fine Arts)</td>
                <td>132</td>
                <td>4 years</td>
                <td>16.5/semester</td>
              </tr>
              <tr>
                <td>Bachelor&apos;s (Nursing)</td>
                <td>128</td>
                <td>4 years</td>
                <td>16/semester</td>
              </tr>
              <tr>
                <td>Master&apos;s (Most)</td>
                <td>30-36</td>
                <td>1-2 years</td>
                <td>15-18/semester</td>
              </tr>
            </tbody>
          </table>

          <h2>Standard course loads per semester</h2>
          <ul>
            <li><strong>Light load (6-11 credits):</strong> Part-time student. May not qualify as full-time for aid/housing.</li>
            <li><strong>Standard load (12-15 credits):</strong> Full-time student. Average 4-5 courses. Recommended for most students.</li>
            <li><strong>Heavy load (16-18 credits):</strong> Very full. Most students do not perform well above 18 credits.</li>
            <li><strong>Extreme load (19+ credits):</strong> Not recommended. High risk of low grades, burnout, and course failure.</li>
          </ul>

          <h2>Factors affecting semester credit load</h2>
          <ul>
            <li><strong>Major difficulty:</strong> STEM majors require more out-of-class work. Lower credits may be wise (12-14).</li>
            <li><strong>Work/life balance:</strong> Working students should take fewer credits (9-12) to maintain GPA.</li>
            <li><strong>Prerequisite chains:</strong> Some majors require specific sequences. Can&apos;t always take more courses early.</li>
            <li><strong>Financial aid:</strong> Full-time status (12+ credits) required for most aid. Check your aid package.</li>
            <li><strong>Graduate school prep:</strong> High GPA (3.5+) matters more than quick graduation. Take reasonable loads.</li>
          </ul>

          <h2>Graduation planning strategies</h2>
          <ul>
            <li><strong>Spread courses evenly:</strong> 15 credits/semester spreads degree over 8 semesters (4 years). Avoids overload.</li>
            <li><strong>Front-load easy credits:</strong> Take general education early. Major courses later when you can focus.</li>
            <li><strong>Avoid back-loading:</strong> Don&apos;t save all major courses for final semester. You&apos;ll likely need those credits for graduate school GPA.</li>
            <li><strong>Plan prerequisites:</strong> Know major requirements. Don&apos;t take higher courses before prerequisites.</li>
            <li><strong>Consider summer school:</strong> Summer courses reduce semester load and add flexibility.</li>
          </ul>

          <h2>Impact of credits on GPA and time to graduation</h2>
          <ul>
            <li><strong>More credits = More risk:</strong> Each additional course adds 1-3 hours of weekly work. Risk of grade decline above 18.</li>
            <li><strong>Transfer credits:</strong> Community college transfer credits count as completed credits. Can reduce time-to-graduation.</li>
            <li><strong>Failed courses:</strong> Must retake for credits. Delays graduation and lowers CGPA even if retake is higher.</li>
            <li><strong>Pass/Fail courses:</strong> Don&apos;t count toward GPA but count toward credits and progress.</li>
            <li><strong>Double major/minor:</strong> Typically require 135-150 credits total. Plan 4-4.5 years or take heavier loads.</li>
          </ul>

          <h2>Financial aid and full-time enrollment</h2>
          <ul>
            <li><strong>Full-time requirement:</strong> 12+ credits/semester typically required for full-time financial aid.</li>
            <li><strong>Graduate assistantships:</strong> Often require 9+ credits for eligibility.</li>
            <li><strong>Parent PLUS loans:</strong> May be available for less-than-full-time enrollment.</li>
            <li><strong>Housing eligibility:</strong> Most dorms require full-time enrollment (12+ credits).</li>
            <li><strong>Health insurance:</strong> Check employer/parent insurance if not full-time.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>College Board SAT and degree requirement documentation.</li>
            <li>U.S. Department of Education credit hour definitions.</li>
            <li>Institutional degree audit and graduation requirements.</li>
            <li>NCES higher education completion data.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: "Total Required", sub: "Degree credits" },
            { icon: CheckCircle, title: "Completed", sub: "So far" },
            { icon: Clock, title: "This Semester", sub: "Current load" },
            { icon: Target, title: "Remaining", sub: "To graduate" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Total Credits Required"
              type="number"
              inputMode="numeric"
              min={30}
              value={totalRequired}
              onChange={(e) => setTotalRequired(e.target.value)}
              suffix="credits"
            />
            <Input
              label="Credits Completed"
              type="number"
              inputMode="numeric"
              min={0}
              value={creditsCompleted}
              onChange={(e) => setCreditsCompleted(e.target.value)}
              suffix="credits"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Credits This Semester"
              type="number"
              inputMode="decimal"
              min={0.5}
              step="0.5"
              value={creditsThisSemester}
              onChange={(e) => setCreditsThisSemester(e.target.value)}
              suffix="credits"
            />
            <Input
              label="Semesters Remaining"
              type="number"
              inputMode="numeric"
              min={1}
              value={semestersRemaining}
              onChange={(e) => setSemestersRemaining(e.target.value)}
              suffix="semesters"
            />
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Credits Remaining"
                value={Math.max(0, result.creditsRemaining).toString()}
                unit="credits"
                highlight
              />
              <ResultCard
                label="Credits Needed Per Semester"
                value={Math.round(result.creditsPerSemester * 10) / 10}
                unit="credits"
              />
              <ResultCard
                label="Expected Graduation"
                value={result.graduationYear.toString()}
              />
              <ResultCard
                label="Status"
                value={result.isOnTrack ? "On Track ✓" : "Below Track"}
              />
            </ResultsGrid>

            <div
              className={`rounded-lg p-4 ${
                result.isOnTrack
                  ? "border border-green-500/50 bg-green-500/10"
                  : "border border-yellow-500/50 bg-yellow-500/10"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">
                {result.isOnTrack
                  ? "✅ On Track: Your current load is sufficient for graduation."
                  : `⚠️ Below Target: You need ${Math.round((result.creditsPerSemester - Number.parseFloat(creditsThisSemester)) * 10) / 10} more credits/semester to graduate on time.`}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {result.creditsRemaining} credits remaining across {result.semestersNeeded} semesters = {Math.round(result.creditsPerSemester * 10) / 10} credits/semester average.
              </p>
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid credit values to calculate graduation progress.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
