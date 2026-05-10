"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { CheckCircle, XCircle, Target, AlertCircle } from "lucide-react";

interface AttendanceResult {
  currentPercentage: number;
  classesCanMiss: number;
  targetAttendanceClasses: number;
  futureAttendanceNeeded: number;
}

const faqs: FAQItem[] = [
  {
    question: "How is attendance percentage calculated?",
    answer:
      "Attendance % = (Classes Attended / Total Classes) × 100. For example, if you attended 36 out of 40 classes, your attendance is 36 ÷ 40 × 100 = 90%. This calculator helps you track this and plan future absences while maintaining a target percentage.",
  },
  {
    question: "What is a good attendance percentage?",
    answer:
      "Most schools require 75-85% minimum attendance. Academic standards: 90%+ = excellent, 85-90% = good, 75-85% = acceptable. Medical schools and nursing programs often require 95%+ attendance. Check your course or institution&apos;s policy for specific requirements.",
  },
  {
    question: "Can missing classes affect my grade?",
    answer:
      "Yes. Many professors factor attendance into grades (5-20% weight). Missing classes also means: less lecture content learned, missing pop quizzes, reduced participation grade. Missing 3+ consecutive classes can trigger academic probation or course suspension at many institutions.",
  },
  {
    question: "What if I&apos;ve already missed too many classes?",
    answer:
      "Calculate if it&apos;s mathematically possible to reach your target. If not, you have three options: (1) Drop/withdraw from course if deadline hasn&apos;t passed, (2) Talk to professor about excused absences, (3) Accept a lower final grade. Some professors allow medical excuses or grade changes if you&apos;ve legitimately been ill.",
  },
  {
    question: "Do excused absences count differently?",
    answer:
      "This depends on your school policy. Some schools count excused absences as present (medical, family emergency), others count them separately, and some still mark them as absent. Check your student handbook or syllabus for your institution&apos;s excused absence policy.",
  },
  {
    question: "Is there a difference between college and high school attendance?",
    answer:
      "Yes. High school typically enforces strict attendance (90%+ required). College is more flexible but can still penalize (professors may cap grade at B or drop students). Graduate programs and professional schools (law, medicine) have very strict attendance (95%+).",
  },
];

function formatPercent(value: number): string {
  return value.toFixed(2) + "%";
}

