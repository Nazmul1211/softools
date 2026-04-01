"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Calculator,
  DollarSign,
  Percent,
  Receipt,
  ShoppingCart,
  ArrowRight,
  BarChart3,
  MapPin,
} from "lucide-react";

interface SalesTaxResult {
  preTaxPrice: number;
  taxAmount: number;
  totalPrice: number;
  taxRate: number;
  effectiveRate: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// US State tax rates (as of 2024)
const STATE_TAX_RATES: { [key: string]: { state: number; avgLocal: number; combined: number } } = {
  "AL": { state: 4.00, avgLocal: 5.24, combined: 9.24 },
  "AK": { state: 0.00, avgLocal: 1.76, combined: 1.76 },
  "AZ": { state: 5.60, avgLocal: 2.80, combined: 8.40 },
  "AR": { state: 6.50, avgLocal: 2.97, combined: 9.47 },
  "CA": { state: 7.25, avgLocal: 1.57, combined: 8.82 },
  "CO": { state: 2.90, avgLocal: 4.87, combined: 7.77 },
  "CT": { state: 6.35, avgLocal: 0.00, combined: 6.35 },
  "DE": { state: 0.00, avgLocal: 0.00, combined: 0.00 },
  "FL": { state: 6.00, avgLocal: 1.02, combined: 7.02 },
  "GA": { state: 4.00, avgLocal: 3.38, combined: 7.38 },
  "HI": { state: 4.00, avgLocal: 0.50, combined: 4.50 },
  "ID": { state: 6.00, avgLocal: 0.02, combined: 6.02 },
  "IL": { state: 6.25, avgLocal: 2.57, combined: 8.82 },
  "IN": { state: 7.00, avgLocal: 0.00, combined: 7.00 },
  "IA": { state: 6.00, avgLocal: 0.94, combined: 6.94 },
  "KS": { state: 6.50, avgLocal: 2.19, combined: 8.69 },
  "KY": { state: 6.00, avgLocal: 0.00, combined: 6.00 },
  "LA": { state: 4.45, avgLocal: 5.07, combined: 9.52 },
  "ME": { state: 5.50, avgLocal: 0.00, combined: 5.50 },
  "MD": { state: 6.00, avgLocal: 0.00, combined: 6.00 },
  "MA": { state: 6.25, avgLocal: 0.00, combined: 6.25 },
  "MI": { state: 6.00, avgLocal: 0.00, combined: 6.00 },
  "MN": { state: 6.875, avgLocal: 0.60, combined: 7.475 },
  "MS": { state: 7.00, avgLocal: 0.07, combined: 7.07 },
  "MO": { state: 4.225, avgLocal: 4.06, combined: 8.285 },
  "MT": { state: 0.00, avgLocal: 0.00, combined: 0.00 },
  "NE": { state: 5.50, avgLocal: 1.44, combined: 6.94 },
  "NV": { state: 6.85, avgLocal: 1.38, combined: 8.23 },
  "NH": { state: 0.00, avgLocal: 0.00, combined: 0.00 },
  "NJ": { state: 6.625, avgLocal: 0.00, combined: 6.625 },
  "NM": { state: 5.125, avgLocal: 2.69, combined: 7.815 },
  "NY": { state: 4.00, avgLocal: 4.52, combined: 8.52 },
  "NC": { state: 4.75, avgLocal: 2.25, combined: 7.00 },
  "ND": { state: 5.00, avgLocal: 2.04, combined: 7.04 },
  "OH": { state: 5.75, avgLocal: 1.49, combined: 7.24 },
  "OK": { state: 4.50, avgLocal: 4.47, combined: 8.97 },
  "OR": { state: 0.00, avgLocal: 0.00, combined: 0.00 },
  "PA": { state: 6.00, avgLocal: 0.34, combined: 6.34 },
  "RI": { state: 7.00, avgLocal: 0.00, combined: 7.00 },
  "SC": { state: 6.00, avgLocal: 1.46, combined: 7.46 },
  "SD": { state: 4.50, avgLocal: 1.90, combined: 6.40 },
  "TN": { state: 7.00, avgLocal: 2.55, combined: 9.55 },
  "TX": { state: 6.25, avgLocal: 1.94, combined: 8.19 },
  "UT": { state: 6.10, avgLocal: 1.09, combined: 7.19 },
  "VT": { state: 6.00, avgLocal: 0.24, combined: 6.24 },
  "VA": { state: 5.30, avgLocal: 0.45, combined: 5.75 },
  "WA": { state: 6.50, avgLocal: 2.73, combined: 9.23 },
  "WV": { state: 6.00, avgLocal: 0.52, combined: 6.52 },
  "WI": { state: 5.00, avgLocal: 0.44, combined: 5.44 },
  "WY": { state: 4.00, avgLocal: 1.36, combined: 5.36 },
  "DC": { state: 6.00, avgLocal: 0.00, combined: 6.00 },
};

const STATE_NAMES: { [key: string]: string } = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
  "DC": "Washington D.C.",
};

