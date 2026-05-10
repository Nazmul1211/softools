"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { BookOpen, Clock, Target, AlertCircle } from "lucide-react";

interface StudyTimeResult {
  totalHours: number;
  hoursPerDay: number;
  weeksNeeded: number;
  hoursPerWeek: number;
}

const faqs: FAQItem[] = [
  {
    question: "How is study time calculated?",
    answer:
      "Study time is based on the rule: Study Hours = Content Hours × Difficulty Multiplier. Difficulty ranges from 1 (easy review) to 3+ (complex new material). Time is adjusted by your learning efficiency (how much you retain per hour). Average students: 1.5x rule (1.5 hours study per 1 hour of content).",
  },
  {
    question: "What is a realistic study multiplier?",
    answer:
      "Multipliers: Familiar subjects (1-1.5x), moderate difficulty (1.5-2x), advanced/new material (2-3x), highly technical (3-4x). For example, reviewing familiar math is 1x, learning new calculus is 2.5x. Consider your learning speed: fast learners use lower multipliers, slower learners need higher values.",
  },
  {
    question: "How many hours per day is reasonable?",
    answer:
      "Research shows effective study is 4-6 hours per day for most students. Beyond 6 hours, diminishing returns occur. Consider: class time (often counts toward total), breaks (take 10-15 min every 50 min), sleep (never sacrifice sleep for studying), and other commitments.",
  },
  {
    question: "Should I include class time in my study calculations?",
    answer:
      "Generally, class time replaces about 50% of study hours. A 1-hour lecture ≈ 30-45 min of focused studying. So: Total Study = (Class Hours × 0.5) + Self-Study Hours. If you have 3 hours of lectures, you need ~1.5-2 additional study hours.",
  },
  {
    question: "How does spacing affect study time?",
    answer:
      "Spaced repetition (studying over weeks) is 2-3x more efficient than cramming. Studying 1 hour/day for 10 days > studying 10 hours in one night. If you have 8 weeks, you need fewer total hours than if you have 1 week (cramming requires 1.5-2x more time).",
  },
  {
    question: "What if I&apos;m a slow learner or have a learning disability?",
    answer:
      "Use a higher multiplier (2.5-4x). Allocate more time for breaks. Consider: tutoring time as study time, extended testing accommodations, active learning methods (flashcards, practice problems > passive reading). Study fewer hours with higher focus beats cramming.",
  },
];

