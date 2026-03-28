"use client";

import { useState, useMemo } from "react";
import { ToolLayout, FAQItem } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Moon, Sun, Clock, Sunrise, RotateCcw, BedDouble, Coffee } from "lucide-react";

const faqs: FAQItem[] = [
  {
    question: "How long is a sleep cycle?",
    answer: "A complete sleep cycle lasts approximately 90 minutes and includes all stages of sleep: light sleep (stages 1-2), deep sleep (stage 3), and REM sleep. You typically go through 4-6 complete cycles per night. Waking at the end of a cycle (during light sleep) rather than in the middle of deep or REM sleep helps you feel more refreshed."
  },
  {
    question: "Why do I feel groggy even after 8 hours of sleep?",
    answer: "Feeling groggy after sleep, known as 'sleep inertia,' often occurs when you wake up during deep sleep or REM sleep rather than at the natural end of a sleep cycle. This calculator helps you time your sleep to complete full cycles and wake during the lighter stages of sleep, reducing that groggy feeling."
  },
  {
    question: "How much sleep do I actually need?",
    answer: "Sleep needs vary by age and individual. Adults typically need 7-9 hours per night, teenagers 8-10 hours, school-age children 9-12 hours, and toddlers 11-14 hours. However, quality matters as much as quantity—5-6 complete sleep cycles (7.5-9 hours) is often better than fragmented sleep of 9+ hours."
  },
  {
    question: "Does it matter what time I go to sleep?",
    answer: "Yes, timing matters due to your circadian rhythm. Deep sleep is most abundant early in the night, while REM sleep increases toward morning. Going to bed between 9pm and midnight typically optimizes this natural rhythm. Consistent sleep and wake times also help maintain a healthy circadian rhythm."
  },
  {
    question: "What's the best time to wake up?",
    answer: "The best wake time is at the end of a sleep cycle, typically during light sleep. Using this calculator, you can find wake times that align with completing 4-6 full cycles. The ideal specific time depends on your schedule and natural chronotype (whether you're a 'morning person' or 'night owl')."
  },
  {
    question: "How long does it take to fall asleep?",
    answer: "The average person takes about 10-20 minutes to fall asleep—this is called 'sleep latency.' This calculator accounts for approximately 15 minutes. If you regularly fall asleep in less than 5 minutes, you may be sleep deprived. If it takes more than 30 minutes, you may have insomnia or poor sleep habits."
  },
];

