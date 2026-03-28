"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ResultCard, ResultsGrid } from "@/components/ui/ResultCard";
import { Plus, Trash2 } from "lucide-react";

interface Course {
  id: number;
  name: string;
  grade: string;
  type: "regular" | "honors" | "ap";
}

const baseGradePoints: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7,
  "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7,
  "D+": 1.3, D: 1.0, "D-": 0.7,
  F: 0.0,
};

const typeBonus: Record<string, number> = {
  regular: 0,
  honors: 0.5,
  ap: 1.0,
};

const gradeOptions = Object.keys(baseGradePoints).map((g) => ({
  value: g,
  label: g,
}));

const typeOptions = [
  { value: "regular", label: "Regular" },
  { value: "honors", label: "Honors" },
  { value: "ap", label: "AP / IB" },
];

let nextId = 1;

function createCourse(): Course {
  return { id: nextId++, name: "", grade: "A", type: "regular" };
}

export default function HighSchoolGPACalculator() {
  const [courses, setCourses] = useState<Course[]>(() => [
    createCourse(),
    createCourse(),
    createCourse(),
    createCourse(),
    createCourse(),
    createCourse(),
  ]);
  const [unweightedGpa, setUnweightedGpa] = useState<number | null>(null);
  const [weightedGpa, setWeightedGpa] = useState<number | null>(null);

  const calculate = useCallback(() => {
    if (courses.length === 0) {
      setUnweightedGpa(null);
      setWeightedGpa(null);
      return;
    }

    let totalUnweighted = 0;
    let totalWeighted = 0;
    let count = 0;

    for (const c of courses) {
      const base = baseGradePoints[c.grade];
      if (base === undefined) continue;
      totalUnweighted += base;
      totalWeighted += base + typeBonus[c.type];
      count++;
    }

    if (count === 0) {
      setUnweightedGpa(null);
      setWeightedGpa(null);
      return;
    }

    setUnweightedGpa(totalUnweighted / count);
    setWeightedGpa(totalWeighted / count);
  }, [courses]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addCourse = () => setCourses((prev) => [...prev, createCourse()]);

  const removeCourse = (id: number) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <ToolLayout
      title="High School GPA Calculator"
      description="Calculate your weighted and unweighted high school GPA. Supports Regular, Honors, and AP/IB course weighting on the 4.0 and 5.0 scales."
      category={{ name: "Math Calculators", slug: "math" }}
      relatedTools={[
        { name: "College GPA Calculator", href: "/college-gpa-calculator" },
        { name: "Cumulative GPA Calculator", href: "/cumulative-gpa-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      content={
        <>
          <h2>What is High School GPA?</h2>
          <p>
            Your high school Grade Point Average (GPA) is a numerical summary of your academic performance throughout your high school career. It is one of the most important factors in college admissions, scholarship applications, and eligibility for honors and advanced programs. Understanding the distinction between weighted and unweighted GPA is critical for planning your academic path.
          </p>

          <h2>Weighted vs. Unweighted GPA Explained</h2>

          <h3>Unweighted GPA (4.0 Scale)</h3>
          <p>
            An unweighted GPA treats all classes equally, regardless of difficulty. Whether you take a Regular English class or AP English Literature, an A in either course is worth 4.0 grade points. This is the purest measure of your average grade performance. Most schools calculate unweighted GPA on the standard 4.0 scale, where A = 4.0, B = 3.0, C = 2.0, D = 1.0, and F = 0.0.
          </p>

          <h3>Weighted GPA (5.0 Scale)</h3>
          <p>
            A weighted GPA rewards students who challenge themselves with harder courses. Honors classes receive a +0.5 bonus, and Advanced Placement (AP) or International Baccalaureate (IB) courses receive a +1.0 bonus. This means an A in an AP class is worth 5.0 grade points instead of 4.0, and a B in an Honors class is worth 3.5 instead of 3.0. The weighted scale can exceed 4.0, with a theoretical maximum of 5.0.
          </p>

          <h2>How Colleges Use Your High School GPA</h2>
          <p>
            Colleges look at both your weighted and unweighted GPA to evaluate your academic performance. The <strong>unweighted GPA</strong> tells them how well you performed on average, while the <strong>weighted GPA</strong> tells them how much you challenged yourself with rigorous coursework. Most selective colleges prefer to see students who took AP/IB classes and earned B&apos;s over students who took only Regular classes and earned A&apos;s, because course rigor is a strong predictor of college readiness.
          </p>

          <h2>Average GPA for College Admissions</h2>
          <ul>
            <li><strong>Ivy League / Top 20:</strong> Typically 3.9+ unweighted, 4.5+ weighted.</li>
            <li><strong>Selective State Schools:</strong> 3.5–3.8 unweighted, 4.0–4.5 weighted.</li>
            <li><strong>Most 4-Year Colleges:</strong> 3.0+ unweighted is generally competitive.</li>
            <li><strong>Community Colleges:</strong> Open admissions; GPA is less of a factor.</li>
          </ul>

          <h2>Tips for Improving Your High School GPA</h2>
          <ul>
            <li><strong>Take Honors and AP courses strategically:</strong> Even a B in an AP course can be worth more toward your weighted GPA than an A in a Regular course.</li>
            <li><strong>Focus on freshman and sophomore year:</strong> Many students underperform early and struggle to raise their GPA later. Starting strong gives you a cushion.</li>
            <li><strong>Seek help immediately:</strong> If you are struggling in a class, visit your teacher during office hours, join a study group, or use free tutoring services before the grade drops too low.</li>
            <li><strong>Consider grade replacement:</strong> Some schools allow you to retake a class and replace the old grade. Check with your guidance counselor.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>Do colleges recalculate my GPA?</h3>
          <p>
            Yes, many colleges recalculate GPA using their own internal scale. Some schools remove physical education, art, or other non-core classes from the calculation and focus only on academic subjects. Others apply their own weighting system for AP and Honors courses.
          </p>

          <h3>Is a 4.5 weighted GPA good?</h3>
          <p>
            A 4.5 weighted GPA is excellent and puts you in a strong position for competitive colleges. It indicates that you are not only performing well academically but also challenging yourself with advanced coursework.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Course Rows */}
        <div className="space-y-4">
          <div className="hidden sm:grid sm:grid-cols-[1fr_120px_100px_40px] sm:gap-3 sm:text-sm sm:font-medium sm:text-muted-foreground">
            <span>Class Name</span>
            <span>Course Type</span>
            <span>Grade</span>
            <span />
          </div>

          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_120px_100px_40px] sm:items-end sm:border-none sm:bg-transparent sm:p-0"
            >
              <Input
                placeholder="e.g. English Literature"
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
              />
              <Select
                options={typeOptions}
                value={course.type}
                onChange={(e) =>
                  updateCourse(course.id, "type", e.target.value)
                }
              />
              <Select
                options={gradeOptions}
                value={course.grade}
                onChange={(e) =>
                  updateCourse(course.id, "grade", e.target.value)
                }
              />
              <button
                onClick={() => removeCourse(course.id)}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 sm:h-auto sm:w-auto"
                title="Remove class"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <Button
          onClick={addCourse}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Class
        </Button>

        {/* Results */}
        {unweightedGpa !== null && weightedGpa !== null && (
          <ResultsGrid columns={2}>
            <ResultCard
              label="Unweighted GPA (4.0 Scale)"
              value={unweightedGpa.toFixed(2)}
            />
            <ResultCard
              label="Weighted GPA (5.0 Scale)"
              value={weightedGpa.toFixed(2)}
              highlight
            />
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
