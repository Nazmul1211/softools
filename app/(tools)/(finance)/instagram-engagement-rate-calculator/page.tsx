"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Heart, MessageCircle, Eye, TrendingUp } from "lucide-react";

interface EngagementMetrics {
  engagementRate: number;
  engagementPerPost: number;
  benchmark: string;
  quality: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is a good Instagram engagement rate?",
    answer:
      "Engagement rates vary by follower count and niche. Micro-influencers (10K-100K) typically achieve 3-8% engagement. Mid-tier (100K-1M) averages 1-3%. Macro-influencers (1M+) often see 0.5-1% due to larger audiences. Niche creators (beauty, fitness) average 2-5%. High-engagement rates (5%+) indicate a loyal, active audience attractive to brands.",
  },
  {
    question: "How is engagement rate calculated?",
    answer:
      "Engagement rate = (Likes + Comments + Shares) / Followers × 100. Some methods use impressions instead of followers for more accurate reach measurement. This calculator uses the follower-based formula, the most common standard. A 2-3% rate is considered healthy for most creators.",
  },
  {
    question: "Why does engagement rate matter for brand deals?",
    answer:
      "Brands prioritize engagement over raw follower count. A creator with 50K followers and 5% engagement (2,500 engagements per post) is more valuable than 500K followers at 0.3% (1,500 engagements). Engagement indicates audience loyalty and influence. Higher engagement justifies higher brand deal rates.",
  },
  {
    question: "What factors affect Instagram engagement?",
    answer:
      "Key drivers: posting frequency and consistency, caption quality and CTA effectiveness, hashtag strategy, engagement with followers (responding to comments), niche and content quality, posting time (peak hours vary by audience), use of Reels (higher engagement than static posts), and comment section seeding (organic engagement boost).",
  },
  {
    question: "How can I increase my engagement rate?",
    answer:
      "Post consistently (3-5x weekly). Create carousel posts and Reels (higher engagement). Use clear CTAs in captions. Respond to comments within the first hour. Engage with your community (like/comment on follower posts). Use 20-30 relevant hashtags. Post at peak times (typically 7-9 PM). Build a niche community rather than chasing followers.",
  },
  {
    question: "Is engagement rate the only metric that matters?",
    answer:
      "No. Also track reach, impressions, saves, and click-through rate. Different metrics tell different stories. Reach shows how far your content spreads. Saves indicate highly valuable content. Brands often care about reach and saves alongside engagement. Use Instagram Analytics (Insights tab) to monitor all metrics.",
  },
];

function formatPercent(value: number): string {
  return value.toFixed(2) + "%";
}

