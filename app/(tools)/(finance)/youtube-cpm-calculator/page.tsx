"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Play, DollarSign, TrendingUp, Zap } from "lucide-react";

interface YouTubeCPMResult {
  totalRevenue: number;
  rpm: number;
  adjustedCPM: number;
}

const faqs: FAQItem[] = [
  {
    question: "What is CPM and how does YouTube use it?",
    answer:
      "CPM (Cost Per Mille) is the price advertisers pay for 1,000 ad impressions. YouTube takes 45% of ad revenue, and creators earn the remaining 55%. CPM varies dramatically based on audience location, content category, season, and competition. US and UK audiences command $5-$15 CPM, while traffic from developing regions averages $0.50-$3 CPM.",
  },
  {
    question: "What is RPM and how is it different from CPM?",
    answer:
      "RPM (Revenue Per Mille) is the amount you earn per 1,000 views after YouTube takes its cut. RPM = CPM × 0.55. If CPM is $10, your RPM is $5.50. RPM is lower than CPM because YouTube retains 45%. Use RPM to forecast actual creator earnings; use CPM when discussing advertiser rates.",
  },
  {
    question: "What factors affect YouTube CPM rates?",
    answer:
      "Key factors: audience geography (US/UK highest), content category (finance and tech pay more than gaming or vlogging), viewer engagement and watch time, seasonality (Q4 peaks with holiday advertising), audience demographics (older viewers attract higher CPM), and content maturity (advertiser-friendly content commands premium rates).",
  },
  {
    question: "Why is Q4 CPM higher than other seasons?",
    answer:
      "Q4 (October-December) sees increased advertising spending as brands launch holiday campaigns and year-end promotions. Advertisers compete harder for viewer attention, driving CPM rates up 30-50% above baseline. January is typically the lowest CPM month as budgets reset.",
  },
  {
    question: "How can creators increase their CPM?",
    answer:
      "Target high-CPM niches: finance, investing, real estate, B2B software, insurance. Build US/UK/AU audience (these regions have 5-10x higher CPM than developing countries). Improve engagement metrics and watch time. Maintain advertiser-friendly content policies. Diversify income with sponsorships and affiliate links to reduce CPM dependency.",
  },
  {
    question: "Is this calculator accurate for my earnings?",
    answer:
      "This is an estimate based on average CPM ranges. Actual earnings vary significantly by channel, audience, and content type. Use your YouTube Analytics earnings report as the source of truth. This calculator is helpful for planning and comparing scenarios before content creation.",
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

export default function YouTubeCPMCalculatorPage() {
  const [views, setViews] = useState("100000");
  const [cpm, setCPM] = useState("7.50");

  const result = useMemo<YouTubeCPMResult | null>(() => {
    const viewCount = Number.parseFloat(views);
    const cpmValue = Number.parseFloat(cpm);

    if (!Number.isFinite(viewCount) || !Number.isFinite(cpmValue) || viewCount <= 0 || cpmValue <= 0) {
      return null;
    }

    const totalRevenue = (viewCount * cpmValue) / 1000 * 0.55;
    const rpm = (cpmValue * 0.55);
    const adjustedCPM = cpmValue;

    return {
      totalRevenue,
      rpm,
      adjustedCPM,
    };
  }, [views, cpm]);

  return (
    <ToolLayout
      title="YouTube CPM Calculator"
      slug="youtube-cpm-calculator"
      description="Calculate estimated YouTube ad revenue from views and CPM rates. See your RPM and earnings projections instantly."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your video views",
          text: "Input the total number of views your video or channel receives.",
        },
        {
          name: "Set your CPM rate",
          text: "Use your YouTube Analytics CPM or estimate based on audience location and niche.",
        },
        {
          name: "See revenue projection",
          text: "View your estimated earnings after YouTube&apos;s 45% platform fee.",
        },
        {
          name: "Plan content strategy",
          text: "Use RPM to forecast earnings and compare against niche/audience changes.",
        },
      ]}
      relatedTools={[
        { name: "TikTok Money Calculator", href: "/tiktok-money-calculator/" },
        { name: "Instagram Engagement Calculator", href: "/instagram-engagement-rate-calculator/" },
        { name: "Affiliate Commission Calculator", href: "/affiliate-commission-calculator/" },
        { name: "Sponsorship Rate Calculator", href: "/sponsorship-rate-calculator/" },
      ]}
      content={
        <>
          <h2>What is YouTube CPM and how does it work?</h2>
          <p>
            CPM (Cost Per Mille) is the amount advertisers pay YouTube for every 1,000 ad impressions shown on your videos.
            YouTube retains 45% as platform revenue, and creators earn 55%. So if your CPM is $10, your RPM (Revenue Per Mille)
            is $5.50. CPM varies dramatically based on geography, content category, season, and audience quality.
          </p>

          <h2>How is revenue calculated?</h2>
          <p>
            <strong>Creator Revenue = (Views / 1,000) × CPM × 0.55</strong>
          </p>
          <p>
            For example, 100,000 views at $8 CPM: (100,000 / 1,000) × $8 × 0.55 = $440 earnings.
            This calculator automates that math and helps you forecast earnings under different scenarios.
          </p>

          <h2>CPM rates by geography and niche</h2>
          <table>
            <thead>
              <tr>
                <th>Region/Niche</th>
                <th>Typical CPM Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>US Audience</td>
                <td>$5–$15</td>
                <td>Highest-value advertisers and purchasing power.</td>
              </tr>
              <tr>
                <td>UK/Australia/Canada</td>
                <td>$4–$12</td>
                <td>Strong second tier, developed markets.</td>
              </tr>
              <tr>
                <td>Finance/Investing</td>
                <td>$8–$25</td>
                <td>Premium category with high-value advertisers.</td>
              </tr>
              <tr>
                <td>Technology/SaaS</td>
                <td>$7–$18</td>
                <td>B2B content attracts enterprise advertisers.</td>
              </tr>
              <tr>
                <td>Real Estate/Business</td>
                <td>$6–$20</td>
                <td>High commercial intent, premium rates.</td>
              </tr>
              <tr>
                <td>Gaming/Entertainment</td>
                <td>$2–$6</td>
                <td>Lower CPM despite large audiences.</td>
              </tr>
              <tr>
                <td>Developing Countries</td>
                <td>$0.50–$3</td>
                <td>Lower purchasing power, reduced advertiser interest.</td>
              </tr>
            </tbody>
          </table>

          <h2>Factors that impact your CPM</h2>
          <ul>
            <li><strong>Audience geography:</strong> US/UK viewers generate 5-10x higher CPM than developing regions.</li>
            <li><strong>Content category:</strong> Finance, tech, B2B, and real estate command premium rates. Gaming and entertainment are lower.</li>
            <li><strong>Seasonality:</strong> Q4 (Oct-Dec) sees 30-50% CPM spikes. January is typically lowest.</li>
            <li><strong>Engagement and watch time:</strong> Higher engagement attracts better advertisers and increases CPM.</li>
            <li><strong>Advertiser-friendly content:</strong> Content that attracts brand-safe advertisers increases CPM. Controversial content lowers it.</li>
            <li><strong>Viewer demographics:</strong> Older, higher-income viewers attract premium advertisers with higher CPM.</li>
          </ul>

          <h2>Seasonal CPM trends</h2>
          <ul>
            <li><strong>Q1 (Jan-Mar):</strong> CPM recovering from January slump, brands restart spending.</li>
            <li><strong>Q2 (Apr-Jun):</strong> Stable, mid-range CPM as summer advertising budgets activate.</li>
            <li><strong>Q3 (Jul-Sep):</strong> Summer slump, slightly lower CPM as some advertisers shift budgets.</li>
            <li><strong>Q4 (Oct-Dec):</strong> Peak CPM season as holiday campaigns and year-end spending surge.</li>
          </ul>

          <h2>How to maximize your YouTube earnings</h2>
          <ul>
            <li>Target US/UK/Canadian audiences for premium CPM rates.</li>
            <li>Focus on high-CPM niches: finance, tech, real estate, and B2B.</li>
            <li>Optimize for watch time and engagement to attract quality advertisers.</li>
            <li>Diversify income with sponsorships, affiliate links, and digital products (reduce CPM dependency).</li>
            <li>Plan content calendar around Q4 peak season for maximum earnings.</li>
            <li>Maintain advertiser-friendly policies to qualify for better advertising partners.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>YouTube Creator Academy — monetization and revenue sharing documentation.</li>
            <li>Social Blade and VidIQ CPM benchmark reports.</li>
            <li>Creator economy research from Influencer Marketing Hub and Tubular Labs.</li>
            <li>Google AdSense policy documentation on advertiser-friendly content.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Play, title: "View Based", sub: "Calculate from video views" },
            { icon: DollarSign, title: "CPM to Earnings", sub: "Convert CPM to actual revenue" },
            { icon: TrendingUp, title: "RPM Insight", sub: "See net revenue per 1000" },
            { icon: Zap, title: "Instant Projection", sub: "Scenario planning support" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="rounded-xl border border-border bg-muted/30 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Total Views"
            type="number"
            inputMode="numeric"
            min={1}
            value={views}
            onChange={(e) => setViews(e.target.value)}
            suffix="views"
          />
          <Input
            label="CPM Rate"
            type="number"
            inputMode="decimal"
            min={0.01}
            step="0.01"
            value={cpm}
            onChange={(e) => setCPM(e.target.value)}
            suffix="$"
          />
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Estimated Earnings"
                value={formatCurrency(result.totalRevenue)}
                highlight
              />
              <ResultCard label="Your RPM (after 45% cut)" value={formatCurrency(result.rpm)} />
            </ResultsGrid>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              Based on <strong>{Number.parseFloat(views).toLocaleString()}</strong> views at{" "}
              <strong>${Number.parseFloat(cpm).toFixed(2)} CPM</strong> (YouTube retains 45%, you earn 55%).
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate YouTube earnings.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
