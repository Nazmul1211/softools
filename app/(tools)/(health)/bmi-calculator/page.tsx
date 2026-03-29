"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type Unit = "metric" | "imperial";

interface BMIResult {
  bmi: number;
  category: string;
  healthyWeightRange: { min: number; max: number };
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  useEffect(() => {
    let heightM: number;
    let weightKg: number;

    if (unit === "metric") {
      heightM = parseFloat(height) / 100;
      weightKg = parseFloat(weight);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inch;
      heightM = totalInches * 0.0254;
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (isNaN(heightM) || isNaN(weightKg) || heightM <= 0 || weightKg <= 0) {
      setResult(null);
      return;
    }

    const bmi = weightKg / (heightM * heightM);
    let category: string;

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    const healthyWeightMin = 18.5 * heightM * heightM;
    const healthyWeightMax = 24.9 * heightM * heightM;

    setResult({
      bmi,
      category,
      healthyWeightRange: {
        min: unit === "metric" ? healthyWeightMin : healthyWeightMin * 2.20462,
        max: unit === "metric" ? healthyWeightMax : healthyWeightMax * 2.20462,
      },
    });
  }, [unit, height, heightFt, heightIn, weight]);

  const reset = () => {
    setHeight("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
    setResult(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "text-yellow-600 dark:text-yellow-400";
      case "Normal weight":
        return "text-green-600 dark:text-green-400";
      case "Overweight":
        return "text-orange-600 dark:text-orange-400";
      case "Obese":
        return "text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <ToolLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) to see if you're at a healthy weight. Get personalized results based on your height and weight."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "BMR Calculator", href: "/bmr-calculator" },
        { name: "Ideal Weight Calculator", href: "/ideal-weight-calculator" },
        { name: "Body Fat Calculator", href: "/body-fat-calculator" },
      ]}
      lastUpdated="2024-03-28"
      datePublished="2024-01-15"
      howToSteps={[
        { name: "Select Unit System", text: "Choose between Metric (cm/kg) or Imperial (ft/in/lbs) measurement system." },
        { name: "Enter Your Height", text: "Input your height using the selected unit system." },
        { name: "Enter Your Weight", text: "Input your current weight in the selected unit." },
        { name: "View Results", text: "Your BMI score, category, and healthy weight range will appear automatically." },
      ]}
      content={
        <>
          <h2>What is BMI (Body Mass Index)?</h2>
          <p>
            Body Mass Index (BMI) is a simple, internationally recognized health metric that uses your weight and height to estimate total body fat. It is typically used as a screening tool by healthcare providers to identify potential weight categories that may lead to health problems.
          </p>

          <h2>How is BMI Calculated?</h2>
          <p>
            The BMI formula is universally standard, though it differs slightly based on the measurement system you use:
          </p>
          <ul>
            <li><strong>Metric System:</strong> BMI = Weight (kg) / [Height (m)]²</li>
            <li><strong>Imperial System:</strong> BMI = Weight (lbs) / [Height (in)]² × 703</li>
          </ul>
          
          <h2>Standard BMI Categories</h2>
          <p>
            According to the World Health Organization (WHO), adult BMI is divided into the following categories:
          </p>
          <ul>
            <li><strong>Underweight:</strong> Less than 18.5</li>
            <li><strong>Normal weight:</strong> 18.5 – 24.9</li>
            <li><strong>Overweight:</strong> 25.0 – 29.9</li>
            <li><strong>Obesity:</strong> 30.0 or greater</li>
          </ul>

          <h3>Limitations of BMI</h3>
          <p>
            While BMI is a useful general guideline, it is not a diagnostic tool and has several well-documented limitations. Because BMI only uses weight and height, it does not distinguish between muscle mass, bone density, and body fat. For instance, athletes and bodybuilders with high muscle mass may have a &quot;high&quot; BMI while having very low body fat percentages. Older adults who have lost muscle mass may fall into a &quot;normal&quot; BMI range despite having excess body fat. Always consult a healthcare professional for a comprehensive health assessment.
          </p>
        </>
      }
    >
      <div className="space-y-6">
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
              placeholder="Enter weight"
              suffix="lbs"
            />
          </div>
        )}

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <ResultsGrid columns={2}>
              <ResultCard label="Your BMI" value={result.bmi.toFixed(1)} highlight />
              <ResultCard
                label="Category"
                value={result.category}
                className={getCategoryColor(result.category)}
              />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4 dark:border-border dark:bg-muted/50">
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                Healthy weight range for your height
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground dark:text-foreground">
                {result.healthyWeightRange.min.toFixed(1)} -{" "}
                {result.healthyWeightRange.max.toFixed(1)}{" "}
                {unit === "metric" ? "kg" : "lbs"}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
