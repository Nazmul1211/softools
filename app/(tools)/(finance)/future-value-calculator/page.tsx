"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  BarChart3,
  ArrowUpRight,
  PiggyBank,
  Wallet,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "What is future value (FV)?",
    answer:
      "Future value is the projected worth of an investment at a specific point in the future, assuming a given rate of return. It accounts for compound interest — meaning you earn returns not just on your original principal but also on previously earned interest. FV is one of the most fundamental concepts in corporate finance, personal investing, and financial planning. The formula is FV = PV × (1 + r/n)^(n×t), where PV is present value, r is the annual interest rate, n is compounding frequency, and t is years.",
  },
  {
    question: "What is the difference between future value and present value?",
    answer:
      "Future value answers 'How much will my money be worth later?' while present value answers 'How much is future money worth today?' They are inverse calculations. If $1,000 today grows to $1,628 in 10 years at 5%, then $1,000 is the present value and $1,628 is the future value. Financial professionals use both calculations daily — FV for planning savings goals and retirement targets, and PV for evaluating incoming cash flows like bond payments or business acquisitions.",
  },
  {
    question: "How does compounding frequency affect future value?",
    answer:
      "More frequent compounding produces a higher future value because interest is calculated and added to the principal more often, creating a faster snowball effect. For example, $10,000 at 8% annual interest for 10 years yields: $21,589 with annual compounding, $21,911 with quarterly, $22,036 with monthly, and $22,134 with daily. The difference between annual and daily compounding over 10 years is $545 — meaningful but not dramatic. Time in the market and contribution consistency matter far more.",
  },
  {
    question: "What is the future value of an annuity?",
    answer:
      "The future value of an annuity calculates how much a series of regular, equal payments will be worth at a future date. If you invest $500 per month at 7% annual return for 30 years, the future value of that annuity is approximately $566,765. The formula is FV = PMT × [((1 + r)^n - 1) / r], where PMT is the periodic payment, r is the interest rate per period, and n is the total number of periods. Our calculator includes regular contributions to compute this automatically.",
  },
  {
    question: "What rate of return should I use in my calculation?",
    answer:
      "Use a rate that matches your investment type. Historical averages: S&P 500 stock index returns ~10% annually (7% after inflation), investment-grade bonds return ~4-5%, savings accounts return ~0.5-5% depending on economic conditions, and real estate averages ~8-12% including appreciation and rental income. For conservative planning, use the after-inflation (real) return. For comparing to nominal benchmarks, use the nominal rate. Always account for fees, which reduce effective returns.",
  },
  {
    question: "How does inflation affect future value?",
    answer:
      "Inflation erodes the purchasing power of future money. If your investment grows to $100,000 in 20 years, but inflation averaged 3% annually, that $100,000 will only buy what $55,368 buys today. To calculate 'real' future value (inflation-adjusted), subtract the inflation rate from your expected return rate. If you expect 8% returns and 3% inflation, use 5% as your effective rate. This gives a more realistic picture of your future purchasing power.",
  },
];

// ─── Types ─────────────────────────────────────────
interface FVResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  yearByYear: Array<{
    year: number;
    balance: number;
    yearContribution: number;
    yearInterest: number;
    totalContributions: number;
    totalInterest: number;
  }>;
}

