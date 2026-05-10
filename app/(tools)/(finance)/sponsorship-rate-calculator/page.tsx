"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { DollarSign, Users, Target, Zap } from "lucide-react";

interface SponsorshipRates {
  baseRate: number;
  engagementAdjusted: number;
  premiumRate: number;
  monthlyContractEstimate: number;
}

const faqs: FAQItem[] = [
  {
    question: "What is a fair influencer sponsorship rate?",
    answer:
      "Standard industry rates: $100-$500 for 10K-100K followers, $1,000-$10,000 for 100K-1M, and $10,000-$100,000+ for 1M+ followers. These are starting points; actual rates vary by engagement rate, niche, experience, and deliverables. High-engagement creators and premium niches (finance, tech) can charge 2-5x base rates.",
  },
  {
    question: "How is sponsorship pricing calculated?",
    answer:
      "The common formula: Base Rate = Followers ÷ 1,000 × Factor ($100-$200 per 1K followers). Adjustments based on: engagement rate (higher = more), niche premium (finance/tech higher, gaming/vlogging lower), content type (Reels cost more), and exclusivity clauses. Use this calculator as a negotiation starting point, not a ceiling.",
  },
  {
    question: "Should I charge per post or per month?",
    answer:
      "Both models exist. Per-post charges $500-$5,000 per content piece (feed post, Reel, story). Monthly retainers ($2,000-$20,000) suit ongoing partnerships where brand gets multiple posts. Per-post works for one-offs; retainers suit long-term brand ambassadors. Negotiate what works for your schedule.",
  },
  {
    question: "How does engagement rate affect my sponsorship rate?",
    answer:
      "Engagement is the biggest price driver. A 50K creator with 5% engagement (2,500 interactions) is worth 2-3x more than 200K followers at 0.5% engagement (1,000 interactions). Brands want audience impact, not follower vanity metrics. Calculate engagement: (Likes + Comments) / Followers × 100.",
  },
  {
    question: "What are the most valuable niches for sponsorships?",
    answer:
      "Premium niches command 2-5x higher rates: finance/investing, tech/SaaS, luxury goods, real estate, B2B software, and insurance. Mid-tier: beauty, fitness, food, fashion. Lower-tier: gaming, general entertainment, lifestyle. Within each niche, micro-influencers (10-100K) often earn more per-follower than mega-influencers.",
  },
  {
    question: "How do I negotiate sponsorship deals?",
    answer:
      "Start high and be ready to negotiate. Provide a rate card showing base rate, engagement stats, and portfolio. Bundle packages (3 posts for discount). Offer performance bonuses if campaign hits targets. Get everything in writing: deliverables, timeline, payment terms, usage rights, exclusivity clauses.",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SponsorshipRateCalculatorPage() {
  const [followers, setFollowers] = useState("150000");
  const [engagementRate, setEngagementRate] = useState("2.5");
  const [nichePremium, setNichePremium] = useState("1.0");

  const result = useMemo<SponsorshipRates | null>(() => {
    const followerCount = Number.parseFloat(followers);
    const engagement = Number.parseFloat(engagementRate);
    const premium = Number.parseFloat(nichePremium);

    if (
      !Number.isFinite(followerCount) ||
      !Number.isFinite(engagement) ||
      !Number.isFinite(premium) ||
      followerCount <= 0 ||
      engagement < 0 ||
      premium <= 0
    ) {
      return null;
    }

    const baseRate = (followerCount / 1000) * 150 * premium;
    const engagementMultiplier = 1 + engagement / 10;
    const engagementAdjusted = baseRate * engagementMultiplier;
    const premiumRate = engagementAdjusted * 1.5;
    const monthlyEstimate = engagementAdjusted * 3;

    return {
      baseRate,
      engagementAdjusted,
      premiumRate,
      monthlyContractEstimate: monthlyEstimate,
    };
  }, [followers, engagementRate, nichePremium]);

  return (
    <ToolLayout
      title="Sponsorship Rate Calculator"
      slug="sponsorship-rate-calculator"
      description="Calculate fair influencer sponsorship rates based on followers, engagement, and niche. Get pricing for brand deals and collaborations."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your followers",
          text: "Input your current follower count across the platform.",
        },
        {
          name: "Set engagement rate",
          text: "Calculate as: (avg likes + avg comments) / followers × 100.",
        },
        {
          name: "Select niche premium",
          text: "Choose multiplier: 1x for average, 1.5-2x for high-value niches.",
        },
        {
          name: "See pricing tiers",
          text: "View base, engagement-adjusted, and premium rates per post.",
        },
      ]}
      relatedTools={[
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "TikTok Money Calculator", href: "/tiktok-money-calculator/" },
        { name: "Instagram Engagement Calculator", href: "/instagram-engagement-rate-calculator/" },
        { name: "Affiliate Commission Calculator", href: "/affiliate-commission-calculator/" },
      ]}
      content={
        <>
          <h2>What are influencer sponsorship rates?</h2>
          <p>
            Sponsorship rates are what brands pay influencers for promoting their products or services. Rates vary based on
            follower count, engagement quality, niche, content type, and deliverables. This calculator provides industry-standard
            starting points for negotiation.
          </p>

          <h2>Influencer pricing by tier</h2>
          <table>
            <thead>
              <tr>
                <th>Creator Tier</th>
                <th>Followers</th>
                <th>Per-Post Rate</th>
                <th>Monthly Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nano</td>
                <td>1K–10K</td>
                <td>$100–$500</td>
                <td>$300–$1,500</td>
              </tr>
              <tr>
                <td>Micro</td>
                <td>10K–100K</td>
                <td>$500–$2,500</td>
                <td>$1,500–$7,500</td>
              </tr>
              <tr>
                <td>Mid-Tier</td>
                <td>100K–1M</td>
                <td>$2,500–$15,000</td>
                <td>$7,500–$45,000</td>
              </tr>
              <tr>
                <td>Macro</td>
                <td>1M–10M</td>
                <td>$15,000–$100,000</td>
                <td>$45,000–$300,000</td>
              </tr>
              <tr>
                <td>Mega</td>
                <td>10M+</td>
                <td>$100,000+</td>
                <td>$300,000+</td>
              </tr>
            </tbody>
          </table>

          <h2>Niche premium multipliers</h2>
          <ul>
            <li><strong>Premium niches (2-5x):</strong> Finance, investing, tech, SaaS, B2B, luxury, real estate.</li>
            <li><strong>Standard niches (1-2x):</strong> Beauty, fitness, fashion, food, parenting, lifestyle.</li>
            <li><strong>Lower-tier niches (0.5-1x):</strong> Gaming, entertainment, general vlogging, meme accounts.</li>
          </ul>

          <h2>Factors that increase sponsorship rates</h2>
          <ul>
            <li><strong>High engagement rate:</strong> 3%+ engagement commands 20-50% premium over base rate.</li>
            <li><strong>Niche authority:</strong> Established expertise in premium fields (finance, tech) = 2-5x multiplier.</li>
            <li><strong>Content quality:</strong> Professional production, high production value = 30-50% increase.</li>
            <li><strong>Audience demographics:</strong> Older, higher-income audiences attract premium advertisers.</li>
            <li><strong>Performance history:</strong> Proven conversion data from past campaigns justifies 50-100% premiums.</li>
            <li><strong>Exclusivity:</strong> Non-competing brand partnerships add 20-30% to rates.</li>
            <li><strong>Deliverables scope:</strong> 3+ posts, email lists, or conversion tracking = higher rates.</li>
          </ul>

          <h2>Pricing models: per-post vs. retainer</h2>
          <ul>
            <li><strong>Per-post model:</strong> $500-$5,000 per content piece. Suit for one-off campaigns. Clear scope.</li>
            <li><strong>Monthly retainer:</strong> $2,000-$20,000/month for 2-4 posts. Long-term partnerships, predictable revenue.</li>
            <li><strong>Performance-based:</strong> Base rate + commission on sales/conversions. Aligns interests, higher upside.</li>
            <li><strong>Package deals:</strong> Discount for 3+ posts bundled (e.g., 3 posts for 20% discount).</li>
          </ul>

          <h2>How to negotiate higher sponsorship rates</h2>
          <ul>
            <li><strong>Lead with engagement metrics:</strong> Show 2% engagement &gt; 500K followers at 0.2%.</li>
            <li><strong>Provide case studies:</strong> Share past campaign performance and ROI data.</li>
            <li><strong>Bundle offerings:</strong> "3 feed posts + 5 stories for $5,000" is better value than per-item pricing.</li>
            <li><strong>Ask for performance bonuses:</strong> "$3,000 base + $1,000 if campaign hits 50K clicks."</li>
            <li><strong>Build a rate card:</strong> Professional PDF with tiers, deliverables, and exclusivity options.</li>
            <li><strong>Know your floor:</strong> Set minimum acceptable rate; don&apos;t undervalue for "exposure."</li>
            <li><strong>Get it in writing:</strong> Contract should cover: deliverables, timeline, payment terms, usage rights.</li>
          </ul>

          <h2>Red flags in sponsorship deals</h2>
          <ul>
            <li><strong>Exposure-only payments:</strong> Never work for "exposure." Your time has monetary value.</li>
            <li><strong>Vague deliverables:</strong> "A few posts" isn&apos;t clear. Specify: 3 feed posts, 10 stories, 1 Reel.</li>
            <li><strong>Perpetual usage rights:</strong> Limit brand use to 6-12 months. Forever use = negotiate higher rates.</li>
            <li><strong>No payment timeline:</strong> Always agree on Net 15 or Net 30 payment terms upfront.</li>
            <li><strong>Competing brand exclusivity:</strong> Don&apos;t accept 6+ month exclusivity for a one-post deal.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>Influencer Marketing Hub annual influencer benchmarks and pricing reports.</li>
            <li>Sprout Social influencer rates and industry data.</li>
            <li>HubSpot influencer marketing best practices and pricing guides.</li>
            <li>Creator economy research from Linqia and creator rate card databases.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, title: "Followers", sub: "Base for pricing" },
            { icon: Target, title: "Engagement", sub: "Quality multiplier" },
            { icon: DollarSign, title: "Per-Post Rate", sub: "Single deliverable" },
            { icon: Zap, title: "Premium Tier", sub: "High-value rate" },
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
            label="Your Follower Count"
            type="number"
            inputMode="numeric"
            min={1}
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            suffix="followers"
          />

          <Input
            label="Engagement Rate"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.1"
            value={engagementRate}
            onChange={(e) => setEngagementRate(e.target.value)}
            suffix="%"
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <label className="block text-sm font-semibold text-foreground mb-3">Niche Premium</label>
            <div className="space-y-2">
              {[
                { label: "Standard Niche (1.0x)", value: "1.0" },
                { label: "Good Niche (1.5x)", value: "1.5" },
                { label: "Premium Niche (2.0x)", value: "2.0" },
                { label: "Top Tier (3.0x)", value: "3.0" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="premium"
                    value={value}
                    checked={nichePremium === value}
                    onChange={(e) => setNichePremium(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Base Per-Post Rate"
                value={formatCurrency(result.baseRate)}
              />
              <ResultCard
                label="Engagement-Adjusted Rate"
                value={formatCurrency(result.engagementAdjusted)}
                highlight
              />
              <ResultCard
                label="Premium Rate (Negotiated)"
                value={formatCurrency(result.premiumRate)}
              />
              <ResultCard
                label="Monthly Retainer (3 posts)"
                value={formatCurrency(result.monthlyContractEstimate)}
              />
            </ResultsGrid>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              <strong>Negotiation tip:</strong> Start with your engagement-adjusted rate as the opening. Brands expecting cheaper
              rates often have smaller budgets. Premium niches and high engagement justify asking for {formatCurrency(result.premiumRate)}.
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate sponsorship rates.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
