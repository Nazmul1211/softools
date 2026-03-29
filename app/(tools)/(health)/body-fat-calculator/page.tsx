"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";

interface BodyFatResult {
  navyMethod: number | null;
  bmiMethod: number;
  category: string;
  healthyRange: { min: number; max: number };
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState(""); // Only for females

  const result = useMemo<BodyFatResult | null>(() => {
    let heightCm: number;
    let weightKg: number;
    let waistCm: number;
    let neckCm: number;
    let hipCm: number;

    if (unit === "metric") {
      heightCm = parseFloat(height);
      weightKg = parseFloat(weight);
      waistCm = parseFloat(waist);
      neckCm = parseFloat(neck);
      hipCm = parseFloat(hip);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
      weightKg = parseFloat(weight) * 0.453592;
      waistCm = parseFloat(waist) * 2.54;
      neckCm = parseFloat(neck) * 2.54;
      hipCm = parseFloat(hip) * 2.54;
    }

    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
      return null;
    }

    // BMI Method (less accurate but doesn't require measurements)
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let bmiBodyFat: number;

    if (gender === "male") {
      bmiBodyFat = 1.20 * bmi + 0.23 * 30 - 16.2; // Using age 30 as default
    } else {
      bmiBodyFat = 1.20 * bmi + 0.23 * 30 - 5.4;
    }
    bmiBodyFat = Math.max(3, Math.min(60, bmiBodyFat));

    // Navy Method (more accurate, requires measurements)
    let navyBodyFat: number | null = null;

    if (!isNaN(waistCm) && !isNaN(neckCm) && waistCm > 0 && neckCm > 0) {
      if (gender === "male") {
        navyBodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
      } else if (!isNaN(hipCm) && hipCm > 0) {
        navyBodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
      }

      if (navyBodyFat !== null) {
        navyBodyFat = Math.max(3, Math.min(60, navyBodyFat));
      }
    }

    // Determine category based on primary result
    const bodyFat = navyBodyFat ?? bmiBodyFat;
    let category: string;
    let healthyRange: { min: number; max: number };

    if (gender === "male") {
      healthyRange = { min: 10, max: 20 };
      if (bodyFat < 6) category = "Essential Fat";
      else if (bodyFat < 14) category = "Athletes";
      else if (bodyFat < 18) category = "Fitness";
      else if (bodyFat < 25) category = "Average";
      else category = "Obese";
    } else {
      healthyRange = { min: 18, max: 28 };
      if (bodyFat < 14) category = "Essential Fat";
      else if (bodyFat < 21) category = "Athletes";
      else if (bodyFat < 25) category = "Fitness";
      else if (bodyFat < 32) category = "Average";
      else category = "Obese";
    }

    return {
      navyMethod: navyBodyFat,
      bmiMethod: bmiBodyFat,
      category,
      healthyRange,
    };
  }, [gender, unit, height, heightFt, heightIn, weight, waist, neck, hip]);

  const reset = () => {
    setHeight("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
    setWaist("");
    setNeck("");
    setHip("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Essential Fat":
        return "text-blue-600 dark:text-blue-400";
      case "Athletes":
        return "text-green-600 dark:text-green-400";
      case "Fitness":
        return "text-emerald-600 dark:text-emerald-400";
      case "Average":
        return "text-yellow-600 dark:text-yellow-400";
      case "Obese":
        return "text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <ToolLayout
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using multiple methods including the US Navy formula and BMI-based calculation. Get personalized results for men and women."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Ideal Weight Calculator", href: "/ideal-weight-calculator" },
        { name: "BMR Calculator", href: "/bmr-calculator" },
      ]}
      content={
        <>
          <h2>What is Body Fat Percentage?</h2>
          <p>
            Body fat percentage is the total mass of fat divided by total body mass, multiplied by 100. It includes both essential fat (necessary for life and reproductive functions) and storage fat (accumulated in adipose tissue). Unlike BMI, body fat percentage directly measures fat mass and provides a more accurate picture of body composition.
          </p>

          <h2>Calculation Methods</h2>
          <h3>US Navy Method</h3>
          <p>
            The US Navy method uses circumference measurements to estimate body fat. It is considered more accurate than BMI-based estimates because it accounts for body shape differences. The formula uses height, waist, neck (and hip for women) measurements.
          </p>
          <ul>
            <li><strong>Men:</strong> %BF = 495 / (1.0324 − 0.19077 × log₁₀(waist − neck) + 0.15456 × log₁₀(height)) − 450</li>
            <li><strong>Women:</strong> %BF = 495 / (1.29579 − 0.35004 × log₁₀(waist + hip − neck) + 0.22100 × log₁₀(height)) − 450</li>
          </ul>

          <h3>BMI Method</h3>
          <p>
            The BMI-based method estimates body fat from your Body Mass Index. While less accurate, it only requires height and weight measurements. The formula adjusts for gender differences in fat distribution.
          </p>

          <h2>Body Fat Categories</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Men</th>
                <th className="text-left py-2">Women</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-2">Essential Fat</td><td>2-5%</td><td>10-13%</td></tr>
              <tr className="border-b"><td className="py-2">Athletes</td><td>6-13%</td><td>14-20%</td></tr>
              <tr className="border-b"><td className="py-2">Fitness</td><td>14-17%</td><td>21-24%</td></tr>
              <tr className="border-b"><td className="py-2">Average</td><td>18-24%</td><td>25-31%</td></tr>
              <tr><td className="py-2">Obese</td><td>25%+</td><td>32%+</td></tr>
            </tbody>
          </table>

          <h2>How to Take Measurements</h2>
          <ul>
            <li><strong>Waist:</strong> Measure at the narrowest point, or at the navel for men</li>
            <li><strong>Neck:</strong> Measure just below the larynx (Adam&apos;s apple)</li>
            <li><strong>Hip (women):</strong> Measure at the widest point of the buttocks</li>
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
              { value: "imperial", label: "Imperial (in, lbs)" },
            ]}
          />
        </div>

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

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground mb-3">
            Body Measurements (for Navy Method - Optional)
          </p>
          <div className={`grid gap-4 ${gender === "female" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            <Input
              label="Waist Circumference"
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="At navel"
              suffix={unit === "metric" ? "cm" : "in"}
            />
            <Input
              label="Neck Circumference"
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder="Below Adam's apple"
              suffix={unit === "metric" ? "cm" : "in"}
            />
            {gender === "female" && (
              <Input
                label="Hip Circumference"
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                placeholder="Widest point"
                suffix={unit === "metric" ? "cm" : "in"}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <ResultsGrid columns={2}>
              {result.navyMethod !== null ? (
                <ResultCard
                  label="Body Fat (Navy Method)"
                  value={`${result.navyMethod.toFixed(1)}%`}
                  highlight
                />
              ) : (
                <ResultCard
                  label="Body Fat (BMI Method)"
                  value={`${result.bmiMethod.toFixed(1)}%`}
                  highlight
                />
              )}
              <ResultCard
                label="Category"
                value={result.category}
                className={getCategoryColor(result.category)}
              />
            </ResultsGrid>

            {result.navyMethod !== null && (
              <ResultsGrid columns={1}>
                <ResultCard
                  label="Body Fat (BMI Method)"
                  value={`${result.bmiMethod.toFixed(1)}%`}
                  subValue="Less accurate estimate based on BMI"
                />
              </ResultsGrid>
            )}

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Healthy body fat range for {gender === "male" ? "men" : "women"}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {result.healthyRange.min}% - {result.healthyRange.max}%
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
