"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState("50000");
  const [currentSavings, setCurrentSavings] = useState("5000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("5");

  const [monthlySavings, setMonthlySavings] = useState<number | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const G = parseFloat(goal);
    const S = parseFloat(currentSavings) || 0;
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);

    if (isNaN(G) || isNaN(t) || G <= 0 || t <= 0) {
      setMonthlySavings(null);
      return;
    }

    const n = 12; // monthly compounding
    const totalPeriods = n * t;
    const periodicRate = r / n;

    // FV of current savings
    const fvCurrent = S * Math.pow(1 + periodicRate, totalPeriods);

    // Remaining amount needed from contributions
    const remaining = G - fvCurrent;

    if (remaining <= 0) {
      setMonthlySavings(0);
      setTotalContributions(S);
      setTotalInterest(G - S);
      return;
    }

    // PMT formula: remaining = PMT * ((1+r)^n - 1) / r
    let pmt: number;
    if (periodicRate > 0) {
      pmt =
        remaining /
        ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    } else {
      pmt = remaining / totalPeriods;
    }

    const totalContrib = S + pmt * totalPeriods;
    setMonthlySavings(pmt);
    setTotalContributions(totalContrib);
    setTotalInterest(G - totalContrib);
  }, [goal, currentSavings, rate, years]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <ToolLayout
      title="Savings Goal Calculator"
      description="Find out exactly how much you need to save each month to reach your financial goal. Factor in your current savings, expected interest rate, and timeline to get a personalized monthly savings target."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Loan Calculator", href: "/loan-calculator" },
      ]}
      content={
        <>
          <h2>How Does the Savings Goal Calculator Work?</h2>
          <p>
            This calculator uses the <strong>future value of an annuity</strong> formula to reverse-engineer how much you need to save each month to reach a specific financial goal. It accounts for your current savings balance, which compounds independently, and then determines the additional regular monthly deposit required to bridge the gap between your current savings&apos; future value and your target amount.
          </p>

          <h2>The Math Behind the Calculation</h2>
          <p>
            The core formula involves two parts:
          </p>
          <ul>
            <li><strong>Future Value of Current Savings:</strong> FV = S × (1 + r/n)<sup>nt</sup>, where S is your starting balance, r is the annual interest rate, n is the compounding frequency (12 for monthly), and t is time in years.</li>
            <li><strong>Required Monthly Payment:</strong> PMT = (Goal – FV of Current Savings) / [((1 + r/n)<sup>nt</sup> – 1) / (r/n)], which calculates the annuity payment needed to fill the remaining gap.</li>
          </ul>

          <h2>Common Savings Goals</h2>
          <ul>
            <li><strong>Emergency Fund:</strong> Financial experts recommend saving 3 to 6 months of living expenses. For a household spending $4,000/month, that&apos;s $12,000–$24,000.</li>
            <li><strong>Down Payment on a Home:</strong> Typically 10–20% of the home&apos;s purchase price. For a $300,000 home, that&apos;s $30,000–$60,000.</li>
            <li><strong>College Tuition:</strong> The average cost of 4 years at a public university is approximately $100,000, including room and board.</li>
            <li><strong>Retirement Nest Egg:</strong> A common target is 25 times your annual expenses (the &quot;4% rule&quot;). If you spend $50,000/year, aim for $1,250,000.</li>
          </ul>

          <h2>Strategies to Reach Your Savings Goal Faster</h2>
          <ul>
            <li><strong>Automate your savings:</strong> Set up automatic transfers from your checking account on payday. This removes the temptation to spend first and ensures consistency.</li>
            <li><strong>Increase contributions with raises:</strong> Each time you receive a salary increase, allocate at least half of the raise toward your savings goal before lifestyle inflation absorbs it.</li>
            <li><strong>Choose higher-yield accounts:</strong> High-yield savings accounts and certificates of deposit (CDs) currently offer 4–5% APY, significantly more than traditional bank accounts at 0.01%.</li>
            <li><strong>Reduce unnecessary expenses:</strong> Audit subscriptions, dining, and discretionary spending. Redirecting even $100/month saved from expenses can shave years off your timeline.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>What interest rate should I use?</h3>
          <p>
            For a high-yield savings account, use 4–5%. For conservative investment portfolios (bonds + stocks), use 5–7%. For aggressive equity portfolios, use 8–10%. Remember that higher return assumptions come with higher risk and volatility.
          </p>

          <h3>What if I already have enough saved?</h3>
          <p>
            If the future value of your current savings already exceeds your goal at the specified interest rate and timeline, the calculator will show $0 monthly savings needed. Your existing savings will compound to meet the goal on their own.
          </p>

          <h3>Does this account for inflation?</h3>
          <p>
            This calculator uses nominal (non-inflation-adjusted) values. To account for inflation, subtract the expected inflation rate (typically 2–3%) from your assumed interest rate. For example, if you expect 7% returns and 3% inflation, use 4% as your effective rate.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Savings Goal"
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="50000"
            suffix="$"
          />
          <Input
            label="Current Savings"
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            placeholder="5000"
            suffix="$"
          />
          <Input
            label="Annual Interest Rate"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="5"
            suffix="%"
          />
          <Input
            label="Time to Reach Goal"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="5"
            suffix="yrs"
          />
        </div>

        {/* Results */}
        {monthlySavings !== null && (
          <ResultsGrid columns={3}>
            <ResultCard
              label="Monthly Savings Needed"
              value={formatCurrency(monthlySavings)}
              highlight
            />
            <ResultCard
              label="Total Contributions"
              value={formatCurrency(totalContributions)}
            />
            <ResultCard
              label="Interest Earned"
              value={formatCurrency(totalInterest)}
            />
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
