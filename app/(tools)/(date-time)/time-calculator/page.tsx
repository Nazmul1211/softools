"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Clock, Calculator, Plus, Minus, ArrowRight } from "lucide-react";

interface TimeValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeResult {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  formatted: string;
  breakdown: TimeValue;
}

function parseTimeToSeconds(time: TimeValue): number {
  return (
    time.days * 86400 +
    time.hours * 3600 +
    time.minutes * 60 +
    time.seconds
  );
}

function secondsToTime(totalSeconds: number): TimeValue {
  const isNegative = totalSeconds < 0;
  let remaining = Math.abs(totalSeconds);

  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    days: isNegative ? -days : days,
    hours,
    minutes,
    seconds,
  };
}

function formatTime(time: TimeValue): string {
  const parts: string[] = [];
  const isNegative = time.days < 0;
  const absDays = Math.abs(time.days);

  if (absDays > 0) parts.push(`${absDays} day${absDays !== 1 ? "s" : ""}`);
  if (time.hours > 0) parts.push(`${time.hours} hour${time.hours !== 1 ? "s" : ""}`);
  if (time.minutes > 0) parts.push(`${time.minutes} minute${time.minutes !== 1 ? "s" : ""}`);
  if (time.seconds > 0 || parts.length === 0) {
    parts.push(`${time.seconds} second${time.seconds !== 1 ? "s" : ""}`);
  }

  return (isNegative ? "-" : "") + parts.join(", ");
}

function calculateTime(
  time1: TimeValue,
  time2: TimeValue,
  operation: "add" | "subtract"
): TimeResult {
  const seconds1 = parseTimeToSeconds(time1);
  const seconds2 = parseTimeToSeconds(time2);

  const totalSeconds = operation === "add" 
    ? seconds1 + seconds2 
    : seconds1 - seconds2;

  const breakdown = secondsToTime(totalSeconds);

  return {
    totalSeconds: Math.abs(totalSeconds),
    totalMinutes: Math.abs(totalSeconds) / 60,
    totalHours: Math.abs(totalSeconds) / 3600,
    totalDays: Math.abs(totalSeconds) / 86400,
    formatted: formatTime(breakdown),
    breakdown,
  };
}

type Mode = "add" | "subtract" | "convert";

