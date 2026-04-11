"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Home, Building2, TrendingUp, DollarSign, Info, Calendar, BarChart3, Scale, PiggyBank } from "lucide-react";

/* ─── FAQ Data ──────────────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "Is it always cheaper to buy than rent?",
    answer:
      "No. The financial advantage depends heavily on location, how long you stay, home price appreciation, mortgage rates, and what you do with the savings from renting. According to research by the Federal Reserve Bank of Atlanta, renting is financially superior to buying in approximately 40% of US metropolitan areas when factoring in opportunity cost of the down payment. In high-cost cities like San Francisco, New York, and Boston, renting often wins for stays under 7–10 years. The 'buy vs rent' decision is math, not ideology.",
  },
  {
    question: "How long do I need to stay to make buying worthwhile?",
    answer:
      "The typical breakeven point is 5–7 years in most US markets, but it varies dramatically by location and market conditions. In markets with high price-to-rent ratios (like coastal cities), the breakeven can be 10+ years. The breakeven depends on closing costs (typically 2–5% of purchase price), selling costs (5–6% agent commissions), and the rate of home price appreciation vs. investment returns on a renter's savings. This calculator computes your specific breakeven based on your inputs.",
  },
  {
    question: "What costs of homeownership are people most likely to underestimate?",
    answer:
      "The most underestimated costs are: (1) Maintenance and repairs — the standard rule is budgeting 1–2% of home value annually, meaning a $400K home costs $4,000–$8,000/year in upkeep. (2) Opportunity cost of the down payment — a $80,000 down payment invested in the S&P 500 at 7% real return would grow to ~$160,000 in 10 years. (3) Transaction costs — buying (2–5% closing costs) and selling (5–6% agent fees + closing costs) together consume ~8–11% of the home's value. (4) Property insurance increases — premiums have risen 20–30% in many US states since 2020.",
  },
  {
    question: "Should I factor in the mortgage interest tax deduction?",
    answer:
      "Only if you itemize deductions. After the 2017 Tax Cuts and Jobs Act doubled the standard deduction to $25,900 (2022, married filing jointly), roughly 87% of US taxpayers take the standard deduction. For these taxpayers, the mortgage interest deduction provides zero benefit. Even for itemizers, the deduction only applies to interest on mortgages up to $750,000. This calculator shows post-tax costs either way, but you should confirm whether you actually itemize before counting on this benefit.",
  },
  {
    question: "What is the 'price-to-rent ratio' and how do I use it?",
    answer:
      "The price-to-rent ratio equals the home price divided by annual rent for a comparable property. For example: $400,000 home ÷ ($2,000/month × 12) = 16.7. Ratios below 15 favor buying; 15–20 is neutral; above 20 favors renting. In 2024, the national average price-to-rent ratio was approximately 17. Cities like Detroit (ratio ~8) strongly favor buying, while San Francisco (ratio ~30+) strongly favors renting. This ratio is a quick screening tool, but a full analysis like this calculator provides a more accurate comparison.",
  },
  {
    question: "What rate of home appreciation should I assume?",
    answer:
      "The long-term national average for US home prices (1991–2024) is approximately 3.5–4.5% annually, according to the FHFA House Price Index. However, real (inflation-adjusted) appreciation is closer to 1–2% per year. Nominal appreciation can vary dramatically by market: some cities saw 100%+ gains from 2019–2024, while others were flat. For conservative planning, use 3% nominal or 1% real. Never assume home prices only go up — during 2007–2012, the national average declined ~27%. This calculator lets you set your own appreciation assumption.",
  },
];

/* ─── Helpers ───────────────────────────────────── */

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) return "$" + (value / 1000000).toFixed(1) + "M";
  if (Math.abs(value) >= 1000) return "$" + (value / 1000).toFixed(0) + "K";
  return "$" + Math.round(value).toLocaleString();
}

function formatCurrencyFull(value: number): string {
  return "$" + Math.round(value).toLocaleString();
}

