"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import {
  Heart,
  Calendar,
  Baby,
  Clock,
  Info,
  CalendarDays,
  Sparkles,
} from "lucide-react";

// ─── FAQ Data ──────────────────────────────────────
const faqs: FAQItem[] = [
  {
    question: "How accurate is an ovulation calculator?",
    answer:
      "Ovulation calculators provide an estimate based on average cycle patterns and the luteal phase calculation method. They are most accurate for women with regular, consistent cycles (26–32 days). Studies published in the journal Human Reproduction show that ovulation timing can vary by 1–4 days even in women with regular cycles. For higher accuracy, combine calculator predictions with physical signs of ovulation (cervical mucus, basal body temperature) or use ovulation prediction kits (OPKs) that detect the luteinizing hormone (LH) surge.",
  },
  {
    question: "What is a fertile window and how long does it last?",
    answer:
      "The fertile window is the period during which intercourse can result in pregnancy. It lasts approximately 6 days — the 5 days before ovulation plus the day of ovulation itself. This is because sperm can survive in the female reproductive tract for up to 5 days, while an egg survives only 12–24 hours after release. The highest probability of conception occurs during the 2 days before ovulation and the day of ovulation itself, according to a landmark study by Wilcox et al. published in the New England Journal of Medicine (1995).",
  },
  {
    question: "When does ovulation typically occur in a menstrual cycle?",
    answer:
      "Ovulation typically occurs 12–16 days before the start of your next period, with an average of 14 days. In a standard 28-day cycle, this means ovulation occurs around day 14. In a 32-day cycle, ovulation would occur around day 18. In a 24-day cycle, around day 10. The key insight is that the luteal phase (ovulation to next period) is relatively constant at 14 days, while the follicular phase (period to ovulation) varies with cycle length.",
  },
  {
    question: "How can I confirm that I am ovulating?",
    answer:
      "Physical signs of ovulation include: (1) an increase in clear, stretchy cervical mucus resembling raw egg whites (most reliable sign), (2) a slight rise in basal body temperature (0.4–1.0°F) that persists through the luteal phase, (3) mild pelvic pain or cramping on one side (mittelschmerz), and (4) a positive ovulation prediction kit (OPK) detecting the LH surge 24–36 hours before ovulation. Tracking these signs across several cycles provides the most accurate ovulation timing.",
  },
  {
    question: "Does cycle length affect fertility?",
    answer:
      "Cycle length itself does not directly determine fertility, but very irregular cycles (shorter than 21 days or longer than 35 days) may indicate conditions that affect ovulation, such as polycystic ovary syndrome (PCOS), thyroid disorders, or hypothalamic amenorrhea. Regular cycles between 24–35 days generally indicate healthy ovulatory function. The American College of Obstetricians and Gynecologists (ACOG) recommends consulting a healthcare provider if cycles consistently fall outside this range or if irregularity suddenly develops.",
  },
  {
    question: "Can I use an ovulation calculator for birth control?",
    answer:
      "Ovulation calculators alone are NOT reliable for contraception. The fertility awareness-based method (FAM) of contraception requires tracking multiple indicators simultaneously — basal body temperature, cervical mucus, and cycle history — and has a typical-use failure rate of 12–24% per year according to the CDC. Calendar-only methods have even higher failure rates because ovulation timing can shift due to stress, illness, travel, or hormonal changes. For contraception, consult your healthcare provider about evidence-based methods.",
  },
];

