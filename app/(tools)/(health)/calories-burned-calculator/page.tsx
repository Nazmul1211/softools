"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  Flame,
  Activity,
  Timer,
  Scale,
  Heart,
  Dumbbell,
  Info,
  Bike,
  Footprints,
} from "lucide-react";

// MET values for various activities (Metabolic Equivalent of Task)
const ACTIVITIES = [
  // Cardio
  { category: "Cardio", name: "Running (6 mph / 10 min/mile)", met: 9.8, icon: "run" },
  { category: "Cardio", name: "Running (7.5 mph / 8 min/mile)", met: 12.3, icon: "run" },
  { category: "Cardio", name: "Running (10 mph / 6 min/mile)", met: 14.5, icon: "run" },
  { category: "Cardio", name: "Jogging (5 mph)", met: 7.0, icon: "run" },
  { category: "Cardio", name: "Walking (3.5 mph, brisk)", met: 4.3, icon: "walk" },
  { category: "Cardio", name: "Walking (2.5 mph, leisurely)", met: 3.0, icon: "walk" },
  { category: "Cardio", name: "Cycling (12-14 mph, moderate)", met: 8.0, icon: "bike" },
  { category: "Cardio", name: "Cycling (14-16 mph, vigorous)", met: 10.0, icon: "bike" },
  { category: "Cardio", name: "Cycling (stationary, moderate)", met: 7.0, icon: "bike" },
  { category: "Cardio", name: "Swimming (freestyle, moderate)", met: 5.8, icon: "swim" },
  { category: "Cardio", name: "Swimming (freestyle, vigorous)", met: 9.8, icon: "swim" },
  { category: "Cardio", name: "Jump Rope (moderate)", met: 11.8, icon: "jump" },
  { category: "Cardio", name: "Rowing Machine (moderate)", met: 7.0, icon: "row" },
  { category: "Cardio", name: "Elliptical Trainer", met: 5.0, icon: "elliptical" },
  { category: "Cardio", name: "Stair Climbing", met: 8.8, icon: "stairs" },
  { category: "Cardio", name: "HIIT (High Intensity)", met: 12.0, icon: "hiit" },
  
  // Strength Training
  { category: "Strength", name: "Weight Lifting (general)", met: 6.0, icon: "weights" },
  { category: "Strength", name: "Weight Lifting (vigorous)", met: 8.0, icon: "weights" },
  { category: "Strength", name: "Circuit Training", met: 8.0, icon: "circuit" },
  { category: "Strength", name: "Bodyweight Exercises", met: 5.0, icon: "bodyweight" },
  { category: "Strength", name: "CrossFit", met: 12.0, icon: "crossfit" },
  { category: "Strength", name: "Kettlebell Workout", met: 9.8, icon: "kettlebell" },
  
  // Sports
  { category: "Sports", name: "Basketball (game)", met: 8.0, icon: "basketball" },
  { category: "Sports", name: "Soccer (game)", met: 10.0, icon: "soccer" },
  { category: "Sports", name: "Tennis (singles)", met: 8.0, icon: "tennis" },
  { category: "Sports", name: "Tennis (doubles)", met: 6.0, icon: "tennis" },
  { category: "Sports", name: "Golf (walking, carrying clubs)", met: 4.3, icon: "golf" },
  { category: "Sports", name: "Volleyball (recreational)", met: 4.0, icon: "volleyball" },
  { category: "Sports", name: "Boxing (sparring)", met: 7.8, icon: "boxing" },
  { category: "Sports", name: "Martial Arts", met: 10.3, icon: "martial" },
  
  // Flexibility & Mind-Body
  { category: "Flexibility", name: "Yoga (hatha)", met: 2.5, icon: "yoga" },
  { category: "Flexibility", name: "Yoga (power/vinyasa)", met: 4.0, icon: "yoga" },
  { category: "Flexibility", name: "Pilates", met: 3.0, icon: "pilates" },
  { category: "Flexibility", name: "Stretching", met: 2.3, icon: "stretch" },
  { category: "Flexibility", name: "Tai Chi", met: 3.0, icon: "taichi" },
  
  // Daily Activities
  { category: "Daily", name: "Housework (general)", met: 3.5, icon: "house" },
  { category: "Daily", name: "Gardening", met: 4.0, icon: "garden" },
  { category: "Daily", name: "Dancing (social)", met: 4.5, icon: "dance" },
  { category: "Daily", name: "Dancing (aerobic)", met: 7.3, icon: "dance" },
  { category: "Daily", name: "Playing with Kids (active)", met: 5.8, icon: "kids" },
  { category: "Daily", name: "Standing Work", met: 2.3, icon: "stand" },
  { category: "Daily", name: "Sitting (desk work)", met: 1.3, icon: "sit" },
];

