"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type FilingStatus = "single" | "married_joint" | "married_separate" | "head_of_household";

// 2024 Federal Tax Brackets
const FEDERAL_TAX_BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married_joint: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  married_separate: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 365600, rate: 0.35 },
    { min: 365600, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

// 2024 Standard Deductions
const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900,
};

// Social Security and Medicare rates
const SOCIAL_SECURITY_RATE = 0.062;
const SOCIAL_SECURITY_WAGE_BASE = 168600;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_of_household: 200000,
};

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  federalTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  takeHomePay: number;
  effectiveRate: number;
  marginalRate: number;
  monthlyTakeHome: number;
  brackets: { rate: number; taxableAmount: number; tax: number }[];
}

function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus): { tax: number; marginalRate: number; brackets: TaxResult["brackets"] } {
  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
  let totalTax = 0;
  let marginalRate = 0;
  const bracketBreakdown: TaxResult["brackets"] = [];

  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
      const taxInBracket = taxableInBracket * bracket.rate;
      totalTax += taxInBracket;
      marginalRate = bracket.rate;

      if (taxableInBracket > 0) {
        bracketBreakdown.push({
          rate: bracket.rate,
          taxableAmount: taxableInBracket,
          tax: taxInBracket,
        });
      }
    }
  }

  return { tax: totalTax, marginalRate, brackets: bracketBreakdown };
}

