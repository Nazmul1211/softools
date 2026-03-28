"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Activity, Flame, Scale, RotateCcw, Info } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "What is BMR (Basal Metabolic Rate)?",
    answer: "BMR is the number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, cell production, and nutrient processing. It represents the minimum energy your body needs to survive if you did absolutely nothing all day. BMR accounts for about 60-70% of your total daily calorie expenditure."
  },
  {
    question: "What's the difference between BMR and TDEE?",
    answer: "BMR is calories burned at complete rest. TDEE (Total Daily Energy Expenditure) is BMR plus calories burned through daily activities and exercise. TDEE = BMR × Activity Factor. For weight management, TDEE is typically more useful as it represents your actual daily calorie needs, while BMR is the baseline minimum."
  },
  {
    question: "Which BMR formula is most accurate?",
    answer: "The Mifflin-St Jeor equation is generally considered most accurate for most people and is recommended by the Academy of Nutrition and Dietetics. The Katch-McArdle formula may be more accurate if you know your body fat percentage, as it accounts for lean body mass. Harris-Benedict tends to overestimate slightly but is still widely used."
  },
  {
    question: "Why does my BMR decrease with age?",
    answer: "BMR naturally decreases with age due to loss of muscle mass (sarcopenia), hormonal changes, and reduced cell activity. After age 30, BMR decreases by about 1-2% per decade. This is why maintaining muscle mass through strength training and staying active becomes increasingly important as you age."
  },
  {
    question: "Can I increase my BMR?",
    answer: "Yes, primarily through building muscle mass. Muscle tissue burns more calories at rest than fat tissue. Strength training, eating adequate protein, getting quality sleep, and staying active can all help maintain or increase BMR. Extreme calorie restriction can actually lower BMR as your body adapts to conserve energy."
  },
  {
    question: "How accurate are BMR calculators?",
    answer: "BMR calculators provide estimates based on population averages and can vary by 10-15% from your actual BMR. Individual variations in genetics, hormones, body composition, and health conditions all affect true BMR. For precise measurements, you'd need indirect calorimetry testing in a clinical setting."
  },
];

type Sex = "male" | "female";
type Unit = "imperial" | "metric";
type Formula = "mifflin" | "harris" | "katch";

interface ActivityLevel {
  id: string;
  name: string;
  factor: number;
  description: string;
}

const activityLevels: ActivityLevel[] = [
  { id: "sedentary", name: "Sedentary", factor: 1.2, description: "Little or no exercise, desk job" },
  { id: "light", name: "Lightly Active", factor: 1.375, description: "Light exercise 1-3 days/week" },
  { id: "moderate", name: "Moderately Active", factor: 1.55, description: "Moderate exercise 3-5 days/week" },
  { id: "active", name: "Very Active", factor: 1.725, description: "Hard exercise 6-7 days/week" },
  { id: "extreme", name: "Extra Active", factor: 1.9, description: "Very hard exercise, physical job" },
];

