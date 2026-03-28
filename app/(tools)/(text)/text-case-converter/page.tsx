"use client";

import { useState, useCallback } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Type, Copy, Check, Trash2, RefreshCw } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "What is text case conversion?",
    answer: "Text case conversion changes the capitalization of text. Common cases include: uppercase (ALL CAPS), lowercase (all small), title case (Each Word Capitalized), sentence case (First word capitalized), and programming-specific cases like camelCase, PascalCase, snake_case, and kebab-case."
  },
  {
    question: "When should I use Title Case?",
    answer: "Title Case capitalizes the first letter of each word and is typically used for headings, titles, and names. Style guides vary on whether to capitalize small words like 'the', 'a', 'and'. Our converter capitalizes all words, but you may want to manually lowercase certain articles and prepositions for formal writing."
  },
  {
    question: "What's the difference between camelCase and PascalCase?",
    answer: "camelCase starts with a lowercase letter and capitalizes subsequent words (firstName, getUserData). PascalCase capitalizes every word including the first (FirstName, GetUserData). In programming, camelCase is common for variables and functions, while PascalCase is used for classes and components."
  },
  {
    question: "What is snake_case used for?",
    answer: "snake_case separates words with underscores and uses all lowercase letters (first_name, get_user_data). It's popular in Python, Ruby, and databases (table and column names). It's also common in file naming conventions and API endpoints."
  },
  {
    question: "What is kebab-case?",
    answer: "kebab-case separates words with hyphens (first-name, get-user-data). It's commonly used in URLs, CSS class names, and HTML attributes. The name comes from the fact that the hyphens look like skewers through the words, like a kebab."
  },
  {
    question: "How does Sentence case work?",
    answer: "Sentence case capitalizes only the first letter of the first word and proper nouns (like a regular sentence). It's commonly used for body text, descriptions, and informal headings. This converter capitalizes the first letter and lowercases the rest, but won't detect proper nouns automatically."
  },
];

type CaseType = 
  | "upper" 
  | "lower" 
  | "title" 
  | "sentence" 
  | "camel" 
  | "pascal" 
  | "snake" 
  | "kebab" 
  | "constant"
  | "dot"
  | "inverse"
  | "alternating";

interface CaseOption {
  id: CaseType;
  name: string;
  example: string;
}