/* ─── Component ────────────────────────────────── */

export default function RentVsBuyCalculator() {
  /* Home buying inputs */
  const [homePrice, setHomePrice] = useState("350000");
  const [downPaymentPct, setDownPaymentPct] = useState("20");
  const [mortgageRate, setMortgageRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState("1.1");
  const [homeInsurance, setHomeInsurance] = useState("150");
  const [maintenancePct, setMaintenancePct] = useState("1.0");
  const [hoaMonthly, setHoaMonthly] = useState("0");
  const [appreciation, setAppreciation] = useState("3.5");
  const [closingCostPct, setClosingCostPct] = useState("3");
  const [sellingCostPct, setSellingCostPct] = useState("6");

  /* Renting inputs */
  const [monthlyRent, setMonthlyRent] = useState("1800");
  const [rentIncrease, setRentIncrease] = useState("3.0");
  const [renterInsurance, setRenterInsurance] = useState("25");

  /* Shared inputs */
  const [timeHorizon, setTimeHorizon] = useState("10");
  const [investReturnRate, setInvestReturnRate] = useState("7.0");

  const results = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const dpPct = parseFloat(downPaymentPct) / 100 || 0;
    const rate = parseFloat(mortgageRate) / 100 / 12 || 0;
    const term = parseInt(loanTerm) || 30;
    const taxRate = parseFloat(propertyTaxRate) / 100 || 0;
    const insMonthly = parseFloat(homeInsurance) || 0;
    const maintPct = parseFloat(maintenancePct) / 100 || 0;
    const hoa = parseFloat(hoaMonthly) || 0;
    const appRate = parseFloat(appreciation) / 100 || 0;
    const closingPct = parseFloat(closingCostPct) / 100 || 0;
    const sellPct = parseFloat(sellingCostPct) / 100 || 0;

    const rent = parseFloat(monthlyRent) || 0;
    const rentIncPct = parseFloat(rentIncrease) / 100 || 0;
    const renterIns = parseFloat(renterInsurance) || 0;

    const years = parseInt(timeHorizon) || 10;
    const investReturn = parseFloat(investReturnRate) / 100 || 0;
    const monthlyInvestReturn = investReturn / 12;

    if (price <= 0 || rent <= 0 || years <= 0) return null;

    const downPayment = price * dpPct;
    const loanAmount = price - downPayment;
    const closingCosts = price * closingPct;
    const totalMonths = term * 12;

    /* Monthly mortgage payment (P&I) */
    const monthlyPayment = rate > 0
      ? loanAmount * (rate * Math.pow(1 + rate, totalMonths)) / (Math.pow(1 + rate, totalMonths) - 1)
      : loanAmount / totalMonths;

    /* Track year-by-year costs */
    let totalBuyCost = downPayment + closingCosts;
    let totalRentCost = 0;
    let renterInvestmentValue = downPayment + closingCosts; // Renter invests what buyer spent upfront
    let remainingLoan = loanAmount;
    let currentRent = rent;
    let currentHomeValue = price;

    const yearlyData: Array<{
      year: number;
      buyCostCumulative: number;
      rentCostCumulative: number;
      homeEquity: number;
      renterWealth: number;
      buyNetWealth: number;
      rentNetWealth: number;
    }> = [];

    for (let year = 1; year <= years; year++) {
      let yearBuyCost = 0;
      let yearRentCost = 0;

      for (let month = 0; month < 12; month++) {
        const monthIndex = (year - 1) * 12 + month;
        if (monthIndex >= totalMonths) break;

        /* Buyer costs this month */
        const interestPayment = remainingLoan * rate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingLoan = Math.max(0, remainingLoan - principalPayment);

        const propTaxMonthly = (currentHomeValue * taxRate) / 12;
        const maintMonthly = (currentHomeValue * maintPct) / 12;
        yearBuyCost += monthlyPayment + propTaxMonthly + insMonthly + maintMonthly + hoa;

        /* Renter costs this month */
        yearRentCost += currentRent + renterIns;

        /* Renter invests the difference */
        const buyerMonthlyOut = monthlyPayment + propTaxMonthly + insMonthly + maintMonthly + hoa;
        const renterMonthlyOut = currentRent + renterIns;
        const monthlySavings = Math.max(0, buyerMonthlyOut - renterMonthlyOut);
        renterInvestmentValue = renterInvestmentValue * (1 + monthlyInvestReturn) + monthlySavings;
      }

      /* Annual adjustments */
      currentHomeValue = currentHomeValue * (1 + appRate);
      currentRent = currentRent * (1 + rentIncPct);

      totalBuyCost += yearBuyCost;
      totalRentCost += yearRentCost;

      /* Selling costs at this point */
      const sellingCosts = currentHomeValue * sellPct;
      const homeEquity = currentHomeValue - remainingLoan;
      const buyNetWealth = homeEquity - sellingCosts;
      const rentNetWealth = renterInvestmentValue;

      yearlyData.push({
        year,
        buyCostCumulative: totalBuyCost,
        rentCostCumulative: totalRentCost,
        homeEquity,
        renterWealth: renterInvestmentValue,
        buyNetWealth,
        rentNetWealth,
      });
    }

    const finalYear = yearlyData[yearlyData.length - 1];
    const sellingCosts = currentHomeValue * sellPct;
    const homeEquity = currentHomeValue - remainingLoan;
    const netBuyWealth = homeEquity - sellingCosts;
    const netRentWealth = renterInvestmentValue;
    const buyerWins = netBuyWealth > netRentWealth;

    /* Find breakeven year */
    let breakevenYear = 0;
    for (let i = 0; i < yearlyData.length; i++) {
      if (yearlyData[i].buyNetWealth >= yearlyData[i].rentNetWealth) {
        breakevenYear = yearlyData[i].year;
        break;
      }
    }

    const priceToRentRatio = price / (rent * 12);

    return {
      totalBuyCost,
      totalRentCost,
      monthlyPayment,
      homeEquity,
      currentHomeValue,
      sellingCosts,
      netBuyWealth,
      netRentWealth,
      renterInvestmentValue,
      buyerWins,
      difference: Math.abs(netBuyWealth - netRentWealth),
      breakevenYear,
      downPayment,
      closingCosts,
      yearlyData,
      priceToRentRatio,
      years,
    };
  }, [homePrice, downPaymentPct, mortgageRate, loanTerm, propertyTaxRate, homeInsurance, maintenancePct, hoaMonthly, appreciation, closingCostPct, sellingCostPct, monthlyRent, rentIncrease, renterInsurance, timeHorizon, investReturnRate]);

  return (
    <ToolLayout
      title="Rent vs Buy Calculator"
      description="Compare the total financial cost of renting vs buying a home over your time horizon. This calculator models mortgage payments, property taxes, maintenance, appreciation, opportunity cost of the down payment, and investment returns to determine which option builds more long-term wealth."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter home buying details", text: "Input the home price, down payment, mortgage rate, property taxes, insurance, and maintenance costs." },
        { name: "Enter rental details", text: "Input your current monthly rent, expected annual rent increases, and renter's insurance cost." },
        { name: "Set the time horizon", text: "Choose how many years you plan to stay. The typical breakeven for buying is 5–7 years." },
        { name: "Compare results", text: "Review the net wealth comparison, breakeven analysis, and year-by-year cost progression to make an informed decision." },
      ]}
      relatedTools={[
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
        { name: "Down Payment Calculator", href: "/down-payment-calculator" },
        { name: "Investment Calculator", href: "/investment-calculator" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
        { name: "Savings Calculator", href: "/savings-calculator" },
      ]}
      content={
        <>
          <h2>What Is a Rent vs Buy Calculator?</h2>
          <p>
            A rent vs buy calculator compares the total financial outcome of renting a home versus purchasing one over a specified time period. It goes far beyond the simplistic &ldquo;rent is throwing money away&rdquo; argument by modeling the full cost of ownership — including mortgage interest, property taxes, maintenance, insurance, transaction costs, and the <strong>opportunity cost</strong> of investing the down payment in the stock market instead. The result is a net wealth comparison that shows which option leaves you financially better off.
          </p>

          <h2>How Does the Calculation Work?</h2>
          <h3>Buyer&apos;s Net Wealth</h3>
          <p><strong>Net Wealth (Buy) = Home Value after Appreciation − Remaining Mortgage − Selling Costs</strong></p>
          <p>The buyer pays: down payment + closing costs + monthly mortgage (P&amp;I) + property taxes + insurance + maintenance + HOA. Over time, the home appreciates in value and the mortgage balance decreases, building equity.</p>

          <h3>Renter&apos;s Net Wealth</h3>
          <p><strong>Net Wealth (Rent) = Investment Portfolio Value</strong></p>
          <p>The renter pays: monthly rent + renter&apos;s insurance. The renter invests: (1) the entire down payment + closing costs upfront, and (2) any monthly savings (the difference between the buyer&apos;s total housing cost and the renter&apos;s cost) into an investment portfolio earning market returns.</p>

          <h3>Worked Example</h3>
          <p>Home price: $350,000 | Down payment: 20% ($70,000) | Mortgage rate: 6.5% | Monthly rent: $1,800 | Time: 10 years | Investment return: 7%</p>
          <ul>
            <li>Monthly mortgage (P&amp;I): ~$1,770 on a $280,000 loan</li>
            <li>Total buyer monthly cost: ~$2,650 (mortgage + tax + insurance + maintenance)</li>
            <li>Home value after 10 years (3.5% growth): ~$493,000</li>
            <li>Buyer equity after selling costs: ~$250,000</li>
            <li>Renter portfolio (investing savings at 7%): ~$210,000</li>
            <li><strong>Buying wins by ~$40,000</strong> in this scenario</li>
          </ul>

          <h2>Understanding Your Results</h2>
          <p>The key insight is that <strong>both renting and buying cost money</strong> — the question is which option costs less and builds more wealth over your specific time horizon. Factors that favor buying:</p>
          <ul>
            <li>Longer time horizon (7+ years)</li>
            <li>Strong local home appreciation</li>
            <li>Low mortgage interest rates</li>
            <li>Low property tax jurisdiction</li>
          </ul>
          <p>Factors that favor renting:</p>
          <ul>
            <li>Short time horizon ({'<'} 5 years)</li>
            <li>High price-to-rent ratio (expensive market)</li>
            <li>High mortgage rates</li>
            <li>Strong stock market returns</li>
          </ul>

          <h2>The Price-to-Rent Ratio</h2>
          <p>The price-to-rent ratio is a quick screening metric: <strong>Home Price ÷ (Monthly Rent × 12)</strong>.</p>
          <table>
            <thead>
              <tr><th>Ratio</th><th>Recommendation</th><th>Example Markets (2024)</th></tr>
            </thead>
            <tbody>
              <tr><td>Below 15</td><td>Strongly favors buying</td><td>Detroit, Cleveland, Pittsburgh</td></tr>
              <tr><td>15–20</td><td>Neutral — depends on specifics</td><td>Dallas, Atlanta, Phoenix</td></tr>
              <tr><td>Above 20</td><td>Strongly favors renting</td><td>San Francisco, New York, Los Angeles</td></tr>
            </tbody>
          </table>

          <h2>Hidden Costs Most People Forget</h2>
          <ul>
            <li><strong>Transaction costs:</strong> Closing costs (2–5%) + selling costs (5–6%) consume 8–11% of the home&apos;s value for a round-trip buy-and-sell.</li>
            <li><strong>Maintenance:</strong> Budget 1–2% of home value per year. A $350K home costs $3,500–$7,000 annually. Major repairs (roof, HVAC, foundation) can cost $10,000–$30,000.</li>
            <li><strong>Opportunity cost:</strong> A $70,000 down payment invested in the S&amp;P 500 at 7% historical return grows to ~$137,000 in 10 years — $67,000 in gains the renter captures.</li>
            <li><strong>Illiquidity:</strong> Home equity cannot be quickly or cheaply accessed. Selling takes 30–90 days and costs 5–6% in commissions.</li>
          </ul>

          <h2>Financial Disclaimer</h2>
          <p>
            This calculator is for educational purposes only and does not constitute financial advice. Actual costs, appreciation rates, and investment returns vary significantly by location, market conditions, and individual circumstances. Tax implications are simplified. Consult a qualified financial advisor before making major housing decisions.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>Federal Housing Finance Agency (FHFA). <em>House Price Index</em>. fhfa.gov. Historical home price data from 1991–2024.</li>
            <li>Federal Reserve Bank of Atlanta (2024). &ldquo;Home Ownership Affordability Monitor.&rdquo;</li>
            <li>National Association of Realtors (2024). &ldquo;Home Buyers and Sellers Generational Trends Report.&rdquo;</li>
            <li>Damodaran, A. (2024). &ldquo;Historical Returns on Stocks, Bonds and Bills — US: 1928–2024.&rdquo; NYU Stern School of Business.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Two-column: Buy vs Rent */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Buy Column */}
          <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Home className="h-5 w-5 text-emerald-600" />
              Buying
            </h3>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Home Price ($)</label>
              <input type="number" inputMode="numeric" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Down Payment (%)</label>
                <input type="number" inputMode="decimal" value={downPaymentPct} onChange={(e) => setDownPaymentPct(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Mortgage Rate (%)</label>
                <input type="number" inputMode="decimal" value={mortgageRate} onChange={(e) => setMortgageRate(e.target.value)} step="0.1" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Loan Term (years)</label>
                <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground">
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Property Tax (%/yr)</label>
                <input type="number" inputMode="decimal" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(e.target.value)} step="0.1" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Insurance ($/mo)</label>
                <input type="number" inputMode="numeric" value={homeInsurance} onChange={(e) => setHomeInsurance(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Maintenance (%/yr)</label>
                <input type="number" inputMode="decimal" value={maintenancePct} onChange={(e) => setMaintenancePct(e.target.value)} step="0.1" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">HOA ($/mo)</label>
                <input type="number" inputMode="numeric" value={hoaMonthly} onChange={(e) => setHoaMonthly(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Appreciation (%/yr)</label>
                <input type="number" inputMode="decimal" value={appreciation} onChange={(e) => setAppreciation(e.target.value)} step="0.1" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
          </div>

          {/* Rent Column */}
          <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Renting
            </h3>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Monthly Rent ($)</label>
              <input type="number" inputMode="numeric" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Annual Rent Increase (%)</label>
              <input type="number" inputMode="decimal" value={rentIncrease} onChange={(e) => setRentIncrease(e.target.value)} step="0.1" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Renter&apos;s Insurance ($/mo)</label>
              <input type="number" inputMode="numeric" value={renterInsurance} onChange={(e) => setRenterInsurance(e.target.value)} className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>

            {/* Shared inputs in the rent column */}
            <hr className="border-border" />
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Comparison Settings
            </h4>
            <div className="grid gap-3 grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Time Horizon (years)</label>
                <input type="number" inputMode="numeric" value={timeHorizon} onChange={(e) => setTimeHorizon(e.target.value)} min="1" max="30" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Invest Return (%/yr)</label>
                <input type="number" inputMode="decimal" value={investReturnRate} onChange={(e) => setInvestReturnRate(e.target.value)} step="0.5" className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Winner announcement */}
            <div className={`rounded-xl border-2 p-5 text-center ${results.buyerWins ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "border-blue-500 bg-blue-50 dark:bg-blue-950/20"}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {results.buyerWins ? <Home className="h-6 w-6 text-emerald-600" /> : <Building2 className="h-6 w-6 text-blue-600" />}
                <p className="text-sm font-medium text-muted-foreground">After {results.years} years</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {results.buyerWins ? "Buying" : "Renting"} wins by {formatCurrency(results.difference)}
              </p>
              {results.breakevenYear > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Buying breaks even at year {results.breakevenYear}
                </p>
              )}
              {results.breakevenYear === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Renting remains cheaper throughout the {results.years}-year period
                </p>
              )}
            </div>

            {/* Side-by-side comparison */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Buy summary */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Home className="h-4 w-4 text-emerald-600" /> Buying Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Monthly P&I</span><span className="font-medium">{formatCurrencyFull(results.monthlyPayment)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Home Value (Year {results.years})</span><span className="font-medium">{formatCurrencyFull(results.currentHomeValue)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Home Equity</span><span className="font-medium">{formatCurrencyFull(results.homeEquity)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Selling Costs</span><span className="font-medium text-red-600">-{formatCurrencyFull(results.sellingCosts)}</span></div>
                  <hr className="border-border" />
                  <div className="flex justify-between"><span className="font-medium text-foreground">Net Wealth</span><span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">{formatCurrencyFull(results.netBuyWealth)}</span></div>
                </div>
              </div>

              {/* Rent summary */}
              <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/10 p-4 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-blue-600" /> Renting Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Rent Paid</span><span className="font-medium">{formatCurrencyFull(results.totalRentCost)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Initial Investment</span><span className="font-medium">{formatCurrencyFull(results.downPayment + results.closingCosts)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">+ Monthly Savings Invested</span><span className="font-medium text-muted-foreground">Compounded</span></div>
                  <hr className="border-border" />
                  <div className="flex justify-between"><span className="font-medium text-foreground">Portfolio Value</span><span className="font-bold text-lg text-blue-700 dark:text-blue-400">{formatCurrencyFull(results.netRentWealth)}</span></div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Price-to-Rent Ratio</p>
                <p className="text-xl font-bold text-foreground">{results.priceToRentRatio.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {results.priceToRentRatio < 15 ? "Favors buying" : results.priceToRentRatio > 20 ? "Favors renting" : "Neutral"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Buy Cost</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(results.totalBuyCost)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Rent Cost</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(results.totalRentCost)}</p>
              </div>
            </div>

            {/* Year-by-year table */}
            <div className="rounded-xl border border-border bg-muted/30 p-5 overflow-auto">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Year-by-Year Net Wealth Comparison
              </h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Year</th>
                    <th className="text-right py-2 px-2 text-emerald-700 dark:text-emerald-400 font-medium">Buy Net Wealth</th>
                    <th className="text-right py-2 px-2 text-blue-700 dark:text-blue-400 font-medium">Rent Net Wealth</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.filter((_, i) => i % (results.years > 15 ? 2 : 1) === 0 || i === results.yearlyData.length - 1).map((row) => {
                    const diff = row.buyNetWealth - row.rentNetWealth;
                    return (
                      <tr key={row.year} className="border-b border-border/50">
                        <td className="py-2 px-2 font-medium">{row.year}</td>
                        <td className="py-2 px-2 text-right font-mono">{formatCurrencyFull(row.buyNetWealth)}</td>
                        <td className="py-2 px-2 text-right font-mono">{formatCurrencyFull(row.rentNetWealth)}</td>
                        <td className={`py-2 px-2 text-right font-mono ${diff >= 0 ? "text-emerald-600" : "text-blue-600"}`}>
                          {diff >= 0 ? "+" : ""}{formatCurrencyFull(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border bg-amber-50 dark:bg-amber-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                This is a simplified model. Actual results vary with tax benefits, market conditions, closing cost negotiation, and unforeseen repairs. This is for educational purposes only and does not constitute financial advice.
              </p>
            </div>
          </div>
        )}

        {!results && (
          <div className="text-center py-12 text-muted-foreground">
            <Scale className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter values above to compare renting vs buying</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
