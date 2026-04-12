"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  Cat,
  PawPrint,
  Sparkles,
  Clock3,
  Home,
  TreePine,
  ShieldCheck,
  Info,
} from "lucide-react";
import { catAgeToHumanYears, getCatLifeStage, yearsMonthsToDecimal } from "@/lib/pet-age";

const faqs: FAQItem[] = [
  {
    question: "How is cat age converted to human years?",
    answer:
      "A common feline conversion model maps the first year to about 15 human years, the second year to about +9 (total ~24), and each additional cat year to roughly +4 human years. This reflects faster early maturation and slower later progression. It is more realistic than a constant multiplier because kittens develop quickly in the first two years, while adult and senior cats age at a steadier pace.",
  },
  {
    question: "Is an indoor cat's age different from an outdoor cat's age?",
    answer:
      "Chronological age is the same, but practical aging burden can differ because environment changes risk exposure. Outdoor cats often face higher injury, infection, and stress risk, which can influence health outcomes and average lifespan. That is why this calculator lets you choose lifestyle context for planning and interpretation. The formula for human-equivalent age stays the same, but care urgency and preventive strategy may differ by environment.",
  },
  {
    question: "When is a cat considered senior?",
    answer:
      "Many feline guidelines consider cats around 11 years and older as senior, with super-senior status often discussed from about 15 years onward. That stage shift matters because subtle disease signs become more common: weight change, altered thirst, reduced jump ability, coat changes, and behavior shifts. Senior classification helps owners and veterinarians increase screening frequency before problems become advanced.",
  },
  {
    question: "Can this calculator detect kidney disease, thyroid disease, or arthritis?",
    answer:
      "No. This tool is for age conversion and planning, not diagnosis. Chronic kidney disease, hyperthyroidism, dental disease, arthritis, and cognitive changes require history, physical exam, and laboratory or imaging workup. Age conversion can help you time preventive care, but it cannot identify the cause of symptoms. If your cat shows appetite changes, litter box changes, or mobility decline, schedule a veterinary exam promptly.",
  },
  {
    question: "Why do some old cats still act young?",
    answer:
      "Individual variation is normal. Genetics, body condition, diet quality, preventive dental care, stress level, and disease burden all influence biological aging. Some senior cats keep high activity and social behavior, while younger cats with chronic pain or obesity may seem older than expected. Human-equivalent age should be interpreted as a framework, then combined with real clinical observations and veterinarian feedback.",
  },
  {
    question: "How often should an older cat get wellness checks?",
    answer:
      "As cats enter mature and senior stages, many veterinarians recommend moving from annual visits toward twice-yearly wellness checks, especially when there are risk factors like obesity, kidney trends, dental disease, or behavior change. More frequent monitoring allows earlier intervention and often better outcomes. Your veterinarian can personalize interval timing based on your cat's health history, exam findings, and laboratory trends.",
  },
];

type Lifestyle = "indoor" | "mixed" | "outdoor";

interface LifestyleOption {
  value: Lifestyle;
  label: string;
  detail: string;
  lifespanRange: [number, number];
  icon: React.ReactNode;
}

const lifestyleOptions: LifestyleOption[] = [
  {
    value: "indoor",
    label: "Indoor",
    detail: "Controlled environment, lower external risk",
    lifespanRange: [15, 18],
    icon: <Home className="h-4 w-4" />,
  },
  {
    value: "mixed",
    label: "Indoor + Outdoor",
    detail: "Mixed routine and exposure profile",
    lifespanRange: [12, 15],
    icon: <PawPrint className="h-4 w-4" />,
  },
  {
    value: "outdoor",
    label: "Mostly Outdoor",
    detail: "Higher environmental and trauma exposure",
    lifespanRange: [8, 12],
    icon: <TreePine className="h-4 w-4" />,
  },
];

function getCheckupCadence(lifeStage: string): string {
  if (lifeStage === "Senior" || lifeStage === "Super Senior") {
    return "About every 6 months";
  }

  if (lifeStage === "Mature") {
    return "Every 6-12 months";
  }

  return "About every 12 months";
}

