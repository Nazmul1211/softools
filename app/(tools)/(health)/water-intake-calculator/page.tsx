"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type Unit = "metric" | "imperial";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
type Climate = "temperate" | "hot" | "cold";

interface WaterIntakeResult {
  liters: number;
  ounces: number;
  cups: number;
  glasses: number; // 250ml glasses
  breakdown: {
    base: number;
    activity: number;
    climate: number;
  };
}

export default function WaterIntakeCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [climate, setClimate] = useState<Climate>("temperate");
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);

  const result = useMemo<WaterIntakeResult | null>(() => {
    let weightKg: number;

    if (unit === "metric") {
      weightKg = parseFloat(weight);
    } else {
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (isNaN(weightKg) || weightKg <= 0) {
      return null;
    }

    // Base calculation: 30-35ml per kg of body weight
    let baseWater = weightKg * 0.033; // liters (33ml per kg)

    // Activity adjustment
    let activityMultiplier = 1;
    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1;
        break;
      case "light":
        activityMultiplier = 1.1;
        break;
      case "moderate":
        activityMultiplier = 1.2;
        break;
      case "active":
        activityMultiplier = 1.3;
        break;
      case "veryActive":
        activityMultiplier = 1.5;
        break;
    }

    // Climate adjustment
    let climateAddition = 0;
    switch (climate) {
      case "hot":
        climateAddition = 0.5; // Add 500ml in hot weather
        break;
      case "cold":
        climateAddition = 0.2; // Slightly more in cold (dry air)
        break;
      default:
        climateAddition = 0;
    }

    // Pregnancy/breastfeeding adjustments
    let specialAddition = 0;
    if (pregnant) {
      specialAddition += 0.3; // Add 300ml for pregnancy
    }
    if (breastfeeding) {
      specialAddition += 0.7; // Add 700ml for breastfeeding
    }

    const activityWater = baseWater * (activityMultiplier - 1);
    const totalWater = baseWater * activityMultiplier + climateAddition + specialAddition;

    return {
      liters: totalWater,
      ounces: totalWater * 33.814,
      cups: totalWater * 4.227, // US cups
      glasses: Math.ceil(totalWater / 0.25), // 250ml glasses
      breakdown: {
        base: baseWater,
        activity: activityWater,
        climate: climateAddition + specialAddition,
      },
    };
  }, [unit, weight, activityLevel, climate, pregnant, breastfeeding]);

  const reset = () => {
    setWeight("");
    setPregnant(false);
    setBreastfeeding(false);
  };

  return (
    <ToolLayout
      title="Water Intake Calculator"
      description="Calculate how much water you should drink daily based on your weight, activity level, and climate. Stay properly hydrated for optimal health and performance."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "TDEE Calculator", href: "/tdee-calculator" },
      ]}
      content={
        <>
          <h2>Why is Hydration Important?</h2>
          <p>
            Water is essential for virtually every bodily function. It regulates body temperature, transports nutrients, removes waste, cushions joints, and supports cognitive function. Even mild dehydration (1-2% body weight loss) can impair physical and mental performance.
          </p>

          <h2>How Much Water Do You Need?</h2>
          <p>
            The general recommendation is about 30-35ml of water per kilogram of body weight, but individual needs vary based on:
          </p>
          <ul>
            <li><strong>Body weight:</strong> Larger bodies need more water</li>
            <li><strong>Activity level:</strong> Exercise increases water needs</li>
            <li><strong>Climate:</strong> Hot or dry environments increase sweating</li>
            <li><strong>Diet:</strong> High-sodium or high-protein diets require more water</li>
            <li><strong>Health status:</strong> Illness, pregnancy, and breastfeeding affect needs</li>
          </ul>

          <h2>Signs of Dehydration</h2>
          <ul>
            <li>Dark yellow urine (aim for pale yellow)</li>
            <li>Thirst (already indicates mild dehydration)</li>
            <li>Headaches and fatigue</li>
            <li>Dry mouth and lips</li>
            <li>Dizziness or lightheadedness</li>
            <li>Decreased concentration</li>
          </ul>

          <h2>Tips for Staying Hydrated</h2>
          <ul>
            <li><strong>Start your day with water:</strong> Drink a glass upon waking</li>
            <li><strong>Carry a water bottle:</strong> Keep water accessible throughout the day</li>
            <li><strong>Set reminders:</strong> Use apps or alarms to remind you to drink</li>
            <li><strong>Eat water-rich foods:</strong> Fruits and vegetables contribute to hydration</li>
            <li><strong>Drink before meals:</strong> A glass before eating aids digestion</li>
            <li><strong>Monitor urine color:</strong> Pale yellow indicates good hydration</li>
          </ul>

          <h2>Water-Rich Foods</h2>
          <p>
            About 20% of daily water intake typically comes from food. Water-rich options include:
          </p>
          <ul>
            <li>Cucumber (96% water)</li>
            <li>Watermelon (92% water)</li>
            <li>Strawberries (91% water)</li>
            <li>Lettuce (95% water)</li>
            <li>Celery (95% water)</li>
            <li>Tomatoes (94% water)</li>
          </ul>

          <h2>Can You Drink Too Much Water?</h2>
          <p>
            Yes, overhydration (hyponatremia) is possible but rare. It occurs when water intake dilutes sodium levels dangerously. This is mainly a concern for endurance athletes or those with certain medical conditions. For most people, the body naturally regulates water balance.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Unit System"
            id="unit"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as Unit);
              reset();
            }}
            options={[
              { value: "metric", label: "Metric (kg)" },
              { value: "imperial", label: "Imperial (lbs)" },
            ]}
          />
          <Input
            label="Body Weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter your weight"
            suffix={unit === "metric" ? "kg" : "lbs"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Activity Level"
            id="activityLevel"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            options={[
              { value: "sedentary", label: "Sedentary (little exercise)" },
              { value: "light", label: "Light (1-2 days/week)" },
              { value: "moderate", label: "Moderate (3-5 days/week)" },
              { value: "active", label: "Active (daily exercise)" },
              { value: "veryActive", label: "Very Active (intense daily)" },
            ]}
          />
          <Select
            label="Climate"
            id="climate"
            value={climate}
            onChange={(e) => setClimate(e.target.value as Climate)}
            options={[
              { value: "temperate", label: "Temperate (mild)" },
              { value: "hot", label: "Hot / Humid" },
              { value: "cold", label: "Cold / Dry" },
            ]}
          />
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground mb-3">Special Conditions</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pregnant}
                onChange={(e) => setPregnant(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Pregnant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={breastfeeding}
                onChange={(e) => setBreastfeeding(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Breastfeeding</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <ResultsGrid columns={2}>
              <ResultCard
                label="Daily Water Intake"
                value={`${result.liters.toFixed(1)} L`}
                highlight
                subValue={`${Math.round(result.ounces)} fl oz`}
              />
              <ResultCard
                label="Glasses (250ml)"
                value={`${result.glasses} glasses`}
                subValue={`${result.cups.toFixed(1)} US cups`}
              />
            </ResultsGrid>

            {/* Visual representation */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">💧 Daily Goal Visualization</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from({ length: result.glasses }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-10 rounded bg-blue-500/80 dark:bg-blue-400/80 flex items-end justify-center"
                    title={`Glass ${i + 1}`}
                  >
                    <span className="text-[10px] text-white font-bold mb-1">{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Each glass represents 250ml (about 8 oz)
              </p>
            </div>

            {/* Breakdown */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">Calculation Breakdown</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base requirement (weight-based)</span>
                  <span className="text-foreground">{result.breakdown.base.toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Activity adjustment</span>
                  <span className="text-foreground">+{result.breakdown.activity.toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Climate & conditions</span>
                  <span className="text-foreground">+{result.breakdown.climate.toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t border-border pt-2 mt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{result.liters.toFixed(2)} L</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
              <p className="text-sm font-medium text-foreground mb-2">💡 Hydration Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Drink a glass of water first thing in the morning</li>
                <li>• Keep a water bottle with you throughout the day</li>
                <li>• Drink before, during, and after exercise</li>
                <li>• Set hourly reminders if you often forget</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
