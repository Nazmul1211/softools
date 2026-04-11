"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  TrendingDown,
  DollarSign,
  Calendar,
  Percent,
  BarChart3,
  ArrowDownRight,
  Target,
  Wallet,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "What is present value (PV)?",
    answer:
      "Present value is the current worth of a future sum of money given a specified rate of return. It answers the question: 'How much is future money worth today?' The concept is based on the time value of money principle — a dollar today is worth more than a dollar tomorrow because today's dollar can earn interest. PV is used extensively in bond pricing, project evaluation, retirement planning, and any scenario involving comparing cash flows at different points in time. The formula is PV = FV / (1 + r/n)^(n×t).",
  },
  {
    question: "What is a discount rate and how do I choose one?",
    answer:
      "The discount rate is the interest rate used to convert future money into today's dollars. It represents the opportunity cost of capital — the return you could earn by investing that money elsewhere. For personal finance, use the expected return on your best alternative investment (e.g., 7% for stock market). For corporate finance, use the weighted average cost of capital (WACC). For government projects, risk-free treasury rates (2-5%) are standard. Higher discount rates make future money worth less today.",
  },
  {
    question: "What is the difference between present value and net present value (NPV)?",
    answer:
      "Present value discounts a single future amount or series of cash flows to today's dollars. Net present value (NPV) goes one step further: it subtracts the initial investment cost from the present value of expected future cash flows. If NPV is positive, the investment is expected to generate more value than it costs. If NPV is negative, the investment destroys value. NPV is the gold standard for investment decision-making in corporate finance.",
  },
  {
    question: "How does inflation relate to present value?",
    answer:
      "Inflation and discounting work similarly — both reduce the value of future money. If you use a nominal discount rate (e.g., 8%), it implicitly accounts for expected inflation. To explicitly account for inflation, you can either: (1) use a real discount rate (nominal minus inflation) to discount real (inflation-adjusted) cash flows, or (2) use a nominal discount rate to discount nominal cash flows. Both methods produce the same present value when done correctly.",
  },
  {
    question: "What is the present value of an annuity?",
    answer:
      "The present value of an annuity is the total value today of a series of equal future payments. For example, winning $50,000 per year for 20 years is not worth $1,000,000 today — at a 5% discount rate, it's worth approximately $623,111 because each future payment is worth progressively less. Lottery companies, pension funds, and insurance companies use this calculation daily. The formula is PV = PMT × [(1 - (1 + r)^-n) / r].",
  },
  {
    question: "Why is present value important for financial decisions?",
    answer:
      "Present value enables apples-to-apples comparison of cash flows at different times. Without it, comparing '$10,000 today' vs. '$15,000 in 5 years' is meaningless. PV converts both to today's dollars: at 8% discount rate, the $15,000 in 5 years is worth $10,209 today — slightly better than $10,000 today. Every rational financial decision — from buying bonds to evaluating business acquisitions — requires present value analysis.",
  },
];