export default function InstagramEngagementCalculatorPage() {
  const [followers, setFollowers] = useState("50000");
  const [avgLikes, setAvgLikes] = useState("1500");
  const [avgComments, setAvgComments] = useState("250");
  const [avgShares, setAvgShares] = useState("50");

  const result = useMemo<EngagementMetrics | null>(() => {
    const followerCount = Number.parseFloat(followers);
    const likes = Number.parseFloat(avgLikes);
    const comments = Number.parseFloat(avgComments);
    const shares = Number.parseFloat(avgShares);

    if (
      !Number.isFinite(followerCount) ||
      !Number.isFinite(likes) ||
      !Number.isFinite(comments) ||
      !Number.isFinite(shares) ||
      followerCount <= 0
    ) {
      return null;
    }

    const totalEngagement = likes + comments + shares;
    const engagementRate = (totalEngagement / followerCount) * 100;
    const engagementPerPost = totalEngagement;

    let benchmark = "Below Average";
    let quality = "Needs Improvement";

    if (engagementRate >= 5) {
      benchmark = "Excellent";
      quality = "Highly Attractive to Brands";
    } else if (engagementRate >= 3) {
      benchmark = "Very Good";
      quality = "Strong Audience Connection";
    } else if (engagementRate >= 1.5) {
      benchmark = "Average";
      quality = "Room for Growth";
    } else if (engagementRate >= 1) {
      benchmark = "Below Average";
      quality = "Needs Improvement";
    }

    return {
      engagementRate,
      engagementPerPost,
      benchmark,
      quality,
    };
  }, [followers, avgLikes, avgComments, avgShares]);

  return (
    <ToolLayout
      title="Instagram Engagement Rate Calculator"
      slug="instagram-engagement-rate-calculator"
      description="Calculate your Instagram engagement rate and see how you compare to industry benchmarks. Measure likes, comments, and shares."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      lastUpdated="May 2026"
      faqs={faqs}
      howToSteps={[
        {
          name: "Check your Instagram Insights",
          text: "Go to your profile, tap the menu, and select Insights to see average engagement.",
        },
        {
          name: "Enter your metrics",
          text: "Input your follower count and average likes, comments, and shares per post.",
        },
        {
          name: "See engagement rate",
          text: "View your engagement percentage and how it compares to industry benchmarks.",
        },
        {
          name: "Plan improvements",
          text: "Use insights to optimize posting strategy and grow engagement.",
        },
      ]}
      relatedTools={[
        { name: "YouTube CPM Calculator", href: "/youtube-cpm-calculator/" },
        { name: "TikTok Money Calculator", href: "/tiktok-money-calculator/" },
        { name: "Sponsorship Rate Calculator", href: "/sponsorship-rate-calculator/" },
        { name: "Affiliate Commission Calculator", href: "/affiliate-commission-calculator/" },
      ]}
      content={
        <>
          <h2>What is Instagram engagement rate and why it matters?</h2>
          <p>
            Instagram engagement rate measures what percentage of your followers interact with your content through likes,
            comments, and shares. It&apos;s the most important metric for brand partnerships because it indicates audience
            loyalty and influence. A creator with high engagement is worth more to advertisers than one with follower inflation.
          </p>

          <h2>Engagement rate formula</h2>
          <p>
            <strong>Engagement Rate = (Total Engagement / Followers) × 100</strong>
          </p>
          <p>Where Total Engagement = Likes + Comments + Shares (per post, typically averaged)</p>
          <p>
            Example: 2,000 followers, 100 likes, 20 comments, 5 shares = (125 / 2,000) × 100 = 6.25% engagement rate.
          </p>

          <h2>Instagram engagement benchmarks by follower tier</h2>
          <table>
            <thead>
              <tr>
                <th>Follower Tier</th>
                <th>Typical Engagement Rate</th>
                <th>Quality Assessment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Micro (10K-100K)</td>
                <td>3-8%</td>
                <td>Highly engaged, niche audiences</td>
              </tr>
              <tr>
                <td>Mid-Tier (100K-1M)</td>
                <td>1-3%</td>
                <td>Moderate engagement, broader appeal</td>
              </tr>
              <tr>
                <td>Macro (1M-10M)</td>
                <td>0.5-1%</td>
                <td>Lower rates due to large audience size</td>
              </tr>
              <tr>
                <td>Mega (10M+)</td>
                <td>0.1-0.5%</td>
                <td>Celebrity tier, massive reach</td>
              </tr>
            </tbody>
          </table>

          <h2>Engagement rate by content type</h2>
          <ul>
            <li><strong>Reels:</strong> 3-5% average (highest engagement). Prioritize for algorithm push.</li>
            <li><strong>Carousels:</strong> 2-3% average. Multi-image posts drive engagement.</li>
            <li><strong>Static Posts:</strong> 1-2% average. Traditional image posts.</li>
            <li><strong>Stories:</strong> Measured separately via polls, Q&amp;A, stickers. Not included in main rate.</li>
            <li><strong>Videos:</strong> 2-4% average. Higher than static posts, lower than Reels.</li>
          </ul>

          <h2>Factors that boost Instagram engagement</h2>
          <ul>
            <li><strong>Posting consistency:</strong> 3-5 posts per week maintains audience attention.</li>
            <li><strong>Call-to-action (CTA):</strong> "Tag someone who...", "What do you think?", "Drop a comment" drive engagement.</li>
            <li><strong>Caption length:</strong> 150-300 character captions with personality perform better.</li>
            <li><strong>Hashtag strategy:</strong> 20-30 relevant hashtags reach 15-40% more accounts.</li>
            <li><strong>Peak posting times:</strong> Tuesday-Thursday, 7-9 PM for most audiences.</li>
            <li><strong>Engagement reciprocity:</strong> Reply to all comments in first hour to signal algorithm value.</li>
            <li><strong>Reel strategy:</strong> Reels get 67% more engagement than static posts.</li>
            <li><strong>Community niche:</strong> Focused niches (e.g., fitness, beauty) achieve 2-5% higher engagement.</li>
          </ul>

          <h2>How engagement affects brand deal rates</h2>
          <p>
            Brands calculate influencer fees based on engagement, not followers. A creator with 50K followers at 5% engagement
            (2,500 interactions per post) commands higher rates than 500K followers at 0.3% (1,500 interactions per post).
          </p>
          <p>
            <strong>Rough brand deal pricing:</strong> $100-$500 per 1% engagement at micro level. A 50K follower account with
            3% engagement could charge $300-$500 per post.
          </p>

          <h2>How to improve your engagement rate</h2>
          <ul>
            <li><strong>Post Reels:</strong> 2-3 Reels per week. They get 40-80% more engagement than static posts.</li>
            <li><strong>Write better captions:</strong> Tell a story, ask questions, create urgency with clear CTAs.</li>
            <li><strong>Post at peak times:</strong> Test when your audience is most active (Instagram Insights shows this).</li>
            <li><strong>Engage your community:</strong> Spend 20 minutes daily liking and commenting on follower posts.</li>
            <li><strong>Use trending audio/hashtags:</strong> Jump on trends while building your unique angle.</li>
            <li><strong>Host Q&amp;A sessions:</strong> Use Stories polls, questions stickers, or carousel CTAs.</li>
            <li><strong>Create carousel posts:</strong> Multi-slide posts average 2-3x more engagement than single images.</li>
            <li><strong>Stay consistent:</strong> Irregular posting confuses the algorithm and loses followers.</li>
          </ul>

          <h2>Sources and references</h2>
          <ul>
            <li>Meta Instagram Insights documentation and analytics best practices.</li>
            <li>Hootsuite State of Social Media report on engagement benchmarks.</li>
            <li>Buffer social media engagement research and data analysis.</li>
            <li>Later influencer marketing industry benchmarks and engagement studies.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, title: "Likes", sub: "Count interactions" },
            { icon: MessageCircle, title: "Comments", sub: "Measure conversation" },
            { icon: Eye, title: "Shares", sub: "Track amplification" },
            { icon: TrendingUp, title: "Rate", sub: "Benchmark performance" },
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
            label="Current Followers"
            type="number"
            inputMode="numeric"
            min={1}
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            suffix="followers"
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Average Per Post</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Likes"
                type="number"
                inputMode="numeric"
                min={0}
                value={avgLikes}
                onChange={(e) => setAvgLikes(e.target.value)}
                suffix="per post"
              />
              <Input
                label="Comments"
                type="number"
                inputMode="numeric"
                min={0}
                value={avgComments}
                onChange={(e) => setAvgComments(e.target.value)}
                suffix="per post"
              />
              <Input
                label="Shares"
                type="number"
                inputMode="numeric"
                min={0}
                value={avgShares}
                onChange={(e) => setAvgShares(e.target.value)}
                suffix="per post"
              />
            </div>
          </div>
        </div>

        {result ? (
          <>
            <ResultsGrid columns={2}>
              <ResultCard
                label="Engagement Rate"
                value={formatPercent(result.engagementRate)}
                highlight
              />
              <ResultCard
                label="Avg Engagement Per Post"
                value={Math.round(result.engagementPerPost).toString()}
              />
            </ResultsGrid>

            <div className="rounded-lg border-2 border-primary/50 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">Benchmark: {result.benchmark}</p>
              <p className="text-sm text-muted-foreground">{result.quality}</p>
            </div>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              Your engagement rate of <strong>{formatPercent(result.engagementRate)}</strong> indicates a{" "}
              <strong>{result.quality.toLowerCase()}</strong>. Focus on Reels, captions with CTAs,
              and consistent posting to boost engagement.
            </p>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Enter valid values to calculate engagement rate.
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
