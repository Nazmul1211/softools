"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { DollarSign, Clock, Calendar, TrendingUp, Briefcase, Calculator, Info, PiggyBank, Receipt } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How do I calculate my freelance hourly rate?",
    answer:
      "The core formula is: Hourly Rate = (Desired Annual Income + Annual Business Expenses) ÷ Annual Billable Hours. Annual billable hours account for vacation, sick days, holidays, and the fact that not all working hours are billable (admin, marketing, invoicing typically consume 25–40% of your time). For example, if you want to earn $80,000/year with $15,000 in expenses and work 1,200 billable hours: ($80,000 + $15,000) ÷ 1,200 = $79.17/hour.",
  },
  {
    question: "What percentage of my time is actually billable?",
    answer:
      "Most freelancers can bill 60–75% of their total working hours. The remaining 25–40% goes to non-billable activities: prospecting and pitching clients, administrative tasks, invoicing and bookkeeping, learning and professional development, marketing and social media, email and communication. A freelancer working 40 hours per week typically has 25–30 billable hours. New freelancers often have even fewer billable hours as they spend more time finding clients.",
  },
  {
    question: "Should I charge hourly or project-based rates?",
    answer:
      "Both have advantages. Hourly rates are simpler and protect you when scope expands, but they cap your earnings (you can only work so many hours). Project-based pricing lets you earn more as you get faster and more efficient — a project that takes you 10 hours at $100/hr earns $1,000, but if you quote $1,500 flat and finish in 8 hours, your effective rate rises to $187.50/hr. Most experienced freelancers use hourly rates as their internal floor and quote project rates to clients. Use this calculator to find your minimum hourly rate, then build project quotes on top of it.",
  },
  {
    question: "How much should I set aside for taxes as a freelancer?",
    answer:
      "In the United States, self-employed individuals pay both income tax and self-employment tax (15.3% for Social Security and Medicare). A general rule is to set aside 25–30% of gross income for taxes if your total income is under $100,000, and 30–35% if over $100,000. This varies by state — states like California and New York have higher income taxes. Many freelancers make quarterly estimated tax payments (Form 1040-ES) to avoid penalties. In the UK, freelancers should set aside 20–40% depending on their tax bracket. Consult a tax professional for personalized advice.",
  },
  {
    question: "How do I raise my freelance rates without losing clients?",
    answer:
      "Raise rates gradually (10–15% per year) and communicate the increase 30–60 days in advance. Frame it as a value conversation, not a price increase: 'Based on the complexity of our work together and the results I've delivered, my rate for new projects starting in Q3 will be $X.' Most clients expect occasional rate increases. If a client pushes back, consider offering a loyalty discount (5–10% off the new rate) or grandfathering their current rate for a limited period. The clients who leave over a 10% increase are usually the ones paying below market rate anyway.",
  },
  {
    question: "What expenses should I include in my rate calculation?",
    answer:
      "Include all costs of running your freelance business: software subscriptions (design tools, project management, accounting), hardware (computer, monitor, peripherals — amortized annually), insurance (health, liability, professional indemnity), internet and phone, home office costs (rent portion, utilities), professional development (courses, conferences), marketing and website hosting, accounting and legal fees, retirement contributions, and any contractor or subcontractor fees. Don't forget to include costs that employers normally cover: health insurance premium ($300–700/month in the US), retirement contributions (15% of income recommended), and paid time off (vacation, sick days, holidays).",
  },
];

/* ────────────────────── Component ────────────────────── */

