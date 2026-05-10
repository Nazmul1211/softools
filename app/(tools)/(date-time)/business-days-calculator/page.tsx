"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { CalendarDays, BriefcaseBusiness, Plus, Minus, Building2 } from "lucide-react";

type Mode = "count" | "shift";
type Direction = "add" | "subtract";

const faqs: FAQItem[] = [
  {
    question: "How is a business day defined in this calculator?",
    answer:
      "A business day is counted as Monday through Friday. Saturday and Sunday are excluded. If you enable US federal holiday exclusions, observed federal holidays are also removed from the count. This gives you a practical working-day estimate for planning projects, SLAs, payroll cutoffs, and office operations.",
  },
  {
    question: "What does inclusive counting mean for date ranges?",
    answer:
      "Inclusive counting includes both the start date and end date in the evaluation window. Exclusive counting measures the days between those boundaries. Depending on your legal, contract, or operations workflow, this can change your deadline by one day, so the toggle helps align the result to your exact policy.",
  },
  {
    question: "Can I add or subtract business days from a date?",
    answer:
      "Yes. Use the Add/Subtract mode to move forward or backward by business days only. Weekends and optional federal holidays are skipped automatically. This is useful when contracts specify terms like &quot;respond within 5 business days&quot; or when internal teams use weekday-based delivery commitments.",
  },
  {
    question: "Does this include global public holidays?",
    answer:
      "No. The built-in holiday logic supports US federal holidays for broad practical use. International, regional, and company-specific holiday calendars vary widely. For critical legal or finance workflows, you should validate final deadlines with the relevant jurisdiction or internal policy calendar.",
  },
  {
    question: "Why is this different from a simple days-between tool?",
    answer:
      "Simple date difference tools usually return calendar days. Business-day tools apply weekday logic and optional holiday exclusions, which is what most operations teams, client contracts, and payroll workflows need. That difference can be material for short deadlines, especially around weekends and holiday periods.",
  },
  {
    question: "Can this help with payroll and invoicing schedules?",
    answer:
      "Absolutely. Business-day calculations are common in invoice terms (Net 15/30 business days), payroll run calendars, and service-level commitments. Use this calculator to forecast due dates, reconcile vendor timelines, and avoid preventable late fees or SLA misses caused by calendar-day assumptions.",
  },
];

