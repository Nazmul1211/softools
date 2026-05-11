"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { formatCurrency, toPayPeriods } from "@/lib/salary-calculations";

const faqs: FAQItem[] = [
  {
    question: "Does UAE have income tax?",
    answer:
      "No. The UAE has no personal income tax. Your gross salary is largely your take-home (minus optional deductions and allowances).",
  },
  {
    question: "What are typical allowances in UAE employment?",
    answer:
      "Housing allowance, transportation allowance, and food allowance are common. These vary by employer and employment contract.",
  },
  {
    question: "What deductions might apply?",
    answer:
      "Voluntary deductions might include health insurance, savings plans, or other employee benefits. Not mandatory by law.",
  },
];

export default function UAESalaryCalculatorPage() {
  const [baseSalary, setBaseSalary] = useState("10000");
  const [housingAllowance, setHousingAllowance] = useState("3000");
  const [transportAllowance, setTransportAllowance] = useState("1000");
  const [otherAllowance, setOtherAllowance] = useState("500");
  const [deductions, setDeductions] = useState("500");

  const result = useMemo(() => {
    const base = Number.parseFloat(baseSalary);
    const housing = Number.parseFloat(housingAllowance) || 0;
    const transport = Number.parseFloat(transportAllowance) || 0;
    const other = Number.parseFloat(otherAllowance) || 0;
    const ded = Number.parseFloat(deductions) || 0;

    if (!Number.isFinite(base) || base <= 0) return null;

    const totalAllowances = Math.max(0, housing + transport + other);
    const totalGross = base + totalAllowances;
    const netAnnual = Math.max(0, totalGross * 12 - ded * 12);
    const periods = toPayPeriods(netAnnual);

    return {
      base,
      housing,
      transport,
      other,
      totalAllowances,
      totalGross,
      monthlyGross: totalGross,
      deductions: ded,
      netAnnual,
      ...periods,
    };
  }, [baseSalary, housingAllowance, transportAllowance, otherAllowance, deductions]);

  return (
    <ToolLayout
      title="UAE Salary Calculator"
      slug="uae-salary-calculator"
      description="Calculate UAE take-home salary with allowances and deductions. UAE has no personal income tax."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Singapore Salary Calculator", href: "/singapore-salary-calculator/" },
        { name: "Australia Salary Calculator", href: "/australia-salary-calculator/" },
        { name: "Salary Calculator", href: "/salary-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter base salary", text: "Input your monthly base salary." },
        { name: "Add allowances", text: "Include housing, transport, and other monthly allowances." },
        { name: "Set deductions", text: "Add any voluntary monthly deductions (insurance, etc)." },
        { name: "View take-home", text: "See annual, monthly, and biweekly net pay figures." },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Monthly Base Salary"
            type="number"
            min={1}
            step="500"
            suffix="AED"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
          />
          <Input
            label="Monthly Housing Allowance"
            type="number"
            min={0}
            step="500"
            suffix="AED"
            value={housingAllowance}
            onChange={(e) => setHousingAllowance(e.target.value)}
          />
          <Input
            label="Monthly Transport Allowance"
            type="number"
            min={0}
            step="500"
            suffix="AED"
            value={transportAllowance}
            onChange={(e) => setTransportAllowance(e.target.value)}
          />
          <Input
            label="Monthly Other Allowance"
            type="number"
            min={0}
            step="500"
            suffix="AED"
            value={otherAllowance}
            onChange={(e) => setOtherAllowance(e.target.value)}
          />
          <Input
            label="Monthly Deductions"
            type="number"
            min={0}
            step="100"
            suffix="AED"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
          />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Net Annual Pay"
              value={formatCurrency(result.netAnnual, "AED", "en-AE")}
              highlight
            />
            <ResultCard
              label="Monthly Net Pay"
              value={formatCurrency(
                result.monthly,
                "AED",
                "en-AE"
              )}
            />
            <ResultCard
              label="Monthly Gross"
              value={formatCurrency(result.monthlyGross, "AED", "en-AE")}
            />
            <ResultCard
              label="Total Allowances (Monthly)"
              value={formatCurrency(result.totalAllowances, "AED", "en-AE")}
            />
            <ResultCard
              label="Base Salary"
              value={formatCurrency(result.base, "AED", "en-AE")}
            />
            <ResultCard
              label="Monthly Deductions"
              value={formatCurrency(result.deductions, "AED", "en-AE")}
            />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid salary values to calculate UAE net pay.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
