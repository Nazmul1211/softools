"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { TrendingUp, ShoppingCart, Percent, DollarSign } from "lucide-react";

interface AffiliateMetrics {
  monthlyRevenue: number;
  epc: number;
  annualRevenue: number;
  salesNeeded: number;
}

const faqs: FAQItem[] = [
  {
    question: "What is affiliate marketing commission?",
    answer:
      "Affiliate marketing allows you to earn commission by promoting others&apos; products. When someone clicks your affiliate link and makes a purchase, you earn a percentage (typically 5-50% depending on product and program). EPC (Earnings Per Click) measures your average earnings from each visitor sent.",
  },
  {
    question: "What are typical affiliate commission rates?",
    answer:
      "Rates vary by industry: SaaS/software (20-50% recurring), physical products (5-15%), digital products (30-50%), Amazon Associates (0.5-10%), travel (5-10%), finance/insurance (5-30%), and high-ticket B2B ($100-$5,000+ per sale). Higher-ticket items typically have lower percentages but higher dollar amounts.",
  },
  {
    question: "What is EPC and why does it matter?",
    answer:
      "EPC (Earnings Per Click) = Total Earnings ÷ Total Clicks. If you earn $100 from 1,000 clicks, your EPC is $0.10. This metric helps you compare programs and content effectiveness. Focus on programs and content with the highest EPC, not just volume of traffic.",
  },
  {
    question: "How do I increase my affiliate earnings?",
    answer:
      "Grow traffic to your affiliate links through content marketing, SEO, YouTube, social media, and email marketing. Improve conversion rate by promoting relevant products, writing honest reviews, and using strong CTAs. Choose high-EPC programs (recurring SaaS over low-commission retail). Test and optimize.",
  },
  {
    question: "What&apos;s a good conversion rate for affiliate marketing?",
    answer:
      "Conversion rates vary by industry: 1-3% is average for most niches, 3-5% is very good, and 5%+ is excellent. SaaS affiliate links average 2-4% conversion. E-commerce: 1-2%. High-ticket B2B: 0.5-2%. Focus on quality traffic from a relevant audience, not just volume.",
  },
  {
    question: "Is affiliate marketing scalable?",
    answer:
      "Yes. Once you create content (blog posts, videos, guides) that ranks in search, it generates passive traffic for months/years. Evergreen content compounds. Focus on high-EPC, recurring commission products (SaaS). Build an email list to increase conversion rates. Affiliate income can reach $5,000-$100,000+ monthly at scale.",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AffiliateCommissionCalculatorPage() {
  const [monthlyTraffic, setMonthlyTraffic] = useState("10000");
  const [conversionRate, setConversionRate] = useState("2.5");
  const [productPrice, setProductPrice] = useState("100");
  const [commissionPercent, setCommissionPercent] = useState("30");

  const result = useMemo<AffiliateMetrics | null>(() => {
    const traffic = Number.parseFloat(monthlyTraffic);
    const conversion = Number.parseFloat(conversionRate) / 100;
    const price = Number.parseFloat(productPrice);
    const commission = Number.parseFloat(commissionPercent) / 100;

    if (
      !Number.isFinite(traffic) ||
      !Number.isFinite(conversion) ||
      !Number.isFinite(price) ||
      !Number.isFinite(commission) ||
      traffic <= 0 ||
      conversion < 0 ||
      price <= 0 ||
      commission < 0
    ) {
      return null;
    }

    const sales = traffic * conversion;
    const monthlyEarnings = sales * price * commission;
    const epcValue = monthlyEarnings / traffic;
    const annualEarnings = monthlyEarnings * 12;
    const salesForGoal = 100 / (price * commission);

    return {
      monthlyRevenue: monthlyEarnings,
      epc: epcValue,
      annualRevenue: annualEarnings,
      salesNeeded: salesForGoal,
    };
  }, [monthlyTraffic, conversionRate, productPrice, commissionPercent]);

  return (
    <ToolLayout
      title="Affiliate Commission Calculator"
      slug="affiliate-commission-calculator"
      description="Calculate your affiliate marketing earnings from traffic, conversion rate, and commission percentage. Estimate monthly and annual revenue."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your monthly traffic",
          text: "Use analytics to find how many people click your affiliate links monthly.",
        },
        {
          name: "Set conversion rate",
          text: "Estimate what % of clicks result in purchases (typically 1-5%).",
        },
        {
          name: "Enter product price",
          text: "Input the price of the product or service you&apos;re promoting.",
        },
        {
          name: "See commission earnings",
          text: "View monthly, annual, and per-click earnings (EPC).",
        },
      ]}
      relatedTools={[
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "TikTok Money Calculator", href: "/tiktok-money-calculator/" },
        { name: "Sponsorship Rate Calculator", href: "/sponsorship-rate-calculator/" },
        { name: "Instagram Engagement Calculator", href: "/instagram-engagement-rate-calculator/" },
      ]}
      content={
        <>
          <h2>What is affiliate marketing and how does commission work?</h2>
          <p>
            Affiliate marketing is a performance-based income model where you earn commission by promoting others&apos; products or
            services. When a customer clicks your unique affiliate link and makes a purchase, you earn a percentage of the sale price.
            Unlike CPM or sponsorships (fixed payments), affiliate income is purely commission-based and scales with sales.
          </p>

          <h2>Affiliate commission formula</h2>
          <p>
            <strong>Monthly Revenue = (Traffic × Conversion Rate) × Product Price × Commission %</strong>
          </p>
          <p>
            <strong>EPC = Monthly Revenue ÷ Monthly Clicks (or Traffic)</strong>
          </p>
          <p>
            Example: 10,000 visitors, 2% conversion (200 sales), $100 product, 30% commission = (200 × $100 × 0.30) = $6,000/month.
            EPC = $6,000 ÷ 10,000 = $0.60 per click.
          </p>

          <h2>Affiliate commission rates by industry</h2>
          <table>
            <thead>
              <tr>
                <th>Industry</th>
                <th>Typical Commission</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SaaS / Software</td>
                <td>20-50%</td>
                <td>Often recurring monthly. Highest lifetime value.</td>
              </tr>
              <tr>
                <td>Digital Products</td>
                <td>30-70%</td>
                <td>E-books, courses, software. No inventory costs.</td>
              </tr>
              <tr>
                <td>High-Ticket B2B</td>
                <td>15-30%</td>
                <td>Expensive products ($1K+). Fewer but larger sales.</td>
              </tr>
              <tr>
                <td>Finance / Investing</td>
                <td>5-30%</td>
                <td>Brokers pay $100-$500+ per signup; low % on products.</td>
              </tr>
              <tr>
                <td>E-Commerce / Retail</td>
                <td>5-15%</td>
                <td>Amazon: 0.5-10%. Lower %s due to high volume.</td>
              </tr>
              <tr>
                <td>Travel / Hotels</td>
                <td>5-15%</td>
                <td>Booking.com: 1-5%. Lower margins, seasonal spikes.</td>
              </tr>
              <tr>
                <td>Insurance / Loans</td>
                <td>5-50%</td>
                <td>High-value leads. Depends on product type.</td>
              </tr>
            </tbody>
          </table>

          <h2>What is EPC and how to use it?</h2>
          <p>
            <strong>EPC (Earnings Per Click)</strong> tells you how much money you make from each visitor. If you have 1,000 clicks and
            earn $50, your EPC is $0.05. This metric helps you compare affiliate programs and decide where to invest your promotion effort.
          </p>
          <ul>
            <li><strong>Low EPC (&lt;$0.01):</strong> Amazon Associates, low-commission products. High volume needed.</li>
            <li><strong>Medium EPC ($0.01-$0.10):</strong> Most e-commerce and digital products. Decent for mid-size traffic.</li>
            <li><strong>High EPC ($0.10-$1+):</strong> SaaS, high-ticket B2B, finance. Best ROI on promotion spend.</li>
          </ul>

          <h2>Factors that affect affiliate conversion rates</h2>
          <ul>
            <li><strong>Niche match:</strong> Traffic relevant to product converts 3-5x better than generic traffic.</li>
            <li><strong>Trust and authority:</strong> Your credibility drives conversions. Reviews, data, and testimonials help.</li>
            <li><strong>Traffic quality:</strong> Organic search traffic converts 2-3x better than paid ads or social referrals.</li>
            <li><strong>Promotion method:</strong> Email lists convert at 3-5%. Blog posts: 1-2%. YouTube: 1-3%. Social media: &lt;1%.</li>
            <li><strong>Product price:</strong> Lower price products (under $50) convert 2-3x better than high-ticket items.</li>
            <li><strong>Seasonality:</strong> B2B products spike Q4. E-commerce: Nov-Dec peak, Jan-Feb slump.</li>
          </ul>

          <h2>How to build a profitable affiliate business</h2>
          <ul>
            <li><strong>Choose high-EPC programs:</strong> SaaS affiliate programs ($100-$500+ per sale) beat low-commission retail.</li>
            <li><strong>Build owned audiences:</strong> Email lists (10K subscribers = $1,000-$5,000/month from affiliate links).</li>
            <li><strong>Create content at scale:</strong> Blog posts, YouTube videos, guides that rank for years and compound.</li>
            <li><strong>Promote strategically:</strong> Honest reviews and comparisons convert better than hard-sell tactics.</li>
            <li><strong>Test and optimize:</strong> A/B test CTAs, product positioning, and landing pages to improve conversion.</li>
            <li><strong>Diversify programs:</strong> Mix of SaaS (recurring), digital products (higher %), and e-commerce (volume).</li>
            <li><strong>Track metrics obsessively:</strong> Monitor traffic, conversion, EPC, and revenue by program and content.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>Affiliate industry benchmarks from Awin and CPA networks.</li>
            <li>SaaS affiliate program directories and commission data.</li>
            <li>Conversion rate optimization research from ConvertKit and Unbounce.</li>
            <li>Creator economy affiliate marketing data from Influencer Marketing Hub.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, title: "Traffic Based", sub: "Monthly clicks" },
            { icon: Percent, title: "Conversion Math", sub: "Click to sale %" },
            { icon: ShoppingCart, title: "Revenue Per Sale", sub: "Commission earned" },
            { icon: DollarSign, title: "EPC", sub: "Earnings per click" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Input
            label="Monthly Traffic (clicks)"
            type="number"
            inputMode="numeric"
            min={1}
            value={monthlyTraffic}
            onChange={(e) => setMonthlyTraffic(e.target.value)}
            suffix="clicks"
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Product & Commission</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Product Price"
                type="number"
                inputMode="decimal"
                min={0.01}
                step="10"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                suffix="$"
              />
              <Input
                label="Commission Rate"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="1"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(e.target.value)}
                suffix="%"
              />
            </div>
          </div>

          <Input
            label="Conversion Rate"
            type="number"
            inputMode="decimal"
            min={0.01}
            max={100}
            step="0.1"
            value={conversionRate}
            onChange={(e) => setConversionRate(e.target.value)}
            suffix="%"
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Monthly Revenue"
                value={formatCurrency(result.monthlyRevenue)}
                highlight
              />
              <ResultCard
                label="Earnings Per Click (EPC)"
                value={formatCurrency(result.epc)}
              />
              <ResultCard
                label="Annual Revenue"
                value={formatCurrency(result.annualRevenue)}
              />
              <ResultCard
                label="Sales for $100/mo revenue"
                value={Math.ceil(result.salesNeeded).toString()}
                unit="sales"
              />
            </ResultsGrid>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              With {Number.parseFloat(conversionRate).toFixed(1)}% conversion and ${Number.parseFloat(productPrice).toFixed(2)} product
              price, you earn <strong>{formatCurrency(result.epc)} EPC</strong>. Annual projection: {formatCurrency(result.annualRevenue)}.
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate affiliate earnings.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
