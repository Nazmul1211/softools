"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Timer, Gauge, MapPin, Award, ArrowRightLeft, Info, TrendingUp, Target } from "lucide-react";

/* ─── FAQ Data ──────────────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "What is a good running pace for beginners?",
    answer:
      "A comfortable pace for beginner runners is typically 10:00–13:00 minutes per mile (6:15–8:05 per km). The key is running at a pace where you can hold a conversation — often called 'conversational pace.' Most running coaches recommend starting slower than you think and building speed gradually over weeks. A 2019 study in the British Journal of Sports Medicine found that running at any speed, even slow jogging at 12+ min/mile, provides significant cardiovascular benefits compared to not running at all.",
  },
  {
    question: "How do I calculate my pace from a race time?",
    answer:
      "Pace = Total Time ÷ Distance. For example, if you finished a 10K (6.21 miles) in 55 minutes: 55 ÷ 6.21 = 8:51 per mile, or 55 ÷ 10 = 5:30 per km. This calculator handles this conversion instantly — enter your distance and time to get pace in both miles and kilometers. For races with GPS tracking, your watch may show a slightly different distance due to tangent running and GPS drift, typically adding 1–3% to the actual course distance.",
  },
  {
    question: "What pace do I need to run a sub-4 hour marathon?",
    answer:
      "A sub-4 hour marathon (26.2 miles / 42.195 km) requires an average pace of 9:09 per mile or 5:41 per km. For negative-split strategy (running the second half faster), aim for 9:15–9:20 in the first half and 8:55–9:00 in the second half. The sub-4 marathon is a popular goal — approximately 47% of marathon finishers achieve this benchmark according to RunRepeat's analysis of 107 million race results. Consistent training at this pace is essential; tempo runs at 8:30–8:45/mile are recommended.",
  },
  {
    question: "How accurate are GPS watches for measuring pace?",
    answer:
      "GPS watches are generally accurate to within 1–3% for distance and pace on open roads with clear sky. Accuracy decreases in urban canyons (tall buildings), dense forests, and indoor tracks. A 2020 study in the International Journal of Sports Physiology and Performance found that modern GPS devices (Garmin, Polar, COROS) averaged 1.5% error on a measured 10K course. For maximum accuracy, enable GLONASS or multi-band GPS, wait for full satellite lock before starting, and run a measured course to calibrate your specific device.",
  },
  {
    question: "What is negative splitting and should I do it?",
    answer:
      "Negative splitting means running the second half of a race faster than the first half. It is the strategy used by most marathon world records — Berlin 2023 world record holder Kelvin Kiptum ran his second half approximately 30 seconds faster than the first. The benefit is that starting conservatively prevents early glycogen depletion and allows you to finish strong. For recreational runners, even splits (same pace throughout) or slight negative splits (30–60 seconds faster in the second half) are ideal. Avoid positive splitting (starting too fast), which is the #1 race-day mistake.",
  },
  {
    question: "How do I convert between pace per mile and pace per km?",
    answer:
      "To convert pace per mile to pace per km, divide by 1.60934. To convert pace per km to pace per mile, multiply by 1.60934. For example: 8:00 per mile = 4:58 per km (480 seconds ÷ 1.60934 = 298.3 seconds = 4:58). This calculator automatically shows both units so you never need to do this conversion manually. The factor 1.60934 is the exact number of kilometers in one mile.",
  },
];

/* ─── Types ─────────────────────────────────────── */

type SolveFor = "pace" | "time" | "distance";
type Unit = "miles" | "km";

interface RaceSplit {
  name: string;
  distanceMiles: number;
  distanceKm: number;
}

/* ─── Constants ─────────────────────────────────── */

const commonDistances: RaceSplit[] = [
  { name: "1 Mile", distanceMiles: 1, distanceKm: 1.60934 },
  { name: "5K", distanceMiles: 3.10686, distanceKm: 5 },
  { name: "10K", distanceMiles: 6.21371, distanceKm: 10 },
  { name: "Half Marathon", distanceMiles: 13.1094, distanceKm: 21.0975 },
  { name: "Marathon", distanceMiles: 26.2188, distanceKm: 42.195 },
];

