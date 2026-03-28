"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { FileText, Clock, Type, Copy, Check, Trash2 } from "lucide-react";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
  longestWord: string;
  averageWordLength: number;
}

const faqs: FAQItem[] = [
  {
    question: "How are words counted?",
    answer: "Words are counted by splitting the text at spaces and filtering out empty strings. Hyphenated words count as one word (e.g., 'well-known' is one word). Numbers and abbreviations are counted as words. Punctuation attached to words doesn't affect the count."
  },
  {
    question: "How is reading time calculated?",
    answer: "Reading time is calculated based on an average reading speed of 200-250 words per minute for adult readers. We use 225 words per minute as the standard, which accounts for comprehension. Technical or dense content may take longer to read, while simple content may be faster."
  },
  {
    question: "What's the Twitter character limit?",
    answer: "Twitter (now X) allows 280 characters per tweet for most users. Our character counter includes spaces in the count, which matches Twitter's counting method. Links take up 23 characters regardless of their actual length. For Twitter Blue subscribers, the limit is extended to 25,000 characters."
  },
  {
    question: "How are sentences counted?",
    answer: "Sentences are counted by detecting end punctuation marks (periods, question marks, and exclamation points). Multiple punctuation marks (like '...') are counted as one sentence ending. Abbreviations with periods (Dr., Mr., etc.) may occasionally cause slight overcounting."
  },
  {
    question: "How are paragraphs counted?",
    answer: "Paragraphs are counted by detecting text blocks separated by blank lines (two or more consecutive line breaks). A single line break doesn't start a new paragraph. Text with no blank lines is counted as one paragraph."
  },
  {
    question: "Does the word counter work with different languages?",
    answer: "Yes, the word counter works with most languages that use spaces to separate words, including English, Spanish, French, German, and many others. For languages without spaces between words (like Chinese, Japanese, or Thai), character counting is more useful than word counting."
  },
];

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo((): TextStats => {
    if (!text.trim()) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        longestWord: "",
        averageWordLength: 0,
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    
    // Words: split by whitespace and filter empty strings
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
    const words = wordsArray.length;
    
    // Sentences: count by period, question mark, exclamation mark
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Paragraphs: count by double line breaks or more
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);
    
    // Reading time: average 225 words per minute
    const readingTime = Math.ceil(words / 225);
    
    // Speaking time: average 150 words per minute
    const speakingTime = Math.ceil(words / 150);
    
    // Longest word (only letters, ignoring punctuation)
    const cleanWords = wordsArray.map(w => w.replace(/[^a-zA-Z]/g, "")).filter(w => w.length > 0);
    const longestWord = cleanWords.reduce((a, b) => a.length > b.length ? a : b, "");
    
    // Average word length
    const totalWordLength = cleanWords.reduce((sum, word) => sum + word.length, 0);
    const averageWordLength = cleanWords.length > 0 ? totalWordLength / cleanWords.length : 0;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      longestWord,
      averageWordLength,
    };
  }, [text]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearText = () => {
    setText("");
  };

  const sampleText = () => {
    setText(`The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the English alphabet at least once.

Writing effective content requires understanding your audience. Whether you're crafting a blog post, academic essay, or social media update, knowing your word count helps you stay within guidelines and maintain reader engagement.

Studies show that online readers prefer content between 1,500 and 2,500 words for in-depth articles, while social media posts perform best when kept concise. This word counter helps you optimize your writing for any platform.`);
  };

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in your text. Estimate reading and speaking time for better content planning. Free online tool for writers, students, and content creators."
      category={{ name: "Text Tools", slug: "text-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Text Case Converter", href: "/text-case-converter" },
        { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator" },
        { name: "Password Generator", href: "/password-generator" },
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      content={
        <>
          <h2>Why Word Count Matters</h2>
          <p>
            Whether you&apos;re writing an essay, blog post, tweet, or email, word count directly impacts your content&apos;s effectiveness. Different platforms and purposes have optimal word counts, and understanding these can help you communicate more effectively.
          </p>

          <h2>Optimal Word Counts by Content Type</h2>
          
          <h3>Social Media Posts</h3>
          <ul>
            <li><strong>Twitter/X:</strong> 71-100 characters get the most engagement, though the limit is 280</li>
            <li><strong>Facebook:</strong> Posts under 80 characters receive 66% more engagement</li>
            <li><strong>LinkedIn:</strong> 25-50 words for posts; 1,900-2,000 words for articles</li>
            <li><strong>Instagram:</strong> 138-150 characters for captions; up to 2,200 allowed</li>
          </ul>

          <h3>Blog Posts and Articles</h3>
          <ul>
            <li><strong>Quick reads:</strong> 300-600 words for news updates and quick tips</li>
            <li><strong>Standard blog posts:</strong> 1,000-1,500 words for most topics</li>
            <li><strong>In-depth articles:</strong> 2,000-2,500 words for comprehensive coverage</li>
            <li><strong>Ultimate guides:</strong> 3,000-5,000+ words for authoritative, detailed content</li>
          </ul>

          <h3>Academic Writing</h3>
          <ul>
            <li><strong>Abstract:</strong> 150-300 words</li>
            <li><strong>Short essay:</strong> 500-1,000 words</li>
            <li><strong>Standard essay:</strong> 1,500-2,500 words</li>
            <li><strong>Research paper:</strong> 3,000-6,000 words</li>
            <li><strong>Thesis:</strong> 10,000-20,000 words (varies by institution)</li>
          </ul>

          <h3>Professional Writing</h3>
          <ul>
            <li><strong>Email subject lines:</strong> 6-10 words for best open rates</li>
            <li><strong>Press releases:</strong> 400-500 words</li>
            <li><strong>Cover letters:</strong> 250-400 words</li>
            <li><strong>Product descriptions:</strong> 100-200 words for e-commerce</li>
          </ul>

          <h2>Understanding Reading Time</h2>
          <p>
            The average adult reads at approximately 200-250 words per minute (wpm). However, this varies based on content complexity and reader familiarity with the subject:
          </p>
          <ul>
            <li><strong>Fiction/light reading:</strong> 250-300 wpm</li>
            <li><strong>Non-fiction/blogs:</strong> 200-250 wpm</li>
            <li><strong>Technical content:</strong> 100-150 wpm</li>
            <li><strong>Legal/academic:</strong> 50-100 wpm</li>
          </ul>
          <p>
            Including estimated reading time in your content helps readers decide whether to invest their time and sets appropriate expectations.
          </p>

          <h2>Speaking Time Guidelines</h2>
          <p>
            If you&apos;re preparing a speech or presentation, speaking time is crucial for staying within time limits:
          </p>
          <ul>
            <li><strong>Slow pace:</strong> 100-120 words per minute (formal speeches, presentations)</li>
            <li><strong>Moderate pace:</strong> 130-150 words per minute (general conversation)</li>
            <li><strong>Fast pace:</strong> 150-170 words per minute (excited, informal)</li>
          </ul>
          <p>
            For important presentations, practice with a timer rather than relying solely on word count estimates.
          </p>

          <h2>SEO and Content Length</h2>
          <p>
            Search engines like Google don&apos;t have a minimum word count requirement, but longer, comprehensive content often ranks better because it:
          </p>
          <ul>
            <li>Provides more value to readers</li>
            <li>Naturally includes more relevant keywords</li>
            <li>Tends to earn more backlinks</li>
            <li>Keeps visitors on the page longer</li>
          </ul>
          <p>
            However, quality always trumps quantity. A well-written 1,000-word article will outperform a padded 3,000-word article every time. Focus on thoroughly answering your readers&apos; questions rather than hitting an arbitrary word count.
          </p>

          <h2>Tips for Better Writing</h2>
          
          <h3>Avoiding Wordiness</h3>
          <ul>
            <li>Replace &quot;in order to&quot; with &quot;to&quot;</li>
            <li>Replace &quot;due to the fact that&quot; with &quot;because&quot;</li>
            <li>Replace &quot;at this point in time&quot; with &quot;now&quot;</li>
            <li>Remove unnecessary adverbs like &quot;very,&quot; &quot;really,&quot; &quot;actually&quot;</li>
            <li>Use active voice instead of passive voice</li>
          </ul>

          <h3>Improving Readability</h3>
          <ul>
            <li>Keep sentences under 20 words when possible</li>
            <li>Vary sentence length for rhythm</li>
            <li>Use short paragraphs (3-4 sentences)</li>
            <li>Include subheadings every 300-400 words</li>
            <li>Use bullet points for lists</li>
          </ul>

          <h2>Character Count Limits</h2>
          <p>
            Many platforms have specific character limits. Here&apos;s a quick reference:
          </p>
          <ul>
            <li><strong>Twitter/X:</strong> 280 characters (25,000 for premium)</li>
            <li><strong>Instagram bio:</strong> 150 characters</li>
            <li><strong>LinkedIn headline:</strong> 220 characters</li>
            <li><strong>Google title tag:</strong> 50-60 characters</li>
            <li><strong>Meta description:</strong> 150-160 characters</li>
            <li><strong>SMS:</strong> 160 characters</li>
            <li><strong>YouTube title:</strong> 100 characters</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Text Input Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">
              Enter or paste your text
            </label>
            <div className="flex gap-2">
              <button
                onClick={sampleText}
                className="text-xs text-primary hover:underline"
              >
                Load Sample
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here to count words, characters, and more..."
            className="w-full h-64 rounded-xl border border-border bg-white dark:bg-muted/30 p-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-muted-foreground">
              {stats.words} words | {stats.characters} characters
            </div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button onClick={clearText} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <ResultsGrid columns={4}>
          <ResultCard label="Words" value={stats.words.toLocaleString()} highlight />
          <ResultCard label="Characters" value={stats.characters.toLocaleString()} />
          <ResultCard label="Characters (no spaces)" value={stats.charactersNoSpaces.toLocaleString()} />
          <ResultCard label="Sentences" value={stats.sentences.toLocaleString()} />
        </ResultsGrid>

        {/* Time Estimates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reading Time</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.readingTime === 0 ? "< 1" : stats.readingTime} min
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Based on 225 words/minute</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Speaking Time</p>
                <p className="text-xl font-bold text-foreground">
                  {stats.speakingTime === 0 ? "< 1" : stats.speakingTime} min
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Based on 150 words/minute</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Text Analysis
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Paragraphs</p>
              <p className="text-lg font-semibold text-foreground">{stats.paragraphs}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Word Length</p>
              <p className="text-lg font-semibold text-foreground">{stats.averageWordLength.toFixed(1)} chars</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longest Word</p>
              <p className="text-lg font-semibold text-foreground break-all">
                {stats.longestWord || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Sentence</p>
              <p className="text-lg font-semibold text-foreground">
                {stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0} words
              </p>
            </div>
          </div>
        </div>

        {/* Platform Character Limits */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-4">Character Limit Reference</h3>
          <div className="space-y-3">
            {[
              { platform: "Twitter/X", limit: 280 },
              { platform: "Instagram Bio", limit: 150 },
              { platform: "SMS", limit: 160 },
              { platform: "Meta Description", limit: 160 },
            ].map(({ platform, limit }) => {
              const percentage = Math.min((stats.characters / limit) * 100, 100);
              const isOver = stats.characters > limit;
              return (
                <div key={platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{platform}</span>
                    <span className={isOver ? "text-red-500 font-medium" : "text-foreground"}>
                      {stats.characters}/{limit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isOver ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
