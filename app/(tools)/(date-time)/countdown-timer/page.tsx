"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isPast: boolean;
}

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("00:00");
  const [eventName, setEventName] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const calculateTimeRemaining = useCallback((): TimeRemaining | null => {
    if (!targetDate) return null;

    const target = new Date(`${targetDate}T${targetTime || "00:00"}:00`);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (isNaN(diff)) return null;

    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: absDiff, isPast };
  }, [targetDate, targetTime]);

  useEffect(() => {
    if (!targetDate) {
      setTimeRemaining(null);
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime, calculateTimeRemaining]);

  const setQuickDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    setTargetDate(date.toISOString().split("T")[0]);
  };

  const setPresetEvent = (name: string, date: string) => {
    setEventName(name);
    setTargetDate(date);
    setTargetTime("00:00");
  };

  const reset = () => {
    setTargetDate("");
    setTargetTime("00:00");
    setEventName("");
    setTimeRemaining(null);
    setIsRunning(false);
  };

  // Calculate upcoming holidays for current year
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const presetEvents = [
    { name: "New Year", date: `${nextYear}-01-01` },
    { name: "Valentine's Day", date: `${new Date().getMonth() < 1 || (new Date().getMonth() === 1 && new Date().getDate() < 14) ? currentYear : nextYear}-02-14` },
    { name: "Christmas", date: `${new Date().getMonth() < 11 || (new Date().getMonth() === 11 && new Date().getDate() < 25) ? currentYear : nextYear}-12-25` },
    { name: "Halloween", date: `${new Date().getMonth() < 9 || (new Date().getMonth() === 9 && new Date().getDate() < 31) ? currentYear : nextYear}-10-31` },
  ];

  return (
    <ToolLayout
      title="Countdown Timer"
      description="Create countdown timers for events, deadlines, holidays, and special occasions. Track time remaining in days, hours, minutes, and seconds with our free countdown clock."
      category={{ name: "Date & Time", slug: "date-time" }}
      relatedTools={[
        { name: "Date Calculator", href: "/date-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Time Zone Converter", href: "/time-zone-converter" },
      ]}
      content={
        <>
          <h2>About Countdown Timers</h2>
          <p>
            Countdown timers help you track the time remaining until important events. Whether you are 
            counting down to a holiday, deadline, birthday, or any special occasion, seeing the exact 
            time remaining can help build excitement or manage your time effectively.
          </p>

          <h2>Uses for Countdown Timers</h2>
          <ul>
            <li><strong>Events:</strong> Weddings, birthdays, anniversaries, parties</li>
            <li><strong>Holidays:</strong> Christmas, New Year, Valentine&apos;s Day, Halloween</li>
            <li><strong>Work:</strong> Project deadlines, presentation dates, meetings</li>
            <li><strong>Personal:</strong> Vacations, graduations, retirement</li>
            <li><strong>Sales:</strong> Product launches, promotional periods, limited offers</li>
          </ul>

          <h2>How It Works</h2>
          <p>
            Enter your target date and time, and the countdown will automatically calculate the remaining 
            time. The timer updates every second, showing you the exact days, hours, minutes, and seconds 
            until your event.
          </p>

          <h2>Tips for Using Countdowns</h2>
          <ul>
            <li>Set reminders at key milestones (1 week, 1 day, 1 hour before)</li>
            <li>Use countdowns to create urgency for deadlines</li>
            <li>Share countdown links with others to build excitement</li>
            <li>Consider time zones when counting down to global events</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Event Name (Optional)"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g., My Birthday, Project Deadline"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <Input
            label="Target Time (Optional)"
            type="time"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
          />
        </div>

        {/* Quick Select */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground mb-3">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickDate(1)}>
              Tomorrow
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate(7)}>
              1 Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate(30)}>
              1 Month
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate(90)}>
              3 Months
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDate(365)}>
              1 Year
            </Button>
          </div>
        </div>

        {/* Preset Events */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground mb-3">Popular Events</p>
          <div className="flex flex-wrap gap-2">
            {presetEvents.map((event) => (
              <Button
                key={event.name}
                variant="outline"
                size="sm"
                onClick={() => setPresetEvent(event.name, event.date)}
              >
                🎉 {event.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Timer
          </Button>
        </div>

        {/* Countdown Display */}
        {timeRemaining && (
          <div className="space-y-6">
            {eventName && (
              <h2 className="text-2xl font-bold text-center text-foreground">
                {timeRemaining.isPast ? "Time since" : "Time until"} {eventName}
              </h2>
            )}

            <div className={`rounded-2xl border-2 p-8 text-center ${
              timeRemaining.isPast 
                ? "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30"
                : "border-primary/30 bg-primary/5 dark:bg-primary/10"
            }`}>
              {timeRemaining.isPast && (
                <p className="text-orange-600 dark:text-orange-400 text-sm mb-4">
                  ⏰ This event has passed
                </p>
              )}

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-4xl sm:text-6xl font-bold ${
                    timeRemaining.isPast 
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-primary"
                  }`}>
                    {timeRemaining.days}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {timeRemaining.days === 1 ? "Day" : "Days"}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl sm:text-6xl font-bold ${
                    timeRemaining.isPast 
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-primary"
                  }`}>
                    {String(timeRemaining.hours).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {timeRemaining.hours === 1 ? "Hour" : "Hours"}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl sm:text-6xl font-bold ${
                    timeRemaining.isPast 
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-primary"
                  }`}>
                    {String(timeRemaining.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {timeRemaining.minutes === 1 ? "Minute" : "Minutes"}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl sm:text-6xl font-bold ${
                    timeRemaining.isPast 
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-primary"
                  }`}>
                    {String(timeRemaining.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {timeRemaining.seconds === 1 ? "Second" : "Seconds"}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Target Date & Time</p>
              <p className="text-muted-foreground">
                {new Date(`${targetDate}T${targetTime}:00`).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Total Time Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(timeRemaining.total / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-xs text-muted-foreground">Total Days</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(timeRemaining.total / (1000 * 60 * 60))}
                </p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(timeRemaining.total / (1000 * 60)).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Minutes</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(timeRemaining.total / 1000).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Seconds</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
