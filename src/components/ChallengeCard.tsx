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
  const [isChallengeRevealed, setIsChallengeRevealed] = useState(false);

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
        setIsChallengeRevealed(data.revealed || false);
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
    setIsChallengeRevealed(false);
    
    const today = new Date().toDateString();
    localStorage.setItem("dailyChallenge", JSON.stringify({
      date: today,
      challenge: randomChallenge,
      revealed: false,
    }));
  };

  const handleRevealChallenge = () => {
    setIsChallengeRevealed(true);
    const today = new Date().toDateString();
    if (currentChallenge) {
      localStorage.setItem("dailyChallenge", JSON.stringify({
        date: today,
        challenge: currentChallenge,
        revealed: true,
      }));
    }
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
      
      <Card className="glass-card p-8 space-y-6 relative overflow-hidden border-2">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 text-9xl opacity-5 pointer-events-none">
          {isChallengeRevealed ? currentChallenge?.emoji : "🎁"}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Today's Challenge</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isChallengeRevealed && currentChallenge?.category && (
                <span className="capitalize">{currentChallenge.category}</span>
              )}
            </p>
          </div>
          {isChallengeRevealed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={getNewChallenge}
              className="hover:rotate-180 transition-transform duration-500"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Challenge Content */}
        {!isChallengeRevealed ? (
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-8 rounded-xl border-2 border-yellow-500/20 relative z-10 text-center space-y-4">
            <div className="text-6xl animate-bounce">🎁</div>
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">Ready for today's challenge?</p>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <Coins className="h-8 w-8 text-yellow-500" />
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  +10 XP
                </span>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleRevealChallenge}
              className="w-full text-lg font-semibold animate-pulse"
            >
              Claim Your Challenge
            </Button>
          </div>
        ) : (
          currentChallenge && (
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl border border-primary/10 relative z-10">
              <p className="text-xl font-medium text-center">
                {currentChallenge.emoji} {currentChallenge.text}
              </p>
            </div>
          )
        )}

        {/* Action Buttons */}
        {isChallengeRevealed && (
          <div className="flex gap-3 relative z-10">
            <Button 
              onClick={handleComplete}
              className="flex-1 text-lg font-semibold"
              size="lg"
            >
              <Check className="mr-2 h-5 w-5" />
              I Did It!
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Custom Challenge Section */}
        {isChallengeRevealed && (
          <div className="relative z-10">
            <Button
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              variant="ghost"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Challenge
            </Button>

            {isAddingCustom && (
              <div className="space-y-3 pt-4">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter your custom challenge..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary outline-none transition-colors bg-card"
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddCustom} className="flex-1">
                    Add Challenge
                  </Button>
                  <Button 
                    onClick={() => setIsAddingCustom(false)} 
                    variant="outline"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
