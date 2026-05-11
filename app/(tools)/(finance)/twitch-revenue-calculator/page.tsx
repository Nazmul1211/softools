"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

const TIER_1_PRICE = 4.99;
const TIER_2_PRICE = 9.99;
const TIER_3_PRICE = 24.99;

const faqs: FAQItem[] = [
  {
    question: "Is this Twitch calculator exact?",
    answer:
      "It is an estimate. Final Twitch payouts vary by country mix, tax settings, and your creator agreement.",
  },
  {
    question: "How are bits calculated?",
    answer: "Bits are estimated at $0.01 per bit for creator payouts.",
  },
  {
    question: "Can I change the subscription revenue share?",
    answer:
      "Yes. Use the subscription share field for your channel split, such as 50% or 70%.",
  },
];

function toCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function TwitchRevenueCalculatorPage() {
  const [subscribers, setSubscribers] = useState("1000");
  const [tier1Percent, setTier1Percent] = useState("85");
  const [tier2Percent, setTier2Percent] = useState("10");
  const [tier3Percent, setTier3Percent] = useState("5");
  const [subShare, setSubShare] = useState("50");
  const [monthlyBits, setMonthlyBits] = useState("30000");
  const [monthlyAds, setMonthlyAds] = useState("250");
  const [monthlyDonations, setMonthlyDonations] = useState("400");

  const result = useMemo(() => {
    const totalSubs = Number.parseFloat(subscribers);
    const t1 = Number.parseFloat(tier1Percent);
    const t2 = Number.parseFloat(tier2Percent);
    const t3 = Number.parseFloat(tier3Percent);
    const share = Number.parseFloat(subShare);
    const bits = Number.parseFloat(monthlyBits);
    const ads = Number.parseFloat(monthlyAds);
    const donations = Number.parseFloat(monthlyDonations);

    if (
      !Number.isFinite(totalSubs) ||
      !Number.isFinite(t1) ||
      !Number.isFinite(t2) ||
      !Number.isFinite(t3) ||
      !Number.isFinite(share) ||
      !Number.isFinite(bits) ||
      !Number.isFinite(ads) ||
      !Number.isFinite(donations) ||
      totalSubs < 0 ||
      t1 < 0 ||
      t2 < 0 ||
      t3 < 0 ||
      share <= 0
    ) {
      return null;
    }

    const percentTotal = t1 + t2 + t3;
    if (percentTotal <= 0) return null;

    const tier1Subs = totalSubs * (t1 / percentTotal);
    const tier2Subs = totalSubs * (t2 / percentTotal);
    const tier3Subs = totalSubs * (t3 / percentTotal);

    const shareMultiplier = share / 100;
    const subscriptionRevenue =
      (tier1Subs * TIER_1_PRICE + tier2Subs * TIER_2_PRICE + tier3Subs * TIER_3_PRICE) * shareMultiplier;
    const bitsRevenue = bits * 0.01;
    const totalMonthly = subscriptionRevenue + bitsRevenue + ads + donations;

    return {
      subscriptionRevenue,
      bitsRevenue,
      adsRevenue: ads,
      donationsRevenue: donations,
      totalMonthly,
      totalYearly: totalMonthly * 12,
    };
  }, [subscribers, tier1Percent, tier2Percent, tier3Percent, subShare, monthlyBits, monthlyAds, monthlyDonations]);

  return (
    <ToolLayout
      title="Twitch Revenue Calculator"
      slug="twitch-revenue-calculator"
      description="Estimate Twitch monthly earnings from subscriptions, bits, ads, and donations."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter your subscriber count", text: "Add your average active Twitch subscribers." },
        { name: "Set tier mix and revenue share", text: "Adjust Tier 1, Tier 2, Tier 3 distribution and payout share." },
        { name: "Add bits, ads, and donations", text: "Include other monthly income streams for a full estimate." },
      ]}
      relatedTools={[
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "TikTok Money Calculator", href: "/tiktok-money-calculator/" },
        { name: "Podcast Revenue Calculator", href: "/podcast-revenue-calculator/" },
      ]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Monthly Subscribers" type="number" min={0} value={subscribers} onChange={(e) => setSubscribers(e.target.value)} />
          <Input label="Subscription Share (%)" type="number" min={1} max={100} value={subShare} onChange={(e) => setSubShare(e.target.value)} />
          <Input label="Tier 1 Share (%)" type="number" min={0} value={tier1Percent} onChange={(e) => setTier1Percent(e.target.value)} />
          <Input label="Tier 2 Share (%)" type="number" min={0} value={tier2Percent} onChange={(e) => setTier2Percent(e.target.value)} />
          <Input label="Tier 3 Share (%)" type="number" min={0} value={tier3Percent} onChange={(e) => setTier3Percent(e.target.value)} />
          <Input label="Monthly Bits" type="number" min={0} value={monthlyBits} onChange={(e) => setMonthlyBits(e.target.value)} />
          <Input label="Monthly Ad Revenue" type="number" min={0} step="0.01" suffix="$" value={monthlyAds} onChange={(e) => setMonthlyAds(e.target.value)} />
          <Input label="Monthly Donations" type="number" min={0} step="0.01" suffix="$" value={monthlyDonations} onChange={(e) => setMonthlyDonations(e.target.value)} />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard label="Estimated Monthly Revenue" value={toCurrency(result.totalMonthly)} highlight />
              <ResultCard label="Estimated Yearly Revenue" value={toCurrency(result.totalYearly)} />
              <ResultCard label="Subscriptions" value={toCurrency(result.subscriptionRevenue)} />
              <ResultCard label="Bits" value={toCurrency(result.bitsRevenue)} />
              <ResultCard label="Ads" value={toCurrency(result.adsRevenue)} />
              <ResultCard label="Donations" value={toCurrency(result.donationsRevenue)} />
            </ResultsGrid>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate revenue.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
