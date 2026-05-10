"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Clock, Wallet, CalendarRange, BriefcaseBusiness, RefreshCw } from "lucide-react";

interface DayEntry {
  day: string;
  start: string;
  end: string;
  breakMinutes: number;
}

const defaultWeek: DayEntry[] = [
  { day: "Monday", start: "09:00", end: "17:30", breakMinutes: 30 },
  { day: "Tuesday", start: "09:00", end: "17:30", breakMinutes: 30 },
  { day: "Wednesday", start: "09:00", end: "17:30", breakMinutes: 30 },
  { day: "Thursday", start: "09:00", end: "17:30", breakMinutes: 30 },
  { day: "Friday", start: "09:00", end: "17:30", breakMinutes: 30 },
  { day: "Saturday", start: "", end: "", breakMinutes: 0 },
  { day: "Sunday", start: "", end: "", breakMinutes: 0 },
];

const faqs: FAQItem[] = [
  {
    question: "How does this time card calculator handle breaks?",
    answer:
      "Break minutes are deducted from each day&apos;s worked duration after start/end time is calculated. This reflects how payroll systems usually treat unpaid breaks. If your employer uses paid breaks, set break minutes to zero or adjust your schedule line to match your paid-time policy.",
  },
  {
    question: "Can this calculate overnight shifts?",
    answer:
      "Yes. If an end time is earlier than the start time, the calculator treats it as an overnight shift into the next day. This supports hospitality, healthcare, security, and operations teams that run night schedules and need accurate daily and weekly payroll totals.",
  },
  {
    question: "Does it support overtime calculations?",
    answer:
      "Yes. The tool supports weekly overtime above 40 hours and an optional daily overtime rule above a custom daily threshold. To avoid double counting, overtime is calculated from the larger of weekly-overtime hours or daily-overtime total. This is practical for many payroll policy comparisons.",
  },
  {
    question: "What if I have variable schedules each week?",
    answer:
      "This tool is built for exactly that. Update daily rows for each real shift, then compare totals week by week. You can also duplicate a baseline schedule manually and adjust only days that changed, which makes variable overtime forecasting and budgeting significantly easier.",
  },
  {
    question: "Can I use this for freelancer invoicing?",
    answer:
      "Absolutely. Set your hourly rate and use the output gross pay as your weekly labor value. If you invoice with different client rates, run separate scenarios for each rate or track one client per sheet. This makes it useful beyond payroll for contract and agency billing workflows.",
  },
  {
    question: "Why might payroll still differ from this output?",
    answer:
      "Employer payroll systems may apply rules for rounding, paid/unpaid break handling, holiday premiums, local overtime laws, and deduction timing. This calculator provides a transparent estimate and planning baseline. For final payroll values, always reconcile against your official payslip or payroll export.",
  },
];

