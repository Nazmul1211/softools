"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Beef, Dumbbell, Target, Scale, Activity, Info, ChevronDown, Flame, Apple } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How much protein do I need per day to build muscle?",
    answer:
      "According to the International Society of Sports Nutrition (ISSN), individuals engaged in regular resistance training should consume 1.6–2.2 grams of protein per kilogram of body weight per day to maximize muscle growth. For a 70 kg (154 lb) person, that translates to 112–154 grams of protein daily. Spreading this across 3–5 meals with 20–40 grams per serving optimizes muscle protein synthesis throughout the day.",
  },
  {
    question: "Can you eat too much protein?",
    answer:
      "For healthy individuals, high protein intake (up to 2.2 g/kg/day) has not been shown to damage kidneys or bones. A 2016 study in the Journal of the International Society of Sports Nutrition found no adverse effects from consuming up to 3.4 g/kg/day over a year. However, individuals with pre-existing kidney disease should consult their doctor before significantly increasing protein intake.",
  },
  {
    question: "Is plant protein as effective as animal protein for muscle building?",
    answer:
      "Plant proteins can be equally effective when consumed in adequate amounts and combined to form complete amino acid profiles. Soy, quinoa, and buckwheat are complete plant proteins. Other plant sources (rice, beans, lentils) can be combined throughout the day to achieve a full amino acid profile. Studies show no significant difference in muscle growth between plant and animal protein when total intake and leucine content are matched.",
  },
  {
    question: "When is the best time to eat protein?",
    answer:
      "Research suggests distributing protein evenly across meals (every 3–5 hours) is more effective for muscle protein synthesis than consuming it in one or two large meals. Consuming 20–40 grams of protein within 2 hours after exercise can enhance recovery, though the 'anabolic window' is wider than previously believed. A protein-rich meal before bed (casein protein is ideal) has also been shown to support overnight muscle recovery.",
  },
  {
    question: "How much protein do I need for weight loss?",
    answer:
      "During a calorie deficit, protein needs increase to preserve lean muscle mass. The ISSN recommends 1.6–2.4 g/kg/day during weight loss. Higher protein intake (up to 2.4 g/kg) during aggressive dieting helps prevent muscle loss, increases satiety (so you feel fuller), and boosts the thermic effect of food — your body burns about 20–30% of protein calories just digesting them, compared to 5–10% for carbs.",
  },
  {
    question: "Do older adults need more protein?",
    answer:
      "Yes. The European Society for Clinical Nutrition and Metabolism (ESPEN) recommends 1.0–1.2 g/kg/day for healthy older adults (over 65), rising to 1.2–1.5 g/kg/day for those who are malnourished or at risk. Age-related anabolic resistance means older adults need a higher per-meal protein dose (25–40 grams with at least 2.5 grams of leucine) to achieve the same muscle protein synthesis response as younger adults.",
  },
];

/* ────────────── Types ────────────── */

type Unit = "kg" | "lbs";
type Sex = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";
type Goal = "maintain" | "muscle" | "lose" | "endurance";

interface ActivityOption {
  value: ActivityLevel;
  label: string;
  description: string;
}

interface GoalOption {
  value: Goal;
  label: string;
  description: string;
  icon: React.ReactNode;
}

/* ────────────── Constants ────────────── */