export default function StudyTimeCalculatorPage() {
  const [contentHours, setContentHours] = useState("40");
  const [difficultyMultiplier, setDifficultyMultiplier] = useState("2.0");
  const [availableWeeks, setAvailableWeeks] = useState("8");
  const [hoursPerDay, setHoursPerDay] = useState("2");

  const result = useMemo<StudyTimeResult | null>(() => {
    const content = Number.parseFloat(contentHours);
    const difficulty = Number.parseFloat(difficultyMultiplier);
    const weeks = Number.parseFloat(availableWeeks);
    const dailyHours = Number.parseFloat(hoursPerDay);

    if (
      !Number.isFinite(content) ||
      !Number.isFinite(difficulty) ||
      !Number.isFinite(weeks) ||
      !Number.isFinite(dailyHours) ||
      content <= 0 ||
      difficulty <= 0 ||
      weeks <= 0 ||
      dailyHours <= 0
    ) {
      return null;
    }

    const totalHours = content * difficulty;
    const weeklyHours = totalHours / weeks;
    const requiredHoursPerDay = weeklyHours / 5;

    return {
      totalHours,
      hoursPerDay: requiredHoursPerDay,
      weeksNeeded: weeks,
      hoursPerWeek: weeklyHours,
    };
  }, [contentHours, difficultyMultiplier, availableWeeks, hoursPerDay]);

  return (
    <ToolLayout
      title="Study Time Calculator"
      slug="study-time-calculator"
      description="Calculate total study hours needed based on course content, difficulty, and available time. Plan effective study schedules."
      category={{ name: "Education Tools", slug: "education-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Estimate content hours",
          text: "Total hours of course content, lectures, or material to cover.",
        },
        {
          name: "Set difficulty multiplier",
          text: "Choose 1.5 (review), 2.0 (moderate), 2.5 (advanced), or 3+ (highly technical).",
        },
        {
          name: "Enter available time",
          text: "How many weeks/days you have to prepare for exam or project.",
        },
        {
          name: "See required hours",
          text: "View total hours needed, daily schedule, and feasibility check.",
        },
      ]}
      relatedTools={[
        { name: "Attendance Percentage Calculator", href: "/attendance-percentage-calculator/" },
        { name: "Final Grade Calculator", href: "/final-grade-calculator/" },
        { name: "CGPA to Percentage Converter", href: "/cgpa-to-percentage-calculator/" },
        { name: "Semester Grade Calculator", href: "/semester-grade-calculator/" },
      ]}
      content={
        <>
          <h2>How much time should you study?</h2>
          <p>
            Study time depends on three factors: content volume (how much material to learn), difficulty (how hard it is), and available time
            (when your exam/deadline is). The rule of thumb is: <strong>Study Hours = Content Hours × Difficulty Multiplier</strong>.
          </p>

          <h2>Study time formula</h2>
          <p>
            <strong>Required Study Hours = Course Content Hours × Difficulty Multiplier</strong>
          </p>
          <p>
            Then divide by available weeks and study days (typically 5 days/week) to get daily hours needed.
          </p>
          <p>
            <strong>Daily Hours Needed = Total Hours ÷ (Weeks × 5 study days)</strong>
          </p>
          <p>
            Example: 40 hours of content × 2.0 difficulty = 80 hours total. With 8 weeks: 80 ÷ (8 × 5) = 2 hours/day.
          </p>

          <h2>Difficulty multiplier guide</h2>
          <table>
            <thead>
              <tr>
                <th>Difficulty Level</th>
                <th>Multiplier</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Easy (Review)</td>
                <td>1.0–1.5x</td>
                <td>Familiar subjects, refresher courses, AP tests you&apos;ve prepped for</td>
              </tr>
              <tr>
                <td>Moderate</td>
                <td>1.5–2.0x</td>
                <td>Regular college courses, new but straightforward material</td>
              </tr>
              <tr>
                <td>Advanced</td>
                <td>2.0–2.5x</td>
                <td>Upper-level courses, new concepts, hands-on labs</td>
              </tr>
              <tr>
                <td>Technical/Complex</td>
                <td>2.5–3.5x</td>
                <td>Calculus, organic chemistry, programming, engineering</td>
              </tr>
              <tr>
                <td>Highly Specialized</td>
                <td>3.5+x</td>
                <td>Med school prerequisites, research, mastery-level learning</td>
              </tr>
            </tbody>
          </table>

          <h2>Study schedule examples</h2>
          <ul>
            <li><strong>Scenario 1 (Early prep):</strong> 40 hours content, 2.0 difficulty, 12 weeks available = 80 total hours ÷ 60 study days = 1.3 hours/day (very manageable).</li>
            <li><strong>Scenario 2 (Last minute):</strong> Same 80 hours, only 2 weeks = 80 ÷ 10 days = 8 hours/day (unsustainable, cramming penalty applies).</li>
            <li><strong>Scenario 3 (Advanced topic):</strong> 30 hours content, 3.0 difficulty, 6 weeks = 90 total hours ÷ 30 days = 3 hours/day.</li>
          </ul>

          <h2>Factors that affect study time</h2>
          <ul>
            <li><strong>Learning speed:</strong> Fast learners use 1.5x multiplier, average use 2.0x, slower learners need 2.5-3x.</li>
            <li><strong>Prior knowledge:</strong> Familiarity with related topics reduces multiplier by 0.5x.</li>
            <li><strong>Teaching quality:</strong> Good lectures/explanations reduce study time needed by 20-30%.</li>
            <li><strong>Active vs. passive:</strong> Active learning (problems, flashcards) needs less time than passive (reading, videos).</li>
            <li><strong>Spaced repetition:</strong> Studying over 8 weeks is 2-3x more efficient than cramming in 1 week.</li>
            <li><strong>Sleep and breaks:</strong> Quality sleep and regular breaks improve retention and reduce total hours needed.</li>
          </ul>

          <h2>Study time myths and facts</h2>
          <ul>
            <li><strong>Myth:</strong> More study = better grades. <strong>Fact:</strong> Quality &gt; quantity. 2 focused hours &gt; 6 distracted hours.</li>
            <li><strong>Myth:</strong> Cramming is efficient. <strong>Fact:</strong> Spaced study is 2-3x more efficient. Cramming requires 50% more hours.</li>
            <li><strong>Myth:</strong> All students study at the same pace. <strong>Fact:</strong> Learning speeds vary 2-3x between individuals.</li>
            <li><strong>Myth:</strong> Reading = studying. <strong>Fact:</strong> Active learning (practice problems, self-testing) is 3-5x more effective.</li>
            <li><strong>Myth:</strong> Overnight studying doesn&apos;t hurt. <strong>Fact:</strong> Sleep deprivation reduces learning by 30% and memory retention by 50%.</li>
          </ul>

          <h2>How to study smarter, not longer</h2>
          <ul>
            <li><strong>Use active learning:</strong> Practice problems, flashcards, self-quizzing beat passive reading by 3-5x.</li>
            <li><strong>Space your study:</strong> 1 hour/day for 8 weeks &gt;&gt; 40 hours in 1 week (cramming penalty: +50% hours needed).</li>
            <li><strong>Teach others:</strong> Teaching 25% of your study time improves retention by 70%.</li>
            <li><strong>Sleep:</strong> 7-9 hours sleep. Sleep deprivation reduces learning and memory.</li>
            <li><strong>Breaks:</strong> 50-minute study + 10-minute break cycles are optimal (Pomodoro Technique).</li>
            <li><strong>Identify weak areas:</strong> Focus more time on difficult topics, less on mastered content.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>Learning Sciences research on spaced repetition and active recall.</li>
            <li>Cal Newport&apos;s "Deep Work" study time recommendations.</li>
            <li>Bloom&apos;s Taxonomy learning objectives and time allocation.</li>
            <li>Pomodoro Technique and attention span research.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, title: "Content Hours", sub: "Material to learn" },
            { icon: Target, title: "Difficulty", sub: "Complexity multiplier" },
            { icon: Clock, title: "Time Allowed", sub: "Weeks available" },
            { icon: AlertCircle, title: "Schedule Check", sub: "Hours per day" },
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
            label="Total Content Hours"
            type="number"
            inputMode="numeric"
            min={1}
            value={contentHours}
            onChange={(e) => setContentHours(e.target.value)}
            suffix="hours"
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <label className="block text-sm font-semibold text-foreground mb-3">Difficulty Level</label>
            <div className="space-y-2">
              {[
                { label: "Easy/Review (1.0x)", value: "1.0" },
                { label: "Moderate (1.5x)", value: "1.5" },
                { label: "Regular Course (2.0x)", value: "2.0" },
                { label: "Advanced (2.5x)", value: "2.5" },
                { label: "Technical/Hard (3.0x)", value: "3.0" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="difficulty"
                    value={value}
                    checked={difficultyMultiplier === value}
                    onChange={(e) => setDifficultyMultiplier(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Weeks Available"
            type="number"
            inputMode="numeric"
            min={1}
            value={availableWeeks}
            onChange={(e) => setAvailableWeeks(e.target.value)}
            suffix="weeks"
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Total Study Hours Needed"
                value={Math.round(result.totalHours).toString()}
                unit="hours"
                highlight
              />
              <ResultCard
                label="Hours Per Week"
                value={Math.round(result.hoursPerWeek).toString()}
                unit="hours"
              />
              <ResultCard
                label="Hours Per Day (5-day week)"
                value={Math.round(result.hoursPerDay * 10) / 10}
                unit="hours"
              />
              <ResultCard
                label="Feasibility"
                value={result.hoursPerDay > 6 ? "Challenging" : result.hoursPerDay > 4 ? "Moderate" : "Manageable"}
              />
            </ResultsGrid>

            <div
              className={`rounded-lg p-4 ${
                result.hoursPerDay > 6
                  ? "border border-red-500/50 bg-red-500/10"
                  : result.hoursPerDay > 4
                    ? "border border-yellow-500/50 bg-yellow-500/10"
                    : "border border-green-500/50 bg-green-500/10"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">
                {result.hoursPerDay > 6
                  ? "⚠️ High intensity. Consider more time, reduce scope, or increase difficulty expectation."
                  : result.hoursPerDay > 4
                    ? "🟡 Moderate. Plan carefully and minimize distractions."
                    : "✅ Achievable. Well-paced study plan recommended."}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You need {Math.round(result.totalHours)} hours across {Math.round(result.weeksNeeded)} weeks,
                which is {Math.round(result.hoursPerDay * 10) / 10} hours per day (5-day study weeks).
              </p>
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate study time needed.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
