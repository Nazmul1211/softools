"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type PayPeriod = "hourly" | "daily" | "weekly" | "biweekly" | "semimonthly" | "monthly" | "annual";

interface SalaryResult {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  semimonthly: number;
  monthly: number;
  annual: number;
}

const HOURS_PER_DAY = 8;
const DAYS_PER_WEEK = 5;
const WEEKS_PER_YEAR = 52;

export default function SalaryCalculator() {
  const [amount, setAmount] = useState("");
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");

  const result = useMemo<SalaryResult | null>(() => {
    const value = parseFloat(amount);
    const hours = parseFloat(hoursPerWeek) || 40;
    const days = parseFloat(daysPerWeek) || 5;

    if (isNaN(value) || value <= 0) {
      return null;
    }

    const hoursPerYear = hours * WEEKS_PER_YEAR;
    const daysPerYear = days * WEEKS_PER_YEAR;

    let annual: number;

    switch (payPeriod) {
      case "hourly":
        annual = value * hoursPerYear;
        break;
      case "daily":
        annual = value * daysPerYear;
        break;
      case "weekly":
        annual = value * WEEKS_PER_YEAR;
        break;
      case "biweekly":
        annual = value * 26; // 26 bi-weekly periods per year
        break;
      case "semimonthly":
        annual = value * 24; // 24 semi-monthly periods per year
        break;
      case "monthly":
        annual = value * 12;
        break;
      case "annual":
      default:
        annual = value;
        break;
    }

    return {
      hourly: annual / hoursPerYear,
      daily: annual / daysPerYear,
      weekly: annual / WEEKS_PER_YEAR,
      biweekly: annual / 26,
      semimonthly: annual / 24,
      monthly: annual / 12,
      annual,
    };
  }, [amount, payPeriod, hoursPerWeek, daysPerWeek]);

  const reset = () => {
    setAmount("");
    setPayPeriod("annual");
    setHoursPerWeek("40");
    setDaysPerWeek("5");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <ToolLayout
      title="Salary Calculator"
      description="Convert your salary between hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual rates. Understand your true earning potential."
      category={{ name: "Finance", slug: "finance" }}
      relatedTools={[
        { name: "Tax Calculator", href: "/tax-calculator" },
        { name: "Tip Calculator", href: "/tip-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
      ]}
      content={
        <>
          <h2>How to Use the Salary Calculator</h2>
          <p>
            This salary calculator helps you convert your pay between different time periods. Enter your current salary amount, select the pay period it represents, and the calculator will show you equivalent amounts across all common pay frequencies.
          </p>

          <h2>Understanding Pay Periods</h2>
          <ul>
            <li><strong>Hourly:</strong> Pay per hour worked</li>
            <li><strong>Daily:</strong> Pay per day worked</li>
            <li><strong>Weekly:</strong> Pay for one week (52 weeks/year)</li>
            <li><strong>Bi-weekly:</strong> Pay every two weeks (26 pay periods/year)</li>
            <li><strong>Semi-monthly:</strong> Pay twice per month (24 pay periods/year)</li>
            <li><strong>Monthly:</strong> Pay once per month (12 pay periods/year)</li>
            <li><strong>Annual:</strong> Total yearly salary</li>
          </ul>

          <h2>Salary Conversion Formulas</h2>
          <p>The calculator uses the following assumptions for conversions:</p>
          <ul>
            <li>52 weeks per year</li>
            <li>Customizable hours per week (default: 40)</li>
            <li>Customizable days per week (default: 5)</li>
            <li>26 bi-weekly pay periods per year</li>
            <li>24 semi-monthly pay periods per year</li>
          </ul>

          <h2>Tips for Salary Negotiation</h2>
          <ul>
            <li>Know your market value by researching industry salaries</li>
            <li>Consider total compensation including benefits, bonuses, and equity</li>
            <li>Understand the difference between gross and net pay</li>
            <li>Factor in work hours when comparing hourly vs salaried positions</li>
            <li>Account for overtime eligibility in hourly positions</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Salary Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            suffix="$"
          />
          <Select
            label="Pay Period"
            id="payPeriod"
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value as PayPeriod)}
            options={[
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "biweekly", label: "Bi-weekly (every 2 weeks)" },
              { value: "semimonthly", label: "Semi-monthly (twice/month)" },
              { value: "monthly", label: "Monthly" },
              { value: "annual", label: "Annual" },
            ]}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Hours Per Week"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="40"
          />
          <Input
            label="Days Per Week"
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(e.target.value)}
            placeholder="5"
          />
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <ResultsGrid columns={2}>
              <ResultCard 
                label="Annual Salary" 
                value={formatCurrency(result.annual)} 
                highlight 
              />
              <ResultCard 
                label="Monthly Salary" 
                value={formatCurrency(result.monthly)} 
              />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
              <p className="text-sm font-medium text-foreground mb-4">All Pay Periods</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Hourly</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.hourly)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Daily</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.daily)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Weekly</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.weekly)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Bi-weekly</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.biweekly)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Semi-monthly</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.semimonthly)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Monthly</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.monthly)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Annual</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.annual)}</span>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="rounded-xl border border-border bg-primary/5 dark:bg-primary/10 p-4">
              <p className="text-sm font-medium text-foreground mb-2">Quick Reference</p>
              <p className="text-sm text-muted-foreground">
                Based on {hoursPerWeek} hours/week and {daysPerWeek} days/week, your effective hourly rate is{" "}
                <span className="font-semibold text-primary">{formatCurrency(result.hourly)}</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
