"use client";

import { useState, useMemo, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

// Common time zones with their UTC offsets
const TIME_ZONES = [
  { value: "Pacific/Honolulu", label: "Hawaii (HST)", offset: -10 },
  { value: "America/Anchorage", label: "Alaska (AKST)", offset: -9 },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)", offset: -8 },
  { value: "America/Denver", label: "Denver (MST)", offset: -7 },
  { value: "America/Chicago", label: "Chicago (CST)", offset: -6 },
  { value: "America/New_York", label: "New York (EST)", offset: -5 },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)", offset: -3 },
  { value: "Atlantic/Reykjavik", label: "Reykjavik (GMT)", offset: 0 },
  { value: "Europe/London", label: "London (GMT/BST)", offset: 0 },
  { value: "Europe/Paris", label: "Paris (CET)", offset: 1 },
  { value: "Europe/Berlin", label: "Berlin (CET)", offset: 1 },
  { value: "Europe/Moscow", label: "Moscow (MSK)", offset: 3 },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: 4 },
  { value: "Asia/Karachi", label: "Karachi (PKT)", offset: 5 },
  { value: "Asia/Dhaka", label: "Dhaka (BST)", offset: 6 },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)", offset: 7 },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: 8 },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: 8 },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: 9 },
  { value: "Australia/Sydney", label: "Sydney (AEST)", offset: 10 },
  { value: "Pacific/Auckland", label: "Auckland (NZST)", offset: 12 },
];