// ─── Constants ─────────────────────────────────────
const COMPOUNDING_OPTIONS = [
  { value: 1, label: "Annually" },
  { value: 2, label: "Semi-Annually" },
  { value: 4, label: "Quarterly" },
  { value: 12, label: "Monthly" },
  { value: 365, label: "Daily" },
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

function calculateFutureValue(
  presentValue: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number,
  monthlyContribution: number
): FVResult {
  const periodicRate = annualRate / 100 / compoundingFrequency;
  const monthsPerPeriod = 12 / compoundingFrequency;

  let balance = presentValue;
  let totalContributions = presentValue;
  const yearByYear: FVResult["yearByYear"] = [];

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    let yearContribution = 0;

    for (let period = 1; period <= compoundingFrequency; period++) {
      balance = balance * (1 + periodicRate);
      const contributionsThisPeriod = monthlyContribution * monthsPerPeriod;
      balance += contributionsThisPeriod;
      yearContribution += contributionsThisPeriod;
    }

    totalContributions += yearContribution;
    const totalInterest = balance - totalContributions;
    const yearInterest = balance - startBalance - yearContribution;

    yearByYear.push({
      year,
      balance: Math.round(balance * 100) / 100,
      yearContribution: Math.round(yearContribution * 100) / 100,
      yearInterest: Math.round(yearInterest * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  }

  return {
    futureValue: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round((balance - totalContributions) * 100) / 100,
    yearByYear,
  };
}

// ─── Component ─────────────────────────────────────
export default function FutureValueCalculator() {
  const [presentValue, setPresentValue] = useState(10000);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12);
  const [monthlyContribution, setMonthlyContribution] = useState(200);

  const result = useMemo(() => {
    if (presentValue < 0 || annualRate < 0 || years <= 0) return null;
    return calculateFutureValue(
      presentValue,
      annualRate,
      years,
      compoundingFrequency,
      monthlyContribution
    );
  }, [presentValue, annualRate, years, compoundingFrequency, monthlyContribution]);

  return (
    <ToolLayout
      title="Future Value Calculator"
      description="Calculate the future value of your investments with compound interest. Enter your starting amount, interest rate, time period, and optional monthly contributions to see how your money grows."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter Present Value", text: "Input your current investment or starting balance." },
        { name: "Set Interest Rate", text: "Enter your expected annual rate of return as a percentage." },
        { name: "Choose Time Period", text: "Specify the number of years you plan to invest." },
        { name: "View Future Value", text: "See your projected investment growth with a year-by-year breakdown." },
      ]}
      relatedTools={[
        { name: "Present Value Calculator", href: "/present-value-calculator/" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator/" },
        { name: "Investment Calculator", href: "/investment-calculator/" },
        { name: "Retirement Calculator", href: "/retirement-calculator/" },
        { name: "Savings Calculator", href: "/savings-calculator/" },
      ]}
      content={
        <>
          <h2>What Is Future Value?</h2>
          <p>
            Future value (FV) is the value of a current asset at a future date based on an assumed rate of growth. It is one of the most important concepts in finance — underpinning everything from personal savings goals to corporate capital budgeting decisions. The future value calculation demonstrates how the time value of money works: a dollar today is worth more than a dollar tomorrow because today's dollar can be invested and earn returns.
          </p>
          <p>
            Understanding future value helps you answer critical financial questions: How much will my retirement savings be worth in 30 years? How much do I need to invest today to reach a specific goal? What's the projected value of my child's education fund? Our free future value calculator answers all of these questions instantly with real-time, compounding-adjusted projections.
          </p>

          <h2>How Is Future Value Calculated?</h2>
          <p>
            The future value formula for a single lump sum is:
          </p>
          <p>
            <strong>FV = PV × (1 + r/n)<sup>n×t</sup></strong>
          </p>
          <p>
            Where <strong>PV</strong> is the present value (initial investment), <strong>r</strong> is the annual interest rate (as a decimal), <strong>n</strong> is the number of compounding periods per year, and <strong>t</strong> is the number of years.
          </p>

          <h3>Worked Example — Lump Sum</h3>
          <p>
            If you invest $10,000 at 7% annual interest, compounded monthly, for 10 years:
          </p>
          <p>
            FV = $10,000 × (1 + 0.07/12)<sup>12×10</sup> = $10,000 × (1.005833)<sup>120</sup> = $10,000 × 2.0097 = <strong>$20,097</strong>
          </p>
          <p>
            Your $10,000 nearly doubles in 10 years at 7% — and with monthly contributions of $200, the future value jumps to <strong>$54,754</strong> because each monthly deposit also earns compound interest.
          </p>

          <h3>Future Value with Regular Contributions (Annuity)</h3>
          <p>
            When you add regular contributions, the calculation combines the growth of your initial lump sum with the future value of an ordinary annuity:
          </p>
          <p>
            <strong>FV<sub>total</sub> = PV × (1 + r/n)<sup>n×t</sup> + PMT × [((1 + r/n)<sup>n×t</sup> - 1) / (r/n)]</strong>
          </p>
          <p>
            This is why consistent contributions are so powerful — each payment has its own compounding timeline, and earlier payments compound for longer.
          </p>

          <h2>Understanding Your Results</h2>
          <p>
            The results dashboard shows three key metrics: your projected <strong>future value</strong> (total balance at the end), <strong>total contributions</strong> (money you actually put in), and <strong>total interest earned</strong> (money generated by compound growth). The year-by-year table reveals how interest accelerates over time — in early years, most growth comes from your contributions, but in later years, compound interest generates more than your annual deposits.
          </p>

          <h2>The Power of Starting Early</h2>
          <p>
            Consider two investors: Alice invests $5,000 per year from age 25 to 35 (10 years, $50,000 total), then stops. Bob invests $5,000 per year from age 35 to 65 (30 years, $150,000 total). At 8% annual return, Alice ends up with approximately $787,176 at age 65, while Bob has only $611,729 — despite investing three times more money. Alice's 10-year head start gave her money 30 extra years to compound.
          </p>
          <p>
            This example illustrates why financial advisors universally recommend starting to invest as early as possible. Time is the single most powerful variable in the future value equation.
          </p>

          <h2>Real vs. Nominal Future Value</h2>
          <p>
            The calculator displays <strong>nominal</strong> future value — the actual dollar amount you'll have. To find <strong>real</strong> (inflation-adjusted) future value, subtract the expected inflation rate from your return rate. If you expect 8% returns and 3% inflation, use 5% to see what your money will be worth in today's purchasing power. The U.S. Federal Reserve targets 2% annual inflation, but historical averages from 1913–2024 show approximately 3.2% (Bureau of Labor Statistics).
          </p>

          <h2>Common Applications of Future Value</h2>
          <ul>
            <li><strong>Retirement planning:</strong> Projecting 401(k) or IRA growth over 20–40 years to set contribution targets.</li>
            <li><strong>Education savings:</strong> Estimating 529 plan balances needed for college tuition in 10–18 years.</li>
            <li><strong>Corporate finance:</strong> Evaluating capital expenditure projects by projecting future cash flows.</li>
            <li><strong>Real estate:</strong> Estimating property values based on historical appreciation rates.</li>
            <li><strong>Debt analysis:</strong> Understanding how much unpaid debts will grow if left unaddressed.</li>
          </ul>

          <p>
            <strong>Financial disclaimer:</strong> This calculator provides estimates for educational purposes only. Actual investment returns vary and are not guaranteed. Past performance does not predict future results. Consult a qualified financial advisor before making investment decisions.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>Brealey, R.A., Myers, S.C., & Allen, F. (2020). Principles of Corporate Finance, 13th edition. McGraw-Hill Education. Chapter 2: How to Calculate Present Values.</li>
            <li>U.S. Bureau of Labor Statistics. Consumer Price Index — Historical Data (1913–2024). bls.gov/cpi.</li>
            <li>Damodaran, A. (2024). Historical Returns on Stocks, Bonds, and Bills: 1928–2023. NYU Stern School of Business. pages.stern.nyu.edu/~adamodar.</li>
            <li>Federal Reserve Bank of St. Louis. S&P 500 Total Return Index. FRED Economic Data. fred.stlouisfed.org.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Investment Parameters
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Present Value ($)
              </label>
              <input
                type="number"
                min={0}
                value={presentValue}
                onChange={(e) => setPresentValue(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                min={0}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
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
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Future Value</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(result.futureValue)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <PiggyBank className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalContributions)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="mb-2 flex justify-center">
                  <ArrowUpRight className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">Growth Multiple</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {result.totalContributions > 0
                    ? (result.futureValue / result.totalContributions).toFixed(2)
                    : "0"}x
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Growth Composition
              </h3>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <div className="flex h-8">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(result.totalContributions / result.futureValue) * 100}%`,
                      }}
                      title={`Contributions: ${formatCurrency(result.totalContributions)}`}
                    />
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{
                        width: `${(result.totalInterest / result.futureValue) * 100}%`,
                      }}
                      title={`Interest: ${formatCurrency(result.totalInterest)}`}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-muted-foreground">
                      Contributions ({((result.totalContributions / result.futureValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                    <span className="text-muted-foreground">
                      Interest ({((result.totalInterest / result.futureValue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Year-by-Year Table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Year-by-Year Projection
              </h3>
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Year</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Balance</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Year Deposits</th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Year Interest</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((row) => (
                      <tr key={row.year} className="border-b border-border/50">
                        <td className="py-2 pr-4 text-foreground">{row.year}</td>
                        <td className="py-2 pr-4 text-right font-medium text-foreground">
                          {formatCurrency(row.balance)}
                        </td>
                        <td className="py-2 pr-4 text-right text-muted-foreground">
                          {formatCurrency(row.yearContribution)}
                        </td>
                        <td className="py-2 pr-4 text-right text-blue-600 dark:text-blue-400">
                          {formatCurrency(row.yearInterest)}
                        </td>
                        <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(row.totalInterest)}
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
