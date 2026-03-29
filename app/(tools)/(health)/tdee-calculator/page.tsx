"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive" | "extraActive";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { value: number; label: string; description: string }> = {
  sedentary: { value: 1.2, label: "Sedentary", description: "Little or no exercise, desk job" },
  light: { value: 1.375, label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  moderate: { value: 1.55, label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  active: { value: 1.725, label: "Very Active", description: "Hard exercise 6-7 days/week" },
  veryActive: { value: 1.9, label: "Extra Active", description: "Very hard exercise, physical job" },
  extraActive: { value: 2.0, label: "Professional Athlete", description: "Training twice daily" },
};

interface TDEEResult {
  bmr: number;
  tdee: number;
  weightLoss: { mild: number; moderate: number; extreme: number };
  weightGain: { mild: number; moderate: number; extreme: number };
}

export default function TDEECalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");

  const result = useMemo<TDEEResult | null>(() => {
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

    // Mifflin-St Jeor Equation (most accurate)
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel].value;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: {
        mild: Math.round(tdee * 0.9),     // 10% deficit (~0.25 kg/week)
        moderate: Math.round(tdee * 0.8), // 20% deficit (~0.5 kg/week)
        extreme: Math.round(tdee * 0.6),  // 40% deficit (~1 kg/week)
      },
      weightGain: {
        mild: Math.round(tdee * 1.1),     // 10% surplus
        moderate: Math.round(tdee * 1.15), // 15% surplus
        extreme: Math.round(tdee * 1.2),  // 20% surplus
      },
    };
  }, [gender, unit, age, height, heightFt, heightIn, weight, activityLevel]);

  const reset = () => {
    setAge("");
    setHeight("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
  };

  return (
    <ToolLayout
      title="TDEE Calculator"
      description="Calculate your Total Daily Energy Expenditure (TDEE) to understand how many calories you burn each day. Essential for weight loss, muscle gain, or maintaining your current weight."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "BMR Calculator", href: "/bmr-calculator" },
        { name: "Macro Calculator", href: "/macro-calculator" },
      ]}
      content={
        <>
          <h2>What is TDEE?</h2>
          <p>
            Total Daily Energy Expenditure (TDEE) is the total number of calories you burn in a 24-hour period. It combines your Basal Metabolic Rate (BMR) with the energy expended through physical activity and the thermic effect of food (calories burned during digestion).
          </p>

          <h2>TDEE Components</h2>
          <ul>
            <li><strong>BMR (60-70%):</strong> Calories burned at complete rest for vital functions</li>
            <li><strong>Physical Activity (15-30%):</strong> Exercise and daily movement</li>
            <li><strong>TEF (10%):</strong> Thermic Effect of Food - energy used to digest food</li>
            <li><strong>NEAT:</strong> Non-Exercise Activity Thermogenesis - fidgeting, walking, etc.</li>
          </ul>

          <h2>How TDEE is Calculated</h2>
          <p>
            This calculator uses the Mifflin-St Jeor equation to calculate BMR, then multiplies by an activity factor:
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            TDEE = BMR × Activity Multiplier
          </p>
          <p>The Mifflin-St Jeor BMR formula:</p>
          <ul>
            <li><strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5</li>
            <li><strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161</li>
          </ul>

          <h2>Activity Level Multipliers</h2>
          <ul>
            <li><strong>Sedentary (×1.2):</strong> Desk job, minimal exercise</li>
            <li><strong>Lightly Active (×1.375):</strong> Light exercise 1-3 days/week</li>
            <li><strong>Moderately Active (×1.55):</strong> Moderate exercise 3-5 days/week</li>
            <li><strong>Very Active (×1.725):</strong> Hard exercise 6-7 days/week</li>
            <li><strong>Extra Active (×1.9):</strong> Very intense exercise, physical job</li>
          </ul>

          <h2>Using TDEE for Weight Management</h2>
          <ul>
            <li><strong>Weight Loss:</strong> Eat 10-25% below your TDEE (500-750 calorie deficit)</li>
            <li><strong>Maintenance:</strong> Eat at your TDEE</li>
            <li><strong>Weight Gain:</strong> Eat 10-20% above your TDEE (300-500 calorie surplus)</li>
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

        <Select
          label="Activity Level"
          id="activityLevel"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
          options={Object.entries(ACTIVITY_MULTIPLIERS).map(([key, { label, description }]) => ({
            value: key,
            label: `${label} - ${description}`,
          }))}
        />

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <ResultsGrid columns={2}>
              <ResultCard
                label="Your TDEE"
                value={`${result.tdee.toLocaleString()} cal/day`}
                highlight
                subValue="Maintenance calories"
              />
              <ResultCard
                label="Basal Metabolic Rate"
                value={`${result.bmr.toLocaleString()} cal/day`}
                subValue="Calories at rest"
              />
            </ResultsGrid>

            {/* Weight Loss Goals */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">🔥 Calories for Weight Loss</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Mild Weight Loss</span>
                    <span className="text-xs text-muted-foreground ml-2">(0.25 kg/week)</span>
                  </div>
                  <span className="font-semibold text-foreground">{result.weightLoss.mild.toLocaleString()} cal/day</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Moderate Weight Loss</span>
                    <span className="text-xs text-muted-foreground ml-2">(0.5 kg/week)</span>
                  </div>
                  <span className="font-semibold text-foreground">{result.weightLoss.moderate.toLocaleString()} cal/day</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-foreground">Extreme Weight Loss</span>
                    <span className="text-xs text-muted-foreground ml-2">(1 kg/week)</span>
                  </div>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">{result.weightLoss.extreme.toLocaleString()} cal/day</span>
                </div>
              </div>
            </div>

            {/* Weight Gain Goals */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">💪 Calories for Weight Gain</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Lean Bulk</span>
                    <span className="text-xs text-muted-foreground ml-2">(+10% surplus)</span>
                  </div>
                  <span className="font-semibold text-foreground">{result.weightGain.mild.toLocaleString()} cal/day</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Moderate Bulk</span>
                    <span className="text-xs text-muted-foreground ml-2">(+15% surplus)</span>
                  </div>
                  <span className="font-semibold text-foreground">{result.weightGain.moderate.toLocaleString()} cal/day</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-foreground">Aggressive Bulk</span>
                    <span className="text-xs text-muted-foreground ml-2">(+20% surplus)</span>
                  </div>
                  <span className="font-semibold text-foreground">{result.weightGain.extreme.toLocaleString()} cal/day</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
