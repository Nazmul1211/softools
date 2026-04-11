"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Heart, Activity, Timer, Zap, Info, Flame, Wind, Trophy } from "lucide-react";

/* ────────────────────────────── FAQ Data ────────────────────────────── */

const faqs: FAQItem[] = [
  {
    question: "How accurate is the 220 minus age formula for max heart rate?",
    answer:
      "The '220 minus age' formula (Haskell & Fox, 1970) is a population average with a standard deviation of ±10–12 beats per minute. This means your true max heart rate could be up to 12 BPM higher or lower than the formula predicts. For more accuracy, the Tanaka formula (208 − 0.7 × age) is considered slightly better. The most accurate method is a supervised maximal exercise test performed by a health professional. If you know your actual max HR from testing, enter it manually in this calculator for precise zones.",
  },
  {
    question: "What is Zone 2 training and why is it popular?",
    answer:
      "Zone 2 training (60–70% of max HR) is the intensity where your body primarily burns fat for fuel and develops aerobic base fitness. It has surged in popularity because research shows it improves mitochondrial function, cardiorespiratory fitness, and metabolic health more effectively than higher-intensity-only programs. Endurance athletes spend 70–80% of their total training volume in Zone 2. It feels easy — you should be able to hold a full conversation. For beginner runners, walking briskly or jogging very slowly often keeps you in Zone 2.",
  },
  {
    question: "Is there really a 'fat-burning zone'?",
    answer:
      "Yes, but it is widely misunderstood. At lower intensities (Zone 2, roughly 60–70% max HR), a higher percentage of calories come from fat rather than carbohydrates. However, higher-intensity exercise burns more total calories per minute. A 2009 study by Carey (MSSE journal) found that the maximum rate of fat oxidation occurs at approximately 55–65% of VO₂max, which corresponds roughly to Zone 2. For weight loss, total calorie expenditure matters more than the fuel source — but Zone 2 is excellent for building fat-burning metabolic pathways.",
  },
  {
    question: "What is the difference between the Karvonen and standard method?",
    answer:
      "The standard method calculates zones as simple percentages of your maximum heart rate (e.g., Zone 2 = 60–70% of max HR). The Karvonen method (also called Heart Rate Reserve method) subtracts your resting heart rate first — Zone HR = ((Max HR − Resting HR) × %Intensity) + Resting HR. The Karvonen method is more personalized because it accounts for your baseline fitness level. Someone with a low resting HR (e.g., 50 BPM) will get different zone boundaries than someone with a high resting HR (e.g., 80 BPM), reflecting real differences in cardiovascular fitness.",
  },
  {
    question: "How do I measure my resting heart rate accurately?",
    answer:
      "Measure your resting heart rate first thing in the morning, before getting out of bed, on 3 consecutive days and take the average. Place two fingers on the inside of your wrist (radial pulse) and count beats for 60 seconds. Alternatively, use a pulse oximeter or a fitness tracker worn overnight. Avoid measuring after caffeine, alcohol, or intense exercise. A typical resting heart rate for adults is 60–100 BPM. Well-trained athletes often have resting rates of 40–60 BPM.",
  },
  {
    question: "How long should I train in each heart rate zone?",
    answer:
      "The optimal distribution depends on your goals. The widely-used '80/20 rule' (polarized training) recommends 80% of training time in Zones 1–2 (easy) and 20% in Zones 4–5 (hard), with minimal time in Zone 3 ('no man's land'). For general fitness, aim for 150 minutes per week in Zone 2–3. For performance, elite runners and cyclists follow the polarized model. For weight management, a mix of Zone 2 (fat oxidation) and Zone 4 intervals (EPOC — excess post-exercise oxygen consumption) is effective.",
  },
];

/* ────────────── Types ────────────── */

type Method = "standard" | "karvonen";

