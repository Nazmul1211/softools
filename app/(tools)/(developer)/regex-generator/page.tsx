"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { ResultCard } from "@/components/ui/ResultCard";
import {
  Zap,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "What does ^ and $ mean in regex?",
    answer:
      "^ means the start of a string, and $ means the end. So ^hello$ matches only the exact string &quot;hello&quot;, not &quot;say hello&quot; or &quot;hello there&quot;. Without them, the pattern matches anywhere in the string. Use these anchors for validation where you need exact matches.",
  },
  {
    question: "What&apos;s the difference between . and \\d?",
    answer:
      ". (dot) matches any single character except newline. \\d matches only digits (0-9). Similarly, \\w matches word characters (letters, digits, underscore), and \\s matches whitespace. The case-insensitive versions are \\D (non-digits), \\W (non-word), and \\S (non-whitespace).",
  },
  {
    question: "How do I make a regex case-insensitive?",
    answer:
      "Add the &apos;i&apos; flag at the end: /pattern/i. In JavaScript, use the RegExp constructor: new RegExp(pattern, &apos;i&apos;). This makes the pattern match both uppercase and lowercase characters. You can combine flags like /pattern/gi for global and case-insensitive matching.",
  },
  {
    question: "What does ?, *, and + do?",
    answer:
      "These are quantifiers: ? means 0 or 1 occurrence (optional), * means 0 or more, and + means 1 or more. For example, /colou?r/ matches both &apos;color&apos; and &apos;colour&apos;. Use {n,m} for specific ranges, like {2,4} for 2 to 4 occurrences, {3,} for 3 or more.",
  },
  {
    question: "What are capture groups and why use them?",
    answer:
      "Capture groups are sections of a regex wrapped in parentheses: (group). They extract specific parts of matched text. For example, /(\\d{3})-(\\d{4})/ on a phone number captures the area code and number separately. Use $1, $2, etc. to reference captured groups in replacements.",
  },
  {
    question: "How do I exclude certain patterns?",
    answer:
      "Use negative lookahead (?!pattern) or negative lookbehind (?&lt;!pattern). For example, /(?!admin)\\w+/ matches any word that doesn&apos;t start with &apos;admin&apos;. Character exclusion uses [^abc] to match anything except a, b, or c. Use these cautiously as they can be complex to read.",
  },
];

/* ────────────── Common Regex Patterns ────────────── */

interface RegexTemplate {
  name: string;
  pattern: string;
  explanation: string;
  examples: { match: boolean; text: string }[];
}

const templates: RegexTemplate[] = [
  {
    name: "Email Address",
    pattern: "/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/",
    explanation:
      "Matches standard email format: username@domain.extension. Allows letters, numbers, dots, underscores, and hyphens.",
    examples: [
      { match: true, text: "john@example.com" },
      { match: true, text: "user.name+tag@domain.co.uk" },
      { match: false, text: "invalid.email@" },
      { match: false, text: "@nodomain.com" },
    ],
  },
  {
    name: "URL (HTTP/HTTPS)",
    pattern: "/^https?:\\/\\/[\\w.-]+\\.[a-z]{2,}(\\/.*)?(\\?.*)?$/i",
    explanation:
      "Matches URLs starting with http:// or https:// followed by domain and optional path and query string.",
    examples: [
      { match: true, text: "https://example.com" },
      { match: true, text: "https://example.com/path?query=value" },
      { match: false, text: "not a url" },
      { match: false, text: "ftp://example.com" },
    ],
  },
  {
    name: "Phone Number (US Format)",
    pattern: "/^\\(\\d{3}\\) \\d{3}-\\d{4}$/",
    explanation:
      "Matches US phone format: (123) 456-7890. Requires area code in parentheses.",
    examples: [
      { match: true, text: "(555) 123-4567" },
      { match: false, text: "555-123-4567" },
      { match: false, text: "(555)123-4567" },
    ],
  },
  {
    name: "IPv4 Address",
    pattern: "/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/",
    explanation:
      "Matches valid IPv4 addresses (0-255 for each octet). Validates that each number is between 0 and 255.",
    examples: [
      { match: true, text: "192.168.1.1" },
      { match: true, text: "255.255.255.255" },
      { match: false, text: "256.1.1.1" },
      { match: false, text: "192.168.1" },
    ],
  },
  {
    name: "Password (8+ chars, mixed case, number)",
    pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/",
    explanation:
      "Requires minimum 8 characters with at least one lowercase, one uppercase, and one digit using lookaheads.",
    examples: [
      { match: true, text: "Password123" },
      { match: false, text: "password123" },
      { match: false, text: "Password" },
      { match: false, text: "Pass1" },
    ],
  },
  {
    name: "Hexadecimal Color",
    pattern: "/^#[0-9A-Fa-f]{6}$/",
    explanation:
      "Matches hex color codes starting with # followed by exactly 6 hexadecimal characters (0-9, A-F).",
    examples: [
      { match: true, text: "#FF5733" },
      { match: true, text: "#abc123" },
      { match: false, text: "#GGGGGG" },
      { match: false, text: "#FF57" },
    ],
  },
  {
    name: "Date (YYYY-MM-DD)",
    pattern: "/^\\d{4}-\\d{2}-\\d{2}$/",
    explanation:
      "Matches dates in ISO format: 2024-04-15. Does not validate if date is actually valid.",
    examples: [
      { match: true, text: "2024-04-15" },
      { match: true, text: "1999-12-31" },
      { match: false, text: "04-15-2024" },
      { match: false, text: "2024/04/15" },
    ],
  },
  {
    name: "Positive Integer",
    pattern: "/^\\d+$/",
    explanation: "Matches one or more digits. \\d is any digit (0-9).",
    examples: [
      { match: true, text: "12345" },
      { match: true, text: "0" },
      { match: false, text: "-123" },
      { match: false, text: "12.34" },
    ],
  },
];