export default function AttendancePercentageCalculatorPage() {
  const [classesAttended, setClassesAttended] = useState("36");
  const [totalClasses, setTotalClasses] = useState("40");
  const [targetPercentage, setTargetPercentage] = useState("85");
  const [futureClasses, setFutureClasses] = useState("10");

  const result = useMemo<AttendanceResult | null>(() => {
    const attended = Number.parseFloat(classesAttended);
    const total = Number.parseFloat(totalClasses);
    const target = Number.parseFloat(targetPercentage);
    const future = Number.parseFloat(futureClasses);

    if (
      !Number.isFinite(attended) ||
      !Number.isFinite(total) ||
      !Number.isFinite(target) ||
      !Number.isFinite(future) ||
      attended < 0 ||
      total <= 0 ||
      target < 0 ||
      target > 100 ||
      future < 0 ||
      attended > total
    ) {
      return null;
    }

    const currentPercent = (attended / total) * 100;
    const canMiss = total - attended - Math.ceil((target / 100) * total - attended);
    const afterFuture = total + future;
    const neededToAttend = Math.ceil((target / 100) * afterFuture);
    const futureNeeded = Math.max(0, neededToAttend - attended);

    return {
      currentPercentage: currentPercent,
      classesCanMiss: Math.max(0, canMiss),
      targetAttendanceClasses: Math.ceil((target / 100) * total),
      futureAttendanceNeeded: Math.min(future, futureNeeded),
    };
  }, [classesAttended, totalClasses, targetPercentage, futureClasses]);

  return (
    <ToolLayout
      title="Attendance Percentage Calculator"
      slug="attendance-percentage-calculator"
      description="Calculate your current attendance percentage and see how many classes you can miss while maintaining your target attendance rate."
      category={{ name: "Education Tools", slug: "education-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter classes attended",
          text: "Count the number of classes you&apos;ve actually attended so far.",
        },
        {
          name: "Enter total classes held",
          text: "Total classes held so far in the semester.",
        },
        {
          name: "Set target percentage",
          text: "Your desired or required attendance rate (usually 85-95%).",
        },
        {
          name: "See results",
          text: "View current percentage, classes you can miss, and future attendance needed.",
        },
      ]}
      relatedTools={[
        { name: "Study Time Calculator", href: "/study-time-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
        { name: "GPA Calculator", href: "/college-gpa-calculator/" },
      ]}
      content={
        <>
          <h2>How to calculate attendance percentage</h2>
          <p>
            <strong>Attendance % = (Classes Attended / Total Classes) × 100</strong>
          </p>
          <p>
            Example: 36 classes attended out of 40 total = (36 ÷ 40) × 100 = 90% attendance.
          </p>
          <p>
            This calculator also helps you determine how many additional classes you can miss while still maintaining your target attendance
            percentage, and whether you&apos;re on track for your goal.
          </p>

          <h2>Typical attendance requirements by institution</h2>
          <table>
            <thead>
              <tr>
                <th>Institution Type</th>
                <th>Minimum Requirement</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>High School</td>
                <td>90-95%</td>
                <td>Strictly enforced. Parents notified of absences.</td>
              </tr>
              <tr>
                <td>College/University</td>
                <td>75-85%</td>
                <td>Some courses have stricter requirements. Check syllabus.</td>
              </tr>
              <tr>
                <td>Online College</td>
                <td>N/A (varies)</td>
                <td>Participation grades replace attendance.</td>
              </tr>
              <tr>
                <td>Medical/Law School</td>
                <td>95%+</td>
                <td>Very strict. Absences can result in course failure.</td>
              </tr>
              <tr>
                <td>Graduate Programs</td>
                <td>85-95%</td>
                <td>Depends on program. Often requires written excuses.</td>
              </tr>
              <tr>
                <td>Professional Training</td>
                <td>90-100%</td>
                <td>Nursing, trades, military-style programs.</td>
              </tr>
            </tbody>
          </table>

          <h2>Impact of attendance on grades</h2>
          <ul>
            <li><strong>Direct impact:</strong> 10-20% of grade is often attendance-based.</li>
            <li><strong>Indirect impact:</strong> Miss content, pop quizzes, participation points, notes, announcements.</li>
            <li><strong>Below minimum:</strong> Many professors cap grades at B or C if you fall below required attendance.</li>
            <li><strong>Probation:</strong> Below 75% often triggers academic warning or course failure.</li>
            <li><strong>Professional programs:</strong> Missing more than 3 consecutive classes can mean automatic course failure.</li>
          </ul>

          <h2>Types of absences and their policies</h2>
          <ul>
            <li><strong>Excused absences:</strong> Medical, family emergency, religious observance, official university events. Usually don&apos;t count against attendance.</li>
            <li><strong>Unexcused absences:</strong> Oversleeping, work, personal reasons. Count as absences.</li>
            <li><strong>Late arrivals:</strong> Some professors count being &gt;15 min late as an absence.</li>
            <li><strong>Doctor&apos;s note:</strong> Typically required for more than 2 consecutive medical absences.</li>
          </ul>

          <h2>Strategies to maintain good attendance</h2>
          <ul>
            <li><strong>Set a goal:</strong> Target 95% to build buffer for legitimate absences.</li>
            <li><strong>Calendar reminders:</strong> Set phone alarms 15 minutes before class.</li>
            <li><strong>Study groups:</strong> Attend classes where friends are. Social motivation helps.</li>
            <li><strong>Record lectures:</strong> Ask professor if recordings are available. Knowing you can catch up reduces FOMO.</li>
            <li><strong>Buddy system:</strong> Arrange note-sharing with classmate if you must miss.</li>
            <li><strong>Communicate:</strong> Email professor before absences if possible. Excuses are better than surprises.</li>
          </ul>

          <h2>What happens if you fall below minimum attendance?</h2>
          <ul>
            <li><strong>First warning:</strong> Email from professor or registrar.</li>
            <li><strong>Academic probation:</strong> If you fall below 75%, you may be placed on probation.</li>
            <li><strong>Course withdrawal:</strong> You may be forced to withdraw (affects GPA differently than failing).</li>
            <li><strong>Financial aid impact:</strong> Low attendance can affect enrollment status and financial aid eligibility.</li>
            <li><strong>Grade cap:</strong> Many professors cap final grade at C or D regardless of exam scores.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>U.S. Department of Education attendance impact studies.</li>
            <li>Research on attendance and academic performance correlation.</li>
            <li>Student handbook policies (varies by institution).</li>
            <li>Higher education learning outcome research.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CheckCircle, title: "Classes Attended", sub: "Count so far" },
            { icon: XCircle, title: "Total Classes", sub: "Held to date" },
            { icon: Target, title: "Target %", sub: "Your goal" },
            { icon: AlertCircle, title: "Can Miss", sub: "Classes remaining" },
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
              label="Classes Attended"
              type="number"
              inputMode="numeric"
              min={0}
              value={classesAttended}
              onChange={(e) => setClassesAttended(e.target.value)}
              suffix="classes"
            />
            <Input
              label="Total Classes Held"
              type="number"
              inputMode="numeric"
              min={1}
              value={totalClasses}
              onChange={(e) => setTotalClasses(e.target.value)}
              suffix="classes"
            />
          </div>

          <Input
            label="Target Attendance %"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="5"
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(e.target.value)}
            suffix="%"
          />

          <Input
            label="Future Classes Scheduled"
            type="number"
            inputMode="numeric"
            min={0}
            value={futureClasses}
            onChange={(e) => setFutureClasses(e.target.value)}
            suffix="classes"
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Current Attendance Rate"
                value={formatPercent(result.currentPercentage)}
                highlight
              />
              <ResultCard
                label="Classes You Can Miss"
                value={Math.max(0, result.classesCanMiss).toString()}
                unit="classes"
              />
              <ResultCard
                label="Needed for Target"
                value={result.targetAttendanceClasses.toString()}
                unit="classes"
              />
              <ResultCard
                label="Must Attend Going Forward"
                value={result.futureAttendanceNeeded.toString()}
                unit="out of next classes"
              />
            </ResultsGrid>

            <div
              className={`rounded-lg p-4 ${
                result.currentPercentage >= Number.parseFloat(targetPercentage)
                  ? "border border-green-500/50 bg-green-500/10"
                  : result.classesCanMiss > 0
                    ? "border border-yellow-500/50 bg-yellow-500/10"
                    : "border border-red-500/50 bg-red-500/10"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">
                {result.currentPercentage >= Number.parseFloat(targetPercentage)
                  ? "✅ On Track: You&apos;ve met your target attendance."
                  : result.classesCanMiss > 0
                    ? `⚠️ Warning: You can miss ${Math.max(0, result.classesCanMiss)} more class(es) safely.`
                    : "❌ Risk: You&apos;ve exceeded safe absences. Attend all remaining classes."}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Current: {formatPercent(result.currentPercentage)} | Target: {formatPercent(Number.parseFloat(targetPercentage))}
              </p>
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate attendance percentage.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