interface Zone {
  number: number;
  name: string;
  description: string;
  minPct: number;
  maxPct: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

/* ────────────── Constants ────────────── */

const zones: Zone[] = [
  {
    number: 1,
    name: "Recovery",
    description: "Very light — warm-up, cool-down, active recovery",
    minPct: 50,
    maxPct: 60,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    icon: <Wind className="h-4 w-4" />,
  },
  {
    number: 2,
    name: "Aerobic Base",
    description: "Easy — fat burning, endurance building, conversational pace",
    minPct: 60,
    maxPct: 70,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/40",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    number: 3,
    name: "Tempo",
    description: "Moderate — aerobic fitness, stamina improvement",
    minPct: 70,
    maxPct: 80,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/40",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    number: 4,
    name: "Threshold",
    description: "Hard — lactate threshold, speed and power gains",
    minPct: 80,
    maxPct: 90,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/40",
    icon: <Flame className="h-4 w-4" />,
  },
  {
    number: 5,
    name: "Maximum",
    description: "All-out — VO₂max efforts, sprints, anaerobic capacity",
    minPct: 90,
    maxPct: 100,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/40",
    icon: <Zap className="h-4 w-4" />,
  },
];

/* ────────────────────── Component ────────────────────── */

export default function HeartRateZonesCalculator() {
  const [age, setAge] = useState<string>("30");
  const [restingHR, setRestingHR] = useState<string>("65");
  const [customMaxHR, setCustomMaxHR] = useState<string>("");
  const [method, setMethod] = useState<Method>("karvonen");
  const [useCustomMax, setUseCustomMax] = useState(false);

  const results = useMemo(() => {
    const ageNum = parseInt(age, 10);
    const rhr = parseInt(restingHR, 10);
    if (!ageNum || ageNum <= 0) return null;

    /* Calculate max HR — Tanaka formula is more accurate than 220-age */
    const calculatedMaxHR = Math.round(208 - 0.7 * ageNum);
    const maxHR = useCustomMax && customMaxHR ? parseInt(customMaxHR, 10) : calculatedMaxHR;
    if (!maxHR || maxHR <= 0) return null;

    const hrReserve = rhr && rhr > 0 ? maxHR - rhr : 0;

    const computedZones = zones.map((zone) => {
      let minBPM: number;
      let maxBPM: number;

      if (method === "karvonen" && rhr && rhr > 0) {
        /* Karvonen: Target HR = ((Max HR − Resting HR) × %Intensity) + Resting HR */
        minBPM = Math.round(hrReserve * (zone.minPct / 100) + rhr);
        maxBPM = Math.round(hrReserve * (zone.maxPct / 100) + rhr);
      } else {
        /* Standard: Target HR = Max HR × %Intensity */
        minBPM = Math.round(maxHR * (zone.minPct / 100));
        maxBPM = Math.round(maxHR * (zone.maxPct / 100));
      }

      return { ...zone, minBPM, maxBPM };
    });

    return { maxHR, calculatedMaxHR, hrReserve, zones: computedZones };
  }, [age, restingHR, customMaxHR, method, useCustomMax]);

  return (
    <ToolLayout
      title="Heart Rate Zones Calculator"
      description="Calculate your 5 personalized heart rate training zones based on age, resting heart rate, and maximum heart rate. Choose between the standard percentage method or the more accurate Karvonen (Heart Rate Reserve) method used by professional coaches."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="April 2026"
      faqs={faqs}
      howToSteps={[
        { name: "Enter your age", text: "Input your current age to estimate your maximum heart rate using the Tanaka formula (208 − 0.7 × age)." },
        { name: "Enter resting heart rate (optional)", text: "For the more accurate Karvonen method, enter your resting heart rate measured first thing in the morning." },
        { name: "Choose calculation method", text: "Select Standard (simple percentage of max HR) or Karvonen (uses heart rate reserve for personalized zones)." },
        { name: "View your 5 training zones", text: "Review your personalized Zone 1 through Zone 5 heart rate ranges in BPM to guide your workouts." },
      ]}
      relatedTools={[
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "Calories Burned Calculator", href: "/calories-burned-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "TDEE Calculator", href: "/tdee-calculator" },
        { name: "BMR Calculator", href: "/bmr-calculator" },
      ]}
      content={
        <>
          <h2>What Are Heart Rate Training Zones?</h2>
          <p>
            Heart rate training zones are intensity ranges defined as percentages of your maximum heart rate (MHR). They categorize exercise intensity from very light (Zone 1) to all-out effort (Zone 5). Training in specific zones produces different physiological adaptations — fat oxidation, aerobic endurance, lactate threshold improvement, or VO₂max development. Understanding your zones helps you train more efficiently, avoid overtraining, and match your workout intensity to your goals.
          </p>

          <h2>How Are Heart Rate Zones Calculated?</h2>
          <p>
            There are two widely-used methods for calculating heart rate training zones:
          </p>
          <h3>Standard Method (Percentage of Max HR)</h3>
          <p>
            <strong>Zone Heart Rate = Max HR × Target Percentage</strong>
          </p>
          <p>
            This method is simple: each zone is a direct percentage of your estimated maximum heart rate. Max HR is typically estimated using the <strong>Tanaka formula: 208 − (0.7 × age)</strong>, which is more accurate than the older &ldquo;220 minus age&rdquo; formula. The standard method works well as a starting point but does not account for individual fitness differences.
          </p>

          <h3>Karvonen Method (Heart Rate Reserve)</h3>
          <p>
            <strong>Zone HR = ((Max HR − Resting HR) × % Intensity) + Resting HR</strong>
          </p>
          <p>
            The Karvonen method uses your <strong>heart rate reserve</strong> (the difference between max HR and resting HR) to calculate zones. This is more personalized because a fit person with a resting HR of 50 BPM will get different zone boundaries than an untrained person with a resting HR of 80 BPM. The American College of Sports Medicine (ACSM) considers this method more accurate for prescribing exercise intensity.
          </p>

          <h3>Worked Example (Karvonen Method)</h3>
          <p>
            For a <strong>35-year-old</strong> with a resting heart rate of <strong>62 BPM</strong>:
          </p>
          <ul>
            <li><strong>Max HR</strong> = 208 − (0.7 × 35) = 183 BPM</li>
            <li><strong>Heart Rate Reserve</strong> = 183 − 62 = 121 BPM</li>
            <li><strong>Zone 2 (60–70%)</strong> = (121 × 0.60) + 62 to (121 × 0.70) + 62 = <strong>135 to 147 BPM</strong></li>
            <li><strong>Zone 4 (80–90%)</strong> = (121 × 0.80) + 62 to (121 × 0.90) + 62 = <strong>159 to 171 BPM</strong></li>
          </ul>

          <h2>The 5 Heart Rate Training Zones Explained</h2>

          <h3>Zone 1: Recovery (50–60% Max HR)</h3>
          <p>
            Very light effort. Used for warm-ups, cool-downs, and active recovery between hard sessions. Promotes blood flow to aid muscle repair without adding training stress. Most daily activities fall in this zone. You should feel completely comfortable and able to sing while exercising here.
          </p>

          <h3>Zone 2: Aerobic Base (60–70% Max HR)</h3>
          <p>
            The foundation of endurance fitness. Zone 2 training improves mitochondrial density, fat oxidation capacity, and cardiovascular efficiency. Elite endurance athletes spend <strong>70–80% of total training time</strong> in this zone. You should be able to maintain a full conversation. It feels &ldquo;easy&rdquo; — and that is the point. The adaptations happen at a cellular level over weeks and months of consistent Zone 2 work.
          </p>

          <h3>Zone 3: Tempo (70–80% Max HR)</h3>
          <p>
            Moderate effort sometimes called the &ldquo;gray zone&rdquo; or &ldquo;no man&apos;s land&rdquo; — too hard to be easy, too easy to produce the specific adaptations of Zones 4–5. Useful for marathoners training at goal race pace and for moderate-intensity fitness workouts. Conversation is possible but in short phrases. Limit time here unless it serves a specific training purpose.
          </p>

          <h3>Zone 4: Threshold (80–90% Max HR)</h3>
          <p>
            Hard effort near your lactate threshold — the intensity above which lactate accumulation begins to outpace clearance. Training here improves your body&apos;s ability to tolerate and clear lactate, raising the speed or power you can sustain for 20–60 minutes. Intervals of 4–20 minutes at Zone 4 are a cornerstone of performance-focused training plans.
          </p>

          <h3>Zone 5: Maximum (90–100% Max HR)</h3>
          <p>
            All-out effort targeting VO₂max — the maximum rate at which your body can consume oxygen. Sessions here last 30 seconds to 5 minutes (with full recovery between efforts). Zone 5 training improves anaerobic capacity, speed, and power. Due to the extreme stress, it should comprise no more than 5–10% of weekly training volume. Conversation is impossible.
          </p>

          <h2>Training Distribution: The 80/20 Rule</h2>
          <p>
            Research on elite endurance athletes consistently shows that the most effective training distribution is <strong>polarized</strong>: approximately 80% of training volume at low intensity (Zones 1–2) and 20% at high intensity (Zones 4–5), with minimal time in Zone 3. A 2014 study by Stöggl and Sperlich in <em>Frontiers in Physiology</em> found that polarized training produced greater improvements in VO₂max, time to exhaustion, and body composition than threshold-focused or high-intensity-only approaches. This principle applies to recreational athletes as well — most people train too hard on easy days and too easy on hard days.
          </p>

          <h2>Using Heart Rate Zones with Wearable Devices</h2>
          <p>
            Modern fitness watches (Garmin, Apple Watch, WHOOP, Polar) use optical heart rate sensors to provide real-time zone feedback during exercise. To get the most from your device:
          </p>
          <ul>
            <li><strong>Update your max HR and resting HR</strong> in device settings — most default to 220 minus age, which can be 10+ BPM off</li>
            <li><strong>Use a chest strap</strong> for interval training — wrist-based sensors lag during rapid HR changes</li>
            <li><strong>Calibrate zones</strong> using the values from this calculator for more accurate training feedback</li>
            <li><strong>Track time-in-zone</strong> weekly to ensure you follow the 80/20 distribution</li>
          </ul>

          <h2>Sources and Scientific References</h2>
          <ul>
            <li>Tanaka, H., Monahan, K.D., & Seals, D.R. (2001). &ldquo;Age-predicted maximal heart rate revisited.&rdquo; <em>Journal of the American College of Cardiology</em>, 37(1), 153–156.</li>
            <li>Karvonen, M.J., Kentala, E., & Mustala, O. (1957). &ldquo;The effects of training on heart rate.&rdquo; <em>Annales Medicinae Experimentalis et Biologiae Fenniae</em>, 35, 307–315.</li>
            <li>Stöggl, T., & Sperlich, B. (2014). &ldquo;Polarized training has greater impact on key endurance variables than threshold, high intensity, or high volume training.&rdquo; <em>Frontiers in Physiology</em>, 5, 33.</li>
            <li>American College of Sports Medicine (2018). <em>ACSM&apos;s Guidelines for Exercise Testing and Prescription</em> (10th ed.).</li>
            <li>Carey, D.G. (2009). &ldquo;Quantifying differences in the &apos;fat burning&apos; zone and the aerobic zone: implications for training.&rdquo; <em>Journal of Strength and Conditioning Research</em>, 23(7), 2090–2095.</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* ── Age Input ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Your Age
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            min="10"
            max="100"
            className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* ── Resting Heart Rate ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Resting Heart Rate (BPM)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={restingHR}
            onChange={(e) => setRestingHR(e.target.value)}
            placeholder="e.g., 65"
            min="30"
            max="120"
            className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Measure in the morning before getting out of bed. Required for Karvonen method.
          </p>
        </div>

        {/* ── Custom Max HR Toggle ── */}
        <div className="rounded-lg border border-border p-4 bg-muted/20">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomMax}
              onChange={(e) => setUseCustomMax(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">
              I know my actual max heart rate
            </span>
          </label>
          {useCustomMax && (
            <input
              type="number"
              inputMode="numeric"
              value={customMaxHR}
              onChange={(e) => setCustomMaxHR(e.target.value)}
              placeholder="Enter max HR (e.g., 195)"
              min="100"
              max="230"
              className="mt-3 w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          )}
        </div>

        {/* ── Calculation Method ── */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            Calculation Method
          </label>
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMethod("karvonen")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                method === "karvonen"
                  ? "bg-white dark:bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Karvonen (Recommended)
            </button>
            <button
              onClick={() => setMethod("standard")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                method === "standard"
                  ? "bg-white dark:bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Standard % of Max HR
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        {results && (
          <div className="space-y-4">
            {/* Max HR summary */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
              <div className="p-3 rounded-xl bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Maximum Heart Rate</p>
                <p className="text-2xl font-bold text-foreground">{results.maxHR} BPM</p>
                {method === "karvonen" && results.hrReserve > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Heart Rate Reserve: {results.hrReserve} BPM (using {method === "karvonen" ? "Karvonen" : "Standard"} method)
                  </p>
                )}
              </div>
            </div>

            {/* Zone cards */}
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Your 5 Training Zones
            </h3>

            <div className="space-y-3">
              {results.zones.map((zone) => (
                <div
                  key={zone.number}
                  className={`rounded-xl border border-border overflow-hidden ${zone.bgColor}`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg bg-white/80 dark:bg-background/80 ${zone.color}`}>
                          {zone.icon}
                        </div>
                        <div>
                          <span className={`text-xs font-medium uppercase tracking-wide ${zone.color}`}>
                            Zone {zone.number}
                          </span>
                          <h4 className="text-sm font-semibold text-foreground">{zone.name}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">
                          {zone.minBPM}–{zone.maxBPM}
                        </p>
                        <p className="text-xs text-muted-foreground">BPM</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{zone.description}</p>
                    {/* Visual bar */}
                    <div className="mt-2 h-2 rounded-full bg-white/50 dark:bg-background/30 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${zone.maxPct}%`,
                          background: `linear-gradient(90deg, transparent, currentColor)`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{zone.minPct}%</span>
                      <span className="text-xs text-muted-foreground">{zone.maxPct}% of max HR</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Training tip */}
            <div className="rounded-xl border border-border bg-muted/30 p-5">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recommended Weekly Distribution
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zone 1–2 (Easy)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[80%] rounded-full bg-green-500" />
                    </div>
                    <span className="font-medium text-foreground w-10 text-right">80%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zone 3 (Moderate)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[5%] rounded-full bg-yellow-500" />
                    </div>
                    <span className="font-medium text-foreground w-10 text-right">~5%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zone 4–5 (Hard)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[15%] rounded-full bg-red-500" />
                    </div>
                    <span className="font-medium text-foreground w-10 text-right">~15%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Based on the polarized training model used by elite endurance athletes (Stöggl & Sperlich, 2014).
              </p>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-border bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Heart rate zones are estimates based on population averages. Individual variation is significant (±10–12 BPM). For the most accurate zones, consult a sports medicine professional for a laboratory-based maximal exercise test. Always consult your doctor before starting a new exercise program.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
