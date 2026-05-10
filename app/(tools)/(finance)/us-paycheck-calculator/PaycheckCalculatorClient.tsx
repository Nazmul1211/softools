"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import {
  getUsStateByCode,
  usPaycheckStates,
  type UsPaycheckStateProfile,
} from "@/lib/us-paycheck-data";
import { Calculator, Landmark, ShieldCheck, Wallet } from "lucide-react";

type FilingStatus = "single" | "married";
type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
type IncomeMode = "salary" | "hourly";

const periodsPerYear: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

const federalBrackets: Record<FilingStatus, { cap: number; rate: number }[]> = {
  single: [
    { cap: 11_600, rate: 0.1 },
    { cap: 47_150, rate: 0.12 },
    { cap: 100_525, rate: 0.22 },
    { cap: 191_950, rate: 0.24 },
    { cap: 243_725, rate: 0.32 },
    { cap: 609_350, rate: 0.35 },
    { cap: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
  married: [
    { cap: 23_200, rate: 0.1 },
    { cap: 94_300, rate: 0.12 },
    { cap: 201_050, rate: 0.22 },
    { cap: 383_900, rate: 0.24 },
    { cap: 487_450, rate: 0.32 },
    { cap: 731_200, rate: 0.35 },
    { cap: Number.POSITIVE_INFINITY, rate: 0.37 },
  ],
};

const standardDeduction: Record<FilingStatus, number> = {
  single: 14_600,
  married: 29_200,
};

const socialSecurityWageBase = 176_100;
const additionalMedicareThreshold: Record<FilingStatus, number> = {
  single: 200_000,
  married: 250_000,
};

const faqs: FAQItem[] = [
  {
    question: "Is this US paycheck calculator exact for payroll processing?",
    answer:
      "No calculator can replace your employer payroll engine, state tax tables, and your W-4 elections line by line. This tool is built for planning and comparison, not legal filing. It models federal tax brackets, FICA, and a state-level withholding estimate so you can test scenarios quickly before you make compensation or budget decisions.",
  },
  {
    question: "Why does my paystub differ from this estimate?",
    answer:
      "Real paychecks include many details beyond base tax bands, including local taxes, pre-tax benefits timing, filing options, extra withholding elections, fringe benefits, and payroll rounding rules. Employers may also run supplemental wage logic for bonuses. Use this result as a practical forecast, then reconcile with your latest paystub for final planning.",
  },
  {
    question: "Does this include federal and state tax together?",
    answer:
      "Yes. The estimate combines federal income tax, Social Security, Medicare, and state income tax assumptions. States with no wage income tax return a zero state line item. You can still add additional withholding or deductions per paycheck to model the exact take-home figure you want to budget around.",
  },
  {
    question: "How should I use pre-tax deductions in this tool?",
    answer:
      "Use pre-tax deductions for items that reduce taxable wages before withholding, such as many 401(k), HSA, and eligible insurance contributions. Enter your expected annual amount so the taxable income estimate reflects your planned benefits strategy. If your deduction is post-tax, place it in the post-tax deductions field instead.",
  },
  {
    question: "Can I use this for hourly and overtime jobs?",
    answer:
      "You can switch to hourly mode and estimate annualized gross pay from your hourly rate and weekly hours. For variable overtime schedules, run multiple scenarios by adjusting hours up and down. If overtime changes each period, keep a conservative baseline and a peak-season scenario so your cash flow plan remains resilient.",
  },
  {
    question: "Do state pages use different logic?",
    answer:
      "The math engine is the same, but each state page preselects that state and applies its state-level estimate so you can land directly on a localized version of the tool. This is useful for relocation planning, job offer comparisons, and payroll benchmarking across high-tax and no-income-tax states.",
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

function calculateProgressiveTax(income: number, brackets: { cap: number; rate: number }[]): number {
  let remaining = Math.max(0, income);
  let previousCap = 0;
  let total = 0;

  for (const bracket of brackets) {
    const taxableInBracket = Math.min(remaining, bracket.cap - previousCap);
    if (taxableInBracket <= 0) break;
    total += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    previousCap = bracket.cap;
  }

  return total;
}

interface PaycheckCalculatorClientProps {
  defaultStateCode?: string;
  stateLanding?: UsPaycheckStateProfile;
}

export default function PaycheckCalculatorClient({
  defaultStateCode = "CA",
  stateLanding,
}: PaycheckCalculatorClientProps) {
  const [incomeMode, setIncomeMode] = useState<IncomeMode>("salary");
  const [annualSalary, setAnnualSalary] = useState(95_000);
  const [hourlyRate, setHourlyRate] = useState(42);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("biweekly");
  const [stateCode, setStateCode] = useState(defaultStateCode);
  const [preTaxAnnual, setPreTaxAnnual] = useState(8_000);
  const [postTaxPerPaycheck, setPostTaxPerPaycheck] = useState(0);
  const [additionalWithholdingPerPaycheck, setAdditionalWithholdingPerPaycheck] = useState(0);

  const calculation = useMemo(() => {
    const periods = periodsPerYear[payFrequency];
    const grossAnnual =
      incomeMode === "salary" ? Math.max(0, annualSalary) : Math.max(0, hourlyRate * hoursPerWeek * 52);

    const stateProfile = getUsStateByCode(stateCode) ?? usPaycheckStates[0];
    const federalTaxableIncome = Math.max(0, grossAnnual - preTaxAnnual - standardDeduction[filingStatus]);
    const federalAnnual = calculateProgressiveTax(federalTaxableIncome, federalBrackets[filingStatus]);

    const socialSecurityAnnual = Math.min(grossAnnual, socialSecurityWageBase) * 0.062;
    const medicareBaseAnnual = grossAnnual * 0.0145;
    const additionalMedicareAnnual =
      Math.max(0, grossAnnual - additionalMedicareThreshold[filingStatus]) * 0.009;
    const medicareAnnual = medicareBaseAnnual + additionalMedicareAnnual;

    const stateTaxableIncome = Math.max(0, grossAnnual - preTaxAnnual);
    const stateAnnual = stateProfile.noIncomeTax
      ? 0
      : stateTaxableIncome * (stateProfile.estimatedRate / 100);

    const additionalAnnual = additionalWithholdingPerPaycheck * periods;
    const postTaxAnnual = postTaxPerPaycheck * periods;
    const totalAnnualTax = federalAnnual + socialSecurityAnnual + medicareAnnual + stateAnnual + additionalAnnual;
    const netAnnual = Math.max(0, grossAnnual - preTaxAnnual - totalAnnualTax - postTaxAnnual);

    return {
      stateProfile,
      periods,
      grossAnnual,
      preTaxAnnual,
      postTaxAnnual,
      netAnnual,
      grossPerPaycheck: grossAnnual / periods,
      netPerPaycheck: netAnnual / periods,
      federalAnnual,
      socialSecurityAnnual,
      medicareAnnual,
      stateAnnual,
      additionalAnnual,
      totalAnnualTax,
      effectiveTaxRate: grossAnnual > 0 ? (totalAnnualTax / grossAnnual) * 100 : 0,
    };
  }, [
    payFrequency,
    incomeMode,
    annualSalary,
    hourlyRate,
    hoursPerWeek,
    stateCode,
    filingStatus,
    preTaxAnnual,
    postTaxPerPaycheck,
    additionalWithholdingPerPaycheck,
  ]);

  const topStateLinks = useMemo(
    () =>
      ["california", "texas", "florida", "new-york", "illinois", "washington", "georgia", "pennsylvania"]
        .map((slug) => usPaycheckStates.find((state) => state.slug === slug))
        .filter((state): state is UsPaycheckStateProfile => Boolean(state)),
    []
  );

  const pageTitle = stateLanding
    ? `${stateLanding.name} Paycheck Calculator (US)`
    : "US Paycheck Calculator";
  const pageDescription = stateLanding
    ? `Estimate net pay in ${stateLanding.name} with federal, FICA, and state withholding assumptions. Compare salary and hourly scenarios in minutes.`
    : "Estimate US take-home pay using federal brackets, FICA, and state tax assumptions. Compare salary vs hourly scenarios and optimize your paycheck planning.";
  const pageSlug = stateLanding
    ? `us-paycheck-calculator/${stateLanding.slug}`
    : "us-paycheck-calculator";

  return (
    <ToolLayout
      title={pageTitle}
      slug={pageSlug}
      description={pageDescription}
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Payroll Calculator", href: "/payroll-calculator/" },
        { name: "Salary Calculator", href: "/salary-calculator/" },
        { name: "Tax Calculator", href: "/tax-calculator/" },
        { name: "401k Calculator", href: "/401k-calculator/" },
      ]}
      howToSteps={[
        { name: "Choose income mode", text: "Use salary or hourly mode based on how you are paid." },
        { name: "Set filing and frequency", text: "Pick filing status and your paycheck schedule." },
        { name: "Apply deductions", text: "Add pre-tax and post-tax amounts for a realistic estimate." },
        { name: "Review net pay", text: "Use annual and per-paycheck outputs for planning and comparison." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>What this US paycheck calculator does</h2>
          <p>
            This paycheck calculator estimates your gross-to-net pay in the United States using three core layers:
            federal income tax brackets, FICA payroll taxes (Social Security and Medicare), and a state-level income
            tax estimate. You can model salary or hourly compensation, compare filing statuses, and test how pre-tax
            contributions affect your net pay. The result is a practical planning number for budgeting, offer
            comparisons, and relocation decisions.
          </p>

          <h2>How the calculation works</h2>
          <p>
            The process starts with annual gross income. If you select hourly mode, annual gross is computed as hourly
            rate × weekly hours × 52. Next, pre-tax deductions are subtracted, and federal taxable income is reduced by
            a standard-deduction assumption based on filing status. Federal tax is then calculated progressively across
            bracket tiers rather than with a single flat rate.
          </p>
          <p>
            FICA is calculated separately. Social Security applies up to the annual wage base, while Medicare applies
            across all wages with an additional Medicare rate above threshold income. State tax is estimated from a
            state profile, then all tax and deduction lines are applied to produce annual and per-paycheck net pay.
          </p>

          <h2>Worked example</h2>
          <p>
            Suppose a single filer in California earns $95,000 salary, contributes $8,000 pre-tax annually, and is paid
            biweekly. The model computes adjusted taxable income, applies federal bracket slices, calculates Social
            Security and Medicare, then applies a state estimate. The final output shows expected net per paycheck and
            annual take-home so you can align rent, debt payments, and savings targets with realistic cash flow.
          </p>

          <h2>How to interpret results</h2>
          <p>
            Use the net paycheck result for day-to-day budgeting and the annual net result for strategic planning. If
            your current paystub is consistently higher or lower, adjust additional withholding and deduction inputs
            until the estimate tracks your real pattern. This makes the tool useful both for new-job forecasting and
            ongoing monthly cash-flow management.
          </p>

          {stateLanding && (
            <>
              <h2>{stateLanding.name}-specific context</h2>
              <p>
                This state page preloads {stateLanding.name} so you can evaluate local withholding impact faster. The
                state line uses an estimated effective withholding rate for scenario planning and should be reconciled
                against your official state withholding tables or payroll provider output before filing decisions.
              </p>
            </>
          )}

          <h2>Why state pages matter for SEO and users</h2>
          <p>
            People search for paycheck tools with location intent, such as &quot;Texas paycheck calculator&quot; or
            &quot;California take-home pay calculator.&quot; State landing URLs make that intent explicit and provide
            a direct entry point for users comparing jobs across markets. This improves relevance for search and
            reduces friction for users who need a state-focused answer quickly.
          </p>

          <h2>Best practices when comparing job offers</h2>
          <ul>
            <li>Compare net pay, not just gross salary.</li>
            <li>Model pre-tax benefits because they can materially shift take-home pay.</li>
            <li>Run a low, base, and high overtime scenario for variable-hour roles.</li>
            <li>Adjust withholding assumptions after your first real paystub arrives.</li>
            <li>Pair net pay with cost-of-living data before deciding on relocation.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>IRS Publication 15-T (Federal Income Tax Withholding Methods).</li>
            <li>IRS Topic No. 751 (Social Security and Medicare withholding rates and wage base).</li>
            <li>U.S. Department of Labor payroll compliance guidance.</li>
            <li>State revenue department withholding publications and tax booklets.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Calculator, title: "Scenario Modeling", sub: "Salary + hourly modes" },
            { icon: Landmark, title: "State-Aware", sub: "Localized withholding estimate" },
            { icon: ShieldCheck, title: "Private", sub: "Runs in your browser" },
            { icon: Wallet, title: "Budget-Ready", sub: "Per-check + annual net" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Paycheck Inputs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Income Mode"
              id="income-mode"
              value={incomeMode}
              onChange={(event) => setIncomeMode(event.target.value as IncomeMode)}
              options={[
                { value: "salary", label: "Annual Salary" },
                { value: "hourly", label: "Hourly Rate" },
              ]}
            />
            {incomeMode === "salary" ? (
              <Input
                label="Annual Salary"
                type="number"
                min={0}
                value={annualSalary}
                onChange={(event) => setAnnualSalary(Number(event.target.value))}
                suffix="$"
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
                  suffix="$"
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
              label="Filing Status"
              id="filing-status"
              value={filingStatus}
              onChange={(event) => setFilingStatus(event.target.value as FilingStatus)}
              options={[
                { value: "single", label: "Single" },
                { value: "married", label: "Married Filing Jointly" },
              ]}
            />
            <Select
              label="Pay Frequency"
              id="pay-frequency"
              value={payFrequency}
              onChange={(event) => setPayFrequency(event.target.value as PayFrequency)}
              options={[
                { value: "weekly", label: "Weekly (52)" },
                { value: "biweekly", label: "Biweekly (26)" },
                { value: "semimonthly", label: "Semi-monthly (24)" },
                { value: "monthly", label: "Monthly (12)" },
              ]}
            />
            <Select
              label="State"
              id="state"
              value={stateCode}
              onChange={(event) => setStateCode(event.target.value)}
              options={usPaycheckStates.map((state) => ({
                value: state.code,
                label: `${state.name} (${state.code})`,
              }))}
            />
            <Input
              label="Pre-tax Deductions (Annual)"
              type="number"
              min={0}
              value={preTaxAnnual}
              onChange={(event) => setPreTaxAnnual(Number(event.target.value))}
              suffix="$"
            />
            <Input
              label="Post-tax Deductions (Per Paycheck)"
              type="number"
              min={0}
              value={postTaxPerPaycheck}
              onChange={(event) => setPostTaxPerPaycheck(Number(event.target.value))}
              suffix="$"
            />
            <Input
              label="Extra Withholding (Per Paycheck)"
              type="number"
              min={0}
              value={additionalWithholdingPerPaycheck}
              onChange={(event) => setAdditionalWithholdingPerPaycheck(Number(event.target.value))}
              suffix="$"
            />
          </div>
        </div>

        <ResultsGrid columns={2}>
          <ResultCard label="Net Pay Per Paycheck" value={formatCurrency(calculation.netPerPaycheck)} highlight />
          <ResultCard label="Annual Net Pay" value={formatCurrency(calculation.netAnnual)} />
          <ResultCard label="Gross Pay Per Paycheck" value={formatCurrency(calculation.grossPerPaycheck)} />
          <ResultCard label="Estimated Total Annual Tax" value={formatCurrency(calculation.totalAnnualTax)} />
        </ResultsGrid>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-base font-semibold text-foreground">Tax Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Federal Income Tax</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculation.federalAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Social Security</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(calculation.socialSecurityAnnual)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Medicare</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculation.medicareAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">
                {calculation.stateProfile.name} Income Tax
                {calculation.stateProfile.noIncomeTax && " (No wage income tax)"}
              </span>
              <span className="font-semibold text-foreground">{formatCurrency(calculation.stateAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Additional Withholding</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculation.additionalAnnual)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Pre-tax Deductions</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculation.preTaxAnnual)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Post-tax Deductions</span>
              <span className="font-semibold text-foreground">{formatCurrency(calculation.postTaxAnnual)}</span>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
            Effective tax rate (before post-tax deductions):{" "}
            <span className="font-semibold text-foreground">{calculation.effectiveTaxRate.toFixed(2)}%</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          These figures are estimates for planning and comparison. For filing, payroll compliance, or withholding
          elections, use official IRS/state tables and your payroll provider.
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-base font-semibold text-foreground">Popular State Pages</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {topStateLinks.map((state) => (
              <a
                key={state.code}
                href={`/us-paycheck-calculator/${state.slug}/`}
                className="rounded-lg border border-border px-3 py-2 text-sm text-primary hover:bg-primary/5"
              >
                {state.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
