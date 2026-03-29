"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";

interface MatchResult {
  match: string;
  index: number;
  groups: { [key: string]: string } | undefined;
  fullMatch: string;
}

const COMMON_PATTERNS = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { name: "URL", pattern: "https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}" },
  { name: "IP Address", pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "Time (HH:MM)", pattern: "([01]?[0-9]|2[0-3]):[0-5][0-9]" },
  { name: "Hex Color", pattern: "#[0-9A-Fa-f]{6}\\b" },
  { name: "Username", pattern: "^[a-zA-Z0-9_]{3,16}$" },
  { name: "Strong Password", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" },
  { name: "Credit Card", pattern: "\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b" },
  { name: "ZIP Code (US)", pattern: "\\b\\d{5}(-\\d{4})?\\b" },
  { name: "HTML Tag", pattern: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>" },
];

const FLAGS_INFO = [
  { flag: "g", name: "Global", description: "Find all matches" },
  { flag: "i", name: "Case Insensitive", description: "Ignore case" },
  { flag: "m", name: "Multiline", description: "^ and $ match line start/end" },
  { flag: "s", name: "Dotall", description: ". matches newlines" },
  { flag: "u", name: "Unicode", description: "Enable Unicode support" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [replaceWith, setReplaceWith] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  const activeFlags = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { matches, error, highlightedText, replacedText } = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, highlightedText: testString, replacedText: testString };
    }

    try {
      const regex = new RegExp(pattern, activeFlags);
      const matchResults: MatchResult[] = [];
      let match: RegExpExecArray | null;

      if (activeFlags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          matchResults.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
            fullMatch: match[0],
          });
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matchResults.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
            fullMatch: match[0],
          });
        }
      }

      // Create highlighted text
      let highlighted = testString;
      let offset = 0;
      const sortedMatches = [...matchResults].sort((a, b) => a.index - b.index);
      
      for (const m of sortedMatches) {
        const startTag = '<mark class="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">';
        const endTag = "</mark>";
        const startIdx = m.index + offset;
        highlighted =
          highlighted.slice(0, startIdx) +
          startTag +
          highlighted.slice(startIdx, startIdx + m.match.length) +
          endTag +
          highlighted.slice(startIdx + m.match.length);
        offset += startTag.length + endTag.length;
      }

      // Replace text
      const replaced = testString.replace(regex, replaceWith);

      return { matches: matchResults, error: null, highlightedText: highlighted, replacedText: replaced };
    } catch (e) {
      return {
        matches: [],
        error: e instanceof Error ? e.message : "Invalid regex",
        highlightedText: testString,
        replacedText: testString,
      };
    }
  }, [pattern, testString, activeFlags, replaceWith]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const loadPattern = useCallback((p: string) => {
    setPattern(p);
  }, []);

  const copyPattern = () => {
    const fullPattern = `/${pattern}/${activeFlags}`;
    navigator.clipboard.writeText(fullPattern);
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test and debug regular expressions in real-time. See matches highlighted, view capture groups, and test replacements."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      relatedTools={[
        { name: "JSON Formatter", href: "/json-formatter" },
        { name: "URL Encoder", href: "/url-encoder" },
        { name: "Text Case Converter", href: "/text-case-converter" },
      ]}
      content={
        <>
          <h2>What are Regular Expressions?</h2>
          <p>
            Regular expressions (regex or regexp) are patterns used to match character combinations 
            in strings. They are powerful tools for searching, validating, and manipulating text.
          </p>

          <h2>Common Regex Metacharacters</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Character</th>
                <th className="text-left p-2 border-b">Description</th>
                <th className="text-left p-2 border-b">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border-b font-mono">.</td><td className="p-2 border-b">Any character</td><td className="p-2 border-b font-mono">a.c → abc, aXc</td></tr>
              <tr><td className="p-2 border-b font-mono">*</td><td className="p-2 border-b">0 or more</td><td className="p-2 border-b font-mono">ab* → a, ab, abb</td></tr>
              <tr><td className="p-2 border-b font-mono">+</td><td className="p-2 border-b">1 or more</td><td className="p-2 border-b font-mono">ab+ → ab, abb</td></tr>
              <tr><td className="p-2 border-b font-mono">?</td><td className="p-2 border-b">0 or 1</td><td className="p-2 border-b font-mono">colou?r → color, colour</td></tr>
              <tr><td className="p-2 border-b font-mono">^</td><td className="p-2 border-b">Start of line</td><td className="p-2 border-b font-mono">^Hello</td></tr>
              <tr><td className="p-2 border-b font-mono">$</td><td className="p-2 border-b">End of line</td><td className="p-2 border-b font-mono">world$</td></tr>
              <tr><td className="p-2 border-b font-mono">\d</td><td className="p-2 border-b">Digit</td><td className="p-2 border-b font-mono">\d+ → 123</td></tr>
              <tr><td className="p-2 border-b font-mono">\w</td><td className="p-2 border-b">Word character</td><td className="p-2 border-b font-mono">\w+ → hello_123</td></tr>
              <tr><td className="p-2 border-b font-mono">\s</td><td className="p-2 border-b">Whitespace</td><td className="p-2 border-b font-mono">hello\sworld</td></tr>
              <tr><td className="p-2 border-b font-mono">[abc]</td><td className="p-2 border-b">Character class</td><td className="p-2 border-b font-mono">[aeiou]</td></tr>
              <tr><td className="p-2 border-b font-mono">()</td><td className="p-2 border-b">Capture group</td><td className="p-2 border-b font-mono">(ab)+</td></tr>
              <tr><td className="p-2 border-b font-mono">|</td><td className="p-2 border-b">Or</td><td className="p-2 border-b font-mono">cat|dog</td></tr>
            </tbody>
          </table>

          <h2>Regex Flags</h2>
          <ul>
            <li><strong>g (global):</strong> Find all matches instead of stopping at the first</li>
            <li><strong>i (case-insensitive):</strong> Ignore uppercase/lowercase differences</li>
            <li><strong>m (multiline):</strong> ^ and $ match start/end of each line</li>
            <li><strong>s (dotall):</strong> Dot (.) matches newlines too</li>
          </ul>

          <h2>Tips for Writing Regex</h2>
          <ul>
            <li>Start simple and add complexity gradually</li>
            <li>Escape special characters with backslash: \. \* \?</li>
            <li>Use non-greedy quantifiers (*?, +?) when needed</li>
            <li>Test with edge cases and unexpected input</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Pattern Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Regular Expression
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-muted-foreground font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter your regex pattern..."
              className={`flex-1 rounded-lg border ${
                error ? "border-red-500" : "border-border"
              } bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono`}
            />
            <span className="text-2xl text-muted-foreground font-mono">/</span>
            <span className="text-lg text-primary font-mono">{activeFlags}</span>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-2">
          {FLAGS_INFO.map((f) => (
            <button
              key={f.flag}
              onClick={() => toggleFlag(f.flag as keyof typeof flags)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                flags[f.flag as keyof typeof flags]
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
              title={f.description}
            >
              {f.flag} - {f.name}
            </button>
          ))}
        </div>

        {/* Test String */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against your regex..."
            className="w-full h-32 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
          />
        </div>

        {/* Highlighted Result */}
        {testString && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Highlighted Matches ({matches.length} found)
            </h3>
            <div
              className="bg-background/50 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        )}

        {/* Match Details */}
        {matches.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Match Details</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                      Match {i + 1}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Index: {m.index}
                    </span>
                  </div>
                  <div className="font-mono text-primary bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                    {m.match || "(empty string)"}
                  </div>
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Groups:</span>
                      {Object.entries(m.groups).map(([name, value]) => (
                        <span key={name} className="ml-2">
                          <span className="text-primary">{name}</span>: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Replace Section */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Replace</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplace(!showReplace)}
            >
              {showReplace ? "Hide" : "Show"} Replace
            </Button>
          </div>
          {showReplace && (
            <div className="space-y-3">
              <input
                type="text"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                placeholder="Replace with... (use $1, $2 for groups)"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
              />
              {replaceWith && (
                <div className="bg-background/50 rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-all">
                  {replacedText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Common Patterns */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Common Patterns</h3>
          <div className="flex flex-wrap gap-2">
            {COMMON_PATTERNS.map((p) => (
              <button
                key={p.name}
                onClick={() => loadPattern(p.pattern)}
                className="px-3 py-1.5 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors text-foreground"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={copyPattern} disabled={!pattern}>
            Copy as /{pattern}/{activeFlags}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPattern("");
              setTestString("");
              setReplaceWith("");
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
