"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import {
  Baby,
  Calendar,
  Heart,
  Activity,
  Clock,
  CalendarDays,
  Info,
} from "lucide-react";

type CalculationMethod = "lmp" | "conception";

const faqs: FAQItem[] = [
  {
    question: "How accurate is a due date calculator?",
    answer:
      "Due date calculators are estimates based on average pregnancy lengths. Only about 4-5% of babies are born exactly on their due date. Most babies arrive within two weeks before or after the estimated due date. The calculator is most accurate when you have regular menstrual cycles and know your exact last menstrual period date. Ultrasound dating in the first trimester can be more accurate, with a margin of error of about 5-7 days.",
  },
  {
    question: "What is Naegele's Rule for calculating due date?",
    answer:
      "Naegele's Rule is the standard method for calculating estimated due date. It works by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). Alternatively, you can subtract 3 months from the LMP and add 7 days. This rule assumes a 28-day menstrual cycle with ovulation occurring on day 14. If your cycle is longer or shorter, adjustments should be made.",
  },
  {
    question: "How do I calculate my due date if I know my conception date?",
    answer:
      "If you know your conception date (the date of ovulation or fertilization), add 266 days (38 weeks) to that date. This is because conception typically occurs about 2 weeks after the first day of your last menstrual period in a standard 28-day cycle. Knowing your exact conception date often provides a more accurate due date than using LMP.",
  },
  {
    question: "What are the three trimesters of pregnancy?",
    answer:
      "Pregnancy is divided into three trimesters: First trimester (weeks 1-12) involves major organ development and highest risk of miscarriage. Second trimester (weeks 13-26) is often called the 'honeymoon period' with less nausea and visible baby movement. Third trimester (weeks 27-40) focuses on baby's growth, brain development, and preparation for birth.",
  },
  {
    question: "Why does cycle length affect my due date?",
    answer:
      "Cycle length affects when you ovulate. In a 28-day cycle, ovulation typically occurs on day 14. If your cycle is 35 days, you likely ovulate around day 21, meaning conception happens a week later than the standard calculation assumes. Adjusting for cycle length can make your due date more accurate by accounting for when you actually conceived.",
  },
  {
    question: "What pregnancy milestones should I expect?",
    answer:
      "Key milestones include: heartbeat detection (6-7 weeks), end of first trimester (12 weeks), feeling first movements/quickening (16-22 weeks), viability milestone (24 weeks), third trimester begins (27 weeks), baby is full-term (37 weeks), and due date (40 weeks). Your healthcare provider will monitor these and other important developmental markers.",
  },
  {
    question: "What if my ultrasound date differs from my calculated due date?",
    answer:
      "First-trimester ultrasounds are considered the most accurate for dating pregnancy. If there's a difference of more than 5-7 days between your LMP-based date and the ultrasound date, your healthcare provider may adjust your due date. Later ultrasounds are less accurate for dating as babies grow at different rates.",
  },
  {
    question: "Can my due date change during pregnancy?",
    answer:
      "Yes, your due date may be adjusted based on ultrasound measurements, especially if done in the first trimester. However, due dates typically aren't changed in the third trimester unless there's a significant discrepancy. Remember, the due date is an estimate—babies come when they're ready, usually between 37-42 weeks.",
  },
];

