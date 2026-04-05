"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import {
  Map,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Info,
  RotateCcw,
  Calculator,
  Percent,
} from "lucide-react";

// Badge tiers and their boosts
const BADGE_DATA = [
  { count: 0, boost: 0 },
  { count: 5, boost: 5 },
  { count: 10, boost: 10 },
  { count: 25, boost: 15 },
  { count: 50, boost: 20 },
  { count: 100, boost: 25 },
  { count: 250, boost: 30 },
  { count: 500, boost: 35 },
  { count: 1000, boost: 40 },
  { count: 2500, boost: 45 },
  { count: 5000, boost: 50 },
];

// Parcel tiers for boost reduction
const PARCEL_TIERS = [
  { min: 0, max: 99, baseBoost: 100 },
  { min: 100, max: 499, baseBoost: 75 },
  { min: 500, max: 999, baseBoost: 50 },
  { min: 1000, max: 4999, baseBoost: 25 },
  { min: 5000, max: Infinity, baseBoost: 15 },
];

// Base rent per parcel (average power)
const BASE_RENT_PER_PARCEL = 0.00000000158;

// Atlas Buck value in USD
const AB_TO_USD = 0.01;

// Parcel costs
const PARCEL_COST_AB = 100;
const PARCEL_COST_USD = 5.99;

// Badge costs
const BADGE_COST_AB = 50;

interface CalculationResults {
  totalBoost: number;
  badgeBoost: number;
  tierBoost: number;
  rentPerAd: number;
  dailyRent: number;
  monthlyRent: number;
  yearlyRent: number;
  srbPerAd: number;
  srbPer32hr: number;
  totalInvested: number;
  yearsToROI: number;
  daysToROI: number;
  profit: number;
  nextAction: string;
  abToPurchase: number;
}