export default function TaxCalculator() {
  const [grossIncome, setGrossIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [deductionType, setDeductionType] = useState<"standard" | "itemized">("standard");
  const [itemizedDeductions, setItemizedDeductions] = useState("");
  const [prePostTaxDeductions, setPreTaxDeductions] = useState("");

  const result = useMemo<TaxResult | null>(() => {
    const income = parseFloat(grossIncome);

    if (isNaN(income) || income <= 0) {
      return null;
    }

    const preTaxDeductionsAmount = parseFloat(prePostTaxDeductions) || 0;
    const adjustedIncome = income - preTaxDeductionsAmount;

    const deduction = deductionType === "standard"
      ? STANDARD_DEDUCTIONS[filingStatus]
      : parseFloat(itemizedDeductions) || 0;

    const taxableIncome = Math.max(0, adjustedIncome - deduction);

    const { tax: federalTax, marginalRate, brackets } = calculateFederalTax(taxableIncome, filingStatus);

    // Social Security (6.2% up to wage base)
    const socialSecurity = Math.min(income, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;

    // Medicare (1.45% + 0.9% additional for high earners)
    let medicare = income * MEDICARE_RATE;
    const additionalMedicareThreshold = ADDITIONAL_MEDICARE_THRESHOLD[filingStatus];
    if (income > additionalMedicareThreshold) {
      medicare += (income - additionalMedicareThreshold) * ADDITIONAL_MEDICARE_RATE;
    }

    const totalTax = federalTax + socialSecurity + medicare;
    const takeHomePay = income - totalTax;
    const effectiveRate = (totalTax / income) * 100;

    return {
      grossIncome: income,
      taxableIncome,
      federalTax,
      socialSecurity,
      medicare,
      totalTax,
      takeHomePay,
      effectiveRate,
      marginalRate: marginalRate * 100,
      monthlyTakeHome: takeHomePay / 12,
      brackets,
    };
  }, [grossIncome, filingStatus, deductionType, itemizedDeductions, prePostTaxDeductions]);

  const reset = () => {
    setGrossIncome("");
    setFilingStatus("single");
    setDeductionType("standard");
    setItemizedDeductions("");
    setPreTaxDeductions("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ToolLayout
      title="Tax Calculator"
      description="Estimate your federal income tax, Social Security, Medicare, and take-home pay. Based on 2024 US tax brackets and rates."
      category={{ name: "Finance", slug: "finance" }}
      relatedTools={[
        { name: "Salary Calculator", href: "/salary-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Federal Income Tax</h2>
          <p>
            The United States uses a progressive tax system where different portions of your income are taxed at different rates. This calculator estimates your federal income tax based on the 2024 tax brackets, along with Social Security and Medicare taxes.
          </p>

          <h2>2024 Tax Brackets (Single Filers)</h2>
          <ul>
            <li><strong>10%:</strong> $0 - $11,600</li>
            <li><strong>12%:</strong> $11,601 - $47,150</li>
            <li><strong>22%:</strong> $47,151 - $100,525</li>
            <li><strong>24%:</strong> $100,526 - $191,950</li>
            <li><strong>32%:</strong> $191,951 - $243,725</li>
            <li><strong>35%:</strong> $243,726 - $609,350</li>
            <li><strong>37%:</strong> Over $609,350</li>
          </ul>

          <h2>Standard Deductions for 2024</h2>
          <ul>
            <li><strong>Single:</strong> $14,600</li>
            <li><strong>Married Filing Jointly:</strong> $29,200</li>
            <li><strong>Married Filing Separately:</strong> $14,600</li>
            <li><strong>Head of Household:</strong> $21,900</li>
          </ul>

          <h2>FICA Taxes</h2>
          <ul>
            <li><strong>Social Security:</strong> 6.2% on earnings up to $168,600</li>
            <li><strong>Medicare:</strong> 1.45% on all earnings (plus 0.9% additional on earnings over threshold)</li>
          </ul>

          <h3>Disclaimer</h3>
          <p>
            This calculator provides estimates based on 2024 federal tax rates. It does not include state taxes, local taxes, or all possible deductions and credits. Consult a tax professional for accurate tax planning.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          label="Annual Gross Income"
          type="number"
          value={grossIncome}
          onChange={(e) => setGrossIncome(e.target.value)}
          placeholder="Enter your annual income"
          suffix="$"
        />

        <Select
          label="Filing Status"
          id="filingStatus"
          value={filingStatus}
          onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
          options={[
            { value: "single", label: "Single" },
            { value: "married_joint", label: "Married Filing Jointly" },
            { value: "married_separate", label: "Married Filing Separately" },
            { value: "head_of_household", label: "Head of Household" },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Deduction Type"
            id="deductionType"
            value={deductionType}
            onChange={(e) => setDeductionType(e.target.value as "standard" | "itemized")}
            options={[
              { value: "standard", label: `Standard ($${STANDARD_DEDUCTIONS[filingStatus].toLocaleString()})` },
              { value: "itemized", label: "Itemized" },
            ]}
          />
          {deductionType === "itemized" && (
            <Input
              label="Itemized Deductions"
              type="number"
              value={itemizedDeductions}
              onChange={(e) => setItemizedDeductions(e.target.value)}
              placeholder="Enter total"
              suffix="$"
            />
          )}
        </div>

        <Input
          label="Pre-Tax Deductions (401k, HSA, etc.)"
          type="number"
          value={prePostTaxDeductions}
          onChange={(e) => setPreTaxDeductions(e.target.value)}
          placeholder="Optional"
          suffix="$"
        />

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <ResultsGrid columns={2}>
              <ResultCard 
                label="Annual Take-Home Pay" 
                value={formatCurrency(result.takeHomePay)} 
                highlight 
              />
              <ResultCard 
                label="Monthly Take-Home" 
                value={formatCurrency(result.monthlyTakeHome)} 
              />
            </ResultsGrid>

            <ResultsGrid columns={3}>
              <ResultCard label="Federal Tax" value={formatCurrency(result.federalTax)} />
              <ResultCard label="Effective Tax Rate" value={`${result.effectiveRate.toFixed(1)}%`} />
              <ResultCard label="Marginal Tax Rate" value={`${result.marginalRate.toFixed(0)}%`} />
            </ResultsGrid>

            {/* Tax Breakdown */}
            <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
              <p className="text-sm font-medium text-foreground mb-4">Tax Breakdown</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Gross Income</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.grossIncome)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Taxable Income</span>
                  <span className="font-semibold text-foreground">{formatCurrency(result.taxableIncome)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Federal Income Tax</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(result.federalTax)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Social Security (6.2%)</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(result.socialSecurity)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Medicare (1.45%)</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(result.medicare)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Total Tax</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(result.totalTax)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-foreground font-medium">Net Take-Home Pay</span>
                  <span className="font-bold text-green-600">{formatCurrency(result.takeHomePay)}</span>
                </div>
              </div>
            </div>

            {/* Tax Bracket Breakdown */}
            {result.brackets.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground mb-4">Federal Tax by Bracket</p>
                <div className="space-y-2">
                  {result.brackets.map((bracket, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {(bracket.rate * 100).toFixed(0)}% on {formatCurrency(bracket.taxableAmount)}
                      </span>
                      <span className="font-medium text-foreground">{formatCurrency(bracket.tax)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