function getLifeStageFocus(lifeStage: string): string {
  if (lifeStage === "Kitten") return "Vaccination schedule, growth, socialization";
  if (lifeStage === "Junior") return "Weight control, behavior shaping, routine prevention";
  if (lifeStage === "Adult") return "Body condition, dental care, enrichment";
  if (lifeStage === "Mature") return "Early screening, mobility, kidney and thyroid trends";
  if (lifeStage === "Senior") return "Twice-yearly checks, pain and organ monitoring";

  return "Comfort, quality-of-life tracking, proactive symptom support";
}

export default function CatAgeCalculator() {
  const [ageYears, setAgeYears] = useState("5");
  const [ageMonths, setAgeMonths] = useState("0");
  const [lifestyle, setLifestyle] = useState<Lifestyle>("indoor");

  const selectedLifestyle = lifestyleOptions.find(
    (option) => option.value === lifestyle
  ) ?? lifestyleOptions[0];

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

    const catAgeYears = yearsMonthsToDecimal(years, months);
    const humanAge = catAgeToHumanYears(catAgeYears);
    const lifeStage = getCatLifeStage(catAgeYears);
    const [minLife, maxLife] = selectedLifestyle.lifespanRange;
    const midpoint = (minLife + maxLife) / 2;
    const lifeProgress = Math.min(100, (catAgeYears / midpoint) * 100);
    const checkupCadence = getCheckupCadence(lifeStage);
    const focus = getLifeStageFocus(lifeStage);

    const projection = Array.from({ length: 6 }, (_, index) => {
      const projectedCatAge = catAgeYears + index;
      return {
        catAge: projectedCatAge,
        humanAge: catAgeToHumanYears(projectedCatAge),
        stage: getCatLifeStage(projectedCatAge),
      };
    });

    return {
      catAgeYears,
      humanAge,
      lifeStage,
      lifeProgress,
      checkupCadence,
      focus,
      projection,
      lifeRange: selectedLifestyle.lifespanRange,
    };
  }, [ageMonths, ageYears, selectedLifestyle.lifespanRange]);

  return (
    <ToolLayout
      title="Cat Age Calculator"
      description="Convert your cat's age into human years with a feline-specific formula, life-stage interpretation, and practical wellness guidance for indoor and outdoor lifestyles."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      heroImage={{
        src: "/images/tools/health/cat-age-hero.webp",
        alt: "Adorable cat portrait representing feline aging and life stages"
      }}
      faqs={faqs}
      howToSteps={[
        {
          name: "Enter your cat's age",
          text: "Add years and optional months to calculate a precise decimal age rather than rounding to full years.",
        },
        {
          name: "Choose lifestyle context",
          text: "Select indoor, mixed, or mostly outdoor so lifespan interpretation and stage planning are more practical.",
        },
        {
          name: "Review the conversion result",
          text: "Read the human-equivalent age, current life stage, and projected progression over the next several years.",
        },
        {
          name: "Use the care guidance",
          text: "Apply the stage focus and checkup cadence to discuss preventive care plans with your veterinarian.",
        },
      ]}
      relatedTools={[
        { name: "Pet Age Calculator", href: "/pet-age-calculator" },
        { name: "Dog Age Calculator", href: "/dog-age-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Date Calculator", href: "/date-calculator" },
        { name: "Countdown Timer", href: "/countdown-timer" },
      ]}
      content={
        <>
          <h2>What Is a Cat Age Calculator?</h2>
          <p>
            A cat age calculator translates your cat&apos;s chronological age into a
            human-equivalent estimate so life stage decisions become easier to
            understand. The goal is not to produce a perfect biological truth; the
            goal is to provide a practical framework for care timing. A number like
            &ldquo;40 human years&rdquo; can help owners recognize that a 6-year-old cat is
            no longer in an early-adult phase and may benefit from stronger
            preventive routines. Used properly, this type of conversion supports
            better conversations about nutrition, mobility, dental disease, kidney
            screening, thyroid trends, and behavior changes over time.
          </p>

          <h2>How Cat Years Are Converted to Human Years</h2>
          <p>
            This calculator uses a stage-aware feline model:
          </p>
          <ul>
            <li>Year 1 ≈ 15 human years</li>
            <li>Year 2 adds ≈ 9 human years (total ≈ 24)</li>
            <li>Each year after year 2 adds ≈ 4 human years</li>
          </ul>
          <p>
            This structure reflects rapid early maturation and slower long-term
            progression. It aligns with cat life-stage charts commonly used in pet
            education resources and is more informative than one fixed multiplier.
          </p>

          <h3>Worked Example</h3>
          <p>
            If your cat is 9 years old, the first two years map to about 24 human
            years. The remaining seven years (years 3 through 9) add 28 human years
            (7 × 4). Estimated human-equivalent age is about 52. This does not mean
            your cat will behave like every 52-year-old person. It means your cat
            is in a mature-to-senior transition zone where preventive screening and
            subtle symptom tracking become more important.
          </p>

          <h2>Understanding the Result: Number, Stage, and Context</h2>
          <p>
            The main number is useful, but the stage interpretation is what makes
            it actionable. In this tool, you also see the cat life stage and a
            projected age table. This helps with care planning over the next few
            years, not just today. For example, if your cat is in the mature stage,
            this is often the right time to discuss whether annual lab work should
            shift toward more frequent screening. If your cat is already senior,
            you can use the output to justify proactive pain assessment, kidney and
            thyroid monitoring, and household adjustments for comfort and mobility.
          </p>

          <h2>Cat Life Stages and What Changes in Care</h2>
          <p>
            Feline care priorities evolve by stage. Kittens need growth support,
            vaccination schedules, and safe socialization. Junior and adult cats
            benefit from steady weight control and daily enrichment because obesity
            in early adulthood increases later disease burden. Mature cats often
            show subtle shifts first: less jumping, slightly lower activity, or
            minor appetite changes. Senior and super-senior cats may require
            medication plans, more frequent labs, environmental adaptation, and
            closer quality-of-life discussions. Stage-based care is often more
            useful than reacting only when severe symptoms appear.
          </p>

          <h2>Indoor vs. Outdoor Context and Lifespan Interpretation</h2>
          <p>
            Age conversion itself remains the same, but lifestyle context changes
            practical interpretation. Indoor cats often have lower trauma and
            infection exposure, which can support longer average lifespans.
            Mixed-lifestyle cats have intermediate risk. Mostly outdoor cats may
            face higher injury and infectious disease pressure, making prevention,
            parasite control, and frequent observation even more important. This is
            why the calculator includes lifestyle-aware lifespan context. It helps
            owners make better preventive decisions while still understanding that
            individual outcomes vary widely by genetics, diet, body condition, and
            access to veterinary care.
          </p>

          <h2>Common Age-Related Conditions in Cats</h2>
          <p>
            As cats age, several conditions become more common and may develop
            slowly. Chronic kidney disease can present as increased thirst, weight
            loss, or reduced appetite. Hyperthyroidism can drive weight loss with
            increased hunger and activity changes. Dental disease may cause bad
            breath, food dropping, or avoidance of hard kibble. Osteoarthritis can
            present as reduced jumping, stiffness, altered grooming, or litter box
            reluctance. Cognitive changes may appear as nighttime vocalization,
            disorientation, or altered sleep patterns. Age conversion helps you
            anticipate these possibilities earlier, which often improves outcomes.
          </p>

          <h2>How to Use This Result in Real Life</h2>
          <ul>
            <li>Review body condition score every month and adjust calories early.</li>
            <li>Track litter box behavior and water intake for trend changes.</li>
            <li>Record activity and jump comfort as mobility indicators.</li>
            <li>Schedule dental evaluations before pain affects appetite.</li>
            <li>Discuss wellness lab frequency as your cat enters mature/senior stages.</li>
            <li>Update home setup: lower litter sides, easy-access rest zones, safer jumps.</li>
          </ul>

          <p>
            If you are comparing age transitions across species in one household,
            you can also use our{" "}
            <Link href="/pet-age-calculator" className="text-primary hover:underline">
              Pet Age Calculator
            </Link>{" "}
            for dog and cat side-by-side planning.
          </p>

          <h2>Limits and Responsible Use</h2>
          <p>
            This calculator is an educational planning aid. It does not diagnose
            disease, measure pain, or replace physical exams, lab testing, blood
            pressure checks, imaging, or clinical judgment. Two cats with identical
            converted ages may have very different health needs. Use this tool to
            improve timing and awareness, then personalize decisions with your
            veterinarian. If your cat has rapid weight loss, persistent vomiting,
            appetite decline, new thirst changes, breathing issues, or behavior
            disruption, seek care promptly regardless of conversion results.
          </p>

          <p>
            <strong>Medical disclaimer:</strong> This cat age calculator is for
            informational use only and is not veterinary medical advice.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>
              International Cat Care (iCatCare). &ldquo;How to tell your cat&apos;s age in
              human years.&rdquo; Feline age conversion and life-stage chart.
            </li>
            <li>
              Quimby, J. et al. (2021). &ldquo;AAHA/AAFP Feline Life Stage
              Guidelines.&rdquo; <em>Journal of Feline Medicine and Surgery</em>.
            </li>
            <li>
              American Association of Feline Practitioners (AAFP). Preventive care
              and wellness principles across life stages.
            </li>
            <li>
              American Animal Hospital Association (AAHA). Companion animal
              preventive care and senior screening recommendations.
            </li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Cat Age (Years)
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
            <Cat className="h-4 w-4 text-primary" />
            Lifestyle Context
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {lifestyleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLifestyle(option.value)}
                className={`min-h-11 rounded-xl border px-3 py-3 text-left transition-all ${lifestyle === option.value
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md p-1 ${lifestyle === option.value
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {option.icon}
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {option.label}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{option.detail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Typical lifespan: {option.lifespanRange[0]}-{option.lifespanRange[1]}y
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {[
            { label: "6 mo", years: 0, months: 6 },
            { label: "1 yr", years: 1, months: 0 },
            { label: "2 yr", years: 2, months: 0 },
            { label: "7 yr", years: 7, months: 0 },
            { label: "12 yr", years: 12, months: 0 },
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
                Human-Equivalent Cat Age
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {result.humanAge.toFixed(1)}
                </span>
                <span className="text-lg text-primary/80">years</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Current stage: <strong>{result.lifeStage}</strong>
              </p>
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                    style={{ width: `${result.lifeProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Lifestyle context lifespan range: {result.lifeRange[0]}-
                  {result.lifeRange[1]} years.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Cat Age (Decimal)
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {result.catAgeYears.toFixed(2)}y
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
                  Stage Focus
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {result.focus}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                Six-Year Projection
              </p>
              <div className="mt-3 space-y-2 sm:hidden">
                {result.projection.map((row) => (
                  <div
                    key={`mobile-${row.catAge}`}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Cat Age
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.catAge.toFixed(2)} years
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      Human-Equivalent
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.humanAge.toFixed(1)} years
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
                        Cat Age
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
                      <tr key={row.catAge} className="border-b border-border/60">
                        <td className="py-2 pr-4 text-foreground">
                          {row.catAge.toFixed(2)} years
                        </td>
                        <td className="py-2 pr-4 text-foreground font-medium">
                          {row.humanAge.toFixed(1)} years
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
                Track appetite, water intake, litter box behavior, and jump comfort
                monthly. Trend tracking often catches age-related disease earlier
                than occasional memory-based observation.
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
            Educational tool only. Age conversion does not replace veterinary
            diagnosis, exam findings, lab work, or treatment planning.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Looking for cross-species comparison?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try the{" "}
            <Link href="/pet-age-calculator" className="text-primary hover:underline">
              Pet Age Calculator
            </Link>{" "}
            to compare cat and dog conversion logic in one place.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
