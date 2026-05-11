"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

interface RemoteWorkResult {
  adjustedSalary: number;
  annualCommuteSavings: number;
  annualRemoteCosts: number;
  annualStipend: number;
  effectiveRemoteComp: number;
  annualDifference: number;
  monthlyDifference: number;
  breakEvenAdjustmentPercent: number;
}

const faqs: FAQItem[] = [
  {
    question: "Why compare remote offers with a total-comp model?",
    answer:
      "Remote offers may include location-based salary adjustments, but they also reduce commuting costs and can include stipends. A total-comp model shows your true financial outcome.",
  },
  {
    question: "What should I include as remote costs?",
    answer:
      "Typical costs include internet upgrades, coworking, equipment maintenance, utilities, and occasional travel for team meetings.",
  },
  {
    question: "Is this tax-adjusted?",
    answer:
      "No. This tool compares gross annual value. For net pay projections, pair this with salary-after-tax tools.",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function RemoteWorkSalaryCalculatorPage() {
  const [officeSalary, setOfficeSalary] = useState("90000");
  const [salaryAdjustmentPercent, setSalaryAdjustmentPercent] = useState("-10");
  const [remoteDaysPerWeek, setRemoteDaysPerWeek] = useState("5");
  const [dailyCommuteCost, setDailyCommuteCost] = useState("16");
  const [monthlyRemoteCosts, setMonthlyRemoteCosts] = useState("180");
  const [annualStipend, setAnnualStipend] = useState("1200");

  const result = useMemo<RemoteWorkResult | null>(() => {
    const base = Number.parseFloat(officeSalary);
    const adjustment = Number.parseFloat(salaryAdjustmentPercent);
    const remoteDays = Number.parseFloat(remoteDaysPerWeek);
    const commuteCost = Number.parseFloat(dailyCommuteCost);
    const remoteCosts = Number.parseFloat(monthlyRemoteCosts);
    const stipend = Number.parseFloat(annualStipend);

    if (
      !Number.isFinite(base) ||
      !Number.isFinite(adjustment) ||
      !Number.isFinite(remoteDays) ||
      !Number.isFinite(commuteCost) ||
      !Number.isFinite(remoteCosts) ||
      !Number.isFinite(stipend) ||
      base <= 0 ||
      remoteDays < 0 ||
      remoteDays > 7 ||
      commuteCost < 0 ||
      remoteCosts < 0 ||
      stipend < 0
    ) {
      return null;
    }

    const adjustedSalary = base * (1 + adjustment / 100);
    const annualCommuteSavings = remoteDays * 52 * commuteCost;
    const annualRemoteCosts = remoteCosts * 12;
    const effectiveRemoteComp =
      adjustedSalary + annualCommuteSavings + stipend - annualRemoteCosts;
    const annualDifference = effectiveRemoteComp - base;
    const monthlyDifference = annualDifference / 12;

    const breakEvenAdjustmentPercent =
      ((base - annualCommuteSavings - stipend + annualRemoteCosts) / base - 1) *
      100;

    return {
      adjustedSalary,
      annualCommuteSavings,
      annualRemoteCosts,
      annualStipend: stipend,
      effectiveRemoteComp,
      annualDifference,
      monthlyDifference,
      breakEvenAdjustmentPercent,
    };
  }, [
    officeSalary,
    salaryAdjustmentPercent,
    remoteDaysPerWeek,
    dailyCommuteCost,
    monthlyRemoteCosts,
    annualStipend,
  ]);

  return (
    <ToolLayout
      title="Remote Work Salary Calculator"
      slug="remote-work-salary-calculator"
      description="Compare remote offers against your office baseline with salary adjustments, commute savings, stipend, and remote costs."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Set your office salary baseline",
          text: "Use your current or expected in-office annual salary as the comparison point.",
        },
        {
          name: "Add remote offer assumptions",
          text: "Enter salary adjustment percentage plus stipend and recurring remote costs.",
        },
        {
          name: "Model commute savings",
          text: "Use estimated daily commute costs and remote days per week.",
        },
        {
          name: "Review net annual impact",
          text: "Compare effective remote compensation vs your office baseline.",
        },
      ]}
      relatedTools={[
        { name: "Salary Calculator", href: "/salary-calculator/" },
        { name: "Salary After Tax Calculator", href: "/salary-after-tax-calculator/" },
        { name: "Hourly to Salary Calculator", href: "/hourly-to-salary-calculator/" },
      ]}
      content={
        <>
          <h2>How this remote salary calculator works</h2>
          <p>
            Remote compensation should be evaluated as a total value equation, not
            just base salary. This calculator combines salary adjustment, commute
            savings, stipend support, and remote-related costs into one annual
            effective compensation figure.
          </p>
          <h2>Core formula</h2>
          <p>
            <strong>
              Effective Remote Compensation = Adjusted Salary + Commute Savings +
              Stipend - Remote Costs
            </strong>
          </p>
          <p>
            Positive annual difference means the remote arrangement is financially
            better than your office baseline. Negative difference means the offer
            may require negotiation.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Office Salary Baseline"
            type="number"
            min={1}
            step="1000"
            suffix="$ / year"
            value={officeSalary}
            onChange={(event) => setOfficeSalary(event.target.value)}
          />
          <Input
            label="Remote Salary Adjustment"
            type="number"
            step="0.1"
            suffix="%"
            value={salaryAdjustmentPercent}
            onChange={(event) => setSalaryAdjustmentPercent(event.target.value)}
          />
          <Input
            label="Remote Days Per Week"
            type="number"
            min={0}
            max={7}
            step="0.5"
            value={remoteDaysPerWeek}
            onChange={(event) => setRemoteDaysPerWeek(event.target.value)}
          />
          <Input
            label="Daily Commute Cost Saved"
            type="number"
            min={0}
            step="0.01"
            suffix="$ / day"
            value={dailyCommuteCost}
            onChange={(event) => setDailyCommuteCost(event.target.value)}
          />
          <Input
            label="Monthly Remote Costs"
            type="number"
            min={0}
            step="0.01"
            suffix="$ / month"
            value={monthlyRemoteCosts}
            onChange={(event) => setMonthlyRemoteCosts(event.target.value)}
          />
          <Input
            label="Annual Home Office Stipend"
            type="number"
            min={0}
            step="0.01"
            suffix="$ / year"
            value={annualStipend}
            onChange={(event) => setAnnualStipend(event.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Effective Remote Compensation"
              value={formatCurrency(result.effectiveRemoteComp)}
              highlight
            />
            <ResultCard
              label="Annual Difference vs Office"
              value={formatCurrency(result.annualDifference)}
              subValue={
                result.annualDifference >= 0
                  ? "Remote is financially better"
                  : "Remote is financially lower"
              }
            />
            <ResultCard
              label="Adjusted Salary"
              value={formatCurrency(result.adjustedSalary)}
            />
            <ResultCard
              label="Annual Commute Savings"
              value={formatCurrency(result.annualCommuteSavings)}
            />
            <ResultCard
              label="Annual Remote Costs"
              value={formatCurrency(result.annualRemoteCosts)}
            />
            <ResultCard
              label="Annual Stipend"
              value={formatCurrency(result.annualStipend)}
            />
            <ResultCard
              label="Monthly Difference"
              value={formatCurrency(result.monthlyDifference)}
            />
            <ResultCard
              label="Break-Even Salary Adjustment"
              value={`${result.breakEvenAdjustmentPercent.toFixed(2)}%`}
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to compare remote compensation.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
