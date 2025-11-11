import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface StreakData {
  count: number;
  lastCompleted: string;
}

export function StreakTracker() {
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastCompleted: "" });

  useEffect(() => {
    const saved = localStorage.getItem("challengeStreak");
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      const lastDate = new Date(data.lastCompleted).toDateString();
      
      // Reset streak if more than 1 day has passed
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastDate !== today && lastDate !== yesterdayString) {
        setStreak({ count: 0, lastCompleted: "" });
        localStorage.setItem("challengeStreak", JSON.stringify({ count: 0, lastCompleted: "" }));
      } else {
        setStreak(data);
      }
    }
  }, []);

  const getMilestone = (count: number) => {
    if (count >= 30) return { emoji: "🌈", text: "Legend Mode!" };
    if (count >= 7) return { emoji: "💪", text: "Strong!" };
    if (count >= 3) return { emoji: "🏅", text: "Getting it!" };
    return { emoji: "🔥", text: "Keep going!" };
  };

  const milestone = getMilestone(streak.count);

  return (
    <Card className="glass-card p-6 text-center space-y-3">
      <div className="text-6xl mb-2 float-animation">{milestone.emoji}</div>
      <h3 className="text-2xl font-bold gradient-text">
        {streak.count} Day Streak
      </h3>
      <p className="text-muted-foreground text-sm">{milestone.text}</p>
      
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${Math.min((streak.count / 30) * 100, 100)}%` }}
        />
      </div>
    </Card>
  );
}