/* ─── Helpers ───────────────────────────────────── */

function parseTimeInput(h: string, m: string, s: string): number {
  return (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
}

function formatSeconds(totalSeconds: number): string {
  if (totalSeconds <= 0 || !isFinite(totalSeconds)) return "0:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPace(totalSeconds: number): string {
  if (totalSeconds <= 0 || !isFinite(totalSeconds)) return "--:--";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Component ────────────────────────────────── */

export default function PaceCalculator() {
  const [solveFor, setSolveFor] = useState<SolveFor>("pace");
  const [unit, setUnit] = useState<Unit>("miles");

  /* Pace inputs (min:sec per unit) */
  const [paceMin, setPaceMin] = useState("9");
  const [paceSec, setPaceSec] = useState("00");

  /* Time inputs */
  const [timeH, setTimeH] = useState("0");
  const [timeM, setTimeM] = useState("45");
  const [timeS, setTimeS] = useState("0");

  /* Distance input */
  const [distance, setDistance] = useState("5");

  const results = useMemo(() => {
    const dist = parseFloat(distance) || 0;
    const totalTimeSec = parseTimeInput(timeH, timeM, timeS);
    const paceTotalSec = (parseInt(paceMin) || 0) * 60 + (parseInt(paceSec) || 0);

    if (solveFor === "pace") {
      if (dist <= 0 || totalTimeSec <= 0) return null;
      const pacePerUnit = totalTimeSec / dist;
      const conversionFactor = unit === "miles" ? 1.60934 : 1 / 1.60934;
      const paceOtherUnit = pacePerUnit * (unit === "miles" ? 1 / 1.60934 : 1.60934);
      const speedMph = unit === "miles" ? 3600 / pacePerUnit : 3600 / (pacePerUnit * 1.60934);
      const speedKph = speedMph * 1.60934;

      return {
        type: "pace" as const,
        pacePerUnit,
        paceOtherUnit,
        speedMph,
        speedKph,
        totalTimeSec,
        distance: dist,
        unit,
      };
    }

    if (solveFor === "time") {
      if (dist <= 0 || paceTotalSec <= 0) return null;
      const totalTime = paceTotalSec * dist;
      const paceOtherUnit = paceTotalSec * (unit === "miles" ? 1 / 1.60934 : 1.60934);
      const speedMph = unit === "miles" ? 3600 / paceTotalSec : 3600 / (paceTotalSec * 1.60934);
      const speedKph = speedMph * 1.60934;

      return {
        type: "time" as const,
        totalTimeSec: totalTime,
        pacePerUnit: paceTotalSec,
        paceOtherUnit,
        speedMph,
        speedKph,
        distance: dist,
        unit,
      };
    }

    if (solveFor === "distance") {
      if (totalTimeSec <= 0 || paceTotalSec <= 0) return null;
      const calculatedDist = totalTimeSec / paceTotalSec;
      const paceOtherUnit = paceTotalSec * (unit === "miles" ? 1 / 1.60934 : 1.60934);
      const speedMph = unit === "miles" ? 3600 / paceTotalSec : 3600 / (paceTotalSec * 1.60934);
      const speedKph = speedMph * 1.60934;

      return {
        type: "distance" as const,
        distance: calculatedDist,
        totalTimeSec,
        pacePerUnit: paceTotalSec,
        paceOtherUnit,
        speedMph,
        speedKph,
        unit,
      };
    }

    return null;
  }, [solveFor, unit, paceMin, paceSec, timeH, timeM, timeS, distance]);

  /* Race predictions based on current pace */
  const racePredictions = useMemo(() => {
    if (!results) return null;
    const pacePerMile = unit === "miles" ? results.pacePerUnit : results.pacePerUnit * 1.60934;
    return commonDistances.map((race) => ({
      ...race,
      finishTime: pacePerMile * race.distanceMiles,
    }));
  }, [results, unit]);

  return (
    <ToolLayout
      title="Pace Calculator"
      description="Calculate your running, walking, or cycling pace, finish time, or distance. Enter any two values and the calculator solves for the third. Supports both miles and kilometers with race finish time predictions for common distances."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Choose what to calculate", text: "Select whether you want to find your pace, finish time, or distance using the toggle at the top." },
        { name: "Enter known values", text: "Input the two values you know. For example, to find pace: enter your distance and total time." },
        { name: "Select your units", text: "Choose between miles and kilometers. The calculator shows conversions for both units automatically." },
        { name: "Review results and race predictions", text: "See your pace, speed, and predicted finish times for 5K, 10K, half marathon, and marathon distances." },
      ]}
      relatedTools={[
        { name: "Calories Burned Calculator", href: "/calories-burned-calculator" },
        { name: "Heart Rate Zones Calculator", href: "/heart-rate-zones-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "TDEE Calculator", href: "/tdee-calculator" },
        { name: "Time Calculator", href: "/time-calculator" },
      ]}
      content={
        <>
          <h2>What Is a Pace Calculator?</h2>
          <p>
            A pace calculator determines your running, walking, or cycling speed per unit of distance (minutes per mile or minutes per kilometer) based on the relationship between three variables: <strong>pace</strong>, <strong>time</strong>, and <strong>distance</strong>. If you know any two, the calculator solves for the third. It is the essential planning tool for runners training for races, cyclists tracking performance, and fitness enthusiasts monitoring progress.
          </p>

          <h2>How Is Pace Calculated?</h2>
          <p>The core formula is:</p>
          <p><strong>Pace = Total Time ÷ Distance</strong></p>
          <p>The inverse relationships are:</p>
          <ul>
            <li><strong>Time = Pace × Distance</strong></li>
            <li><strong>Distance = Total Time ÷ Pace</strong></li>
          </ul>

          <h3>Worked Example</h3>
          <p>A runner completes a <strong>10K (6.21 miles)</strong> in <strong>52 minutes and 30 seconds</strong>:</p>
          <ul>
            <li><strong>Pace per km:</strong> 3,150 sec ÷ 10 km = 315 sec = <strong>5:15 /km</strong></li>
            <li><strong>Pace per mile:</strong> 3,150 sec ÷ 6.21 mi = 507 sec = <strong>8:27 /mile</strong></li>
            <li><strong>Speed:</strong> 6.21 ÷ (52.5/60) = <strong>7.10 mph</strong> = <strong>11.43 km/h</strong></li>
          </ul>

          <h2>Understanding Your Pace</h2>
          <p>Pace varies significantly by fitness level, terrain, and activity type. Here are general benchmarks for adult runners:</p>

          <table>
            <thead>
              <tr><th>Level</th><th>Pace/Mile</th><th>Pace/Km</th><th>5K Time</th><th>Marathon Time</th></tr>
            </thead>
            <tbody>
              <tr><td>Elite</td><td>4:30–5:30</td><td>2:48–3:25</td><td>14:00–17:00</td><td>2:00–2:25</td></tr>
              <tr><td>Advanced</td><td>6:00–7:30</td><td>3:44–4:40</td><td>18:30–23:20</td><td>2:37–3:17</td></tr>
              <tr><td>Intermediate</td><td>8:00–9:30</td><td>4:58–5:54</td><td>24:50–29:30</td><td>3:30–4:09</td></tr>
              <tr><td>Beginner</td><td>10:00–12:00</td><td>6:13–7:27</td><td>31:05–37:20</td><td>4:22–5:15</td></tr>
              <tr><td>Walker</td><td>15:00–20:00</td><td>9:19–12:26</td><td>46:35–62:00</td><td>6:33–8:44</td></tr>
            </tbody>
          </table>

          <h2>Race Training Paces Explained</h2>
          <p>Effective running training uses different paces for different workout types. Most coaches, including Jack Daniels (author of <em>Daniels&apos; Running Formula</em>), recommend these training zones:</p>
          <ul>
            <li><strong>Easy / Recovery Pace:</strong> 60–90 seconds slower than race pace. Used for 60–70% of weekly mileage. Builds aerobic base without excessive fatigue.</li>
            <li><strong>Tempo / Threshold Pace:</strong> A &ldquo;comfortably hard&rdquo; effort you could sustain for ~60 minutes. Typically 25–30 seconds per mile slower than 5K pace. Improves lactate threshold.</li>
            <li><strong>Interval Pace:</strong> Fast repetitions with recovery breaks. Typically at or slightly faster than 5K race pace. Improves VO₂max and speed.</li>
            <li><strong>Marathon Pace:</strong> The pace you plan to hold for 26.2 miles. Usually 45–90 seconds slower than tempo pace depending on fitness level.</li>
            <li><strong>Long Run Pace:</strong> 30–90 seconds slower than marathon pace. Builds endurance, mental toughness, and fat oxidation capacity.</li>
          </ul>

          <h2>Pace vs. Speed: What&apos;s the Difference?</h2>
          <p>
            Pace and speed measure the same thing (how fast you&apos;re moving) but in opposite ways. <strong>Pace</strong> is time per distance (e.g., 8:00 per mile) — lower is faster. <strong>Speed</strong> is distance per time (e.g., 7.5 mph) — higher is faster. Runners traditionally use pace because it maps directly to race strategy: &ldquo;I need to hold 9:00/mile for 26 miles.&rdquo; Cyclists and motorists use speed. Here is the conversion formula:
          </p>
          <p><strong>Speed (mph) = 60 ÷ Pace (min/mile)</strong></p>
          <p><strong>Pace (min/mile) = 60 ÷ Speed (mph)</strong></p>

          <h2>Common Race Distances</h2>
          <table>
            <thead>
              <tr><th>Race</th><th>Distance (miles)</th><th>Distance (km)</th><th>Avg. Finish Time</th></tr>
            </thead>
            <tbody>
              <tr><td>5K</td><td>3.107</td><td>5.000</td><td>27:00 (adults)</td></tr>
              <tr><td>10K</td><td>6.214</td><td>10.000</td><td>56:00 (adults)</td></tr>
              <tr><td>Half Marathon</td><td>13.109</td><td>21.098</td><td>2:01:00 (adults)</td></tr>
              <tr><td>Marathon</td><td>26.219</td><td>42.195</td><td>4:21:00 (adults)</td></tr>
              <tr><td>Ultra (50K)</td><td>31.069</td><td>50.000</td><td>5:30:00+ (adults)</td></tr>
            </tbody>
          </table>
          <p>Average finish times based on RunRepeat&apos;s analysis of 107+ million race results from 1986–2024.</p>

          <h2>Sources and References</h2>
          <ul>
            <li>Daniels, J. (2013). <em>Daniels&apos; Running Formula</em> (3rd ed.). Human Kinetics.</li>
            <li>RunRepeat (2024). &ldquo;The State of Running.&rdquo; Analysis of 107.9 million race results.</li>
            <li>Vickers, A.J. &amp; Vertosick, E.A. (2016). &ldquo;An empirical study of race times in recreational endurance runners.&rdquo; <em>BMC Sports Science, Medicine and Rehabilitation</em>, 8(1), 26.</li>
            <li>Lee, D.C., et al. (2014). &ldquo;Leisure-time running reduces all-cause and cardiovascular mortality risk.&rdquo; <em>Journal of the American College of Cardiology</em>, 64(5), 472–481.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Solve For toggle */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Calculate</label>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(["pace", "time", "distance"] as SolveFor[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSolveFor(opt)}
                className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium capitalize transition-all ${
                  solveFor === opt
                    ? "bg-white dark:bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Unit toggle */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-primary" />
            Units
          </label>
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setUnit("miles")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                unit === "miles" ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >Miles</button>
            <button
              onClick={() => setUnit("km")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                unit === "km" ? "bg-white dark:bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >Kilometers</button>
          </div>
        </div>

        {/* Pace input — only when NOT solving for pace */}
        {solveFor !== "pace" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Pace (per {unit === "miles" ? "mile" : "km"})
            </label>
            <div className="flex items-center gap-2">
              <input type="number" inputMode="numeric" value={paceMin} onChange={(e) => setPaceMin(e.target.value)} placeholder="min" min="0" max="60" className="w-20 rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-lg text-muted-foreground font-bold">:</span>
              <input type="number" inputMode="numeric" value={paceSec} onChange={(e) => setPaceSec(e.target.value)} placeholder="sec" min="0" max="59" className="w-20 rounded-lg border border-border bg-white dark:bg-muted/30 px-3 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-sm text-muted-foreground">/{unit === "miles" ? "mile" : "km"}</span>
            </div>
          </div>
        )}

        {/* Time input — only when NOT solving for time */}
        {solveFor !== "time" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              Total Time
            </label>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <input type="number" inputMode="numeric" value={timeH} onChange={(e) => setTimeH(e.target.value)} placeholder="0" min="0" max="24" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <p className="text-xs text-muted-foreground mt-1">hrs</p>
              </div>
              <span className="text-lg text-muted-foreground font-bold">:</span>
              <div className="text-center">
                <input type="number" inputMode="numeric" value={timeM} onChange={(e) => setTimeM(e.target.value)} placeholder="0" min="0" max="59" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <p className="text-xs text-muted-foreground mt-1">min</p>
              </div>
              <span className="text-lg text-muted-foreground font-bold">:</span>
              <div className="text-center">
                <input type="number" inputMode="numeric" value={timeS} onChange={(e) => setTimeS(e.target.value)} placeholder="0" min="0" max="59" className="w-16 rounded-lg border border-border bg-white dark:bg-muted/30 px-2 py-3 text-lg text-center text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <p className="text-xs text-muted-foreground mt-1">sec</p>
              </div>
            </div>
          </div>
        )}

        {/* Distance input — only when NOT solving for distance */}
        {solveFor !== "distance" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Distance ({unit})
            </label>
            <div className="flex items-center gap-2">
              <input type="number" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 5" min="0" step="0.01" className="flex-1 rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">{unit}</span>
            </div>
            {/* Quick distance buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {commonDistances.map((race) => (
                <button
                  key={race.name}
                  onClick={() => setDistance((unit === "miles" ? race.distanceMiles : race.distanceKm).toFixed(3))}
                  className="px-3 py-1.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {race.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Primary result */}
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
              {results.type === "pace" && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your Pace</p>
                  <p className="text-4xl font-bold text-foreground">
                    {formatPace(results.pacePerUnit)} <span className="text-lg text-muted-foreground">/{unit === "miles" ? "mile" : "km"}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatPace(results.paceOtherUnit)} /{unit === "miles" ? "km" : "mile"}
                  </p>
                </div>
              )}
              {results.type === "time" && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Finish Time</p>
                  <p className="text-4xl font-bold text-foreground">{formatSeconds(results.totalTimeSec)}</p>
                </div>
              )}
              {results.type === "distance" && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Distance</p>
                  <p className="text-4xl font-bold text-foreground">
                    {results.distance.toFixed(2)} <span className="text-lg text-muted-foreground">{unit}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(unit === "miles" ? results.distance * 1.60934 : results.distance / 1.60934).toFixed(2)} {unit === "miles" ? "km" : "miles"}
                  </p>
                </div>
              )}
            </div>

            {/* Speed + supplementary info */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Speed (mph)</p>
                <p className="text-xl font-bold text-foreground">{results.speedMph.toFixed(1)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Speed (km/h)</p>
                <p className="text-xl font-bold text-foreground">{results.speedKph.toFixed(1)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Time</p>
                <p className="text-xl font-bold text-foreground">{formatSeconds(results.totalTimeSec)}</p>
              </div>
            </div>

            {/* Race predictions */}
            {racePredictions && (
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Race Finish Time Predictions
                </h4>
                <p className="text-xs text-muted-foreground mb-3">Based on maintaining your current pace</p>
                <div className="space-y-2">
                  {racePredictions.map((race) => (
                    <div key={race.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="text-sm font-medium text-foreground">{race.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({race.distanceKm.toFixed(1)} km)</span>
                      </div>
                      <span className="text-sm font-bold text-foreground font-mono">{formatSeconds(race.finishTime)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-xl border border-border bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Race predictions assume you maintain the same pace throughout. Actual performance varies with terrain, weather, fatigue, and training. Consult a running coach for personalized training plans.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!results && (
          <div className="text-center py-12 text-muted-foreground">
            <Timer className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter two values above to calculate the third</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
