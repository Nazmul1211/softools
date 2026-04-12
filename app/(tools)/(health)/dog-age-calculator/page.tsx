"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  Dog,
  PawPrint,
  Scale,
  Sparkles,
  Clock,
  Info,
  ShieldCheck,
  Activity,
} from "lucide-react";
import {
  DogSize,
  dogAgeToHumanYears,
  dogAgeToHumanYearsLog,
  getDogExpectedLifespan,
  getDogLifeStage,
  getDogPostSecondYearFactor,
  getDogSeniorStartYear,
  yearsMonthsToDecimal,
} from "@/lib/pet-age";

const faqs: FAQItem[] = [
  {
    question: "What is the most practical formula for dog years to human years?",
    answer:
      "For everyday planning, many owners use a clinical chart-style model: first year about 15 human years, second year about +9, then size-aware yearly progression. This captures fast early development and better reflects differences between small and giant breeds. It is generally more practical for wellness planning than the old 1:7 rule because it gives more realistic stage transitions for nutrition, mobility support, and senior screening.",
  },
  {
    question: "Why does a giant dog age 'faster' than a small dog?",
    answer:
      "Population data consistently show that larger dogs tend to have shorter average lifespans and earlier senior transitions. Smaller breeds often maintain adult function longer before entering senior care. The exact biology is complex, but the pattern is strong enough that size-aware age conversion is useful in practice. That is why this calculator applies different post-second-year pacing and senior thresholds by size group.",
  },
  {
    question: "What is the DNA logarithmic dog age equation?",
    answer:
      "A widely cited research equation is human age = 16 ln(dog age) + 31, based on DNA methylation patterns. It highlights very rapid early aging in dogs and slower relative progression later. It is valuable scientifically and useful as a comparison model. However, because it was built from specific study conditions and is less intuitive for owners, many veterinarians still rely on clinical chart models for day-to-day communication.",
  },
  {
    question: "When is my dog considered senior?",
    answer:
      "Senior status depends on size. A giant dog may enter senior care around 6 years, a large dog around 7, a medium dog around 8, and a small dog around 10. These are practical transitions, not strict biological cutoffs. The point is to increase preventive focus earlier for larger dogs, including weight management, joint monitoring, dental assessment, and routine laboratory screening.",
  },
  {
    question: "Can this calculator tell me if my dog is healthy?",
    answer:
      "No. It estimates age equivalence and life stage only. Health status depends on physical examination, history, body condition, behavior, lab values, and diagnostics. Two dogs with the same converted age may have very different health needs. Use this tool to improve planning and communication, then tailor decisions with your veterinarian, especially if there are signs like limping, weight loss, appetite change, or altered breathing.",
  },
  {
    question: "How often should an older dog have wellness checks?",
    answer:
      "As many dogs enter senior years, wellness checks often shift from annual to every 6 months. Earlier and more frequent monitoring can detect organ trends, endocrine changes, and mobility problems before quality of life declines. Frequency should be individualized by size, breed risk, body condition, and clinical history. Your veterinarian can set an interval that balances prevention, cost, and your dog's risk profile.",
  },
];

interface DogSizeOption {
  value: DogSize;
  label: string;
  detail: string;
}

type Method = "clinical" | "dna";

const dogSizeOptions: DogSizeOption[] = [
  { value: "small", label: "Small", detail: "< 20 lb" },
  { value: "medium", label: "Medium", detail: "20-50 lb" },
  { value: "large", label: "Large", detail: "51-90 lb" },
  { value: "giant", label: "Giant", detail: "> 90 lb" },
];

function getCheckupCadence(ageYears: number, size: DogSize): string {
  const seniorStart = getDogSeniorStartYear(size);

  if (ageYears >= seniorStart) return "Every 6 months";
  if (ageYears >= Math.max(3, seniorStart - 2)) return "Every 6-12 months";

  return "About every 12 months";
}

function getCareFocus(stage: string): string {
  if (stage === "Puppy") return "Growth, behavior training, vaccination schedule";
  if (stage === "Young Adult") return "Weight control, dental prevention, routine fitness";
  if (stage === "Adult") return "Joint protection, body condition, preventive labs";
  if (stage === "Senior") return "Mobility, cognition, organ screening, pain assessment";

  return "Comfort planning, quality-of-life tracking, symptom management";
}

