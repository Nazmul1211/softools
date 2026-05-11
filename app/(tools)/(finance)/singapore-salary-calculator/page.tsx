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
    question: "What tax assumptions does this Singapore calculator use?",
    answer:
      "It includes resident PAYE tax (based on 2026 brackets) and CPF contributions (employee 8%, plus employer 17% not shown in net pay).",
  },
  {
    question: "Does this include CPF employer contribution?",
    answer:
      "The 8% employee CPF is deducted from net pay. Employer CPF (17%) is added to your retirement account separately and not shown here.",
  },
  {
    question: "Are foreign worker rates different?",
    answer:
      "This assumes resident rates. Non-residents have different tax brackets and may have different CPF treatment.",
  },
];

export default function SingaporeSalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState("80000");
  const [bonus, setBonus] = useState("5000");

  const result = useMemo(() => {
    const gross = Number.parseFloat(grossSalary);
    const annualBonus = Number.parseFloat(bonus) || 0;

    if (!Number.isFinite(gross) || gross <= 0) return null;

    const totalGross = gross + Math.max(0, annualBonus);
    const cpfAmount = totalGross * 0.08;
    const chargeable = Math.max(0, totalGross - cpfAmount);

    const taxableIncome = Math.max(0, chargeable);
    const incomeTax = calculateProgressiveTax(taxableIncome, [
      { cap: 20_000, rate: 0.02 },
      { cap: 30_000, rate: 0.035 },
      { cap: 40_000, rate: 0.07 },
      { cap: 80_000, rate: 0.11 },
      { cap: 120_000, rate: 0.15 },
      { cap: 160_000, rate: 0.18 },
      { cap: 200_000, rate: 0.19 },
      { cap: 320_000, rate: 0.22 },
      { cap: Number.POSITIVE_INFINITY, rate: 0.23 },
    ]);

    const totalDeductions = cpfAmount + incomeTax;
    const netAnnual = Math.max(0, totalGross - totalDeductions);
    const periods = toPayPeriods(netAnnual);

    return {
      totalGross,
      cpfAmount,
      incomeTax,
      netAnnual,
      ...periods,
      effectiveRate: totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0,
    };
  }, [grossSalary, bonus]);

  return (
    <ToolLayout
      title="Singapore Salary Calculator"
      slug="singapore-salary-calculator"
      description="Calculate Singapore take-home salary with PAYE tax and CPF contributions."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      relatedTools={[
        { name: "UAE Salary Calculator", href: "/uae-salary-calculator/" },
        { name: "Australia Salary Calculator", href: "/australia-salary-calculator/" },
        { name: "Salary Calculator", href: "/salary-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter gross salary", text: "Add annual salary and optional bonus." },
        { name: "Review CPF deduction", text: "See 8% employee CPF contribution." },
        { name: "Check PAYE tax", text: "View income tax based on resident brackets." },
        { name: "Use net pay figures", text: "Plan with annual, monthly, or biweekly outputs." },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Annual Gross Salary"
            type="number"
            min={1}
            step="1000"
            suffix="SGD"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
          />
          <Input
            label="Annual Bonus"
            type="number"
            min={0}
            step="500"
            suffix="SGD"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Net Annual Pay"
              value={formatCurrency(result.netAnnual, "SGD", "en-SG")}
              highlight
            />
            <ResultCard
              label="Effective Deduction Rate"
              value={`${result.effectiveRate.toFixed(2)}%`}
            />
            <ResultCard
              label="Net Monthly Pay"
              value={formatCurrency(result.monthly, "SGD", "en-SG")}
            />
            <ResultCard
              label="Net Biweekly Pay"
              value={formatCurrency(result.biweekly, "SGD", "en-SG")}
            />
            <ResultCard
              label="Income Tax (PAYE)"
              value={formatCurrency(result.incomeTax, "SGD", "en-SG")}
            />
            <ResultCard
              label="CPF Employee Contribution"
              value={formatCurrency(result.cpfAmount, "SGD", "en-SG")}
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid salary values to calculate Singapore take-home pay.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
