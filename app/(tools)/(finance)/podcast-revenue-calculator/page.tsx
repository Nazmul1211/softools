"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

const faqs: FAQItem[] = [
  {
    question: "What CPM should I use for podcast ads?",
    answer:
      "Many podcast sponsorships fall around $18 to $50 CPM depending on niche, audience location, and host-read quality.",
  },
  {
    question: "Does this include all podcast income sources?",
    answer:
      "The calculator includes sponsorship CPM revenue plus optional affiliate and listener support inputs. You can treat those as monthly extras.",
  },
  {
    question: "Is this estimate monthly or per episode?",
    answer:
      "This page estimates monthly totals. Enter monthly downloads and your current monetization assumptions.",
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

export default function PodcastRevenueCalculatorPage() {
  const [monthlyDownloads, setMonthlyDownloads] = useState("50000");
  const [cpm, setCpm] = useState("28");
  const [adSlots, setAdSlots] = useState("2");
  const [fillRate, setFillRate] = useState("75");
  const [affiliateRevenue, setAffiliateRevenue] = useState("300");
  const [listenerSupport, setListenerSupport] = useState("250");

  const result = useMemo(() => {
    const downloads = Number.parseFloat(monthlyDownloads);
    const cpmValue = Number.parseFloat(cpm);
    const slotCount = Number.parseFloat(adSlots);
    const fill = Number.parseFloat(fillRate);
    const affiliate = Number.parseFloat(affiliateRevenue);
    const support = Number.parseFloat(listenerSupport);

    if (
      !Number.isFinite(downloads) ||
      !Number.isFinite(cpmValue) ||
      !Number.isFinite(slotCount) ||
      !Number.isFinite(fill) ||
      !Number.isFinite(affiliate) ||
      !Number.isFinite(support) ||
      downloads < 0 ||
      cpmValue < 0 ||
      slotCount < 0 ||
      fill < 0
    ) {
      return null;
    }

    const sponsorshipRevenue = (downloads / 1000) * cpmValue * slotCount * (fill / 100);
    const totalMonthly = sponsorshipRevenue + affiliate + support;

    return {
      sponsorshipRevenue,
      affiliateRevenue: affiliate,
      listenerSupportRevenue: support,
      totalMonthly,
      totalYearly: totalMonthly * 12,
    };
  }, [monthlyDownloads, cpm, adSlots, fillRate, affiliateRevenue, listenerSupport]);

  return (
    <ToolLayout
      title="Podcast Revenue Calculator"
      slug="podcast-revenue-calculator"
      description="Estimate podcast sponsorship and total creator revenue from downloads, CPM, and extra income channels."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter monthly downloads", text: "Use your average monthly total listens or downloads." },
        { name: "Set ad assumptions", text: "Input your CPM, number of ad slots, and fill rate percentage." },
        { name: "Add extra revenue", text: "Include affiliate commissions and listener support to see full totals." },
      ]}
      relatedTools={[
        { name: "Twitch Revenue Calculator", href: "/twitch-revenue-calculator/" },
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "Sponsorship Rate Calculator", href: "/sponsorship-rate-calculator/" },
      ]}
      content={
        <>
          <h2>Formula used</h2>
          <p>
            Sponsorship revenue is estimated as:
            <strong> (Monthly Downloads / 1,000) × CPM × Ad Slots × Fill Rate</strong>.
            Then affiliate and listener support values are added for total monthly revenue.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Monthly Downloads" type="number" min={0} value={monthlyDownloads} onChange={(e) => setMonthlyDownloads(e.target.value)} />
          <Input label="CPM Rate" type="number" min={0} step="0.01" suffix="$" value={cpm} onChange={(e) => setCpm(e.target.value)} />
          <Input label="Ad Slots Per Episode Set" type="number" min={0} step="1" value={adSlots} onChange={(e) => setAdSlots(e.target.value)} />
          <Input label="Ad Fill Rate (%)" type="number" min={0} max={100} value={fillRate} onChange={(e) => setFillRate(e.target.value)} />
          <Input label="Affiliate Revenue / Month" type="number" min={0} step="0.01" suffix="$" value={affiliateRevenue} onChange={(e) => setAffiliateRevenue(e.target.value)} />
          <Input label="Listener Support / Month" type="number" min={0} step="0.01" suffix="$" value={listenerSupport} onChange={(e) => setListenerSupport(e.target.value)} />
        </div>

        {result ? (
          <ResultsGrid columns={2}>
            <ResultCard label="Estimated Monthly Revenue" value={formatCurrency(result.totalMonthly)} highlight />
            <ResultCard label="Estimated Yearly Revenue" value={formatCurrency(result.totalYearly)} />
            <ResultCard label="Sponsorship Revenue" value={formatCurrency(result.sponsorshipRevenue)} />
            <ResultCard label="Affiliate Revenue" value={formatCurrency(result.affiliateRevenue)} />
            <ResultCard label="Listener Support" value={formatCurrency(result.listenerSupportRevenue)} />
          </ResultsGrid>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate revenue.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
