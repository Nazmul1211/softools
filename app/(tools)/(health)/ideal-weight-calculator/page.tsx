"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";

interface IdealWeightResult {
  devine: number;
  robinson: number;
  miller: number;
  hamwi: number;
  average: number;
  bmiRange: { min: number; max: number };
}

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const result = useMemo<IdealWeightResult | null>(() => {
    let heightCm: number;

    if (unit === "metric") {
      heightCm = parseFloat(height);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      heightCm = (ft * 12 + inch) * 2.54;
    }

    if (isNaN(heightCm) || heightCm <= 0) {
      return null;
    }

    const heightM = heightCm / 100;
    const heightInches = heightCm / 2.54;
    const inchesOver5Feet = Math.max(0, heightInches - 60);

    let devine: number;
    let robinson: number;
    let miller: number;
    let hamwi: number;

    if (gender === "male") {
      // Devine Formula (1974)
      devine = 50 + 2.3 * inchesOver5Feet;
      // Robinson Formula (1983)
      robinson = 52 + 1.9 * inchesOver5Feet;
      // Miller Formula (1983)
      miller = 56.2 + 1.41 * inchesOver5Feet;
      // Hamwi Formula (1964)
      hamwi = 48 + 2.7 * inchesOver5Feet;
    } else {
      // Devine Formula (1974)
      devine = 45.5 + 2.3 * inchesOver5Feet;
      // Robinson Formula (1983)
      robinson = 49 + 1.7 * inchesOver5Feet;
      // Miller Formula (1983)
      miller = 53.1 + 1.36 * inchesOver5Feet;
      // Hamwi Formula (1964)
      hamwi = 45.5 + 2.2 * inchesOver5Feet;
    }

    // BMI healthy range (18.5 - 24.9)
    const bmiMin = 18.5 * heightM * heightM;
    const bmiMax = 24.9 * heightM * heightM;

    const average = (devine + robinson + miller + hamwi) / 4;

    // Convert to lbs if imperial
    const conversionFactor = unit === "imperial" ? 2.20462 : 1;

    return {
      devine: devine * conversionFactor,
      robinson: robinson * conversionFactor,
      miller: miller * conversionFactor,
      hamwi: hamwi * conversionFactor,
      average: average * conversionFactor,
      bmiRange: {
        min: bmiMin * conversionFactor,
        max: bmiMax * conversionFactor,
      },
    };
  }, [gender, unit, height, heightFt, heightIn]);

  const reset = () => {
    setHeight("");
    setHeightFt("");
    setHeightIn("");
  };

  const formatWeight = (value: number) => {
    return `${value.toFixed(1)} ${unit === "metric" ? "kg" : "lbs"}`;
  };

  return (
    <ToolLayout
      title="Ideal Weight Calculator"
      description="Calculate your ideal body weight using multiple scientifically validated formulas. Find the healthy weight range that's right for you based on your height and gender."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Body Fat Calculator", href: "/body-fat-calculator" },
        { name: "Calorie Calculator", href: "/calorie-calculator" },
      ]}
      content={
        <>
          <h2>What is Ideal Body Weight?</h2>
          <p>
            Ideal body weight (IBW) is a weight that is believed to be maximally healthful for a person based on height. While &quot;ideal&quot; weight varies by individual, several scientific formulas have been developed over the decades to estimate a healthy target weight. These formulas consider height and gender as primary factors.
          </p>

          <h2>Ideal Weight Formulas</h2>
          
          <h3>Devine Formula (1974)</h3>
          <p>
            Originally developed for calculating drug dosages, the Devine formula became widely used for ideal body weight estimation:
          </p>
          <ul>
            <li><strong>Men:</strong> IBW = 50 kg + 2.3 kg × (height in inches − 60)</li>
            <li><strong>Women:</strong> IBW = 45.5 kg + 2.3 kg × (height in inches − 60)</li>
          </ul>

          <h3>Robinson Formula (1983)</h3>
          <p>A modification of the Devine formula with slightly different coefficients:</p>
          <ul>
            <li><strong>Men:</strong> IBW = 52 kg + 1.9 kg × (height in inches − 60)</li>
            <li><strong>Women:</strong> IBW = 49 kg + 1.7 kg × (height in inches − 60)</li>
          </ul>

          <h3>Miller Formula (1983)</h3>
          <p>Another variation that tends to give higher estimates:</p>
          <ul>
            <li><strong>Men:</strong> IBW = 56.2 kg + 1.41 kg × (height in inches − 60)</li>
            <li><strong>Women:</strong> IBW = 53.1 kg + 1.36 kg × (height in inches − 60)</li>
          </ul>

          <h3>Hamwi Formula (1964)</h3>
          <p>One of the earliest formulas, still commonly referenced:</p>
          <ul>
            <li><strong>Men:</strong> IBW = 48 kg + 2.7 kg × (height in inches − 60)</li>
            <li><strong>Women:</strong> IBW = 45.5 kg + 2.2 kg × (height in inches − 60)</li>
          </ul>

          <h2>BMI-Based Healthy Weight</h2>
          <p>
            The World Health Organization defines a healthy BMI range as 18.5 to 24.9 kg/m². This calculator also shows the weight range corresponding to these BMI values for your height, providing another perspective on healthy weight targets.
          </p>

          <h2>Limitations</h2>
          <p>
            These formulas were developed based on population averages and may not account for individual factors such as:
          </p>
          <ul>
            <li>Muscle mass and body composition</li>
            <li>Age and bone density</li>
            <li>Ethnic and genetic variations</li>
            <li>Frame size (small, medium, large)</li>
          </ul>
          <p>
            Always consult with a healthcare provider for personalized health advice.
          </p>
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

        {unit === "metric" ? (
          <Input
            label="Height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter your height"
            suffix="cm"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
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
              <ResultCard
                label="Average Ideal Weight"
                value={formatWeight(result.average)}
                highlight
              />
              <ResultCard
                label="Healthy BMI Range"
                value={`${formatWeight(result.bmiRange.min)} - ${formatWeight(result.bmiRange.max)}`}
              />
            </ResultsGrid>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-4">Results by Formula</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Devine Formula</span>
                    <span className="text-xs text-muted-foreground ml-2">(1974)</span>
                  </div>
                  <span className="font-semibold text-foreground">{formatWeight(result.devine)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Robinson Formula</span>
                    <span className="text-xs text-muted-foreground ml-2">(1983)</span>
                  </div>
                  <span className="font-semibold text-foreground">{formatWeight(result.robinson)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">Miller Formula</span>
                    <span className="text-xs text-muted-foreground ml-2">(1983)</span>
                  </div>
                  <span className="font-semibold text-foreground">{formatWeight(result.miller)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-foreground">Hamwi Formula</span>
                    <span className="text-xs text-muted-foreground ml-2">(1964)</span>
                  </div>
                  <span className="font-semibold text-foreground">{formatWeight(result.hamwi)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4">
              <p className="text-sm font-medium text-foreground mb-2">About These Results</p>
              <p className="text-sm text-muted-foreground">
                The average shown combines all four formulas. Individual results may vary based on body composition, 
                muscle mass, and frame size. The BMI-based range (18.5-24.9) provides an alternative healthy weight target.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