function observedDate(year: number, month: number, day: number): Date {
  const date = new Date(Date.UTC(year, month, day));
  const weekday = date.getUTCDay();
  if (weekday === 0) date.setUTCDate(date.getUTCDate() + 1);
  if (weekday === 6) date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): Date {
  const date = new Date(Date.UTC(year, month, 1));
  let count = 0;
  while (date.getUTCMonth() === month) {
    if (date.getUTCDay() === weekday) {
      count++;
      if (count === nth) return new Date(date);
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return new Date(Date.UTC(year, month, 1));
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const date = new Date(Date.UTC(year, month + 1, 0));
  while (date.getUTCDay() !== weekday) {
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return new Date(date);
}

function usFederalHolidaySet(year: number): Set<string> {
  const holidays = [
    observedDate(year, 0, 1), // New Year's Day
    nthWeekdayOfMonth(year, 0, 1, 3), // MLK Day
    nthWeekdayOfMonth(year, 1, 1, 3), // Presidents Day
    lastWeekdayOfMonth(year, 4, 1), // Memorial Day
    observedDate(year, 5, 19), // Juneteenth
    observedDate(year, 6, 4), // Independence Day
    nthWeekdayOfMonth(year, 8, 1, 1), // Labor Day
    nthWeekdayOfMonth(year, 9, 1, 2), // Columbus Day
    observedDate(year, 10, 11), // Veterans Day
    nthWeekdayOfMonth(year, 10, 4, 4), // Thanksgiving
    observedDate(year, 11, 25), // Christmas
  ];
  return new Set(holidays.map((date) => date.toISOString().slice(0, 10)));
}

function isBusinessDay(date: Date, excludeUSHolidays: boolean, holidaySets: Map<number, Set<string>>): boolean {
  const day = date.getUTCDay();
  if (day === 0 || day === 6) return false;
  if (!excludeUSHolidays) return true;
  const year = date.getUTCFullYear();
  if (!holidaySets.has(year)) {
    holidaySets.set(year, usFederalHolidaySet(year));
  }
  return !holidaySets.get(year)?.has(date.toISOString().slice(0, 10));
}

export default function BusinessDaysCalculatorPage() {
  const [mode, setMode] = useState<Mode>("count");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 30);
    return future.toISOString().slice(0, 10);
  });
  const [includeEndDate, setIncludeEndDate] = useState(true);
  const [excludeUSHolidays, setExcludeUSHolidays] = useState(false);
  const [shiftDays, setShiftDays] = useState(10);
  const [direction, setDirection] = useState<Direction>("add");

  const countResults = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

    const [early, late] = start <= end ? [start, end] : [end, start];
    const target = new Date(late);
    if (includeEndDate) target.setUTCDate(target.getUTCDate() + 1);

    let businessDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    let totalDays = 0;

    const holidaySets = new Map<number, Set<string>>();
    const cursor = new Date(early);

    while (cursor < target) {
      totalDays++;
      const day = cursor.getUTCDay();
      const isWeekend = day === 0 || day === 6;
      if (isWeekend) {
        weekendDays++;
      } else if (!isBusinessDay(cursor, excludeUSHolidays, holidaySets)) {
        holidayDays++;
      } else {
        businessDays++;
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return {
      totalDays,
      businessDays,
      weekendDays,
      holidayDays,
      workingWeeks: businessDays / 5,
      reversed: start > end,
    };
  }, [startDate, endDate, includeEndDate, excludeUSHolidays]);

  const shiftResult = useMemo(() => {
    if (!startDate) return null;
    const base = new Date(`${startDate}T00:00:00Z`);
    if (Number.isNaN(base.getTime())) return null;

    const holidaySets = new Map<number, Set<string>>();
    const cursor = new Date(base);
    let remaining = Math.max(0, shiftDays);
    const step = direction === "add" ? 1 : -1;

    while (remaining > 0) {
      cursor.setUTCDate(cursor.getUTCDate() + step);
      if (isBusinessDay(cursor, excludeUSHolidays, holidaySets)) {
        remaining--;
      }
    }

    return {
      resultDate: cursor.toISOString().slice(0, 10),
      dayName: cursor.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    };
  }, [startDate, shiftDays, direction, excludeUSHolidays]);

  return (
    <ToolLayout
      title="Business Days Calculator"
      slug="business-days-calculator"
      description="Count business days between dates or add/subtract working days from a date. Optional US federal holiday exclusion included for more practical deadline planning."
      category={{ name: "Date & Time", slug: "date-time" }}
      relatedTools={[
        { name: "Date Calculator", href: "/date-calculator/" },
        { name: "Time Card Calculator", href: "/time-card-calculator/" },
        { name: "Hours Calculator", href: "/hours-calculator/" },
        { name: "Countdown Timer", href: "/countdown-timer/" },
      ]}
      howToSteps={[
        { name: "Pick mode", text: "Choose date-range counting or business-day shifting." },
        { name: "Set dates", text: "Add start and end dates, then choose inclusive behavior." },
        { name: "Apply holiday rules", text: "Enable US federal holiday exclusion when needed." },
        { name: "Use the result", text: "Use business-day output for deadlines and scheduling." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this business days calculator does</h2>
          <p>
            This tool solves two common planning problems: counting the number of business days between two dates and
            shifting a date forward or backward by a specific number of working days. It excludes weekends by default
            and can also exclude observed US federal holidays. The result is suitable for project timelines, invoicing
            terms, operations planning, and service-level agreements that are written in business-day language.
          </p>

          <h2>How business-day logic works</h2>
          <p>
            Calendar days and business days are not interchangeable. Business-day rules skip Saturdays and Sundays, and
            often skip recognized public holidays. This means short deadlines around long weekends can be very different
            from calendar-day counts. In operations teams, this difference affects delivery targets, legal response
            windows, and payment obligations.
          </p>

          <h2>Count mode vs add/subtract mode</h2>
          <p>
            In count mode, the calculator returns total days, business days, weekend days, and optional holiday days
            for a date range. In add/subtract mode, it finds the target date after moving a set number of business
            days. This is useful for statements like &quot;issue a response within 7 business days&quot; or &quot;pay
            invoice in 15 business days.&quot;
          </p>

          <h2>Inclusive vs exclusive date handling</h2>
          <p>
            Inclusive counting includes the end boundary in the range. Exclusive counting measures only the days
            between boundaries. Different industries and contract templates use different rules. If your SLA, MSA, or
            procurement policy specifies &quot;inclusive&quot; counting, enable that option before finalizing a
            deadline.
          </p>

          <h2>US holiday handling</h2>
          <p>
            When holiday exclusion is enabled, observed US federal holiday dates are removed from business-day totals.
            Observed dates matter because if a holiday lands on a weekend, offices typically observe it on an adjacent
            weekday. This calculator reflects that behavior to produce a more operationally accurate output.
          </p>

          <h2>Practical use cases</h2>
          <ul>
            <li>Accounts receivable and invoice due-date forecasting.</li>
            <li>Customer support SLA commitments measured in business days.</li>
            <li>Project milestone planning with weekday-only execution windows.</li>
            <li>HR onboarding and payroll processing timelines.</li>
            <li>Legal or compliance response windows that exclude weekends.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>U.S. Office of Personnel Management: Federal holiday schedule.</li>
            <li>NIST: Calendar and date/time standards references.</li>
            <li>ISO 8601 date representation principles for unambiguous formatting.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, title: "Range Counting", sub: "Business vs calendar days" },
            { icon: Plus, title: "Date Shifting", sub: "Add business days" },
            { icon: Minus, title: "Reverse Planning", sub: "Subtract business days" },
            { icon: Building2, title: "Office Logic", sub: "Optional US holiday exclusions" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button
            onClick={() => setMode("count")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
              mode === "count" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <BriefcaseBusiness className="mr-2 inline h-4 w-4" />
            Count Business Days
          </button>
          <button
            onClick={() => setMode("shift")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
              mode === "shift" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <CalendarDays className="mr-2 inline h-4 w-4" />
            Add/Subtract Days
          </button>
        </div>

        {mode === "count" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={includeEndDate}
                  onChange={(event) => setIncludeEndDate(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Include end date
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={excludeUSHolidays}
                  onChange={(event) => setExcludeUSHolidays(event.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Exclude US federal holidays
              </label>
            </div>
            {countResults && (
              <>
                {countResults.reversed && (
                  <p className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
                    Start date is after end date. Showing absolute range results.
                  </p>
                )}
                <ResultsGrid columns={2}>
                  <ResultCard label="Business Days" value={countResults.businessDays} highlight />
                  <ResultCard label="Total Calendar Days" value={countResults.totalDays} />
                  <ResultCard label="Weekend Days" value={countResults.weekendDays} />
                  <ResultCard label="Holiday Days Excluded" value={countResults.holidayDays} />
                </ResultsGrid>
                <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
                  Equivalent working weeks:{" "}
                  <span className="font-semibold text-foreground">{countResults.workingWeeks.toFixed(2)}</span>
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Reference Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input
                label="Business Days"
                type="number"
                min={0}
                value={shiftDays}
                onChange={(event) => setShiftDays(Number(event.target.value))}
              />
            </div>
            <div className="flex gap-2 rounded-lg bg-muted p-1">
              <button
                onClick={() => setDirection("add")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                  direction === "add" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Add
              </button>
              <button
                onClick={() => setDirection("subtract")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                  direction === "subtract" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Minus className="mr-2 inline h-4 w-4" />
                Subtract
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={excludeUSHolidays}
                onChange={(event) => setExcludeUSHolidays(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Exclude US federal holidays
            </label>
            {shiftResult && (
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Resulting business date</p>
                <p className="text-3xl font-bold text-primary">{shiftResult.resultDate}</p>
                <p className="text-sm text-muted-foreground mt-2">{shiftResult.dayName}</p>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
