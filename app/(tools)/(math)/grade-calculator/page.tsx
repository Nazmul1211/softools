"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";

type CalculationType = "current" | "final_needed" | "weighted";

interface GradeItem {
  id: string;
  name: string;
  grade: string;
  weight: string;
}

interface GradeResult {
  currentGrade: number;
  letterGrade: string;
  gpaEquivalent: number;
}

interface FinalNeededResult {
  neededGrade: number;
  isPossible: boolean;
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 63) return "D";
  if (percentage >= 60) return "D-";
  return "F";
}

function getGPA(percentage: number): number {
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 63) return 1.0;
  if (percentage >= 60) return 0.7;
  return 0.0;
}

export default function GradeCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>("weighted");
  
  // For weighted grade calculation
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([
    { id: "1", name: "Homework", grade: "", weight: "20" },
    { id: "2", name: "Midterm", grade: "", weight: "30" },
    { id: "3", name: "Final Exam", grade: "", weight: "50" },
  ]);

  // For final needed calculation
  const [currentGrade, setCurrentGrade] = useState("");
  const [targetGrade, setTargetGrade] = useState("");
  const [finalWeight, setFinalWeight] = useState("");

  const weightedResult = useMemo<GradeResult | null>(() => {
    if (calcType !== "weighted") return null;

    const validItems = gradeItems.filter(
      (item) => item.grade !== "" && item.weight !== ""
    );

    if (validItems.length === 0) return null;

    let totalWeight = 0;
    let weightedSum = 0;

    for (const item of validItems) {
      const grade = parseFloat(item.grade);
      const weight = parseFloat(item.weight);
      if (!isNaN(grade) && !isNaN(weight) && weight > 0) {
        weightedSum += grade * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return null;

    const currentGrade = weightedSum / totalWeight;

    return {
      currentGrade,
      letterGrade: getLetterGrade(currentGrade),
      gpaEquivalent: getGPA(currentGrade),
    };
  }, [calcType, gradeItems]);

  const finalNeededResult = useMemo<FinalNeededResult | null>(() => {
    if (calcType !== "final_needed") return null;

    const current = parseFloat(currentGrade);
    const target = parseFloat(targetGrade);
    const weight = parseFloat(finalWeight);

    if (isNaN(current) || isNaN(target) || isNaN(weight) || weight <= 0 || weight > 100) {
      return null;
    }

    // Formula: target = current * (1 - weight/100) + needed * (weight/100)
    // Solving for needed: needed = (target - current * (1 - weight/100)) / (weight/100)
    const currentWeight = 1 - weight / 100;
    const needed = (target - current * currentWeight) / (weight / 100);

    return {
      neededGrade: needed,
      isPossible: needed <= 100,
    };
  }, [calcType, currentGrade, targetGrade, finalWeight]);

  const addGradeItem = () => {
    setGradeItems([
      ...gradeItems,
      { id: Date.now().toString(), name: "", grade: "", weight: "" },
    ]);
  };

  const removeGradeItem = (id: string) => {
    if (gradeItems.length > 1) {
      setGradeItems(gradeItems.filter((item) => item.id !== id));
    }
  };

  const updateGradeItem = (id: string, field: keyof GradeItem, value: string) => {
    setGradeItems(
      gradeItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const reset = () => {
    setGradeItems([
      { id: "1", name: "Homework", grade: "", weight: "20" },
      { id: "2", name: "Midterm", grade: "", weight: "30" },
      { id: "3", name: "Final Exam", grade: "", weight: "50" },
    ]);
    setCurrentGrade("");
    setTargetGrade("");
    setFinalWeight("");
  };

  return (
    <ToolLayout
      title="Grade Calculator"
      description="Calculate your weighted grade, current class grade, or determine what score you need on your final exam to reach your target grade."
      category={{ name: "Math Calculators", slug: "math-calculators" }}
      relatedTools={[
        { name: "College GPA Calculator", href: "/college-gpa-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
        { name: "Average Calculator", href: "/average-calculator" },
      ]}
      content={
        <>
          <h2>How to Calculate Weighted Grades</h2>
          <p>
            Weighted grades give different assignments or categories different levels of importance. 
            To calculate your weighted grade:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Multiply each grade by its weight (as a decimal)</li>
            <li>Add all the weighted grades together</li>
            <li>Divide by the sum of all weights (if not adding to 100%)</li>
          </ol>

          <h2>Example Calculation</h2>
          <p>
            If you have: Homework (20%) = 95%, Midterm (30%) = 82%, Final (50%) = 88%
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            (95 × 0.20) + (82 × 0.30) + (88 × 0.50) = 19 + 24.6 + 44 = 87.6%
          </p>

          <h2>What Grade Do I Need on My Final?</h2>
          <p>
            To find what you need on your final exam, use this formula:
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            Needed = (Target − Current × (1 − FinalWeight)) ÷ FinalWeight
          </p>
          <p>
            For example, if your current grade is 85%, you want a 90%, and the final is worth 30%:
          </p>
          <p className="font-mono text-sm bg-muted p-3 rounded-lg">
            Needed = (90 − 85 × 0.70) ÷ 0.30 = (90 − 59.5) ÷ 0.30 = 101.67%
          </p>

          <h2>Standard Grading Scale</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Letter</th>
                <th className="text-left py-2">Percentage</th>
                <th className="text-left py-2">GPA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="py-1">A</td><td>93-100%</td><td>4.0</td></tr>
              <tr className="border-b"><td className="py-1">A-</td><td>90-92%</td><td>3.7</td></tr>
              <tr className="border-b"><td className="py-1">B+</td><td>87-89%</td><td>3.3</td></tr>
              <tr className="border-b"><td className="py-1">B</td><td>83-86%</td><td>3.0</td></tr>
              <tr className="border-b"><td className="py-1">B-</td><td>80-82%</td><td>2.7</td></tr>
              <tr className="border-b"><td className="py-1">C+</td><td>77-79%</td><td>2.3</td></tr>
              <tr className="border-b"><td className="py-1">C</td><td>73-76%</td><td>2.0</td></tr>
              <tr className="border-b"><td className="py-1">C-</td><td>70-72%</td><td>1.7</td></tr>
              <tr className="border-b"><td className="py-1">D+</td><td>67-69%</td><td>1.3</td></tr>
              <tr className="border-b"><td className="py-1">D</td><td>63-66%</td><td>1.0</td></tr>
              <tr className="border-b"><td className="py-1">D-</td><td>60-62%</td><td>0.7</td></tr>
              <tr><td className="py-1">F</td><td>Below 60%</td><td>0.0</td></tr>
            </tbody>
          </table>
        </>
      }
    >
      <div className="space-y-6">
        <Select
          label="Calculation Type"
          id="calcType"
          value={calcType}
          onChange={(e) => setCalcType(e.target.value as CalculationType)}
          options={[
            { value: "weighted", label: "Calculate Weighted Grade" },
            { value: "final_needed", label: "What Do I Need on My Final?" },
          ]}
        />

        {calcType === "weighted" && (
          <>
            <div className="space-y-3">
              {gradeItems.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      label={index === 0 ? "Category" : undefined}
                      type="text"
                      value={item.name}
                      onChange={(e) => updateGradeItem(item.id, "name", e.target.value)}
                      placeholder="e.g., Homework"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      label={index === 0 ? "Grade" : undefined}
                      type="number"
                      value={item.grade}
                      onChange={(e) => updateGradeItem(item.id, "grade", e.target.value)}
                      placeholder="%"
                      suffix="%"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      label={index === 0 ? "Weight" : undefined}
                      type="number"
                      value={item.weight}
                      onChange={(e) => updateGradeItem(item.id, "weight", e.target.value)}
                      placeholder="%"
                      suffix="%"
                    />
                  </div>
                  <Button
                    onClick={() => removeGradeItem(item.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 mb-0.5"
                    disabled={gradeItems.length <= 1}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={addGradeItem} variant="outline" size="sm">
              + Add Category
            </Button>
          </>
        )}

        {calcType === "final_needed" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Current Grade"
              type="number"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              placeholder="Your current %"
              suffix="%"
            />
            <Input
              label="Target Grade"
              type="number"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              placeholder="Grade you want"
              suffix="%"
            />
            <Input
              label="Final Exam Weight"
              type="number"
              value={finalWeight}
              onChange={(e) => setFinalWeight(e.target.value)}
              placeholder="Final worth"
              suffix="%"
            />
          </div>
        )}

        <div className="flex justify-end mt-2">
          <Button onClick={reset} variant="outline" size="sm" className="text-muted-foreground border-transparent hover:border-border">
            Clear Fields
          </Button>
        </div>

        {/* Results for weighted grade */}
        {weightedResult && (
          <div className="space-y-4">
            <ResultsGrid columns={3}>
              <ResultCard
                label="Current Grade"
                value={`${weightedResult.currentGrade.toFixed(2)}%`}
                highlight
              />
              <ResultCard
                label="Letter Grade"
                value={weightedResult.letterGrade}
              />
              <ResultCard
                label="GPA Equivalent"
                value={weightedResult.gpaEquivalent.toFixed(1)}
              />
            </ResultsGrid>

            {/* Grade breakdown */}
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-3">Grade Breakdown</p>
              <div className="space-y-2">
                {gradeItems
                  .filter((item) => item.grade && item.weight)
                  .map((item) => {
                    const grade = parseFloat(item.grade);
                    const weight = parseFloat(item.weight);
                    const contribution = (grade * weight) / 100;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name || "Item"} ({weight}%)
                        </span>
                        <span className="text-foreground">
                          {grade}% × {weight}% = {contribution.toFixed(2)} points
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Results for final needed */}
        {finalNeededResult && (
          <div className="space-y-4">
            <div className={`rounded-xl border p-6 text-center ${
              finalNeededResult.isPossible 
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
            }`}>
              <p className="text-sm text-muted-foreground mb-2">
                To get {targetGrade}% in the class, you need on the final:
              </p>
              <p className={`text-4xl font-bold ${
                finalNeededResult.isPossible 
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {finalNeededResult.neededGrade.toFixed(2)}%
              </p>
              {!finalNeededResult.isPossible && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  ⚠️ This target is not achievable with the final exam alone
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground mb-2">How this was calculated</p>
              <p className="text-sm text-muted-foreground">
                Your current grade ({currentGrade}%) accounts for {(100 - parseFloat(finalWeight)).toFixed(0)}% of your total grade. 
                The final exam ({finalWeight}%) needs to bring your average up to {targetGrade}%.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
