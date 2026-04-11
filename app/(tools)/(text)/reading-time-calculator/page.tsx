"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { BookOpen, Clock, Mic, Type, FileText, BarChart3, Layers, Coffee } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "What is the average reading speed for adults?",
    answer:
      "The average adult reads at approximately 200–250 words per minute (WPM) for general content. This calculator uses 238 WPM as the default, based on a 2019 meta-analysis by Brysbaert in the Journal of Memory and Language that analyzed 190 studies across 18,573 participants. However, reading speed varies significantly: casual fiction readers average 250–300 WPM, while technical or academic material slows people down to 150–200 WPM. Screen reading is typically 25% slower than reading from paper.",
  },
  {
    question: "How many pages is 1000 words?",
    answer:
      "At standard formatting (12pt font, double-spaced, 1-inch margins), 1000 words is approximately 4 pages. Single-spaced, it is about 2 pages. This varies by font family — Times New Roman produces about 250 words per page, while Arial produces about 225 words per page due to wider character spacing. For a 500-word essay: approximately 2 pages double-spaced. For a 2000-word essay: approximately 8 pages double-spaced.",
  },
  {
    question: "How is speaking time different from reading time?",
    answer:
      "The average speaking pace is 130–150 words per minute, significantly slower than silent reading (238 WPM average). This calculator uses 150 WPM for presentations and 130 WPM for careful, formal speaking. TED Talks typically deliver at 130–170 WPM. Audiobooks are usually narrated at 150–160 WPM. When preparing a 10-minute speech, aim for approximately 1,300–1,500 words of content.",
  },
  {
    question: "Why does Medium show reading time on articles?",
    answer:
      "Medium was one of the first platforms to display estimated reading time (starting in 2013). Their research showed that articles with a visible reading time had higher engagement — readers are more likely to start an article when they know the time commitment upfront. Based on their data, the ideal blog post length for engagement is 7 minutes (approximately 1,600 words). This feature has since been adopted by virtually every major content platform including WordPress, Substack, and dev.to.",
  },
  {
    question: "How fast do speed readers actually read?",
    answer:
      "Trained speed readers can reach 400–700 WPM with good comprehension (about 70%). Claims of 1,000+ WPM are generally associated with significant comprehension loss. A 2016 study in Psychological Science in the Public Interest found that speed reading techniques (skimming, meta-guiding, reducing subvocalization) can increase speed but inevitably reduce comprehension for complex material. For most purposes, reading at your natural pace with full comprehension is more effective than speed reading with partial understanding.",
  },
  {
    question: "Does text difficulty affect reading time?",
    answer:
      "Yes, significantly. Technical, scientific, and legal texts take 30–50% longer to read than general content. This calculator offers a content type selector that adjusts WPM accordingly: general content uses 238 WPM, technical content uses 180 WPM, and academic content uses 150 WPM. Factors that slow reading include unfamiliar vocabulary, complex sentence structures, dense data (tables, figures), and subject matter that requires re-reading for comprehension.",
  },
];

/* ────────────── Types ────────────── */

type ContentType = "general" | "technical" | "academic";

interface ContentTypeOption {
  value: ContentType;
  label: string;
  wpm: number;
  speakingWpm: number;
  description: string;
}

/* ────────────── Constants ────────────── */

const contentTypes: ContentTypeOption[] = [
  { value: "general", label: "General / Blog", wpm: 238, speakingWpm: 150, description: "Blog posts, news, fiction, casual content" },
  { value: "technical", label: "Technical", wpm: 180, speakingWpm: 140, description: "Code docs, technical guides, engineering" },
  { value: "academic", label: "Academic / Scientific", wpm: 150, speakingWpm: 130, description: "Research papers, textbooks, legal" },
];

/* ────────────── Helpers ────────────── */

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  let count = 0;
  const vowels = "aeiouy";
  let prevIsVowel = false;
  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevIsVowel) count++;
    prevIsVowel = isVowel;
  }
  if (w.endsWith("e") && count > 1) count--;
  return Math.max(1, count);
}

function calculateFleschKincaid(words: number, sentences: number, syllables: number) {
  if (words === 0 || sentences === 0) return { score: 0, grade: 0, label: "N/A" };
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  const clampedScore = Math.max(0, Math.min(100, score));

  let label = "Very Difficult";
  if (clampedScore >= 90) label = "Very Easy";
  else if (clampedScore >= 80) label = "Easy";
  else if (clampedScore >= 70) label = "Fairly Easy";
  else if (clampedScore >= 60) label = "Standard";
  else if (clampedScore >= 50) label = "Fairly Difficult";
  else if (clampedScore >= 30) label = "Difficult";

  return { score: Math.round(clampedScore), grade: Math.max(0, Math.round(grade * 10) / 10), label };
}

function formatTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return `${h} hr ${m} min`;
}

/* ────────────────────── Component ────────────────────── */

export default function ReadingTimeCalculator() {
  const [text, setText] = useState<string>("");
  const [contentType, setContentType] = useState<ContentType>("general");
  const [customWpm, setCustomWpm] = useState<string>("");

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const content = text.trim();

    /* Word count */
    const wordsArray = content.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = wordsArray.length;

    /* Character counts */
    const charCount = content.length;
    const charCountNoSpaces = content.replace(/\s/g, "").length;

    /* Sentence count */
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;

    /* Paragraph count */
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const paragraphCount = Math.max(1, paragraphs.length);

    /* Syllable count */
    let totalSyllables = 0;
    wordsArray.forEach((w) => {
      totalSyllables += countSyllables(w);
    });

    /* Average word length */
    const avgWordLength = charCountNoSpaces / Math.max(1, wordCount);

    /* Average sentence length */
    const avgSentenceLength = wordCount / Math.max(1, sentenceCount);

    /* Readability */
    const readability = calculateFleschKincaid(wordCount, sentenceCount, totalSyllables);

    /* Time calculations */
    const selectedType = contentTypes.find((t) => t.value === contentType)!;
    const wpm = customWpm ? parseInt(customWpm, 10) : selectedType.wpm;
    const speakingWpm = selectedType.speakingWpm;

    const readingTimeMinutes = wordCount / (wpm || 238);
    const speakingTimeMinutes = wordCount / speakingWpm;

    /* Page estimates */
    const pagesDoubleSpaced = wordCount / 250;
    const pagesSingleSpaced = wordCount / 500;

    return {
      wordCount,
      charCount,
      charCountNoSpaces,
      sentenceCount,
      paragraphCount,
      totalSyllables,
      avgWordLength: avgWordLength.toFixed(1),
      avgSentenceLength: avgSentenceLength.toFixed(1),
      readability,
      readingTimeMinutes,
      speakingTimeMinutes,
      pagesDoubleSpaced: pagesDoubleSpaced.toFixed(1),
      pagesSingleSpaced: pagesSingleSpaced.toFixed(1),
      wpm: wpm || 238,
    };
  }, [text, contentType, customWpm]);

  return (
    <ToolLayout
      title="Reading Time Calculator"
      description="Estimate how long it takes to read or speak any piece of text. Paste your content to get reading time, speaking time, word count, and readability analysis. Perfect for bloggers, students, presenters, and content creators."
      category={{ name: "Text Tools", slug: "text-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Paste your text", text: "Copy and paste the text you want to analyze into the text area. The calculator works with any length of content from a tweet to a full book chapter." },
        { name: "Select content type", text: "Choose the content type (general, technical, or academic) to adjust the reading speed estimate. You can also set a custom WPM if you know your reading speed." },
        { name: "Review your results", text: "View the estimated reading time, speaking time, word count, character count, sentence count, and Flesch-Kincaid readability score. Use these insights to optimize your content." },
      ]}
      relatedTools={[
        { name: "Word Counter", href: "/word-counter" },
        { name: "Character Counter", href: "/character-counter" },
        { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator" },
        { name: "Text Case Converter", href: "/text-case-converter" },
        { name: "Slug Generator", href: "/slug-generator" },
      ]}
      content={
        <>
          <h2>What Is a Reading Time Calculator?</h2>
          <p>
            A reading time calculator estimates how long it takes to read a given piece of text based on word count and average reading speed. It is used by content creators, bloggers, students, and public speakers to gauge the length of their content in minutes rather than words. Platforms like Medium, WordPress, and dev.to display reading time on every article because research shows readers are more likely to engage with content when they know the time commitment upfront.
          </p>

          <h2>How Is Reading Time Calculated?</h2>
          <p>
            The formula is simple:
          </p>
          <p>
            <strong>Reading Time (minutes) = Total Words ÷ Words Per Minute (WPM)</strong>
          </p>
          <p>
            The key variable is <strong>WPM</strong> — the average number of words a person reads per minute. A 2019 meta-analysis by Brysbaert, published in the <em>Journal of Memory and Language</em>, analyzed 190 studies involving 18,573 participants and established the average adult silent reading speed at <strong>238 WPM</strong> for non-fiction in English. This is the default used in this calculator.
          </p>

          <h3>Worked Example</h3>
          <p>
            For a blog post with <strong>1,500 words</strong> at the default 238 WPM:
          </p>
          <ul>
            <li><strong>Reading time:</strong> 1,500 ÷ 238 = <strong>6.3 minutes</strong> (displayed as &ldquo;6 min&rdquo;)</li>
            <li><strong>Speaking time:</strong> 1,500 ÷ 150 = <strong>10 minutes</strong></li>
            <li><strong>Pages (double-spaced):</strong> 1,500 ÷ 250 = <strong>6 pages</strong></li>
          </ul>

          <h2>Average Reading Speeds by Content Type</h2>
          <table>
            <thead>
              <tr>
                <th>Content Type</th>
                <th>Average WPM</th>
                <th>Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Easy fiction</td><td>250–300</td><td>Novels, short stories, casual blogs</td></tr>
              <tr><td>General non-fiction</td><td>200–250</td><td>News, blog posts, magazines</td></tr>
              <tr><td>Technical documentation</td><td>150–200</td><td>API docs, manuals, code tutorials</td></tr>
              <tr><td>Academic / scientific</td><td>100–150</td><td>Research papers, textbooks, legal documents</td></tr>
              <tr><td>Screen reading</td><td>175–200</td><td>Websites, emails (25% slower than paper)</td></tr>
            </tbody>
          </table>

          <h2>Reading Time vs. Speaking Time</h2>
          <p>
            Silent reading and speaking use different cognitive processes. The average speaking rate is <strong>130–150 words per minute</strong>, significantly slower than silent reading. This difference matters for:
          </p>
          <ul>
            <li><strong>Presentations:</strong> A 10-minute talk needs ~1,300–1,500 words of script</li>
            <li><strong>Podcasts:</strong> A 30-minute episode covers ~4,000–4,500 words</li>
            <li><strong>Audiobooks:</strong> Typically narrated at 150–160 WPM; a 70,000-word novel takes ~7.5 hours</li>
            <li><strong>TED Talks:</strong> Average 18 minutes at 130–170 WPM = 2,300–3,000 words</li>
          </ul>

          <h2>Why Reading Time Matters for Content Strategy</h2>
          <p>
            Research from Medium&apos;s data science team (2013) found that the <strong>ideal blog post length for maximum engagement is 7 minutes</strong> (approximately 1,600 words). Articles under 3 minutes had high bounce rates, while articles over 14 minutes saw declining completion rates. However, &ldquo;ideal length&rdquo; varies by topic and audience:
          </p>
          <ul>
            <li><strong>SEO-focused articles:</strong> 1,500–2,500 words (7–10 min) tend to rank better because they cover topics comprehensively</li>
            <li><strong>Social media posts:</strong> Under 1 minute reading time for maximum shares</li>
            <li><strong>Email newsletters:</strong> 200–500 words (1–2 min) for highest open-to-click rates</li>
            <li><strong>Long-form guides:</strong> 3,000–5,000 words for building topical authority (these are the pages that earn backlinks)</li>
          </ul>

          <h2>Understanding the Flesch-Kincaid Readability Score</h2>
          <p>
            This calculator includes a <strong>Flesch-Kincaid readability score</strong> (0–100), which measures how easy your text is to understand based on sentence length and syllable count. Higher scores mean easier reading:
          </p>
          <ul>
            <li><strong>90–100:</strong> Very easy — 5th-grade level. Simple sentences, common words.</li>
            <li><strong>80–89:</strong> Easy — 6th-grade level. Conversational English.</li>
            <li><strong>70–79:</strong> Fairly easy — 7th-grade level. Standard journalism.</li>
            <li><strong>60–69:</strong> Standard — 8th–9th grade. Average difficulty for most adults.</li>
            <li><strong>50–59:</strong> Fairly difficult — 10th–12th grade. Advanced content.</li>
            <li><strong>30–49:</strong> Difficult — College level. Academic and technical writing.</li>
            <li><strong>0–29:</strong> Very difficult — Graduate level. Legal and scientific papers.</li>
          </ul>
          <p>
            For web content, aim for a score of <strong>60–70</strong> (8th–9th grade level). Most successful blogs and news sites write at this level — not because their audience is uneducated, but because simpler writing is faster to process and more engaging on screens.
          </p>

          <h2>Words to Pages Conversion</h2>
          <table>
            <thead>
              <tr>
                <th>Word Count</th>
                <th>Pages (Single-Spaced)</th>
                <th>Pages (Double-Spaced)</th>
                <th>Reading Time</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>250</td><td>0.5</td><td>1</td><td>~1 min</td></tr>
              <tr><td>500</td><td>1</td><td>2</td><td>~2 min</td></tr>
              <tr><td>1,000</td><td>2</td><td>4</td><td>~4 min</td></tr>
              <tr><td>1,500</td><td>3</td><td>6</td><td>~6 min</td></tr>
              <tr><td>2,000</td><td>4</td><td>8</td><td>~8 min</td></tr>
              <tr><td>3,000</td><td>6</td><td>12</td><td>~13 min</td></tr>
              <tr><td>5,000</td><td>10</td><td>20</td><td>~21 min</td></tr>
            </tbody>
          </table>

          <h2>Sources and References</h2>
          <ul>
            <li>Brysbaert, M. (2019). &ldquo;How many words do we read per minute? A review and meta-analysis of reading rate.&rdquo; <em>Journal of Memory and Language</em>, 109, 104047.</li>
            <li>Rayner, K., et al. (2016). &ldquo;So Much to Read, So Little Time: How Do We Read, and Can Speed Reading Help?&rdquo; <em>Psychological Science in the Public Interest</em>, 17(1), 4–34.</li>
            <li>Medium Data Lab (2013). &ldquo;The Optimal Post is 7 Minutes.&rdquo; Blog post analyzing 74 million words across Medium articles.</li>
            <li>Flesch, R. (1948). &ldquo;A new readability yardstick.&rdquo; <em>Journal of Applied Psychology</em>, 32(3), 221–233.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Text Area ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Paste Your Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here to calculate reading time, speaking time, and readability..."
            rows={10}
            className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y leading-relaxed"
          />
          {text.trim() && (
            <div className="flex justify-end mt-1">
              <button
                onClick={() => setText("")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear text
              </button>
            </div>
          )}
        </div>

        {/* ── Content Type Selector ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Content Type
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {contentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => { setContentType(type.value); setCustomWpm(""); }}
                className={`rounded-lg border px-4 py-3 text-left transition-all ${
                  contentType === type.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-sm font-medium text-foreground">{type.label}</div>
                <div className="text-xs text-muted-foreground">{type.wpm} WPM</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Custom WPM (optional) ── */}
        <div className="rounded-lg border border-border p-4 bg-muted/20">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Custom Reading Speed (optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              value={customWpm}
              onChange={(e) => setCustomWpm(e.target.value)}
              placeholder={`Default: ${contentTypes.find((t) => t.value === contentType)?.wpm} WPM`}
              min="50"
              max="1000"
              className="flex-1 rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">words/min</span>
          </div>
        </div>

        {/* ── Results ── */}
        {analysis && (
          <div className="space-y-4">
            {/* Primary stats */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border-2 border-primary bg-primary/5 p-5 text-center">
                <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{formatTime(analysis.readingTimeMinutes)}</p>
                <p className="text-sm text-muted-foreground">Reading Time</p>
                <p className="text-xs text-muted-foreground mt-1">at {analysis.wpm} WPM</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
                <Mic className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{formatTime(analysis.speakingTimeMinutes)}</p>
                <p className="text-sm text-muted-foreground">Speaking Time</p>
                <p className="text-xs text-muted-foreground mt-1">at {contentTypes.find((t) => t.value === contentType)?.speakingWpm} WPM</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
                <Type className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{analysis.wordCount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Words</p>
                <p className="text-xs text-muted-foreground mt-1">{analysis.charCountNoSpaces.toLocaleString()} chars</p>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Detailed Analysis
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Characters (with spaces)</span>
                  <span className="font-medium text-foreground">{analysis.charCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Characters (no spaces)</span>
                  <span className="font-medium text-foreground">{analysis.charCountNoSpaces.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Sentences</span>
                  <span className="font-medium text-foreground">{analysis.sentenceCount}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Paragraphs</span>
                  <span className="font-medium text-foreground">{analysis.paragraphCount}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Avg. Word Length</span>
                  <span className="font-medium text-foreground">{analysis.avgWordLength} chars</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Avg. Sentence Length</span>
                  <span className="font-medium text-foreground">{analysis.avgSentenceLength} words</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Pages (single-spaced)</span>
                  <span className="font-medium text-foreground">{analysis.pagesSingleSpaced}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border">
                  <span className="text-muted-foreground">Pages (double-spaced)</span>
                  <span className="font-medium text-foreground">{analysis.pagesDoubleSpaced}</span>
                </div>
              </div>
            </div>

            {/* Readability */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-primary" />
                Readability Score
              </h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-3xl font-bold text-foreground">{analysis.readability.score}</div>
                <div>
                  <div className="text-sm font-medium text-foreground">{analysis.readability.label}</div>
                  <div className="text-xs text-muted-foreground">
                    Flesch-Kincaid Grade Level: {analysis.readability.grade}
                  </div>
                </div>
              </div>
              {/* Visual bar */}
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${analysis.readability.score}%`,
                    background: analysis.readability.score >= 60
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : analysis.readability.score >= 30
                        ? "linear-gradient(90deg, #eab308, #f59e0b)"
                        : "linear-gradient(90deg, #ef4444, #dc2626)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Difficult</span>
                <span className="text-xs text-muted-foreground">Easy</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!analysis && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Paste your text above to see reading time, speaking time, and readability analysis</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