// ─── Helper Functions ──────────────────────────────
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Constants ─────────────────────────────────────
const COMPOUNDING_OPTIONS = [
  { value: 1, label: "Annually" },
  { value: 2, label: "Semi-Annually" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
  { value: 365, label: "Daily" },
];

// ─── Component ─────────────────────────────────────
export default function PresentValueCalculator() {
  const [futureValue, setFutureValue] = useState(50000);
  const [discountRate, setDiscountRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12);
  const [periodicPayment, setPeriodicPayment] = useState(0);

  const result = useMemo(() => {
    if (futureValue <= 0 || discountRate < 0 || years <= 0) return null;

    const periodicRate = discountRate / 100 / compoundingFrequency;
    const totalPeriods = compoundingFrequency * years;

    // PV of lump sum: PV = FV / (1 + r)^n
    const pvLumpSum = futureValue / Math.pow(1 + periodicRate, totalPeriods);

    // PV of annuity (if periodic payment exists)
    let pvAnnuity = 0;
    if (periodicPayment > 0 && periodicRate > 0) {
      pvAnnuity =
        periodicPayment *
        ((1 - Math.pow(1 + periodicRate, -totalPeriods)) / periodicRate);
    } else if (periodicPayment > 0 && periodicRate === 0) {
      pvAnnuity = periodicPayment * totalPeriods;
    }

    const totalPresentValue = pvLumpSum + pvAnnuity;
    const totalDiscount = futureValue + periodicPayment * totalPeriods - totalPresentValue;

    // Year-by-year discount breakdown
    const yearByYear = [];
    for (let year = 1; year <= years; year++) {
      const periods = compoundingFrequency * year;
      const pvAtYear = futureValue / Math.pow(1 + periodicRate, periods);
      const discountAtYear = futureValue - pvAtYear;

      yearByYear.push({
        year,
        presentValue: Math.round(pvAtYear * 100) / 100,
        discountAmount: Math.round(discountAtYear * 100) / 100,
        discountPercent: ((discountAtYear / futureValue) * 100),
      });
    }

    return {
      presentValue: Math.round(totalPresentValue * 100) / 100,
      pvLumpSum: Math.round(pvLumpSum * 100) / 100,
      pvAnnuity: Math.round(pvAnnuity * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      discountPercent: ((futureValue - pvLumpSum) / futureValue) * 100,
      yearByYear,
    };
  }, [futureValue, discountRate, years, compoundingFrequency, periodicPayment]);

  return (
    <ToolLayout
      title="Present Value Calculator"
      description="Calculate the present value of future money using a discount rate. Determine how much a future sum is worth in today's dollars. Supports lump sum and annuity calculations."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter Future Value", text: "Input the future amount you want to discount to today's value." },
        { name: "Set Discount Rate", text: "Enter the annual interest or discount rate as a percentage." },
        { name: "Choose Time Period", text: "Specify how many years in the future the money will be received." },
        { name: "View Present Value", text: "See today's equivalent value with a year-by-year discount breakdown." },
      ]}
      relatedTools={[
        { name: "Future Value Calculator", href: "/future-value-calculator/" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Investment Calculator", href: "/investment-calculator/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
        { name: "Retirement Calculator", href: "/retirement-calculator/" },
      ]}
      content={
        <>
          <h2>What Is Present Value?</h2>
          <p>
            Present value (PV) is the current worth of a future sum of money or stream of cash flows given a specified rate of return, known as the discount rate. It is the inverse of future value — instead of asking "how much will my money grow?", present value asks "how much is future money worth <em>right now</em>?" This concept is the foundation of discounted cash flow (DCF) analysis, which is the primary method used by Wall Street analysts, corporate CFOs, and individual investors to value assets and make financial decisions.
          </p>
          <p>
            Understanding present value is essential because money has a time value: a dollar received today can be invested and earn returns, making it more valuable than a dollar received in the future. Our free present value calculator instantly discounts future amounts to today's dollars, helping you make better financial comparisons and investment decisions.
          </p>

          <h2>How Is Present Value Calculated?</h2>
          <p>
            The present value formula for a single lump sum is:
          </p>
          <p>
            <strong>PV = FV / (1 + r/n)<sup>n×t</sup></strong>
          </p>
          <p>
            Where <strong>FV</strong> is the future value, <strong>r</strong> is the annual discount rate (as a decimal), <strong>n</strong> is the compounding frequency per year, and <strong>t</strong> is the number of years.
          </p>

          <h3>Worked Example — Lump Sum</h3>
          <p>
            How much is $50,000 received 10 years from now worth today at a 7% discount rate with monthly compounding?
          </p>
          <p>
            PV = $50,000 / (1 + 0.07/12)<sup>12×10</sup> = $50,000 / (1.005833)<sup>120</sup> = $50,000 / 2.0097 = <strong>$24,879</strong>
          </p>
          <p>
            At a 7% discount rate, $50,000 in 10 years is only worth $24,879 today. You would need to invest $24,879 today at 7% annual return to have $50,000 in 10 years.
          </p>

          <h3>Present Value of an Annuity</h3>
          <p>
            If you expect to receive regular payments (like pension income, lottery winnings, or bond coupons), the present value of an annuity formula is:
          </p>
          <p>
            <strong>PV = PMT × [(1 − (1 + r)<sup>−n</sup>) / r]</strong>
          </p>
          <p>
            For example, receiving $1,000 per month for 20 years at a 5% annual discount rate has a present value of approximately $151,525 — significantly less than the $240,000 in nominal cash flows.
          </p>

          <h2>Understanding Your Results</h2>
          <p>
            The results show three critical metrics: the <strong>present value</strong> (what the future money is worth today), the <strong>total discount</strong> (the difference between future and present value), and the <strong>discount percentage</strong> (how much value is lost to the time value of money). The year-by-year table shows how the present value of your future sum decreases as the time horizon extends — demonstrating why more distant cash flows are worth progressively less.
          </p>

          <h2>Applications of Present Value Analysis</h2>
          <ul>
            <li><strong>Bond valuation:</strong> Bond prices are calculated as the present value of all future coupon payments plus the face value at maturity.</li>
            <li><strong>Lottery comparison:</strong> Comparing a lump sum payout vs. annual installments requires converting installments to present value.</li>
            <li><strong>Business valuation:</strong> Companies are valued using DCF analysis — the present value of projected free cash flows.</li>
            <li><strong>Lease vs. buy decisions:</strong> Comparing the present value of lease payments against the purchase price.</li>
            <li><strong>Legal settlements:</strong> Courts use present value to determine fair lump-sum equivalents for structured settlements.</li>
            <li><strong>Pension planning:</strong> Valuing the present worth of future pension income streams.</li>
          </ul>

          <h2>Choosing the Right Discount Rate</h2>
          <table>
            <thead>
              <tr><th>Context</th><th>Typical Discount Rate</th><th>Rationale</th></tr>
            </thead>
            <tbody>
              <tr><td>Risk-free (Treasury)</td><td>2–5%</td><td>U.S. government bonds, virtually no default risk</td></tr>
              <tr><td>Conservative investing</td><td>5–6%</td><td>Balanced portfolio (60/40 stocks/bonds)</td></tr>
              <tr><td>Equity markets</td><td>7–10%</td><td>Historical S&P 500 long-term average</td></tr>
              <tr><td>Corporate WACC</td><td>8–12%</td><td>Blended cost of debt and equity</td></tr>
              <tr><td>Venture capital</td><td>20–40%</td><td>High-risk startup investments</td></tr>
            </tbody>
          </table>

          <p>
            <strong>Financial disclaimer:</strong> This calculator provides estimates for educational purposes only. Actual investment returns and discount rates vary. Consult a qualified financial advisor before making investment decisions.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>Brealey, R.A., Myers, S.C., & Allen, F. (2020). Principles of Corporate Finance, 13th edition. McGraw-Hill Education.</li>
            <li>Damodaran, A. (2024). Investment Valuation, 3rd edition. John Wiley & Sons.</li>
            <li>CFA Institute. (2022). CFA Program Curriculum, Level I — Quantitative Methods: The Time Value of Money. Wiley.</li>
            <li>Federal Reserve Bank of St. Louis. Treasury Constant Maturity Rates. FRED Economic Data. fred.stlouisfed.org.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-blue-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <TrendingDown className="h-5 w-5 text-primary" />
            Discount Parameters
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Future Value ($)
              </label>
              <input
                type="number"
                min={1}
                value={futureValue}
                onChange={(e) => setFutureValue(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Periodic Payment ($)
              </label>
              <input
                type="number"
                min={0}
                value={periodicPayment}
                onChange={(e) => setPeriodicPayment(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                placeholder="0 (none)"
              />
              <p className="mt-0.5 text-xs text-muted-foreground">Optional regular payment (annuity)</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Annual Discount Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Time Period (Years)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Compounding Frequency
              </label>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                {COMPOUNDING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* Main Result */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Present Value</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {formatCurrency(result.presentValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {result.pvAnnuity > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">PV of Lump Sum</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(result.pvLumpSum)}
                  </p>
                </div>
              )}
              {result.pvAnnuity > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-sm text-muted-foreground">PV of Payments</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(result.pvAnnuity)}
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Discount</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  −{formatCurrency(result.totalDiscount)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Discount Percentage</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {result.discountPercent.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Interpretation */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                {formatCurrency(futureValue)} received {years} year{years !== 1 ? "s" : ""} from now at a{" "}
                {discountRate}% discount rate is worth{" "}
                <strong className="text-foreground">{formatCurrency(result.pvLumpSum)}</strong> in today&apos;s dollars.
                The time value of money accounts for a{" "}
                <strong className="text-red-600 dark:text-red-400">
                  {formatCurrency(futureValue - result.pvLumpSum)}
                </strong>{" "}
                discount ({result.discountPercent.toFixed(1)}%).
              </p>
            </div>

            {/* Year-by-Year Table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Year-by-Year Present Value of {formatCurrency(futureValue)}
              </h3>
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Years Away</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Present Value</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Discount</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">% Discounted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((row) => (
                      <tr key={row.year} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{row.year}</td>
                        <td className="py-2 pr-4 text-right font-medium text-foreground">
                          {formatCurrency(row.presentValue)}
                        </td>
                        <td className="py-2 pr-4 text-right text-red-600 dark:text-red-400">
                          −{formatCurrency(row.discountAmount)}
                        </td>
                        <td className="py-2 text-right text-muted-foreground">
                          {row.discountPercent.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
