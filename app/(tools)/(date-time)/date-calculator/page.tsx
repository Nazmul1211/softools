"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Calendar, Clock, ArrowRight, Plus, Minus, RotateCcw } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "How do I calculate the number of days between two dates?",
    answer: "Enter your start date and end date in the calculator above. The tool will automatically calculate the total number of days between them, including years, months, weeks, and remaining days. You can also see the number of business days (weekdays) and weekend days separately."
  },
  {
    question: "How are business days calculated?",
    answer: "Business days are calculated by counting only Monday through Friday, excluding Saturdays and Sundays. Our calculator shows both total days and business days. Note that this basic calculation doesn't account for holidays, which vary by country and region."
  },
  {
    question: "Does the calculator account for leap years?",
    answer: "Yes, the calculator automatically accounts for leap years when calculating dates. February has 29 days in leap years (years divisible by 4, except century years not divisible by 400), and the calculation adjusts accordingly."
  },
  {
    question: "What's the difference between inclusive and exclusive counting?",
    answer: "Exclusive counting (default) doesn't count either the start or end date itself—just the days between. Inclusive counting includes both the start and end dates. For example, from Monday to Wednesday is 2 days exclusive (Tuesday only between) or 3 days inclusive (Monday, Tuesday, Wednesday)."
  },
  {
    question: "How do I calculate a date X days from now?",
    answer: "Use the 'Add/Subtract Days' tab above. Enter your starting date (or use today's date), then enter the number of days to add or subtract. The calculator will show you the resulting date along with what day of the week it falls on."
  },
  {
    question: "Why might my date calculation differ from other tools?",
    answer: "Date calculations can differ based on whether the count is inclusive or exclusive of start/end dates, how partial days are handled, time zone considerations, and whether business days or calendar days are being counted. Our calculator clearly labels each calculation type."
  },
];

