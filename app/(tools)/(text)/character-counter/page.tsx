"use client";

import { useMemo, useState } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Check, Copy, Gauge, Sparkles, Trash2, Type } from "lucide-react";

interface TextMetrics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  letters: number;
  numbers: number;
  punctuation: number;
  whitespace: number;
  avgWordLength: number;
}

interface LengthTarget {
  label: string;
  limit: number;
  recommended: string;
}

const TARGETS: LengthTarget[] = [
  { label: "SEO Title Tag", limit: 60, recommended: "50-60" },
  { label: "Meta Description", limit: 160, recommended: "140-160" },
  { label: "X / Twitter Post", limit: 280, recommended: "70-220" },
  { label: "SMS Message", limit: 160, recommended: "Up to 160" },
  { label: "LinkedIn Headline", limit: 220, recommended: "120-220" },
  { label: "YouTube Title", limit: 100, recommended: "60-100" },
];

const faqs: FAQItem[] = [
  {
    question: "What is the difference between character count and character count without spaces?",
    answer:
      "Character count includes every character, including spaces and line breaks. Character count without spaces excludes whitespace and is useful for compact writing analysis and strict form limits.",
  },
  {
    question: "Why should I track text limits for SEO and social media?",
    answer:
      "Different platforms truncate text at different lengths. Tracking limits helps your titles, descriptions, and posts remain readable, complete, and more likely to drive engagement.",
  },
  {
    question: "How are words calculated in this tool?",
    answer:
      "Words are measured by splitting non-empty text on whitespace groups. This method is practical for most content workflows and aligns with common writing editors.",
  },
  {
    question: "Can this tool help with metadata writing?",
    answer:
      "Yes. It gives real-time length checks against common title and description limits so you can optimize snippets for search and social previews.",
  },
];

const SAMPLE_TEXT = `Great writing is not only about what you say. It is also about how efficiently you say it.

When content teams track character limits early, they avoid awkward truncation in search results, social cards, and messaging channels. That keeps headlines readable and metadata complete.

Use this character counter to shape titles, summaries, and calls to action that fit perfectly across every platform.`;

