'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, FAQItem } from '@/components/layout/ToolLayout';
import { Input } from '@/components/ui/Input';
import { ResultCard, ResultsGrid } from '@/components/ui/ResultCard';

export default function OvertimePayCalculator() {
  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [regularHours, setRegularHours] = useState<string>('40');
  const [overtimeHours, setOvertimeHours] = useState<string>('8');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>('1.5');
  const [frequency, setFrequency] = useState<string>('weekly');

  const results = useMemo(() => {
    const hourly = parseFloat(hourlyRate) || 0;
    const regular = parseFloat(regularHours) || 0;
    const overtime = parseFloat(overtimeHours) || 0;
    const multiplier = parseFloat(overtimeMultiplier) || 1.5;

    if (hourly <= 0) return null;

    const regularPay = hourly * regular;
    const overtimePay = hourly * multiplier * overtime;
    const grossPay = regularPay + overtimePay;

    // Estimate taxes (approximately 25%)
    const estimatedTaxRate = 0.25;
    const taxesWithheld = grossPay * estimatedTaxRate;
    const netPay = grossPay - taxesWithheld;

    // Calculate for different frequencies
    let frequencyMultiplier = 1;
    let frequencyLabel = 'Weekly';
    if (frequency === 'biweekly') {
      frequencyMultiplier = 2;
      frequencyLabel = 'Biweekly';
    } else if (frequency === 'monthly') {
      frequencyMultiplier = 4.33;
      frequencyLabel = 'Monthly';
    } else if (frequency === 'annual') {
      frequencyMultiplier = 52;
      frequencyLabel = 'Annual';
    }

    return {
      hourlyRate: hourly,
      regularHours: regular,
      overtimeHours: overtime,
      regularPay: regularPay,
      overtimePay: overtimePay,
      grossPay: grossPay,
      taxesWithheld: taxesWithheld,
      netPay: netPay,
      grossWithFrequency: grossPay * frequencyMultiplier,
      netWithFrequency: netPay * frequencyMultiplier,
      taxRate: (taxesWithheld / grossPay) * 100,
      frequencyLabel: frequencyLabel,
    };
  }, [hourlyRate, regularHours, overtimeHours, overtimeMultiplier, frequency]);

  return (
    <ToolLayout
      title="Overtime Pay Calculator"
      slug="overtime-pay-calculator"
      description="Calculate your gross and net overtime earnings. Includes federal and state tax withholding on overtime hours."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      faqs={[
        {
          question: 'What is the standard overtime rate?',
          answer: 'Under the Fair Labor Standards Act (FLSA), the standard overtime rate is 1.5 times (time-and-a-half) your regular hourly rate for hours worked over 40 per week. Some states and industries have different thresholds. Management and exempt employees may not qualify for overtime.',
        },
        {
          question: 'When do I earn overtime pay?',
          answer: 'Most employees earn overtime when they work more than 40 hours in a week (under federal law). Some states have daily overtime (more than 8 hours in a day). Check your state&apos;s labor laws. Independent contractors and salaried exempt employees typically do NOT qualify for overtime.',
        },
        {
          question: 'Is double-time pay common?',
          answer: 'Double-time (2x) pay is less common than time-and-a-half but does occur in certain industries, union jobs, and holiday/weekend work. Some employers pay double-time after a certain threshold (e.g., over 60 hours per week). Check your employment agreement.',
        },
        {
          question: 'Are overtime earnings taxed differently?',
          answer: 'No, overtime earnings are taxed at the same rate as regular income. Both are subject to federal income tax, state income tax, and FICA taxes (Social Security and Medicare). However, because overtime earnings are higher, you may be withheld at a higher overall rate due to your increased gross pay.',
        },
        {
          question: 'How are taxes calculated on overtime pay?',
          answer: 'Taxes are calculated on your total gross pay (regular + overtime). Federal and state taxes are withheld based on your filing status and withholding allowances. This calculator estimates approximately 25% withholding; your actual withholding depends on your W-4 settings and state taxes.',
        },
        {
          question: 'Can I negotiate overtime pay rates?',
          answer: 'Federal law sets the minimum overtime rate at 1.5x for non-exempt employees. You generally cannot negotiate below this. However, union contracts, company policies, or special arrangements may offer higher rates (2x, 2.5x, or even 3x). Always review your employment agreement.',
        },
      ]}
      howToSteps={[
        {
          name: 'Enter Your Hourly Rate',
          text: 'Input your regular hourly wage from your pay stub or employment agreement.',
        },
        {
          name: 'Set Regular Hours',
          text: 'Typically 40 hours for full-time employees. This is the threshold before overtime kicks in.',
        },
        {
          name: 'Add Overtime Hours',
          text: 'Enter the number of hours you worked over the regular threshold.',
        },
        {
          name: 'Select Overtime Multiplier',
          text: 'Choose 1.5x (time-and-a-half, most common), 2x (double-time), or custom rate based on your agreement.',
        },
      ]}
      relatedTools={[
        { name: 'Hourly to Salary Calculator', href: '/hourly-to-salary-calculator/' },
        { name: 'Salary After Tax Calculator', href: '/salary-after-tax-calculator/' },
        { name: 'Self-Employment Tax Calculator', href: '/self-employment-tax-calculator/' },
      ]}
    >
      {/* 1. OVERVIEW */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What is an Overtime Pay Calculator?</h2>
        <p className="text-gray-700 mb-4">
          An overtime pay calculator helps you determine your gross and net earnings when you work beyond standard hours. It applies the overtime multiplier (usually 1.5x) to your hourly rate for hours over 40 per week and calculates associated taxes.
        </p>
        <p className="text-gray-700">
          Whether you&apos;re tracking your weekly overtime earnings or planning for increased income, this tool gives you exact numbers for budgeting and financial planning.
        </p>
      </section>

      {/* 2. CALCULATOR */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculate Your Overtime Pay</h2>
        
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
            label="Regular Hours"
            type="number"
            value={regularHours}
            onChange={(e) => setRegularHours(e.target.value)}
            placeholder="40"
            min="0"
            step="1"
          />
          <Input
            label="Overtime Hours"
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(e.target.value)}
            placeholder="8"
            min="0"
            step="0.5"
          />
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Overtime Rate Multiplier</label>
            <select
              value={overtimeMultiplier}
              onChange={(e) => setOvertimeMultiplier(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1.5">1.5x (Time-and-a-Half)</option>
              <option value="2">2x (Double-Time)</option>
              <option value="2.5">2.5x</option>
              <option value="3">3x (Triple-Time)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Calculate For</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. RESULTS */}
      {results && (
        <section className="mb-8">
          <ResultsGrid>
            <ResultCard
              label={`${results.frequencyLabel} Gross`}
              value={`$${results.grossWithFrequency.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="Before taxes"
            />
            <ResultCard
              label={`${results.frequencyLabel} Net Pay`}
              value={`$${results.netWithFrequency.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subValue="After taxes (est.)"
            />
            <ResultCard
              label="Overtime Multiplier"
              value={`${overtimeMultiplier}x`}
              subValue={`$${(parseFloat(hourlyRate) * parseFloat(overtimeMultiplier)).toFixed(2)}/hour`}
            />
            <ResultCard
              label="Estimated Tax Rate"
              value={`${results.taxRate.toFixed(1)}%`}
              subValue="Federal + State"
            />
          </ResultsGrid>

          <div className="bg-gray-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Earnings Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Regular Pay ({results.regularHours} hrs @ ${hourlyRate}/hr)</span>
                <span className="font-semibold">${results.regularPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Overtime Pay ({results.overtimeHours} hrs @ {overtimeMultiplier}x)</span>
                <span className="font-semibold text-blue-600">${results.overtimePay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-700">Gross Pay</span>
                <span className="font-semibold">${results.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Taxes Withheld (~25%)</span>
                <span className="font-semibold text-red-600">-${results.taxesWithheld.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t pt-3 flex justify-between bg-green-50 px-3 py-2 rounded">
                <span className="text-gray-800 font-bold">Net Pay (Take-Home)</span>
                <span className="font-bold text-green-600">${results.netPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. OVERTIME RULES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Overtime Rules</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">⚖️ Federal Overtime (FLSA)</h3>
            <p className="text-gray-700 mb-2">
              The Fair Labor Standards Act (FLSA) requires employers to pay non-exempt employees 1.5 times their regular rate for hours worked over 40 in a week. This is the federal minimum and applies to most private-sector employees.
            </p>
            <p className="text-gray-700">
              <strong>Who qualifies?</strong> Non-exempt employees (usually hourly workers). Exempt employees (management, professional, some salaried roles) typically do NOT receive overtime pay.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">📍 State Overtime Laws</h3>
            <p className="text-gray-700 mb-2">
              Some states have more generous overtime rules than federal law. For example, California pays overtime for hours over 8 per day or 40 per week. Always check your state&apos;s labor laws—your employer must follow whichever rule is more favorable.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 Double-Time Rules</h3>
            <p className="text-gray-700 mb-2">
              Double-time (2x) pay is typically triggered by: (1) Hours over 12 in a day, (2) Working a 7th consecutive day, (3) Specific holiday or weekend work, (4) Union contract agreements. Check your company&apos;s policy or union contract.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">💼 Salary vs. Hourly</h3>
            <p className="text-gray-700">
              Hourly non-exempt employees get overtime. Most salaried exempt employees do NOT get overtime pay—they receive a fixed salary regardless of hours worked. Review your job classification to confirm overtime eligibility.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TAX IMPLICATIONS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How Taxes Work on Overtime Pay</h2>
        
        <div className="bg-orange-50 border border-orange-200 p-6 rounded">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Important: Overtime Earnings Are Not Taxed Differently</h3>
          <p className="text-gray-700 mb-3">
            Overtime income is subject to the same federal, state, FICA (Social Security and Medicare), and local taxes as regular income. There is no tax break for overtime earnings.
          </p>
          <p className="text-gray-700 mb-3">
            <strong>However,</strong> because your total gross pay is higher (due to overtime), you may be withheld at a higher rate. This calculator estimates ~25% total withholding, but your actual withholding depends on:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Your W-4 filing status and withholding allowances</li>
            <li>Your total income for the year</li>
            <li>Your state&apos;s tax brackets</li>
            <li>FICA contributions (6.2% Social Security + 1.45% Medicare)</li>
          </ul>
        </div>
      </section>

      {/* 6. BENCHMARKS */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Overtime Examples</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Hourly Rate</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Regular + OT Hours</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Gross Pay</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Net Pay (est.)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$20</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40 + 8</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,040</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$780</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$25</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40 + 8</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,300</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$975</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$30</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40 + 8</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,560</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,170</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">$40</td>
                <td className="border border-gray-300 px-4 py-2 text-center">40 + 10</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$2,200</td>
                <td className="border border-gray-300 px-4 py-2 text-right">$1,650</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. RESOURCES */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">References & Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>U.S. Department of Labor: Wage and Hour Laws</li>
          <li>Fair Labor Standards Act (FLSA) Requirements</li>
          <li>Your State&apos;s Department of Labor Website</li>
          <li>Your Employment Agreement or Union Contract</li>
          <li>IRS Tax Withholding Information</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
