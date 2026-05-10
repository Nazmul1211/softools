"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Calculator, Landmark, PoundSterling, Wallet } from "lucide-react";

type SalaryMode = "annual" | "hourly";
type Region = "england-wales-ni" | "scotland";
type StudentLoanPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";

const studentLoanThresholds: Record<
  StudentLoanPlan,
  { threshold: number; rate: number; label: string }
> = {
  none: { threshold: Number.POSITIVE_INFINITY, rate: 0, label: "No student loan" },
  plan1: { threshold: 24_990, rate: 0.09, label: "Plan 1" },
  plan2: { threshold: 27_295, rate: 0.09, label: "Plan 2" },
  plan4: { threshold: 31_395, rate: 0.09, label: "Plan 4 (Scotland)" },
  plan5: { threshold: 25_000, rate: 0.09, label: "Plan 5" },
  postgrad: { threshold: 21_000, rate: 0.06, label: "Postgraduate Loan" },
};

const faqs: FAQItem[] = [
  {
    question: "Does this UK salary calculator use exact HMRC payroll tables?",
    answer:
      "This calculator is designed for planning and job-offer comparison, not for statutory payroll filing. It applies UK tax, National Insurance, pension, and student loan logic using practical 2026/27 assumptions so you can forecast take-home pay quickly. For official payroll submissions and exact coding adjustments, always reconcile against HMRC outputs and your payslip.",
  },
  {
    question: "How does pension contribution affect take-home pay?",
    answer:
      "Pension contributions reduce immediate take-home pay, but can lower taxable pay and improve long-term retirement outcomes. In this calculator, pension is modeled as a percentage of gross salary before tax. That means higher pension percentages generally reduce income tax and NI exposure while increasing your retirement funding trajectory.",
  },
  {
    question: "What is the difference between England and Scotland tax calculations?",
    answer:
      "England, Wales, and Northern Ireland generally share one income-tax band system, while Scotland has separate bands and rates. The region toggle applies these differences to your estimate. This is essential because Scottish middle and higher earners can see noticeably different monthly net pay compared with equivalent gross pay in England.",
  },
  {
    question: "Should I include bonuses in annual salary?",
    answer:
      "For baseline budgeting, model base pay and bonus scenarios separately. Bonuses are often taxed through payroll in ways that can look higher in the bonus month due to cumulative or non-cumulative methods. Running separate projections helps you avoid overcommitting fixed monthly expenses to income that may not repeat reliably.",
  },
  {
    question: "How do student loans change net salary?",
    answer:
      "Student loan repayments in the UK are income-contingent. Each plan has its own threshold and repayment rate. This tool estimates annual deductions once your adjusted earnings exceed that threshold. If your earnings sit near a threshold, small salary changes can materially shift net monthly pay, so scenario planning is valuable.",
  },
  {
    question: "Why is my payslip still different?",
    answer:
      "Real payroll includes tax code adjustments, irregular pay periods, benefit-in-kind handling, salary sacrifice specifics, and sometimes arrears or corrections. This calculator is a transparent estimate engine for decision-making. Use it to compare options quickly, then validate final figures with your employer payroll report or HMRC guidance.",
  },
];