export default function TimeZoneConverter() {
  const [fromZone, setFromZone] = useState("America/New_York");
  const [toZone, setToZone] = useState("Europe/London");
  const [inputTime, setInputTime] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({});

  // Set default date/time to now
  useEffect(() => {
    const now = new Date();
    const localDate = now.toISOString().split("T")[0];
    const localTime = now.toTimeString().slice(0, 5);
    setInputDate(localDate);
    setInputTime(localTime);
  }, []);

  // Update current times in all zones
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      TIME_ZONES.forEach((tz) => {
        try {
          times[tz.value] = new Date().toLocaleTimeString("en-US", {
            timeZone: tz.value,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch {
          times[tz.value] = "N/A";
        }
      });
      setCurrentTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertedTime = useMemo(() => {
    if (!inputTime || !inputDate) return null;

    try {
      // Create date in source timezone
      const [hours, minutes] = inputTime.split(":").map(Number);
      const dateStr = `${inputDate}T${inputTime}:00`;
      
      // Parse as local time first
      const sourceDate = new Date(dateStr);
      
      // Get the source timezone's current offset
      const sourceOffset = new Date().toLocaleString("en-US", { timeZone: fromZone });
      const sourceTime = new Date(sourceOffset);
      
      // Format in target timezone
      const targetTime = sourceDate.toLocaleString("en-US", {
        timeZone: toZone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const targetTimeShort = sourceDate.toLocaleTimeString("en-US", {
        timeZone: toZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const targetDateFormatted = sourceDate.toLocaleDateString("en-US", {
        timeZone: toZone,
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      // Calculate time difference
      const fromOffset = TIME_ZONES.find((tz) => tz.value === fromZone)?.offset ?? 0;
      const toOffset = TIME_ZONES.find((tz) => tz.value === toZone)?.offset ?? 0;
      const hourDiff = toOffset - fromOffset;

      return {
        fullTime: targetTime,
        shortTime: targetTimeShort,
        date: targetDateFormatted,
        hourDifference: hourDiff,
      };
    } catch {
      return null;
    }
  }, [inputTime, inputDate, fromZone, toZone]);

  const swapZones = () => {
    const temp = fromZone;
    setFromZone(toZone);
    setToZone(temp);
  };

  return (
    <ToolLayout
      title="Time Zone Converter"
      description="Convert times between different time zones worldwide. Perfect for scheduling international meetings, planning travel, or coordinating with remote teams."
      category={{ name: "Date & Time", slug: "date-time" }}
      relatedTools={[
        { name: "Date Calculator", href: "/date-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Countdown Timer", href: "/countdown-timer" },
      ]}
      content={
        <>
          <h2>About Time Zones</h2>
          <p>
            Time zones are regions of the Earth that observe a uniform standard time. There are 24 primary 
            time zones, each roughly 15 degrees of longitude apart. However, many regions have adopted 
            half-hour or quarter-hour offsets from Coordinated Universal Time (UTC).
          </p>

          <h2>UTC (Coordinated Universal Time)</h2>
          <p>
            UTC is the primary time standard by which the world regulates clocks. Time zones are expressed 
            as positive or negative offsets from UTC. For example, EST (Eastern Standard Time) is UTC-5, 
            meaning it is 5 hours behind UTC.
          </p>

          <h2>Daylight Saving Time (DST)</h2>
          <p>
            Many regions observe Daylight Saving Time, shifting clocks forward by one hour in spring and 
            back in fall. This can affect time differences between locations. Not all countries observe DST, 
            and the dates vary by region.
          </p>

          <h2>Common Time Zone Abbreviations</h2>
          <ul>
            <li><strong>PST/PDT:</strong> Pacific Standard/Daylight Time (UTC-8/-7)</li>
            <li><strong>MST/MDT:</strong> Mountain Standard/Daylight Time (UTC-7/-6)</li>
            <li><strong>CST/CDT:</strong> Central Standard/Daylight Time (UTC-6/-5)</li>
            <li><strong>EST/EDT:</strong> Eastern Standard/Daylight Time (UTC-5/-4)</li>
            <li><strong>GMT/BST:</strong> Greenwich Mean Time/British Summer Time (UTC+0/+1)</li>
            <li><strong>CET/CEST:</strong> Central European Time/Summer Time (UTC+1/+2)</li>
            <li><strong>IST:</strong> India Standard Time (UTC+5:30)</li>
            <li><strong>JST:</strong> Japan Standard Time (UTC+9)</li>
          </ul>

          <h2>Tips for International Scheduling</h2>
          <ul>
            <li>Use UTC as a common reference when coordinating across many time zones</li>
            <li>Consider business hours in all participating time zones</li>
            <li>Be aware of DST transitions which can temporarily change time differences</li>
            <li>Use calendar apps that automatically handle time zone conversions</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Date"
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <Input
            label="Time"
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] items-end">
          <Select
            label="From Time Zone"
            id="fromZone"
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
            options={TIME_ZONES.map((tz) => ({
              value: tz.value,
              label: `${tz.label} (UTC${tz.offset >= 0 ? "+" : ""}${tz.offset})`,
            }))}
          />
          <Button onClick={swapZones} variant="outline" className="mb-0.5">
            ⇄
          </Button>
          <Select
            label="To Time Zone"
            id="toZone"
            value={toZone}
            onChange={(e) => setToZone(e.target.value)}
            options={TIME_ZONES.map((tz) => ({
              value: tz.value,
              label: `${tz.label} (UTC${tz.offset >= 0 ? "+" : ""}${tz.offset})`,
            }))}
          />
        </div>

        {convertedTime && (
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {TIME_ZONES.find((tz) => tz.value === toZone)?.label}
              </p>
              <p className="text-4xl font-bold text-primary">
                {convertedTime.shortTime}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {convertedTime.date}
              </p>
            </div>

            <ResultsGrid columns={2}>
              <ResultCard
                label="Time Difference"
                value={`${convertedTime.hourDifference >= 0 ? "+" : ""}${convertedTime.hourDifference} hours`}
              />
              <ResultCard
                label="Full Date & Time"
                value={convertedTime.fullTime}
              />
            </ResultsGrid>
          </div>
        )}

        {/* World Clock */}
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <p className="text-sm font-medium text-foreground mb-4">🌍 Current Time Around the World</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TIME_ZONES.slice(0, 8).map((tz) => (
              <div key={tz.value} className="text-center p-2 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground">{tz.label.split(" ")[0]}</p>
                <p className="text-lg font-semibold text-foreground">{currentTimes[tz.value] || "--:--"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
