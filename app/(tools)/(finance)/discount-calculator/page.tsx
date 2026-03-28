"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Tag, Calculator, RotateCcw, Plus, Trash2 } from "lucide-react";

interface DiscountItem {
  id: string;
  type: "percent" | "fixed";
  value: number;
}

const faqs: FAQItem[] = [
  {
    question: "How do I calculate a percentage discount?",
    answer: "To calculate a percentage discount, multiply the original price by the discount percentage, then divide by 100. Subtract this amount from the original price to get the final price. For example: $100 with 20% off = $100 - ($100 × 20 / 100) = $100 - $20 = $80. Our calculator does this automatically."
  },
  {
    question: "How do stacked discounts work?",
    answer: "Stacked discounts are applied sequentially, not combined. For example, if you have 20% off and then 10% off, you don't get 30% total. First, 20% is applied to the original price, then 10% is applied to the already-discounted price. This typically results in less savings than the percentages might suggest when added together."
  },
  {
    question: "What's the difference between a percentage discount and a fixed discount?",
    answer: "A percentage discount reduces the price by a proportion of the original cost (e.g., 25% off). A fixed discount reduces the price by a specific dollar amount (e.g., $10 off). Percentage discounts save more on expensive items, while fixed discounts save the same amount regardless of price."
  },
  {
    question: "How do I reverse-calculate the original price from a sale price?",
    answer: "To find the original price when you know the sale price and discount percentage: Original Price = Sale Price ÷ (1 - Discount%). For example, if a sale price is $80 with 20% off: $80 ÷ 0.80 = $100 original price. Our calculator's 'Find Original Price' mode can do this for you."
  },
  {
    question: "Are prices before discounts always accurate?",
    answer: "Not always. Some retailers inflate the 'original' price to make discounts seem larger (called 'anchor pricing'). Compare prices across multiple stores and use price history tools to ensure you're getting a genuine deal. A 50% discount on an inflated price might still cost more than the regular price elsewhere."
  },
  {
    question: "Should I always buy items on sale?",
    answer: "Discounts only save money if you would have bought the item anyway at full price. A 50% discount still costs 50% of the price—if you don't need the item, you've spent money rather than saved it. Consider whether you need the item first, then whether the sale price is genuinely good value."
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>("100");
  const [discounts, setDiscounts] = useState<DiscountItem[]>([
    { id: "1", type: "percent", value: 20 },
  ]);
  const [mode, setMode] = useState<"calculate" | "reverse">("calculate");
  const [salePrice, setSalePrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("20");
  const [quantity, setQuantity] = useState<string>("1");

  const results = useMemo(() => {
    if (mode === "reverse") {
      const sale = parseFloat(salePrice) || 0;
      const discount = parseFloat(discountPercent) || 0;
      if (sale <= 0 || discount >= 100 || discount < 0) {
        return null;
      }
      const original = sale / (1 - discount / 100);
      return {
        originalPrice: original,
        finalPrice: sale,
        totalSavings: original - sale,
        discountPercentage: discount,
      };
    }

    const price = parseFloat(originalPrice) || 0;
    const qty = parseInt(quantity) || 1;
    if (price <= 0) return null;

    let currentPrice = price;
    let totalPercentOff = 0;

    discounts.forEach((discount) => {
      if (discount.type === "percent" && discount.value > 0) {
        const reduction = currentPrice * (discount.value / 100);
        currentPrice -= reduction;
        totalPercentOff = ((price - currentPrice) / price) * 100;
      } else if (discount.type === "fixed" && discount.value > 0) {
        currentPrice = Math.max(0, currentPrice - discount.value);
        totalPercentOff = ((price - currentPrice) / price) * 100;
      }
    });

    const finalPricePerItem = Math.max(0, currentPrice);
    const savingsPerItem = price - finalPricePerItem;

    return {
      originalPrice: price,
      finalPrice: finalPricePerItem,
      totalSavings: savingsPerItem,
      discountPercentage: totalPercentOff,
      quantity: qty,
      totalForQuantity: finalPricePerItem * qty,
      totalSavingsForQuantity: savingsPerItem * qty,
    };
  }, [originalPrice, discounts, mode, salePrice, discountPercent, quantity]);

  const addDiscount = () => {
    setDiscounts([
      ...discounts,
      { id: Date.now().toString(), type: "percent", value: 10 },
    ]);
  };

  const removeDiscount = (id: string) => {
    if (discounts.length > 1) {
      setDiscounts(discounts.filter((d) => d.id !== id));
    }
  };

  const updateDiscount = (id: string, field: "type" | "value", value: string | number) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id
          ? { ...d, [field]: field === "value" ? parseFloat(value as string) || 0 : value }
          : d
      )
    );
  };

  const reset = () => {
    setOriginalPrice("100");
    setDiscounts([{ id: "1", type: "percent", value: 20 }]);
    setSalePrice("");
    setDiscountPercent("20");
    setQuantity("1");
  };

  const commonDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  return (
    <ToolLayout
      title="Discount Calculator"
      description="Calculate discounts, sale prices, and total savings instantly. Support for percentage off, fixed amount discounts, and stacking multiple discounts. Perfect for shopping, business pricing, and sales analysis."
      category={{ name: "Finance", slug: "finance-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Tip Calculator", href: "/tip-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Tax Calculator", href: "/tax-calculator" },
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Mortgage Calculator", href: "/mortgage-calculator" },
      ]}
      content={
        <>
          <h2>How to Calculate Discounts</h2>
          <p>
            Calculating discounts is a fundamental skill for smart shopping and business operations. Whether you&apos;re comparing sale prices, planning promotional offers, or just want to know how much you&apos;re saving, understanding discount math helps you make better financial decisions.
          </p>

          <h2>Discount Formulas Explained</h2>
          
          <h3>Percentage Discount Formula</h3>
          <p>
            The most common type of discount is a percentage off the original price:
          </p>
          <ul>
            <li><strong>Discount Amount</strong> = Original Price × (Discount % ÷ 100)</li>
            <li><strong>Sale Price</strong> = Original Price - Discount Amount</li>
            <li>Or simply: <strong>Sale Price</strong> = Original Price × (1 - Discount % ÷ 100)</li>
          </ul>
          <p>
            <strong>Example:</strong> A $150 item with 30% off<br />
            Discount = $150 × 0.30 = $45<br />
            Sale Price = $150 - $45 = $105
          </p>

          <h3>Fixed Amount Discount</h3>
          <p>
            Fixed discounts subtract a specific dollar amount:
          </p>
          <ul>
            <li><strong>Sale Price</strong> = Original Price - Discount Amount</li>
          </ul>
          <p>
            <strong>Example:</strong> A $50 item with $10 off<br />
            Sale Price = $50 - $10 = $40
          </p>

          <h3>Finding the Original Price</h3>
          <p>
            When you know the sale price and discount percentage:
          </p>
          <ul>
            <li><strong>Original Price</strong> = Sale Price ÷ (1 - Discount % ÷ 100)</li>
          </ul>
          <p>
            <strong>Example:</strong> A sale price of $75 after 25% off<br />
            Original = $75 ÷ 0.75 = $100
          </p>

          <h2>Understanding Stacked Discounts</h2>
          <p>
            Many stores offer multiple discounts that &quot;stack&quot; or compound. These discounts are applied sequentially, not added together. This is a crucial distinction that affects your actual savings.
          </p>

          <h3>How Stacking Works</h3>
          <p>
            Consider a $100 item with &quot;20% off plus an extra 10% off&quot;:
          </p>
          <ul>
            <li>First discount: $100 × 0.80 = $80</li>
            <li>Second discount: $80 × 0.90 = $72</li>
            <li>Total savings: $28 (not $30 as you might expect from 20% + 10%)</li>
          </ul>
          <p>
            The effective discount is 28%, not 30%, because the second percentage is applied to the already-reduced price.
          </p>

          <h3>Mathematical Formula for Stacked Percentages</h3>
          <p>
            For two percentage discounts d₁ and d₂:
          </p>
          <ul>
            <li><strong>Effective Discount</strong> = 1 - (1 - d₁) × (1 - d₂)</li>
          </ul>
          <p>
            For 20% and 10%: 1 - (0.80 × 0.90) = 1 - 0.72 = 0.28 = 28%
          </p>

          <h2>Common Discount Scenarios</h2>

          <h3>Buy One Get One (BOGO)</h3>
          <p>
            BOGO deals effectively give you 50% off when buying exactly 2 items. Variations include:
          </p>
          <ul>
            <li><strong>Buy 1 Get 1 Free:</strong> 50% off per item when buying 2</li>
            <li><strong>Buy 1 Get 1 50% Off:</strong> 25% off per item when buying 2</li>
            <li><strong>Buy 2 Get 1 Free:</strong> 33% off per item when buying 3</li>
          </ul>

          <h3>Clearance Markdowns</h3>
          <p>
            Clearance items often have multiple markdowns. A product might be reduced by 30%, then another 40% a week later, then an additional 25%. These compound to significant discounts:
          </p>
          <p>
            30% + 40% + 25% stacked = 68.5% total discount (not 95%)
          </p>

          <h3>Coupon Codes</h3>
          <p>
            Online stores may allow coupon codes that stack with sale prices. Always check if codes apply before or after existing discounts, and whether there are exclusions.
          </p>

          <h2>Smart Shopping Strategies</h2>

          <h3>Comparing Discounts</h3>
          <p>
            When choosing between offers, convert everything to the same terms:
          </p>
          <ul>
            <li>&quot;$15 off $50&quot; = 30% off (if you spend exactly $50)</li>
            <li>&quot;25% off&quot; on a $50 item = $12.50 off</li>
          </ul>
          <p>
            In this case, the $15 off coupon is better for a $50 purchase, but the 25% off is better for purchases over $60.
          </p>

          <h3>Minimum Purchase Thresholds</h3>
          <p>
            When a discount requires a minimum purchase:
          </p>
          <ul>
            <li>Calculate whether reaching the threshold actually saves money</li>
            <li>&quot;$20 off $100&quot; only makes sense if you needed to spend $80+ anyway</li>
            <li>Don&apos;t spend more just to &quot;qualify&quot; for a discount</li>
          </ul>

          <h3>Price Anchoring Awareness</h3>
          <p>
            Retailers sometimes inflate &quot;original&quot; prices to make discounts appear larger. Protect yourself by:
          </p>
          <ul>
            <li>Comparing prices across multiple retailers</li>
            <li>Using price tracking tools and browser extensions</li>
            <li>Checking if the item was ever sold at the &quot;original&quot; price</li>
            <li>Researching typical prices during non-sale periods</li>
          </ul>

          <h2>Business Applications</h2>

          <h3>Pricing Strategy</h3>
          <p>
            For business owners, discount calculations help with:
          </p>
          <ul>
            <li>Setting sale prices while maintaining profit margins</li>
            <li>Creating promotional offer structures</li>
            <li>Analyzing competitor pricing</li>
            <li>Planning seasonal markdowns</li>
          </ul>

          <h3>Margin Considerations</h3>
          <p>
            When offering discounts, ensure your margin can support it:
          </p>
          <ul>
            <li>A 20% discount on a 40% margin product leaves 20% margin</li>
            <li>A 50% discount on a 40% margin product results in a loss</li>
            <li>Factor in all costs: product, shipping, payment processing, marketing</li>
          </ul>

          <h2>Psychological Pricing</h2>
          <p>
            Understanding how discounts affect perception:
          </p>
          <ul>
            <li><strong>Odd pricing:</strong> $9.99 feels significantly less than $10</li>
            <li><strong>Anchor effect:</strong> Showing the original price makes discounts feel larger</li>
            <li><strong>Urgency:</strong> &quot;Today only&quot; or &quot;Limited time&quot; increases purchase likelihood</li>
            <li><strong>Bulk discounts:</strong> &quot;Buy more, save more&quot; encourages larger purchases</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setMode("calculate")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === "calculate"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calculator className="h-4 w-4 inline mr-2" />
            Calculate Sale Price
          </button>
          <button
            onClick={() => setMode("reverse")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === "reverse"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Find Original Price
          </button>
        </div>

        {mode === "calculate" ? (
          <>
            {/* Original Price Input */}
            <div>
              <Input
                label="Original Price ($)"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter original price"
              />
            </div>

            {/* Quantity Input */}
            <div>
              <Input
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                step="1"
                placeholder="1"
              />
            </div>

            {/* Discount List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Discounts</label>
                <button
                  onClick={addDiscount}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Discount
                </button>
              </div>

              {discounts.map((discount, index) => (
                <div key={discount.id} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <select
                      value={discount.type}
                      onChange={(e) => updateDiscount(discount.id, "type", e.target.value)}
                      className="rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="percent">Percentage Off</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <div className="relative">
                      <input
                        type="number"
                        value={discount.value || ""}
                        onChange={(e) => updateDiscount(discount.id, "value", e.target.value)}
                        min="0"
                        max={discount.type === "percent" ? "100" : undefined}
                        step={discount.type === "percent" ? "1" : "0.01"}
                        placeholder={discount.type === "percent" ? "20" : "10.00"}
                        className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 pr-10 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {discount.type === "percent" ? "%" : "$"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDiscount(discount.id)}
                    className="p-3 rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors disabled:opacity-50"
                    disabled={discounts.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Discount Buttons */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Quick Discounts</label>
              <div className="flex flex-wrap gap-2">
                {commonDiscounts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscounts([{ id: "1", type: "percent", value: d }])}
                    className="px-3 py-1.5 text-sm rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {d}% off
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Reverse Calculation */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Sale Price ($)"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter sale price"
              />
              <Input
                label="Discount Percentage (%)"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                min="0"
                max="99.99"
                step="0.01"
                placeholder="e.g., 25"
              />
            </div>
          </>
        )}

        {/* Results */}
        {results && (
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
            <ResultsGrid columns={mode === "calculate" && parseInt(quantity) > 1 ? 4 : 3}>
              {mode === "reverse" && (
                <ResultCard
                  label="Original Price"
                  value={formatCurrency(results.originalPrice)}
                  highlight
                />
              )}
              <ResultCard
                label={mode === "calculate" ? "Final Price" : "Sale Price"}
                value={formatCurrency(results.finalPrice)}
                highlight={mode === "calculate"}
              />
              <ResultCard
                label="You Save"
                value={formatCurrency(results.totalSavings)}
                subValue={`${results.discountPercentage.toFixed(1)}% off`}
              />
              {mode === "calculate" && (
                <ResultCard
                  label="Original Price"
                  value={formatCurrency(results.originalPrice)}
                />
              )}
              {mode === "calculate" && parseInt(quantity) > 1 && (
                <>
                  <ResultCard
                    label={`Total for ${results.quantity} items`}
                    value={formatCurrency(results.totalForQuantity!)}
                    highlight
                  />
                </>
              )}
            </ResultsGrid>

            {mode === "calculate" && parseInt(quantity) > 1 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total savings for {results.quantity} items:{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(results.totalSavingsForQuantity!)}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reset Button */}
        <Button onClick={reset} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Calculator
        </Button>

        {/* Discount Tips */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Smart Shopping Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Compare the final price across multiple stores, not just discount percentages
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Stacked discounts multiply (don&apos;t add)—20% + 10% off = 28% total, not 30%
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Check price history before buying—some &quot;sales&quot; inflate the original price
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Only buy discounted items you actually need—0% of $0 spent saves more
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