function calculateMetrics(text: string): TextMetrics {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      letters: 0,
      numbers: 0,
      punctuation: 0,
      whitespace: 0,
      avgWordLength: 0,
    };
  }

  const wordsList = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const letters = (text.match(/\p{L}/gu) ?? []).length;
  const numbers = (text.match(/\p{N}/gu) ?? []).length;
  const punctuation = (text.match(/[.,!?;:'"()\[\]{}\-_/\\]/g) ?? []).length;
  const whitespace = (text.match(/\s/g) ?? []).length;
  const sentences = text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((part) => part.trim().length > 0).length || (text.trim() ? 1 : 0);

  const cleanWords = wordsList.map((word) => word.replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean);
  const totalWordLength = cleanWords.reduce((sum, word) => sum + word.length, 0);
  const avgWordLength = cleanWords.length > 0 ? totalWordLength / cleanWords.length : 0;

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: wordsList.length,
    sentences,
    paragraphs,
    letters,
    numbers,
    punctuation,
    whitespace,
    avgWordLength,
  };
}

function getTargetStatus(current: number, limit: number): "good" | "warn" | "over" {
  const ratio = current / limit;
  if (ratio > 1) return "over";
  if (ratio >= 0.85) return "warn";
  return "good";
}

export default function CharacterCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const metrics = useMemo(() => calculateMetrics(text), [text]);

  const readingTime = Math.ceil(metrics.words / 225);
  const speakingTime = Math.ceil(metrics.words / 150);

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (caughtError) {
      console.error("Failed to copy text:", caughtError);
    }
  };

  return (
    <ToolLayout
      title="Character Counter"
      description="Count characters, words, lines, and punctuation instantly. Optimize writing for SEO metadata, social posts, and messaging limits with live feedback."
      category={{ name: "Text Tools", slug: "text-tools" }}
      relatedTools={[
        { name: "Word Counter", href: "/word-counter/" },
        { name: "Text Case Converter", href: "/text-case-converter/" },
        { name: "Slug Generator", href: "/slug-generator/" },
        { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator/" },
      ]}
      howToSteps={[
        { name: "Paste Text", text: "Type or paste your content into the editor." },
        { name: "Review Metrics", text: "Track characters, words, and platform limits in real time." },
        { name: "Refine", text: "Adjust phrasing to stay within your target channel length." },
      ]}
      faqs={faqs}
      content={
        <>
          <h2>Why Character Count Is a Strategic Metric, Not Just a Writing Detail</h2>
          <p>
            Character count influences visibility, click-through performance, and readability across almost every digital channel. Search snippets, social captions, ad headlines, app messages, and support replies all have practical limits. When your writing exceeds those limits, platforms truncate the most important part of the message. That usually means weaker context, lower engagement, and lost conversion opportunities. A real-time character counter helps prevent that by giving immediate feedback as you write.
          </p>
          <p>
            For content teams, character-aware writing reduces revision cycles and eliminates guesswork in approval workflows. Instead of rewriting titles after publishing previews, teams can optimize drafts from the start. This saves production time and creates more consistent outputs across channels.
          </p>

          <h2>Character Count and SEO: Why Length Directly Affects Search Performance</h2>
          <p>
            In SEO, title tags and meta descriptions are often the first elements users see in search results. Overly long text may get cut, while very short text can miss intent-driving context. Balanced length improves clarity and increases the chance that searchers understand your page value immediately. That can strengthen click-through rates, especially for competitive queries where multiple pages offer similar answers.
          </p>
          <p>
            A character counter helps maintain this balance by showing exact length while you draft. Teams can test variations quickly, keep critical keywords in visible positions, and ensure call-to-action phrases remain intact in snippet previews.
          </p>

          <h2>How Character Limits Shape Social and Messaging Content</h2>
          <p>
            Social platforms have different truncation behavior, and users scan quickly. If your first line is too long or unfocused, message intent can be lost before readers engage. SMS and short-form messaging are even more sensitive because hard limits can split text into multiple messages or remove context. By tracking length during drafting, you can keep communication concise, readable, and purposeful.
          </p>
          <p>
            Character-aware writing also improves accessibility. Shorter, well-structured lines reduce cognitive load and help readers process information faster. This matters in fast-moving feeds where attention is limited and every word must carry value.
          </p>

          <h2>Beyond Character Count: Why Supporting Metrics Matter</h2>
          <p>
            Strong writing quality is multi-dimensional. Character count tells you size, but supporting metrics reveal structure. Word count helps estimate pacing. Sentence count highlights complexity. Average word length can indicate whether language is too dense for the intended audience. Paragraph count shows whether text is scannable on mobile devices. Together, these metrics help editors shape content that is clear, balanced, and channel-appropriate.
          </p>
          <p>
            Teams can use these signals for style consistency as well. For example, support teams may target short sentences and low word complexity, while thought leadership articles may allow longer lines but still benefit from paragraph rhythm checks.
          </p>

          <h2>Practical Workflow for Better Length Optimization</h2>
          <ol>
            <li>Write a clear first draft focused on message intent.</li>
            <li>Check character count against destination limits.</li>
            <li>Trim filler words and repeated phrasing.</li>
            <li>Move high-impact keywords and value statements earlier.</li>
            <li>Review sentence and paragraph structure for readability.</li>
            <li>Publish only after headline and summary fit target constraints.</li>
          </ol>
          <p>
            This workflow helps maintain quality without sacrificing speed. Over time, writers internalize platform ranges and produce stronger drafts with less editing overhead.
          </p>

          <h2>Who Should Use a Character Counter Regularly</h2>
          <p>
            SEO specialists use it for title tags, meta descriptions, and schema text snippets. Social media managers rely on it for platform-safe captions and ad copy. Product marketers use it for launch emails and campaign headlines. Support teams use it for concise responses and template optimization. Students and professionals use it for assignment limits, proposals, and executive summaries. In each case, the goal is the same: communicate clearly within constraints.
          </p>
          <p>
            Character counting is a small discipline with outsized impact. When used consistently, it improves message delivery, strengthens UX clarity, and supports better performance across search, social, and direct communication channels.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/12 via-background to-rose-500/10 p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Type className="h-5 w-5 text-primary" />
            Live Character Analysis
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Shape channel-ready content with real-time count insights for search snippets, social posts, and messages.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setText(SAMPLE_TEXT)} variant="outline" size="sm">
            <Sparkles className="mr-1 h-4 w-4" />
            Sample Text
          </Button>
          <Button onClick={() => setText("")} variant="outline" size="sm">
            <Trash2 className="mr-1 h-4 w-4" />
            Clear
          </Button>
          <Button onClick={() => void copyText()} variant="outline" size="sm" disabled={!text}>
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied" : "Copy Text"}
          </Button>
        </div>

        <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Start typing or paste your content here..."
            className="h-72 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </section>

        <ResultsGrid columns={4}>
          <ResultCard label="Characters" value={metrics.characters} highlight />
          <ResultCard label="No Spaces" value={metrics.charactersNoSpaces} />
          <ResultCard label="Words" value={metrics.words} />
          <ResultCard label="Sentences" value={metrics.sentences} />
          <ResultCard label="Paragraphs" value={metrics.paragraphs} />
          <ResultCard label="Letters" value={metrics.letters} />
          <ResultCard label="Numbers" value={metrics.numbers} />
          <ResultCard label="Punctuation" value={metrics.punctuation} />
          <ResultCard label="Whitespace" value={metrics.whitespace} />
          <ResultCard label="Avg Word Length" value={metrics.avgWordLength.toFixed(2)} />
          <ResultCard label="Reading Time" value={readingTime} unit="min" />
          <ResultCard label="Speaking Time" value={speakingTime} unit="min" />
        </ResultsGrid>

        <section className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-muted/30">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Gauge className="h-5 w-5 text-primary" />
            Popular Length Targets
          </h3>
          <div className="space-y-3">
            {TARGETS.map((target) => {
              const status = getTargetStatus(metrics.characters, target.limit);
              const percentage = Math.min(100, (metrics.characters / target.limit) * 100);
              const statusStyles =
                status === "over"
                  ? "text-destructive"
                  : status === "warn"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400";

              return (
                <div key={target.label} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="font-medium text-foreground">{target.label}</p>
                    <p className={`font-medium ${statusStyles}`}>
                      {metrics.characters}/{target.limit} ({target.recommended})
                    </p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        status === "over"
                          ? "bg-destructive"
                          : status === "warn"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