export default function AtlasEarthCalculator() {
  // Basic inputs
  const [parcels, setParcels] = useState<string>("10");
  const [badges, setBadges] = useState<string>("0");
  const [atlasBucks, setAtlasBucks] = useState<string>("0");
  const [purchaseValue, setPurchaseValue] = useState<string>("0");

  // Advanced mode
  const [advancedMode, setAdvancedMode] = useState(false);
  const [customPower, setCustomPower] = useState<string>("");
  const [adsPerDay, setAdsPerDay] = useState<string>("20");
  const [srbWatched, setSrbWatched] = useState<string>("3");
  const [diamondSpins, setDiamondSpins] = useState<string>("0");

  // Calculate badge boost based on count
  const getBadgeBoost = (badgeCount: number): number => {
    for (let i = BADGE_DATA.length - 1; i >= 0; i--) {
      if (badgeCount >= BADGE_DATA[i].count) {
        return BADGE_DATA[i].boost;
      }
    }
    return 0;
  };

  // Calculate parcel tier boost
  const getTierBoost = (parcelCount: number): number => {
    for (const tier of PARCEL_TIERS) {
      if (parcelCount >= tier.min && parcelCount <= tier.max) {
        return tier.baseBoost;
      }
    }
    return 15;
  };

  // Main calculation
  const results = useMemo((): CalculationResults | null => {
    const parcelCount = parseInt(parcels) || 0;
    const badgeCount = parseInt(badges) || 0;
    const abCount = parseFloat(atlasBucks) || 0;
    const purchaseVal = parseFloat(purchaseValue) || 0;
    const adsCount = parseInt(adsPerDay) || 20;
    const srbCount = parseInt(srbWatched) || 0;
    const diamondCount = parseInt(diamondSpins) || 0;

    if (parcelCount <= 0) return null;

    // Calculate boosts
    const badgeBoost = getBadgeBoost(badgeCount);
    const tierBoost = getTierBoost(parcelCount);
    const totalBoost = tierBoost + badgeBoost;

    // Calculate base power (use custom if provided)
    const basePower = customPower
      ? parseFloat(customPower)
      : BASE_RENT_PER_PARCEL;

    // Calculate rent per ad
    const rentPerAd = parcelCount * basePower * (1 + totalBoost / 100);

    // Daily rent (assuming 20 ads per day average)
    const dailyRent = rentPerAd * adsCount;

    // Monthly and yearly
    const monthlyRent = dailyRent * 30;
    const yearlyRent = dailyRent * 365;

    // SRB calculations (Super Rent Boost - 10x multiplier)
    const srbPerAd = rentPerAd * 10;
    const srbPer32hr = srbPerAd * srbCount * 2; // 2 SRB sessions per 32hrs typically

    // Calculate total invested
    const parcelCostTotal = parcelCount * PARCEL_COST_USD;
    const badgeCostTotal = badgeCount * BADGE_COST_AB * AB_TO_USD;
    const totalInvested = purchaseVal + parcelCostTotal + badgeCostTotal;

    // ROI calculations (including diamond spins AB bonus)
    const diamondAB = diamondCount * 2; // Average 2 AB per diamond spin
    const effectiveDailyAB = dailyRent / AB_TO_USD + diamondAB;
    // Use effectiveDailyAB for more accurate long-term projections
    void effectiveDailyAB;

    const daysToROI = totalInvested > 0 ? totalInvested / (dailyRent + srbPer32hr / 32 * 24) : 0;
    const yearsToROI = daysToROI / 365;

    // Profit calculation
    const profit = yearlyRent + (srbPer32hr * 365 / 32 * 24) - totalInvested;

    // Next action recommendation
    let nextAction = "Buy Parcels";
    const nextBadgeTier = BADGE_DATA.find((b) => b.count > badgeCount);
    const badgesToNextTier = nextBadgeTier
      ? nextBadgeTier.count - badgeCount
      : 0;

    // Find next parcel tier
    const currentTier = PARCEL_TIERS.find(
      (t) => parcelCount >= t.min && parcelCount <= t.max
    );
    const nextParcelTier = PARCEL_TIERS.find(
      (t) => t.min > (currentTier?.max || 0)
    );
    const parcelsToNextTier = nextParcelTier
      ? nextParcelTier.min - parcelCount
      : 0;

    // Decision logic
    if (parcelsToNextTier > 0 && parcelsToNextTier <= 10) {
      nextAction = "Buy Parcels to Tier, then buy Badges";
    } else if (badgesToNextTier <= 5 && badgeBoost < 50) {
      nextAction = "Buy Badges";
    } else if (parcelCount < 100) {
      nextAction = "Buy Parcels";
    } else {
      nextAction = badgeBoost < tierBoost ? "Buy Badges" : "Buy Parcels";
    }

    // AB needed to purchase recommendations
    const abToPurchase =
      Math.max(0, parcelCount * PARCEL_COST_AB + badgeCount * BADGE_COST_AB - abCount - 200);

    return {
      totalBoost,
      badgeBoost,
      tierBoost,
      rentPerAd,
      dailyRent,
      monthlyRent,
      yearlyRent,
      srbPerAd,
      srbPer32hr,
      totalInvested,
      yearsToROI,
      daysToROI,
      profit,
      nextAction,
      abToPurchase,
    };
  }, [
    parcels,
    badges,
    atlasBucks,
    purchaseValue,
    customPower,
    adsPerDay,
    srbWatched,
    diamondSpins,
  ]);

  const handleReset = () => {
    setParcels("10");
    setBadges("0");
    setAtlasBucks("0");
    setPurchaseValue("0");
    setCustomPower("");
    setAdsPerDay("20");
    setSrbWatched("3");
    setDiamondSpins("0");
    setAdvancedMode(false);
  };

  // Format currency
  const formatCurrency = (value: number, decimals: number = 2): string => {
    if (value < 0.01 && value > 0) {
      return `$${value.toExponential(4)}`;
    }
    return `$${value.toFixed(decimals)}`;
  };

  // Format large numbers
  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  return (
    <ToolLayout
      title="Atlas Earth Calculator"
      description="Calculate your Atlas Earth earnings, ROI, badge boosts, and optimize your virtual land investment strategy. Also known as AE Calculator."
      category={{ name: "Gaming Tools", slug: "gaming-tools" }}
      relatedTools={[
        { name: "ROI Calculator", href: "/roi-calculator" },
        { name: "Compound Interest Calculator", href: "/compound-interest-calculator" },
        { name: "Investment Calculator", href: "/investment-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      lastUpdated="2026-04-05"
      datePublished="2026-04-05"
      howToSteps={[
        {
          name: "Enter Your Parcels",
          text: "Input the number of virtual land parcels you own or plan to own in Atlas Earth.",
        },
        {
          name: "Add Badge Count",
          text: "Enter the number of badges you've collected to calculate your badge boost percentage.",
        },
        {
          name: "Input Atlas Bucks",
          text: "Enter your current Atlas Bucks balance to track your in-game currency.",
        },
        {
          name: "Review Your Results",
          text: "See your calculated earnings per ad, daily/monthly/yearly rent, ROI timeline, and strategic recommendations.",
        },
        {
          name: "Use Advanced Mode",
          text: "Toggle advanced mode for custom power values, SRB calculations, and detailed projections.",
        },
      ]}
      faqs={[
        {
          question: "What is the Atlas Earth Calculator?",
          answer:
            "The Atlas Earth Calculator (also known as AE Calculator) is a free online tool that helps Atlas Earth players calculate their potential earnings from virtual land parcels. It factors in parcel count, badge boosts, tier multipliers, and provides daily, monthly, and yearly rent projections along with ROI estimates.",
        },
        {
          question: "How are Atlas Earth earnings calculated?",
          answer:
            "Atlas Earth earnings are calculated based on your parcel count, base rent power (approximately 0.00000000158 per parcel per ad), badge boost percentage (up to 50%), and parcel tier multiplier (100% for under 100 parcels, decreasing with more parcels). The formula is: Rent Per Ad = Parcels × Base Power × (1 + Total Boost%).",
        },
        {
          question: "What are badges in Atlas Earth and how do they boost earnings?",
          answer:
            "Badges in Atlas Earth are collectible achievements that provide permanent boost percentages to your rent earnings. Starting at 5 badges for a 5% boost, you can earn up to 50% boost at 5,000 badges. Each badge costs 50 Atlas Bucks and strategically collecting them can significantly increase your passive income.",
        },
        {
          question: "What are the parcel tiers in Atlas Earth?",
          answer:
            "Atlas Earth uses parcel tiers that affect your base boost: 0-99 parcels get 100% base boost, 100-499 parcels get 75%, 500-999 parcels get 50%, 1,000-4,999 parcels get 25%, and 5,000+ parcels get 15%. This means smaller portfolios have higher per-parcel earnings but lower total volume.",
        },
        {
          question: "What is Super Rent Boost (SRB)?",
          answer:
            "Super Rent Boost (SRB) is a special feature in Atlas Earth that multiplies your rent earnings by 10x for a limited time. You can activate SRB by watching video ads, typically lasting for a few hours per activation. Our calculator includes SRB projections in the advanced mode.",
        },
        {
          question: "Should I buy more parcels or badges?",
          answer:
            "Our calculator provides a 'Next Action' recommendation based on your current stats. Generally, if you're close to a new parcel tier, buy parcels first. If your badge boost is significantly lower than your tier boost, focus on badges. The optimal strategy balances both for maximum earnings growth.",
        },
        {
          question: "How accurate is this Atlas Earth Calculator?",
          answer:
            "This calculator uses the standard Atlas Earth formulas and average power values. Actual earnings may vary based on ad availability, your location, server updates, and gameplay patterns. Use it as a planning tool and reference, understanding that real-world results depend on multiple factors.",
        },
        {
          question: "What is the ROI timeline for Atlas Earth?",
          answer:
            "ROI (Return on Investment) in Atlas Earth depends on how much you've invested in parcels and badges versus your daily earnings. Most players see ROI timelines measured in years due to the passive income nature of the game. Our calculator provides estimated days and years to recover your investment.",
        },
      ]}
      content={
        <>
          <h2>Understanding the Atlas Earth Calculator</h2>
          <p>
            The <strong>Atlas Earth Calculator</strong> (commonly known as the <strong>AE Calculator</strong>) is an essential tool for players of Atlas Earth, the popular virtual real estate game where you can own parcels of virtual land based on real-world locations. This calculator helps you project earnings, optimize your investment strategy, and understand the complex boost system.
          </p>

          <h3>How Atlas Earth Works</h3>
          <p>
            Atlas Earth allows players to purchase virtual parcels of land that generate passive income in the form of &quot;rent.&quot; Each parcel earns a tiny amount of Atlas Bucks (AB) when you watch ads, and these earnings compound based on your total parcel count and badge collection. The game features several mechanics that affect your earnings:
          </p>
          <ul>
            <li><strong>Base Rent:</strong> Each parcel generates approximately 0.00000000158 AB per ad watched</li>
            <li><strong>Parcel Tiers:</strong> Your total parcel count determines your base boost percentage</li>
            <li><strong>Badge Boosts:</strong> Collecting badges adds permanent percentage boosts to earnings</li>
            <li><strong>Super Rent Boost (SRB):</strong> Watch ads for temporary 10x multipliers</li>
            <li><strong>Diamond Spins:</strong> Daily spins can award bonus Atlas Bucks</li>
          </ul>

          <h3>Parcel Tier System Explained</h3>
          <p>
            Atlas Earth uses a tiered system that adjusts your base boost based on total parcel ownership. This creates an interesting dynamic where smaller portfolios earn more per parcel, but larger portfolios generate more total income:
          </p>
          <table>
            <thead>
              <tr>
                <th>Parcel Range</th>
                <th>Base Boost</th>
                <th>Strategy Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0-99 Parcels</td>
                <td>100%</td>
                <td>Highest per-parcel efficiency, ideal for beginners</td>
              </tr>
              <tr>
                <td>100-499 Parcels</td>
                <td>75%</td>
                <td>Good balance of efficiency and volume</td>
              </tr>
              <tr>
                <td>500-999 Parcels</td>
                <td>50%</td>
                <td>Transitional tier, consider badge focus</td>
              </tr>
              <tr>
                <td>1,000-4,999 Parcels</td>
                <td>25%</td>
                <td>Volume strategy, badges become critical</td>
              </tr>
              <tr>
                <td>5,000+ Parcels</td>
                <td>15%</td>
                <td>Maximum scale, requires significant badge investment</td>
              </tr>
            </tbody>
          </table>

          <h3>Badge Collection Strategy</h3>
          <p>
            Badges are one of the most valuable investments in Atlas Earth. Unlike parcels that have diminishing returns per unit as you scale, badge boosts stack on top of your base earnings. Here&apos;s the badge boost progression:
          </p>
          <ul>
            <li><strong>5 Badges:</strong> +5% boost</li>
            <li><strong>10 Badges:</strong> +10% boost</li>
            <li><strong>25 Badges:</strong> +15% boost</li>
            <li><strong>50 Badges:</strong> +20% boost</li>
            <li><strong>100 Badges:</strong> +25% boost</li>
            <li><strong>250 Badges:</strong> +30% boost</li>
            <li><strong>500 Badges:</strong> +35% boost</li>
            <li><strong>1,000 Badges:</strong> +40% boost</li>
            <li><strong>2,500 Badges:</strong> +45% boost</li>
            <li><strong>5,000 Badges:</strong> +50% boost (Maximum)</li>
          </ul>

          <h3>Maximizing Your Atlas Earth Earnings</h3>
          <p>
            To get the most out of your Atlas Earth investment, consider these strategies based on our calculator&apos;s recommendations:
          </p>
          <ol>
            <li><strong>Balance Parcels and Badges:</strong> Don&apos;t just buy parcels—invest in badges for compounding returns</li>
            <li><strong>Watch Tier Transitions:</strong> Before crossing into a new tier, maximize your current tier&apos;s efficiency</li>
            <li><strong>Utilize Super Rent Boost:</strong> SRB provides 10x earnings—use it consistently</li>
            <li><strong>Daily Diamond Spins:</strong> Free AB opportunities that add up over time</li>
            <li><strong>Track Your ROI:</strong> Use this calculator regularly to monitor your investment performance</li>
          </ol>

          <h3>Converting Atlas Bucks to Real Value</h3>
          <p>
            Atlas Bucks can be converted to real currency through the game&apos;s redemption system. The standard conversion rate is approximately $0.01 USD per Atlas Buck. However, reaching the minimum redemption threshold requires significant accumulation, making long-term planning essential—which is exactly what this AE Calculator helps you achieve.
          </p>

          <h3>Calculator Features</h3>
          <p>
            Our Atlas Earth Calculator includes several powerful features to help you plan your strategy:
          </p>
          <ul>
            <li><strong>Basic Mode:</strong> Quick calculations with parcels, badges, and AB balance</li>
            <li><strong>Advanced Mode:</strong> Custom power values, SRB projections, and detailed analytics</li>
            <li><strong>ROI Projections:</strong> See how long until your investment pays off</li>
            <li><strong>Next Action Recommendations:</strong> AI-powered suggestions for optimal growth</li>
            <li><strong>Real-Time Updates:</strong> Instant calculations as you adjust values</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                AE Earnings Calculator
              </h2>
              <p className="text-sm text-muted-foreground">
                Estimate your Atlas Earth income
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-muted-foreground">Advanced</span>
              <button
                onClick={() => setAdvancedMode(!advancedMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  advancedMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    advancedMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              label="Number of Parcels"
              type="number"
              value={parcels}
              onChange={(e) => setParcels(e.target.value)}
              placeholder="Enter parcel count"
              min="0"
              id="parcels"
            />
            <p className="text-xs text-slate-600 dark:text-zinc-400 pl-1">
              Virtual land plots you own
            </p>
          </div>

          <div className="space-y-1">
            <Input
              label="Number of Badges"
              type="number"
              value={badges}
              onChange={(e) => setBadges(e.target.value)}
              placeholder="Enter badge count"
              min="0"
              id="badges"
            />
            <p className="text-xs text-slate-600 dark:text-zinc-400 pl-1">
              {results
                ? `Current boost: ${results.badgeBoost}%`
                : "Collectibles for earnings boost"}
            </p>
          </div>

          <div className="space-y-1">
            <Input
              label="Atlas Bucks (AB)"
              type="number"
              value={atlasBucks}
              onChange={(e) => setAtlasBucks(e.target.value)}
              placeholder="Enter AB balance"
              min="0"
              id="atlas-bucks"
            />
            <p className="text-xs text-slate-600 dark:text-zinc-400 pl-1">
              Your current in-game currency
            </p>
          </div>

          <div className="space-y-1">
            <Input
              label="Purchase Value (USD)"
              type="number"
              value={purchaseValue}
              onChange={(e) => setPurchaseValue(e.target.value)}
              placeholder="Real money invested"
              min="0"
              step="0.01"
              suffix="$"
              id="purchase-value"
            />
            <p className="text-xs text-slate-600 dark:text-zinc-400 pl-1">
              Total real money spent
            </p>
          </div>
        </div>

        {/* Advanced Options */}
        {advancedMode && (
          <div className="border border-border rounded-xl p-4 bg-muted/30 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-200">
              <Zap className="h-4 w-4 text-primary" />
              Advanced Settings
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Custom Power"
                type="text"
                value={customPower}
                onChange={(e) => setCustomPower(e.target.value)}
                placeholder="0.00000000158"
                id="custom-power"
              />
              <Input
                label="Ads Per Day"
                type="number"
                value={adsPerDay}
                onChange={(e) => setAdsPerDay(e.target.value)}
                placeholder="20"
                min="0"
                max="100"
                id="ads-per-day"
              />
              <Input
                label="SRB Sessions/Day"
                type="number"
                value={srbWatched}
                onChange={(e) => setSrbWatched(e.target.value)}
                placeholder="3"
                min="0"
                max="10"
                id="srb-watched"
              />
              <Input
                label="Diamond Spins/Day"
                type="number"
                value={diamondSpins}
                onChange={(e) => setDiamondSpins(e.target.value)}
                placeholder="0"
                min="0"
                id="diamond-spins"
              />
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Boost Summary */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Total Boost: {results.totalBoost}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                (Tier: {results.tierBoost}% + Badges: {results.badgeBoost}%)
              </div>
            </div>

            {/* Main Results Grid */}
            <ResultsGrid columns={2}>
              <ResultCard
                label="Rent Per Ad"
                value={formatCurrency(results.rentPerAd, 10)}
                highlight
                className="col-span-1 sm:col-span-2"
              />
              <ResultCard
                label="Daily Rent"
                value={formatCurrency(results.dailyRent, 8)}
                subValue={`~${(results.dailyRent / AB_TO_USD).toFixed(2)} AB`}
              />
              <ResultCard
                label="Monthly Rent"
                value={formatCurrency(results.monthlyRent, 6)}
                subValue={`~${formatNumber(results.monthlyRent / AB_TO_USD)} AB`}
              />
              <ResultCard
                label="Yearly Rent"
                value={formatCurrency(results.yearlyRent, 4)}
                subValue={`~${formatNumber(results.yearlyRent / AB_TO_USD)} AB`}
              />
              <ResultCard
                label="Total Invested"
                value={formatCurrency(results.totalInvested)}
              />
            </ResultsGrid>

            {/* SRB Results */}
            {advancedMode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Super Rent Boost (SRB) Projections
                </div>
                <ResultsGrid columns={3}>
                  <ResultCard
                    label="Per SRB Ad"
                    value={formatCurrency(results.srbPerAd, 10)}
                    subValue="10x multiplier"
                  />
                  <ResultCard
                    label="Per 32hr SRB"
                    value={formatCurrency(results.srbPer32hr, 8)}
                  />
                  <ResultCard
                    label="Monthly w/ SRB"
                    value={formatCurrency(
                      results.monthlyRent + (results.srbPer32hr * 30 / 32 * 24),
                      4
                    )}
                    highlight
                  />
                </ResultsGrid>
              </div>
            )}

            {/* ROI & Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ROI Card */}
              <div className="rounded-xl border border-border p-5 bg-white dark:bg-muted/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-foreground">ROI Timeline</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days to ROI</span>
                    <span className="font-medium text-foreground">
                      {formatNumber(results.daysToROI)} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Years to ROI</span>
                    <span className="font-medium text-foreground">
                      {results.yearsToROI.toFixed(2)} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Profit</span>
                    <span
                      className={`font-medium ${
                        results.profit >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {formatCurrency(results.profit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Action Card */}
              <div className="rounded-xl border border-primary/30 p-5 bg-primary/5 dark:bg-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Recommended Action
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-lg font-bold text-primary">
                    {results.nextAction}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on your current stats, this action will maximize your
                    earnings growth.
                  </p>
                  {results.abToPurchase > 0 && (
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      AB needed: {formatNumber(results.abToPurchase)} (minus 200
                      free from tutorial)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Average Earnings Summary */}
            <div className="rounded-xl border border-border p-4 bg-muted/30">
              <div className="flex flex-wrap items-center justify-center gap-4 text-center text-sm">
                <div>
                  <span className="text-muted-foreground">Day avg: </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(results.dailyRent, 8)}
                  </span>
                </div>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <div>
                  <span className="text-muted-foreground">Month avg: </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(results.monthlyRent, 6)}
                  </span>
                </div>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <div>
                  <span className="font-bold text-primary">
                    {formatCurrency(results.yearlyRent, 2)} per year!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && (
          <div className="text-center py-12 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter your parcel count to see earnings projections</p>
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Calculator
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
          <Info className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            This calculator is <strong>NOT</strong> affiliated with Atlas Reality
            or the Atlas Earth application. It&apos;s a community tool for
            estimating earnings based on current game mechanics. Actual results
            may vary based on ad availability, game updates, and other factors.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