// ─── Helper Functions ──────────────────────────────
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Component ─────────────────────────────────────
export default function OvulationCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  const results = useMemo(() => {
    if (!lastPeriodDate) return null;

    const lmp = new Date(lastPeriodDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lmp.setHours(0, 0, 0, 0);

    const cycleDays = parseInt(cycleLength) || 28;
    if (cycleDays < 20 || cycleDays > 45) return null;

    // Ovulation occurs approximately 14 days before the next period
    const ovulationDay = cycleDays - 14;
    const ovulationDate = addDays(lmp, ovulationDay);

    // Fertile window: 5 days before ovulation + ovulation day
    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = ovulationDate;

    // Most fertile days: 2 days before ovulation + ovulation day
    const peakStart = addDays(ovulationDate, -2);
    const peakEnd = ovulationDate;

    // Next period date
    const nextPeriod = addDays(lmp, cycleDays);

    // If ovulation is in the past, calculate next cycle too
    const nextOvulationDate = addDays(nextPeriod, cycleDays - 14);
    const nextFertileStart = addDays(nextOvulationDate, -5);
    const nextFertileEnd = nextOvulationDate;

    // Build 3-cycle projection
    const cycles = [];
    for (let i = 0; i < 3; i++) {
      const cycleStart = addDays(lmp, cycleDays * i);
      const cycleOvulation = addDays(cycleStart, ovulationDay);
      const cycleFertileStart = addDays(cycleOvulation, -5);
      const cycleFertileEnd = cycleOvulation;
      const cyclePeakStart = addDays(cycleOvulation, -2);
      const cycleNextPeriod = addDays(cycleStart, cycleDays);

      cycles.push({
        cycleNumber: i + 1,
        periodStart: cycleStart,
        ovulationDate: cycleOvulation,
        fertileStart: cycleFertileStart,
        fertileEnd: cycleFertileEnd,
        peakStart: cyclePeakStart,
        nextPeriod: cycleNextPeriod,
      });
    }

    return {
      ovulationDate,
      fertileStart,
      fertileEnd,
      peakStart,
      peakEnd,
      nextPeriod,
      ovulationDay,
      cycles,
    };
  }, [lastPeriodDate, cycleLength]);

  const today = new Date().toISOString().split("T")[0];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const minDate = sixMonthsAgo.toISOString().split("T")[0];

  return (
    <ToolLayout
      title="Ovulation Calculator"
      description="Predict your most fertile days and estimated ovulation date based on your last menstrual period and cycle length. Track your fertility window across multiple cycles with our free, science-based ovulation calculator."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter Last Period Date", text: "Select the first day of your most recent menstrual period." },
        { name: "Set Cycle Length", text: "Enter your average menstrual cycle length in days (typically 21–35 days)." },
        { name: "View Fertility Window", text: "See your estimated ovulation date, fertile window, and peak fertility days for the next 3 cycles." },
      ]}
      relatedTools={[
        { name: "Due Date Calculator", href: "/due-date-calculator/" },
        { name: "Age Calculator", href: "/age-calculator/" },
        { name: "BMI Calculator", href: "/bmi-calculator/" },
        { name: "Calorie Calculator", href: "/calorie-calculator/" },
        { name: "Sleep Calculator", href: "/sleep-calculator/" },
      ]}
      content={
        <>
          <h2>What Is an Ovulation Calculator?</h2>
          <p>
            An ovulation calculator predicts the days in your menstrual cycle when you are most likely to conceive. It estimates your ovulation date — the day when an egg is released from one of your ovaries — and identifies the surrounding fertile window during which pregnancy is possible. This tool uses the calendar method based on the well-established scientific understanding that the luteal phase (the time between ovulation and the next period) averages 14 days in most women. Our free ovulation calculator is based on the same scientific principles used by reproductive endocrinologists and fertility clinics worldwide.
          </p>

          <h2>How Is Ovulation Date Calculated?</h2>
          <p>
            The calculation relies on the <strong>luteal phase method</strong>: ovulation typically occurs 14 days before the start of your next period.
          </p>
          <p>
            <strong>Formula: Ovulation Day = Cycle Length − 14</strong>
          </p>
          <p>
            For a 28-day cycle, ovulation occurs around day 14 (28 − 14). For a 32-day cycle, ovulation occurs around day 18 (32 − 14). For a 25-day cycle, around day 11 (25 − 14).
          </p>

          <h3>Worked Example</h3>
          <p>
            If your last menstrual period started on March 1 and your average cycle length is 30 days:
          </p>
          <ul>
            <li><strong>Ovulation Day:</strong> 30 − 14 = Day 16 → March 16</li>
            <li><strong>Fertile Window:</strong> March 11 – March 16 (6 days)</li>
            <li><strong>Peak Fertility:</strong> March 14 – March 16 (3 days)</li>
            <li><strong>Next Period:</strong> March 31</li>
          </ul>

          <h2>Understanding Your Fertile Window</h2>
          <p>
            The fertile window spans approximately <strong>6 days</strong> — the 5 days before ovulation plus the day of ovulation itself. This window exists because of the differing lifespans of sperm and eggs in the reproductive tract. Sperm can survive for up to 5 days in favorable cervical mucus conditions, while an ovulated egg is viable for only 12–24 hours. The highest probability of conception occurs during the <strong>2 days before ovulation and the day of ovulation itself</strong> — these are your peak fertility days.
          </p>
          <p>
            Research published by Wilcox et al. in the <em>New England Journal of Medicine</em> (1995) established that conception probability per cycle ranges from 10% on the earliest fertile day to 33% on the day before ovulation. Understanding this distribution helps couples time intercourse optimally when trying to conceive.
          </p>

          <h2>Factors That Affect Ovulation Timing</h2>
          <ul>
            <li><strong>Cycle irregularity:</strong> Women with irregular cycles may ovulate on different days each month, making predictions less accurate.</li>
            <li><strong>Stress:</strong> Psychological and physical stress can delay ovulation by suppressing gonadotropin-releasing hormone (GnRH) from the hypothalamus.</li>
            <li><strong>Age:</strong> As women age (especially after 35), cycles may shorten and ovulation patterns change due to declining ovarian reserve.</li>
            <li><strong>Weight:</strong> Both underweight (BMI &lt; 18.5) and overweight (BMI &gt; 30) can disrupt ovulatory cycles through hormonal imbalances.</li>
            <li><strong>Medical conditions:</strong> PCOS, thyroid disorders, and endometriosis can significantly alter ovulation timing and regularity.</li>
            <li><strong>Recent contraception:</strong> Stopping hormonal birth control may cause irregular cycles for 1–3 months as the body readjusts.</li>
          </ul>

          <h2>Signs of Ovulation</h2>
          <table>
            <thead>
              <tr><th>Sign</th><th>What to Look For</th><th>Timing</th></tr>
            </thead>
            <tbody>
              <tr><td>Cervical mucus</td><td>Clear, stretchy, egg-white consistency</td><td>1–2 days before ovulation</td></tr>
              <tr><td>Basal body temperature</td><td>Rise of 0.4–1.0°F that stays elevated</td><td>Day after ovulation (confirms it)</td></tr>
              <tr><td>Mittelschmerz</td><td>Mild one-sided pelvic pain or cramping</td><td>Day of ovulation</td></tr>
              <tr><td>LH surge (OPK)</td><td>Positive ovulation prediction kit</td><td>24–36 hours before ovulation</td></tr>
              <tr><td>Cervical position</td><td>Higher, softer, more open</td><td>Around ovulation</td></tr>
              <tr><td>Increased libido</td><td>Heightened sexual desire</td><td>Around ovulation</td></tr>
            </tbody>
          </table>

          <p>
            <strong>Medical disclaimer:</strong> This calculator provides estimates based on average menstrual cycle data and is intended for educational and planning purposes only. It is not a medical device and should not be relied upon for contraception. Individual ovulation timing varies. If you are having difficulty conceiving after 12 months of trying (or 6 months if over 35), consult a reproductive endocrinologist or OB-GYN. Always consult your healthcare provider for personalized medical advice.
          </p>

          <h2>Sources and References</h2>
          <ul>
            <li>Wilcox, A.J., Weinberg, C.R., & Baird, D.D. (1995). Timing of Sexual Intercourse in Relation to Ovulation. New England Journal of Medicine, 333(23), 1517–1521.</li>
            <li>American College of Obstetricians and Gynecologists (ACOG). (2015). Fertility Awareness-Based Methods of Family Planning. Committee Opinion No. 687.</li>
            <li>Practice Committee of the American Society for Reproductive Medicine. (2012). Optimizing natural fertility. Fertility and Sterility, 100(3), 631–637.</li>
            <li>World Health Organization. (2020). Medical eligibility criteria for contraceptive use, 5th edition. WHO Department of Reproductive Health and Research.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-pink-500/5 via-background to-purple-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Heart className="h-5 w-5 text-pink-500" />
            Cycle Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                First Day of Last Period
              </label>
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                max={today}
                min={minDate}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Average Cycle Length
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  min={20}
                  max={45}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Typical range: 21–35 days (average: 28)
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <>
            {/* Main Ovulation Date */}
            <div className="rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/30 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/50">
                  <Sparkles className="h-7 w-7 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm text-pink-600 dark:text-pink-400">Estimated Ovulation Date</p>
                  <p className="text-2xl sm:text-3xl font-bold text-pink-700 dark:text-pink-300">
                    {formatFullDate(results.ovulationDate)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Day {results.ovulationDay} of your cycle
                  </p>
                </div>
              </div>
            </div>

            {/* Key Dates Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Fertile Window</p>
                </div>
                <p className="font-semibold text-foreground">
                  {formatDate(results.fertileStart)} – {formatDate(results.fertileEnd)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">6 fertile days</p>
              </div>

              <div className="rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-950/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <p className="text-sm text-muted-foreground">Peak Fertility</p>
                </div>
                <p className="font-semibold text-pink-700 dark:text-pink-300">
                  {formatDate(results.peakStart)} – {formatDate(results.peakEnd)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Highest chance of conception</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-muted-foreground">Next Period</p>
                </div>
                <p className="font-semibold text-foreground">
                  {formatFullDate(results.nextPeriod)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <p className="text-sm text-muted-foreground">Cycle Length</p>
                </div>
                <p className="font-semibold text-foreground">
                  {cycleLength} days
                </p>
                <p className="text-xs text-muted-foreground mt-1">Ovulation on day {results.ovulationDay}</p>
              </div>
            </div>

            {/* 3-Cycle Projection */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                3-Cycle Projection
              </h3>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Cycle</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Period Starts</th>
                      <th className="pb-2 pr-4 font-medium text-muted-foreground">Fertile Window</th>
                      <th className="pb-2 pr-4 font-medium text-pink-500">Ovulation</th>
                      <th className="pb-2 font-medium text-muted-foreground">Next Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.cycles.map((cycle) => (
                      <tr key={cycle.cycleNumber} className="border-b border-border/50">
                        <td className="py-3 pr-4 font-medium text-foreground">Cycle {cycle.cycleNumber}</td>
                        <td className="py-3 pr-4 text-foreground">{formatDate(cycle.periodStart)}</td>
                        <td className="py-3 pr-4 text-blue-600 dark:text-blue-400">
                          {formatDate(cycle.fertileStart)} – {formatDate(cycle.fertileEnd)}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-pink-600 dark:text-pink-400">
                          {formatDate(cycle.ovulationDate)}
                        </td>
                        <td className="py-3 text-muted-foreground">{formatDate(cycle.nextPeriod)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Medical Disclaimer:</strong> This calculator provides estimates based on average menstrual cycle patterns. Individual ovulation timing varies. This tool is not a substitute for medical advice and should not be used as a contraceptive method. Consult your healthcare provider for personalized fertility guidance.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!results && !lastPeriodDate && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <Baby className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Enter the first day of your last period and your average cycle length to see your fertility window.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