/* ────────────── Component ────────────────────── */

export default function RegexGenerator() {
  const [pattern, setPattern] = useState<string>("^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  const [flags, setFlags] = useState<string>("g");
  const [testText, setTestText] = useState<string>("john@example.com\ninvalid.email@\ntest@domain.co.uk");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Email Address");
  const [copied, setCopied] = useState<boolean>(false);

  // Parse regex and test
  const { regex, error, matches } = useMemo(() => {
    try {
      // Remove leading and trailing slashes if present
      let cleanPattern = pattern;
      let cleanFlags = flags;

      if (cleanPattern.startsWith("/") && cleanPattern.lastIndexOf("/") > 0) {
        const lastSlash = cleanPattern.lastIndexOf("/");
        cleanFlags = cleanPattern.substring(lastSlash + 1);
        cleanPattern = cleanPattern.substring(1, lastSlash);
      }

      const regex = new RegExp(cleanPattern, cleanFlags);
      const matchResults: any[] = [];

      if (flags.includes("g")) {
        let match;
        const re = new RegExp(cleanPattern, cleanFlags);
        while ((match = re.exec(testText)) !== null) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            line: testText.substring(0, match.index).split("\n").length,
          });
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          matchResults.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            line: testText.substring(0, match.index).split("\n").length,
          });
        }
      }

      return { regex, error: null, matches: matchResults };
    } catch (e) {
      return {
        regex: null,
        error: e instanceof Error ? e.message : "Invalid regex",
        matches: [],
      };
    }
  }, [pattern, flags, testText]);

  const matchCount = matches.length;
  const hasMatches = matchCount > 0;

  const copyPatternToClipboard = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = templates.find((t) => t.name === templateName);
    if (template) {
      // Extract pattern from template pattern string
      const match = template.pattern.match(/^\/(.+?)\/([gimsu]*)$/);
      if (match) {
        setPattern(match[1]);
        setFlags(match[2] || "g");
      }
    }
  };

  return (
    <ToolLayout
      title="Regex Generator & Tester"
      slug="regex-generator"
      description="Test and generate regular expressions. Includes common patterns for email, URL, phone numbers, passwords, and dates. See matches and captured groups instantly."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Select or write a regex", text: "Choose a template from the common patterns, or type your own regex pattern. Patterns are written without delimiters (e.g., ^[a-z]+$)." },
        { name: "Set flags", text: "Choose flags: g (global - find all matches), i (case-insensitive), m (multiline), or combine them (e.g., gi)." },
        { name: "Enter test text", text: "Paste text you want to test against the regex. Test multiple examples to verify the pattern works correctly." },
        { name: "Review matches", text: "See all matches highlighted with line numbers, captured groups, and the match index. Errors are shown in red." },
      ]}
      relatedTools={[
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "URL Encoder", href: "/url-encoder" },
        { name: "Color Converter", href: "/color-converter" },
        { name: "MD5 Hash Generator", href: "/md5-hash-generator" },
      ]}
      content={
        <>
          <h2>What Is a Regular Expression?</h2>
          <p>
            A regular expression (regex or regexp) is a sequence of characters that defines a search pattern. Regex is used for text validation, searching, and pattern matching across virtually every programming language. For example, you can use regex to validate email addresses, extract phone numbers, or find and replace text patterns.
          </p>

          <h2>Regex Syntax Basics</h2>
          <p>
            Basic regex building blocks:
          </p>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Meaning</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>.</td><td>Any single character (except newline)</td><td>c.t matches cat, cut, cot</td></tr>
              <tr><td>*</td><td>0 or more of preceding character</td><td>ca*t matches ct, cat, caat</td></tr>
              <tr><td>+</td><td>1 or more of preceding character</td><td>ca+t matches cat, caat (not ct)</td></tr>
              <tr><td>?</td><td>0 or 1 of preceding character</td><td>ca?t matches ct, cat (not caat)</td></tr>
              <tr><td>^</td><td>Start of string</td><td>^hello matches hello at the beginning</td></tr>
              <tr><td>$</td><td>End of string</td><td>end$ matches end at the end</td></tr>
              <tr><td>[abc]</td><td>Any one character in brackets</td><td>[aeiou] matches any vowel</td></tr>
              <tr><td>[a-z]</td><td>Range of characters</td><td>[a-z] matches any lowercase letter</td></tr>
              <tr><td>\\d</td><td>Digit (0-9)</td><td>\\d+ matches 123, 456</td></tr>
              <tr><td>\\w</td><td>Word character [a-zA-Z0-9_]</td><td>\\w+ matches words</td></tr>
              <tr><td>\\s</td><td>Whitespace character</td><td>\\s matches spaces, tabs</td></tr>
              <tr><td>|</td><td>OR</td><td>cat|dog matches cat or dog</td></tr>
            </tbody>
          </table>

          <h2>Worked Example: Email Validation</h2>
          <p>
            Pattern: <code>{`^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`}</code>
          </p>
          <ul>
            <li><code>^</code> — Start of string</li>
            <li><code>[a-zA-Z0-9._%-]+</code> — One or more letters, digits, dots, underscores, percent, or hyphen (username part)</li>
            <li><code>@</code> — Literal @</li>
            <li><code>[a-zA-Z0-9.-]+</code> — One or more letters, digits, dots, or hyphens (domain)</li>
            <li><code>{`\\.`}</code> — Literal dot (escaped)</li>
            <li><code>{`[a-zA-Z]{2,}`}</code> — 2 or more letters (TLD like .com, .org)</li>
            <li><code>$</code> — End of string</li>
          </ul>
          <p>
            Matches: john@example.com, user+tag@domain.co.uk
            <br />
            Does not match: invalid.email@, @nodomain.com
          </p>

          <h2>Flags and Modifiers</h2>
          <p>
            Flags modify how regex behaves:
          </p>
          <ul>
            <li><strong>g (global):</strong> Find all matches, not just the first. Required to find multiple matches.</li>
            <li><strong>i (case-insensitive):</strong> Match ignores uppercase/lowercase differences.</li>
            <li><strong>m (multiline):</strong> ^ and $ match line beginnings/endings, not just string start/end.</li>
            <li><strong>s (dotall):</strong> . (dot) also matches newline characters.</li>
            <li><strong>u (unicode):</strong> Treat pattern as Unicode sequence.</li>
          </ul>

          <h2>Capture Groups and Backreferences</h2>
          <p>
            Parentheses create capture groups:
          </p>
          <pre><code>{`Pattern: (\\d{3})-(\\d{2})-(\\d{4})
Text: 123-45-6789
Group 1: 123
Group 2: 45
Group 3: 6789`}</code></pre>
          <p>
            Use captured groups in replacements: Replace &quot;$2/$3&quot; to reformat.
          </p>

          <h2>Common Mistakes</h2>
          <ul>
            <li><strong>Forgetting ^ and $:</strong> Without them, pattern matches anywhere. /hello/ matches &quot;say hello world&quot;.</li>
            <li><strong>Not escaping special characters:</strong> Use \\ to escape . ? + * [ ] { } ( ) ^ $ |</li>
            <li><strong>Greedy vs lazy matching:</strong> .* is greedy (matches as much as possible). .*? is lazy (matches as little as possible).</li>
            <li><strong>Not using raw strings:</strong> In some languages, use r&quot;&quot; or // to avoid double-escaping.</li>
          </ul>

          <h2>Performance Considerations</h2>
          <ul>
            <li><strong>Catastrophic backtracking:</strong> Overly complex patterns can be slow. Test performance on large inputs.</li>
            <li><strong>Anchors improve performance:</strong> ^ and $ help regex engines exit early.</li>
            <li><strong>Be specific:</strong> [a-zA-Z] is faster than . (dot).</li>
            <li><strong>Use character classes:</strong> \\d is faster than [0-9].</li>
          </ul>

          <h2>Tools for Regex</h2>
          <ul>
            <li><strong>Regex101.com:</strong> Interactive regex tester with explanations and flags.</li>
            <li><strong>Regex generators:</strong> Tools that build regex from examples.</li>
            <li><strong>IDE support:</strong> Most editors highlight regex syntax and test matches.</li>
            <li><strong>Language docs:</strong> Each language (JavaScript, Python, Java) has specific regex variations.</li>
          </ul>

          <h2>References</h2>
          <ul>
            <li>MDN Regular Expressions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions</li>
            <li>Regex101: https://regex101.com/</li>
            <li>RegexOne Tutorial: https://regexone.com/</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Templates ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Quick Templates
          </label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <button
                key={template.name}
                onClick={() => handleTemplateSelect(template.name)}
                className={`p-3 rounded-lg border text-left transition ${
                  selectedTemplate === template.name
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <p className="text-sm font-medium text-foreground">
                  {template.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Pattern Input ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Regex Pattern
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="^[a-z]+$"
              className="flex-1 rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
            />
            <button
              onClick={copyPatternToClipboard}
              className="flex items-center gap-2 px-3 py-3 rounded-lg border border-border hover:bg-muted/50 transition text-foreground"
              title="Copy pattern"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          {selectedTemplate && (
            <p className="text-xs text-muted-foreground mt-2">
              {templates.find((t) => t.name === selectedTemplate)?.explanation}
            </p>
          )}
        </div>

        {/* ── Flags ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Flags
          </label>
          <div className="flex gap-4">
            {[
              { flag: "g", label: "Global (find all)" },
              { flag: "i", label: "Case-insensitive" },
              { flag: "m", label: "Multiline" },
              { flag: "s", label: "Dotall" },
            ].map(({ flag, label }) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlags((flags + flag) as any);
                    } else {
                      setFlags(flags.replace(flag, ""));
                    }
                  }}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Test Text ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Test Text
          </label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to test against the regex..."
            className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
            rows={6}
          />
        </div>

        {/* ── Results ── */}
        <div className="space-y-6">
          {error ? (
            <div className="rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">
                  Invalid Regex
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ── Match Summary ── */}
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard
                  label="Matches Found"
                  value={matchCount.toString()}
                />
                <ResultCard
                  label="Test Lines"
                  value={testText.split("\n").length.toString()}
                />
              </div>

              {/* ── Matches List ── */}
              {hasMatches && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/50 border-b border-border px-4 py-3 font-semibold text-foreground">
                    All Matches
                  </div>
                  <div className="divide-y divide-border max-h-96 overflow-y-auto">
                    {matches.map((match, idx) => (
                      <div key={idx} className="px-4 py-3 text-sm font-mono">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="text-foreground font-medium">
                              Match {idx + 1}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Line {match.line}, Index {match.index}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-600 dark:text-green-400 font-semibold">
                              {match.fullMatch}
                            </p>
                          </div>
                        </div>
                        {match.groups.length > 0 && (
                          <div className="mt-2 space-y-1 pl-2 border-l-2 border-muted">
                            {match.groups.map((group: string | undefined, gIdx: number) => (
                              <p
                                key={gIdx}
                                className="text-muted-foreground text-xs"
                              >
                                Group {gIdx + 1}: <span className="text-foreground">{group || "(empty)"}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!hasMatches && (
                <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      No matches found
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Try adjusting your pattern or test text
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
