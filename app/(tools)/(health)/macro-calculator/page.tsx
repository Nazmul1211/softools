"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";
type Goal = "lose" | "maintain" | "gain";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

interface MacroResult {
  calories: number;
  protein: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
  fat: { grams: number; calories: number; percentage: number };
}

export default function MacroCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  const result = useMemo<MacroResult | null>(() => {
    const ageNum = parseFloat(age);
    let heightCm: number;
    let weightKg: number;

    if (unit === "metric") {
      heightCm = parseFloat(height);
      weightKg = parseFloat(weight);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (isNaN(ageNum) || isNaN(heightCm) || isNaN(weightKg) || 
        ageNum <= 0 || heightCm <= 0 || weightKg <= 0) {
      return null;
    }

    // Calculate TDEE using Mifflin-St Jeor
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    let tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    // Adjust calories based on goal
    let calories: number;
    let proteinRatio: number;
    let carbsRatio: number;
    let fatRatio: number;

    switch (goal) {
      case "lose":
        calories = tdee * 0.8; // 20% deficit
        proteinRatio = 0.35; // Higher protein to preserve muscle
        carbsRatio = 0.35;
        fatRatio = 0.30;
        break;
      case "gain":
        calories = tdee * 1.15; // 15% surplus
        proteinRatio = 0.30;
        carbsRatio = 0.45; // More carbs for energy
        fatRatio = 0.25;
        break;
      default: // maintain
        calories = tdee;
        proteinRatio = 0.30;
        carbsRatio = 0.40;
        fatRatio = 0.30;
    }

    // Calculate macros in grams
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const proteinCalories = calories * proteinRatio;
    const carbsCalories = calories * carbsRatio;
    const fatCalories = calories * fatRatio;

    return {
      calories: Math.round(calories),
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: Math.round(proteinCalories),
        percentage: Math.round(proteinRatio * 100),
      },
      carbs: {
        grams: Math.round(carbsCalories / 4),
        calories: Math.round(carbsCalories),
        percentage: Math.round(carbsRatio * 100),
      },
      fat: {
        grams: Math.round(fatCalories / 9),
        calories: Math.round(fatCalories),
        percentage: Math.round(fatRatio * 100),
      },
    };
  }, [gender, unit, age, height, heightFt, heightIn, weight, activityLevel, goal]);

  const reset = () => {
    setAge("");
    setHeight("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
  };

  return (
    <ToolLayout
      title="Macro Calculator"
      description="Calculate your optimal daily macronutrient intake (protein, carbohydrates, and fat) based on your body stats and fitness goals. Perfect for IIFYM, flexible dieting, and meal planning."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "TDEE Calculator", href: "/tdee-calculator" },
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "BMR Calculator", href: "/bmr-calculator" },
      ]}
      content={
        <>
          <h2>What Are Macronutrients?</h2>
          <p>
            Macronutrients (macros) are the three main nutrients that provide energy: protein, carbohydrates, and fat. Each plays a vital role in your body:
          </p>
          <ul>
            <li><strong>Protein (4 cal/g):</strong> Builds and repairs muscle, supports immune function</li>
            <li><strong>Carbohydrates (4 cal/g):</strong> Primary energy source, fuels brain and muscles</li>
            <li><strong>Fat (9 cal/g):</strong> Hormone production, vitamin absorption, cell structure</li>
          </ul>

          <h2>Macro Ratios by Goal</h2>
          
          <h3>Weight Loss</h3>
          <p>
            Higher protein (35%) helps preserve muscle mass during a calorie deficit. Moderate carbs (35%) and fat (30%) provide balanced energy.
          </p>

          <h3>Maintenance</h3>
          <p>
            Balanced approach with 30% protein, 40% carbs, and 30% fat. Suitable for maintaining current body composition.
          </p>

          <h3>Muscle Gain</h3>
          <p>
            Higher carbs (45%) provide energy for intense workouts and muscle growth. Protein at 30% supports muscle synthesis, with 25% from fats.
          </p>

          <h2>How to Hit Your Macros</h2>
          <ul>
            <li><strong>Track your food:</strong> Use apps like MyFitnessPal or Cronometer</li>
            <li><strong>Meal prep:</strong> Plan meals ahead to meet your targets</li>
            <li><strong>Focus on protein first:</strong> It&apos;s usually the hardest macro to hit</li>
            <li><strong>Be flexible:</strong> Hitting within 5-10g of targets is fine</li>
          </ul>

          <h2>Protein Sources</h2>
          <ul>
            <li>Chicken breast, turkey, lean beef</li>
            <li>Fish (salmon, tuna, tilapia)</li>
            <li>Eggs and egg whites</li>
            <li>Greek yogurt, cottage cheese</li>
            <li>Legumes, tofu, tempeh</li>
          </ul>

          <h2>Quality Carb Sources</h2>
          <ul>
            <li>Oats, quinoa, brown rice</li>
            <li>Sweet potatoes, potatoes</li>
            <li>Fruits and vegetables</li>
            <li>Whole grain bread and pasta</li>
          </ul>

          <h2>Healthy Fat Sources</h2>
          <ul>
            <li>Avocados, olive oil</li>
            <li>Nuts and nut butters</li>
            <li>Fatty fish (salmon, mackerel)</li>
            <li>Seeds (chia, flax, hemp)</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
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
          <Select
            label="Unit System"
            id="unit"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as Unit);
              reset();
            }}
            options={[
              { value: "metric", label: "Metric (cm, kg)" },
              { value: "imperial", label: "Imperial (ft/in, lbs)" },
            ]}
          />
        </div>

        <Input
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
          suffix="years"
        />

        {unit === "metric" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              suffix="cm"
            />
            <Input
              label="Weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              suffix="kg"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Height (feet)"
              type="number"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              placeholder="Feet"
              suffix="ft"
            />
            <Input
              label="Height (inches)"
              type="number"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              placeholder="Inches"
              suffix="in"
            />
            <Input
              label="Weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight"
              suffix="lbs"
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Activity Level"
            id="activityLevel"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            options={[
              { value: "sedentary", label: "Sedentary (desk job)" },
              { value: "light", label: "Light (1-3 days/week)" },
              { value: "moderate", label: "Moderate (3-5 days/week)" },
              { value: "active", label: "Active (6-7 days/week)" },
              { value: "veryActive", label: "Very Active (athlete)" },
            ]}
          />
          <Select
            label="Goal"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal)}
            options={[
              { value: "lose", label: "Lose Weight" },
              { value: "maintain", label: "Maintain Weight" },
              { value: "gain", label: "Build Muscle" },
            ]}
          />
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <ResultsGrid columns={1}>
              <ResultCard
                label="Daily Calorie Target"
                value={`${result.calories.toLocaleString()} calories`}
                highlight
              />
            </ResultsGrid>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Protein */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 p-4 text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Protein</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">{result.protein.grams}g</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  {result.protein.calories} cal • {result.protein.percentage}%
                </p>
              </div>

              {/* Carbs */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 text-center">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Carbohydrates</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1">{result.carbs.grams}g</p>
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">
                  {result.carbs.calories} cal • {result.carbs.percentage}%
                </p>
              </div>

              {/* Fat */}
              <div className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30 p-4 text-center">
                <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">Fat</p>
                <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1">{result.fat.grams}g</p>
                <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">
                  {result.fat.calories} cal • {result.fat.percentage}%
                </p>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-3">Macro Distribution</p>
              <div className="flex h-6 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${result.protein.percentage}%` }}
                  title={`Protein: ${result.protein.percentage}%`}
                />
                <div
                  className="bg-amber-500"
                  style={{ width: `${result.carbs.percentage}%` }}
                  title={`Carbs: ${result.carbs.percentage}%`}
                />
                <div
                  className="bg-rose-500"
                  style={{ width: `${result.fat.percentage}%` }}
                  title={`Fat: ${result.fat.percentage}%`}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500" /> Protein
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-500" /> Carbs
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-rose-500" /> Fat
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