const caseOptions: CaseOption[] = [
  { id: "upper", name: "UPPERCASE", example: "HELLO WORLD" },
  { id: "lower", name: "lowercase", example: "hello world" },
  { id: "title", name: "Title Case", example: "Hello World" },
  { id: "sentence", name: "Sentence case", example: "Hello world" },
  { id: "camel", name: "camelCase", example: "helloWorld" },
  { id: "pascal", name: "PascalCase", example: "HelloWorld" },
  { id: "snake", name: "snake_case", example: "hello_world" },
  { id: "kebab", name: "kebab-case", example: "hello-world" },
  { id: "constant", name: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { id: "dot", name: "dot.case", example: "hello.world" },
  { id: "inverse", name: "iNVERSE cASE", example: "hELLO wORLD" },
  { id: "alternating", name: "aLtErNaTiNg", example: "hElLo WoRlD" },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseType>("title");
  const [copied, setCopied] = useState(false);

  const toWords = (text: string): string[] => {
    // Split by common separators and spaces
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Split acronyms
      .split(/[\s_\-\.]+/)
      .filter(word => word.length > 0);
  };

  const convert = useCallback((text: string, caseType: CaseType): string => {
    if (!text.trim()) return "";

    const words = toWords(text);
    
    switch (caseType) {
      case "upper":
        return text.toUpperCase();
      
      case "lower":
        return text.toLowerCase();
      
      case "title":
        return words.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(" ");
      
      case "sentence":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      
      case "camel":
        return words.map((word, i) => 
          i === 0 
            ? word.toLowerCase() 
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join("");
      
      case "pascal":
        return words.map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join("");
      
      case "snake":
        return words.map(word => word.toLowerCase()).join("_");
      
      case "kebab":
        return words.map(word => word.toLowerCase()).join("-");
      
      case "constant":
        return words.map(word => word.toUpperCase()).join("_");
      
      case "dot":
        return words.map(word => word.toLowerCase()).join(".");
      
      case "inverse":
        return text.split("").map(char => {
          if (char === char.toUpperCase()) return char.toLowerCase();
          if (char === char.toLowerCase()) return char.toUpperCase();
          return char;
        }).join("");
      
      case "alternating":
        let isUpper = false;
        return text.split("").map(char => {
          if (/[a-zA-Z]/.test(char)) {
            const result = isUpper ? char.toUpperCase() : char.toLowerCase();
            isUpper = !isUpper;
            return result;
          }
          return char;
        }).join("");
      
      default:
        return text;
    }
  }, []);

  const handleConvert = (caseType: CaseType) => {
    setSelectedCase(caseType);
    setOutput(convert(input, caseType));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const loadSample = () => {
    setInput("The Quick Brown Fox Jumps Over The Lazy Dog");
    setOutput("");
  };

  const useOutput = () => {
    setInput(output);
    setOutput("");
  };

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Convert text between different cases instantly. Support for uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and more. Perfect for writers, developers, and content creators."
      category={{ name: "Text Tools", slug: "text-tools" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Word Counter", href: "/word-counter" },
        { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator" },
        { name: "Password Generator", href: "/password-generator" },
        { name: "Base64 Encoder", href: "/base64-encoder" },
        { name: "JSON Formatter", href: "/json-formatter" },
      ]}
      content={
        <>
          <h2>Understanding Text Cases</h2>
          <p>
            Text case refers to the capitalization style of letters in text. Different contexts require different cases—formal writing uses sentence and title case, while programming has its own conventions like camelCase and snake_case. Understanding when to use each case improves readability and professionalism.
          </p>

          <h2>Writing Cases</h2>
          
          <h3>UPPERCASE</h3>
          <p>
            All letters are capitals. Used for acronyms, emphasis, headings, and situations requiring high visibility. Overuse can feel like shouting in digital communication.
          </p>
          <p><strong>Example:</strong> WARNING: PLEASE READ CAREFULLY</p>

          <h3>lowercase</h3>
          <p>
            All letters are small. Used for casual text, some design aesthetics, and as a base for other transformations.
          </p>
          <p><strong>Example:</strong> remember to check your email</p>

          <h3>Title Case</h3>
          <p>
            Each word starts with a capital letter. Used for titles, headings, and proper nouns. Style guides vary on whether to capitalize articles and prepositions.
          </p>
          <p><strong>Example:</strong> The Lord Of The Rings: The Return Of The King</p>

          <h3>Sentence case</h3>
          <p>
            Only the first letter of the first word is capitalized (plus proper nouns). This is how normal sentences are written and is increasingly popular for headings.
          </p>
          <p><strong>Example:</strong> The quick brown fox jumps over the lazy dog.</p>

          <h2>Programming Cases</h2>
          
          <h3>camelCase</h3>
          <p>
            Words are joined with no separator, first word lowercase, subsequent words capitalized. Named for the &quot;humps&quot; of capital letters.
          </p>
          <p><strong>Used for:</strong> JavaScript/TypeScript variables and functions, Java methods</p>
          <p><strong>Example:</strong> getUserEmail, firstName, httpResponse</p>

          <h3>PascalCase</h3>
          <p>
            Like camelCase but the first word is also capitalized. Also called UpperCamelCase.
          </p>
          <p><strong>Used for:</strong> Class names, React components, C# methods</p>
          <p><strong>Example:</strong> UserProfile, GetUserEmail, HttpClient</p>

          <h3>snake_case</h3>
          <p>
            Words separated by underscores, all lowercase. Popular in Python and Ruby communities.
          </p>
          <p><strong>Used for:</strong> Python variables and functions, database columns, file names</p>
          <p><strong>Example:</strong> user_email, get_user_data, first_name</p>

          <h3>CONSTANT_CASE</h3>
          <p>
            Like snake_case but all uppercase. Used for constants and environment variables.
          </p>
          <p><strong>Used for:</strong> Constants, environment variables, configuration keys</p>
          <p><strong>Example:</strong> MAX_RETRY_COUNT, API_BASE_URL, DEBUG_MODE</p>

          <h3>kebab-case</h3>
          <p>
            Words separated by hyphens, all lowercase. Named for the hyphen &quot;skewers.&quot;
          </p>
          <p><strong>Used for:</strong> URLs, CSS classes, HTML attributes, package names</p>
          <p><strong>Example:</strong> user-profile, font-size, my-component</p>

          <h2>When to Use Each Case</h2>
          
          <h3>Content Writing</h3>
          <ul>
            <li><strong>Headlines:</strong> Title Case or Sentence case (style guide dependent)</li>
            <li><strong>Body text:</strong> Sentence case</li>
            <li><strong>Acronyms:</strong> UPPERCASE</li>
            <li><strong>Emphasis:</strong> Bold or italics preferred over CAPS</li>
          </ul>

          <h3>Programming</h3>
          <ul>
            <li><strong>JavaScript:</strong> camelCase for variables, PascalCase for classes/components</li>
            <li><strong>Python:</strong> snake_case for functions/variables, PascalCase for classes</li>
            <li><strong>Constants:</strong> CONSTANT_CASE across most languages</li>
            <li><strong>CSS:</strong> kebab-case for classes and properties</li>
            <li><strong>URLs:</strong> kebab-case for readability and SEO</li>
          </ul>

          <h2>Style Guide Conventions</h2>
          <p>
            Major style guides have specific rules for title case:
          </p>
          <ul>
            <li><strong>AP Style:</strong> Capitalize words of 4+ letters</li>
            <li><strong>Chicago Manual:</strong> Capitalize all words except articles and short prepositions</li>
            <li><strong>APA:</strong> Capitalize words of 4+ letters and all &quot;major&quot; words</li>
          </ul>
          <p>
            For consistency, choose one style guide and stick with it throughout your project.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">Enter Your Text</label>
            <button onClick={loadSample} className="text-xs text-primary hover:underline">
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-32 rounded-xl border border-border bg-white dark:bg-muted/30 p-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Case Options Grid */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Select Case</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {caseOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleConvert(option.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedCase === option.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground text-sm">{option.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{option.example}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground">Result</label>
              <div className="flex gap-2">
                <Button onClick={useOutput} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Use as Input
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-foreground whitespace-pre-wrap break-words">{output}</p>
            </div>
          </div>
        )}

        {/* Clear Button */}
        <Button onClick={clearAll} variant="outline" className="w-full">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>

        {/* Quick Reference */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Quick Reference
          </h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Variables (JS)</span>
              <span className="text-foreground font-mono">camelCase</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes/Components</span>
              <span className="text-foreground font-mono">PascalCase</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Python functions</span>
              <span className="text-foreground font-mono">snake_case</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Constants</span>
              <span className="text-foreground font-mono">CONSTANT_CASE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CSS classes</span>
              <span className="text-foreground font-mono">kebab-case</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
