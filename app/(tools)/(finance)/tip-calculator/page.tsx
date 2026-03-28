"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Receipt, Users, Percent, DollarSign } from "lucide-react";

const quickTipPercentages = [10, 15, 18, 20, 25];

const faqs: FAQItem[] = [
  {
    question: "How much should I tip at a restaurant?",
    answer: "In the United States, the standard tip at a sit-down restaurant is 15-20% of the pre-tax bill. For excellent service, 20-25% is appropriate. For poor service, 10-15% is acceptable, though it's worth speaking with management if there were significant issues. Remember that servers often rely on tips as a significant portion of their income."
  },
  {
    question: "Should I tip on tax or before tax?",
    answer: "Traditionally, tips are calculated on the pre-tax amount of your bill. The server provided service on the food and drinks, not on the tax portion. However, calculating on the total bill (including tax) is becoming more common and results in only a slightly higher tip. Either approach is acceptable."
  },
  {
    question: "How do I split a bill fairly among friends?",
    answer: "For an even split, simply divide the total bill (including tip) by the number of people. For an uneven split where people ordered differently priced items, each person should tip on their individual portion. Some groups add 20% to the total first, then split. Always round up slightly when splitting to ensure the server receives a fair tip."
  },
  {
    question: "What's the standard tip for food delivery?",
    answer: "For food delivery, 15-20% is standard, with a minimum of $3-5 for small orders. Consider tipping more for: long distances, bad weather, large or heavy orders, apartment building deliveries, or when the driver uses stairs. Remember that delivery drivers often use their own vehicles and pay for their own gas."
  },
  {
    question: "Should I tip for takeout orders?",
    answer: "Tipping for takeout is optional but increasingly appreciated, especially since the COVID-19 pandemic. A tip of 10% or $1-2 is a nice gesture. If the restaurant prepared a large or complex order, or if they provided extra services like curbside delivery, a larger tip is appropriate."
  },
  {
    question: "How much should I tip for other services?",
    answer: "General tipping guidelines: Hair stylists: 15-20%. Taxi/Uber: 15-20%. Bartenders: $1-2 per drink or 15-20% of tab. Hotel housekeeping: $2-5 per night. Valet parking: $2-5. Spa services: 15-20%. Movers: $20-50 per person. Coffee shop: $1 or round up. Tip jars are optional but appreciated."
  },
];

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState("50");
  const [tipPercentage, setTipPercentage] = useState("18");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [customTip, setCustomTip] = useState(false);

  const results = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    const tip = parseFloat(tipPercentage) || 0;
    const people = parseInt(numberOfPeople) || 1;

    if (bill <= 0) return null;

    const tipAmount = bill * (tip / 100);
    const totalBill = bill + tipAmount;
    const tipPerPerson = tipAmount / people;
    const totalPerPerson = totalBill / people;

    return {
      tipAmount,
      totalBill,
      tipPerPerson,
      totalPerPerson,
      billPerPerson: bill / people,
    };
  }, [billAmount, tipPercentage, numberOfPeople]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const reset = () => {
    setBillAmount("50");
    setTipPercentage("18");
    setNumberOfPeople("1");
    setCustomTip(false);
  };

  return (
    <ToolLayout
      title="Tip Calculator"
      description="Quickly calculate tips for restaurants, delivery, and services. Split bills easily among friends and see exactly how much everyone owes with our free tip calculator."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Discount Calculator", href: "/discount-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Salary Calculator", href: "/salary-calculator" },
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
        { name: "Loan Calculator", href: "/loan-calculator" },
      ]}
      content={
        <>
          <h2>The Art and Etiquette of Tipping</h2>
          <p>
            Tipping is a customary practice in many countries, especially the United States, where it forms a significant part of service workers&apos; income. Understanding when and how much to tip can feel confusing, but this guide will help you navigate tipping etiquette with confidence across various situations.
          </p>

          <h2>Restaurant Tipping Guidelines</h2>
          <p>
            In the United States, restaurant servers typically earn a base wage below minimum wage with the expectation that tips will make up the difference. This system makes tipping not just a courtesy but an essential part of servers&apos; compensation.
          </p>
          
          <h3>Standard Restaurant Tips</h3>
          <ul>
            <li><strong>Poor service:</strong> 10% — Reserved for genuinely poor service, not slow kitchen times which aren&apos;t the server&apos;s fault</li>
            <li><strong>Acceptable service:</strong> 15% — The baseline for adequate service</li>
            <li><strong>Good service:</strong> 18% — The most common tip percentage for good service</li>
            <li><strong>Excellent service:</strong> 20%+ — When your server goes above and beyond</li>
            <li><strong>Exceptional service:</strong> 25%+ — For truly memorable dining experiences</li>
          </ul>

          <h3>When to Tip More</h3>
          <p>Consider increasing your tip in these situations:</p>
          <ul>
            <li>Large parties (some restaurants add automatic gratuity)</li>
            <li>Complex orders or special requests</li>
            <li>When dining with children who create extra mess</li>
            <li>During holidays when servers are working instead of celebrating</li>
            <li>If you&apos;ve occupied a table for an extended period</li>
            <li>When the server helped you with a special occasion</li>
          </ul>

          <h2>Tipping for Delivery Services</h2>
          <p>
            Food delivery has become increasingly popular, and understanding how to tip delivery drivers appropriately ensures fair compensation for their service.
          </p>
          
          <h3>Food Delivery (Uber Eats, DoorDash, etc.)</h3>
          <ul>
            <li>Standard tip: 15-20% of order total</li>
            <li>Minimum tip: $3-5 regardless of order size</li>
            <li>Add extra for: Long distances, bad weather, large orders, stairs/apartment deliveries</li>
            <li>Pre-tip vs post-tip: Pre-tipping is common on apps; consider increasing for exceptional service</li>
          </ul>

          <h3>Pizza Delivery</h3>
          <ul>
            <li>Standard: 15-20% or $3-5 minimum</li>
            <li>Large orders: $1-2 per pizza is a good baseline</li>
            <li>Remember drivers often pay their own gas and vehicle maintenance</li>
          </ul>

          <h2>Service Industry Tipping Guide</h2>
          
          <h3>Personal Care</h3>
          <ul>
            <li><strong>Hair stylist/barber:</strong> 15-20% of service cost</li>
            <li><strong>Massage therapist:</strong> 15-20%</li>
            <li><strong>Spa services:</strong> 15-20%</li>
            <li><strong>Nail technician:</strong> 15-20%</li>
            <li><strong>Tattoo artist:</strong> 15-25%</li>
          </ul>

          <h3>Transportation</h3>
          <ul>
            <li><strong>Taxi driver:</strong> 15-20% of fare</li>
            <li><strong>Uber/Lyft:</strong> 15-20% or $2-5 minimum</li>
            <li><strong>Valet parking:</strong> $2-5 when your car is returned</li>
            <li><strong>Airport shuttle driver:</strong> $2-5 per person</li>
          </ul>

          <h3>Hospitality</h3>
          <ul>
            <li><strong>Hotel housekeeping:</strong> $2-5 per night, left daily</li>
            <li><strong>Hotel bellhop:</strong> $1-2 per bag</li>
            <li><strong>Concierge:</strong> $5-20 depending on service complexity</li>
            <li><strong>Room service:</strong> 15-20% if gratuity isn&apos;t included</li>
          </ul>

          <h3>Food and Beverage</h3>
          <ul>
            <li><strong>Bartender:</strong> $1-2 per drink or 15-20% of tab</li>
            <li><strong>Barista:</strong> $1 or round up (optional but appreciated)</li>
            <li><strong>Sommelier:</strong> 10-15% of wine cost for extensive service</li>
            <li><strong>Takeout:</strong> 10% or $1-2 (optional)</li>
          </ul>

          <h2>International Tipping Practices</h2>
          <p>
            Tipping customs vary significantly around the world. What&apos;s expected in one country may be offensive in another:
          </p>
          <ul>
            <li><strong>United States:</strong> Tipping is expected (15-20%)</li>
            <li><strong>Canada:</strong> Similar to US (15-20%)</li>
            <li><strong>United Kingdom:</strong> Service charge often included; otherwise 10-15%</li>
            <li><strong>France:</strong> Service included in price; small additional tip for excellent service</li>
            <li><strong>Germany:</strong> Round up or 5-10%</li>
            <li><strong>Japan:</strong> Tipping is not customary and can be considered rude</li>
            <li><strong>Australia:</strong> Not expected but appreciated (10%)</li>
            <li><strong>China:</strong> Generally not expected; may be refused</li>
          </ul>

          <h2>Tips for Splitting Bills</h2>
          <p>
            Splitting the bill fairly can prevent awkwardness among friends:
          </p>
          <ul>
            <li><strong>Even split:</strong> Divide the total (with tip) by number of people</li>
            <li><strong>Itemized split:</strong> Each person pays for their items plus proportional tip</li>
            <li><strong>One person pays:</strong> Use Venmo/payment apps to settle up immediately</li>
            <li><strong>Round up:</strong> When splitting, round up to ensure adequate tip</li>
            <li><strong>Large groups:</strong> Check if automatic gratuity is added</li>
          </ul>

          <h2>When Not to Tip</h2>
          <p>
            While tipping is customary in many situations, there are times when it&apos;s not expected:
          </p>
          <ul>
            <li>Fast food restaurants (counter service)</li>
            <li>Self-service buffets (though you might tip the drink server)</li>
            <li>Business owners who set their own prices</li>
            <li>Countries where tipping is not customary</li>
            <li>When service charge is already included (check your bill)</li>
            <li>Government employees (may be prohibited by law)</li>
          </ul>

          <h2>Psychology of Tipping</h2>
          <p>
            Research shows that tips are influenced by more than just service quality. Factors that can increase tips include:
          </p>
          <ul>
            <li>Server introducing themselves by name</li>
            <li>Crouching to eye level when taking orders</li>
            <li>Drawing a smiley face on the check</li>
            <li>Presenting mints with the bill</li>
            <li>Repeating the order back to customers</li>
            <li>Appropriate compliments to customers</li>
          </ul>
          <p>
            Understanding these factors can help you be a more conscious tipper, focusing on the actual service received rather than being unconsciously influenced.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Bill Amount */}
        <Input
          label="Bill Amount"
          type="number"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          placeholder="50.00"
          suffix="$"
        />

        {/* Tip Percentage */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Tip Percentage
          </label>
          
          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickTipPercentages.map((percent) => (
              <button
                key={percent}
                onClick={() => {
                  setTipPercentage(String(percent));
                  setCustomTip(false);
                }}
                className={`flex-1 min-w-[60px] rounded-lg border px-4 py-3 text-center transition-all ${
                  !customTip && tipPercentage === String(percent)
                    ? "border-primary bg-primary text-white font-semibold"
                    : "border-border bg-white dark:bg-muted/30 text-foreground hover:border-primary/50"
                }`}
              >
                {percent}%
              </button>
            ))}
            <button
              onClick={() => setCustomTip(true)}
              className={`flex-1 min-w-[60px] rounded-lg border px-4 py-3 text-center transition-all ${
                customTip
                  ? "border-primary bg-primary text-white font-semibold"
                  : "border-border bg-white dark:bg-muted/30 text-foreground hover:border-primary/50"
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Tip Input */}
          {customTip && (
            <Input
              type="number"
              value={tipPercentage}
              onChange={(e) => setTipPercentage(e.target.value)}
              placeholder="Enter custom tip %"
              suffix="%"
            />
          )}
        </div>

        {/* Number of People */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Split Between
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNumberOfPeople(String(Math.max(1, parseInt(numberOfPeople) - 1)))}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-white text-xl font-bold text-foreground transition-colors hover:bg-muted dark:bg-muted/30"
              disabled={parseInt(numberOfPeople) <= 1}
            >
              −
            </button>
            <div className="flex-1">
              <Input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                min="1"
                className="text-center text-lg font-semibold"
              />
            </div>
            <button
              onClick={() => setNumberOfPeople(String(parseInt(numberOfPeople) + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-white text-xl font-bold text-foreground transition-colors hover:bg-muted dark:bg-muted/30"
            >
              +
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {parseInt(numberOfPeople) === 1 ? "person" : "people"}
          </p>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button onClick={reset} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 pt-4">
            {/* Main Result - Total */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Receipt className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Total Bill (with tip)</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(results.totalBill)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tip & Bill Breakdown */}
            <ResultsGrid columns={2}>
              <ResultCard
                label="Tip Amount"
                value={formatCurrency(results.tipAmount)}
                highlight
              />
              <ResultCard
                label="Bill Before Tip"
                value={formatCurrency(parseFloat(billAmount))}
              />
            </ResultsGrid>

            {/* Per Person Section */}
            {parseInt(numberOfPeople) > 1 && (
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Per Person ({numberOfPeople} people)
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="text-center p-4 rounded-lg bg-white dark:bg-muted/50 border border-border">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(results.totalPerPerson)}</p>
                    <p className="text-sm text-muted-foreground">Total Each</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white dark:bg-muted/50 border border-border">
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(results.billPerPerson)}</p>
                    <p className="text-sm text-muted-foreground">Bill Each</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-white dark:bg-muted/50 border border-border">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(results.tipPerPerson)}</p>
                    <p className="text-sm text-muted-foreground">Tip Each</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                Quick Tip Reference
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left font-medium text-muted-foreground">Tip %</th>
                      <th className="py-2 text-right font-medium text-muted-foreground">Tip Amount</th>
                      <th className="py-2 text-right font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[15, 18, 20, 25].map((percent) => {
                      const bill = parseFloat(billAmount) || 0;
                      const tip = bill * (percent / 100);
                      const isSelected = tipPercentage === String(percent);
                      return (
                        <tr 
                          key={percent} 
                          className={`border-b border-border/50 ${isSelected ? "bg-primary/5" : ""}`}
                        >
                          <td className={`py-2 ${isSelected ? "font-semibold text-primary" : "text-foreground"}`}>
                            {percent}%
                          </td>
                          <td className={`py-2 text-right ${isSelected ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                            {formatCurrency(tip)}
                          </td>
                          <td className={`py-2 text-right ${isSelected ? "font-semibold text-primary" : "text-foreground"}`}>
                            {formatCurrency(bill + tip)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