export default function SleepCalculator() {
  const [mode, setMode] = useState<"bedtime" | "waketime">("bedtime");
  const [wakeTime, setWakeTime] = useState<string>("07:00");
  const [bedtime, setBedtime] = useState<string>("23:00");
  const [fallAsleepTime, setFallAsleepTime] = useState<number>(15);

  const results = useMemo(() => {
    const cycleDuration = 90; // minutes
    const cycles = [6, 5, 4, 3]; // Target number of cycles

    if (mode === "bedtime") {
      // Calculate bedtimes based on desired wake time
      const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number);
      const wakeMins = wakeHours * 60 + wakeMinutes;
      
      return cycles.map(numCycles => {
        const sleepDuration = numCycles * cycleDuration;
        const totalMinutesBack = sleepDuration + fallAsleepTime;
        let bedMins = wakeMins - totalMinutesBack;
        
        // Handle day wrap
        if (bedMins < 0) bedMins += 24 * 60;
        
        const hours = Math.floor(bedMins / 60);
        const mins = bedMins % 60;
        
        return {
          time: `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`,
          cycles: numCycles,
          sleepHours: sleepDuration / 60,
          recommended: numCycles === 5 || numCycles === 6,
        };
      });
    } else {
      // Calculate wake times based on desired bedtime
      const [bedHours, bedMinutes] = bedtime.split(":").map(Number);
      const bedMins = bedHours * 60 + bedMinutes + fallAsleepTime;
      
      return cycles.map(numCycles => {
        const sleepDuration = numCycles * cycleDuration;
        let wakeMins = bedMins + sleepDuration;
        
        // Handle day wrap
        if (wakeMins >= 24 * 60) wakeMins -= 24 * 60;
        
        const hours = Math.floor(wakeMins / 60);
        const mins = wakeMins % 60;
        
        return {
          time: `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`,
          cycles: numCycles,
          sleepHours: sleepDuration / 60,
          recommended: numCycles === 5 || numCycles === 6,
        };
      });
    }
  }, [mode, wakeTime, bedtime, fallAsleepTime]);

  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const setToNow = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    if (mode === "waketime") {
      setBedtime(`${hours}:${minutes}`);
    }
  };

  return (
    <ToolLayout
      title="Sleep Calculator"
      description="Calculate optimal bedtimes and wake times based on 90-minute sleep cycles. Wake up feeling refreshed instead of groggy by timing your sleep to complete full cycles. Get personalized sleep schedules for better rest."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      lastUpdated="March 2026"
      faqs={faqs}
      relatedTools={[
        { name: "BMR Calculator", href: "/bmr-calculator" },
        { name: "BMI Calculator", href: "/bmi-calculator" },
        { name: "Calorie Calculator", href: "/calorie-calculator" },
        { name: "Age Calculator", href: "/age-calculator" },
        { name: "Due Date Calculator", href: "/due-date-calculator" },
      ]}
      content={
        <>
          <h2>Understanding Sleep Cycles</h2>
          <p>
            Sleep isn&apos;t a uniform state—it cycles through distinct stages throughout the night. Understanding these cycles is key to waking up refreshed rather than groggy. Each complete sleep cycle lasts approximately 90 minutes, and you typically experience 4-6 cycles per night.
          </p>

          <h2>The Four Stages of Sleep</h2>
          
          <h3>Stage 1: Light Sleep (NREM 1)</h3>
          <p>
            This is the transition phase between wakefulness and sleep, lasting 1-7 minutes. Your muscles relax, heart rate and breathing slow, and brain waves begin to slow from their daytime patterns. You can be easily awakened during this stage.
          </p>

          <h3>Stage 2: Light Sleep (NREM 2)</h3>
          <p>
            You spend about 50% of your total sleep time in this stage. Body temperature drops, heart rate slows further, and brain waves show specific patterns called sleep spindles and K-complexes. This stage is important for memory consolidation.
          </p>

          <h3>Stage 3: Deep Sleep (NREM 3)</h3>
          <p>
            Also called slow-wave sleep, this is the most restorative stage. Your body repairs tissues, builds bone and muscle, and strengthens the immune system. It&apos;s hardest to wake someone during deep sleep, and if awakened, you&apos;ll likely feel disoriented and groggy (sleep inertia).
          </p>

          <h3>REM Sleep (Stage 4)</h3>
          <p>
            REM (Rapid Eye Movement) sleep is when most dreaming occurs. Your brain is highly active, almost like when awake, but your muscles are temporarily paralyzed. REM sleep is crucial for memory, learning, and emotional processing. REM periods get longer as the night progresses.
          </p>

          <h2>How Sleep Cycles Progress Through the Night</h2>
          <p>
            The composition of each cycle changes as the night progresses:
          </p>
          <ul>
            <li><strong>Early cycles:</strong> More deep sleep, shorter REM periods</li>
            <li><strong>Later cycles:</strong> Less deep sleep, longer REM periods</li>
          </ul>
          <p>
            This is why going to bed earlier often leads to more restorative deep sleep, while sleeping in leads to more REM sleep and dreaming.
          </p>

          <h2>The Science of Sleep Inertia</h2>
          <p>
            Sleep inertia is that groggy, disoriented feeling when you wake up. It&apos;s more severe when you wake during deep sleep (stage 3) or REM sleep rather than during the lighter stages. This calculator helps you time your sleep so you wake during the natural transition between cycles, when you&apos;re in the lightest sleep.
          </p>
          <p>
            Sleep inertia can last from a few minutes to over an hour if you wake during deep sleep. By aligning your wake time with the end of a complete cycle, you minimize this effect.
          </p>

          <h2>How Much Sleep Do You Need?</h2>
          
          <h3>By Age Group</h3>
          <ul>
            <li><strong>Newborns (0-3 months):</strong> 14-17 hours</li>
            <li><strong>Infants (4-11 months):</strong> 12-15 hours</li>
            <li><strong>Toddlers (1-2 years):</strong> 11-14 hours</li>
            <li><strong>Preschoolers (3-5 years):</strong> 10-13 hours</li>
            <li><strong>School-age (6-13 years):</strong> 9-11 hours</li>
            <li><strong>Teenagers (14-17 years):</strong> 8-10 hours</li>
            <li><strong>Adults (18-64 years):</strong> 7-9 hours</li>
            <li><strong>Older adults (65+):</strong> 7-8 hours</li>
          </ul>

          <h3>Quality vs. Quantity</h3>
          <p>
            The number of complete sleep cycles matters as much as total hours. Five complete cycles (7.5 hours) often leaves you feeling better than 8 hours of fragmented sleep or 8 hours ending mid-cycle.
          </p>

          <h2>Tips for Better Sleep</h2>
          
          <h3>Sleep Hygiene Basics</h3>
          <ul>
            <li><strong>Consistent schedule:</strong> Wake and sleep at the same times daily, even on weekends</li>
            <li><strong>Dark environment:</strong> Use blackout curtains or an eye mask</li>
            <li><strong>Cool temperature:</strong> Keep bedroom between 60-67°F (15-19°C)</li>
            <li><strong>Limit blue light:</strong> Avoid screens 1-2 hours before bed</li>
            <li><strong>Avoid caffeine:</strong> No coffee, tea, or soda after 2pm</li>
            <li><strong>Limit alcohol:</strong> It may help you fall asleep but disrupts REM sleep</li>
          </ul>

          <h3>Creating a Sleep Routine</h3>
          <ul>
            <li>Wind down 30-60 minutes before bed</li>
            <li>Take a warm bath or shower (the temperature drop after helps trigger sleepiness)</li>
            <li>Read a physical book instead of screens</li>
            <li>Practice relaxation techniques or meditation</li>
            <li>Reserve the bed for sleep only (not work or TV)</li>
          </ul>

          <h2>Chronotypes: Morning Larks vs. Night Owls</h2>
          <p>
            Your chronotype is your natural preference for sleep timing:
          </p>
          <ul>
            <li><strong>Morning types (larks):</strong> Naturally wake early, most alert in the morning, prefer early bedtimes</li>
            <li><strong>Evening types (owls):</strong> Naturally stay up late, most alert in evening, prefer later bedtimes</li>
            <li><strong>Intermediate types:</strong> Fall somewhere in between, most adaptable</li>
          </ul>
          <p>
            While you can&apos;t completely change your chronotype, you can shift it somewhat with consistent sleep scheduling and light exposure.
          </p>

          <h2>When to See a Doctor</h2>
          <p>
            Consult a healthcare provider if you experience:
          </p>
          <ul>
            <li>Persistent difficulty falling or staying asleep</li>
            <li>Excessive daytime sleepiness despite adequate sleep time</li>
            <li>Loud snoring, gasping, or breathing pauses during sleep</li>
            <li>Restless legs or uncomfortable sensations at night</li>
            <li>Sleep issues affecting daily functioning</li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setMode("bedtime")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              mode === "bedtime"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="h-4 w-4" />
            Find Bedtime
          </button>
          <button
            onClick={() => setMode("waketime")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              mode === "waketime"
                ? "bg-white dark:bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="h-4 w-4" />
            Find Wake Time
          </button>
        </div>

        {/* Time Input */}
        {mode === "bedtime" ? (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
              <Sunrise className="h-4 w-4 text-primary" />
              I need to wake up at
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-primary" />
                I want to go to bed at
              </label>
              <button onClick={setToNow} className="text-xs text-primary hover:underline">
                Now
              </button>
            </div>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full rounded-lg border border-border bg-white dark:bg-muted/30 px-4 py-3 text-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {/* Fall Asleep Time */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Time to fall asleep (minutes)
          </label>
          <div className="flex gap-2">
            {[5, 10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => setFallAsleepTime(mins)}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  fallAsleepTime === mins
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {mode === "bedtime" ? "Suggested Bedtimes" : "Suggested Wake Times"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {mode === "bedtime"
              ? `To wake at ${formatTime(wakeTime)}, go to bed at one of these times:`
              : `If you go to bed at ${formatTime(bedtime)}, wake up at one of these times:`}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 transition-all ${
                  result.recommended
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatTime(result.time)}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.sleepHours} hours of sleep
                    </p>
                  </div>
                  {result.recommended && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {Array.from({ length: result.cycles }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-primary/60 border border-primary -ml-1 first:ml-0"
                        title="Sleep cycle"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{result.cycles} sleep cycles</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Cycle Visual */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-4">How Sleep Cycles Work</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-32 text-sm text-muted-foreground">90 min/cycle</div>
              <div className="flex-1 h-8 rounded-full overflow-hidden flex">
                <div className="w-1/5 bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-xs">Light</div>
                <div className="w-1/5 bg-blue-300 dark:bg-blue-800 flex items-center justify-center text-xs">Light</div>
                <div className="w-1/5 bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-xs text-white">Deep</div>
                <div className="w-1/5 bg-blue-300 dark:bg-blue-800 flex items-center justify-center text-xs">Light</div>
                <div className="w-1/5 bg-purple-400 dark:bg-purple-600 flex items-center justify-center text-xs text-white">REM</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Each cycle progresses through light sleep → deep sleep → light sleep → REM. 
              The best time to wake is during the light sleep phases between cycles.
            </p>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            Tips for Better Sleep
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Keep a consistent sleep schedule—even on weekends
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Avoid screens for 1-2 hours before bed (blue light blocks melatonin)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Keep your bedroom cool, dark, and quiet
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Avoid caffeine after 2pm and alcohol close to bedtime
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Get morning sunlight to help regulate your circadian rhythm
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