export default function FreelanceRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState<string>("80000");
  const [businessExpenses, setBusinessExpenses] = useState<string>("12000");
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("40");
  const [billablePercent, setBillablePercent] = useState<string>("70");
  const [vacationWeeks, setVacationWeeks] = useState<string>("3");
  const [sickDays, setSickDays] = useState<string>("5");
  const [holidayDays, setHolidayDays] = useState<string>("10");
  const [taxRate, setTaxRate] = useState<string>("25");

  const results = useMemo(() => {
    const income = parseFloat(desiredIncome) || 0;
    const expenses = parseFloat(businessExpenses) || 0;
    const hrsWeek = parseFloat(hoursPerWeek) || 40;
    const billPct = parseFloat(billablePercent) || 70;
    const vacWeeks = parseFloat(vacationWeeks) || 0;
    const sick = parseFloat(sickDays) || 0;
    const holidays = parseFloat(holidayDays) || 0;
    const tax = parseFloat(taxRate) || 0;

    if (income <= 0) return null;

    /* Calculate available working weeks */
    const totalWeeksPerYear = 52;
    const holidayWeeks = holidays / 5;
    const sickWeeks = sick / 5;
    const workingWeeks = totalWeeksPerYear - vacWeeks - holidayWeeks - sickWeeks;

    /* Calculate total available hours */
    const totalWorkHours = workingWeeks * hrsWeek;

    /* Calculate billable hours */
    const billableHours = totalWorkHours * (billPct / 100);

    /* Total revenue needed */
    const revenueNeeded = income + expenses;

    /* Tax-adjusted revenue (if setting aside for taxes) */
    const taxAdjustedRevenue = tax > 0 ? revenueNeeded / (1 - tax / 100) : revenueNeeded;

    /* Hourly rate (before tax consideration) */
    const hourlyRate = revenueNeeded / billableHours;

    /* Hourly rate (tax-adjusted — what you actually need to charge) */
    const hourlyRateTaxAdjusted = taxAdjustedRevenue / billableHours;

    /* Derived rates */
    const dailyRate = hourlyRateTaxAdjusted * (hrsWeek / 5) * (billPct / 100);
    const weeklyRate = hourlyRateTaxAdjusted * hrsWeek * (billPct / 100);
    const monthlyRate = taxAdjustedRevenue / 12;

    /* Effective per-hour breakdown */
    const effectivePerHourBeforeTax = hourlyRate;
    const taxPerHour = hourlyRateTaxAdjusted - hourlyRate;

    return {
      hourlyRate: Math.ceil(hourlyRate),
      hourlyRateTaxAdjusted: Math.ceil(hourlyRateTaxAdjusted),
      dailyRate: Math.round(dailyRate),
      weeklyRate: Math.round(weeklyRate),
      monthlyRate: Math.round(monthlyRate),
      billableHours: Math.round(billableHours),
      totalWorkHours: Math.round(totalWorkHours),
      workingWeeks: Math.round(workingWeeks * 10) / 10,
      revenueNeeded: Math.round(revenueNeeded),
      taxAdjustedRevenue: Math.round(taxAdjustedRevenue),
      taxPerHour: Math.ceil(taxPerHour),
      effectivePerHourBeforeTax: Math.ceil(effectivePerHourBeforeTax),
      billableHoursPerWeek: Math.round((hrsWeek * billPct) / 100 * 10) / 10,
    };
  }, [desiredIncome, businessExpenses, hoursPerWeek, billablePercent, vacationWeeks, sickDays, holidayDays, taxRate]);

  return (
    <ToolLayout
      title="Freelance Rate Calculator"
      description="Calculate your ideal freelance hourly rate based on desired income, business expenses, billable hours, and tax obligations. Get daily, weekly, and monthly rate equivalents to price your services confidently."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter desired annual income", text: "Input the gross annual income you want to take home after expenses, before personal taxes." },
        { name: "Add business expenses", text: "Include all annual costs of running your freelance business: software, hardware, insurance, marketing, and professional development." },
        { name: "Set your working schedule", text: "Configure hours per week, vacation time, sick days, and holidays to calculate your available working time." },
        { name: "Adjust billable percentage", text: "Set the percentage of working hours that are actually billable to clients (typically 60–75%). The rest goes to admin, marketing, and overhead." },
        { name: "Review your minimum rate", text: "See your minimum hourly rate, tax-adjusted rate, and equivalent daily, weekly, and monthly rates. Use this as your pricing floor." },
      ]}
      relatedTools={[
        { name: "Salary Calculator", href: "/salary-calculator" },
        { name: "Tax Calculator", href: "/tax-calculator" },
        { name: "Profit Calculator", href: "/profit-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Break-Even Calculator", href: "/break-even-calculator" },
      ]}
      content={
        <>
          <h2>What Is a Freelance Rate Calculator?</h2>
          <p>
            A freelance rate calculator helps independent professionals determine the minimum hourly rate they need to charge to meet their income goals while covering business expenses, taxes, and time off. Unlike salaried employees who receive a fixed paycheck regardless of hours worked, freelancers must account for non-billable time, self-employment taxes, benefits they fund themselves, and the unpredictability of project-based work. This calculator transforms your desired annual income into a concrete hourly, daily, and monthly rate you can use in client proposals.
          </p>

          <h2>How Is the Freelance Hourly Rate Calculated?</h2>
          <p>
            The core formula is:
          </p>
          <p>
            <strong>Hourly Rate = (Desired Annual Income + Annual Business Expenses) ÷ Annual Billable Hours</strong>
          </p>
          <p>
            The critical factor most freelancers miscalculate is <strong>annual billable hours</strong>. You cannot bill every working hour — administrative tasks, marketing, invoicing, and client communication consume a significant portion of your week. Here is how to calculate billable hours:
          </p>
          <p>
            <strong>Billable Hours = (52 weeks − Vacation − Holidays − Sick Days) × Hours/Week × Billable %</strong>
          </p>

          <h3>Worked Example</h3>
          <p>
            A freelance web developer wants to earn <strong>$85,000/year</strong> with <strong>$15,000 in annual expenses</strong>:
          </p>
          <ul>
            <li>Working 40 hours/week with 3 weeks vacation, 10 holidays, and 5 sick days</li>
            <li><strong>Available weeks:</strong> 52 − 3 − 2 − 1 = 46 weeks</li>
            <li><strong>Total hours:</strong> 46 × 40 = 1,840 hours</li>
            <li><strong>Billable hours (70%):</strong> 1,840 × 0.70 = 1,288 hours</li>
            <li><strong>Revenue needed:</strong> $85,000 + $15,000 = $100,000</li>
            <li><strong>Minimum hourly rate:</strong> $100,000 ÷ 1,288 = <strong>$77.64/hour</strong></li>
            <li><strong>Tax-adjusted (25% tax):</strong> $133,333 ÷ 1,288 = <strong>$103.52/hour</strong></li>
          </ul>

          <h2>Understanding Your Results</h2>
          <p>
            The calculator provides two hourly rates:
          </p>
          <ul>
            <li><strong>Base rate</strong> — the minimum you need to charge per billable hour to cover income + expenses</li>
            <li><strong>Tax-adjusted rate</strong> — what you actually need to charge when accounting for self-employment and income taxes</li>
          </ul>
          <p>
            The tax-adjusted rate is the number you should use when quoting clients. It ensures you earn your target take-home income <em>after</em> paying taxes. The daily, weekly, and monthly equivalents are derived from the tax-adjusted rate for convenience.
          </p>

          <h2>Why Most Freelancers Undercharge</h2>
          <p>
            The most common mistake new freelancers make is calculating their rate as if they were a salaried employee. An employee earning $80,000/year at 40 hours/week effectively earns $38.46/hour — but they also receive health insurance ($7,000–$15,000/year value), retirement matching ($3,000–$8,000/year), paid vacation (2–4 weeks), paid sick days, and the employer pays half of FICA taxes ($6,120/year). When you add these up, a $80,000 salary often represents $95,000–$115,000 in total compensation.
          </p>
          <p>
            As a freelancer, you fund all of this yourself. You also lose time to non-billable work. This is why a freelancer charging $40/hour to &ldquo;match&rdquo; a $80,000 salary is actually earning the equivalent of $50,000–$60,000 in salaried compensation. This calculator helps you avoid that trap.
          </p>

          <h2>Freelance Rate Benchmarks by Industry (2025)</h2>
          <table>
            <thead>
              <tr>
                <th>Industry / Role</th>
                <th>Junior Rate</th>
                <th>Mid-Level Rate</th>
                <th>Senior Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Web Development</td><td>$50–$75</td><td>$75–$125</td><td>$125–$200+</td></tr>
              <tr><td>Graphic Design</td><td>$35–$55</td><td>$55–$90</td><td>$90–$150</td></tr>
              <tr><td>Content Writing</td><td>$25–$45</td><td>$45–$80</td><td>$80–$150</td></tr>
              <tr><td>Marketing / SEO</td><td>$40–$65</td><td>$65–$110</td><td>$110–$200</td></tr>
              <tr><td>Video Production</td><td>$45–$70</td><td>$70–$120</td><td>$120–$200+</td></tr>
              <tr><td>Consulting (Business)</td><td>$75–$125</td><td>$125–$200</td><td>$200–$400+</td></tr>
              <tr><td>UX/UI Design</td><td>$50–$80</td><td>$80–$130</td><td>$130–$200+</td></tr>
            </tbody>
          </table>
          <p>
            Rates vary significantly by location, specialization, and client type. US-based freelancers working with enterprise clients command higher rates than those working with small businesses. These benchmarks are useful for comparison but should not replace a calculation based on your actual income needs and expenses.
          </p>

          <h2>Expenses Every Freelancer Should Include</h2>
          <ul>
            <li><strong>Health insurance:</strong> $300–$700/month in the US (often the single largest expense)</li>
            <li><strong>Retirement savings:</strong> 10–15% of income (no employer matching as a freelancer)</li>
            <li><strong>Software subscriptions:</strong> $100–$500/month (design tools, cloud storage, project management)</li>
            <li><strong>Hardware:</strong> $1,000–$3,000/year amortized (computer, display, peripherals)</li>
            <li><strong>Professional liability insurance:</strong> $500–$2,000/year</li>
            <li><strong>Accounting / bookkeeping:</strong> $500–$3,000/year</li>
            <li><strong>Internet and phone:</strong> $100–$200/month</li>
            <li><strong>Home office:</strong> Rent allocation, utilities, furniture</li>
            <li><strong>Professional development:</strong> Courses, conferences, books</li>
            <li><strong>Marketing:</strong> Website, portfolio, advertising</li>
          </ul>

          <h2>When to Transition from Hourly to Value-Based Pricing</h2>
          <p>
            Hourly pricing creates a ceiling — there are only so many hours in a week. As your expertise grows and you deliver results faster, hourly pricing actually penalizes efficiency. Value-based pricing ties your rate to the <em>outcome</em> you deliver rather than the time spent. For example:
          </p>
          <ul>
            <li>A website redesign that increases a client&apos;s conversions by 30% is worth far more than the 40 hours you spent building it</li>
            <li>A tax strategy that saves a client $15,000/year justifies a $5,000 fee regardless of whether it took you 10 hours or 50</li>
          </ul>
          <p>
            Use this calculator to establish your <strong>minimum floor rate</strong>, then explore value-based pricing for projects where the client&apos;s ROI is clear and quantifiable. Your hourly rate becomes your internal benchmark, not your client-facing price.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>Freelancers Union & Upwork (2023). &ldquo;Freelance Forward 2023: The U.S. Independent Workforce Report.&rdquo;</li>
            <li>IRS Publication 505 (2024). &ldquo;Tax Withholding and Estimated Tax.&rdquo; Internal Revenue Service.</li>
            <li>Bureau of Labor Statistics (2024). &ldquo;Employer Costs for Employee Compensation.&rdquo; U.S. Department of Labor.</li>
            <li>MBO Partners (2023). &ldquo;State of Independence in America.&rdquo; Annual Report on the Independent Workforce.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Income & Expenses ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Desired Annual Income ($)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={desiredIncome}
              onChange={(e) => setDesiredIncome(e.target.value)}
              placeholder="80000"
              min="0"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Your target take-home pay before personal taxes</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              Annual Business Expenses ($)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={businessExpenses}
              onChange={(e) => setBusinessExpenses(e.target.value)}
              placeholder="12000"
              min="0"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Software, insurance, office, hardware, etc.</p>
          </div>
        </div>

        {/* ── Working Hours ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Hours Per Week
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              placeholder="40"
              min="1"
              max="80"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Billable Hours (%)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={billablePercent}
              onChange={(e) => setBillablePercent(e.target.value)}
              placeholder="70"
              min="10"
              max="100"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-muted-foreground mt-1">Typically 60–75% — rest is admin, marketing, etc.</p>
          </div>
        </div>

        {/* ── Time Off ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Vacation Weeks
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={vacationWeeks}
              onChange={(e) => setVacationWeeks(e.target.value)}
              placeholder="3"
              min="0"
              max="12"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Sick Days</label>
            <input
              type="number"
              inputMode="numeric"
              value={sickDays}
              onChange={(e) => setSickDays(e.target.value)}
              placeholder="5"
              min="0"
              max="30"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Holiday Days</label>
            <input
              type="number"
              inputMode="numeric"
              value={holidayDays}
              onChange={(e) => setHolidayDays(e.target.value)}
              placeholder="10"
              min="0"
              max="30"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* ── Tax Rate ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-primary" />
            Estimated Tax Rate (%)
          </label>
          <div className="flex gap-2">
            {[20, 25, 30, 35].map((rate) => (
              <button
                key={rate}
                onClick={() => setTaxRate(rate.toString())}
                className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                  taxRate === rate.toString()
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {rate}%
              </button>
            ))}
            <input
              type="number"
              inputMode="numeric"
              value={![20, 25, 30, 35].includes(parseInt(taxRate)) ? taxRate : ""}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="Custom"
              min="0"
              max="60"
              className="flex-1 rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            US freelancers: 25–30% typical. Includes income tax + self-employment tax.
          </p>
        </div>

        {/* ── Results ── */}
        {results && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Your Freelance Rates
            </h3>

            {/* Primary result */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-foreground">${results.hourlyRateTaxAdjusted}</span>
                <span className="text-lg text-muted-foreground">/hour</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tax-adjusted minimum hourly rate — what to charge clients
              </p>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-4 flex-wrap">
                <span>Base rate: ${results.hourlyRate}/hr</span>
                <span>+ Tax reserve: ${results.taxPerHour}/hr</span>
              </div>
            </div>

            {/* Rate equivalents */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Daily Rate</p>
                <p className="text-2xl font-bold text-foreground">${results.dailyRate.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per full day</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Weekly Rate</p>
                <p className="text-2xl font-bold text-foreground">${results.weeklyRate.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per week</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Monthly Rate</p>
                <p className="text-2xl font-bold text-foreground">${results.monthlyRate.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>

            {/* Hours breakdown */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Annual Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Working weeks per year</span>
                  <span className="font-medium text-foreground">{results.workingWeeks} weeks</span>
                </div>
                <div className="flex justify-between text-sm py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Total working hours</span>
                  <span className="font-medium text-foreground">{results.totalWorkHours.toLocaleString()} hrs</span>
                </div>
                <div className="flex justify-between text-sm py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Billable hours ({billablePercent}%)</span>
                  <span className="font-medium text-foreground">{results.billableHours.toLocaleString()} hrs</span>
                </div>
                <div className="flex justify-between text-sm py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Billable hours per week</span>
                  <span className="font-medium text-foreground">{results.billableHoursPerWeek} hrs</span>
                </div>
                <div className="flex justify-between text-sm py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Revenue needed (pre-tax)</span>
                  <span className="font-medium text-foreground">${results.revenueNeeded.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm py-1.5">
                  <span className="text-muted-foreground">Gross revenue (tax-adjusted)</span>
                  <span className="font-bold text-primary">${results.taxAdjustedRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-border bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                This calculator provides estimates for planning purposes. Actual tax obligations depend on your jurisdiction, filing status, deductions, and total income. Consult a tax professional for personalized advice. Rates shown are minimums — charge more when your experience, specialization, or client&apos;s budget allows.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