function toMinutes(time: string): number | null {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function formatHours(value: number): string {
  return value.toFixed(2);
}

function formatHoursMinutes(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const hh = Math.floor(totalMinutes / 60);
  const mm = Math.abs(totalMinutes % 60);
  return `${hh}h ${mm}m`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function TimeCardCalculatorPage() {
  const [entries, setEntries] = useState<DayEntry[]>(defaultWeek);
  const [hourlyRate, setHourlyRate] = useState(28);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [useDailyOvertime, setUseDailyOvertime] = useState(false);
  const [dailyOvertimeThreshold, setDailyOvertimeThreshold] = useState(8);

  const summary = useMemo(() => {
    const dayDetails = entries.map((entry) => {
      const startMinutes = toMinutes(entry.start);
      const endMinutes = toMinutes(entry.end);
      if (startMinutes === null || endMinutes === null) {
        return { ...entry, workedHours: 0 };
      }

      let duration = endMinutes - startMinutes;
      if (duration < 0) duration += 24 * 60;
      duration = Math.max(0, duration - Math.max(0, entry.breakMinutes));
      const workedHours = duration / 60;
      return { ...entry, workedHours };
    });

    const totalHours = dayDetails.reduce((acc, day) => acc + day.workedHours, 0);
    const dailyOvertimeHours = useDailyOvertime
      ? dayDetails.reduce((acc, day) => acc + Math.max(0, day.workedHours - dailyOvertimeThreshold), 0)
      : 0;
    const weeklyOvertimeHours = Math.max(0, totalHours - 40);
    const overtimeHours = Math.min(totalHours, Math.max(dailyOvertimeHours, weeklyOvertimeHours));
    const regularHours = Math.max(0, totalHours - overtimeHours);
    const grossPay = regularHours * hourlyRate + overtimeHours * hourlyRate * overtimeMultiplier;

    return {
      dayDetails,
      totalHours,
      regularHours,
      overtimeHours,
      grossPay,
      avgDailyHours: totalHours / 7,
    };
  }, [entries, hourlyRate, overtimeMultiplier, useDailyOvertime, dailyOvertimeThreshold]);

  const updateEntry = (index: number, patch: Partial<DayEntry>) => {
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  };

  const resetWeek = () => setEntries(defaultWeek);
  const applyWeekdayTemplate = () => {
    setEntries((prev) =>
      prev.map((entry, index) =>
        index < 5
          ? { ...entry, start: "09:00", end: "17:30", breakMinutes: 30 }
          : { ...entry, start: "", end: "", breakMinutes: 0 }
      )
    );
  };

  return (
    <ToolLayout
      title="Time Card Calculator"
      slug="time-card-calculator"
      description="Calculate weekly work hours, regular time, overtime, and gross pay from daily start/end times. Supports overnight shifts, breaks, and configurable overtime rules."
      category={{ name: "Date & Time", slug: "date-time" }}
      relatedTools={[
        { name: "Business Days Calculator", href: "/business-days-calculator/" },
        { name: "Hours Calculator", href: "/hours-calculator/" },
        { name: "Payroll Calculator", href: "/payroll-calculator/" },
        { name: "Salary Calculator", href: "/salary-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter daily times", text: "Fill start, end, and unpaid break minutes for each day." },
        { name: "Set pay rules", text: "Add hourly rate and overtime multiplier assumptions." },
        { name: "Choose overtime mode", text: "Use weekly only or enable daily overtime threshold logic." },
        { name: "Review totals", text: "Use total hours and gross pay for payroll or invoicing prep." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this time card calculator does</h2>
          <p>
            This calculator converts raw shift times into payroll-ready weekly totals. It handles daily start and end
            times, unpaid breaks, overnight shifts, regular vs overtime hour splits, and gross pay estimates from your
            hourly rate. It is useful for employees, managers, and freelancers who need a transparent time-to-money
            workflow.
          </p>

          <h2>How hours are calculated</h2>
          <p>
            Each row computes worked duration from start to end time, then subtracts unpaid break minutes. If a shift
            crosses midnight, the calculator treats it as overnight and adds the next-day rollover automatically.
            Weekly totals are produced by summing all daily worked-hour values.
          </p>

          <h2>Overtime calculation logic</h2>
          <p>
            The default model applies weekly overtime over 40 hours. You can enable daily overtime and define the daily
            threshold (for example, 8 hours). To avoid duplicate overtime counting, the calculator uses the larger of
            weekly overtime and daily-overtime totals. This creates a practical estimate when comparing policy variants.
          </p>

          <h2>Common use cases</h2>
          <ul>
            <li>Weekly payroll pre-check before timesheet approval.</li>
            <li>Contractor and agency billing validation.</li>
            <li>Shift optimization and staffing cost planning.</li>
            <li>Overtime reduction scenarios for operations teams.</li>
            <li>Reconciliation of paystub vs submitted hours.</li>
          </ul>

          <h2>Interpretation guide</h2>
          <p>
            Focus on regular and overtime hour split first, then gross pay. If gross pay appears high or low, check
            break settings and overnight entries. For teams with variable schedules, save a baseline week and then test
            peak weeks with additional shifts so budget planning is resilient.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>U.S. Department of Labor overtime and hours-worked guidance.</li>
            <li>State labor department overtime rules (where applicable).</li>
            <li>ISO 8601 and common time representation conventions.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, title: "Shift Tracking", sub: "Daily start/end + breaks" },
            { icon: BriefcaseBusiness, title: "Overtime Split", sub: "Regular vs overtime hours" },
            { icon: Wallet, title: "Gross Pay", sub: "Rate and OT multiplier aware" },
            { icon: CalendarRange, title: "Weekly View", sub: "7-day rollup for payroll" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground">Weekly Time Card</h2>
            <div className="flex gap-2">
              <button
                onClick={applyWeekdayTemplate}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                Apply Weekday Template
              </button>
              <button
                onClick={resetWeek}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                <RefreshCw className="mr-1 inline h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.day}
                className="grid items-end gap-3 rounded-lg border border-border bg-muted/20 p-3 md:grid-cols-[1.1fr_1fr_1fr_1fr_auto]"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.day}</p>
                </div>
                <Input
                  label="Start"
                  type="time"
                  value={entry.start}
                  onChange={(event) => updateEntry(index, { start: event.target.value })}
                />
                <Input
                  label="End"
                  type="time"
                  value={entry.end}
                  onChange={(event) => updateEntry(index, { end: event.target.value })}
                />
                <Input
                  label="Break (min)"
                  type="number"
                  min={0}
                  value={entry.breakMinutes}
                  onChange={(event) => updateEntry(index, { breakMinutes: Number(event.target.value) })}
                />
                <div className="rounded-md bg-background px-3 py-2 text-sm text-muted-foreground">
                  {formatHours(summary.dayDetails[index].workedHours)}h
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-base font-semibold text-foreground">Pay Rules</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Hourly Rate"
              type="number"
              min={0}
              step={0.01}
              value={hourlyRate}
              onChange={(event) => setHourlyRate(Number(event.target.value))}
              suffix="$"
            />
            <Input
              label="Overtime Multiplier"
              type="number"
              min={1}
              step={0.1}
              value={overtimeMultiplier}
              onChange={(event) => setOvertimeMultiplier(Number(event.target.value))}
            />
            <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={useDailyOvertime}
                onChange={(event) => setUseDailyOvertime(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Enable daily overtime
            </label>
            <Input
              label="Daily OT Threshold"
              type="number"
              min={1}
              step={0.25}
              value={dailyOvertimeThreshold}
              onChange={(event) => setDailyOvertimeThreshold(Number(event.target.value))}
            />
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard
            label="Total Weekly Hours"
            value={formatHours(summary.totalHours)}
            unit="hours"
            subValue={formatHoursMinutes(summary.totalHours)}
            highlight
          />
          <ResultCard label="Regular Hours" value={formatHours(summary.regularHours)} unit="hours" />
          <ResultCard label="Overtime Hours" value={formatHours(summary.overtimeHours)} unit="hours" />
          <ResultCard label="Estimated Gross Pay" value={formatCurrency(summary.grossPay)} />
        </ResultsGrid>

        <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
          Average hours per day (7-day week basis):{" "}
          <span className="font-semibold text-foreground">{summary.avgDailyHours.toFixed(2)}</span>
        </p>
      </div>
    </ToolLayout>
  );
}
