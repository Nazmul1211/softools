"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Clock, Plus, Minus, ArrowRightLeft, Trash2, Info, Calculator, Copy, Check } from "lucide-react";

/* ─── FAQ Data ──────────────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How do I calculate total hours worked in a week?",
    answer:
      "Add each day's hours and minutes using this calculator's 'Add Time Entries' mode. For example, if you worked 8:30, 7:45, 8:15, 9:00, and 7:30 across five days, the total is 41 hours and 0 minutes. Alternatively, enter each day's start and end time in the 'Duration Between Times' mode and add the results. For payroll purposes, the total is typically converted to decimal hours: 41 hours 0 minutes = 41.00 decimal hours. Most US employers use a biweekly pay period (80 standard hours) per the Fair Labor Standards Act.",
  },
  {
    question: "How do I convert hours and minutes to decimal hours?",
    answer:
      "Divide the minutes by 60 and add to the hours. For example: 7 hours 45 minutes = 7 + (45/60) = 7 + 0.75 = 7.75 decimal hours. Common conversions: 15 min = 0.25, 30 min = 0.50, 45 min = 0.75. For seconds: divide seconds by 3600 and add to hours. This calculator automatically shows decimal hours alongside hours:minutes format. Decimal hours are the standard format for payroll systems, timesheets, and billing software because they simplify multiplication with hourly rates.",
  },
  {
    question: "How do I calculate hours between two times across midnight?",
    answer:
      "When the end time is earlier than the start time (e.g., 10:00 PM to 6:00 AM), the calculator assumes the end time is the next day. The formula is: (24:00 − Start Time) + End Time. Example: 10:00 PM to 6:00 AM = (24:00 − 22:00) + 6:00 = 2:00 + 6:00 = 8:00 hours. This is essential for night shift workers. The calculator handles this automatically when you toggle the 'Crosses midnight' option.",
  },
  {
    question: "What is the standard work week in hours?",
    answer:
      "In the United States, the standard work week is 40 hours under the Fair Labor Standards Act (FLSA). Hours exceeding 40 in a work week must be paid at 1.5× the regular rate (overtime). In the European Union, the Working Time Directive limits the average work week to 48 hours. Japan's Labor Standards Act sets the standard at 40 hours. According to the Bureau of Labor Statistics, the average American full-time employee works 38.6 hours per week (2024 data). Some industries (healthcare, emergency services) use 12-hour shifts with different weekly schedules.",
  },
  {
    question: "How do I subtract a lunch break from my total hours?",
    answer:
      "Calculate total time from start to end, then subtract the break duration. Example: Start 8:00 AM, End 5:00 PM, 30-minute lunch = 9:00 total − 0:30 break = 8 hours 30 minutes. Under the FLSA, meal breaks of 30+ minutes where the employee is completely relieved of duties are unpaid. Short rest breaks (5–20 minutes) are paid. This calculator lets you add and subtract multiple time entries, so you can first add your work period and then subtract your break separately.",
  },
  {
    question: "How do payroll systems round time entries?",
    answer:
      "Most US payroll systems use 'rounding to the nearest quarter hour' (15-minute increments), which is legal under the FLSA as long as it doesn't consistently benefit the employer. The rules: 1–7 minutes round down, 8–14 minutes round up. Example: 8:07 AM rounds to 8:00 AM; 8:08 AM rounds to 8:15 AM. Some employers use 6-minute (1/10 hour) or 5-minute rounding instead. Time tracking apps like ADP, Gusto, and Paychex typically use these standards. This calculator shows both exact and rounded decimal values.",
  },
];

/* ─── Types ─────────────────────────────────────── */

type Mode = "entries" | "duration";

interface TimeEntry {
  id: number;
  hours: string;
  minutes: string;
  seconds: string;
  operation: "add" | "subtract";
}

/* ─── Helpers ───────────────────────────────────── */

let entryId = 2;

function totalSecondsFromEntry(entry: TimeEntry): number {
  const h = parseInt(entry.hours) || 0;
  const m = parseInt(entry.minutes) || 0;
  const s = parseInt(entry.seconds) || 0;
  const total = h * 3600 + m * 60 + s;
  return entry.operation === "subtract" ? -total : total;
}

