"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Cat, Dog, PawPrint, Sparkles, Scale, Clock3, Info } from "lucide-react";
import {
  DogSize,
  PetType,
  catAgeToHumanYears,
  dogAgeToHumanYears,
  dogAgeToHumanYearsLog,
  getCatLifeStage,
  getDogExpectedLifespan,
  getDogLifeStage,
  getDogPostSecondYearFactor,
  getDogSeniorStartYear,
  yearsMonthsToDecimal,
} from "@/lib/pet-age";

const faqs: FAQItem[] = [
  {
    question: "Is one pet year really equal to seven human years?",
    answer:
      "No. The 1:7 rule is a rough myth and does not match modern veterinary guidance. Dogs and cats age much faster in their first two years, then the pace changes. For example, many clinical charts treat a one-year-old medium dog as roughly 15 human years, while a two-year-old cat is often mapped to about 24 human years. After that, aging progresses more gradually and differently by species and, for dogs, by size.",
  },
  {
    question: "Why does dog size matter when converting dog years to human years?",
    answer:
      "Body size is strongly associated with canine longevity. Smaller dogs generally live longer and reach senior status later, while larger and giant breeds often age into senior care earlier. That is why this calculator uses size-aware post-second-year rates and senior thresholds instead of a single universal multiplier. It helps provide a more realistic estimate for care planning, wellness checks, and age-appropriate lifestyle decisions.",
  },
  {
    question: "Why do cats and dogs have different conversion formulas?",
    answer:
      "Cats and dogs have different developmental timelines, average lifespans, and disease patterns. A cat reaching maturity follows a different curve than a dog, especially compared with large-breed dogs. Veterinary organizations and pet health references therefore publish separate age-stage models. Using species-specific logic is more helpful than forcing one formula across all pets because it better reflects real-world life stages and preventive care timing.",
  },
  {
    question: "What is the logarithmic dog age formula, and should I use it?",
    answer:
      "A well-known research model uses DNA methylation data and maps dog age to human age using a logarithmic equation (human age = 16 ln(dog age) + 31). It is useful for research context and highlights that early canine aging is rapid. However, it was developed under specific study conditions and is not always the most practical day-to-day clinical tool for every breed. This calculator shows it as a comparison, not a diagnosis.",
  },
  {
    question: "Can this tool tell me whether my pet is healthy for their age?",
    answer:
      "No. It estimates age equivalence and life stage, but it cannot measure health status, pain, organ function, or disease risk on its own. Two pets with the same converted age can have very different health profiles depending on genetics, weight, diet, exercise, and chronic conditions. Use the result as a planning aid for nutrition, activity, and checkup frequency, then confirm decisions with your veterinarian.",
  },
  {
    question: "When should I switch to senior pet checkups?",
    answer:
      "For many cats, annual senior-focused screening often starts around 10 to 11 years, with more frequent monitoring as they age. For dogs, timing depends on size: giant breeds may enter senior care around 6 years, large breeds around 7, medium breeds around 8, and small breeds around 10. Your veterinarian may recommend earlier lab work if there are risk factors like obesity, dental disease, or chronic symptoms.",
  },
];

interface DogSizeOption {
  value: DogSize;
  label: string;
  detail: string;
}

interface AgePreset {
  label: string;
  years: number;
  months: number;
}

const dogSizeOptions: DogSizeOption[] = [
  { value: "small", label: "Small", detail: "< 20 lb" },
  { value: "medium", label: "Medium", detail: "20-50 lb" },
  { value: "large", label: "Large", detail: "51-90 lb" },
  { value: "giant", label: "Giant", detail: "> 90 lb" },
];

const agePresets: AgePreset[] = [
  { label: "6 mo", years: 0, months: 6 },
  { label: "1 yr", years: 1, months: 0 },
  { label: "2 yr", years: 2, months: 0 },
  { label: "5 yr", years: 5, months: 0 },
  { label: "10 yr", years: 10, months: 0 },
];

