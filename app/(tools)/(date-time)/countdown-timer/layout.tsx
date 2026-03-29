import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countdown Timer - Create Timers for Events & Deadlines",
  description:
    "Free countdown timer to create customizable timers for events, deadlines, holidays, and special occasions. Track time remaining in days, hours, minutes, and seconds.",
  keywords: [
    "countdown timer",
    "event countdown",
    "deadline timer",
    "days until",
    "time remaining",
    "countdown clock",
  ],
  openGraph: {
    title: "Countdown Timer - Create Timers for Events & Deadlines",
    description: "Create countdown timers for any event, deadline, or special occasion.",
    type: "website",
  },
};

export default function CountdownTimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
