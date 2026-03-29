"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [compound, setCompound] = useState("12");
  const [monthlyAdd, setMonthlyAdd] = useState("100");

  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(compound);
    const pmt = parseFloat(monthlyAdd) || 0;

    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n) || P < 0 || t <= 0 || n <= 0) {
      setFutureValue(null);
      return;
    }

    // FV of principal with compound interest
    const fvPrincipal = P * Math.pow(1 + r / n, n * t);

    // FV of series of monthly contributions (annuity)
    let fvContributions = 0;
    if (pmt > 0 && r > 0) {
      // Adjust monthly payment to match compounding frequency
      const periodicRate = r / n;
      const totalPeriods = n * t;
      fvContributions =
        pmt * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    } else if (pmt > 0) {
      fvContributions = pmt * n * t;
    }

    const total = fvPrincipal + fvContributions;
    const contributions = P + pmt * n * t;

    setFutureValue(total);
    setTotalContributions(contributions);
    setTotalInterest(total - contributions);
  }, [principal, rate, years, compound, monthlyAdd]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <ToolLayout
      title="Compound Interest Calculator"
      description="See how your money grows over time with compound interest. Enter your initial investment, interest rate, time period, and optional monthly contributions to visualize your wealth accumulation."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Savings Goal Calculator", href: "/savings-goal-calculator" },
        { name: "Loan Calculator", href: "/loan-calculator" },
      ]}
      content={
        <>
          <h2>What is Compound Interest?</h2>
          <p>
            Compound interest is the process of earning interest on both your original principal and on the accumulated interest from previous periods. Albert Einstein reportedly called it the &quot;eighth wonder of the world,&quot; and for good reason: compound interest is the single most powerful force in personal finance. Unlike simple interest, which only calculates returns on the initial deposit, compound interest creates a snowball effect where your money grows <em>exponentially</em> over time.
          </p>

          <h2>The Compound Interest Formula</h2>
          <p>
            The standard mathematical formula for compound interest is:
          </p>
          <p>
            <strong>A = P(1 + r/n)<sup>nt</sup></strong>
          </p>
          <ul>
            <li><strong>A</strong> = Final amount (future value)</li>
            <li><strong>P</strong> = Principal (initial investment)</li>
            <li><strong>r</strong> = Annual interest rate (as a decimal)</li>
            <li><strong>n</strong> = Number of times interest is compounded per year</li>
            <li><strong>t</strong> = Number of years</li>
          </ul>
          <p>
            When regular contributions are added (like monthly deposits), the future value of that annuity stream is calculated separately and added to the future value of the principal. This calculator handles both components automatically.
          </p>

          <h2>How Compounding Frequency Affects Growth</h2>
          <p>
            The <strong>more frequently</strong> your interest is compounded, the more interest you earn. Here is how different compounding frequencies compare, assuming a $10,000 investment at 7% annual interest over 10 years with no additional contributions:
          </p>
          <ul>
            <li><strong>Annually (1x/year):</strong> $19,671.51</li>
            <li><strong>Quarterly (4x/year):</strong> $20,015.90</li>
            <li><strong>Monthly (12x/year):</strong> $20,096.61</li>
            <li><strong>Daily (365x/year):</strong> $20,137.53</li>
          </ul>
          <p>
            The difference may seem small over 10 years, but over a 30–40 year retirement savings horizon, daily compounding can yield thousands of dollars more than annual compounding.
          </p>

          <h3>The Rule of 72</h3>
          <p>
            The Rule of 72 is a quick mental math shortcut to estimate how long it takes for your money to double at a given interest rate. Simply divide 72 by your annual interest rate. For example, at 7% interest: 72 / 7 ≈ 10.3 years to double your investment. At 10%: 72 / 10 = 7.2 years. This rule works best for rates between 2% and 15%.
          </p>

          <h2>Why Monthly Contributions Matter</h2>
          <p>
            Consistently adding even small amounts to your investment dramatically accelerates growth. A $100 monthly contribution at 7% annual interest over 30 years grows to over $121,000 in contributions alone — but the compounded value exceeds $122,000 in interest earned, totaling over $243,000. The <strong>earlier you start contributing, the more time compound interest has to work</strong>, which is why financial advisors universally recommend beginning retirement savings as early as possible.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>What is the difference between simple and compound interest?</h3>
          <p>
            Simple interest is calculated only on the original principal. If you invest $1,000 at 5% simple interest for 10 years, you earn exactly $500 in interest. With compound interest, you earn interest on your accumulated interest, so the same $1,000 at 5% compounded annually for 10 years yields $628.89 in interest — over 25% more.
          </p>

          <h3>Is compound interest always beneficial?</h3>
          <p>
            Compound interest works in your favor when you are <em>earning</em> it (savings accounts, investments) but works against you when you are <em>paying</em> it (credit cards, loans). Credit card debt compounds daily at high rates (often 15%–25% APR), which is why paying off high-interest debt should be a financial priority.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Initial Investment"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="10000"
            suffix="$"
          />
          <Input
            label="Annual Interest Rate"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="7"
            suffix="%"
          />
          <Input
            label="Investment Period"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="10"
            suffix="yrs"
          />
          <Select
            label="Compound Frequency"
            id="compound"
            value={compound}
            onChange={(e) => setCompound(e.target.value)}
            options={[
              { value: "1", label: "Annually" },
              { value: "4", label: "Quarterly" },
              { value: "12", label: "Monthly" },
              { value: "365", label: "Daily" },
            ]}
          />
          <Input
            label="Monthly Contribution"
            type="number"
            value={monthlyAdd}
            onChange={(e) => setMonthlyAdd(e.target.value)}
            placeholder="100"
            suffix="$/mo"
          />
        </div>

        {/* Results */}
        {futureValue !== null && (
          <ResultsGrid columns={3}>
            <ResultCard
              label="Future Value"
              value={formatCurrency(futureValue)}
              highlight
            />
            <ResultCard
              label="Total Contributions"
              value={formatCurrency(totalContributions)}
            />
            <ResultCard
              label="Total Interest Earned"
              value={formatCurrency(totalInterest)}
            />
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
