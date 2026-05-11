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

type FilingStatus = "single" | "married";

const stateOptions = [
  { value: "CA", label: "California", taxRate: 0.093 },
  { value: "NY", label: "New York", taxRate: 0.0685 },
  { value: "TX", label: "Texas", taxRate: 0 },
  { value: "FL", label: "Florida", taxRate: 0 },
  { value: "WA", label: "Washington", taxRate: 0 },
  { value: "IL", label: "Illinois", taxRate: 0.0495 },
  { value: "OH", label: "Ohio", taxRate: 0.0399 },
];

const faqs: FAQItem[] = [
  {
    question: "What deductions are included in this US salary calculator?",
    answer:
      "It includes federal income tax, selected state income tax, Social Security, and Medicare. It is intended for planning scenarios, not payroll filing.",
  },
  {
    question: "Why can my payslip differ from this output?",
    answer:
      "Real payroll may include city taxes, pre-tax benefit elections, tax credits, supplemental withholding rules, and employer-specific payroll timing.",
  },
  {
    question: "Does this support filing status differences?",
    answer:
      "Yes. You can switch between single and married filing assumptions with separate standard deduction and bracket logic.",
  },
];

export default function USSalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState("90000");
  const [bonus, setBonus] = useState("5000");
  const [preTaxDeductions, setPreTaxDeductions] = useState("6000");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [stateCode, setStateCode] = useState("CA");

  const result = useMemo(() => {
    const gross = Number.parseFloat(grossSalary);
    const annualBonus = Number.parseFloat(bonus) || 0;
    const preTax = Number.parseFloat(preTaxDeductions) || 0;
    const state = stateOptions.find((option) => option.value === stateCode);

    if (!Number.isFinite(gross) || gross <= 0 || !state) return null;

    const totalGross = gross + Math.max(0, annualBonus);
    const adjustedIncome = Math.max(0, totalGross - Math.max(0, preTax));

    const standardDeduction = filingStatus === "single" ? 14_600 : 29_200;
    const taxableIncome = Math.max(0, adjustedIncome - standardDeduction);

    const federalBracketsSingle = [
      { cap: 11_600, rate: 0.1 },
      { cap: 47_150, rate: 0.12 },
      { cap: 100_525, rate: 0.22 },
      { cap: 191_950, rate: 0.24 },
      { cap: 243_725, rate: 0.32 },
      { cap: 609_350, rate: 0.35 },
      { cap: Number.POSITIVE_INFINITY, rate: 0.37 },
    ];

    const federalBracketsMarried = [
      { cap: 23_200, rate: 0.1 },
      { cap: 94_300, rate: 0.12 },
      { cap: 201_050, rate: 0.22 },
      { cap: 383_900, rate: 0.24 },
      { cap: 487_450, rate: 0.32 },
      { cap: 731_200, rate: 0.35 },
      { cap: Number.POSITIVE_INFINITY, rate: 0.37 },
    ];

    const federalTax = calculateProgressiveTax(
      taxableIncome,
      filingStatus === "single" ? federalBracketsSingle : federalBracketsMarried
    );
    const stateTax = adjustedIncome * state.taxRate;

    const socialSecurityWageBase = 168_600;
    const socialSecurity =
      Math.min(adjustedIncome, socialSecurityWageBase) * 0.062;
    const medicareBase = adjustedIncome * 0.0145;
    const additionalMedicareThreshold =
      filingStatus === "single" ? 200_000 : 250_000;
    const additionalMedicare =
      Math.max(0, adjustedIncome - additionalMedicareThreshold) * 0.009;
    const medicare = medicareBase + additionalMedicare;

    const totalDeductions =
      Math.max(0, preTax) +
      federalTax +
      stateTax +
      socialSecurity +
      medicare;
    const netAnnual = Math.max(0, totalGross - totalDeductions);
    const periods = toPayPeriods(netAnnual);

    return {
      totalGross,
      adjustedIncome,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      preTax: Math.max(0, preTax),
      netAnnual,
      ...periods,
      effectiveRate: totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0,
      stateLabel: state.label,
    };
  }, [grossSalary, bonus, preTaxDeductions, filingStatus, stateCode]);

  return (
    <ToolLayout
      title="US Salary Calculator"
      slug="us-salary-calculator"
      description="Calculate US take-home salary after federal tax, state tax, Social Security, and Medicare."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      relatedTools={[
        { name: "US Paycheck Calculator", href: "/us-paycheck-calculator/" },
        { name: "Salary After Tax Calculator", href: "/salary-after-tax-calculator/" },
        { name: "Tax Calculator", href: "/tax-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter gross salary", text: "Add annual base salary and optional bonus." },
        { name: "Add pre-tax deductions", text: "Include 401(k), HSA, or similar pre-tax amounts." },
        { name: "Set filing status and state", text: "Apply federal bracket and state tax assumptions." },
        { name: "Review net pay", text: "Use annual, monthly, biweekly, and weekly take-home outputs." },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Annual Gross Salary" type="number" min={1} step="1000" suffix="$" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} />
          <Input label="Annual Bonus" type="number" min={0} step="500" suffix="$" value={bonus} onChange={(e) => setBonus(e.target.value)} />
          <Input label="Pre-tax Deductions" type="number" min={0} step="500" suffix="$" value={preTaxDeductions} onChange={(e) => setPreTaxDeductions(e.target.value)} />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Filing Status</label>
            <select
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            >
              {stateOptions.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard label="Net Annual Pay" value={formatCurrency(result.netAnnual, "USD")} highlight />
            <ResultCard label="Effective Deduction Rate" value={`${result.effectiveRate.toFixed(2)}%`} />
            <ResultCard label="Net Monthly Pay" value={formatCurrency(result.monthly, "USD")} />
            <ResultCard label="Net Biweekly Pay" value={formatCurrency(result.biweekly, "USD")} />
            <ResultCard label="Federal Tax" value={formatCurrency(result.federalTax, "USD")} />
            <ResultCard label={`${result.stateLabel} State Tax`} value={formatCurrency(result.stateTax, "USD")} />
            <ResultCard label="Social Security" value={formatCurrency(result.socialSecurity, "USD")} />
            <ResultCard label="Medicare" value={formatCurrency(result.medicare, "USD")} />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid salary values to calculate US take-home pay.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