export default function PetAgeCalculator() {
  const [petType, setPetType] = useState<PetType>("dog");
  const [dogSize, setDogSize] = useState<DogSize>("medium");
  const [ageYears, setAgeYears] = useState("4");
  const [ageMonths, setAgeMonths] = useState("0");

  const result = useMemo(() => {
    const years = Number(ageYears);
    const months = Number(ageMonths);

    if (
      !Number.isFinite(years) ||
      !Number.isFinite(months) ||
      years < 0 ||
      years > 35 ||
      months < 0 ||
      months > 11
    ) {
      return null;
    }

    const petAgeYears = yearsMonthsToDecimal(years, months);
    const humanAge =
      petType === "cat"
        ? catAgeToHumanYears(petAgeYears)
        : dogAgeToHumanYears(petAgeYears, dogSize);

    const dogLogAge =
      petType === "dog" ? dogAgeToHumanYearsLog(petAgeYears) : null;
    const lifeStage =
      petType === "cat"
        ? getCatLifeStage(petAgeYears)
        : getDogLifeStage(petAgeYears, dogSize);
    const expectedLifespan =
      petType === "cat" ? 15 : getDogExpectedLifespan(dogSize);
    const lifeProgress = Math.min(100, (petAgeYears / expectedLifespan) * 100);

    const projection = Array.from({ length: 5 }, (_, index) => {
      const projectedPetAge = petAgeYears + index;
      const projectedHumanAge =
        petType === "cat"
          ? catAgeToHumanYears(projectedPetAge)
          : dogAgeToHumanYears(projectedPetAge, dogSize);

      return {
        petAge: projectedPetAge,
        humanAge: projectedHumanAge,
      };
    });

    return {
      petAgeYears,
      humanAge,
      dogLogAge,
      lifeStage,
      expectedLifespan,
      lifeProgress,
      projection,
    };
  }, [ageMonths, ageYears, dogSize, petType]);

  const petTypeLabel = petType === "dog" ? "dog" : "cat";
  const roundedHumanAge = result ? Math.round(result.humanAge * 10) / 10 : null;

  const dynamicHeroImgSource = petType === "dog"
    ? "/images/tools/health/dog-age-hero.webp"
    : "/images/tools/health/cat-age-hero.webp";
  const dynamicHeroAlt = petType === "dog"
    ? "Adorable puppy representing dog aging"
    : "Adorable kitten representing cat aging";

  return (
    <ToolLayout
      title="Pet Age Calculator"
      description="Convert your dog or cat age into human years with species-specific formulas, size-aware dog logic, and clear life-stage guidance for smarter daily care."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      heroImage={{
        src: dynamicHeroImgSource,
        alt: dynamicHeroAlt
      }}
      faqs={faqs}
      howToSteps={[
        {
          name: "Choose pet type",
          text: "Select dog or cat. If you choose dog, also pick the size group to use a better post-second-year conversion pace.",
        },
        {
          name: "Enter age",
          text: "Input years and months. The calculator converts this to a decimal pet age and applies species-specific logic instantly.",
        },
        {
          name: "Read human-equivalent result",
          text: "Review the large primary result, life stage, and projected age table to understand where your pet is now and where they are heading.",
        },
        {
          name: "Plan age-appropriate care",
          text: "Use the output to discuss nutrition, activity, preventive screening, and checkup timing with your veterinarian.",
        },
      ]}
      relatedTools={[
        { name: "Dog Age Calculator", href: "/dog-age-calculator" },
        { name: "Cat Age Calculator", href: "/cat-age-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Date Calculator", href: "/date-calculator" },
        { name: "Countdown Timer", href: "/countdown-timer" },
      ]}
      content={
        <>
          <h2>What Is a Pet Age Calculator?</h2>
          <p>
            A pet age calculator converts your pet&apos;s chronological age into an
            approximate human-equivalent age so you can better understand life
            stage, preventive care timing, and realistic expectations for energy,
            behavior, and health monitoring. It is not just a novelty number.
            When interpreted correctly, age conversion helps owners decide when to
            shift from growth-focused care to adult maintenance and then to senior
            screening. In practical terms, this tool can support conversations
            about diet quality, weight control, joint support, dental frequency,
            and bloodwork scheduling. If you also want to compare your own age
            milestones for family planning, you can pair this with our{" "}
            <Link href="/age-calculator" className="text-primary hover:underline">
              Age Calculator
            </Link>{" "}
            for a side-by-side perspective.
          </p>

          <h2>How Pet Age Is Calculated</h2>
          <p>
            This tool uses separate formulas for dogs and cats because they do not
            age at the same biological pace. Early-life development is much faster
            than late-life aging, so a fixed multiplier (like 7) is not reliable.
          </p>

          <h3>Dog Formula (Clinical Chart Model)</h3>
          <p>
            For dogs, we use a three-part approach informed by widely referenced
            veterinary guidance:
          </p>
          <ul>
            <li>First year: approximately 15 human years</li>
            <li>Second year: approximately +9 human years (total ~24)</li>
            <li>
              After year two: add a size-aware yearly factor (small, medium,
              large, giant)
            </li>
          </ul>
          <p>
            This reflects the practical reality that larger dogs often age into
            senior status earlier than smaller dogs. The size-adjusted pace is
            especially useful after age two, when growth has stabilized and
            long-term aging differences become more visible.
          </p>

          <h3>Cat Formula</h3>
          <p>
            For cats, we use a commonly used veterinary-friendly mapping:
          </p>
          <ul>
            <li>First year: approximately 15 human years</li>
            <li>Second year: approximately +9 human years (total ~24)</li>
            <li>After year two: approximately +4 human years per cat year</li>
          </ul>
          <p>
            This model aligns with well-known feline age charts and gives owners a
            stable way to think about transitions from adult to mature to senior
            care.
          </p>

          <h3>Worked Example</h3>
          <p>
            Suppose you have a 6-year-old medium dog. First two years map to about
            24 human years. Years 3 through 6 add roughly 5 human years each (4
            years × 5 = 20). Estimated human-equivalent age is about 44. For a
            6-year-old cat, first two years map to 24 and years 3 through 6 add
            16 (4 × 4), giving roughly 40 human years. Same chronological age,
            different aging curve.
          </p>

          <h2>Understanding Your Result</h2>
          <p>
            The most useful output is not only the headline number, but the
            combination of number + life stage + trajectory. A converted age helps
            you answer practical questions: Should I move to a senior food? Is it
            time for more frequent dental checks? Should exercise become lower
            impact but still consistent? In this calculator, life stage and
            projected age rows are shown together so you can plan forward, not just
            react. A pet entering mature or senior years benefits from preventive
            care before symptoms become obvious. The age estimate is best used as a
            planning framework, then refined with your veterinarian based on body
            condition, breed history, and current clinical findings.
          </p>

          <h2>Why Dogs and Cats Age Differently</h2>
          <p>
            Dogs and cats differ in growth speed, adult physiology, and lifespan
            distribution. Dogs show greater lifespan variation across size classes,
            while cats are generally less size-diverse and follow a more stable
            post-maturity progression. Dogs also have stronger breed-driven
            differences in orthopedic stress, cardiometabolic load, and age at
            senior transition. In contrast, cat aging patterns are often framed
            more by life stage and environment (indoor vs. outdoor exposure,
            nutrition, stress, and preventive care access). That is why a
            single-species-agnostic rule is less useful for real care decisions.
            A better model is one that separates species first, then applies
            size-aware logic for dogs.
          </p>

          <h2>Dog Size and Aging Speed</h2>
          <p>
            Larger dogs tend to have shorter average lifespans and earlier senior
            transitions. Smaller dogs usually age more slowly after maturity and
            often remain in an adult phase for longer. This does not mean every
            giant dog will age poorly or every small dog will age perfectly, but it
            is a meaningful population-level trend used in veterinary planning.
            Size-adjusted conversion helps make your result more realistic and can
            improve timing for senior lab panels, mobility support, and diet
            updates.
          </p>
          <table>
            <thead>
              <tr>
                <th>Dog Size</th>
                <th>Post-2-Year Pace (Human Years per Dog Year)</th>
                <th>Typical Senior Transition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Small</td>
                <td>~{getDogPostSecondYearFactor("small").toFixed(1)}</td>
                <td>~{getDogSeniorStartYear("small")} years</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>~{getDogPostSecondYearFactor("medium").toFixed(1)}</td>
                <td>~{getDogSeniorStartYear("medium")} years</td>
              </tr>
              <tr>
                <td>Large</td>
                <td>~{getDogPostSecondYearFactor("large").toFixed(1)}</td>
                <td>~{getDogSeniorStartYear("large")} years</td>
              </tr>
              <tr>
                <td>Giant</td>
                <td>~{getDogPostSecondYearFactor("giant").toFixed(1)}</td>
                <td>~{getDogSeniorStartYear("giant")} years</td>
              </tr>
            </tbody>
          </table>

          <h2>Cat Life Stages and Care Priorities</h2>
          <p>
            Cat age conversion is most helpful when tied to stage-based care.
            Kittens and juniors need growth nutrition, vaccination adherence, and
            behavior shaping. Adult cats need weight control and routine preventive
            checks. Mature and senior cats benefit from earlier screening for
            common chronic issues such as kidney disease, thyroid disease, dental
            problems, and arthritis-related mobility changes. Super senior cats may
            still appear active, but subtle behavioral changes become clinically
            important. Appetite shifts, reduced jumping, litter box changes, or
            altered social behavior are often early clues that deserve discussion
            with a veterinarian. The conversion number helps owners recognize these
            transitions sooner.
          </p>

          <h2>Limits of Any Pet Age Conversion Model</h2>
          <p>
            All age-equivalence models are approximations. They simplify complex
            biology into understandable ranges and should not be used as stand-alone
            diagnostics. Breed mix, genetics, sterilization timing, chronic
            disease, nutrition quality, body condition score, exercise load,
            environment, and preventive care quality all influence true biological
            aging. Even research-backed formulas may be built from specific cohorts
            and not transfer perfectly to every breed or household context. Use
            this tool to improve decisions, not to replace clinical assessment. If
            your pet shows weight loss, breathing changes, appetite drop, unusual
            thirst, confusion, limping, or persistent behavior shifts, seek
            veterinary evaluation regardless of the converted age.
          </p>

          <h2>Healthy Aging Checklist for Pet Owners</h2>
          <ul>
            <li>
              Keep body condition lean: excess weight accelerates mobility and
              metabolic strain.
            </li>
            <li>
              Maintain regular dental care: oral disease can affect whole-body
              health.
            </li>
            <li>
              Preserve movement quality: daily low-impact activity supports joints
              and cognition.
            </li>
            <li>
              Review diet by life stage: growth, adult maintenance, and senior
              nutrition are not interchangeable.
            </li>
            <li>
              Increase preventive screening as pets enter mature and senior stages.
            </li>
            <li>
              Track behavior monthly: small changes are often the earliest signs of
              age-related disease.
            </li>
          </ul>

          <p>
            <strong>Medical disclaimer:</strong> This pet age calculator is for
            educational use only and does not provide veterinary diagnosis or
            treatment advice. Converted age estimates are population-level
            approximations. Always consult a licensed veterinarian for individualized
            recommendations.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>
              American Kennel Club (AKC). &ldquo;How to Calculate Dog Years to Human
              Years.&rdquo; Includes AVMA-aligned first-year and second-year guidance.
            </li>
            <li>
              Wang, T. et al. (2020). &ldquo;Quantitative translation of dog-to-human
              aging by conserved remodeling of epigenetic networks.&rdquo;{" "}
              <em>Cell Systems</em>.
            </li>
            <li>
              International Cat Care (iCatCare). &ldquo;How to tell your cat&apos;s age in
              human years.&rdquo; Cat life-stage and conversion chart.
            </li>
            <li>
              Quimby, J. et al. (2021). &ldquo;AAHA/AAFP Feline Life Stage
              Guidelines.&rdquo; <em>Journal of Feline Medicine and Surgery</em>.
            </li>
            <li>
              American Veterinary Medical Association (AVMA). Senior pet care and
              age-related veterinary screening principles.
            </li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground flex items-center gap-2">
            <PawPrint className="h-4 w-4 text-primary" />
            Select Pet Type
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => setPetType("dog")}
              className={`min-h-11 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${petType === "dog"
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                : "border-border text-muted-foreground hover:border-primary/50"
                }`}
            >
              <Dog className="h-4 w-4" />
              Dog
            </button>
            <button
              onClick={() => setPetType("cat")}
              className={`min-h-11 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${petType === "cat"
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                : "border-border text-muted-foreground hover:border-primary/50"
                }`}
            >
              <Cat className="h-4 w-4" />
              Cat
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Age (Years)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={35}
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

        {petType === "dog" && (
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
                    className={`text-sm font-medium ${dogSize === option.value
                      ? "text-primary"
                      : "text-foreground"
                      }`}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.detail}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Quick Presets
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {agePresets.map((preset) => (
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
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-5">
              <p className="text-xs uppercase tracking-wide text-primary/80">
                Human-Equivalent Age
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {roundedHumanAge}
                </span>
                <span className="text-lg text-primary/80">years</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your {petTypeLabel} is in the <strong>{result.lifeStage}</strong>{" "}
                stage.
              </p>
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                    style={{ width: `${result.lifeProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Approximate life-stage progress based on an expected lifespan of{" "}
                  {result.expectedLifespan} years.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Pet Age (Decimal)
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {result.petAgeYears.toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Life Stage
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {result.lifeStage}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Expected Lifespan
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ~{result.expectedLifespan}y
                </p>
              </div>
            </div>

            {petType === "dog" && (
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Dog Formula Comparison
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Clinical Size-Aware
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {result.humanAge.toFixed(1)} years
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Best for everyday owner interpretation and stage planning.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      DNA Log Formula
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {result.dogLogAge ? result.dogLogAge.toFixed(1) : "N/A"}{" "}
                      years
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Research-oriented comparison model, not a diagnosis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                Five-Year Projection
              </p>
              <div className="mt-3 space-y-2 sm:hidden">
                {result.projection.map((row) => (
                  <div
                    key={`mobile-${row.petAge}`}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Pet Age
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.petAge.toFixed(2)} years
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      Human-Equivalent
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {row.humanAge.toFixed(1)} years
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">
                        Pet Age
                      </th>
                      <th className="pb-2 font-medium text-muted-foreground">
                        Human-Equivalent Age
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.projection.map((row) => (
                      <tr key={row.petAge} className="border-b border-border/60">
                        <td className="py-2 pr-4 text-foreground">
                          {row.petAge.toFixed(2)} years
                        </td>
                        <td className="py-2 text-foreground font-medium">
                          {row.humanAge.toFixed(1)} years
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
                <Info className="h-5 w-5 shrink-0 mt-0.5" />
                This calculator provides educational estimates. Always pair age
                conversion with real veterinary assessment, especially if your pet
                has behavior changes, weight loss, mobility decline, or chronic
                disease history.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Enter valid values: years between 0 and 35, months between 0 and 11.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
