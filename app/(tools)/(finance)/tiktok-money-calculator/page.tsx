"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Music, Gift, DollarSign, Zap } from "lucide-react";

interface TikTokEarningsResult {
  creatorFundMonthly: number;
  brandDealRevenue: number;
  livestreamRevenue: number;
  totalMonthly: number;
}

const faqs: FAQItem[] = [
  {
    question: "How does the TikTok Creator Fund pay creators?",
    answer:
      "The Creator Fund pays based on video views and engagement. Rates vary from $0.02-$0.04 per 1,000 views on average. To be eligible, you need 10,000 followers, 100,000 video views in 30 days, and must be 18+. Payment depends on geography, content quality, and audience engagement.",
  },
  {
    question: "What are typical TikTok brand deal rates?",
    answer:
      "Brand deal rates vary significantly: micro-creators (10K-100K followers) earn $200-$1,000 per video, mid-tier (100K-1M) earn $1,000-$5,000, and mega-creators (1M+) earn $5,000-$50,000+. Rates depend on niche, engagement rate, and creator experience. Niches like finance, fitness, and beauty command premium rates.",
  },
  {
    question: "Can I make money on TikTok without the Creator Fund?",
    answer:
      "Yes! Most successful TikTok creators earn more from brand deals, affiliate marketing, and livestream gifts than the Creator Fund. Livestream gifts give you 50% of revenue. Affiliate links through TikTok Shop or external programs can generate significant income. Focus on building audience first, income follows.",
  },
  {
    question: "How do livestream gifts work?",
    answer:
      "Viewers purchase coins and send gifts during your livestream. You receive 50% of the gift value in diamonds (redeemable for cash). Viewers typically spend $0.50-$2 per gift. Top creators can earn hundreds per livestream. Build engagement first, then schedule regular streams to maximize gift income.",
  },
  {
    question: "What affects Creator Fund earnings?",
    answer:
      "Key factors: total video views, engagement rate, viewer location (US/UK higher), content type (non-controversial pays more), video completion rate, and account maturity. Controversial content, low watch time, and inactive accounts reduce earnings. Quality engagement matters more than raw views.",
  },
  {
    question: "Is this calculator accurate?",
    answer:
      "This provides rough estimates based on average Creator Fund and brand deal rates. Actual earnings vary significantly by geography, niche, engagement, and season. TikTok analytics shows your true earnings. Use this calculator to set realistic expectations and compare income scenarios.",
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

export default function TikTokMoneyCalculatorPage() {
  const [monthlyViews, setMonthlyViews] = useState("500000");
  const [followers, setFollowers] = useState("100000");
  const [brandDealRate, setBrandDealRate] = useState("2000");
  const [brandsPerMonth, setBrandsPerMonth] = useState("2");
  const [livestreamDays, setLivestreamDays] = useState("8");
  const [giftValuePerStream, setGiftValuePerStream] = useState("500");

  const result = useMemo<TikTokEarningsResult | null>(() => {
    const views = Number.parseFloat(monthlyViews);
    const followerCount = Number.parseFloat(followers);
    const rate = Number.parseFloat(brandDealRate);
    const brands = Number.parseFloat(brandsPerMonth);
    const streams = Number.parseFloat(livestreamDays);
    const giftValue = Number.parseFloat(giftValuePerStream);

    if (
      !Number.isFinite(views) ||
      !Number.isFinite(followerCount) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(brands) ||
      !Number.isFinite(streams) ||
      !Number.isFinite(giftValue) ||
      views <= 0 ||
      rate < 0 ||
      brands < 0 ||
      streams < 0 ||
      giftValue < 0
    ) {
      return null;
    }

    const creatorFund = (views / 1000) * 0.025;
    const brandDeals = rate * brands;
    const livestream = giftValue * streams * 0.5;
    const total = creatorFund + brandDeals + livestream;

    return {
      creatorFundMonthly: creatorFund,
      brandDealRevenue: brandDeals,
      livestreamRevenue: livestream,
      totalMonthly: total,
    };
  }, [monthlyViews, followers, brandDealRate, brandsPerMonth, livestreamDays, giftValuePerStream]);

  return (
    <ToolLayout
      title="TikTok Money Calculator"
      slug="tiktok-money-calculator"
      description="Calculate TikTok earnings from Creator Fund, brand deals, and livestream gifts. Estimate monthly revenue based on views and engagement."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your monthly views",
          text: "Use TikTok Analytics to find your 30-day video view count.",
        },
        {
          name: "Set brand deal parameters",
          text: "Estimate your brand deal rate and deals per month (or $0 if not doing deals).",
        },
        {
          name: "Add livestream income",
          text: "Enter livestream frequency (days per month) and average gift value per stream.",
        },
        {
          name: "See total earnings",
          text: "View Creator Fund, brand, and livestream revenue combined.",
        },
      ]}
      relatedTools={[
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "Instagram Engagement Calculator", href: "/instagram-engagement-rate-calculator/" },
        { name: "Sponsorship Rate Calculator", href: "/sponsorship-rate-calculator/" },
        { name: "Affiliate Commission Calculator", href: "/affiliate-commission-calculator/" },
      ]}
      content={
        <>
          <h2>How do TikTok creators make money?</h2>
          <p>
            TikTok creators have multiple revenue streams: Creator Fund (direct payment per views), brand sponsorships
            (negotiated deals), livestream gifts (50% split with TikTok), and affiliate programs. Most successful creators
            earn significantly more from brand deals than the Creator Fund alone.
          </p>

          <h2>Creator Fund earnings calculation</h2>
          <p>
            <strong>Creator Fund Monthly = (Monthly Views / 1,000) × $0.02-$0.04</strong>
          </p>
          <p>
            The Creator Fund averages $0.025 per 1,000 views ($25 per million views). This varies by region, with US/UK
            slightly higher. Requirements: 10K followers, 100K views in 30 days, 18+ years old.
          </p>

          <h2>TikTok earnings by creator tier</h2>
          <table>
            <thead>
              <tr>
                <th>Creator Level</th>
                <th>Followers</th>
                <th>Brand Deal Range</th>
                <th>Creator Fund</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Micro</td>
                <td>10K–100K</td>
                <td>$200–$1,000</td>
                <td>$100–$500</td>
              </tr>
              <tr>
                <td>Mid-Tier</td>
                <td>100K–1M</td>
                <td>$1,000–$5,000</td>
                <td>$500–$2,500</td>
              </tr>
              <tr>
                <td>Macro</td>
                <td>1M–10M</td>
                <td>$5,000–$20,000</td>
                <td>$2,500–$15,000</td>
              </tr>
              <tr>
                <td>Mega</td>
                <td>10M+</td>
                <td>$20,000+</td>
                <td>$15,000+</td>
              </tr>
            </tbody>
          </table>

          <h2>Revenue breakdown: Creator Fund vs brand deals</h2>
          <ul>
            <li><strong>Creator Fund:</strong> Consistent but modest ($500-$2,000/month for 1M creators). Base income.</li>
            <li><strong>Brand Deals:</strong> Variable but higher ($2,000-$10,000+ per deal). Scales with followers and niche.</li>
            <li><strong>Livestreams:</strong> High engagement potential ($500-$5,000+ per stream). Requires dedicated audience.</li>
            <li><strong>Affiliate:</strong> Commission-based (5-30% of sales). Add TikTok Shop links to videos.</li>
          </ul>

          <h2>Tips to increase TikTok earnings</h2>
          <ul>
            <li>Prioritize brand deals over Creator Fund for higher income.</li>
            <li>Focus on high-CPM niches: finance, tech, beauty, fitness, self-improvement.</li>
            <li>Build engagement rate (not just followers). Brands prioritize engagement.</li>
            <li>Start livestreams to unlock gift income while growing followers.</li>
            <li>Use affiliate links in bio and video descriptions for passive income.</li>
            <li>Diversify: combine Creator Fund, brand deals, and livestreams.</li>
          </ul>

          <h2>Seasonal earnings variation</h2>
          <ul>
            <li><strong>Q1 (Jan-Mar):</strong> Post-holiday spending slowdown, moderate brand budgets.</li>
            <li><strong>Q2 (Apr-Jun):</strong> Summer campaigns begin, brand deal activity increases.</li>
            <li><strong>Q3 (Jul-Sep):</strong> Back-to-school and seasonal peaks, higher engagement.</li>
            <li><strong>Q4 (Oct-Dec):</strong> Holiday campaigns, peak brand spending, highest deal rates.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>TikTok Creator Fund official documentation and earnings guidelines.</li>
            <li>Influencer marketing research from HubSpot and Sprout Social.</li>
            <li>Creator economy earnings data from Influencer Marketing Hub.</li>
            <li>TikTok Shop affiliate program rates and documentation.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Music, title: "Creator Fund", sub: "Direct platform payments" },
            { icon: DollarSign, title: "Brand Deals", sub: "Sponsorship revenue" },
            { icon: Gift, title: "Livestreams", sub: "Gift and donation income" },
            { icon: Zap, title: "Multi-Stream", sub: "Combined earnings" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Creator Fund Income</h3>
            <Input
              label="Monthly Video Views"
              type="number"
              inputMode="numeric"
              min={1}
              value={monthlyViews}
              onChange={(e) => setMonthlyViews(e.target.value)}
              suffix="views"
            />
            <Input
              label="Followers (for reference)"
              type="number"
              inputMode="numeric"
              min={1}
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              suffix="followers"
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Brand Deals</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Per-Deal Rate"
                type="number"
                inputMode="decimal"
                min={0}
                step="100"
                value={brandDealRate}
                onChange={(e) => setBrandDealRate(e.target.value)}
                suffix="$"
              />
              <Input
                label="Deals Per Month"
                type="number"
                inputMode="numeric"
                min={0}
                value={brandsPerMonth}
                onChange={(e) => setBrandsPerMonth(e.target.value)}
                suffix="deals"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Livestream Gifts</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Livestream Days/Month"
                type="number"
                inputMode="numeric"
                min={0}
                value={livestreamDays}
                onChange={(e) => setLivestreamDays(e.target.value)}
                suffix="days"
              />
              <Input
                label="Gift Value Per Stream"
                type="number"
                inputMode="decimal"
                min={0}
                step="50"
                value={giftValuePerStream}
                onChange={(e) => setGiftValuePerStream(e.target.value)}
                suffix="$"
              />
            </div>
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Creator Fund"
                value={formatCurrency(result.creatorFundMonthly)}
              />
              <ResultCard
                label="Brand Deals"
                value={formatCurrency(result.brandDealRevenue)}
              />
              <ResultCard
                label="Livestream (50%)"
                value={formatCurrency(result.livestreamRevenue)}
              />
              <ResultCard
                label="Total Monthly"
                value={formatCurrency(result.totalMonthly)}
                highlight
              />
            </ResultsGrid>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              Estimated monthly earnings: {formatCurrency(result.totalMonthly)} from Creator Fund,
              brand deals, and livestream gifts.
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate TikTok earnings.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
