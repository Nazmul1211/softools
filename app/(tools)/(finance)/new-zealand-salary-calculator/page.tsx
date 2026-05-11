"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import {
  calculateProgressiveTax,
  formatCurrency,
  toPayPeriods,
} from "@/lib/salary-calculations";

const faqs: FAQItem[] = [
  {
    question: "What does this NZ salary calculator include?",
    answer:
      "It models PAYE income tax, ACC levies (0.59% on wages), and KiwiSaver contributions for planning purposes.",
  },
  {
    question: "Is KiwiSaver deducted from net pay?",
    answer:
      "Yes. Employee KiwiSaver contributions (typically 3%, 4%, 6%, 8%, or 10%) are deducted from gross before tax calculations.",
  },
  {
    question: "What is the ACC levy in New Zealand?",
    answer:
      "The Accident Compensation Corporation (ACC) levy is a mandatory insurance contribution (~0.59% on wages) deducted from gross salary.",
  },
];

export default function NewZealandSalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState("70000");
  const [bonus, setBonus] = useState("3000");
  const [kiwiSaverPercent, setKiwiSaverPercent] = useState("4");

  const result = useMemo(() => {
    const gross = Number.parseFloat(grossSalary);
    const annualBonus = Number.parseFloat(bonus) || 0;
    const kiwi = Number.parseFloat(kiwiSaverPercent) || 0;

    if (!Number.isFinite(gross) || gross <= 0) return null;

    const totalGross = gross + Math.max(0, annualBonus);
    const kiwiSaverAmount = Math.max(0, (totalGross * kiwi) / 100);
    const accLevyAmount = totalGross * 0.0059;
    const adjustedIncome = Math.max(0, totalGross - kiwiSaverAmount - accLevyAmount);

    const taxFreeThreshold = 0;
    const taxableIncome = Math.max(0, adjustedIncome - taxFreeThreshold);

    const incomeTax = calculateProgressiveTax(taxableIncome, [
      { cap: 14_000, rate: 0.105 },
      { cap: 48_000, rate: 0.175 },
      { cap: 70_000, rate: 0.3 },
      { cap: 180_000, rate: 0.33 },
      { cap: Number.POSITIVE_INFINITY, rate: 0.39 },
    ]);

    const totalDeductions = kiwiSaverAmount + accLevyAmount + incomeTax;
    const netAnnual = Math.max(0, totalGross - totalDeductions);
    const periods = toPayPeriods(netAnnual);

    return {
      totalGross,
      kiwiSaverAmount,
      accLevyAmount,
      incomeTax,
      netAnnual,
      ...periods,
      effectiveRate: totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0,
    };
  }, [grossSalary, bonus, kiwiSaverPercent]);

  return (
    <ToolLayout
      title="New Zealand Salary Calculator"
      slug="new-zealand-salary-calculator"
      description="Calculate New Zealand take-home salary with PAYE tax, ACC, and KiwiSaver deductions."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Australia Salary Calculator", href: "/australia-salary-calculator/" },
        { name: "Singapore Salary Calculator", href: "/singapore-salary-calculator/" },
        { name: "Salary Calculator", href: "/salary-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter gross salary", text: "Add annual salary and optional bonus." },
        { name: "Set KiwiSaver percent", text: "Enter employee KiwiSaver contribution percentage (3-10%)." },
        { name: "Review deductions", text: "See PAYE tax, ACC levy, and KiwiSaver breakdown." },
        { name: "Use take-home figures", text: "Plan with annual, monthly, or biweekly net pay." },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Annual Gross Salary"
            type="number"
            min={1}
            step="1000"
            suffix="NZ$"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
          />
          <Input
            label="Annual Bonus"
            type="number"
            min={0}
            step="500"
            suffix="NZ$"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
          <Input
            label="KiwiSaver (%)"
            type="number"
            min={0}
            max={100}
            step="0.5"
            value={kiwiSaverPercent}
            onChange={(e) => setKiwiSaverPercent(e.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Net Annual Pay"
              value={formatCurrency(result.netAnnual, "NZD", "en-NZ")}
              highlight
            />
            <ResultCard
              label="Effective Deduction Rate"
              value={`${result.effectiveRate.toFixed(2)}%`}
            />
            <ResultCard
              label="Net Monthly Pay"
              value={formatCurrency(result.monthly, "NZD", "en-NZ")}
            />
            <ResultCard
              label="Net Biweekly Pay"
              value={formatCurrency(result.biweekly, "NZD", "en-NZ")}
            />
            <ResultCard
              label="PAYE Income Tax"
              value={formatCurrency(result.incomeTax, "NZD", "en-NZ")}
            />
            <ResultCard
              label="ACC Levy"
              value={formatCurrency(result.accLevyAmount, "NZD", "en-NZ")}
            />
            <ResultCard
              label="KiwiSaver Contribution"
              value={formatCurrency(result.kiwiSaverAmount, "NZD", "en-NZ")}
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid salary values to calculate New Zealand take-home pay.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