type CalculationMode = "add-tax" | "reverse-tax";

export default function SalesTaxCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("add-tax");
  const [price, setPrice] = useState(100);
  const [taxRate, setTaxRate] = useState(8.25);
  const [selectedState, setSelectedState] = useState("");

  const result = useMemo((): SalesTaxResult => {
    if (mode === "add-tax") {
      const taxAmount = price * (taxRate / 100);
      return {
        preTaxPrice: price,
        taxAmount,
        totalPrice: price + taxAmount,
        taxRate,
        effectiveRate: taxRate,
      };
    } else {
      // Reverse calculation: price includes tax
      const preTaxPrice = price / (1 + taxRate / 100);
      const taxAmount = price - preTaxPrice;
      return {
        preTaxPrice,
        taxAmount,
        totalPrice: price,
        taxRate,
        effectiveRate: taxRate,
      };
    }
  }, [mode, price, taxRate]);

  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode);
    if (stateCode && STATE_TAX_RATES[stateCode]) {
      setTaxRate(STATE_TAX_RATES[stateCode].combined);
    }
  };

  return (
    <ToolLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax instantly for any purchase. Add tax to a price or reverse-calculate to find the pre-tax amount. Includes US state tax rates for quick reference."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Tip Calculator", href: "/tip-calculator/" },
        { name: "Discount Calculator", href: "/discount-calculator/" },
        { name: "Percentage Calculator", href: "/percentage-calculator/" },
        { name: "Markup Calculator", href: "/markup-calculator/" },
      ]}
      howToSteps={[
        { name: "Choose Mode", text: "Select whether to add tax to a price or calculate pre-tax from total." },
        { name: "Enter Price", text: "Input the price amount you want to calculate tax for." },
        { name: "Set Tax Rate", text: "Enter your tax rate manually or select a US state for automatic rates." },
        { name: "View Results", text: "See the tax amount, pre-tax price, and total instantly." },
      ]}
      faqs={[
        {
          question: "Which US states have no sales tax?",
          answer: "Five states have no state sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, Alaska allows local sales taxes, so some areas still have sales tax. Delaware, Montana, New Hampshire, and Oregon have no sales tax at any level.",
        },
        {
          question: "Why do sales tax rates vary so much?",
          answer: "Sales tax rates vary because they combine state, county, and city taxes. States set their base rate, but local governments can add their own taxes. This is why total rates can differ between cities in the same state. Always check local rates for accuracy.",
        },
        {
          question: "Is sales tax calculated on the original price or discounted price?",
          answer: "Sales tax is calculated on the actual amount paid after discounts and coupons are applied. If an item is $100 with a 20% discount, you pay tax on $80, not $100. However, manufacturer rebates are taxed differently—tax is usually on the pre-rebate price.",
        },
        {
          question: "How do I calculate the pre-tax price from a total?",
          answer: "To find the pre-tax price, divide the total by (1 + tax rate as decimal). For example, if total is $108 with 8% tax: $108 ÷ 1.08 = $100 pre-tax. Our reverse calculation mode does this automatically.",
        },
      ]}
      content={
        <>
          <h2>Understanding Sales Tax</h2>
          <p>
            Sales tax is a consumption tax imposed by governments on the sale of goods and services. In the United States, sales tax is primarily a state and local tax, with rates varying significantly by location. Unlike VAT (Value Added Tax) used in many other countries, US sales tax is added at the point of sale and displayed separately from the listed price.
          </p>
          <p>
            Sales tax rates can range from 0% in states like Oregon and Delaware to over 10% in some cities when combining state and local taxes. Louisiana has the highest combined rate, averaging around 9.55%, while states like New Hampshire have no sales tax at all.
          </p>

          <h2>How Sales Tax is Calculated</h2>
          <p>
            The basic formula for sales tax is simple: <strong>Tax Amount = Price × Tax Rate</strong>. If you're buying a $50 item in a location with 8% sales tax, the tax is $50 × 0.08 = $4, making your total $54. Most point-of-sale systems calculate this automatically.
          </p>
          <p>
            For reverse calculations (finding the pre-tax price from a total), divide by (1 + rate): <strong>Pre-Tax Price = Total ÷ (1 + Tax Rate)</strong>. If your receipt shows $54 total with 8% tax, the original price was $54 ÷ 1.08 = $50.
          </p>

          <h2>Tax-Exempt Items</h2>
          <p>
            Many states exempt certain items from sales tax, typically including:
          </p>
          <ul>
            <li><strong>Groceries:</strong> Most states exempt or reduce tax on unprepared food</li>
            <li><strong>Prescription medications:</strong> Generally exempt in all states</li>
            <li><strong>Clothing:</strong> Some states (like PA, NJ) exempt clothing under certain amounts</li>
            <li><strong>Medical equipment:</strong> Often exempt for prescribed items</li>
          </ul>
          <p>
            Rules vary significantly by state, so check local regulations for specific exemptions in your area.
          </p>

          <h2>Online Shopping and Sales Tax</h2>
          <p>
            Since the 2018 Supreme Court ruling in South Dakota v. Wayfair, online retailers must collect sales tax in states where they have "economic nexus" (significant sales). This means most major online purchases now include sales tax based on the shipping destination, not the seller's location.
          </p>
          <p>
            If a retailer doesn't collect tax, buyers in most states are technically required to report and pay "use tax" on their state tax return—though compliance varies widely. Business purchases are more closely tracked for use tax purposes.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Receipt className="h-5 w-5 text-primary" />
            Sales Tax Calculator
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Calculation Mode
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => setMode("add-tax")}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  mode === "add-tax"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <div className="font-semibold">Add Tax to Price</div>
                <div className="text-xs opacity-80">Enter pre-tax price → Get total with tax</div>
              </button>
              <button
                onClick={() => setMode("reverse-tax")}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  mode === "reverse-tax"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <div className="font-semibold">Reverse Calculate</div>
                <div className="text-xs opacity-80">Enter total with tax → Get pre-tax price</div>
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {mode === "add-tax" ? "Pre-Tax Price" : "Total (with tax)"}
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Percent className="h-4 w-4" />
                Tax Rate (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                step={0.01}
                value={taxRate}
                onChange={(e) => {
                  setTaxRate(Number(e.target.value));
                  setSelectedState("");
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Quick: US State Rate
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateSelect(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select state...</option>
                {Object.entries(STATE_NAMES).sort((a, b) => a[1].localeCompare(b[1])).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({STATE_TAX_RATES[code].combined}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-2 flex justify-center">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">Pre-Tax Price</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(result.preTaxPrice)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Receipt className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground">Tax Amount ({taxRate}%)</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(result.taxAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(result.totalPrice)}
            </p>
          </div>
        </div>

        {/* Visual Flow */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            Calculation Breakdown
          </h3>

          <div className="flex items-center justify-center gap-4 py-4 flex-wrap">
            <div className="text-center min-w-[100px]">
              <p className="text-sm text-muted-foreground mb-1">Pre-Tax</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.preTaxPrice)}
              </p>
            </div>
            <div className="text-muted-foreground">+</div>
            <div className="text-center min-w-[100px]">
              <p className="text-sm text-muted-foreground mb-1">Tax ({taxRate}%)</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(result.taxAmount)}
              </p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="text-center min-w-[100px]">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(result.totalPrice)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              {mode === "add-tax" ? (
                <>
                  {formatCurrency(result.preTaxPrice)} + {taxRate}% tax = <strong className="text-foreground">{formatCurrency(result.totalPrice)}</strong>
                </>
              ) : (
                <>
                  {formatCurrency(result.totalPrice)} total includes <strong className="text-amber-600 dark:text-amber-400">{formatCurrency(result.taxAmount)}</strong> tax on a <strong className="text-blue-600 dark:text-blue-400">{formatCurrency(result.preTaxPrice)}</strong> pre-tax price
                </>
              )}
            </p>
          </div>
        </div>

        {/* State Tax Reference */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            US State Sales Tax Rates (2024)
          </h3>
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 font-medium text-muted-foreground">State</th>
                  <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">State Rate</th>
                  <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">Avg. Local</th>
                  <th className="pb-2 text-right font-medium text-muted-foreground">Combined</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(STATE_TAX_RATES)
                  .sort((a, b) => STATE_NAMES[a[0]].localeCompare(STATE_NAMES[b[0]]))
                  .map(([code, rates]) => (
                    <tr 
                      key={code} 
                      className={`border-b border-border/50 cursor-pointer hover:bg-muted/50 ${
                        selectedState === code ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleStateSelect(code)}
                    >
                      <td className="py-2 pr-4 text-foreground">{STATE_NAMES[code]}</td>
                      <td className="py-2 pr-4 text-right text-muted-foreground">{rates.state}%</td>
                      <td className="py-2 pr-4 text-right text-muted-foreground">{rates.avgLocal}%</td>
                      <td className="py-2 text-right font-medium text-foreground">{rates.combined}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            * Rates shown are averages. Actual rates may vary by city/county. Click a state to use its rate.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
