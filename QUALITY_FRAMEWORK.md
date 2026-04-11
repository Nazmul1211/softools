# Softzar.com — Tool Quality Framework

> **This document is LAW.** No tool, calculator, or utility page ships to production unless it passes every applicable gate defined here. This applies to AI agents, human developers, and anyone who touches the codebase. No exceptions. No shortcuts.

**Last updated:** April 2026
**Maintained by:** Softzar Team

---

## Table of Contents

1. [Philosophy — Why This Exists](#1-philosophy--why-this-exists)
2. [Universal Quality Gates — Every Tool Must Pass](#2-universal-quality-gates--every-tool-must-pass)
3. [The Content Architecture — The 8-Layer Page Model](#3-the-content-architecture--the-8-layer-page-model)
4. [Category-Specific Content Frameworks](#4-category-specific-content-frameworks)
5. [User Experience Criteria — Non-Negotiable UX Standards](#5-user-experience-criteria--non-negotiable-ux-standards)
6. [Code Quality Standards](#6-code-quality-standards)
7. [SEO Quality Gates](#7-seo-quality-gates)
8. [Accessibility Standards](#8-accessibility-standards)
9. [Pre-Ship Checklist — The Final Gate](#9-pre-ship-checklist--the-final-gate)
10. [Content Review Rubric — Scoring System](#10-content-review-rubric--scoring-system)
11. [Anti-Patterns — What Will Get Rejected](#11-anti-patterns--what-will-get-rejected)
12. [File Templates — Boilerplate Structure](#12-file-templates--boilerplate-structure)
13. [Site-Wide Audit Checklist](#13-site-wide-audit-checklist--run-after-every-batch)
14. [Site Architecture Constraints](#14-site-architecture-constraints--non-negotiable-rules)
15. [Agent Startup Sequence](#15-agent-startup-sequence--batch-implementation-workflow)
16. [Documentation Map](#16-documentation-map--single-source-of-truth)

---

## 1. Philosophy — Why This Exists

### Our Mission

Softzar.com exists to **help people solve real problems with free, high-quality tools**. We are not building thin SEO bait pages. We are not churning out minimum viable calculators. Every tool we ship answers a real human question better than the alternatives.

### The Three Pillars

```
┌──────────────────────────────────────────────────────┐
│                  USER VALUE FIRST                     │
│  "Does this tool genuinely help someone?"             │
│  If NO → do not build it.                             │
├──────────────────────────────────────────────────────┤
│                 CONTENT EXCELLENCE                    │
│  "Would an expert in this field approve this content?"│
│  If NO → rewrite until it does.                       │
├──────────────────────────────────────────────────────┤
│                ENGINEERING QUALITY                    │
│  "Would I be proud to show this code to a senior      │
│   engineer at Google?"                                │
│  If NO → refactor until you would.                    │
└──────────────────────────────────────────────────────┘
```

### The Golden Rule

> **Every tool on Softzar must be the best free version of that tool on the internet, or it should not exist.**

This means:
- More accurate than competitors
- Easier to use than competitors
- Better explained than competitors
- Faster to load than competitors
- More helpful than competitors

---

## 2. Universal Quality Gates — Every Tool Must Pass

These are binary pass/fail gates. A tool cannot ship if any gate fails.

### Gate 1: Accuracy
- [ ] All calculations verified against known correct values
- [ ] At least 3 edge cases tested (zero, negative, max values, decimals)
- [ ] Formulas cited with source (academic paper, government standard, or established reference)
- [ ] Results match at least 2 competitor tools for the same inputs

### Gate 2: Completeness
- [ ] All 8 content layers present (see Section 3)
- [ ] Minimum word count met for the tool's category (see Section 4)
- [ ] 5–6 FAQs with substantive answers (not filler)
- [ ] 3–5 HowTo steps defined
- [ ] 5 related tools linked
- [ ] Sources/references section with real citations

### Gate 3: User Respect
- [ ] Tool works instantly — no unnecessary loading states or delays
- [ ] Results are immediately understandable without scrolling or clicking
- [ ] Disclaimer present where applicable (health, finance, legal)
- [ ] Privacy is respected — no unnecessary data collection
- [ ] Tool is useful on mobile, not just desktop
- [ ] Tool answers the user's actual question, not just adjacent to it

### Gate 4: Technical Quality
- [ ] `next build` passes with zero errors
- [ ] No TypeScript `any` types or suppressions
- [ ] No unused imports or dead code
- [ ] Follows existing codebase patterns exactly
- [ ] Registered in `lib/tools.ts`
- [ ] `layout.tsx` has proper metadata

### Gate 5: SEO Completeness
- [ ] Title tag with primary keyword (under 60 characters)
- [ ] Meta description with CTA (150–160 characters)
- [ ] 8+ keywords in metadata
- [ ] OG + Twitter card tags
- [ ] FAQPage schema (via ToolLayout)
- [ ] WebApplication schema (via ToolLayout)
- [ ] BreadcrumbList schema (via ToolLayout)
- [ ] HowTo schema (via ToolLayout)
- [ ] Canonical URL set

---

## 3. The Content Architecture — The 8-Layer Page Model

Every tool page is composed of exactly 8 content layers. These layers are not optional. They are not suggestions. They are the structure that separates a ranking page from an invisible one.

```
┌─────────────────────────────────────────────────┐
│  LAYER 1: H1 Title                              │
│  Keyword-first, descriptive, includes audience   │
│  Example: "BMI Calculator — Body Mass Index      │
│  for Adults & Children"                          │
├─────────────────────────────────────────────────┤
│  LAYER 2: The Tool (Above the Fold)             │
│  Interactive widget. Instant results. Real-time  │
│  calculation as user types. Zero scroll needed.  │
├─────────────────────────────────────────────────┤
│  LAYER 3: What This Tool Does (~100 words)      │
│  Plain English. Who uses it. What problem it     │
│  solves. Not for search engines — for humans.    │
├─────────────────────────────────────────────────┤
│  LAYER 4: The Formula / How It Works            │
│  (~150+ words)                                   │
│  Show the actual formula. Explain each variable. │
│  Include a WORKED EXAMPLE with real numbers.     │
│  This is the E-E-A-T signal layer.              │
├─────────────────────────────────────────────────┤
│  LAYER 5: Interpretation Guide (~100+ words)    │
│  What do the results mean? Ranges, thresholds,   │
│  categories. Make results ACTIONABLE.            │
├─────────────────────────────────────────────────┤
│  LAYER 6: Deep Educational Content              │
│  (Category-specific — see Section 4)             │
│  This is where topical authority is built.       │
│  Tables, comparisons, real-world applications.   │
├─────────────────────────────────────────────────┤
│  LAYER 7: FAQ Section (5–6 questions)           │
│  Real questions people search. Long-tail          │
│  keywords. Substantive answers (50–100 words     │
│  each). FAQPage schema applied.                  │
├─────────────────────────────────────────────────┤
│  LAYER 8: Sources & References                  │
│  Cited academic papers, government standards,    │
│  medical organizations. This is non-negotiable   │
│  for health and finance tools.                   │
└─────────────────────────────────────────────────┘
```

### Layer Rules

| Layer | Minimum Words | Required? | Notes |
|-------|--------------|-----------|-------|
| 1. H1 Title | 5–15 words | ✅ Always | Must include primary keyword + audience |
| 2. Tool Widget | N/A (code) | ✅ Always | Above fold, real-time, mobile-responsive |
| 3. What This Does | 80–120 words | ✅ Always | First paragraph Google reads after title |
| 4. Formula | 150+ words | ✅ Always | Must include worked example |
| 5. Interpretation | 100+ words | ✅ Always | Make results actionable |
| 6. Deep Content | 500–1000+ words | ✅ Always | Category-specific (see Section 4) |
| 7. FAQs | 5–6 questions | ✅ Always | 50–100 words per answer |
| 8. Sources | 3–6 citations | ✅ Always | Academic, government, or medical |

**Total minimum content: 1,000 words** (health/finance require 1,200+)

---

## 4. Category-Specific Content Frameworks

Each category has different user intent, different trust requirements, and different content needs. A health calculator and a developer tool serve fundamentally different audiences. The content framework must reflect this.

---

### 4.1 Health & Fitness Calculators

**User intent:** "Am I healthy? What should I do?"
**Trust level required:** HIGH — people make health decisions based on this
**Regulatory sensitivity:** YMYL (Your Money or Your Life) — Google scrutinizes these pages with the highest E-E-A-T standards

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| Medical context | What is the condition/metric and why it matters | "What is BMI and why do doctors use it?" |
| The formula | Published medical formula with source | "BMI = weight(kg) / height(m)² — WHO standard" |
| Result interpretation | Clinical ranges/categories with meaning | "18.5–24.9 = Normal weight (WHO classification)" |
| Age/sex variations | How results differ by demographics | "Values differ for children, athletes, elderly" |
| Limitations | What the tool does NOT tell you | "BMI does not distinguish muscle from fat" |
| When to see a doctor | Clear medical referral guidance | "Consult a doctor if your BMI is below 16 or above 40" |
| Medical disclaimer | Legal + ethical disclaimer | "This tool is for educational purposes. Not medical advice." |

#### Required Sources (cite at least 3)

- World Health Organization (WHO)
- National Institutes of Health (NIH)
- American College of Sports Medicine (ACSM)
- International Society of Sports Nutrition (ISSN)
- European Society for Clinical Nutrition (ESPEN)
- Peer-reviewed journals (BMJ, JAMA, Lancet, etc.)

#### Content Tone

- Empathetic, never judgmental ("If your BMI is X, here's what that means" — NOT "You are overweight")
- Clinically accurate but readable for a non-medical audience
- Inclusive of different body types, ages, and conditions

#### Minimum Word Count: 1,200 words

#### H2 Structure Template

```
## What Is [Metric/Calculator]?
## How Is [Metric] Calculated?
### The Formula
### Worked Example
## Understanding Your Results
## [Metric] by Age Group / Demographics
## Limitations of [Metric]
## Tips for Improving Your [Metric]
## When to Consult a Healthcare Provider
## Sources and Scientific References
```

---

### 4.2 Finance Calculators

**User intent:** "How much will I pay/earn/save?"
**Trust level required:** HIGH — people make financial decisions based on this
**Regulatory sensitivity:** YMYL — financial misinformation can cause real harm

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What this calculates | Plain explanation of the financial concept | "What is compound interest and how does it grow your money?" |
| The formula | Actual mathematical formula | "A = P(1 + r/n)^(nt) — Compound Interest Formula" |
| Worked example | Real-world scenario with dollar amounts | "If you invest $10,000 at 7% for 30 years..." |
| Key factors | What variables have the most impact | "Time in market matters more than timing the market" |
| Comparison table | Benchmark data or rate comparison | "Current average mortgage rates by term length" |
| Tax considerations | Relevant tax implications | "Interest income is taxed as ordinary income in the US" |
| Financial disclaimer | Legal disclaimer | "For informational purposes only. Not financial advice." |

#### Required Sources (cite at least 3)

- Internal Revenue Service (IRS)
- Federal Reserve / Central Bank
- Bureau of Labor Statistics (BLS)
- Consumer Financial Protection Bureau (CFPB)
- SEC.gov
- Reputable financial research (Morningstar, Vanguard, Federal Reserve Bank studies)

#### Content Tone

- Confident and informative, never prescriptive ("Here's how compound interest works" — NOT "You should invest in index funds")
- Real dollar amounts in examples (not abstract numbers)
- Acknowledge that rates, rules, and laws change — include "Last updated" dates

#### Minimum Word Count: 1,200 words

#### H2 Structure Template

```
## What Is [Financial Concept]?
## How Is [Metric] Calculated?
### The Formula
### Worked Example
## Understanding Your Results
## Key Factors That Affect Your [Metric]
## [Topic] Comparison / Benchmark Data
## Tax Implications
## Common Mistakes to Avoid
## Sources and References
```

---

### 4.3 Math Calculators

**User intent:** "Solve this math problem" or "Help me understand this concept"
**Trust level required:** MEDIUM — math is verifiable, answers are provable
**Primary audience:** Students, teachers, professionals

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What this calculates | What the operation/concept is | "What is the quadratic formula and when do you use it?" |
| The formula | The mathematical formula with notation explained | "x = (-b ± √(b²-4ac)) / 2a" |
| Step-by-step solution | Show work, not just the answer | "Step 1: Identify a, b, c. Step 2: Calculate discriminant..." |
| Multiple worked examples | 2–3 examples of varying difficulty | Easy + medium + hard |
| Visual explanation | Diagrams, graphs, or visual aids where applicable | Graph of parabola for quadratic |
| Real-world applications | When do people actually use this? | "Quadratic equations model projectile motion, profit curves..." |
| Common mistakes | What students get wrong | "Don't forget to include ± when taking the square root" |

#### Required Sources

- Textbook-level mathematical definitions
- Khan Academy, MIT OpenCourseWare (for verification, not citation)
- If historical: cite the original mathematician/proof

#### Content Tone

- Educational and encouraging ("Let's walk through this step by step")
- Assumes the reader is learning, not already an expert
- Avoids condescension — respect the student's intelligence while being clear

#### Minimum Word Count: 1,000 words

#### H2 Structure Template

```
## What Is [Math Concept]?
## The [Formula Name] Formula
### Variables Explained
## How to Use This Calculator
### Worked Example 1 (Basic)
### Worked Example 2 (Intermediate)
## Step-by-Step Solution Method
## Real-World Applications
## Common Mistakes to Avoid
## Related Math Concepts
```

---

### 4.4 Developer Tools

**User intent:** "Transform/validate/generate this data quickly"
**Trust level required:** MEDIUM — developers verify results themselves
**Primary audience:** Software developers, DevOps, sysadmins

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What this tool does | Quick explanation of the operation | "Base64 encoding converts binary data to ASCII text" |
| How it works (technical) | The underlying algorithm/standard | "Base64 uses a 64-character alphabet to represent binary..." |
| Use cases | When and why developers use this | "Embedding images in CSS, API authentication tokens, email attachments" |
| Code examples | Show usage in 2–3 programming languages | Python, JavaScript, cURL examples |
| Input/output formatting | Explain expected format and edge cases | "Handles UTF-8, newlines, binary data" |
| Security/privacy note | Data handling transparency | "Processed 100% in your browser. Data never sent to a server." |
| Related standards | RFC numbers, spec references | "RFC 4648 defines the Base64 encoding standard" |

#### Required Sources

- RFC documents (IETF)
- MDN Web Docs (Mozilla)
- Official language/framework documentation
- OWASP guidelines (for security tools)
- NIST standards (for cryptographic tools)

#### Content Tone

- Technical but not academic — write like a senior dev explaining to a mid-level dev
- Include copy-paste code snippets
- Respect the developer's time — be concise where appropriate
- If a tool has security implications, say so clearly

#### Minimum Word Count: 800 words

> Developer tools can have lower word count because their audience skims and code examples carry more weight than prose. However, 800 words is still a hard minimum.

#### H2 Structure Template

```
## What Is [Tool/Encoding/Format]?
## How Does [Tool] Work?
### Technical Background
## Common Use Cases
## Code Examples
### JavaScript
### Python
### cURL / Command Line
## Input & Output Format
## Security and Privacy
## Related Standards and References
```

---

### 4.5 Text & Content Tools

**User intent:** "Process this text" or "Help me write better"
**Trust level required:** LOW-MEDIUM — results are immediately verifiable
**Primary audience:** Content creators, bloggers, students, marketers

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What this tool does | What transformation/analysis it performs | "Count words, characters, and estimate reading time" |
| How it works | The logic/formula behind calculations | "Reading time = words ÷ 238 WPM (Brysbaert, 2019)" |
| Platform-specific guidelines | Character limits for popular platforms | "Twitter: 280 chars, Meta title: 55-60 chars" |
| Content strategy tips | How to use the results to improve content | "The ideal blog length for engagement is 7 minutes" |
| Comparison data | Benchmarks and reference tables | "Average reading speed by content type" |

#### Required Sources

- Platform documentation (Twitter, Google, Medium)
- Content marketing research (HubSpot, Backlinko, Orbit Media)
- Linguistics research for readability tools

#### Minimum Word Count: 1,000 words

#### H2 Structure Template

```
## What Is [Tool]?
## How Does [Tool] Work?
### The Formula/Method
### Worked Example
## Understanding Your Results
## Platform Guidelines & Character Limits
## Tips for Content Creators
## [Topic] Benchmarks & Data
## Sources and References
```

---

### 4.6 Unit Converters

**User intent:** "Convert X to Y right now"
**Trust level required:** HIGH — incorrect conversions cause real problems
**Primary audience:** Everyone — broadest audience of any category

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| Conversion formula | The exact mathematical relationship | "1 mile = 1.60934 kilometers" |
| Quick reference table | 10–20 common conversion pairs | "Miles to km: 1→1.6, 5→8.0, 10→16.1..." |
| History/context | Why these units exist and who uses them | "Celsius is used by 95% of countries worldwide..." |
| Practical examples | Real-world use cases | "Converting cooking temperatures from Fahrenheit to Celsius" |
| Common confusion | Units that are often mixed up | "Fluid ounces vs. weight ounces" |

#### Required Sources

- NIST (National Institute of Standards and Technology)
- Bureau International des Poids et Mesures (BIPM)
- ISO standards

#### Minimum Word Count: 800 words

---

### 4.7 Date & Time Tools

**User intent:** "Calculate dates" or "Convert times"
**Trust level required:** MEDIUM — date math is tricky but verifiable
**Primary audience:** Project managers, travelers, event planners

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What it calculates | The time/date operation performed | "Calculate exact age in years, months, and days" |
| How date math works | The rules (leap years, months, DST) | "Leap year occurs every 4 years, except..." |
| Worked example | Specific date calculation | "From March 15 to July 22 = 129 days" |
| Edge cases | When date math gets tricky | "Crossing daylight saving time boundaries..." |
| Related events/holidays | Contextual utility | "Common counting-to events: tax deadlines, school years" |

#### Minimum Word Count: 800 words

---

### 4.8 Image & PDF Tools

**User intent:** "Process this file quickly and privately"
**Trust level required:** MEDIUM — file processing has privacy implications
**Primary audience:** Designers, marketers, students, office workers

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What this tool does | Clear description of the operation | "Compress images to reduce file size without visible quality loss" |
| How it works | The compression/conversion algorithm | "JPEG compression uses DCT (Discrete Cosine Transform)..." |
| Format comparison | When to use which format | "PNG for transparency, JPEG for photos, WebP for web..." |
| Quality vs. size tradeoff | What the user is trading off | "At 80% quality, JPEG files are ~60% smaller with minimal visible loss" |
| Privacy guarantee | Data handling policy | "Files are processed 100% in your browser and never uploaded" |
| Use cases | Practical scenarios | "Preparing images for web, email attachments, social media" |

#### Required Sources

- W3C standards (for web formats)
- ISO standards (for image/document formats)
- Mozilla Developer Network (for format specifications)

#### Minimum Word Count: 800 words

---

### 4.9 Random Generators

**User intent:** "Generate something random/secure"
**Trust level required:** MEDIUM-HIGH for security tools (passwords), LOW for fun generators
**Primary audience:** Developers, general users, security-conscious users

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What it generates | Description of the output | "Cryptographically secure random passwords" |
| How randomness works | The algorithm/entropy source | "Uses Web Crypto API (crypto.getRandomValues)" |
| Security context | Why randomness matters for this use case | "Predictable passwords are vulnerable to brute force" |
| Best practices | How to use the output properly | "Use a unique password for every account" |

#### Required Sources

- NIST guidelines (for security tools)
- RFC documents (for UUIDs, etc.)
- OWASP (for password guidance)

#### Minimum Word Count: 800 words

---

### 4.10 Gaming Tools

**User intent:** "Optimize my game strategy"
**Trust level required:** LOW — gaming is entertainment
**Primary audience:** Gamers, game enthusiasts

#### Mandatory Content Sections

| Section | Content Requirement | Example |
|---------|-------------------|---------|
| What this calculates | Game-specific metric | "Calculate Atlas Earth parcel earnings and ROI" |
| Game mechanics explained | How the in-game system works | "Rent is calculated every 15 minutes based on..." |
| Strategy guide | How to use results to play better | "Optimal parcel placement for maximum earn rate" |
| Data tables | Game-specific rates, values, multipliers | "Badge boost percentages: Bronze +10%, Silver +20%..." |
| Community context | Where to discuss/learn more | "Join r/AtlasEarth for strategy discussions" |

#### Required Sources

- Official game documentation/wikis
- Community-verified data
- Developer announcements/patch notes

#### Minimum Word Count: 800 words

---

## 5. User Experience Criteria — Non-Negotiable UX Standards

Every tool must pass ALL of the following UX criteria before shipping.

### 5.1 First Impression (3-Second Rule)

When a user lands on the page, within 3 seconds they must understand:
- ✅ What the tool does
- ✅ Where to start inputting data
- ✅ That it is free and instant

**Test:** Show the page to someone unfamiliar with it for 3 seconds, then close it. They should be able to tell you what the page does.

### 5.2 Input Design

| Criterion | Standard |
|-----------|----------|
| Input labels | Descriptive, with units shown (e.g., "Weight (kg)") |
| Input types | Use `type="number"` with `inputMode` for appropriate keyboards |
| Default values | Pre-filled with realistic defaults so results show immediately |
| Units | Provide unit toggle where applicable (kg/lbs, cm/inches, $/€) |
| Validation | Real-time visual feedback — never wait for form submission |
| Error messages | Specific and helpful ("Enter a weight between 1–500 kg" not "Invalid input") |

### 5.3 Output Design

| Criterion | Standard |
|-----------|----------|
| Primary result | Large, bold, impossible to miss — the biggest text on screen |
| Context | Always explain what the result means, not just the number |
| Secondary data | Organized in cards or tables, scannable |
| Visual feedback | Progress bars, color coding, or icons for at-a-glance understanding |
| Empty state | A clear message + instructions when no input is provided |

### 5.4 Mobile Experience

- Tool must be fully functional on a 375px-wide screen
- No horizontal scrolling required
- Touch targets at least 44×44 pixels
- Input fields do not overlap with mobile nav
- Results do not require scrolling past ads to see

### 5.5 Performance

| Metric | Target | Hard Limit |
|--------|--------|------------|
| LCP (Largest Contentful Paint) | < 2.0s | < 2.5s |
| INP (Interaction to Next Paint) | < 100ms | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 |
| Time to Interactive | < 3.0s | < 4.0s |
| Mobile PageSpeed Score | 90+ | 70+ |

### 5.6 Delight Factors (Differentiators)

These are not required but separate a good tool from a great one:
- Smooth micro-animations on result display
- Copy-to-clipboard buttons for results
- Print-friendly result layouts
- Shareable result links (where applicable)
- Dark mode support (already handled by ToolLayout)

---

## 6. Code Quality Standards

### 6.1 File Structure — Strict Convention

```
app/(tools)/(<category-group>)/<tool-slug>/
├── layout.tsx     # Metadata (title, description, keywords, OG, Twitter)
└── page.tsx       # "use client" — Tool component + content
```

**Rules:**
- One tool per directory. No exceptions.
- Slug must match the URL exactly: `protein-intake-calculator` → `/protein-intake-calculator`
- No shared component files within tool directories — reusable components go in `components/`
- No data fetching from CMS (Sanity) for tool logic or content

### 6.2 Component Architecture

```tsx
// Every page.tsx follows this exact structure:

"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
// Import only the icons you use from lucide-react

// 1. FAQ Data — defined outside the component
const faqs: FAQItem[] = [/* ... */];

// 2. Types — all type definitions
type InputType = "metric" | "imperial";

// 3. Constants — lookup tables, option arrays, reference data
const options = [/* ... */];

// 4. Helper functions — pure functions for calculations
function calculateResult(input: number): number { /* ... */ }

// 5. Component — the actual tool
export default function ToolName() {
  // State
  // Computed results (useMemo)
  // Return ToolLayout with children + content
}
```

### 6.3 Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Tool directory | kebab-case, matches URL | `protein-intake-calculator` |
| Component function | PascalCase, descriptive | `ProteinIntakeCalculator` |
| State variables | camelCase, descriptive noun | `activityLevel`, `bodyWeight` |
| Helper functions | camelCase, starts with verb | `calculateProtein`, `formatTime` |
| Constants | camelCase (arrays), UPPER_SNAKE (primitives) | `activityOptions`, `MAX_WEIGHT` |
| Types | PascalCase | `ActivityLevel`, `GoalType` |
| CSS classes | Follow existing Tailwind patterns | Use `bg-primary/10`, `text-muted-foreground` |

### 6.4 Forbidden Patterns

- ❌ `any` type in TypeScript — always define proper types
- ❌ `useEffect` for calculations — use `useMemo` for derived state
- ❌ External API calls for client-side calculations — everything runs in the browser
- ❌ `console.log` left in production code
- ❌ Inline styles — use Tailwind classes
- ❌ Magic numbers without explanation — name your constants
- ❌ Importing entire icon libraries — import only what you use
- ❌ State for derived values — compute with `useMemo`, don't store in state

---

## 7. SEO Quality Gates

### 7.1 Metadata Requirements

```tsx
// layout.tsx — EVERY FIELD IS REQUIRED

export const metadata: Metadata = {
  title: "[Tool Name] — [Benefit/Use Case] | SoftZaR",  // 50-60 chars
  description: "[Action verb] [primary keyword] [unique value]. [CTA]. Free [tool type].",  // 150-160 chars
  keywords: [
    "primary keyword",
    "variation 1",     // semantic variant
    "variation 2",     // long-tail
    "variation 3",     // question-based
    "variation 4",     // comparison
    "variation 5",     // audience-specific
    "variation 6",     // action-based
    "variation 7",     // need-based
  ],
  openGraph: {
    title: "[Same or similar to title]",
    description: "[Same or similar to description]",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "[Short title] | SoftZaR",
    description: "[Concise 1-line description]",
  },
};
```

### 7.2 Internal Linking Rules

Every tool page must link to:
- **5 related tools** via the `relatedTools` prop in ToolLayout
- **At least 1 contextual in-content link** naturally woven into the educational content
- Links should follow the **tool chain** pattern (user journey through related tools):

```
Health chain:   BMI → Ideal Weight → TDEE → Macro → Protein → Water Intake
Finance chain:  Salary → Tax → Retirement → 401k → Compound Interest → Investment
Math chain:     Percentage → Fraction → Average → Standard Deviation → Probability
Text chain:     Word Counter → Character Counter → Reading Time → Lorem Ipsum → Slug Generator
Dev chain:      JSON Formatter → JSON Validator → Base64 → URL Encoder → UUID Generator
```

### 7.3 FAQ Quality Standards

Each FAQ must:
- Answer a **real question people search** (verify with Google autocomplete)
- Be **50–100 words** (not one-liners, not essays)
- Include a **specific fact, number, or citation** — not generic advice
- Target a **unique long-tail keyword** not covered by the main content
- Be **genuinely helpful** — if a reader only sees this FAQ in Google, they should get real value

**Bad FAQ:** "How do I use this calculator?" → "Enter your weight and click calculate."
**Good FAQ:** "How much protein do I need per day to build muscle?" → "According to the International Society of Sports Nutrition (ISSN), individuals engaged in regular resistance training should consume 1.6–2.2 grams of protein per kilogram of body weight per day to maximize muscle growth. For a 70 kg (154 lb) person, that translates to 112–154 grams of protein daily."

---

## 8. Accessibility Standards

### WCAG AA Compliance (Non-Negotiable)

| Requirement | Standard |
|-------------|----------|
| Color contrast | Text 4.5:1 minimum, large text 3:1 |
| Keyboard navigation | All interactive elements reachable via Tab |
| Focus indicators | Visible focus ring on all interactive elements |
| Form labels | Every input has an associated `<label>` |
| ARIA labels | Buttons with icons-only have `aria-label` |
| Alt text | All images have descriptive alt text |
| Semantic HTML | Use `<section>`, `<nav>`, `<main>`, `<h1>`–`<h6>` correctly |
| Heading hierarchy | Single `<h1>` per page, no skipped levels |
| Screen reader | Tool results are announced/readable by screen readers |

---

## 9. Pre-Ship Checklist — The Final Gate

Copy this checklist into the PR/commit message. Every box must be checked.

```markdown
## Pre-Ship Checklist — [Tool Name]

### Accuracy
- [ ] Calculations verified against 3+ known values
- [ ] Edge cases tested (zero, negative, max, decimals)
- [ ] Results match 2+ competitor tools

### Content (8 Layers)
- [ ] H1: keyword-first, descriptive, includes audience
- [ ] Tool widget above fold with real-time results
- [ ] "What this does" section (80-120 words)
- [ ] Formula section with worked example (150+ words)
- [ ] Interpretation guide (100+ words)
- [ ] Deep content (category-specific, 500-1000+ words)
- [ ] FAQ section (5-6 questions, 50-100 words each)
- [ ] Sources section (3-6 academic/government citations)
- [ ] Total word count meets category minimum

### SEO
- [ ] Title tag < 60 chars with primary keyword
- [ ] Meta description 150-160 chars with CTA
- [ ] 8+ keywords in metadata
- [ ] OG + Twitter card tags
- [ ] FAQPage + HowTo + WebApplication + Breadcrumb schema
- [ ] 5 related tools linked
- [ ] Canonical URL correct
- [ ] Registered in lib/tools.ts

### UX
- [ ] 3-second rule: purpose clear instantly
- [ ] Default values show results immediately
- [ ] Primary result is large, bold, unmissable
- [ ] Empty state designed
- [ ] Mobile-responsive (tested at 375px)
- [ ] Dark mode supported

### Code
- [ ] `next build` passes with zero errors
- [ ] No TypeScript `any` or suppressions
- [ ] Follows exact codebase conventions
- [ ] No unused imports
- [ ] layout.tsx + page.tsx structure

### Accessibility
- [ ] All inputs labeled
- [ ] Keyboard navigable
- [ ] Contrast ratios pass
- [ ] ARIA labels on icon buttons

### Category-Specific (select one)
- [ ] Health: Medical disclaimer present
- [ ] Health: WHO/NIH/ACSM sources cited
- [ ] Finance: Financial disclaimer present
- [ ] Finance: Tax/regulatory notes included
- [ ] Math: Step-by-step solution shown
- [ ] Developer: Code examples in 2+ languages
- [ ] Developer: Privacy/security note present
```

---

## 10. Content Review Rubric — Scoring System

Each piece of content is scored on a 1–5 scale across 6 dimensions. A tool fails review if **any dimension scores below 3** or the **total score is below 22/30**.

| Dimension | 1 (Fail) | 3 (Acceptable) | 5 (Excellent) |
|-----------|----------|-----------------|---------------|
| **Accuracy** | Contains errors or unsourced claims | Correct but uses generic sources | Verified against primary sources with citations |
| **Depth** | Under word count, surface-level | Meets minimum, covers basics | Exceeds minimum, covers edge cases and nuances |
| **Originality** | Copied/paraphrased from competitors | Original but conventional | Unique insights, data, or perspectives |
| **Utility** | Information without application | Actionable advice included | Immediately applicable, saves user time/money |
| **Readability** | Dense, jargon-heavy, no structure | Clear headings, decent flow | Scannable, well-structured, tables/lists used effectively |
| **E-E-A-T Signals** | No sources, no expertise shown | Some sources, basic expertise | Expert-level authority, multiple citations, updated date |

**Minimum passing score: 22/30 with no dimension below 3**

---

## 11. Anti-Patterns — What Will Get Rejected

These are things that will cause a tool to be blocked from shipping. Study them.

### Content Anti-Patterns

- ❌ **Filler content** — Restating the same concept in different words to pad word count
- ❌ **Generic FAQs** — "What is [tool name]?" as the first FAQ (the main content already answers this)
- ❌ **Copy-paste descriptions** — Reusing the same description structure across multiple tools without customizing
- ❌ **Missing worked example** — Showing a formula without demonstrating it with real numbers
- ❌ **Unsourced health claims** — Any health assertion without a citation
- ❌ **Vague interpretation** — "Your result depends on many factors" without specifying which factors and what ranges

### UX Anti-Patterns

- ❌ **Calculate button required** — Real-time calculation is the standard; no user should click "Calculate"
- ❌ **Results below the fold** — User should see some result without scrolling
- ❌ **Wall of inputs** — More than 6–8 inputs without visual grouping or progressive disclosure
- ❌ **Number-only results** — Displaying "127" without context (127 what? Is that good or bad?)
- ❌ **No default values** — Empty inputs showing an empty state forces the user to guess valid input

### Code Anti-Patterns

- ❌ **God components** — A single 800-line component with embedded constants, types, and logic
- ❌ **Prop drilling** — Passing more than 2 levels of props without context or composition
- ❌ **State bloat** — Using `useState` for values that can be derived from other state via `useMemo`
- ❌ **Non-deterministic renders** — Components that produce different output for the same input due to uncontrolled side effects

---

## 12. File Templates — Boilerplate Structure

### layout.tsx Template

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TOOL_NAME — BENEFIT_STATEMENT | SoftZaR",
  description:
    "ACTION_VERB PRIMARY_KEYWORD based on INPUTS. UNIQUE_VALUE. Free TOOL_TYPE.",
  keywords: [
    "primary keyword",
    "semantic variant 1",
    "semantic variant 2",
    "long-tail query 1",
    "long-tail query 2",
    "comparison keyword",
    "audience keyword",
    "action keyword",
  ],
  openGraph: {
    title: "TOOL_NAME — SHORT_BENEFIT",
    description: "DESCRIPTION_SIMILAR_TO_META",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOOL_NAME | SoftZaR",
    description: "CONCISE_ONE_LINE_DESCRIPTION",
  },
};

export default function TOOLNAMELayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

### page.tsx Template

```tsx
"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
// Import specific icons from lucide-react

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  { question: "FAQ_1_QUESTION", answer: "FAQ_1_ANSWER_50_TO_100_WORDS" },
  { question: "FAQ_2_QUESTION", answer: "FAQ_2_ANSWER_50_TO_100_WORDS" },
  { question: "FAQ_3_QUESTION", answer: "FAQ_3_ANSWER_50_TO_100_WORDS" },
  { question: "FAQ_4_QUESTION", answer: "FAQ_4_ANSWER_50_TO_100_WORDS" },
  { question: "FAQ_5_QUESTION", answer: "FAQ_5_ANSWER_50_TO_100_WORDS" },
  { question: "FAQ_6_QUESTION", answer: "FAQ_6_ANSWER_50_TO_100_WORDS" },
];

// ─── Types ─────────────────────────────────────────
// Define all types here

// ─── Constants ─────────────────────────────────────
// Define options, lookup tables, reference data

// ─── Helper Functions ──────────────────────────────
// Pure functions for calculations

// ─── Component ─────────────────────────────────────
export default function TOOLNAME() {
  // State declarations
  // useMemo for computed results

  return (
    <ToolLayout
      title="TOOL_DISPLAY_NAME"
      description="TOOL_DESCRIPTION_FOR_ABOVE_TOOL_WIDGET"
      category={{ name: "CATEGORY_NAME", slug: "CATEGORY_SLUG" }}
      lastUpdated="MONTH YEAR"
      faqs={faqs}
      howToSteps={[
        { name: "Step 1 name", text: "Step 1 description" },
        { name: "Step 2 name", text: "Step 2 description" },
        { name: "Step 3 name", text: "Step 3 description" },
        { name: "Step 4 name", text: "Step 4 description" },
      ]}
      relatedTools={[
        { name: "Related Tool 1", href: "/related-tool-1" },
        { name: "Related Tool 2", href: "/related-tool-2" },
        { name: "Related Tool 3", href: "/related-tool-3" },
        { name: "Related Tool 4", href: "/related-tool-4" },
        { name: "Related Tool 5", href: "/related-tool-5" },
      ]}
      content={
        <>
          {/* Layer 3: What This Tool Does (~100 words) */}
          <h2>What Is TOOL_NAME?</h2>
          <p>EXPLANATION_100_WORDS</p>

          {/* Layer 4: The Formula / How It Works (~150+ words) */}
          <h2>How Is METRIC Calculated?</h2>
          <p><strong>Formula: SHOW_FORMULA</strong></p>
          <h3>Worked Example</h3>
          <p>SPECIFIC_EXAMPLE_WITH_NUMBERS</p>

          {/* Layer 5: Interpretation Guide (~100+ words) */}
          <h2>Understanding Your Results</h2>
          <p>WHAT_RESULTS_MEAN_AND_WHAT_TO_DO</p>

          {/* Layer 6: Deep Educational Content (500-1000+ words) */}
          <h2>TOPIC_DEEP_DIVE_H2_1</h2>
          <p>DEEP_CONTENT</p>
          <h2>TOPIC_DEEP_DIVE_H2_2</h2>
          <p>DEEP_CONTENT</p>

          {/* Layer 8: Sources */}
          <h2>Sources and References</h2>
          <ul>
            <li>CITATION_1</li>
            <li>CITATION_2</li>
            <li>CITATION_3</li>
          </ul>
        </>
      }
    >
      {/* Layer 2: The Tool Widget */}
      <div className="space-y-6">
        {/* Inputs */}
        {/* Results */}
        {/* Empty state */}
      </div>
    </ToolLayout>
  );
}
```

### lib/tools.ts Registry Entry Template

```tsx
{
  slug: "tool-slug-matching-directory",
  name: "Tool Display Name",
  description:
    "One-sentence description with primary keyword, explaining what it does and for whom",
  category: "category-id",  // must match config/site.ts category id
  keywords: ["primary keyword", "variant 1", "variant 2", "variant 3", "variant 4"],
},
```

---

## Summary: The Quality Stack

```
┌─────────────────────────────────────────┐
│              SHIP TO PRODUCTION          │
│    Only if ALL gates pass ✅             │
├─────────────────────────────────────────┤
│  Gate 5: SEO Completeness               │
│  Gate 4: Technical Quality (build pass)  │
│  Gate 3: User Respect (privacy, mobile)  │
│  Gate 2: Content Completeness (8 layers) │
│  Gate 1: Accuracy (3+ edge cases tested) │
├─────────────────────────────────────────┤
│  Category Framework Applied              │
│  (Health/Finance/Math/Dev/Text/etc.)     │
├─────────────────────────────────────────┤
│  Content Rubric Score ≥ 22/30            │
│  No dimension below 3/5                  │
├─────────────────────────────────────────┤
│  Anti-Patterns Checklist: ZERO matches   │
├─────────────────────────────────────────┤
│       THE GOLDEN RULE                    │
│  "Is this the best free version of       │
│   this tool on the internet?"            │
│  If NO → iterate until YES              │
└─────────────────────────────────────────┘
```

---

## 13. Site-Wide Audit Checklist — Run After Every Batch

> **When to audit:** After every batch of 5 tool implementations, before any deployment, or whenever SEO regressions are suspected.

### 13.1 Cross-Reference Verification

Before checking individual tools, build an inventory by cross-referencing:
1. Every tool marked ✅ in `MASTER_TOOLS_LIST.md`
2. Every tool entry in `lib/tools.ts`
3. Every tool directory in `app/(tools)/`

**Any mismatch = immediate fix.** A tool must exist in ALL three locations.

### 13.2 Per-Tool Audit Items

For each implemented tool, verify:

**File & Structure:**
- [ ] Tool exists at correct path: `app/(tools)/(category)/tool-slug/page.tsx` + `layout.tsx`
- [ ] Registered in `lib/tools.ts` with correct slug, name, description, category, keywords
- [ ] No orphaned or duplicate files

**Functionality:**
- [ ] Produces correct results for standard inputs
- [ ] Edge cases handled (zero, negative, max values, empty)
- [ ] Input validation shows user-friendly errors
- [ ] All interactive elements work (buttons, copy, toggles)

**SEO Metadata (in layout.tsx):**
- [ ] Title follows pattern: `[Tool Name] — [Benefit] | SoftZaR` (< 60 chars)
- [ ] Meta description: 150–160 chars with CTA
- [ ] 8+ keywords in metadata
- [ ] OG + Twitter card tags present
- [ ] Canonical URL correct

**Schema Markup (via ToolLayout):**
- [ ] FAQPage schema (from `faqs` prop)
- [ ] HowTo schema (from `howToSteps` prop)
- [ ] WebApplication schema (automatic)
- [ ] BreadcrumbList schema (automatic)

**Content (8 Layers):**
- [ ] Word count meets category minimum (1,000+ / 1,200+ for YMYL)
- [ ] 5–6 FAQs with 50–100 word answers
- [ ] Sources section with academic/government citations
- [ ] Category-specific disclaimer present (health, finance)

### 13.3 Site-Wide Checks (Once Per Session)

**Home Page & Navigation:**
- [ ] Every ✅ tool appears on homepage under correct category
- [ ] Every ✅ tool appears in header dropdown under correct category
- [ ] Every ✅ tool is discoverable via site search
- [ ] No dead links to unimplemented tools

**Global SEO:**
- [ ] `sitemap.xml` includes all implemented tool pages
- [ ] `robots.txt` does not block important pages
- [ ] No duplicate `<title>` tags across the site
- [ ] No duplicate meta descriptions across the site
- [ ] `next build` passes with zero errors

**Internal Linking:**
- [ ] No 404s from internal links
- [ ] Each tool links to 5 related tools
- [ ] Breadcrumb navigation present and correct on all tool pages

### 13.4 Audit Report Format

```markdown
# Audit Report — [Date]

## Summary
- Tools audited: [N]
- Critical issues: [N]
- Minor issues: [N]

## Critical Issues (fix immediately)
- [Location]: [Problem] → [Fix]

## Minor Issues (fix in next session)
- [Location]: [Problem] → [Fix]

## All Passing
- [List of tools that passed all checks]
```

---

## 14. Site Architecture Constraints — Non-Negotiable Rules

### 14.1 Client-Side-First Architecture

All calculator and math tools **must run 100% client-side in the browser**. No API calls, no server involvement. This is how Calculator.net handles hundreds of millions of pageviews on cheap infrastructure — the browser does all the work.

With Next.js SSG, tool pages are static HTML files served from Cloudflare's edge. A page serving 30 million users per month costs almost nothing to host when it's a static file.

**Only PDF manipulation and image processing tools** may hit the server, and those go through an asynchronous queue. Heavy jobs are processed server-side and output files land in Cloudflare R2.

### 14.2 Sanity.io CMS Boundaries

| Lives in Sanity (CMS-managed) | Does NOT live in Sanity |
|-------------------------------|-------------------------|
| Blog posts, articles, reviews | Tools themselves |
| Editorial/long-form content | Tool UI, logic, inputs, outputs |
| Content managed by non-developers | Tool descriptions, FAQs, how-to text |

**Rules:**
- Every tool is a **self-contained component** built directly in the codebase
- Tool page copy (descriptions, FAQs) is **hardcoded in the component** — NOT fetched from Sanity
- Never create Sanity schemas for tool functionality
- Never modify existing Sanity schemas without explicit approval
- If a tool page displays related blog posts from Sanity, it's a **read-only query** only

### 14.3 Cost Constraints

| Traffic Level | Monthly Infra Cost | Revenue (Mediavine) |
|---------------|-------------------|---------------------|
| 7k users | ~$0 (free tier) | Journey ads |
| 50k users | ~$0 (free tier) | $200/mo (main Mediavine) |
| 100k users | ~$75/mo | $400/mo |
| 1M users | ~$150/mo | $3,500/mo |

**Rule:** Add a paid service only when you feel the pain of not having it. Never pre-optimize for scale you haven't reached.

### 14.4 Tech Stack (Current)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSG + SSR, edge-optimized |
| Language | TypeScript (strict) | Type safety, 20-year maintainability |
| Styling | Tailwind CSS + Shadcn/ui | Consistent design system |
| CMS | Sanity.io | Blog/review content only |
| Hosting | Vercel | Zero-config deploys |
| CDN | Cloudflare | Edge caching, DDoS protection |
| File Storage | Cloudflare R2 | Zero-egress for PDF/image tools |
| Ads | Journey by Mediavine | Revenue generation |

---

## 15. Agent Startup Sequence — Batch Implementation Workflow

> Every implementation session must follow these steps IN ORDER before writing any code.

### Step 1 — Select Tools
1. Read `MASTER_TOOLS_LIST.md` → Find ⬜ Todo tools
2. Prioritize by: competitor coverage (3/3 > 2/3 > 1/3), search volume, and category gaps
3. Select top 5 tools for this batch
4. Output selection with brief rationale

### Step 2 — Study Existing Patterns
1. Read 2-3 implemented tools in the same category
2. Note: file structure, component patterns, naming conventions, content density
3. **Match these patterns exactly** — do not introduce new structural patterns

### Step 3 — Implement (per tool)
1. Create `layout.tsx` (metadata, OG, Twitter)
2. Create `page.tsx` (component + 8 content layers)
3. Register in `lib/tools.ts`
4. Follow this file's Quality Gates (Section 2) and Category Framework (Section 4)

### Step 4 — Post-Implementation
1. Run `next build` — must pass with zero errors
2. Mark tools as ✅ Done in `MASTER_TOOLS_LIST.md`
3. Update any related tool chain links
4. Run audit checklist (Section 13) for the batch

---

## 16. Documentation Map — Single Source of Truth

| File | Purpose | Status |
|------|---------|--------|
| `QUALITY_FRAMEWORK.md` | **THIS FILE** — All quality standards, category frameworks, audit procedures, architecture constraints | ✅ Master Document |
| `MASTER_TOOLS_LIST.md` | Complete tool inventory with priorities, status, and competitor coverage | ✅ Active |
| `lib/tools.ts` | Tool registry — determines homepage/search/nav visibility | ✅ Code |
| `config/site.ts` | Category definitions (id, slug, name) | ✅ Code |
| `components/layout/ToolLayout.tsx` | Shared layout with automatic schema markup | ✅ Code |

**There are no other documentation files.** If it's not in `QUALITY_FRAMEWORK.md` or `MASTER_TOOLS_LIST.md`, it doesn't exist as a standard.

---

*Build tools worth using. Write content worth reading. Ship quality worth trusting.*
