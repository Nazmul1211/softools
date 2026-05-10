'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, FAQItem } from '@/components/layout/ToolLayout';
import { Input } from '@/components/ui/Input';
import { ResultCard, ResultsGrid } from '@/components/ui/ResultCard';

export default function HourlyToSalaryCalculator() {
  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');
  const [paidTimeOff, setPaidTimeOff] = useState<string>('20');
  const [overtime, setOvertime] = useState<string>('0');
  const [bonus, setBonus] = useState<string>('0');
  const [benefits, setBenefits] = useState<string>('0');

  const results = useMemo(() => {
    const hourly = parseFloat(hourlyRate) || 0;
    const weekly = parseFloat(hoursPerWeek) || 40;
    const weeks = parseFloat(weeksPerYear) || 52;
    const pto = parseFloat(paidTimeOff) || 0;
    const ot = parseFloat(overtime) || 0;
    const bon = parseFloat(bonus) || 0;
    const ben = parseFloat(benefits) || 0;

    if (hourly <= 0) return null;

    const workWeeks = weeks - pto / 5; // Convert days to weeks
    const regularHours = weekly * workWeeks;
    const regularPay = hourly * regularHours;
    const overtimePay = (hourly * 1.5) * ot;
    const grossSalary = regularPay + overtimePay + bon + ben;

    return {
      hourlyRate: hourly,
      regularPay: regularPay,
      overtimePay: overtimePay,
      bonus: bon,
      benefits: ben,
      grossSalary: grossSalary,
      weeklyGross: grossSalary / weeks,
      biweeklyGross: (grossSalary / weeks) * 2,
      monthlyGross: grossSalary / 12,
    };
  }, [hourlyRate, hoursPerWeek, weeksPerYear, paidTimeOff, overtime, bonus, benefits]);

  return (
    <ToolLayout
      title="Hourly to Salary Calculator"
      slug="hourly-to-salary-calculator"
      description="Convert your hourly wage to an annual salary. Account for full-time hours, PTO, overtime, bonuses, and benefits to get your true earning potential."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      faqs={[
        {
          question: 'What is the standard calculation from hourly to salary?',
          answer: 'The basic formula is: Hourly Rate × Hours per Week × Weeks per Year. For example, $25/hour × 40 hours × 52 weeks = $52,000/year. However, most employees don&apos;t work all 52 weeks due to paid time off, holidays, and sick days.',
        },
        {
          question: 'How many weeks should I use in the calculation?',
          answer: 'Most full-time employees work 50–52 weeks per year. If you have paid time off (PTO), subtract that from your available working weeks. For example, 20 days of PTO equals 4 weeks, so 52 – 4 = 48 working weeks.',
        },
        {
          question: 'Should I include overtime in the annual salary calculation?',
          answer: 'Only if you work overtime consistently. Overtime is typically paid at 1.5× your hourly rate. If you work 5 hours of overtime per week on average, include that for a more accurate picture of your true earnings.',
        },
        {
          question: 'How do bonuses and benefits affect my salary?',
          answer: 'Bonuses are one-time or periodic payments added to your base pay. Benefits (health insurance, 401k match, etc.) have monetary value. Include them to see your total compensation package—not just your base salary.',
        },
        {
          question: 'Is there a difference between gross and net salary?',
          answer: 'Yes. Gross salary is your total earnings before taxes and deductions (the result from this calculator). Net salary is what you actually take home after federal, state, local taxes, Social Security, Medicare, and other deductions. Use our Salary After Tax Calculator to estimate net pay.',
        },
        {
          question: 'Can I use this to negotiate a salary for a new job?',
          answer: 'Absolutely. Converting an hourly offer to an annual figure helps you compare offers and negotiate effectively. If a company offers $25/hour, you now know it&apos;s roughly $52,000/year (before taxes). Use this to compare against other job offers and market rates.',
        },
      ]}
      howToSteps={[
        {
          name: 'Enter Your Hourly Rate',
          text: 'Input the hourly wage offered or earned. For example, $18, $25, $45, etc.',
        },
        {
          name: 'Set Hours Per Week',
          text: 'Enter how many hours you work per week. Standard full-time is 40 hours, but some roles may be 35 or 50+ hours.',
        },
        {
          name: 'Add Paid Time Off',
          text: 'Include days of paid vacation, sick days, and holidays. Average is 15–25 days/year. This reduces your working weeks.',
        },
        {
          name: 'Account for Overtime & Bonuses',
          text: 'If you earn overtime hours or bonuses regularly, add them to see your full earning potential. Overtime is typically 1.5× hourly rate.',
        },
      ]}
      relatedTools={[
        { name: 'Salary After Tax Calculator', href: '/salary-after-tax-calculator/' },
        { name: 'Overtime Pay Calculator', href: '/overtime-pay-calculator/' },
        { name: 'Freelance Tax Calculator', href: '/freelance-tax-calculator/' },
      ]}
    >
      {/* 1. OVERVIEW */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What is an Hourly to Salary Calculator?</h2>
        <p className="text-gray-700 mb-4">
          An hourly to salary calculator converts an hourly wage into an annual, monthly, or weekly salary. It accounts for hours worked per week, weeks worked per year, paid time off, overtime, bonuses, and benefits to give you a complete picture of your earnings.
        </p>
        <p className="text-gray-700">
          Whether you&apos;re evaluating a new job offer, planning your finances, or comparing income across different pay structures, this tool eliminates confusion and gives you exact numbers.
        </p>
      </section>

      {/* 2. CALCULATOR SECTION */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculate Your Annual Salary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label="Hourly Rate (USD)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="25"
            min="0"
            step="0.50"
          />
          <Input
            label="Hours Per Week"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="40"
            min="0"
            step="1"
          />
          <Input
            label="Weeks Per Year"
            type="number"
            value={weeksPerYear}
            onChange={(e) => setWeeksPerYear(e.target.value)}
            placeholder="52"
            min="0"
            step="1"
          />
          <Input
            label="Paid Time Off (days)"
            type="number"
            value={paidTimeOff}
            onChange={(e) => setPaidTimeOff(e.target.value)}
            placeholder="20"
            min="0"
            step="1"
          />
          <Input
            label="Overtime Hours Per Year"
            type="number"
            value={overtime}
            onChange={(e) => setOvertime(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
          />
          <Input
            label="Annual Bonus (USD)"
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            placeholder="0"
            min="0"
            step="100"
          />
          <Input
            label="Annual Benefits Value (USD)"
            type="number"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="0"
            min="0"
            step="100"
          />
        </div>
      </section>

      {/* 3. RESULTS */}
      {results && (
        <section className="mb-8">
          <ResultsGrid>
            <ResultCard
              label="Annual Gross Salary"
              value={`$${results.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Before taxes and deductions"
            />
            <ResultCard
              label="Monthly Gross"
              value={`$${results.monthlyGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Gross amount per month"
            />
            <ResultCard
              label="Biweekly Gross"
              value={`$${results.biweeklyGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Gross amount per two weeks"
            />
            <ResultCard
              label="Weekly Gross"
              value={`$${results.weeklyGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Gross amount per week"
            />
          </ResultsGrid>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Earnings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Regular Pay (base hours)</span>
                <span className="font-semibold">${results.regularPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {results.overtimePay > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Overtime Pay (1.5×)</span>
                  <span className="font-semibold">${results.overtimePay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {results.bonus > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Annual Bonus</span>
                  <span className="font-semibold">${results.bonus.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {results.benefits > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Benefits Value</span>
                  <span className="font-semibold">${results.benefits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-800 font-bold">Total Gross Salary</span>
                <span className="font-bold text-blue-600">${results.grossSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FORMULA & EXPLANATION */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How is Annual Salary Calculated from Hourly Rate?</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Basic Formula</h3>
          <p className="text-gray-700 font-mono text-center py-3">
            Annual Salary = Hourly Rate × Hours Per Week × Weeks Per Year
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Worked Example</h3>
          <p className="text-gray-700 mb-3">
            <strong>Scenario:</strong> You earn $30/hour, work 40 hours per week, 50 weeks per year (2 weeks unpaid vacation).
          </p>
          <div className="space-y-2 text-gray-700">
            <p><code>$30 × 40 × 50 = $60,000</code></p>
            <p><strong>Result:</strong> Your annual gross salary is <strong>$60,000</strong>.</p>
          </div>
          <p className="text-gray-700 mt-4">
            If you also earn $5,000 in annual bonuses and have $3,000 in employer-paid benefits:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><code>$60,000 + $5,000 + $3,000 = $68,000 total compensation</code></p>
          </div>
        </div>
      </section>

      {/* 5. INTERPRETATION & GUIDANCE */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Interpret Your Results</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">What is Gross Salary?</h3>
            <p className="text-gray-700">
              Gross salary is your total earnings <strong>before</strong> taxes and deductions. It includes regular pay, overtime, bonuses, and the monetary value of benefits. This is the number employers use when discussing compensation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Gross vs. Net Salary</h3>
            <p className="text-gray-700 mb-3">
              <strong>Gross:</strong> Total pay before taxes. Example: $60,000
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Net:</strong> Take-home pay after federal, state, and local taxes, plus Social Security and Medicare. Typically 70–80% of gross. Example: $45,000–$48,000
            </p>
            <p className="text-gray-700">
              Use our <strong>Salary After Tax Calculator</strong> to estimate your net take-home pay based on your location and tax situation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">When to Adjust for PTO</h3>
            <p className="text-gray-700 mb-3">
              If you have 15 days of paid vacation and holidays are included in your PTO, set PTO to 15–20 days. This reduces your working weeks but maintains your salary because the time off is paid.
            </p>
            <p className="text-gray-700">
              If holidays are unpaid, add them to PTO. If they&apos;re already counted separately, don&apos;t double-count.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Comparing Job Offers</h3>
            <p className="text-gray-700">
              Use this calculator to convert hourly offers to annual salary so you can compare them side-by-side. Include benefits, bonuses, and other perks in the comparison for a true picture of total compensation.
            </p>
          </div>
        </div>
      </section>

      {/* 6. KEY FACTORS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Factors Affecting Your Hourly-to-Salary Conversion</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📅 Hours Per Week</h3>
            <p className="text-gray-700">
              Standard full-time is 40 hours/week. Some roles are 35 or 37.5 hours, while others (management, sales, tech) may be 45–50+ hours. Always clarify expected hours before accepting an offer.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🏖️ Paid Time Off</h3>
            <p className="text-gray-700">
              Average US PTO is 15–20 days/year (3–4 weeks). European companies often offer 20–30 days. Since PTO is paid, subtract it from working weeks while maintaining your salary.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">⏰ Overtime & Bonuses</h3>
            <p className="text-gray-700">
              If you consistently work overtime, your true earning potential is higher. Sales or performance-based bonuses can significantly increase annual income. Include them for accuracy.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-6 rounded">
            <h3 className="text-lg font-bold text-gray-800 mb-2">💼 Benefits Value</h3>
            <p className="text-gray-700">
              Health insurance, retirement match (401k), stock options, and paid professional development have real monetary value. Average benefits are worth 15–30% of salary. Include them for total compensation.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BENCHMARKS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Annual Salary by Hourly Rate (Full-Time, 40 hrs/week, 50 weeks/year)</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Hourly Rate</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Annual Salary</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Monthly Gross</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Career Level</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$15</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$30,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$2,500</td>
                <td className="border border-gray-300 px-4 py-2">Entry-level Retail/Service</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$20</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$40,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$3,333</td>
                <td className="border border-gray-300 px-4 py-2">Administrative/Support</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$25</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$50,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$4,167</td>
                <td className="border border-gray-300 px-4 py-2">Mid-level Professional</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$30</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$60,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$5,000</td>
                <td className="border border-gray-300 px-4 py-2">Senior Specialist</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$40</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$80,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$6,667</td>
                <td className="border border-gray-300 px-4 py-2">Manager/Specialist</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$50</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$100,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$8,333</td>
                <td className="border border-gray-300 px-4 py-2">Senior Manager/Executive</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$60</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$120,000</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$10,000</td>
                <td className="border border-gray-300 px-4 py-2">Executive/Director</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. SOURCES & REFERENCES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">References & Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>U.S. Bureau of Labor Statistics: Wage and Salary Employment Data</li>
          <li>IRS Publication 15: Employer&apos;s Tax Guide</li>
          <li>Society for Human Resource Management (SHRM): Benefits Survey Data</li>
          <li>Salary.com and Glassdoor: Market Salary Benchmarks</li>
          <li>Federal Reserve Economic Data (FRED): Employment Statistics</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