export default function TimeCalculatorPage() {
  const [mode, setMode] = useState<Mode>("add");
  
  // Time 1 inputs
  const [time1, setTime1] = useState<TimeValue>({ days: 0, hours: 2, minutes: 30, seconds: 0 });
  // Time 2 inputs
  const [time2, setTime2] = useState<TimeValue>({ days: 0, hours: 1, minutes: 45, seconds: 30 });
  
  // Conversion inputs
  const [convertValue, setConvertValue] = useState("3600");
  const [convertFrom, setConvertFrom] = useState<"seconds" | "minutes" | "hours" | "days">("seconds");

  const result = useMemo(() => {
    if (mode === "convert") {
      const value = parseFloat(convertValue) || 0;
      let totalSeconds: number;
      
      switch (convertFrom) {
        case "seconds": totalSeconds = value; break;
        case "minutes": totalSeconds = value * 60; break;
        case "hours": totalSeconds = value * 3600; break;
        case "days": totalSeconds = value * 86400; break;
      }

      const breakdown = secondsToTime(totalSeconds);
      return {
        totalSeconds,
        totalMinutes: totalSeconds / 60,
        totalHours: totalSeconds / 3600,
        totalDays: totalSeconds / 86400,
        formatted: formatTime(breakdown),
        breakdown,
      };
    }

    return calculateTime(time1, time2, mode as "add" | "subtract");
  }, [mode, time1, time2, convertValue, convertFrom]);

  const updateTime1 = (field: keyof TimeValue, value: string) => {
    setTime1(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const updateTime2 = (field: keyof TimeValue, value: string) => {
    setTime2(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const faqs = [
    {
      question: "How do I add hours and minutes together?",
      answer:
        "Enter the hours and minutes for each time duration, then select 'Add Times'. The calculator automatically handles carry-over, so 1 hour 45 minutes + 30 minutes becomes 2 hours 15 minutes.",
    },
    {
      question: "Can I add times with different units?",
      answer:
        "Yes! You can mix days, hours, minutes, and seconds in any combination. The calculator converts everything to a common unit (seconds) internally, performs the calculation, then displays results in the most readable format.",
    },
    {
      question: "What happens when I subtract a larger time from a smaller time?",
      answer:
        "The calculator shows a negative result. For example, subtracting 2 hours from 1 hour gives -1 hour. This is useful for determining deficits or overages in time tracking.",
    },
    {
      question: "How do I convert between time units?",
      answer:
        "Use the 'Convert' mode. Enter a value and select the unit (seconds, minutes, hours, or days). The calculator shows equivalent values in all other units plus a formatted breakdown.",
    },
    {
      question: "How many seconds are in a day?",
      answer:
        "There are 86,400 seconds in a day (24 hours × 60 minutes × 60 seconds). Similarly, there are 1,440 minutes in a day and 168 hours in a week.",
    },
    {
      question: "Can I use decimals for time?",
      answer:
        "Yes, in conversion mode you can enter decimal values like 1.5 hours (which equals 90 minutes). For add/subtract mode, use whole numbers for each field and the calculator handles fractional results automatically.",
    },
  ];

  const howToSteps = [
    {
      name: "Select operation mode",
      text: "Choose 'Add Times' to sum durations, 'Subtract Times' to find differences, or 'Convert' to convert between time units.",
    },
    {
      name: "Enter time values",
      text: "Input days, hours, minutes, and/or seconds for each duration. Leave fields at 0 if not applicable.",
    },
    {
      name: "View the result",
      text: "See the calculated time displayed as a formatted duration and broken down into components.",
    },
    {
      name: "Review conversions",
      text: "View the result in multiple units: total seconds, minutes, hours, and days for easy comparison.",
    },
    {
      name: "Apply to your needs",
      text: "Use results for project planning, work hour tracking, event scheduling, or any time-based calculations.",
    },
  ];

  const content = `
## Time Calculator: Add, Subtract, and Convert Time Durations

Working with time calculations can be tricky due to the non-decimal nature of time units. Our time calculator simplifies adding and subtracting hours, minutes, and seconds while handling all the carry-over math automatically. Whether you're tracking work hours, planning schedules, or calculating durations, this tool provides instant, accurate results.

### Understanding Time Units

Time is measured in base-60 (sexagesimal) for minutes and seconds, and base-24 for hours, making manual calculations error-prone:

**Basic Conversions:**
- 1 minute = 60 seconds
- 1 hour = 60 minutes = 3,600 seconds
- 1 day = 24 hours = 1,440 minutes = 86,400 seconds
- 1 week = 7 days = 168 hours = 10,080 minutes

**Common Time Relationships:**
- Quarter hour = 15 minutes
- Half hour = 30 minutes
- Three-quarter hour = 45 minutes

### Adding Time Durations

When adding time, carry-over is crucial:

**Example: 2 hours 45 minutes + 1 hour 30 minutes**
- Minutes: 45 + 30 = 75 minutes
- 75 minutes = 1 hour 15 minutes (carry 1 hour)
- Hours: 2 + 1 + 1 (carried) = 4 hours
- Result: 4 hours 15 minutes

**Example: 23 hours 50 minutes + 2 hours 20 minutes**
- Minutes: 50 + 20 = 70 minutes = 1 hour 10 minutes
- Hours: 23 + 2 + 1 = 26 hours = 1 day 2 hours
- Result: 1 day, 2 hours, 10 minutes

### Subtracting Time Durations

Subtraction requires borrowing when the subtrahend component is larger:

**Example: 3 hours 15 minutes - 1 hour 45 minutes**
- Cannot subtract 45 from 15, so borrow 1 hour
- 3 hours 15 minutes becomes 2 hours 75 minutes
- Minutes: 75 - 45 = 30 minutes
- Hours: 2 - 1 = 1 hour
- Result: 1 hour 30 minutes

### Time Tracking Applications

**Work Hours Calculation:**
Track weekly work time by adding daily hours. A typical scenario:
- Monday: 8h 30m
- Tuesday: 7h 45m
- Wednesday: 9h 15m
- Thursday: 8h 00m
- Friday: 7h 30m
- Total: 41h 00m

**Project Time Estimation:**
Sum estimated task durations:
- Design: 4 hours
- Development: 16 hours
- Testing: 6 hours
- Documentation: 2 hours
- Buffer: 4 hours
- Total: 32 hours (4 working days)

**Travel Time Planning:**
Add flight time, layovers, and ground transport:
- Drive to airport: 45 minutes
- Check-in/security: 1 hour 30 minutes
- Flight: 3 hours 15 minutes
- Layover: 2 hours
- Connecting flight: 1 hour 45 minutes
- Ground transport: 30 minutes
- Total travel: 9 hours 45 minutes

### Converting Between Time Units

**Decimal Hours to Hours:Minutes:**
Many payroll systems use decimal hours:
- 8.25 hours = 8 hours 15 minutes (0.25 × 60 = 15)
- 8.5 hours = 8 hours 30 minutes (0.5 × 60 = 30)
- 8.75 hours = 8 hours 45 minutes (0.75 × 60 = 45)
- 8.1 hours = 8 hours 6 minutes (0.1 × 60 = 6)

**Minutes to Decimal Hours:**
- 15 minutes = 0.25 hours
- 30 minutes = 0.5 hours
- 45 minutes = 0.75 hours
- 20 minutes ≈ 0.33 hours
- 40 minutes ≈ 0.67 hours

### Time Calculation Formulas

**Total Seconds:**
\`total = (days × 86400) + (hours × 3600) + (minutes × 60) + seconds\`

**Breaking Down Seconds:**
\`days = floor(total ÷ 86400)\`
\`hours = floor((total mod 86400) ÷ 3600)\`
\`minutes = floor((total mod 3600) ÷ 60)\`
\`seconds = total mod 60\`

### Common Time Calculations

**Working Hours in a Year:**
- Standard work week: 40 hours
- Work weeks per year: 52 - (vacation + holidays) ≈ 48-50 weeks
- Annual work hours: ~2,000 hours

**Meeting Time Analysis:**
Calculate time spent in meetings per week/month/year to assess productivity impact.

**Sleep Tracking:**
Calculate average sleep duration over a week or month to assess sleep patterns.

**Exercise Logging:**
Track total workout time per week with session-by-session addition.

### Tips for Time Calculations

**Round Appropriately:**
- For billing: Round to nearest 15 minutes or 6-minute increment (0.1 hour)
- For scheduling: Round to 5-minute increments
- For estimates: Round to nearest hour or half-hour

**Account for Buffers:**
Add 10-20% buffer time to estimates for unexpected delays.

**Consider Time Zones:**
When calculating across time zones, convert to a common zone first.

### Time in Different Contexts

**Military/24-Hour Time:**
- 0000 to 2359
- No AM/PM confusion
- 1300 = 1:00 PM, 2245 = 10:45 PM

**ISO 8601 Duration Format:**
- P1DT2H30M = 1 day, 2 hours, 30 minutes
- PT90M = 90 minutes
- PT1H30M = 1 hour 30 minutes

**Decimal Time (French Revolutionary):**
- 10 hours per day
- 100 minutes per hour
- 100 seconds per minute
- Never widely adopted but interesting historically

### Calculator Features

Our time calculator provides:
- **Add Times**: Sum any number of durations
- **Subtract Times**: Find differences between durations
- **Convert**: Transform values between seconds, minutes, hours, days
- **Multiple Outputs**: Results shown in various units simultaneously
- **Formatted Display**: Human-readable output with proper pluralization

### Practical Examples

**Calculate Overtime:**
If your regular hours are 40/week and you worked 45h 30m:
45h 30m - 40h 0m = 5h 30m overtime

**Event Duration:**
Event from 9:30 AM to 4:45 PM:
16h 45m - 9h 30m = 7h 15m total duration

**Flight Planning:**
Departure: 2:30 PM, Flight time: 4h 45m
2h 30m + 4h 45m = 7h 15m = 7:15 PM arrival (same time zone)

Whether you're tracking billable hours, planning events, or analyzing time data, this calculator handles all the complexity of time arithmetic automatically.
  `;

  return (
    <ToolLayout
      title="Time Calculator"
      description="Add and subtract time durations (hours, minutes, seconds) easily. Convert between time units and calculate total time for work hours, schedules, and more."
      category={{ name: "Date & Time", slug: "date-time" }}
      faqs={faqs}
      howToSteps={howToSteps}
      content={content}
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "add", label: "Add Times", icon: Plus },
            { id: "subtract", label: "Subtract Times", icon: Minus },
            { id: "convert", label: "Convert", icon: ArrowRight },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id as Mode)}
              className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                mode === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        {mode !== "convert" ? (
          <div className="space-y-6">
            {/* Time 1 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Time 1
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Days</label>
                  <input
                    type="number"
                    min="0"
                    value={time1.days}
                    onChange={(e) => updateTime1("days", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={time1.hours}
                    onChange={(e) => updateTime1("hours", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    value={time1.minutes}
                    onChange={(e) => updateTime1("minutes", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    value={time1.seconds}
                    onChange={(e) => updateTime1("seconds", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Operator Display */}
            <div className="flex justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                mode === "add" ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"
              }`}>
                {mode === "add" ? "+" : "−"}
              </div>
            </div>

            {/* Time 2 */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Time 2
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Days</label>
                  <input
                    type="number"
                    min="0"
                    value={time2.days}
                    onChange={(e) => updateTime2("days", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={time2.hours}
                    onChange={(e) => updateTime2("hours", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    value={time2.minutes}
                    onChange={(e) => updateTime2("minutes", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    value={time2.seconds}
                    onChange={(e) => updateTime2("seconds", e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Convert Mode */
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Convert Time
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="number"
                  step="any"
                  value={convertValue}
                  onChange={(e) => setConvertValue(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  value={convertFrom}
                  onChange={(e) => setConvertFrom(e.target.value as typeof convertFrom)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-6">
          {/* Main Result */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {mode === "convert" ? "Conversion Result" : "Result"}
            </h2>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {result.formatted}
            </div>
            {result.breakdown.days < 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                (Negative result indicates Time 2 is larger than Time 1)
              </p>
            )}
          </div>

          {/* Breakdown */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Days</div>
              <div className="text-2xl font-bold">{Math.abs(result.breakdown.days)}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Hours</div>
              <div className="text-2xl font-bold">{result.breakdown.hours}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Minutes</div>
              <div className="text-2xl font-bold">{result.breakdown.minutes}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Seconds</div>
              <div className="text-2xl font-bold">{result.breakdown.seconds}</div>
            </div>
          </div>

          {/* Total Conversions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Total in Different Units</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Total Seconds</div>
                <div className="text-lg font-bold">{result.totalSeconds.toLocaleString()}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Total Minutes</div>
                <div className="text-lg font-bold">{result.totalMinutes.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Total Hours</div>
                <div className="text-lg font-bold">{result.totalHours.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Total Days</div>
                <div className="text-lg font-bold">{result.totalDays.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Reference</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">1 minute =</div>
                <div className="text-muted-foreground">60 seconds</div>
              </div>
              <div>
                <div className="font-medium">1 hour =</div>
                <div className="text-muted-foreground">3,600 seconds</div>
              </div>
              <div>
                <div className="font-medium">1 day =</div>
                <div className="text-muted-foreground">86,400 seconds</div>
              </div>
              <div>
                <div className="font-medium">1 week =</div>
                <div className="text-muted-foreground">604,800 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