type WeightUnit = "lb" | "kg";

function calculateCaloriesBurned(
  weightKg: number,
  met: number,
  durationMinutes: number
): number {
  // Calories = MET × weight(kg) × duration(hours)
  const durationHours = durationMinutes / 60;
  return met * weightKg * durationHours;
}

function lbToKg(lb: number): number {
  return lb * 0.453592;
}

export default function CaloriesBurnedCalculatorPage() {
  const [weight, setWeight] = useState(154);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lb");
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITIES[0]);
  const [duration, setDuration] = useState(30);

  const weightKg = weightUnit === "lb" ? lbToKg(weight) : weight;

  const caloriesBurned = useMemo(() => {
    return calculateCaloriesBurned(weightKg, selectedActivity.met, duration);
  }, [weightKg, selectedActivity.met, duration]);

  const caloriesPerMinute = caloriesBurned / duration;
  const caloriesPerHour = caloriesBurned * (60 / duration);

  // Calculate comparison activities
  const walkingTime = useMemo(() => {
    const walkingMet = 3.0;
    return (caloriesBurned / (walkingMet * weightKg)) * 60;
  }, [caloriesBurned, weightKg]);

  const runningTime = useMemo(() => {
    const runningMet = 9.8;
    return (caloriesBurned / (runningMet * weightKg)) * 60;
  }, [caloriesBurned, weightKg]);

  // Group activities by category
  const groupedActivities = useMemo(() => {
    const groups: Record<string, typeof ACTIVITIES> = {};
    ACTIVITIES.forEach((activity) => {
      if (!groups[activity.category]) {
        groups[activity.category] = [];
      }
      groups[activity.category].push(activity);
    });
    return groups;
  }, []);

  return (
    <ToolLayout
      title="Calories Burned Calculator"
      description="Calculate how many calories you burn during exercise and daily activities. Enter your weight, choose an activity, and see accurate calorie estimates based on MET values."
      category={{ name: "Health & Fitness", slug: "health-fitness" }}
      relatedTools={[
        { name: "Calorie Calculator", href: "/calorie-calculator/" },
        { name: "TDEE Calculator", href: "/tdee-calculator/" },
        { name: "BMR Calculator", href: "/bmr-calculator/" },
        { name: "Macro Calculator", href: "/macro-calculator/" },
      ]}
      howToSteps={[
        { name: "Enter Your Weight", text: "Input your body weight in pounds or kilograms." },
        { name: "Select Activity", text: "Choose from 40+ activities organized by category." },
        { name: "Set Duration", text: "Enter how long you performed the activity." },
        { name: "View Results", text: "See calories burned with comparisons and insights." },
      ]}
      faqs={[
        {
          question: "How are calories burned calculated?",
          answer: "We use MET (Metabolic Equivalent of Task) values from exercise science research. The formula is: Calories = MET × weight(kg) × duration(hours). MET represents the energy cost of an activity relative to rest.",
        },
        {
          question: "Are these calorie estimates accurate?",
          answer: "MET-based calculations provide reasonable estimates, but actual calories burned vary based on fitness level, intensity, terrain, and individual metabolism. Use these as guidelines rather than exact figures.",
        },
        {
          question: "What is a MET value?",
          answer: "MET (Metabolic Equivalent of Task) measures energy expenditure. A MET of 1 equals resting metabolism. An activity with MET of 5 burns 5x more calories than sitting still. Higher MET = more intense activity.",
        },
        {
          question: "Do heavier people burn more calories?",
          answer: "Yes, heavier individuals burn more calories doing the same activity because more energy is required to move greater mass. This is why the calculator factors in your body weight.",
        },
        {
          question: "How many calories should I burn per workout?",
          answer: "This depends on your goals. For general fitness, 200-400 calories per session is common. For weight loss, aim for 300-500+ calories. For maintenance, match your calorie burn to your intake goals. Consistency matters more than any single workout.",
        },
        {
          question: "Does muscle mass affect calories burned?",
          answer: "Yes, people with more muscle mass tend to burn slightly more calories during the same activity. However, the MET formula primarily accounts for total body weight. For precise tracking, consider using a heart rate monitor.",
        },
        {
          question: "Which exercises burn the most calories?",
          answer: "High-intensity activities like running, swimming, jump rope, and HIIT typically burn the most calories per minute. However, the best exercise is one you'll do consistently. Even walking adds up significantly over time.",
        },
        {
          question: "Should I eat back the calories I burn?",
          answer: "It depends on your goals. For weight loss, create a moderate deficit but don't starve yourself. For maintenance or muscle building, you may want to eat back most exercise calories. Listen to your body and adjust based on energy levels and results.",
        },
      ]}
      content={
        <>
          <h2>Understanding Calories Burned During Exercise</h2>
          <p>
            When you exercise, your body burns calories to fuel muscle contractions, increase heart rate, and maintain body temperature. The number of calories burned depends on several factors: your body weight, the intensity of the activity, and how long you exercise. This calculator uses scientifically-derived MET values to provide accurate estimates for over 40 different activities.
          </p>
          <p>
            Understanding your calorie expenditure helps with weight management, workout planning, and nutrition timing. Whether you're trying to lose weight, maintain fitness, or fuel performance, knowing how many calories different activities burn empowers you to make informed decisions about exercise and eating.
          </p>

          <h2>What Are MET Values?</h2>
          <p>
            MET stands for Metabolic Equivalent of Task and represents the energy cost of activities. One MET equals the energy you burn at rest—approximately 1 calorie per kilogram of body weight per hour. Activities are assigned MET values based on research measuring oxygen consumption during exercise.
          </p>
          <p>
            Low-intensity activities like walking have MET values around 3-4, meaning they burn 3-4 times more calories than resting. High-intensity activities like running or HIIT can have MET values of 10-14, dramatically increasing calorie burn. By knowing MET values, you can compare the efficiency of different workouts.
          </p>

          <h2>Maximizing Calorie Burn</h2>
          <p>
            To burn more calories, you can increase intensity, duration, or frequency of exercise. High-Intensity Interval Training (HIIT) is particularly effective because it maintains elevated metabolism even after the workout ends—a phenomenon called excess post-exercise oxygen consumption (EPOC) or the "afterburn effect."
          </p>
          <p>
            Building muscle through strength training also boosts long-term calorie burn because muscle tissue is metabolically active. A combination of cardio for immediate calorie burn and strength training for metabolic boost creates an effective fitness strategy.
          </p>

          <h2>Calorie Burn by Activity Category</h2>
          <p>
            Different types of exercise offer varying calorie-burning potential. Cardiovascular exercises like running, cycling, and swimming typically burn the most calories per minute due to their sustained high heart rate. A 150-pound person running at 6 mph burns approximately 680 calories per hour, while swimming burns around 500 calories per hour.
          </p>
          <p>
            Strength training burns fewer calories during the workout itself but offers metabolic benefits that persist for hours afterward. The muscle damage and repair process requires energy, and having more lean muscle mass increases your resting metabolic rate. Sports like basketball, tennis, and soccer combine cardio and strength elements, providing well-rounded calorie expenditure.
          </p>

          <h2>Daily Activities and NEAT</h2>
          <p>
            Non-Exercise Activity Thermogenesis (NEAT) refers to calories burned through daily activities that aren't formal exercise—walking, climbing stairs, doing housework, even fidgeting. NEAT can account for 15-30% of your total daily calorie expenditure and is often overlooked in weight management strategies.
          </p>
          <p>
            Simple changes like taking stairs instead of elevators, walking during phone calls, or standing at your desk can significantly increase daily calorie burn. For sedentary office workers, increasing NEAT may be as impactful as adding formal exercise sessions.
          </p>

          <h2>Using Calorie Data for Weight Goals</h2>
          <p>
            Weight management fundamentally comes down to energy balance—calories consumed versus calories burned. To lose one pound of body weight, you need a cumulative deficit of approximately 3,500 calories. This can be achieved through reduced food intake, increased exercise, or ideally a combination of both.
          </p>
          <p>
            Tracking calories burned helps you understand your energy expenditure and make informed decisions about nutrition. However, avoid obsessing over exact numbers. Use this calculator as a guide for planning workouts and understanding the relative intensity of different activities, not as a precise accounting system.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Activity className="h-5 w-5 text-primary" />
            Calculate Your Calories Burned
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Weight Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Body Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={50}
                  max={500}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                  className="rounded-lg border border-border bg-background px-2 py-2 text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="lb">lb</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            {/* Duration Input */}
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={480}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Activity Select */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Activity
              </label>
              <select
                value={ACTIVITIES.findIndex((a) => a.name === selectedActivity.name)}
                onChange={(e) => setSelectedActivity(ACTIVITIES[Number(e.target.value)])}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              >
                {Object.entries(groupedActivities).map(([category, activities]) => (
                  <optgroup key={category} label={category}>
                    {activities.map((activity, idx) => (
                      <option key={activity.name} value={ACTIVITIES.findIndex((a) => a.name === activity.name)}>
                        {activity.name} (MET: {activity.met})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm text-muted-foreground">Calories Burned</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(caloriesBurned)}
            </p>
            <p className="text-xs text-muted-foreground">in {duration} minutes</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">Per Minute</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {caloriesPerMinute.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">calories/min</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Scale className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground">Per Hour</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(caloriesPerHour)}
            </p>
            <p className="text-xs text-muted-foreground">calories/hour</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mb-2 flex justify-center">
              <Dumbbell className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground">MET Value</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {selectedActivity.met}
            </p>
            <p className="text-xs text-muted-foreground">intensity level</p>
          </div>
        </div>

        {/* Activity Info */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Heart className="h-5 w-5 text-primary" />
            Activity Details: {selectedActivity.name}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Time Equivalents</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Footprints className="h-4 w-4 text-primary" />
                  <span>
                    <strong>{Math.round(walkingTime)} min</strong> of walking (leisurely) to burn the same calories
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>
                    <strong>{Math.round(runningTime)} min</strong> of running (6 mph) to burn the same calories
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Food Equivalents</p>
              <ul className="space-y-2 text-sm">
                <li>
                  🍎 <strong>{(caloriesBurned / 95).toFixed(1)}</strong> medium apples
                </li>
                <li>
                  🍕 <strong>{(caloriesBurned / 285).toFixed(1)}</strong> slices of pizza
                </li>
                <li>
                  🍫 <strong>{(caloriesBurned / 210).toFixed(1)}</strong> chocolate bars
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/5 p-3">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              {selectedActivity.met >= 6 ? (
                <span>
                  <strong className="text-foreground">{selectedActivity.name}</strong> is a <strong className="text-orange-600 dark:text-orange-400">vigorous-intensity</strong> activity. It's excellent for cardiovascular health and calorie burning. Make sure to warm up properly.
                </span>
              ) : selectedActivity.met >= 3 ? (
                <span>
                  <strong className="text-foreground">{selectedActivity.name}</strong> is a <strong className="text-blue-600 dark:text-blue-400">moderate-intensity</strong> activity. Great for everyday fitness and sustainable calorie burn.
                </span>
              ) : (
                <span>
                  <strong className="text-foreground">{selectedActivity.name}</strong> is a <strong className="text-emerald-600 dark:text-emerald-400">light-intensity</strong> activity. Good for recovery days or adding movement throughout your day.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-4">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Quick Reference: Calories Burned in 30 Minutes
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Based on your weight of {weight} {weightUnit}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pt-2 pr-4 pl-2 font-medium text-muted-foreground">Activity</th>
                  <th className="pb-2 pt-2 pr-4 font-medium text-muted-foreground">MET</th>
                  <th className="pb-2 pt-2 pr-2 text-right font-medium text-muted-foreground">Calories (30 min)</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITIES.slice(0, 15).map((activity) => {
                  const calories = calculateCaloriesBurned(weightKg, activity.met, 30);
                  return (
                    <tr key={activity.name} className="border-b border-border/50">
                      <td className="py-2 pr-4 pl-2 text-foreground">{activity.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{activity.met}</td>
                      <td className="py-2 pr-2 text-right font-medium text-orange-600 dark:text-orange-400">
                        {Math.round(calories)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
