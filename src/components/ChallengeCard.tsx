import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Check, X, Share2, Coins } from "lucide-react";
import { challenges, motivationalQuotes, Challenge } from "@/data/challenges";
import { Confetti } from "./Confetti";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ChallengeCard() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    // Load custom challenges
    const saved = localStorage.getItem("customChallenges");
    if (saved) {
      setCustomChallenges(JSON.parse(saved));
    }

    // Load today's challenge
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem("dailyChallenge");
    if (savedDaily) {
      const data = JSON.parse(savedDaily);
      if (data.date === today) {
        setCurrentChallenge(data.challenge);
        return;
      }
    }
    
    // Generate new challenge if none for today
    getNewChallenge();
  }, []);

  const getNewChallenge = () => {
    const allChallenges = [...challenges, ...customChallenges];
    const randomChallenge = allChallenges[Math.floor(Math.random() * allChallenges.length)];
    setCurrentChallenge(randomChallenge);
    
    const today = new Date().toDateString();
    localStorage.setItem("dailyChallenge", JSON.stringify({
      date: today,
      challenge: randomChallenge,
    }));
  };

  const handleComplete = async () => {
    if (!currentChallenge) return;

    setShowConfetti(true);
    
    // Save to database if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        const { error } = await supabase.from("challenge_completions").insert({
          user_id: user.id,
          challenge_text: currentChallenge.text,
          challenge_category: currentChallenge.category,
          points_earned: 10,
        });

        if (error) throw error;
        toast.success("🎉 +10 points earned!");
      } catch (error: any) {
        console.error("Error saving challenge:", error);
      }
    }
    
    // Update streak
    const saved = localStorage.getItem("challengeStreak");
    const today = new Date().toDateString();
    
    if (saved) {
      const data = JSON.parse(saved);
      const lastDate = new Date(data.lastCompleted).toDateString();
      
      if (lastDate !== today) {
        const newStreak = {
          count: data.count + 1,
          lastCompleted: new Date().toISOString(),
        };
        localStorage.setItem("challengeStreak", JSON.stringify(newStreak));
        
        // Show motivational quote
        const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        toast.success(quote);
      }
    } else {
      localStorage.setItem("challengeStreak", JSON.stringify({
        count: 1,
        lastCompleted: new Date().toISOString(),
      }));
      toast.success("Great start! 🎉");
    }

    setTimeout(() => {
      setShowConfetti(false);
      window.location.reload();
    }, 2000);
  };

  const handleAddCustom = () => {
    if (!customText.trim()) return;
    
    const newChallenge: Challenge = {
      id: Date.now(),
      text: customText,
      category: "fun",
      emoji: "✨",
    };

    const updated = [...customChallenges, newChallenge];
    setCustomChallenges(updated);
    localStorage.setItem("customChallenges", JSON.stringify(updated));
    
    setCustomText("");
    setIsAddingCustom(false);
    toast.success("Challenge added! 🎉");
  };

  const handleShare = async () => {
    const text = `Today's challenge: ${currentChallenge?.emoji} ${currentChallenge?.text}\n\nJoin me at Challenge Me!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Challenge copied to clipboard! 📋");
    }
  };

  return (
    <>
      <Confetti show={showConfetti} />
      
      <Card className="glass-card p-8 space-y-6 max-w-2xl w-full bounce-in">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Your challenge for today is...
          </h2>
          
          {currentChallenge && (
            <div className="space-y-4 fade-up">
              <div className="text-7xl mb-4">{currentChallenge.emoji}</div>
              <p className="text-3xl font-bold leading-relaxed">
                {currentChallenge.text}
              </p>
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {currentChallenge.category}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={getNewChallenge}
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Get New Challenge
          </Button>
          
          <Button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            variant="outline"
            size="lg"
            className="rounded-full border-2 hover:bg-primary/5"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Custom
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            size="lg"
            className="rounded-full border-2 hover:bg-secondary/5"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>

        {isAddingCustom && (
          <div className="space-y-3 pt-4 border-t fade-up">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your custom challenge..."
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-card"
              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            />
            <Button onClick={handleAddCustom} className="w-full rounded-xl">
              Add Challenge
            </Button>
          </div>
        )}

        <div className="space-y-3 pt-6 border-t">
          <p className="text-center font-semibold text-lg">Did you complete it?</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleComplete}
              size="lg"
              className="rounded-full bg-success hover:bg-success/90 hover:scale-105 transition-all"
            >
              <Check className="mr-2 h-5 w-5" />
              Yes! 🎉
            </Button>
            <Button
              onClick={() => toast.info("No worries! You can try again tomorrow 💪")}
              variant="outline"
              size="lg"
              className="rounded-full border-2"
            >
              <X className="mr-2 h-5 w-5" />
              Not Yet
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