export default function DateCalculator() {
  const [mode, setMode] = useState<"difference" | "addSubtract">("difference");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  });
  const [daysToAdd, setDaysToAdd] = useState<string>("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [includeEndDate, setIncludeEndDate] = useState(false);

  const differenceResults = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    // Ensure start is before end
    const [earlier, later] = start <= end ? [start, end] : [end, start];
    
    // Calculate total days
    const diffTime = later.getTime() - earlier.getTime();
    let totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (includeEndDate) totalDays += 1;

    // Calculate years, months, weeks
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Calculate business days (Mon-Fri)
    let businessDays = 0;
    let weekendDays = 0;
    const current = new Date(earlier);
    const targetDate = new Date(later);
    if (includeEndDate) targetDate.setDate(targetDate.getDate() + 1);
    
    while (current < targetDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    // Calculate total hours, minutes, seconds
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    return {
      totalDays,
      years,
      months,
      days,
      weeks,
      remainingDays,
      businessDays,
      weekendDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      isReversed: start > end,
    };
  }, [startDate, endDate, includeEndDate]);

  const addSubtractResult = useMemo(() => {
    if (!startDate || !daysToAdd) return null;

    const start = new Date(startDate);
    const days = parseInt(daysToAdd) || 0;
    
    if (isNaN(start.getTime())) return null;

    const result = new Date(start);
    if (operation === "add") {
      result.setDate(result.getDate() + days);
    } else {
      result.setDate(result.getDate() - days);
    }

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return {
      resultDate: result.toISOString().split("T")[0],
      dayOfWeek: dayNames[result.getDay()],
      formattedDate: `${monthNames[result.getMonth()]} ${result.getDate()}, ${result.getFullYear()}`,
    };
  }, [startDate, daysToAdd, operation]);

  const setToToday = (setter: (value: string) => void) => {
    setter(new Date().toISOString().split("T")[0]);
  };

  const quickDays = [7, 14, 30, 60, 90, 180, 365];

  return (
    <ToolLayout
      title="Date Calculator"
      description="Calculate the exact number of days, weeks, months, and years between any two dates. Add or subtract days from a date. Find business days and weekends for planning and scheduling."
      category={{ name: "Date & Time", slug: "date-time" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Due Date Calculator", href: "/due-date-calculator" },
        { name: "Time Zone Converter", href: "/time-zone-converter" },
        { name: "Countdown Timer", href: "/countdown-timer" },
        { name: "Sleep Calculator", href: "/sleep-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Date Calculations</h2>
          <p>
            Date calculations are essential for project planning, contract deadlines, event scheduling, travel planning, and countless other everyday needs. Understanding how dates work—including leap years, varying month lengths, and the difference between calendar days and business days—helps ensure accurate planning.
          </p>

          <h2>How the Date Calculator Works</h2>
          
          <h3>Days Between Dates</h3>
          <p>
            The &quot;Days Between Dates&quot; mode calculates the total number of days from one date to another. By default, this is an exclusive count (not including start or end date)—the same way we typically say &quot;3 days until Friday&quot; when it&apos;s Tuesday.
          </p>
          <p>
            Toggle &quot;Include end date&quot; for an inclusive count when you need to include both the start and end dates in your total (useful for counting event days, rental periods, etc.).
          </p>

          <h3>Add or Subtract Days</h3>
          <p>
            The &quot;Add/Subtract Days&quot; mode lets you find a future or past date by adding or removing a specific number of days from a starting date. This is perfect for:
          </p>
          <ul>
            <li>Finding due dates (30 days from invoice date)</li>
            <li>Calculating delivery windows</li>
            <li>Planning events or deadlines</li>
            <li>Determining contract expiration dates</li>
          </ul>

          <h2>Calendar Days vs. Business Days</h2>
          <p>
            Understanding the difference between calendar days and business days is crucial for many professional and legal contexts:
          </p>
          
          <h3>Calendar Days</h3>
          <p>
            Calendar days include every day—weekends and holidays. When a contract says &quot;30 days,&quot; without qualification, it typically means calendar days.
          </p>

          <h3>Business Days (Working Days)</h3>
          <p>
            Business days exclude weekends (Saturday and Sunday) and often holidays. When processing times or legal deadlines specify &quot;business days,&quot; weekends don&apos;t count. Our calculator shows both totals.
          </p>
          <p>
            <strong>Note:</strong> Holiday exclusions vary by country and organization. For precise business day calculations in legal or financial contexts, verify which holidays apply to your situation.
          </p>

          <h2>Leap Years and Month Variations</h2>
          <p>
            Our calculator automatically handles these calendar complexities:
          </p>
          
          <h3>Leap Years</h3>
          <p>
            Leap years occur every 4 years (with exceptions for century years). In leap years, February has 29 days instead of 28. The rule is:
          </p>
          <ul>
            <li>Divisible by 4 = leap year (2024, 2028)</li>
            <li>Except century years not divisible by 400 (1900 was not a leap year, but 2000 was)</li>
          </ul>

          <h3>Month Length Variations</h3>
          <ul>
            <li><strong>31 days:</strong> January, March, May, July, August, October, December</li>
            <li><strong>30 days:</strong> April, June, September, November</li>
            <li><strong>28/29 days:</strong> February (29 in leap years)</li>
          </ul>

          <h2>Common Date Calculation Uses</h2>

          <h3>Legal and Financial</h3>
          <ul>
            <li>Payment due dates (Net 30, Net 60)</li>
            <li>Statute of limitations periods</li>
            <li>Interest calculation periods</li>
            <li>Contract renewal and termination dates</li>
            <li>Tax filing deadlines</li>
          </ul>

          <h3>Personal Planning</h3>
          <ul>
            <li>Countdown to events (weddings, vacations, birthdays)</li>
            <li>Calculating age or time elapsed</li>
            <li>Pregnancy due date calculations</li>
            <li>Visa and passport expiration planning</li>
            <li>Medication or prescription refill dates</li>
          </ul>

          <h3>Project Management</h3>
          <ul>
            <li>Sprint planning and iteration cycles</li>
            <li>Deadline estimation</li>
            <li>Resource allocation periods</li>
            <li>Milestone tracking</li>
            <li>Time-to-completion estimates</li>
          </ul>

          <h2>Date Formats Around the World</h2>
          <p>
            Different regions use different date formats, which can cause confusion:
          </p>
          <ul>
            <li><strong>United States:</strong> MM/DD/YYYY (03/14/2024)</li>
            <li><strong>Europe/International:</strong> DD/MM/YYYY (14/03/2024)</li>
            <li><strong>ISO 8601:</strong> YYYY-MM-DD (2024-03-14) — the unambiguous standard our calculator uses</li>
            <li><strong>East Asia:</strong> YYYY年MM月DD日 or YYYY/MM/DD</li>
          </ul>
          <p>
            When communicating dates internationally or in documents, consider using the month name (March 14, 2024) or ISO format to avoid confusion.
          </p>

          <h2>Interesting Date Facts</h2>
          <ul>
            <li>A non-leap year has 365 days, which is 52 weeks plus 1 day</li>
            <li>February 29 (leap day) occurs approximately every 4 years</li>
            <li>The longest time between two Friday the 13ths is 14 months</li>
            <li>400 years have exactly 146,097 days, or exactly 20,871 weeks</li>
            <li>The Gregorian calendar repeats every 400 years</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setMode("difference")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === "difference"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Days Between Dates
          </button>
          <button
            onClick={() => setMode("addSubtract")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === "addSubtract"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            Add/Subtract Days
          </button>
        </div>

        {mode === "difference" ? (
          <>
            {/* Date Range Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-foreground">Start Date</label>
                  <button
                    onClick={() => setToToday(setStartDate)}
                    className="text-xs text-primary hover:underline"
                  >
                    Today
                  </button>
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-foreground">End Date</label>
                  <button
                    onClick={() => setToToday(setEndDate)}
                    className="text-xs text-primary hover:underline"
                  >
                    Today
                  </button>
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Include End Date Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Include end date in count (inclusive)</span>
            </label>

            {/* Difference Results */}
            {differenceResults && (
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-6">
                {differenceResults.isReversed && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Note: Start date is after end date. Showing absolute difference.
                  </p>
                )}
                
                {/* Main Result */}
                <div className="text-center pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total Days</p>
                  <p className="text-5xl font-bold text-primary">{differenceResults.totalDays.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {differenceResults.years > 0 && `${differenceResults.years} year${differenceResults.years !== 1 ? "s" : ""}, `}
                    {differenceResults.months > 0 && `${differenceResults.months} month${differenceResults.months !== 1 ? "s" : ""}, `}
                    {differenceResults.days} day{differenceResults.days !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Detailed Breakdown */}
                <ResultsGrid columns={3}>
                  <ResultCard label="Weeks" value={differenceResults.weeks.toLocaleString()} subValue={`+ ${differenceResults.remainingDays} days`} />
                  <ResultCard label="Business Days" value={differenceResults.businessDays.toLocaleString()} highlight />
                  <ResultCard label="Weekend Days" value={differenceResults.weekendDays.toLocaleString()} />
                </ResultsGrid>

                {/* Additional Time Units */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{differenceResults.totalHours.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{differenceResults.totalMinutes.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{differenceResults.totalSeconds.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Seconds</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Add/Subtract Mode */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Starting Date</label>
                <button
                  onClick={() => setToToday(setStartDate)}
                  className="text-xs text-primary hover:underline"
                >
                  Today
                </button>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Operation Toggle */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setOperation("add")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  operation === "add"
                    ? "bg-white dark:bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Days
              </button>
              <button
                onClick={() => setOperation("subtract")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  operation === "subtract"
                    ? "bg-white dark:bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Minus className="h-4 w-4" />
                Subtract Days
              </button>
            </div>

            {/* Days Input */}
            <Input
              label="Number of Days"
              type="number"
              value={daysToAdd}
              onChange={(e) => setDaysToAdd(e.target.value)}
              min="0"
              placeholder="Enter number of days"
            />

            {/* Quick Day Buttons */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Quick Select</label>
              <div className="flex flex-wrap gap-2">
                {quickDays.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDaysToAdd(d.toString())}
                    className="px-3 py-1.5 text-sm rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {addSubtractResult && (
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {operation === "add" ? "Date after" : "Date before"} {daysToAdd} days
                </p>
                <p className="text-3xl font-bold text-primary mb-2">
                  {addSubtractResult.formattedDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  {addSubtractResult.dayOfWeek}
                </p>
              </div>
            )}
          </>
        )}

        {/* Common Date Calculations */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Common Timeframes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">1 week</p>
              <p className="font-semibold text-foreground">7 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">2 weeks</p>
              <p className="font-semibold text-foreground">14 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">1 month (avg)</p>
              <p className="font-semibold text-foreground">30.44 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">1 quarter</p>
              <p className="font-semibold text-foreground">~91 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">6 months</p>
              <p className="font-semibold text-foreground">~182 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">1 year</p>
              <p className="font-semibold text-foreground">365 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Leap year</p>
              <p className="font-semibold text-foreground">366 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">1 decade</p>
              <p className="font-semibold text-foreground">3,652 days</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