function formatGBP(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function progressiveTax(amount: number, bands: { cap: number; rate: number }[]): number {
  let remaining = Math.max(0, amount);
  let previousCap = 0;
  let tax = 0;
  for (const band of bands) {
    const taxable = Math.min(remaining, band.cap - previousCap);
    if (taxable <= 0) break;
    tax += taxable * band.rate;
    remaining -= taxable;
    previousCap = band.cap;
  }
  return tax;
}

export default function UKSalaryCalculator202627Page() {
  const [salaryMode, setSalaryMode] = useState<SalaryMode>("annual");
  const [annualSalary, setAnnualSalary] = useState(52_000);
  const [hourlyRate, setHourlyRate] = useState(24);
  const [hoursPerWeek, setHoursPerWeek] = useState(37.5);
  const [region, setRegion] = useState<Region>("england-wales-ni");
  const [pensionPercent, setPensionPercent] = useState(5);
  const [personalAllowance, setPersonalAllowance] = useState(12_570);
  const [studentLoanPlan, setStudentLoanPlan] = useState<StudentLoanPlan>("none");

  const result = useMemo(() => {
    const grossAnnual =
      salaryMode === "annual" ? Math.max(0, annualSalary) : Math.max(0, hourlyRate * hoursPerWeek * 52);
    const pensionAnnual = grossAnnual * (Math.max(0, pensionPercent) / 100);
    const adjustedIncome = Math.max(0, grossAnnual - pensionAnnual);

    const taperedAllowance =
      adjustedIncome <= 100_000
        ? personalAllowance
        : Math.max(0, personalAllowance - (adjustedIncome - 100_000) / 2);

    const taxableIncome = Math.max(0, adjustedIncome - taperedAllowance);

    const incomeTaxAnnual =
      region === "england-wales-ni"
        ? progressiveTax(taxableIncome, [
            { cap: 37_700, rate: 0.2 },
            { cap: 125_140 - taperedAllowance, rate: 0.4 },
            { cap: Number.POSITIVE_INFINITY, rate: 0.45 },
          ])
        : progressiveTax(taxableIncome, [
            { cap: 2_306, rate: 0.19 },
            { cap: 16_297, rate: 0.2 },
            { cap: 33_771, rate: 0.21 },
            { cap: 65_045, rate: 0.42 },
            { cap: 127_475, rate: 0.45 },
            { cap: Number.POSITIVE_INFINITY, rate: 0.48 },
          ]);

    const niAnnual =
      Math.max(0, Math.min(adjustedIncome, 50_270) - 12_570) * 0.08 +
      Math.max(0, adjustedIncome - 50_270) * 0.02;

    const loan = studentLoanThresholds[studentLoanPlan];
    const studentLoanAnnual =
      loan.rate === 0 ? 0 : Math.max(0, adjustedIncome - loan.threshold) * loan.rate;

    const totalDeductions = pensionAnnual + incomeTaxAnnual + niAnnual + studentLoanAnnual;
    const netAnnual = Math.max(0, grossAnnual - totalDeductions);

    return {
      grossAnnual,
      adjustedIncome,
      pensionAnnual,
      taxableIncome,
      incomeTaxAnnual,
      niAnnual,
      studentLoanAnnual,
      netAnnual,
      netMonthly: netAnnual / 12,
      netWeekly: netAnnual / 52,
      netHourly: netAnnual / 52 / Math.max(1, hoursPerWeek),
      effectiveDeductionRate: grossAnnual > 0 ? (totalDeductions / grossAnnual) * 100 : 0,
      taperedAllowance,
      loanLabel: loan.label,
    };
  }, [
    salaryMode,
    annualSalary,
    hourlyRate,
    hoursPerWeek,
    region,
    pensionPercent,
    personalAllowance,
    studentLoanPlan,
  ]);

  return (
    <ToolLayout
      title="UK Salary Calculator 2026/27"
      slug="uk-salary-calculator-2026-27"
      description="Estimate UK take-home pay for 2026/27 with income tax, National Insurance, pension deductions, and student loan plans. Compare England/Wales/NI and Scotland scenarios."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Salary Calculator", href: "/salary-calculator/" },
        { name: "US Paycheck Calculator", href: "/us-paycheck-calculator/" },
        { name: "Tax Calculator", href: "/tax-calculator/" },
        { name: "Payroll Calculator", href: "/payroll-calculator/" },
      ]}
      howToSteps={[
        { name: "Set salary mode", text: "Use annual salary or hourly rate input mode." },
        { name: "Choose UK region", text: "Apply England/Wales/NI or Scotland tax assumptions." },
        { name: "Add deductions", text: "Model pension and student loan plan impact." },
        { name: "Review take-home", text: "Use annual, monthly, and weekly outputs for planning." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this UK salary calculator covers</h2>
          <p>
            This tool estimates take-home pay for the UK 2026/27 planning cycle using a transparent salary-to-net
            approach. It models income tax, employee National Insurance, pension deduction effects, and student loan
            repayment plans. You can compare England/Wales/NI and Scotland assumptions in one place, which is useful
            for relocation planning, role comparisons, and compensation negotiations.
          </p>

          <h2>Calculation method and formula layers</h2>
          <p>
            The model starts with gross annual salary. Pension is applied as a pre-tax percentage to estimate adjusted
            income. Personal allowance assumptions are then used to compute taxable income. Income tax is calculated via
            progressive bands, not a single blended rate. National Insurance is calculated separately with lower and
            upper earnings logic, and student loan repayments are estimated only above each plan threshold.
          </p>
          <p>
            Net annual pay = Gross annual pay − pension contribution − income tax − NI − student loan. Net monthly and
            weekly figures are derived from this annual result so you can plan both strategic and day-to-day cash flow.
          </p>

          <h2>Worked example</h2>
          <p>
            Assume a £52,000 salary, 5% pension, England/Wales/NI region, and no student loan. The calculator applies
            pension first, then personal allowance, then progressive tax rates, then NI thresholds. The output provides
            annual net, monthly take-home, and effective deduction rate. By changing one variable at a time (such as
            pension 5% to 8%), you can see the real cash impact of each decision.
          </p>

          <h2>England/Wales/NI vs Scotland comparison</h2>
          <p>
            Regional differences can materially affect net salary at middle and higher income bands. Scotland uses
            additional tax band granularity and different rates, so identical gross salaries can produce different net
            monthly outcomes. This is one reason state-like regional pages and localized calculators outperform generic
            salary tools for user intent and search relevance.
          </p>

          <h2>Using the tool for offer comparison</h2>
          <ul>
            <li>Run base salary scenarios side by side before accepting an offer.</li>
            <li>Model pension changes to see tax-efficiency tradeoffs.</li>
            <li>Account for student loan deductions so monthly budgeting is realistic.</li>
            <li>Use net monthly, not gross annual, for rent and fixed-expense decisions.</li>
            <li>Re-test when your tax code or benefits package changes.</li>
          </ul>

          <h2>Assumptions and interpretation notes</h2>
          <p>
            This is a planning calculator. Real payroll can differ because of tax-code changes, cumulative payroll
            calculations, one-off payments, company salary sacrifice schemes, and benefit-in-kind treatment. The tool
            still provides strong decision support because it makes the deduction stack visible and comparable.
          </p>

          <h2>Sources and references</h2>
          <ul>
            <li>HM Revenue &amp; Customs (HMRC) PAYE and Income Tax guidance.</li>
            <li>UK Government guidance on Income Tax rates and thresholds.</li>
            <li>HMRC National Insurance contribution rates and thresholds.</li>
            <li>Student Loans Company repayment thresholds and plan definitions.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calculator, title: "2026/27 Planning", sub: "Scenario-focused estimate" },
            { icon: Landmark, title: "Region Aware", sub: "Scotland vs UK-wide bands" },
            { icon: PoundSterling, title: "Deduction Stack", sub: "Tax + NI + loan + pension" },
            { icon: Wallet, title: "Budget Ready", sub: "Annual, monthly, weekly net" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Salary Inputs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Salary Mode"
              id="salary-mode"
              value={salaryMode}
              onChange={(event) => setSalaryMode(event.target.value as SalaryMode)}
              options={[
                { value: "annual", label: "Annual Salary" },
                { value: "hourly", label: "Hourly Rate" },
              ]}
            />
            {salaryMode === "annual" ? (
              <Input
                label="Annual Gross Salary"
                type="number"
                min={0}
                value={annualSalary}
                onChange={(event) => setAnnualSalary(Number(event.target.value))}
                suffix="£"
              />
            ) : (
              <>
                <Input
                  label="Hourly Rate"
                  type="number"
                  min={0}
                  step={0.01}
                  value={hourlyRate}
                  onChange={(event) => setHourlyRate(Number(event.target.value))}
                  suffix="£"
                />
                <Input
                  label="Hours per Week"
                  type="number"
                  min={0}
                  step={0.25}
                  value={hoursPerWeek}
                  onChange={(event) => setHoursPerWeek(Number(event.target.value))}
                />
              </>
            )}
            <Select
              label="Region"
              id="region"
              value={region}
              onChange={(event) => setRegion(event.target.value as Region)}
              options={[
                { value: "england-wales-ni", label: "England / Wales / Northern Ireland" },
                { value: "scotland", label: "Scotland" },
              ]}
            />
            <Input
              label="Pension Contribution (%)"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={pensionPercent}
              onChange={(event) => setPensionPercent(Number(event.target.value))}
            />
            <Input
              label="Personal Allowance (Annual)"
              type="number"
              min={0}
              value={personalAllowance}
              onChange={(event) => setPersonalAllowance(Number(event.target.value))}
              suffix="£"
            />
            <Select
              label="Student Loan Plan"
              id="student-loan"
              value={studentLoanPlan}
              onChange={(event) => setStudentLoanPlan(event.target.value as StudentLoanPlan)}
              options={Object.entries(studentLoanThresholds).map(([value, plan]) => ({
                value,
                label: plan.label,
              }))}
            />
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard label="Net Annual Salary" value={formatGBP(result.netAnnual)} highlight />
          <ResultCard label="Net Monthly Pay" value={formatGBP(result.netMonthly)} />
          <ResultCard label="Net Weekly Pay" value={formatGBP(result.netWeekly)} />
          <ResultCard label="Net Hourly (Effective)" value={formatGBP(result.netHourly)} />
        </ResultsGrid>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-base font-semibold text-foreground">Deduction Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Gross Annual Salary</span>
              <span className="font-semibold text-foreground">{formatGBP(result.grossAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Pension Contribution</span>
              <span className="font-semibold text-foreground">{formatGBP(result.pensionAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Income Tax</span>
              <span className="font-semibold text-foreground">{formatGBP(result.incomeTaxAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">National Insurance</span>
              <span className="font-semibold text-foreground">{formatGBP(result.niAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">{result.loanLabel} Repayment</span>
              <span className="font-semibold text-foreground">{formatGBP(result.studentLoanAnnual)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Adjusted Taxable Income</span>
              <span className="font-semibold text-foreground">{formatGBP(result.taxableIncome)}</span>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
            Effective deduction rate:{" "}
            <span className="font-semibold text-foreground">{result.effectiveDeductionRate.toFixed(2)}%</span> | Personal
            allowance used: <span className="font-semibold text-foreground">{formatGBP(result.taperedAllowance)}</span>
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
