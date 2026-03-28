"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: number;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      setResult(null);
      return;
    }

    if (birth > target) {
      setResult(null);
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    const nextBirthday = new Date(
      target.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    );

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: daysUntilBirthday,
    });
  };

  const reset = () => {
    setBirthDate("");
    setTargetDate(new Date().toISOString().split("T")[0]);
    setResult(null);
  };

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days. Also find out how many days until your next birthday."
      category={{ name: "Date & Time", slug: "date-time" }}
      relatedTools={[
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Loan Calculator", href: "/loan-calculator" },
      ]}
      content={
        <>
          <h2>How Does the Age Calculator Work?</h2>
          <p>
            This age calculator determines your exact age by computing the difference between your date of birth and a target date (defaulting to today). It calculates years, months, and days using calendar-aware logic that properly accounts for varying month lengths (28–31 days) and leap years. Unlike a simple day-count division, this method gives you the precise breakdown that matches how humans naturally measure age.
          </p>

          <h2>Understanding the Calculation</h2>
          <p>
            The algorithm works by comparing three components independently:
          </p>
          <ul>
            <li><strong>Years:</strong> The difference between the target year and birth year, adjusted downward by one if the target month/day hasn&apos;t reached the birth month/day yet (meaning you haven&apos;t had your birthday this year).</li>
            <li><strong>Months:</strong> The remaining month difference after full years are counted, adjusted for day overflow.</li>
            <li><strong>Days:</strong> The remaining day difference. If the target day is less than the birth day, the calculator borrows from the previous month, using that month&apos;s actual length (e.g., February has 28 or 29 days).</li>
          </ul>

          <h2>Use Cases for an Age Calculator</h2>
          <ul>
            <li><strong>Legal age verification:</strong> Determine if someone meets the minimum age for driving (16–18), voting (18), drinking (21 in the US), or retirement (62–67).</li>
            <li><strong>Insurance and healthcare:</strong> Age is a key factor in life insurance premiums, health insurance eligibility (Medicare at 65), and medical risk assessments.</li>
            <li><strong>Education enrollment:</strong> Many schools have strict age cutoff dates for kindergarten entry (typically age 5 by September 1st).</li>
            <li><strong>Retirement planning:</strong> Calculate exactly how many years, months, and days remain until you reach your target retirement age.</li>
            <li><strong>Visa and passport applications:</strong> Immigration forms frequently require your exact age in years, months, and days as of the date of application.</li>
          </ul>

          <h2>Additional Metrics Explained</h2>
          <ul>
            <li><strong>Total Days:</strong> The absolute number of days you have been alive. A 30-year-old has lived approximately 10,957 days.</li>
            <li><strong>Total Weeks:</strong> Your age expressed in weeks. At 25 years old, you have lived approximately 1,304 weeks.</li>
            <li><strong>Total Months:</strong> Your age in calendar months. This is useful for infant milestones (pediatricians measure development in months for the first 2–3 years).</li>
            <li><strong>Days Until Next Birthday:</strong> A fun countdown to your next celebration. This accounts for leap years and variable month lengths.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>How does the calculator handle leap years?</h3>
          <p>
            The calculator uses JavaScript&apos;s built-in Date object, which fully accounts for leap years. If you were born on February 29 (a leap day), the calculator correctly computes your age for both leap and non-leap target years.
          </p>

          <h3>Can I calculate age for a future date?</h3>
          <p>
            Yes. By changing the &quot;Calculate Age As Of&quot; field to a future date, you can determine how old you (or anyone) will be on that specific date. This is useful for retirement planning, milestone events, or legal age thresholds.
          </p>

          <h3>Why might my age differ by one day from another calculator?</h3>
          <p>
            Different age calculators use slightly different conventions for counting partial days. Some count the birth date as &quot;day zero&quot; (exclusive) while others count it as &quot;day one&quot; (inclusive). This can cause a one-day discrepancy. Our calculator uses the standard convention consistent with most legal and medical systems.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Date of Birth"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <Input
            label="Calculate Age As Of"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={calculateAge} size="lg">
            Calculate Age
          </Button>
          <Button onClick={reset} variant="outline" size="lg">
            Reset
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 dark:border-primary/50 dark:bg-primary/20">
              <p className="text-sm text-primary dark:text-primary">Your Age</p>
              <p className="mt-1 text-3xl font-bold text-primary/80 dark:text-primary/80">
                {result.years} years, {result.months} months, {result.days} days
              </p>
            </div>

            <ResultsGrid columns={4}>
              <ResultCard label="Total Years" value={result.years} />
              <ResultCard label="Total Months" value={result.totalMonths} />
              <ResultCard label="Total Weeks" value={result.totalWeeks.toLocaleString()} />
              <ResultCard label="Total Days" value={result.totalDays.toLocaleString()} />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Days until next birthday
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground dark:text-foreground">
                    {result.nextBirthday} days
                  </p>
                </div>
                <div className="text-4xl">🎂</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
