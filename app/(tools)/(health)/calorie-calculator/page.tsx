"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Flame, Target, TrendingDown, TrendingUp, Activity } from "lucide-react";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
type Unit = "metric" | "imperial";
type Goal = "lose" | "maintain" | "gain";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

const activityDescriptions: Record<ActivityLevel, string> = {
  sedentary: "Little or no exercise, desk job",
  light: "Light exercise 1-3 days/week",
  moderate: "Moderate exercise 3-5 days/week",
  active: "Hard exercise 6-7 days/week",
  "very-active": "Very hard exercise, physical job",
};

const faqs: FAQItem[] = [
  {
    question: "How are daily calorie needs calculated?",
    answer: "Your daily calorie needs are calculated using the Mifflin-St Jeor equation, which determines your Basal Metabolic Rate (BMR) based on age, gender, height, and weight. This BMR is then multiplied by an activity factor to get your Total Daily Energy Expenditure (TDEE). The Mifflin-St Jeor equation is considered the most accurate for most people according to the American Dietetic Association."
  },
  {
    question: "What is TDEE and why does it matter?",
    answer: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including all activities. It combines your BMR (calories burned at rest) with calories burned through physical activity. Knowing your TDEE helps you understand how many calories you need to maintain your weight, and from there, you can adjust for weight loss or gain goals."
  },
  {
    question: "How many calories should I eat to lose weight?",
    answer: "A safe rate of weight loss is 0.5-1 kg (1-2 lbs) per week, which requires a calorie deficit of 500-1000 calories per day. Most experts recommend starting with a modest deficit of 500 calories below your TDEE. Extreme calorie restriction can slow your metabolism and lead to muscle loss. Always ensure you're eating at least 1,200 calories (women) or 1,500 calories (men) unless supervised by a healthcare provider."
  },
  {
    question: "How accurate are calorie calculators?",
    answer: "Calorie calculators provide estimates that are typically within 10% of your actual needs for most people. However, individual variation exists based on genetics, body composition, and other factors. Use the calculated number as a starting point, then adjust based on your actual results over 2-4 weeks. If you're not seeing expected changes, adjust your intake by 100-200 calories."
  },
  {
    question: "Should I eat back the calories I burn exercising?",
    answer: "It depends on your goals. If maintaining weight, eating back exercise calories helps prevent unintended weight loss. For weight loss, many experts recommend eating back 50-75% of exercise calories to fuel recovery without eliminating your deficit. Be cautious with estimates from fitness trackers, which often overestimate calories burned. When in doubt, eat slightly less than burned."
  },
  {
    question: "What's the difference between BMR and TDEE?",
    answer: "BMR (Basal Metabolic Rate) is the number of calories your body needs to perform basic life-sustaining functions like breathing, circulation, and cell production while at complete rest. TDEE (Total Daily Energy Expenditure) includes your BMR plus all calories burned through daily activities, exercise, and digestion. Your TDEE is always higher than your BMR."
  },
];

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("175");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  const results = useMemo(() => {
    let heightCm: number;
    let weightKg: number;

    if (unit === "metric") {
      heightCm = parseFloat(height) || 0;
      weightKg = parseFloat(weight) || 0;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
      weightKg = (parseFloat(weight) || 0) * 0.453592;
    }

    const ageNum = parseInt(age) || 0;

    if (heightCm <= 0 || weightKg <= 0 || ageNum <= 0) {
      return null;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const tdee = bmr * activityMultipliers[activity];

    // Goal-based adjustments
    let targetCalories: number;
    let deficit = 0;
    let surplus = 0;

    switch (goal) {
      case "lose":
        deficit = 500;
        targetCalories = tdee - deficit;
        break;
      case "gain":
        surplus = 300;
        targetCalories = tdee + surplus;
        break;
      default:
        targetCalories = tdee;
    }

    // Macronutrient suggestions (moderate approach)
    const proteinGrams = weightKg * 1.8; // 1.8g per kg for active individuals
    const fatCalories = targetCalories * 0.25;
    const fatGrams = fatCalories / 9;
    const proteinCalories = proteinGrams * 4;
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = carbCalories / 4;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      deficit,
      surplus,
      macros: {
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbGrams),
        fat: Math.round(fatGrams),
      },
      // Weight projections
      weeklyChange: goal === "lose" ? -0.5 : goal === "gain" ? 0.3 : 0,
    };
  }, [unit, gender, age, height, heightFt, heightIn, weight, activity, goal]);

  const reset = () => {
    setUnit("metric");
    setGender("male");
    setAge("30");
    setHeight("175");
    setHeightFt("5");
    setHeightIn("9");
    setWeight("70");
    setActivity("moderate");
    setGoal("maintain");
  };

  return (
    <ToolLayout
      title="Calorie Calculator"
      description="Calculate your daily calorie needs based on your body metrics and activity level. Get personalized recommendations for weight loss, maintenance, or muscle gain with macro breakdowns."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "BMR Calculator", href: "/bmr-calculator" },
        { name: "Body Fat Calculator", href: "/body-fat-calculator" },
        { name: "Ideal Weight Calculator", href: "/ideal-weight-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Your Daily Calorie Needs</h2>
          <p>
            Calories are the energy currency of your body. Every function—from breathing and thinking to running and lifting—requires calories. Understanding how many calories your body needs is the foundation of any successful nutrition plan, whether you&apos;re trying to lose weight, build muscle, or simply maintain your current physique.
          </p>
          <p>
            This calorie calculator uses the scientifically-validated Mifflin-St Jeor equation, which the American Dietetic Association considers the most accurate formula for calculating calorie needs in healthy individuals. It accounts for your unique characteristics including age, gender, height, weight, and activity level.
          </p>

          <h2>How Calorie Calculation Works</h2>
          
          <h3>Step 1: Calculate Your BMR</h3>
          <p>
            Your Basal Metabolic Rate (BMR) represents the calories your body burns at complete rest—just to keep you alive. This includes breathing, blood circulation, cell production, and organ function. BMR typically accounts for 60-75% of total daily calorie burn.
          </p>
          <p>The Mifflin-St Jeor equations are:</p>
          <ul>
            <li><strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5</li>
            <li><strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161</li>
          </ul>

          <h3>Step 2: Factor in Activity Level</h3>
          <p>
            Your Total Daily Energy Expenditure (TDEE) is your BMR multiplied by an activity factor. This accounts for all the calories you burn through movement, exercise, and the thermic effect of food (digestion).
          </p>
          <ul>
            <li><strong>Sedentary (1.2):</strong> Little or no exercise, desk job</li>
            <li><strong>Lightly Active (1.375):</strong> Light exercise 1-3 days per week</li>
            <li><strong>Moderately Active (1.55):</strong> Moderate exercise 3-5 days per week</li>
            <li><strong>Very Active (1.725):</strong> Hard exercise 6-7 days per week</li>
            <li><strong>Extra Active (1.9):</strong> Very hard exercise, physical job, or training twice daily</li>
          </ul>

          <h2>Calories for Weight Loss</h2>
          <p>
            Weight loss occurs when you consume fewer calories than your body burns, creating a calorie deficit. A deficit of 500 calories per day typically results in approximately 0.5 kg (1 lb) of weight loss per week, since one pound of body fat contains roughly 3,500 calories.
          </p>
          <h3>Safe Weight Loss Guidelines</h3>
          <ul>
            <li>Aim for 0.5-1 kg (1-2 lbs) of weight loss per week maximum</li>
            <li>Never eat below 1,200 calories (women) or 1,500 calories (men) without medical supervision</li>
            <li>Prioritize protein intake to preserve muscle mass during weight loss</li>
            <li>Combine calorie reduction with strength training for best body composition results</li>
            <li>Allow for periodic diet breaks to prevent metabolic adaptation</li>
          </ul>

          <h2>Calories for Muscle Gain</h2>
          <p>
            Building muscle requires a calorie surplus—eating more than you burn. However, excessive surplus leads to unnecessary fat gain. A moderate surplus of 200-400 calories daily is typically optimal for building muscle while minimizing fat gain.
          </p>
          <h3>Muscle Building Guidelines</h3>
          <ul>
            <li>Aim for 0.25-0.5 kg (0.5-1 lb) of weight gain per month</li>
            <li>Consume 1.6-2.2g of protein per kg of body weight</li>
            <li>Time protein intake around workouts for optimal muscle protein synthesis</li>
            <li>Progressively overload your training to stimulate muscle growth</li>
            <li>Get adequate sleep (7-9 hours) for recovery and hormone optimization</li>
          </ul>

          <h2>Understanding Macronutrients</h2>
          <p>
            While total calories determine weight change, macronutrient ratios affect body composition, energy levels, and overall health. The three macronutrients are:
          </p>
          
          <h3>Protein (4 calories per gram)</h3>
          <p>
            Essential for muscle repair, immune function, and satiety. Higher protein diets help preserve muscle during weight loss and support muscle growth during bulking. Aim for 1.6-2.2g per kg of body weight for active individuals.
          </p>

          <h3>Carbohydrates (4 calories per gram)</h3>
          <p>
            Your body&apos;s preferred energy source, especially for high-intensity exercise. Carbs fuel workouts, support brain function, and help with recovery. The amount needed varies based on activity level and personal preference.
          </p>

          <h3>Fats (9 calories per gram)</h3>
          <p>
            Crucial for hormone production, nutrient absorption, and brain health. Don&apos;t go below 20% of calories from fat, as this can negatively impact hormone levels. Focus on unsaturated fats from sources like olive oil, nuts, avocados, and fatty fish.
          </p>

          <h2>Factors That Affect Calorie Needs</h2>
          <ul>
            <li><strong>Age:</strong> Metabolism naturally slows with age, reducing calorie needs by about 2% per decade after 20</li>
            <li><strong>Muscle Mass:</strong> Muscle is more metabolically active than fat, burning more calories at rest</li>
            <li><strong>Genetics:</strong> Some people naturally have faster or slower metabolisms</li>
            <li><strong>Hormones:</strong> Thyroid function, testosterone, and other hormones impact metabolic rate</li>
            <li><strong>Sleep:</strong> Poor sleep can reduce metabolism and increase hunger hormones</li>
            <li><strong>Stress:</strong> Chronic stress affects cortisol levels, which can impact metabolism and appetite</li>
            <li><strong>NEAT:</strong> Non-Exercise Activity Thermogenesis (fidgeting, walking, standing) varies significantly between people</li>
          </ul>

          <h2>Tips for Accurate Calorie Tracking</h2>
          <ul>
            <li>Use a food scale to measure portions accurately—eyeballing is notoriously inaccurate</li>
            <li>Track everything, including cooking oils, sauces, and beverages</li>
            <li>Be honest about portion sizes and don&apos;t forget about bites and tastes</li>
            <li>Use a calorie tracking app for convenience and database access</li>
            <li>Weigh yourself consistently (same time, same conditions) to track trends</li>
            <li>Adjust calories every 2-4 weeks based on actual results</li>
            <li>Account for water weight fluctuations by looking at weekly averages</li>
          </ul>

          <h2>Common Mistakes to Avoid</h2>
          <ul>
            <li><strong>Setting unrealistic goals:</strong> Extreme deficits lead to muscle loss and metabolic adaptation</li>
            <li><strong>Ignoring protein:</strong> Low protein intake during weight loss causes muscle loss</li>
            <li><strong>Weekend overeating:</strong> Two days of overeating can erase a week&apos;s deficit</li>
            <li><strong>Drinking calories:</strong> Liquid calories don&apos;t satisfy hunger but add up quickly</li>
            <li><strong>Overestimating exercise burn:</strong> Fitness trackers often overreport by 20-50%</li>
            <li><strong>Being inconsistent:</strong> Results come from consistent adherence over time</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Unit & Gender Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Unit System"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            options={[
              { value: "metric", label: "Metric (cm, kg)" },
              { value: "imperial", label: "Imperial (ft/in, lbs)" },
            ]}
          />
          <Select
            label="Gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </div>

        {/* Age & Measurements */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            suffix="years"
          />
          {unit === "metric" ? (
            <>
              <Input
                label="Height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                suffix="cm"
              />
              <Input
                label="Weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                suffix="kg"
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Height (ft)"
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="5"
                  suffix="ft"
                />
                <Input
                  label="Height (in)"
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="9"
                  suffix="in"
                />
              </div>
              <Input
                label="Weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="154"
                suffix="lbs"
              />
            </>
          )}
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Activity Level
          </label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(activityMultipliers) as ActivityLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setActivity(level)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  activity === level
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-white dark:bg-muted/30 hover:border-primary/50"
                }`}
              >
                <span className={`text-sm font-medium ${activity === level ? "text-primary" : "text-foreground"}`}>
                  {level.charAt(0).toUpperCase() + level.slice(1).replace("-", " ")}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activityDescriptions[level]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Your Goal
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            <button
              onClick={() => setGoal("lose")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                goal === "lose"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-white dark:bg-muted/30 hover:border-primary/50"
              }`}
            >
              <TrendingDown className={`h-5 w-5 ${goal === "lose" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium ${goal === "lose" ? "text-primary" : "text-foreground"}`}>
                Lose Weight
              </span>
            </button>
            <button
              onClick={() => setGoal("maintain")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                goal === "maintain"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-white dark:bg-muted/30 hover:border-primary/50"
              }`}
            >
              <Target className={`h-5 w-5 ${goal === "maintain" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium ${goal === "maintain" ? "text-primary" : "text-foreground"}`}>
                Maintain
              </span>
            </button>
            <button
              onClick={() => setGoal("gain")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-4 transition-all ${
                goal === "gain"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-white dark:bg-muted/30 hover:border-primary/50"
              }`}
            >
              <TrendingUp className={`h-5 w-5 ${goal === "gain" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium ${goal === "gain" ? "text-primary" : "text-foreground"}`}>
                Build Muscle
              </span>
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button onClick={reset} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 pt-4">
            {/* Main Result */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Flame className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Daily Calories to {goal === "lose" ? "Lose Weight" : goal === "gain" ? "Build Muscle" : "Maintain"}
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {results.targetCalories.toLocaleString()}
                  </p>
                </div>
              </div>
              {results.deficit > 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  This is a <strong className="text-foreground">{results.deficit} calorie deficit</strong> below your maintenance level for steady weight loss.
                </p>
              )}
              {results.surplus > 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  This is a <strong className="text-foreground">{results.surplus} calorie surplus</strong> above your maintenance level for lean muscle gain.
                </p>
              )}
            </div>

            {/* BMR & TDEE */}
            <ResultsGrid columns={2}>
              <ResultCard
                label="Basal Metabolic Rate (BMR)"
                value={results.bmr.toLocaleString()}
                unit="cal/day"
              />
              <ResultCard
                label="Maintenance Calories (TDEE)"
                value={results.tdee.toLocaleString()}
                unit="cal/day"
                highlight
              />
            </ResultsGrid>

            {/* Macro Breakdown */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Suggested Macronutrients
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.macros.protein}g</p>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xs text-muted-foreground mt-1">{(results.macros.protein * 4)} cal</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.macros.carbs}g</p>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-xs text-muted-foreground mt-1">{(results.macros.carbs * 4)} cal</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{results.macros.fat}g</p>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-xs text-muted-foreground mt-1">{(results.macros.fat * 9)} cal</p>
                </div>
              </div>
            </div>

            {/* Weekly Projection */}
            {results.weeklyChange !== 0 && (
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h3 className="font-semibold text-foreground mb-2">Expected Progress</h3>
                <p className="text-muted-foreground">
                  At this calorie intake, you can expect to {results.weeklyChange > 0 ? "gain" : "lose"} approximately{" "}
                  <strong className="text-foreground">{Math.abs(results.weeklyChange)} kg ({(Math.abs(results.weeklyChange) * 2.2).toFixed(1)} lbs)</strong>{" "}
                  per week.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