function formatTotalSeconds(totalSecs: number): { hours: number; minutes: number; seconds: number; negative: boolean; decimal: number; formatted: string } {
  const negative = totalSecs < 0;
  const abs = Math.abs(totalSecs);
  const hours = Math.floor(abs / 3600);
  const minutes = Math.floor((abs % 3600) / 60);
  const seconds = Math.round(abs % 60);
  const decimal = abs / 3600;
  const sign = negative ? "-" : "";
  const formatted = `${sign}${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  return { hours, minutes, seconds, negative, decimal, formatted };
}

/* ─── Component ────────────────────────────────── */

export default function HoursCalculator() {
  const [mode, setMode] = useState<Mode>("entries");
  const [copied, setCopied] = useState(false);

  /* Add/Subtract entries */
  const [entries, setEntries] = useState<TimeEntry[]>([
    { id: 0, hours: "8", minutes: "30", seconds: "0", operation: "add" },
    { id: 1, hours: "7", minutes: "45", seconds: "0", operation: "add" },
  ]);

  /* Duration between two times */
  const [startH, setStartH] = useState("9");
  const [startM, setStartM] = useState("00");
  const [endH, setEndH] = useState("17");
  const [endM, setEndM] = useState("30");
  const [crossesMidnight, setCrossesMidnight] = useState(false);

  const addEntry = () => {
    setEntries([...entries, { id: entryId++, hours: "0", minutes: "0", seconds: "0", operation: "add" }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length > 1) setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: number, field: keyof TimeEntry, value: string) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  /* Mode 1: Add/subtract entries */
  const entriesResult = useMemo(() => {
    const totalSec = entries.reduce((sum, entry) => sum + totalSecondsFromEntry(entry), 0);
    return formatTotalSeconds(totalSec);
  }, [entries]);

  /* Mode 2: Duration between times */
  const durationResult = useMemo(() => {
    const sh = parseInt(startH) || 0;
    const sm = parseInt(startM) || 0;
    const eh = parseInt(endH) || 0;
    const em = parseInt(endM) || 0;
    let startSec = sh * 3600 + sm * 60;
    let endSec = eh * 3600 + em * 60;
    if (crossesMidnight && endSec <= startSec) endSec += 24 * 3600;
    const diff = endSec - startSec;
    return formatTotalSeconds(diff);
  }, [startH, startM, endH, endM, crossesMidnight]);

  const result = mode === "entries" ? entriesResult : durationResult;

  const handleCopy = () => {
    const text = `${result.negative ? "-" : ""}${result.hours}:${result.minutes.toString().padStart(2, "0")}:${result.seconds.toString().padStart(2, "0")} (${result.decimal.toFixed(2)} decimal hours)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      title="Hours Calculator"
      description="Add, subtract, and calculate total hours, minutes, and seconds. Find the duration between two times, convert to decimal hours for payroll, and compute work hour totals. Supports multiple time entries with instant results."
      category={{ name: "Date & Time", slug: "date-time" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Choose calculation mode", text: "Select 'Add Time Entries' to add/subtract multiple durations, or 'Duration Between Times' to find hours between a start and end time." },
        { name: "Enter your time values", text: "Input hours, minutes, and optionally seconds. For entries mode, add as many rows as needed and toggle add/subtract per row." },
        { name: "Review results", text: "See the total in hours:minutes:seconds format and decimal hours. The decimal value is useful for payroll and billing." },
        { name: "Copy the result", text: "Click the copy button to copy both the time format and decimal hours to your clipboard." },
      ]}
      relatedTools={[
        { name: "Time Calculator", href: "/time-calculator" },
        { name: "Date Calculator", href: "/date-calculator" },
        { name: "Countdown Timer", href: "/countdown-timer" },
        { name: "Time Zone Converter", href: "/time-zone-converter" },
        { name: "Salary Calculator", href: "/salary-calculator" },
      ]}
      content={
        <>
          <h2>What Is an Hours Calculator?</h2>
          <p>
            An hours calculator performs arithmetic on time values — adding and subtracting hours, minutes, and seconds — and converts between time formats. Unlike regular arithmetic (where 60 minutes = 1 hour, not 100), time math uses a sexagesimal (base-60) system that originated with the ancient Babylonians around 2000 BCE. This calculator handles the base-60 conversions automatically, making it essential for payroll processing, project time tracking, and scheduling.
          </p>

          <h2>How Does Time Arithmetic Work?</h2>
          <h3>Adding Time</h3>
          <p>To add hours and minutes, add each unit separately and carry over when minutes exceed 60:</p>
          <p><strong>3h 45m + 2h 30m = 5h 75m = 6h 15m</strong> (because 75m = 1h 15m)</p>

          <h3>Subtracting Time</h3>
          <p>To subtract, borrow 60 minutes from the hours column when needed:</p>
          <p><strong>5h 15m − 2h 45m = 4h 75m − 2h 45m = 2h 30m</strong> (borrowed 1h = 60m)</p>

          <h3>Duration Between Two Times</h3>
          <p><strong>Duration = End Time − Start Time</strong></p>
          <p>Example: 9:00 AM to 5:30 PM = 17:30 − 9:00 = <strong>8 hours 30 minutes</strong></p>
          <p>For overnight shifts: 10:00 PM to 6:00 AM = (24:00 − 22:00) + 6:00 = <strong>8 hours</strong></p>

          <h2>Converting to Decimal Hours</h2>
          <p>Decimal hours express time as a single number for easier multiplication with rates. The formula is:</p>
          <p><strong>Decimal Hours = Hours + (Minutes ÷ 60) + (Seconds ÷ 3600)</strong></p>

          <h3>Quick Reference Table</h3>
          <table>
            <thead>
              <tr><th>Minutes</th><th>Decimal</th><th>Minutes</th><th>Decimal</th></tr>
            </thead>
            <tbody>
              <tr><td>5 min</td><td>0.08</td><td>35 min</td><td>0.58</td></tr>
              <tr><td>10 min</td><td>0.17</td><td>40 min</td><td>0.67</td></tr>
              <tr><td>15 min</td><td>0.25</td><td>45 min</td><td>0.75</td></tr>
              <tr><td>20 min</td><td>0.33</td><td>50 min</td><td>0.83</td></tr>
              <tr><td>25 min</td><td>0.42</td><td>55 min</td><td>0.92</td></tr>
              <tr><td>30 min</td><td>0.50</td><td>60 min</td><td>1.00</td></tr>
            </tbody>
          </table>

          <h2>Common Applications</h2>
          <ul>
            <li><strong>Payroll and timesheets:</strong> Calculate total weekly hours for hourly employees. Convert to decimal for rate multiplication (e.g., 38.75 hours × $22/hr = $852.50). The Fair Labor Standards Act requires overtime pay at 1.5× for hours exceeding 40/week.</li>
            <li><strong>Project management:</strong> Track billable hours across tasks. 7h 20m on Task A + 3h 40m on Task B = 11h 00m total project time.</li>
            <li><strong>Shift scheduling:</strong> Calculate coverage gaps and overlaps. A 12-hour shift from 7:00 PM to 7:00 AM with a 30-minute break = 11h 30m paid time.</li>
            <li><strong>Travel planning:</strong> Add layover times, flight durations, and ground transportation estimates. 3h 15m flight + 1h 45m layover + 2h 30m flight = 7h 30m total travel.</li>
          </ul>

          <h2>Payroll Rounding Rules</h2>
          <p>Under the FLSA, employers may round employee time to the nearest increment (typically 15 minutes) as long as the rounding is neutral over time:</p>
          <table>
            <thead>
              <tr><th>Actual Clock-In</th><th>Rounded (15-min)</th><th>Rule</th></tr>
            </thead>
            <tbody>
              <tr><td>8:01 AM</td><td>8:00 AM</td><td>1–7 min rounds down</td></tr>
              <tr><td>8:08 AM</td><td>8:15 AM</td><td>8–14 min rounds up</td></tr>
              <tr><td>5:22 PM</td><td>5:15 PM</td><td>7 min past quarter rounds down</td></tr>
              <tr><td>5:23 PM</td><td>5:30 PM</td><td>8 min past quarter rounds up</td></tr>
            </tbody>
          </table>

          <h2>Sources and References</h2>
          <ul>
            <li>U.S. Department of Labor. &ldquo;Fair Labor Standards Act (FLSA).&rdquo; Fact Sheet #22: Hours Worked Under the FLSA.</li>
            <li>Bureau of Labor Statistics (2024). &ldquo;Average Hours Per Day Spent in Selected Activities.&rdquo; American Time Use Survey.</li>
            <li>European Commission. &ldquo;Working Time Directive 2003/88/EC.&rdquo; Limits on weekly working hours in the EU.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode toggle */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Mode</label>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button onClick={() => setMode("entries")} className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${mode === "entries" ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Plus className="h-3.5 w-3.5 inline mr-1" />
              Add Time Entries
            </button>
            <button onClick={() => setMode("duration")} className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-all ${mode === "duration" ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <ArrowRightLeft className="h-3.5 w-3.5 inline mr-1" />
              Duration Between Times
            </button>
          </div>
        </div>

        {/* MODE 1: Add/Subtract entries */}
        {mode === "entries" && (
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="flex items-center gap-2 group">
                {/* Operation toggle */}
                <button
                  onClick={() => updateEntry(entry.id, "operation", entry.operation === "add" ? "subtract" : "add")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${entry.operation === "add" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                  aria-label={entry.operation === "add" ? "Switch to subtract" : "Switch to add"}
                >
                  {entry.operation === "add" ? "+" : "−"}
                </button>

                {/* Hours */}
                <div className="text-center">
                  <input type="number" inputMode="numeric" min="0" value={entry.hours} onChange={(e) => updateEntry(entry.id, "hours", e.target.value)} className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-2.5 text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  {idx === 0 && <p className="text-[10px] text-muted-foreground mt-0.5">hrs</p>}
                </div>
                <span className="text-muted-foreground font-bold">:</span>
                {/* Minutes */}
                <div className="text-center">
                  <input type="number" inputMode="numeric" min="0" max="59" value={entry.minutes} onChange={(e) => updateEntry(entry.id, "minutes", e.target.value)} className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-2.5 text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  {idx === 0 && <p className="text-[10px] text-muted-foreground mt-0.5">min</p>}
                </div>
                <span className="text-muted-foreground font-bold">:</span>
                {/* Seconds */}
                <div className="text-center">
                  <input type="number" inputMode="numeric" min="0" max="59" value={entry.seconds} onChange={(e) => updateEntry(entry.id, "seconds", e.target.value)} className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-2.5 text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  {idx === 0 && <p className="text-[10px] text-muted-foreground mt-0.5">sec</p>}
                </div>
                {/* Remove */}
                {entries.length > 1 && (
                  <button onClick={() => removeEntry(entry.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 p-1" aria-label="Remove entry">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <button onClick={addEntry} className="w-full py-2.5 rounded-lg border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              Add Entry
            </button>
          </div>
        )}

        {/* MODE 2: Duration between times */}
        {mode === "duration" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Start Time
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" inputMode="numeric" value={startH} onChange={(e) => setStartH(e.target.value)} min="0" max="23" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <span className="text-lg text-muted-foreground font-bold">:</span>
                  <input type="number" inputMode="numeric" value={startM} onChange={(e) => setStartM(e.target.value)} min="0" max="59" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">24-hour format (e.g., 9:00 = 9 AM, 17:00 = 5 PM)</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> End Time
                </label>
                <div className="flex items-center gap-2">
                  <input type="number" inputMode="numeric" value={endH} onChange={(e) => setEndH(e.target.value)} min="0" max="23" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <span className="text-lg text-muted-foreground font-bold">:</span>
                  <input type="number" inputMode="numeric" value={endM} onChange={(e) => setEndM(e.target.value)} min="0" max="59" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>
            </div>
            <label className="text-sm text-muted-foreground flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={crossesMidnight} onChange={(e) => setCrossesMidnight(e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
              Crosses midnight (overnight shift)
            </label>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
            <p className="text-sm text-muted-foreground text-center mb-1">Total Time</p>
            <p className="text-4xl font-bold text-foreground text-center">
              {result.negative && <span className="text-red-500">−</span>}
              {result.hours}h {result.minutes.toString().padStart(2, "0")}m {result.seconds.toString().padStart(2, "0")}s
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-sm text-muted-foreground">{result.decimal.toFixed(2)} decimal hours</span>
              <button onClick={handleCopy} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors" aria-label="Copy result">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Conversion grid */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Hours</p>
              <p className="text-xl font-bold text-foreground">{result.decimal.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Minutes</p>
              <p className="text-xl font-bold text-foreground">{(result.decimal * 60).toFixed(0)}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Seconds</p>
              <p className="text-xl font-bold text-foreground">{(result.decimal * 3600).toFixed(0)}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Work Days (8h)</p>
              <p className="text-xl font-bold text-foreground">{(result.decimal / 8).toFixed(2)}</p>
            </div>
          </div>

          {/* Payroll hint */}
          {mode === "entries" && result.decimal > 0 && (
            <div className="rounded-xl border border-border bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">Payroll Quick Math</p>
                <p>{result.decimal.toFixed(2)} hours × $___/hr = $___ gross pay</p>
                {result.decimal > 40 && (
                  <p className="mt-1">
                    ⚠️ {(result.decimal - 40).toFixed(2)} overtime hours at 1.5× rate (FLSA standard)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
