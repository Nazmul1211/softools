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

const provinceOptions = [
  { value: "ON", label: "Ontario", taxRate: 0.0505 },
  { value: "BC", label: "British Columbia", taxRate: 0.0506 },
  { value: "AB", label: "Alberta", taxRate: 0.1 },
  { value: "QC", label: "Quebec", taxRate: 0.14 },
  { value: "MB", label: "Manitoba", taxRate: 0.108 },
];

const faqs: FAQItem[] = [
  {
    question: "What does this Canada salary calculator include?",
    answer:
      "It models federal tax, a province-level tax assumption, Canada Pension Plan (CPP), and Employment Insurance (EI) for planning take-home pay.",
  },
  {
    question: "Is this an official CRA payroll calculator?",
    answer:
      "No. This is a scenario-planning tool. Official payroll can differ due to tax credits, benefit elections, and province-specific details.",
  },
  {
    question: "Why include CPP and EI separately?",
    answer:
      "CPP and EI materially affect net salary in Canada and are payroll deductions distinct from income tax.",
  },
];

export default function CanadaSalaryCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState("90000");
  const [bonus, setBonus] = useState("5000");
  const [preTaxDeductions, setPreTaxDeductions] = useState("3000");
  const [province, setProvince] = useState("ON");

  const result = useMemo(() => {
    const gross = Number.parseFloat(grossSalary);
    const annualBonus = Number.parseFloat(bonus) || 0;
    const preTax = Number.parseFloat(preTaxDeductions) || 0;
    const region = provinceOptions.find((item) => item.value === province);

    if (!Number.isFinite(gross) || gross <= 0 || !region) return null;

    const totalGross = gross + Math.max(0, annualBonus);
    const adjustedIncome = Math.max(0, totalGross - Math.max(0, preTax));
    const basicPersonalAmount = 15_705;
    const taxableIncome = Math.max(0, adjustedIncome - basicPersonalAmount);

    const federalTax = calculateProgressiveTax(taxableIncome, [
      { cap: 55_867, rate: 0.15 },
      { cap: 111_733, rate: 0.205 },
      { cap: 173_205, rate: 0.26 },
      { cap: 246_752, rate: 0.29 },
      { cap: Number.POSITIVE_INFINITY, rate: 0.33 },
    ]);

    const provincialTax = taxableIncome * region.taxRate;

    const cppPensionable = Math.max(0, Math.min(adjustedIncome, 68_500) - 3_500);
    const cpp = cppPensionable * 0.0595;
    const ei = Math.min(adjustedIncome, 63_200) * 0.0166;

    const totalDeductions =
      Math.max(0, preTax) + federalTax + provincialTax + cpp + ei;
    const netAnnual = Math.max(0, totalGross - totalDeductions);
    const periods = toPayPeriods(netAnnual);

    return {
      totalGross,
      federalTax,
      provincialTax,
      cpp,
      ei,
      netAnnual,
      ...periods,
      effectiveRate: totalGross > 0 ? (totalDeductions / totalGross) * 100 : 0,
      provinceLabel: region.label,
    };
  }, [grossSalary, bonus, preTaxDeductions, province]);

  return (
    <ToolLayout
      title="Canada Salary Calculator"
      slug="canada-salary-calculator"
      description="Estimate Canada take-home salary with federal tax, provincial tax, CPP, and EI assumptions."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Salary Calculator", href: "/salary-calculator/" },
        { name: "UK Salary Calculator", href: "/uk-salary-calculator/" },
        { name: "US Salary Calculator", href: "/us-salary-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter gross salary", text: "Add annual salary and optional bonus values." },
        { name: "Select province", text: "Apply province tax assumptions for scenario planning." },
        { name: "Add pre-tax deductions", text: "Include pension or other pre-tax values." },
        { name: "Review net outputs", text: "Use annual, monthly, and biweekly take-home values." },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Annual Gross Salary" type="number" min={1} step="1000" suffix="C$" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} />
          <Input label="Annual Bonus" type="number" min={0} step="500" suffix="C$" value={bonus} onChange={(e) => setBonus(e.target.value)} />
          <Input label="Pre-tax Deductions" type="number" min={0} step="500" suffix="C$" value={preTaxDeductions} onChange={(e) => setPreTaxDeductions(e.target.value)} />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Province</label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-muted"
            >
              {provinceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard label="Net Annual Pay" value={formatCurrency(result.netAnnual, "CAD", "en-CA")} highlight />
            <ResultCard label="Effective Deduction Rate" value={`${result.effectiveRate.toFixed(2)}%`} />
            <ResultCard label="Net Monthly Pay" value={formatCurrency(result.monthly, "CAD", "en-CA")} />
            <ResultCard label="Net Biweekly Pay" value={formatCurrency(result.biweekly, "CAD", "en-CA")} />
            <ResultCard label="Federal Tax" value={formatCurrency(result.federalTax, "CAD", "en-CA")} />
            <ResultCard label={`${result.provinceLabel} Tax`} value={formatCurrency(result.provincialTax, "CAD", "en-CA")} />
            <ResultCard label="CPP" value={formatCurrency(result.cpp, "CAD", "en-CA")} />
            <ResultCard label="EI" value={formatCurrency(result.ei, "CAD", "en-CA")} />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid salary values to calculate Canadian take-home pay.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