export default function DogAgeCalculator() {
  const [ageYears, setAgeYears] = useState("5");
  const [ageMonths, setAgeMonths] = useState("0");
  const [dogSize, setDogSize] = useState<DogSize>("medium");
  const [method, setMethod] = useState<Method>("clinical");

  const result = useMemo(() => {
    const years = Number(ageYears);
    const months = Number(ageMonths);

    if (
      !Number.isFinite(years) ||
      !Number.isFinite(months) ||
      years < 0 ||
      years > 30 ||
      months < 0 ||
      months > 11
    ) {
      return null;
    }

    const dogAgeYears = yearsMonthsToDecimal(years, months);
    const clinicalHumanAge = dogAgeToHumanYears(dogAgeYears, dogSize);
    const dnaHumanAge = dogAgeToHumanYearsLog(dogAgeYears);
    const primaryHumanAge =
      method === "dna" && dnaHumanAge !== null ? dnaHumanAge : clinicalHumanAge;
    const stage = getDogLifeStage(dogAgeYears, dogSize);
    const expectedLifespan = getDogExpectedLifespan(dogSize);
    const lifeProgress = Math.min(100, (dogAgeYears / expectedLifespan) * 100);
    const checkupCadence = getCheckupCadence(dogAgeYears, dogSize);
    const careFocus = getCareFocus(stage);

    const sizeComparison = dogSizeOptions.map((sizeOption) => ({
      size: sizeOption.label,
      humanAge: dogAgeToHumanYears(dogAgeYears, sizeOption.value),
    }));

    const projection = Array.from({ length: 6 }, (_, index) => {
      const projectedDogAge = dogAgeYears + index;
      return {
        dogAge: projectedDogAge,
        clinicalAge: dogAgeToHumanYears(projectedDogAge, dogSize),
        stage: getDogLifeStage(projectedDogAge, dogSize),
      };
    });

    return {
      dogAgeYears,
      clinicalHumanAge,
      dnaHumanAge,
      primaryHumanAge,
      stage,
      expectedLifespan,
      lifeProgress,
      checkupCadence,
      careFocus,
      sizeComparison,
      projection,
    };
  }, [ageMonths, ageYears, dogSize, method]);

  return (
    <ToolLayout
      title="Dog Age Calculator"
      description="Convert dog years to human years with size-aware age conversion, life-stage interpretation, and optional DNA-log comparison to support better preventive care planning."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      heroImage={{
        src: "/images/tools/health/dog-age-hero.webp",
        alt: "Adorable puppy representing dog aging and life stages"
      }}
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your dog's age",
          text: "Provide years and months for a precise age input instead of rounding to the nearest full year.",
        },
        {
          name: "Choose dog size",
          text: "Select small, medium, large, or giant so post-second-year conversion and senior timing are size-aware.",
        },
        {
          name: "Pick the interpretation method",
          text: "Use Clinical (recommended) for practical planning or DNA-log for research-style comparison.",
        },
        {
          name: "Use stage-based guidance",
          text: "Review life stage, checkup cadence, and care focus to discuss nutrition, mobility, and screening plans with your veterinarian.",
        },
      ]}
      relatedTools={[
        { name: "Pet Age Calculator", href: "/pet-age-calculator" },
        { name: "Cat Age Calculator", href: "/cat-age-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Date Calculator", href: "/date-calculator" },
        { name: "Countdown Timer", href: "/countdown-timer" },
      ]}
      content={
        <>
          <h2>What Is a Dog Age Calculator?</h2>
          <p>
            A dog age calculator estimates your dog&apos;s human-equivalent age so you
            can better understand life stage and adjust care before problems become
            advanced. It is a planning tool, not a diagnostic test. When used well,
            age conversion helps owners decide when to shift from growth or
            performance-focused routines toward mature and senior preventive care:
            more frequent wellness checks, body condition review, mobility support,
            and targeted screening. Since dog aging differs substantially by size,
            this calculator emphasizes size-aware conversion instead of a one-rule
            approach. That keeps the output more realistic and clinically useful.
          </p>

          <h2>How Dog Years Are Converted to Human Years</h2>
          <p>
            The primary method in this tool follows a practical three-step model:
          </p>
          <ul>
            <li>First dog year ≈ 15 human years</li>
            <li>Second dog year adds ≈ 9 human years (total ≈ 24)</li>
            <li>
              Years after two use a size-aware increment (small slower, giant
              faster)
            </li>
          </ul>
          <p>
            This pattern reflects rapid early canine development and then
            size-dependent adult aging. It is broadly aligned with commonly
            referenced veterinary education guidance and is usually easier to apply
            for owners than purely research equations.
          </p>

          <h3>Worked Example</h3>
          <p>
            Consider a 7-year-old large dog. The first two years map to about 24
            human years. Years 3 through 7 add five years of progression at a
            large-breed pace (5 × 5.8 ≈ 29). Estimated human-equivalent age is
            about 53. For a 7-year-old small dog, the same calculation with a lower
            post-second-year pace gives a younger equivalent estimate. Same
            chronological age, different biological context.
          </p>

          <h2>Clinical Model vs. DNA Log Model</h2>
          <p>
            You can compare two perspectives in this calculator:
          </p>
          <ul>
            <li>
              <strong>Clinical model (recommended):</strong> better for practical
              owner communication, size-aware stage planning, and routine
              prevention.
            </li>
            <li>
              <strong>DNA log model:</strong> based on methylation research and
              useful for scientific context and trajectory comparison.
            </li>
          </ul>
          <p>
            The DNA model (human age = 16 ln(dog age) + 31) highlights that very
            young dogs age rapidly relative to humans. It is informative, but less
            intuitive for everyday wellness decisions. Many owners use the clinical
            output as primary and the DNA output as a secondary reference.
          </p>

          <h2>Why Dog Size Changes Aging Pace</h2>
          <p>
            Larger dogs generally move into senior care earlier and have shorter
            average lifespans than smaller dogs. Smaller dogs often remain in adult
            function longer. This pattern is strong enough that using one post-adult
            multiplier for all dogs can mislead owners. Size-aware conversion helps
            align expectations for checkup frequency, mobility planning, diet
            transitions, and owner vigilance. It does not mean any individual dog
            must follow the average exactly, but it gives a better baseline than
            fixed-multiplier myths.
          </p>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Post-2-Year Pace</th>
                <th>Typical Senior Start</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Small</td>
                <td>~{getDogPostSecondYearFactor("small").toFixed(1)} human years/dog year</td>
                <td>~{getDogSeniorStartYear("small")} years</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>~{getDogPostSecondYearFactor("medium").toFixed(1)} human years/dog year</td>
                <td>~{getDogSeniorStartYear("medium")} years</td>
              </tr>
              <tr>
                <td>Large</td>
                <td>~{getDogPostSecondYearFactor("large").toFixed(1)} human years/dog year</td>
                <td>~{getDogSeniorStartYear("large")} years</td>
              </tr>
              <tr>
                <td>Giant</td>
                <td>~{getDogPostSecondYearFactor("giant").toFixed(1)} human years/dog year</td>
                <td>~{getDogSeniorStartYear("giant")} years</td>
              </tr>
            </tbody>
          </table>

          <h2>How to Interpret Your Dog&apos;s Result</h2>
          <p>
            A converted age is most useful when tied to action. If your dog is
            transitioning into senior stage, discuss whether exam frequency should
            increase, whether weight targets need adjustment, and whether baseline
            bloodwork should be repeated more often. If your dog is still in adult
            stage, focus on prevention: lean body condition, dental hygiene,
            mobility-preserving activity, and behavior trend tracking. The projected
            table in this tool helps you plan changes over the next years rather
            than waiting for symptoms to appear unexpectedly.
          </p>

          <h2>Age-Related Health Priorities in Dogs</h2>
          <ul>
            <li>
              <strong>Body condition and mobility:</strong> obesity accelerates
              joint stress and reduces quality of life.
            </li>
            <li>
              <strong>Dental disease:</strong> oral inflammation can affect
              appetite, comfort, and systemic health.
            </li>
            <li>
              <strong>Cardiometabolic and organ trends:</strong> risk rises with
              age and may need scheduled lab monitoring.
            </li>
            <li>
              <strong>Cognitive and behavior change:</strong> sleep pattern shifts,
              confusion, or anxiety can emerge with aging.
            </li>
            <li>
              <strong>Pain recognition:</strong> reduced play, slower movement, and
              reluctance to jump can signal chronic discomfort.
            </li>
          </ul>

          <h2>When to See a Veterinarian Sooner</h2>
          <p>
            Seek evaluation quickly if you notice unexplained weight loss, major
            appetite change, breathing difficulty, persistent vomiting or diarrhea,
            collapse episodes, new drinking/urination changes, marked lethargy,
            limping, or sudden behavior shifts. Age calculators are not emergency
            triage tools. They provide context, not diagnosis. Prompt assessment is
            especially important in older and larger dogs, where disease progression
            can be faster.
          </p>

          <h2>Limitations and Responsible Use</h2>
          <p>
            No conversion model can fully represent biological age in every breed
            and individual dog. Genetics, breed-specific disease risk, environment,
            sterilization timing, diet quality, exercise load, stress, and access
            to preventive care all matter. Use this calculator as a high-quality
            estimate for planning and communication, then personalize with your
            veterinarian. If you also own a cat and want a unified view, you can
            use our{" "}
            <Link href="/pet-age-calculator" className="text-primary hover:underline">
              Pet Age Calculator
            </Link>{" "}
            to compare species side by side.
          </p>

          <p>
            <strong>Medical disclaimer:</strong> This tool is educational and does
            not replace veterinary diagnosis or treatment advice.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>
              American Kennel Club (AKC). &ldquo;How to Calculate Dog Years to Human
              Years.&rdquo; Includes AVMA-aligned age conversion guidance.
            </li>
            <li>
              Wang, T. et al. (2020). &ldquo;Quantitative translation of dog-to-human
              aging by conserved remodeling of epigenetic networks.&rdquo;{" "}
              <em>Cell Systems</em>.
            </li>
            <li>
              American Veterinary Medical Association (AVMA). Senior pet care and
              age-related screening principles.
            </li>
            <li>
              Dog Aging Project. Research updates on canine aging, longevity, and
              translational aging science.
            </li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Dog Age (Years)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={30}
              value={ageYears}
              onChange={(e) => setAgeYears(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Extra Months
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={11}
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Dog Size
          </p>
          <div className="grid gap-2 sm:grid-cols-4">
            {dogSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDogSize(option.value)}
                className={`min-h-11 rounded-xl border px-3 py-3 text-left transition-all ${dogSize === option.value
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <p
                  className={`text-sm font-medium ${dogSize === option.value ? "text-primary" : "text-foreground"
                    }`}
                >
                  {option.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {option.detail}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Conversion Method
          </p>
          <div className="grid gap-2 rounded-lg bg-muted p-1 sm:grid-cols-2">
            <button
              onClick={() => setMethod("clinical")}
              className={`min-h-11 rounded-md px-3 py-2 text-left text-sm font-medium transition-all sm:text-center ${method === "clinical"
                  ? "bg-white dark:bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Clinical (Recommended)
            </button>
            <button
              onClick={() => setMethod("dna")}
              className={`min-h-11 rounded-md px-3 py-2 text-left text-sm font-medium transition-all sm:text-center ${method === "dna"
                  ? "bg-white dark:bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              DNA Log
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {[
            { label: "6 mo", years: 0, months: 6 },
            { label: "1 yr", years: 1, months: 0 },
            { label: "2 yr", years: 2, months: 0 },
            { label: "6 yr", years: 6, months: 0 },
            { label: "10 yr", years: 10, months: 0 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setAgeYears(String(preset.years));
                setAgeMonths(String(preset.months));
              }}
              className="min-h-11 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-5">
              <p className="text-xs uppercase tracking-wide text-primary/80">
                Human-Equivalent Dog Age ({method === "clinical" ? "Clinical" : "DNA Log"})
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {result.primaryHumanAge.toFixed(1)}
                </span>
                <span className="text-lg text-primary/80">years</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Current stage: <strong>{result.stage}</strong>
              </p>
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                    style={{ width: `${result.lifeProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expected lifespan context for this size: ~{result.expectedLifespan} years.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Dog Age (Decimal)
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {result.dogAgeYears.toFixed(2)}y
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Suggested Checkups
                </p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {result.checkupCadence}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Care Focus
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {result.careFocus}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Method Comparison
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Clinical Size-Aware
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {result.clinicalHumanAge.toFixed(1)} years
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    DNA Log Formula
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {result.dnaHumanAge ? result.dnaHumanAge.toFixed(1) : "N/A"} years
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-primary" />
                Same Dog Age Across Different Sizes
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {result.sizeComparison.map((item) => (
                  <div
                    key={item.size}
                    className="rounded-lg border border-border bg-background px-3 py-2 flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">{item.size}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.humanAge.toFixed(1)} years
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Six-Year Projection (Selected Size)
              </p>
              <div className="mt-3 space-y-2 sm:hidden">
                {result.projection.map((row) => (
                  <div
                    key={`mobile-${row.dogAge}`}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Dog Age
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.dogAge.toFixed(2)} years
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      Human-Equivalent
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.clinicalAge.toFixed(1)} years
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      Stage
                    </p>
                    <p className="text-sm font-medium text-foreground">{row.stage}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">
                        Dog Age
                      </th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">
                        Human-Equivalent
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        Stage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projection.map((row) => (
                      <tr key={row.dogAge} className="border-b border-border/60">
                        <td className="py-2 pr-4 text-foreground">
                          {row.dogAge.toFixed(2)} years
                        </td>
                        <td className="py-2 pr-4 font-medium text-foreground">
                          {row.clinicalAge.toFixed(1)} years
                        </td>
                        <td className="py-2 text-muted-foreground">{row.stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-4">
              <p className="text-sm text-emerald-800 dark:text-emerald-300 flex gap-2">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                Keep your dog lean, active, and regularly screened. Early trend
                tracking (weight, mobility, behavior, appetite) is often the most
                effective senior-care strategy.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Enter valid values: years between 0 and 30, months between 0 and 11.
          </div>
        )}

        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            Educational estimate only. This conversion does not diagnose disease or
            replace veterinary examination and testing.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Dog className="h-4 w-4 text-primary" />
            Have both cats and dogs at home?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the{" "}
            <Link href="/pet-age-calculator" className="text-primary hover:underline">
              Pet Age Calculator
            </Link>{" "}
            for quick cross-species age planning in one view.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
