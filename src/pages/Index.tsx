import { ThemeToggle } from "@/components/ThemeToggle";
import { ChallengeCard } from "@/components/ChallengeCard";
import { StreakTracker } from "@/components/StreakTracker";
import { AdSense } from "@/components/AdSense";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 float-animation">✨</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 float-animation" style={{ animationDelay: "1s" }}>⭐</div>
      <div className="absolute top-1/3 right-10 text-6xl opacity-20 float-animation" style={{ animationDelay: "2s" }}>💫</div>
      
      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Header */}
        <header className="text-center space-y-3 fade-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ThemeToggle />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold gradient-text flex items-center justify-center gap-3">
            <Sparkles className="h-12 w-12 text-primary" />
            Challenge Me
          </h1>
          <p className="text-xl text-muted-foreground">
            One fun challenge every day
          </p>
        </header>

        {/* Main Challenge Card */}
        <ChallengeCard />

        {/* Streak Tracker */}
        <StreakTracker />

        {/* AdSense - Below Content */}
        <div className="flex justify-center py-4">
          <AdSense 
            adSlot="1234567890"
            adFormat="auto"
            className="max-w-2xl w-full"
          />
        </div>

        {/* Footer */}
        <footer className="text-center space-y-4 pt-8 fade-up">
          <p className="text-lg text-muted-foreground italic">
            Small actions. Big growth. Keep challenging yourself 🌻
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors underline">
              About
            </Link>
            <span>•</span>
            <span>Developed with 💜 using Lovable</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
