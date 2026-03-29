"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

type OutputType = "paragraphs" | "sentences" | "words";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "nihil", "numquam", "eius", "modi",
  "tempora", "magnam", "quaerat", "minima", "nostrum", "exercitationem", "ullam",
  "corporis", "suscipit", "laboriosam", "aliquid", "commodi", "consequatur",
];

const FIRST_PARAGRAPH = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function generateWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(minWords = 8, maxWords = 15): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = Array.from({ length: wordCount }, generateWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(minSentences = 4, maxSentences = 8): string {
  const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
}

export default function LoremIpsumGenerator() {
  const [outputType, setOutputType] = useState<OutputType>("paragraphs");
  const [count, setCount] = useState("3");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatedText = useMemo(() => {
    const num = parseInt(count) || 1;
    const safeNum = Math.min(Math.max(1, num), 100);

    switch (outputType) {
      case "paragraphs": {
        const paragraphs: string[] = [];
        for (let i = 0; i < safeNum; i++) {
          if (i === 0 && startWithLorem) {
            paragraphs.push(FIRST_PARAGRAPH);
          } else {
            paragraphs.push(generateParagraph());
          }
        }
        return paragraphs.join("\n\n");
      }
      case "sentences": {
        const sentences: string[] = [];
        for (let i = 0; i < safeNum; i++) {
          if (i === 0 && startWithLorem) {
            sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
          } else {
            sentences.push(generateSentence());
          }
        }
        return sentences.join(" ");
      }
      case "words": {
        const words: string[] = [];
        if (startWithLorem && safeNum >= 2) {
          words.push("Lorem", "ipsum");
          for (let i = 2; i < safeNum; i++) {
            words.push(generateWord());
          }
        } else {
          for (let i = 0; i < safeNum; i++) {
            words.push(generateWord());
          }
        }
        return words.join(" ");
      }
      default:
        return "";
    }
  }, [outputType, count, startWithLorem]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = generatedText.split(/\s+/).filter(Boolean).length;
  const charCount = generatedText.length;
  const paragraphCount = generatedText.split(/\n\n/).length;

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text for your web designs, mockups, and documents. Create paragraphs, sentences, or words of dummy text instantly."
      category={{ name: "Developer Tools", slug: "developer-tools" }}
      relatedTools={[
        { name: "Word Counter", href: "/word-counter" },
        { name: "Text Case Converter", href: "/text-case-converter" },
        { name: "JSON Formatter", href: "/json-formatter" },
      ]}
      content={
        <>
          <h2>What is Lorem Ipsum?</h2>
          <p>
            Lorem Ipsum is placeholder text commonly used in the printing and typesetting industry. 
            It has been the industry&apos;s standard dummy text since the 1500s when an unknown printer 
            scrambled a galley of type to make a type specimen book.
          </p>

          <h2>Why Use Lorem Ipsum?</h2>
          <ul>
            <li><strong>Focus on Design:</strong> Placeholder text lets viewers focus on layout and visual elements without being distracted by readable content</li>
            <li><strong>Realistic Length:</strong> Lorem Ipsum has a natural distribution of letters, making it look like real text</li>
            <li><strong>Industry Standard:</strong> Widely recognized and accepted in design workflows</li>
            <li><strong>Neutral Content:</strong> No distracting or offensive content</li>
          </ul>

          <h2>History of Lorem Ipsum</h2>
          <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece 
            of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, 
            a Latin professor, discovered the undoubtable source: &quot;de Finibus Bonorum et Malorum&quot; 
            (The Extremes of Good and Evil) by Cicero.
          </p>

          <h2>The Standard Lorem Ipsum Passage</h2>
          <p className="text-sm bg-muted p-4 rounded-lg italic">
            &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.&quot;
          </p>

          <h2>When to Use Placeholder Text</h2>
          <ul>
            <li>Website mockups and wireframes</li>
            <li>Print layout designs</li>
            <li>Typography testing</li>
            <li>UI/UX prototypes</li>
            <li>Presentation templates</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Output Type"
            id="outputType"
            value={outputType}
            onChange={(e) => setOutputType(e.target.value as OutputType)}
            options={[
              { value: "paragraphs", label: "Paragraphs" },
              { value: "sentences", label: "Sentences" },
              { value: "words", label: "Words" },
            ]}
          />
          <Input
            label={`Number of ${outputType}`}
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="100"
            placeholder="3"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Start with &quot;Lorem ipsum...&quot;</span>
        </label>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{paragraphCount} paragraph{paragraphCount !== 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>

        {/* Output */}
        <div className="relative">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-foreground">Generated Text</span>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {generatedText}
              </p>
            </div>
          </div>
        </div>

        {/* HTML Output */}
        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-foreground">HTML Format</span>
            <Button 
              onClick={() => {
                const htmlText = outputType === "paragraphs" 
                  ? generatedText.split("\n\n").map(p => `<p>${p}</p>`).join("\n")
                  : `<p>${generatedText}</p>`;
                navigator.clipboard.writeText(htmlText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }} 
              variant="outline" 
              size="sm"
            >
              Copy HTML
            </Button>
          </div>
          <pre className="text-xs text-muted-foreground font-mono bg-background/50 p-3 rounded-lg overflow-x-auto max-h-32">
            {outputType === "paragraphs" 
              ? generatedText.split("\n\n").map(p => `<p>${p}</p>`).join("\n")
              : `<p>${generatedText}</p>`
            }
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