const activityOptions: ActivityOption[] = [
  { value: "sedentary", label: "Sedentary", description: "Little or no exercise" },
  { value: "light", label: "Lightly Active", description: "Light exercise 1–3 days/week" },
  { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3–5 days/week" },
  { value: "active", label: "Very Active", description: "Hard exercise 6–7 days/week" },
  { value: "athlete", label: "Athlete / Intense", description: "Professional or intense daily training" },
];

const goalOptions: GoalOption[] = [
  { value: "maintain", label: "Maintain Weight", description: "Keep current body composition", icon: <Scale className="h-4 w-4" /> },
  { value: "muscle", label: "Build Muscle", description: "Maximize muscle growth", icon: <Dumbbell className="h-4 w-4" /> },
  { value: "lose", label: "Lose Fat", description: "Preserve muscle while cutting", icon: <Flame className="h-4 w-4" /> },
  { value: "endurance", label: "Endurance Sport", description: "Running, cycling, swimming", icon: <Activity className="h-4 w-4" /> },
];

/* Protein multiplier ranges (grams per kg body weight) — evidence-based */
const proteinRanges: Record<Goal, Record<ActivityLevel, { min: number; max: number }>> = {
  maintain: {
    sedentary: { min: 0.8, max: 1.0 },
    light: { min: 1.0, max: 1.2 },
    moderate: { min: 1.0, max: 1.4 },
    active: { min: 1.2, max: 1.6 },
    athlete: { min: 1.4, max: 1.8 },
  },
  muscle: {
    sedentary: { min: 1.2, max: 1.6 },
    light: { min: 1.4, max: 1.8 },
    moderate: { min: 1.6, max: 2.0 },
    active: { min: 1.6, max: 2.2 },
    athlete: { min: 1.8, max: 2.4 },
  },
  lose: {
    sedentary: { min: 1.2, max: 1.6 },
    light: { min: 1.4, max: 1.8 },
    moderate: { min: 1.6, max: 2.2 },
    active: { min: 1.8, max: 2.4 },
    athlete: { min: 2.0, max: 2.4 },
  },
  endurance: {
    sedentary: { min: 1.0, max: 1.2 },
    light: { min: 1.2, max: 1.4 },
    moderate: { min: 1.2, max: 1.6 },
    active: { min: 1.4, max: 1.8 },
    athlete: { min: 1.6, max: 2.0 },
  },
};

/* ────────────────────── Component ────────────────────── */

export default function ProteinIntakeCalculator() {
  const [weight, setWeight] = useState<string>("70");
  const [unit, setUnit] = useState<Unit>("kg");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<string>("30");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  /* ── Computed results ── */
  const results = useMemo(() => {
    const w = parseFloat(weight);
    const a = parseInt(age, 10);
    if (!w || w <= 0 || !a || a <= 0) return null;

    const weightKg = unit === "lbs" ? w * 0.453592 : w;
    const range = proteinRanges[goal][activity];

    /* Adjust for age: older adults need slightly more */
    let ageMultiplier = 1.0;
    if (a >= 65) ageMultiplier = 1.15;
    else if (a >= 50) ageMultiplier = 1.08;

    const minGrams = Math.round(weightKg * range.min * ageMultiplier);
    const maxGrams = Math.round(weightKg * range.max * ageMultiplier);
    const recommendedGrams = Math.round((minGrams + maxGrams) / 2);

    /* Per-meal breakdown (4 meals) */
    const mealsPerDay = 4;
    const perMealMin = Math.round(minGrams / mealsPerDay);
    const perMealMax = Math.round(maxGrams / mealsPerDay);

    /* Calories from protein (1g protein = 4 kcal) */
    const minCalories = minGrams * 4;
    const maxCalories = maxGrams * 4;

    /* Per-kg ratio */
    const ratioMin = range.min * ageMultiplier;
    const ratioMax = range.max * ageMultiplier;

    return {
      minGrams,
      maxGrams,
      recommendedGrams,
      perMealMin,
      perMealMax,
      minCalories,
      maxCalories,
      ratioMin: ratioMin.toFixed(1),
      ratioMax: ratioMax.toFixed(1),
      weightKg: Math.round(weightKg),
    };
  }, [weight, unit, age, activity, goal]);

  const getGoalLabel = () => goalOptions.find((g) => g.value === goal)?.label ?? "";
  const getActivityLabel = () => activityOptions.find((a) => a.value === activity)?.label ?? "";

  return (
    <ToolLayout
      title="Protein Intake Calculator"
      description="Calculate your optimal daily protein intake based on body weight, activity level, and fitness goals. Evidence-based recommendations backed by ISSN, WHO, and ESPEN research guidelines."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter your body weight", text: "Input your current weight in kilograms or pounds. Toggle the unit selector to switch between kg and lbs." },
        { name: "Select your activity level", text: "Choose the activity level that best describes your typical weekly exercise routine, from sedentary to athlete-level training." },
        { name: "Choose your fitness goal", text: "Select whether you want to maintain weight, build muscle, lose fat, or fuel endurance sports. Each goal has different protein requirements." },
        { name: "Review your protein target", text: "Read your personalized daily protein recommendation in grams, per-meal breakdown, and calories from protein. Adjust inputs to see how goals change your needs." },
      ]}
      relatedTools={[
        { name: "Macro Calculator", href: "/macro-calculator" },
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "TDEE Calculator", href: "/tdee-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Body Fat Calculator", href: "/body-fat-calculator" },
      ]}
      content={
        <>
          {/* ─── Section 1: What this calculator does (~100 words) ─── */}
          <h2>What Is a Protein Intake Calculator?</h2>
          <p>
            A protein intake calculator estimates how many grams of protein you should eat each day based on your body weight, how active you are, and what your fitness goals look like. Unlike generic &ldquo;one size fits all&rdquo; recommendations, this tool uses evidence-based multipliers drawn from the International Society of Sports Nutrition (ISSN) and the World Health Organization (WHO) to give you a personalized range. Whether you are a sedentary office worker, a recreational gym-goer, or a competitive athlete, your protein needs are different — and this calculator reflects that.
          </p>

          {/* ─── Section 2: The formula / how it works (~150 words + worked example) ─── */}
          <h2>How Is Daily Protein Intake Calculated?</h2>
          <p>
            The core formula is straightforward:
          </p>
          <p>
            <strong>Daily Protein (grams) = Body Weight (kg) × Protein Multiplier (g/kg)</strong>
          </p>
          <p>
            The multiplier varies by goal and activity level. For general health in a sedentary person, the WHO recommends a minimum of <strong>0.8 g/kg/day</strong>. For muscle building with intense training, the ISSN recommends <strong>1.6–2.2 g/kg/day</strong>. During fat loss, protein needs increase further to <strong>1.6–2.4 g/kg/day</strong> to preserve lean mass.
          </p>
          <h3>Worked Example</h3>
          <p>
            Let&apos;s say you weigh <strong>75 kg (165 lbs)</strong>, exercise moderately (3–5 days per week), and want to build muscle. The recommended multiplier range is 1.6–2.0 g/kg:
          </p>
          <ul>
            <li><strong>Minimum:</strong> 75 × 1.6 = 120 grams/day</li>
            <li><strong>Maximum:</strong> 75 × 2.0 = 150 grams/day</li>
            <li><strong>Recommended target:</strong> ~135 grams/day</li>
            <li><strong>Per meal (4 meals):</strong> 30–38 grams per meal</li>
            <li><strong>Calories from protein:</strong> 480–600 kcal (about 25–30% of a 2,000-calorie diet)</li>
          </ul>

          {/* ─── Section 3: Interpretation guide (~100+ words) ─── */}
          <h2>Understanding Your Results</h2>
          <p>
            Your result is displayed as a <strong>range</strong> (minimum to maximum grams), not a single fixed number. This reflects the reality that optimal protein intake varies by individual factors like genetics, training intensity, and meal timing. Here is how to interpret your range:
          </p>
          <ul>
            <li><strong>Use the minimum</strong> if you are new to higher protein intake or prefer plant-based sources</li>
            <li><strong>Aim for the middle</strong> of the range as your daily target for most purposes</li>
            <li><strong>Push toward the maximum</strong> during aggressive calorie deficits or intense training phases</li>
          </ul>
          <p>
            The <strong>per-meal breakdown</strong> divides your daily target across 4 meals. Research by Schoenfeld and Aragon (2018) shows that distributing protein into 3–5 servings of 20–40 grams each maximizes the muscle protein synthesis response throughout the day.
          </p>

          {/* ─── Section 4: Protein by goal (deep content) ─── */}
          <h2>Protein Requirements by Fitness Goal</h2>

          <h3>Protein for Muscle Building (Hypertrophy)</h3>
          <p>
            Building muscle requires a positive nitrogen balance, achieved by consuming more protein than your body breaks down. A landmark 2018 meta-analysis by Morton et al., published in the British Journal of Sports Medicine, analyzed 49 studies with 1,863 participants and concluded that <strong>1.6 g/kg/day</strong> is the point of diminishing returns for muscle gains from resistance training. However, individual variation means some people benefit from up to 2.2 g/kg. The key is combining adequate protein with progressive resistance training — one without the other produces suboptimal results.
          </p>

          <h3>Protein for Fat Loss</h3>
          <p>
            During calorie restriction, protein becomes even more critical. A 2014 study by Helms et al. in the Journal of the International Society of Sports Nutrition recommends <strong>1.8–2.7 g/kg of lean body mass</strong> during energy restriction for athletes. Protein preserves muscle during a deficit, enhances satiety (helping you stick to your diet), and has the highest thermic effect of any macronutrient — your body expends approximately 20–30% of protein calories during digestion, compared to 5–10% for carbohydrates and 0–3% for fats.
          </p>

          <h3>Protein for Endurance Athletes</h3>
          <p>
            Endurance athletes (runners, cyclists, swimmers) have different needs than strength athletes. The American College of Sports Medicine (ACSM) recommends <strong>1.2–1.7 g/kg/day</strong> for endurance athletes, with intake at the higher end during periods of heavy training or when training multiple times per day. Protein supports muscle repair after long aerobic sessions and helps maintain immune function during high-volume training blocks.
          </p>

          <h3>Protein for Sedentary Adults</h3>
          <p>
            The Recommended Dietary Allowance (RDA) of 0.8 g/kg/day is the <strong>minimum to prevent deficiency</strong>, not the optimal amount. Recent research suggests even sedentary adults benefit from 1.0–1.2 g/kg/day for better body composition, satiety, and metabolic health. This calculator accounts for this updated understanding.
          </p>

          {/* ─── Section 5: Protein sources ─── */}
          <h2>Best Protein Sources: Animal vs. Plant</h2>
          <h3>High-Quality Animal Protein Sources</h3>
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th>Protein per 100g</th>
                <th>Leucine Content</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Chicken breast</td><td>31g</td><td>2.5g</td></tr>
              <tr><td>Lean beef</td><td>26g</td><td>2.0g</td></tr>
              <tr><td>Salmon</td><td>25g</td><td>1.8g</td></tr>
              <tr><td>Eggs (whole)</td><td>13g</td><td>1.1g</td></tr>
              <tr><td>Greek yogurt</td><td>10g</td><td>0.9g</td></tr>
              <tr><td>Whey protein isolate</td><td>90g</td><td>10–12g</td></tr>
            </tbody>
          </table>

          <h3>High-Quality Plant Protein Sources</h3>
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th>Protein per 100g</th>
                <th>Complete Amino Profile?</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Tofu (firm)</td><td>17g</td><td>Yes</td></tr>
              <tr><td>Tempeh</td><td>19g</td><td>Yes</td></tr>
              <tr><td>Lentils (cooked)</td><td>9g</td><td>No (low methionine)</td></tr>
              <tr><td>Chickpeas (cooked)</td><td>8g</td><td>No (low methionine)</td></tr>
              <tr><td>Quinoa (cooked)</td><td>4.4g</td><td>Yes</td></tr>
              <tr><td>Pea protein isolate</td><td>80g</td><td>Nearly (low methionine)</td></tr>
            </tbody>
          </table>
          <p>
            The key amino acid for triggering muscle protein synthesis is <strong>leucine</strong>. Animal sources are naturally richer in leucine, but combining plant sources (e.g., rice + beans) or using pea/soy protein isolates closes this gap effectively.
          </p>

          {/* ─── Section 6: Common myths ─── */}
          <h2>Common Protein Myths — Debunked</h2>
          <ul>
            <li><strong>&ldquo;High protein damages your kidneys&rdquo;</strong> — No evidence in healthy individuals. A 2018 meta-analysis (Devries et al.) found no adverse renal effects from high protein intake in people without pre-existing kidney disease.</li>
            <li><strong>&ldquo;You can only absorb 30g of protein per meal&rdquo;</strong> — This is a misinterpretation. Your body absorbs all protein you eat. The 20–40g per meal recommendation refers to the amount that maximally stimulates muscle protein synthesis in a single sitting, not total absorption.</li>
            <li><strong>&ldquo;Protein timing matters more than total intake&rdquo;</strong> — Total daily protein intake is the primary driver of muscle growth. Timing is secondary. A 2013 meta-analysis by Schoenfeld et al. found that when total daily protein was equated, timing had no significant additional effect.</li>
            <li><strong>&ldquo;Women should eat less protein than men&rdquo;</strong> — Protein recommendations are per kilogram of body weight, so they naturally adjust. Women who strength train have the same g/kg requirements as men for building and maintaining muscle.</li>
          </ul>

          {/* ─── Section 7: Protein for special populations ─── */}
          <h2>Protein Needs by Age Group</h2>
          <ul>
            <li><strong>Children (4–13 years):</strong> 0.95 g/kg/day — growth requires adequate protein, though proportionally less than adults due to lower lean mass</li>
            <li><strong>Teenagers (14–18 years):</strong> 0.85–1.0 g/kg/day — higher during growth spurts and if participating in sports</li>
            <li><strong>Adults (19–64 years):</strong> 0.8–2.2 g/kg/day depending on activity and goals (as outlined in this calculator)</li>
            <li><strong>Older adults (65+ years):</strong> 1.0–1.5 g/kg/day — higher per-meal doses (25–40g) recommended to overcome anabolic resistance</li>
            <li><strong>Pregnant women:</strong> An additional 25 grams/day above baseline, especially in the 2nd and 3rd trimesters</li>
          </ul>

          {/* ─── Section 8: Sources / references ─── */}
          <h2>Sources and Scientific References</h2>
          <ul>
            <li>Jäger, R., et al. (2017). &ldquo;International Society of Sports Nutrition Position Stand: Protein and Exercise.&rdquo; <em>Journal of the International Society of Sports Nutrition</em>, 14:20.</li>
            <li>Morton, R.W., et al. (2018). &ldquo;A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength.&rdquo; <em>British Journal of Sports Medicine</em>, 52(6), 376–384.</li>
            <li>Helms, E.R., et al. (2014). &ldquo;A systematic review of dietary protein during caloric restriction in resistance trained lean athletes.&rdquo; <em>International Journal of Sport Nutrition and Exercise Metabolism</em>, 24(2), 127–138.</li>
            <li>Deutz, N.E., et al. (2014). &ldquo;Protein intake and exercise for optimal muscle function with aging: recommendations from the ESPEN Expert Group.&rdquo; <em>Clinical Nutrition</em>, 33(6), 929–936.</li>
            <li>World Health Organization (2007). &ldquo;Protein and amino acid requirements in human nutrition.&rdquo; <em>WHO Technical Report Series</em>, No. 935.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Weight Input ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            Body Weight
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              min="20"
              max="300"
              className="flex-1 rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setUnit("kg")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === "kg"
                    ? "bg-white dark:bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                kg
              </button>
              <button
                onClick={() => setUnit("lbs")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === "lbs"
                    ? "bg-white dark:bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                lbs
              </button>
            </div>
          </div>
        </div>

        {/* ── Age & Sex Row ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Age</label>
            <input
              type="number"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              min="1"
              max="120"
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Sex</label>
            <div className="flex gap-2 h-[50px]">
              <button
                onClick={() => setSex("male")}
                className={`flex-1 rounded-lg border text-sm font-medium transition-all ${
                  sex === "male"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setSex("female")}
                className={`flex-1 rounded-lg border text-sm font-medium transition-all ${
                  sex === "female"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>

        {/* ── Activity Level ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Activity Level
          </label>
          <div className="space-y-2">
            {activityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActivity(opt.value)}
                className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-all ${
                  activity === opt.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-foreground">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.description}</div>
                </div>
                {activity === opt.value && (
                  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Fitness Goal ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Fitness Goal
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {goalOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGoal(opt.value)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                  goal === opt.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${goal === opt.value ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {opt.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        {results && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Beef className="h-5 w-5 text-primary" />
              Your Daily Protein Target
            </h3>

            {/* Primary result card */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-foreground">{results.recommendedGrams}</span>
                <span className="text-lg text-muted-foreground">grams/day</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended for {getGoalLabel().toLowerCase()} with {getActivityLabel().toLowerCase()} lifestyle
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                    style={{
                      width: `${Math.min(100, (results.recommendedGrams / (results.weightKg * 2.4)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {results.ratioMin}–{results.ratioMax} g/kg
                </span>
              </div>
            </div>

            {/* Detailed breakdown */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Range</p>
                <p className="text-lg font-bold text-foreground">
                  {results.minGrams}–{results.maxGrams}g
                </p>
                <p className="text-xs text-muted-foreground">per day</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Per Meal</p>
                <p className="text-lg font-bold text-foreground">
                  {results.perMealMin}–{results.perMealMax}g
                </p>
                <p className="text-xs text-muted-foreground">across 4 meals</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calories</p>
                <p className="text-lg font-bold text-foreground">
                  {results.minCalories}–{results.maxCalories}
                </p>
                <p className="text-xs text-muted-foreground">kcal from protein</p>
              </div>
            </div>

            {/* Visual protein sources quick guide */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Apple className="h-4 w-4 text-primary" />
                Quick Protein Reference
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                To hit {results.recommendedGrams}g, here is what a typical day could look like:
              </p>
              <div className="space-y-2">
                {[
                  { food: "Chicken breast (150g)", protein: 46 },
                  { food: "Greek yogurt (200g)", protein: 20 },
                  { food: "Eggs (3 large)", protein: 18 },
                  { food: "Lentils, cooked (200g)", protein: 18 },
                  { food: "Whey protein shake (1 scoop)", protein: 25 },
                ].map((item) => (
                  <div key={item.food} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.food}</span>
                    <span className="font-medium text-foreground">{item.protein}g</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-2">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-primary">127g</span>
                </div>
              </div>
            </div>

            {/* Info notice */}
            <div className="rounded-xl border border-border bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                These recommendations are based on clinical research for healthy adults. If you have kidney disease, liver disease, or other medical conditions, consult your healthcare provider before significantly changing your protein intake. This calculator is for educational purposes and does not replace professional dietary advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