// Pregnancy milestones with week ranges
const pregnancyMilestones = [
  {
    name: "Heartbeat Detectable",
    weekStart: 6,
    weekEnd: 7,
    icon: Heart,
    description: "Baby's heartbeat can be detected on ultrasound",
  },
  {
    name: "End of First Trimester",
    weekStart: 12,
    weekEnd: 12,
    icon: Calendar,
    description: "Risk of miscarriage decreases significantly",
  },
  {
    name: "Gender Can Be Determined",
    weekStart: 18,
    weekEnd: 20,
    icon: Baby,
    description: "Anatomy scan typically performed",
  },
  {
    name: "First Movements (Quickening)",
    weekStart: 16,
    weekEnd: 22,
    icon: Activity,
    description: "You may feel baby's first movements",
  },
  {
    name: "Viability Milestone",
    weekStart: 24,
    weekEnd: 24,
    icon: Heart,
    description: "Baby has chance of survival if born early",
  },
  {
    name: "Third Trimester Begins",
    weekStart: 27,
    weekEnd: 27,
    icon: Calendar,
    description: "Final stage of pregnancy begins",
  },
  {
    name: "Full Term",
    weekStart: 37,
    weekEnd: 37,
    icon: Baby,
    description: "Baby is considered full-term",
  },
  {
    name: "Due Date",
    weekStart: 40,
    weekEnd: 40,
    icon: CalendarDays,
    description: "Estimated delivery date",
  },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getTrimester(weeks: number): { number: number; name: string; color: string } {
  if (weeks < 1) {
    return { number: 0, name: "Not pregnant yet", color: "text-muted-foreground" };
  } else if (weeks <= 12) {
    return { number: 1, name: "First Trimester", color: "text-purple-600 dark:text-purple-400" };
  } else if (weeks <= 26) {
    return { number: 2, name: "Second Trimester", color: "text-blue-600 dark:text-blue-400" };
  } else {
    return { number: 3, name: "Third Trimester", color: "text-green-600 dark:text-green-400" };
  }
}

function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

export default function DueDateCalculator() {
  const [method, setMethod] = useState<CalculationMethod>("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [conceptionDate, setConceptionDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    setError(null);

    let startDate: Date;
    let adjustmentDays = 0;

    if (method === "lmp") {
      if (!lmpDate) return null;

      startDate = new Date(lmpDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);

      // Validation: LMP should be within the past year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (startDate > today) {
        setError("Last menstrual period date cannot be in the future.");
        return null;
      }

      if (startDate < oneYearAgo) {
        setError("Last menstrual period date should be within the past year.");
        return null;
      }

      // Adjust for cycle length (standard is 28 days)
      const cycleLengthNum = parseInt(cycleLength) || 28;
      if (cycleLengthNum < 20 || cycleLengthNum > 45) {
        setError("Cycle length should be between 20 and 45 days.");
        return null;
      }
      adjustmentDays = cycleLengthNum - 28;

      // Naegele's Rule: Add 280 days from LMP
      // Adjusted for cycle length
      const dueDate = addDays(startDate, 280 + adjustmentDays);
      const today2 = new Date();

      // Calculate gestational age
      const daysSinceLMP = daysBetween(startDate, today2);
      const gestationalDays = daysSinceLMP;
      const gestationalWeeks = Math.floor(gestationalDays / 7);
      const gestationalDaysRemainder = gestationalDays % 7;

      // Days remaining until due date
      const daysRemaining = daysBetween(today2, dueDate);
      const weeksRemaining = Math.floor(Math.max(0, daysRemaining) / 7);

      // Conception date estimate (typically around day 14 of cycle, adjusted for cycle length)
      const ovulationDay = Math.round(cycleLengthNum / 2);
      const estimatedConception = addDays(startDate, ovulationDay);

      // Trimester info
      const trimester = getTrimester(gestationalWeeks);

      // Calculate milestone dates
      const milestones = pregnancyMilestones.map((milestone) => ({
        ...milestone,
        startDate: addDays(startDate, milestone.weekStart * 7),
        endDate: addDays(startDate, milestone.weekEnd * 7),
        isPast: gestationalWeeks >= milestone.weekEnd,
        isCurrent:
          gestationalWeeks >= milestone.weekStart &&
          gestationalWeeks <= milestone.weekEnd,
      }));

      return {
        dueDate,
        gestationalWeeks,
        gestationalDays: gestationalDaysRemainder,
        totalGestationalDays: gestationalDays,
        daysRemaining: Math.max(0, daysRemaining),
        weeksRemaining,
        trimester,
        estimatedConception,
        milestones,
        method: "lmp" as const,
      };
    } else {
      // Conception date method
      if (!conceptionDate) return null;

      const conception = new Date(conceptionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      conception.setHours(0, 0, 0, 0);

      // Validation
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (conception > today) {
        setError("Conception date cannot be in the future.");
        return null;
      }

      if (conception < oneYearAgo) {
        setError("Conception date should be within the past year.");
        return null;
      }

      // Add 266 days from conception (38 weeks)
      const dueDate = addDays(conception, 266);

      // Calculate gestational age (add 14 days to simulate LMP-based counting)
      const simulatedLMP = addDays(conception, -14);
      const daysSinceLMP = daysBetween(simulatedLMP, today);
      const gestationalDays = daysSinceLMP;
      const gestationalWeeks = Math.floor(gestationalDays / 7);
      const gestationalDaysRemainder = gestationalDays % 7;

      // Days remaining
      const daysRemaining = daysBetween(today, dueDate);
      const weeksRemaining = Math.floor(Math.max(0, daysRemaining) / 7);

      // Trimester info
      const trimester = getTrimester(gestationalWeeks);

      // Calculate milestone dates
      const milestones = pregnancyMilestones.map((milestone) => ({
        ...milestone,
        startDate: addDays(simulatedLMP, milestone.weekStart * 7),
        endDate: addDays(simulatedLMP, milestone.weekEnd * 7),
        isPast: gestationalWeeks >= milestone.weekEnd,
        isCurrent:
          gestationalWeeks >= milestone.weekStart &&
          gestationalWeeks <= milestone.weekEnd,
      }));

      return {
        dueDate,
        gestationalWeeks,
        gestationalDays: gestationalDaysRemainder,
        totalGestationalDays: gestationalDays,
        daysRemaining: Math.max(0, daysRemaining),
        weeksRemaining,
        trimester,
        estimatedConception: conception,
        milestones,
        method: "conception" as const,
      };
    }
  }, [method, lmpDate, cycleLength, conceptionDate]);

  const reset = () => {
    setMethod("lmp");
    setLmpDate("");
    setCycleLength("28");
    setConceptionDate("");
    setError(null);
  };

  // Get today's date for max date attribute
  const today = new Date().toISOString().split("T")[0];

  // Get date one year ago for min date attribute
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const minDate = oneYearAgo.toISOString().split("T")[0];

  return (
    <ToolLayout
      title="Due Date Calculator"
      description="Calculate your pregnancy due date based on your last menstrual period (LMP) or conception date. Track your pregnancy week by week and discover important milestones."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="January 2025"
      faqs={faqs}
      relatedTools={[
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "Sleep Calculator", href: "/sleep-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
      ]}
      content={
        <>
          <h2>How Is Your Due Date Calculated?</h2>
          <p>
            Calculating your pregnancy due date is one of the most exciting
            moments of expecting a baby. While the exact moment of birth cannot
            be predicted with certainty, healthcare providers use well-established
            methods to estimate your estimated due date (EDD), giving you a
            target date to prepare for your baby&apos;s arrival.
          </p>
          <p>
            The most common method for calculating due date is based on your
            last menstrual period (LMP). This approach, known as Naegele&apos;s
            Rule, has been used since the early 1800s and remains the standard
            in obstetric practice today. The calculation assumes a pregnancy
            lasts 280 days (40 weeks) from the first day of your last period.
          </p>

          <h2>Understanding Naegele&apos;s Rule</h2>
          <p>
            Dr. Franz Naegele, a German obstetrician, developed this formula in
            1812. The rule is simple: take the first day of your last menstrual
            period, subtract three months, add seven days, and adjust the year
            if necessary. This gives you a due date that&apos;s 280 days from
            your LMP.
          </p>
          <p>
            For example, if your last period started on January 1st, your due
            date would be approximately October 8th. The calculation works
            because, while conception typically occurs about two weeks after
            the start of your period, doctors count pregnancy from the LMP
            since most women don&apos;t know their exact conception date.
          </p>

          <h3>The Standard Formula</h3>
          <ul>
            <li>
              <strong>From LMP:</strong> Add 280 days (40 weeks) to the first
              day of your last menstrual period
            </li>
            <li>
              <strong>From Conception:</strong> Add 266 days (38 weeks) to the
              date of conception
            </li>
            <li>
              <strong>Adjustment:</strong> If your cycle is longer or shorter
              than 28 days, adjust accordingly
            </li>
          </ul>

          <h2>Cycle Length and Its Impact</h2>
          <p>
            Naegele&apos;s Rule assumes a 28-day menstrual cycle with ovulation
            occurring on day 14. However, many women have cycles that are
            longer or shorter. If your cycle is 35 days instead of 28, you
            likely ovulate around day 21 instead of day 14. This seven-day
            difference means your due date should be adjusted later by one week.
          </p>
          <p>
            Our calculator automatically adjusts for your cycle length. Simply
            enter your average cycle length, and the tool will calculate a more
            accurate due date based on when you likely conceived.
          </p>

          <h3>Cycle Length Adjustments</h3>
          <ul>
            <li>
              <strong>Shorter cycles (21-27 days):</strong> Ovulation occurs
              earlier, so due date may be earlier than standard calculation
            </li>
            <li>
              <strong>Standard cycles (28 days):</strong> No adjustment needed
            </li>
            <li>
              <strong>Longer cycles (29-35+ days):</strong> Ovulation occurs
              later, so due date may be later than standard calculation
            </li>
          </ul>

          <h2>Understanding the Three Trimesters</h2>
          <p>
            Pregnancy is divided into three trimesters, each lasting
            approximately 13 weeks. Each trimester brings different changes for
            both mother and baby, with specific milestones and developments to
            look forward to.
          </p>

          <h3>First Trimester (Weeks 1-12)</h3>
          <p>
            The first trimester is a period of rapid development. By week 6,
            your baby&apos;s heart begins beating. By week 12, all major organs
            have formed. This is also when many women experience morning
            sickness, fatigue, and breast tenderness. The risk of miscarriage
            is highest during this period but decreases significantly after
            week 12.
          </p>

          <h3>Second Trimester (Weeks 13-26)</h3>
          <p>
            Often called the &quot;honeymoon period&quot; of pregnancy, many
            women feel their best during the second trimester. Morning sickness
            typically subsides, energy returns, and you&apos;ll likely feel
            your baby&apos;s first movements (quickening) between weeks 16-22.
            The anatomy scan around week 20 can reveal your baby&apos;s gender
            and check for developmental issues.
          </p>

          <h3>Third Trimester (Weeks 27-40)</h3>
          <p>
            The final stretch focuses on your baby&apos;s growth and
            preparation for birth. Your baby gains weight rapidly, and brain
            development accelerates. At 37 weeks, your baby is considered
            full-term. You may experience Braxton Hicks contractions, increased
            fatigue, and difficulty sleeping as your due date approaches.
          </p>

          <h2>How Accurate Are Due Date Calculations?</h2>
          <p>
            While due date calculators provide helpful estimates, it&apos;s
            important to understand their limitations. Only about 4-5% of
            babies are born on their exact due date. Most babies arrive within
            a two-week window before or after the estimated date, which is
            considered normal.
          </p>

          <h3>Factors Affecting Accuracy</h3>
          <ul>
            <li>
              <strong>Irregular cycles:</strong> Women with irregular periods
              may have unpredictable ovulation, making LMP-based calculations
              less accurate
            </li>
            <li>
              <strong>Memory:</strong> Uncertainty about the exact date of your
              last period can affect calculations
            </li>
            <li>
              <strong>Individual variation:</strong> Some women naturally carry
              longer or shorter than 40 weeks
            </li>
            <li>
              <strong>First pregnancies:</strong> First-time mothers often
              deliver slightly later than their due date
            </li>
          </ul>

          <h3>Ultrasound Dating</h3>
          <p>
            First-trimester ultrasounds (before 13 weeks) are considered the
            most accurate method for dating pregnancy, with a margin of error
            of about 5-7 days. During this period, all fetuses grow at nearly
            the same rate, making measurements very reliable. Later
            ultrasounds become less accurate as babies grow at different rates.
          </p>

          <h2>Important Pregnancy Milestones</h2>
          <p>
            Throughout your pregnancy, you&apos;ll reach several important
            milestones. Understanding these can help you track your
            baby&apos;s development and know what to expect at each stage.
          </p>

          <h3>Key Milestones by Week</h3>
          <ul>
            <li>
              <strong>Week 6-7:</strong> Baby&apos;s heartbeat can be detected
              on ultrasound
            </li>
            <li>
              <strong>Week 12:</strong> End of first trimester, risk of
              miscarriage decreases
            </li>
            <li>
              <strong>Week 16-22:</strong> First fetal movements (quickening)
              typically felt
            </li>
            <li>
              <strong>Week 18-20:</strong> Anatomy scan, gender can be
              determined
            </li>
            <li>
              <strong>Week 24:</strong> Viability milestone - baby has a chance
              of survival if born early
            </li>
            <li>
              <strong>Week 27:</strong> Third trimester begins
            </li>
            <li>
              <strong>Week 37:</strong> Baby is considered full-term
            </li>
            <li>
              <strong>Week 40:</strong> Your estimated due date
            </li>
          </ul>

          <h2>What Happens If You Go Past Your Due Date?</h2>
          <p>
            Going past your due date is common, especially for first-time
            mothers. About 50% of pregnancies continue past 40 weeks. Your
            healthcare provider will monitor you closely with additional
            check-ups and may discuss induction options if you reach 41-42
            weeks.
          </p>
          <p>
            Post-term pregnancy (after 42 weeks) can carry increased risks, so
            most providers recommend induction before this point. However, many
            babies arrive naturally shortly after the due date with no
            intervention needed.
          </p>

          <h2>Tips for a Healthy Pregnancy</h2>
          <ul>
            <li>
              <strong>Prenatal care:</strong> Start early and attend all
              scheduled appointments
            </li>
            <li>
              <strong>Nutrition:</strong> Eat a balanced diet rich in folate,
              iron, calcium, and protein
            </li>
            <li>
              <strong>Prenatal vitamins:</strong> Take daily vitamins as
              recommended by your provider
            </li>
            <li>
              <strong>Exercise:</strong> Stay active with pregnancy-safe
              exercises unless advised otherwise
            </li>
            <li>
              <strong>Rest:</strong> Get adequate sleep and listen to your body
            </li>
            <li>
              <strong>Avoid:</strong> Alcohol, smoking, and certain medications
              or foods
            </li>
          </ul>

          <h2>When to Contact Your Healthcare Provider</h2>
          <p>
            While tracking your pregnancy with a due date calculator is
            helpful, remember that every pregnancy is unique. Contact your
            healthcare provider if you experience any concerns, including
            bleeding, severe pain, decreased fetal movement, or signs of
            preterm labor. Regular prenatal visits are essential for monitoring
            both your health and your baby&apos;s development.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Calculation Method Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Calculation Method
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => setMethod("lmp")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                method === "lmp"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-white dark:bg-muted/30 hover:border-primary/50"
              }`}
            >
              <Calendar
                className={`h-5 w-5 ${
                  method === "lmp" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`font-medium ${
                  method === "lmp" ? "text-primary" : "text-foreground"
                }`}
              >
                Last Menstrual Period
              </span>
            </button>
            <button
              onClick={() => setMethod("conception")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                method === "conception"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-white dark:bg-muted/30 hover:border-primary/50"
              }`}
            >
              <Baby
                className={`h-5 w-5 ${
                  method === "conception"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`font-medium ${
                  method === "conception" ? "text-primary" : "text-foreground"
                }`}
              >
                Conception Date
              </span>
            </button>
          </div>
        </div>

        {/* Date Inputs */}
        {method === "lmp" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Day of Last Menstrual Period"
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              max={today}
              min={minDate}
            />
            <Input
              label="Average Cycle Length"
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              placeholder="28"
              suffix="days"
              min={20}
              max={45}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Date of Conception (if known)"
              type="date"
              value={conceptionDate}
              onChange={(e) => setConceptionDate(e.target.value)}
              max={today}
              min={minDate}
            />
            <div className="flex items-end">
              <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30 p-3 text-sm text-blue-700 dark:text-blue-300">
                <Info className="h-4 w-4 inline mr-2" />
                Conception usually occurs 12-16 days after your period starts.
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button onClick={reset} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        {/* Results */}
        {results && !error && (
          <div className="space-y-6 pt-4">
            {/* Main Result - Due Date */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Baby className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Due Date
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatDate(results.dueDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Stats Grid */}
            <ResultsGrid columns={2}>
              <ResultCard
                label="Current Gestational Age"
                value={`${results.gestationalWeeks} weeks, ${results.gestationalDays} days`}
                highlight
              />
              <ResultCard
                label="Weeks Remaining"
                value={
                  results.daysRemaining > 0
                    ? `${results.weeksRemaining} weeks`
                    : "Due!"
                }
              />
            </ResultsGrid>

            {/* Trimester & Conception */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Current Trimester
                  </h3>
                </div>
                <p className={`text-xl font-bold ${results.trimester.color}`}>
                  {results.trimester.name}
                </p>
                {results.trimester.number > 0 && (
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`h-2 flex-1 rounded-full ${
                          num <= results.trimester.number
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <h3 className="font-semibold text-foreground">
                    {results.method === "lmp"
                      ? "Estimated Conception"
                      : "Conception Date"}
                  </h3>
                </div>
                <p className="text-lg font-medium text-foreground">
                  {formatShortDate(results.estimatedConception)}
                </p>
              </div>
            </div>

            {/* Pregnancy Progress */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Pregnancy Progress
                  </h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.min(
                    100,
                    Math.round((results.totalGestationalDays / 280) * 100)
                  )}
                  % complete
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (results.totalGestationalDays / 280) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Week 0</span>
                <span>Week 13</span>
                <span>Week 27</span>
                <span>Week 40</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Pregnancy Milestones
              </h3>
              <div className="space-y-3">
                {results.milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                        milestone.isCurrent
                          ? "border-primary bg-primary/5"
                          : milestone.isPast
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-border bg-white dark:bg-muted/20"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          milestone.isCurrent
                            ? "bg-primary/10"
                            : milestone.isPast
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            milestone.isCurrent
                              ? "text-primary"
                              : milestone.isPast
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-medium ${
                              milestone.isCurrent
                                ? "text-primary"
                                : milestone.isPast
                                ? "text-green-700 dark:text-green-400"
                                : "text-foreground"
                            }`}
                          >
                            {milestone.name}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {milestone.weekStart === milestone.weekEnd
                              ? `Week ${milestone.weekStart}`
                              : `Weeks ${milestone.weekStart}-${milestone.weekEnd}`}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {milestone.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatShortDate(milestone.startDate)}
                          {milestone.weekStart !== milestone.weekEnd &&
                            ` - ${formatShortDate(milestone.endDate)}`}
                        </p>
                      </div>
                      {milestone.isPast && !milestone.isCurrent && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          ✓
                        </span>
                      )}
                      {milestone.isCurrent && (
                        <span className="text-xs font-medium text-primary">
                          Now
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/30 p-4 text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> This calculator provides an estimate
              only. Your actual due date may vary. Please consult with your
              healthcare provider for accurate dating based on ultrasound and
              other clinical factors.
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
