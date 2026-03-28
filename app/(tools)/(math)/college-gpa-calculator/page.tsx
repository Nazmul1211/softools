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
  credits: string;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7,
  "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7,
  "D+": 1.3, D: 1.0, "D-": 0.7,
  F: 0.0,
};

const gradeOptions = Object.keys(gradePoints).map((g) => ({
  value: g,
  label: g,
}));

let nextId = 1;

function createCourse(): Course {
  return { id: nextId++, name: "", credits: "3", grade: "A" };
}

export default function CollegeGPACalculator() {
  const [courses, setCourses] = useState<Course[]>(() => [
    createCourse(),
    createCourse(),
    createCourse(),
    createCourse(),
  ]);
  const [gpa, setGpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);

  const calculate = useCallback(() => {
    let totalPoints = 0;
    let totalCreds = 0;

    for (const c of courses) {
      const creds = parseFloat(c.credits);
      if (isNaN(creds) || creds <= 0) continue;
      totalPoints += gradePoints[c.grade] * creds;
      totalCreds += creds;
    }

    if (totalCreds === 0) {
      setGpa(null);
      setTotalCredits(0);
      return;
    }

    setGpa(totalPoints / totalCreds);
    setTotalCredits(totalCreds);
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

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 3.7) return "Excellent";
    if (gpa >= 3.3) return "Very Good";
    if (gpa >= 3.0) return "Good";
    if (gpa >= 2.0) return "Satisfactory";
    return "Needs Improvement";
  };

  return (
    <ToolLayout
      title="College GPA Calculator"
      description="Calculate your college GPA by entering your courses, credit hours, and grades. Instantly see your weighted grade point average on the standard 4.0 scale."
      category={{ name: "Math Calculators", slug: "math" }}
      relatedTools={[
        { name: "High School GPA Calculator", href: "/high-school-gpa-calculator" },
        { name: "Cumulative GPA Calculator", href: "/cumulative-gpa-calculator" },
        { name: "Percentage Calculator", href: "/percentage-calculator" },
      ]}
      content={
        <>
          <h2>What is GPA and Why Does It Matter?</h2>
          <p>
            Grade Point Average (GPA) is a standardized numerical representation of your academic achievement across all courses in a given semester or academic career. Nearly every college and university in the United States, Canada, and many international institutions uses some form of GPA as a core metric for evaluating student performance. Your GPA affects scholarship eligibility, Dean&apos;s List qualification, honors programs, graduate school admissions, and even entry-level job prospects. It distills your entire course performance into a single, easy-to-compare number.
          </p>

          <h2>How is College GPA Calculated?</h2>
          <p>
            Your GPA is calculated using a <strong>credit-weighted average</strong>. Each course you take has a certain number of credit hours (typically 1 to 5). Each letter grade corresponds to a specific number of grade points on the standard 4.0 scale:
          </p>
          <ul>
            <li><strong>A / A+</strong> = 4.0 grade points</li>
            <li><strong>A-</strong> = 3.7 grade points</li>
            <li><strong>B+</strong> = 3.3 grade points</li>
            <li><strong>B</strong> = 3.0 grade points</li>
            <li><strong>B-</strong> = 2.7 grade points</li>
            <li><strong>C+</strong> = 2.3 grade points</li>
            <li><strong>C</strong> = 2.0 grade points</li>
            <li><strong>C-</strong> = 1.7 grade points</li>
            <li><strong>D+</strong> = 1.3 grade points</li>
            <li><strong>D</strong> = 1.0 grade points</li>
            <li><strong>D-</strong> = 0.7 grade points</li>
            <li><strong>F</strong> = 0.0 grade points</li>
          </ul>
          <p>
            For each course, multiply the grade points by the number of credit hours to get <strong>quality points</strong>. Then sum all quality points and divide by total credit hours attempted:
          </p>
          <p>
            <strong>GPA = Total Quality Points / Total Credit Hours</strong>
          </p>

          <h3>Step-by-Step Example</h3>
          <p>
            Suppose you take three courses in a semester. Calculus I (4 credits, grade A = 4.0), English 101 (3 credits, grade B+ = 3.3), and History 200 (3 credits, grade A- = 3.7). Your quality points are: (4 × 4.0) + (3 × 3.3) + (3 × 3.7) = 16.0 + 9.9 + 11.1 = 37.0. Your total credits are 4 + 3 + 3 = 10. Therefore, your GPA = 37.0 / 10 = <strong>3.70</strong>.
          </p>

          <h2>What is a Good College GPA?</h2>
          <p>
            What constitutes a &quot;good&quot; GPA depends heavily on your goals and field of study:
          </p>
          <ul>
            <li><strong>3.5 – 4.0:</strong> Excellent. Qualifies for most honors programs, scholarships, and competitive graduate schools.</li>
            <li><strong>3.0 – 3.49:</strong> Good. Meets the minimum requirement for many graduate programs and professional positions.</li>
            <li><strong>2.5 – 2.99:</strong> Average. Sufficient to graduate but may limit scholarship and graduate school options.</li>
            <li><strong>Below 2.0:</strong> Below the typical minimum for good academic standing. Many institutions place students on academic probation below this threshold.</li>
          </ul>

          <h2>Tips to Improve Your College GPA</h2>
          <ul>
            <li><strong>Prioritize high-credit courses:</strong> Because GPA is credit-weighted, performing well in a 4-credit course impacts your GPA more than a 1-credit elective.</li>
            <li><strong>Use the plus/minus system to your advantage:</strong> Pushing a B+ to an A- is worth 0.4 grade points per credit hour — this adds up fast over a semester.</li>
            <li><strong>Retake failed courses:</strong> Most colleges allow you to retake a course and replace the old grade. This can significantly boost a cumulative GPA dragged down by a single F.</li>
            <li><strong>Seek tutoring early:</strong> University learning centers are free and proven to improve grades. Don&apos;t wait until midterms to ask for help.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>

          <h3>Does GPA matter after college?</h3>
          <p>
            For your first job, yes. Many employers use a GPA cutoff (commonly 3.0) when screening entry-level applicants. After a few years of professional experience, your work history typically matters far more than your undergraduate GPA.
          </p>

          <h3>Is a 4.0 GPA possible in college?</h3>
          <p>
            Yes, a 4.0 GPA is achievable and means you earned an A or A+ in every course. While difficult, thousands of students graduate with a perfect 4.0 each year.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Course Rows */}
        <div className="space-y-4">
          <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_40px] sm:gap-3 sm:text-sm sm:font-medium sm:text-muted-foreground">
            <span>Course Name</span>
            <span>Credits</span>
            <span>Grade</span>
            <span />
          </div>

          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_100px_100px_40px] sm:items-end sm:border-none sm:bg-transparent sm:p-0"
            >
              <Input
                placeholder="e.g. Calculus I"
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
              />
              <Input
                type="number"
                value={course.credits}
                onChange={(e) =>
                  updateCourse(course.id, "credits", e.target.value)
                }
                placeholder="3"
                suffix="cr"
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
                title="Remove course"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Course */}
        <Button
          onClick={addCourse}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add Course
        </Button>

        {/* Results */}
        {gpa !== null && (
          <ResultsGrid columns={3}>
            <ResultCard label="Your GPA" value={gpa.toFixed(2)} highlight />
            <ResultCard label="Total Credits" value={totalCredits} unit="cr" />
            <ResultCard label="Standing" value={getGpaLabel(gpa)} />
          </ResultsGrid>
        )}

      </div>
    </ToolLayout>
  );
}
