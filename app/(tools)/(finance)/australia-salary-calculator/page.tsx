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
    question: "What does this Australia salary calculator include?",
    answer:
      "It models PAYG income tax, Medicare levy (2%), and superannuation contributions for planning purposes.",
  },
  {
    question: "Is superannuation deducted from net pay?",
    answer:
      "This calculator includes superannuation as an employee contribution (optional). The 11.5% employer contribution is not shown as it is added to your retirement fund separately.",
  },
  {
    question: "Does this include Medicare levy surcharge?",
    answer:
      "No. This estimates the base 2% Medicare levy. Additional surcharge thresholds depend on income and private health insurance.",
  },
];

export default function AustraliaSalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState("100000");
  const [bonus, setBonus] = useState("5000");
  const [superPercent, setSuperPercent] = useState("11.5");

  const result = useMemo(() => {
    const gross = Number.parseFloat(grossSalary);
    const annualBonus = Number.parseFloat(bonus) || 0;
    const super_ = Number.parseFloat(superPercent) || 0;

    if (!Number.isFinite(gross) || gross <= 0) return null;

    const totalGross = gross + Math.max(0, annualBonus);
    const superAmount = Math.max(0, (totalGross * super_) / 100);
    const adjustedIncome = Math.max(0, totalGross - superAmount);

    const taxFreeThreshold = 18_200;
    const taxableIncome = Math.max(0, adjustedIncome - taxFreeThreshold);

    const incomeTax = calculateProgressiveTax(taxableIncome, [
      { cap: 45_000 - taxFreeThreshold, rate: 0.21 },
      { cap: 120_000 - taxFreeThreshold, rate: 0.37 },
      { cap: 180_000 - taxFreeThreshold, rate: 0.45 },
      { cap: Number.POSITIVE_INFINITY, rate: 0.47 },
    ]);

    const medicareLevyIncome = adjustedIncome;
    const medicareLevyAmount = medicareLevyIncome * 0.02;

    const totalDeductions =
      superAmount + incomeTax + medicareLevyAmount;
    const netAnnual = Math.max(0, totalGross - totalDeductions);
    const periods = toPayPeriods(netAnnual);

    return {
      totalGross,
      incomeTax,
      medicareLevyAmount,
      superAmount,
      netAnnual,
      ...periods,
      effectiveRate: totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0,
    };
  }, [grossSalary, bonus, superPercent]);

  return (
    <ToolLayout
      title="Australia Salary Calculator"
      slug="australia-salary-calculator"
      description="Calculate Australian take-home salary with income tax, Medicare levy, and superannuation."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Canada Salary Calculator", href: "/canada-salary-calculator/" },
        { name: "US Salary Calculator", href: "/us-salary-calculator/" },
        { name: "Salary Calculator", href: "/salary-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter gross salary", text: "Add annual salary and optional bonus." },
        { name: "Set superannuation percent", text: "Enter employee super contribution percentage." },
        { name: "Review deductions", text: "See income tax, Medicare levy, and super breakdown." },
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
            suffix="A$"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
          />
          <Input
            label="Annual Bonus"
            type="number"
            min={0}
            step="500"
            suffix="A$"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
          <Input
            label="Superannuation (%)"
            type="number"
            min={0}
            max={100}
            step="0.5"
            value={superPercent}
            onChange={(e) => setSuperPercent(e.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Net Annual Pay"
              value={formatCurrency(result.netAnnual, "AUD", "en-AU")}
              highlight
            />
            <ResultCard
              label="Effective Deduction Rate"
              value={`${result.effectiveRate.toFixed(2)}%`}
            />
            <ResultCard
              label="Net Monthly Pay"
              value={formatCurrency(result.monthly, "AUD", "en-AU")}
            />
            <ResultCard
              label="Net Biweekly Pay"
              value={formatCurrency(result.biweekly, "AUD", "en-AU")}
            />
            <ResultCard
              label="Income Tax"
              value={formatCurrency(result.incomeTax, "AUD", "en-AU")}
            />
            <ResultCard
              label="Medicare Levy"
              value={formatCurrency(result.medicareLevyAmount, "AUD", "en-AU")}
            />
            <ResultCard
              label="Superannuation"
              value={formatCurrency(result.superAmount, "AUD", "en-AU")}
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid salary values to calculate Australian take-home pay.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