export default function BMRCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("imperial");
  const [age, setAge] = useState<string>("30");
  const [weight, setWeight] = useState<string>("170");
  const [heightFeet, setHeightFeet] = useState<string>("5");
  const [heightInches, setHeightInches] = useState<string>("10");
  const [heightCm, setHeightCm] = useState<string>("178");
  const [bodyFat, setBodyFat] = useState<string>("");
  const [formula, setFormula] = useState<Formula>("mifflin");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");

  const results = useMemo(() => {
    const ageNum = parseFloat(age) || 0;
    const weightNum = parseFloat(weight) || 0;
    
    if (ageNum <= 0 || weightNum <= 0) return null;

    // Convert to metric
    let weightKg: number;
    let heightCmNum: number;

    if (unit === "imperial") {
      weightKg = weightNum * 0.453592;
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightCmNum = (feet * 12 + inches) * 2.54;
    } else {
      weightKg = weightNum;
      heightCmNum = parseFloat(heightCm) || 0;
    }

    if (heightCmNum <= 0) return null;

    // Calculate BMR using different formulas
    let bmr: number;

    if (formula === "mifflin") {
      // Mifflin-St Jeor Equation
      if (sex === "male") {
        bmr = 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum - 161;
      }
    } else if (formula === "harris") {
      // Harris-Benedict Equation (Revised)
      if (sex === "male") {
        bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCmNum - 5.677 * ageNum;
      } else {
        bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCmNum - 4.330 * ageNum;
      }
    } else {
      // Katch-McArdle Equation (requires body fat %)
      const bodyFatNum = parseFloat(bodyFat) || 0;
      if (bodyFatNum > 0 && bodyFatNum < 100) {
        const leanBodyMass = weightKg * (1 - bodyFatNum / 100);
        bmr = 370 + 21.6 * leanBodyMass;
      } else {
        // Fall back to Mifflin-St Jeor if no body fat provided
        if (sex === "male") {
          bmr = 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum + 5;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum - 161;
        }
      }
    }

    // Calculate TDEE for different activity levels
    const selectedActivity = activityLevels.find(a => a.id === activityLevel)!;
    const tdee = bmr * selectedActivity.factor;

    // Calculate calorie targets
    const maintenance = tdee;
    const mildWeightLoss = tdee - 250;
    const weightLoss = tdee - 500;
    const mildWeightGain = tdee + 250;
    const weightGain = tdee + 500;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintenance: Math.round(maintenance),
      mildWeightLoss: Math.round(mildWeightLoss),
      weightLoss: Math.round(weightLoss),
      mildWeightGain: Math.round(mildWeightGain),
      weightGain: Math.round(weightGain),
      activityFactor: selectedActivity.factor,
    };
  }, [sex, unit, age, weight, heightFeet, heightInches, heightCm, bodyFat, formula, activityLevel]);

  const reset = () => {
    setSex("male");
    setAge("30");
    setWeight("170");
    setHeightFeet("5");
    setHeightInches("10");
    setHeightCm("178");
    setBodyFat("");
    setFormula("mifflin");
    setActivityLevel("moderate");
  };

  return (
    <ToolLayout
      title="BMR Calculator"
      description="Calculate your Basal Metabolic Rate (BMR) using multiple scientifically validated formulas. Learn how many calories your body burns at rest and estimate your Total Daily Energy Expenditure (TDEE) based on your activity level."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Body Fat Calculator", href: "/body-fat-calculator" },
        { name: "Ideal Weight Calculator", href: "/ideal-weight-calculator" },
        { name: "Macro Calculator", href: "/macro-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Basal Metabolic Rate</h2>
          <p>
            Your Basal Metabolic Rate (BMR) is the number of calories your body needs to perform its most basic, life-sustaining functions while at complete rest. These functions include breathing, circulating blood, controlling body temperature, cell growth, brain and nerve function, and muscle contraction.
          </p>
          <p>
            BMR is essentially the amount of energy (measured in calories) expended per day by the body in a resting state. It&apos;s the minimum amount of energy your body would need if you were to stay in bed all day without moving.
          </p>

          <h2>BMR Formulas Explained</h2>
          
          <h3>Mifflin-St Jeor Equation</h3>
          <p>
            The Mifflin-St Jeor Equation is the most widely recommended formula for calculating BMR. Developed in 1990, it&apos;s considered more accurate than older equations for today&apos;s population:
          </p>
          <ul>
            <li><strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</li>
            <li><strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</li>
          </ul>

          <h3>Harris-Benedict Equation</h3>
          <p>
            Created in 1918 and revised in 1984, this is one of the earliest BMR formulas. While still commonly used, it tends to overestimate BMR by about 5% compared to more recent formulas:
          </p>
          <ul>
            <li><strong>Men:</strong> BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)</li>
            <li><strong>Women:</strong> BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)</li>
          </ul>

          <h3>Katch-McArdle Equation</h3>
          <p>
            This formula is unique because it uses lean body mass instead of total weight, making it potentially more accurate for athletic individuals or those who know their body fat percentage:
          </p>
          <ul>
            <li><strong>Both sexes:</strong> BMR = 370 + (21.6 × lean body mass in kg)</li>
          </ul>
          <p>
            Where lean body mass = weight × (1 - body fat percentage/100)
          </p>

          <h2>Factors That Affect BMR</h2>
          
          <h3>Age</h3>
          <p>
            BMR decreases by about 1-2% per decade after age 20. This decline is primarily due to loss of muscle mass and changes in hormones. Staying active and maintaining muscle through strength training can help minimize this decrease.
          </p>

          <h3>Body Composition</h3>
          <p>
            Muscle tissue is metabolically more active than fat tissue, burning about 6 calories per pound per day at rest compared to fat&apos;s 2 calories per pound. People with more muscle mass have higher BMRs.
          </p>

          <h3>Sex</h3>
          <p>
            Men typically have higher BMRs than women due to larger body size, greater muscle mass, and hormonal differences. Testosterone promotes muscle growth and maintenance, which increases metabolic rate.
          </p>

          <h3>Genetics</h3>
          <p>
            Some people naturally have faster or slower metabolisms due to genetic factors. This can account for metabolic rate differences of up to 10-25% between individuals of similar age, sex, and body composition.
          </p>

          <h3>Hormones</h3>
          <p>
            Thyroid hormones (T3 and T4) play a major role in regulating metabolism. Conditions like hypothyroidism can significantly lower BMR, while hyperthyroidism can raise it.
          </p>

          <h2>From BMR to TDEE</h2>
          <p>
            While BMR tells you calories burned at rest, your Total Daily Energy Expenditure (TDEE) accounts for all daily activities. TDEE is calculated by multiplying BMR by an activity factor:
          </p>
          <ul>
            <li><strong>Sedentary (1.2):</strong> Little to no exercise, desk job</li>
            <li><strong>Lightly Active (1.375):</strong> Light exercise 1-3 days per week</li>
            <li><strong>Moderately Active (1.55):</strong> Moderate exercise 3-5 days per week</li>
            <li><strong>Very Active (1.725):</strong> Hard exercise 6-7 days per week</li>
            <li><strong>Extra Active (1.9):</strong> Very hard exercise, physical job, or training twice per day</li>
          </ul>

          <h2>Using BMR for Weight Management</h2>
          
          <h3>Weight Loss</h3>
          <p>
            To lose weight, create a calorie deficit by eating less than your TDEE. A deficit of 500 calories per day typically results in about 1 pound of weight loss per week. Never eat below your BMR, as this can harm your metabolism and health.
          </p>

          <h3>Weight Gain</h3>
          <p>
            To gain weight, eat more than your TDEE. A surplus of 250-500 calories per day combined with strength training supports muscle growth with minimal fat gain.
          </p>

          <h3>Weight Maintenance</h3>
          <p>
            Eating roughly your TDEE maintains your current weight. Track your weight over time and adjust calories as needed, as TDEE can change with body composition and activity levels.
          </p>

          <h2>Boosting Your Metabolism</h2>
          <p>
            While you can&apos;t dramatically change your BMR, these strategies can help optimize your metabolic rate:
          </p>
          <ul>
            <li><strong>Build muscle:</strong> Strength training increases muscle mass, which burns more calories at rest</li>
            <li><strong>Stay active:</strong> Regular physical activity keeps your metabolism elevated</li>
            <li><strong>Eat enough protein:</strong> Protein has a higher thermic effect than carbs or fat</li>
            <li><strong>Sleep well:</strong> Poor sleep can lower metabolic rate and increase hunger hormones</li>
            <li><strong>Stay hydrated:</strong> Even mild dehydration can slow metabolism slightly</li>
            <li><strong>Avoid extreme diets:</strong> Very low-calorie diets can cause your body to lower BMR to conserve energy</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Unit System Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setUnit("imperial")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              unit === "imperial"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Imperial (lb, ft)
          </button>
          <button
            onClick={() => setUnit("metric")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              unit === "metric"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Metric (kg, cm)
          </button>
        </div>

        {/* Sex Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSex("male")}
            className={`py-3 px-4 rounded-lg border font-medium transition-all ${
              sex === "male"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            Male
          </button>
          <button
            onClick={() => setSex("female")}
            className={`py-3 px-4 rounded-lg border font-medium transition-all ${
              sex === "female"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            Female
          </button>
        </div>

        {/* Age and Weight */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Age (years)"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="15"
            max="100"
            placeholder="30"
          />
          <Input
            label={`Weight (${unit === "imperial" ? "lbs" : "kg"})`}
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            step="0.1"
            placeholder={unit === "imperial" ? "170" : "77"}
          />
        </div>

        {/* Height */}
        {unit === "imperial" ? (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Height (feet)"
              type="number"
              value={heightFeet}
              onChange={(e) => setHeightFeet(e.target.value)}
              min="0"
              max="8"
              placeholder="5"
            />
            <Input
              label="Height (inches)"
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              min="0"
              max="11"
              placeholder="10"
            />
          </div>
        ) : (
          <Input
            label="Height (cm)"
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            min="0"
            placeholder="178"
          />
        )}

        {/* Formula Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">BMR Formula</label>
          <select
            value={formula}
            onChange={(e) => setFormula(e.target.value as Formula)}
            className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
            <option value="harris">Harris-Benedict (Revised)</option>
            <option value="katch">Katch-McArdle (Requires Body Fat %)</option>
          </select>
        </div>

        {/* Body Fat % for Katch-McArdle */}
        {formula === "katch" && (
          <div>
            <Input
              label="Body Fat Percentage"
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              min="1"
              max="60"
              step="0.1"
              placeholder="e.g., 20"
            />
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Required for Katch-McArdle formula accuracy
            </p>
          </div>
        )}

        {/* Activity Level */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Activity Level</label>
          <div className="space-y-2">
            {activityLevels.map((level) => (
              <label
                key={level.id}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
                  activityLevel === level.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="activity"
                  value={level.id}
                  checked={activityLevel === level.id}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-medium text-foreground">{level.name}</span>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
                <span className="ml-auto text-sm text-muted-foreground">×{level.factor}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-6">
            {/* Main BMR Result */}
            <div className="text-center pb-4 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Your Basal Metabolic Rate</p>
              <div className="flex items-center justify-center gap-2">
                <Flame className="h-8 w-8 text-orange-500" />
                <p className="text-5xl font-bold text-primary">{results.bmr.toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">calories/day at rest</p>
            </div>

            {/* TDEE */}
            <ResultsGrid columns={2}>
              <ResultCard 
                label="Daily Calories (TDEE)" 
                value={results.tdee.toLocaleString()}
                subValue={`BMR × ${results.activityFactor}`}
                highlight 
              />
              <ResultCard 
                label="Weekly Calories" 
                value={(results.tdee * 7).toLocaleString()} 
              />
            </ResultsGrid>

            {/* Calorie Goals */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Calorie Goals
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Extreme weight loss (-1 lb/week)</span>
                  <span className="font-medium text-red-500">{results.weightLoss.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Mild weight loss (-0.5 lb/week)</span>
                  <span className="font-medium text-orange-500">{results.mildWeightLoss.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-foreground font-medium">Maintain weight</span>
                  <span className="font-bold text-primary">{results.maintenance.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Mild weight gain (+0.5 lb/week)</span>
                  <span className="font-medium text-blue-500">{results.mildWeightGain.toLocaleString()} cal</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Weight gain (+1 lb/week)</span>
                  <span className="font-medium text-green-500">{results.weightGain.toLocaleString()} cal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <Button onClick={reset} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Calculator
        </Button>

        {/* Information Box */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Understanding Your Results
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>BMR</strong> is your calorie burn at complete rest—your body&apos;s baseline energy need</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span><strong>TDEE</strong> includes your activity and is what you should base your diet on</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Never eat below your BMR—it can harm your metabolism and health</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>These are estimates. Track your weight and adjust calories based on actual results</span>
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
