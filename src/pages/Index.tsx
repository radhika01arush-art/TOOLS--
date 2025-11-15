import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdSense } from "@/components/AdSense";
import { Sparkles, Brain, Calculator, Grid3x3, Lightbulb, Trophy, User, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const games = [
    {
      title: "General Knowledge",
      description: "Test your knowledge across various topics",
      icon: Brain,
      path: "/quiz/general_knowledge",
      color: "text-primary"
    },
    {
      title: "Mathematics",
      description: "Challenge your math skills",
      icon: Calculator,
      path: "/quiz/mathematics",
      color: "text-accent"
    },
    {
      title: "Memory Game",
      description: "Match the emoji pairs",
      icon: Grid3x3,
      path: "/memory",
      color: "text-secondary"
    },
    {
      title: "Trivia Facts",
      description: "Learn interesting facts",
      icon: Lightbulb,
      path: "/trivia",
      color: "text-success"
    }
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">✨</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>⭐</div>
      <div className="absolute top-1/3 right-10 text-6xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}>💫</div>
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header with Auth */}
        <header className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
            <div className="flex gap-2">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => navigate("/auth")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold gradient-text flex items-center justify-center gap-4 mb-4">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            Challenge Me
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Essential Tools for Daily Life
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boost your skills with our collection of practical tools and engaging challenges
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/leaderboard")} size="lg" variant="outline" className="gap-2">
              <Trophy className="h-5 w-5" />
              Leaderboard
            </Button>
          </div>
        </header>

        {/* Games Grid */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground text-center">Available Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {games.map((game) => (
              <Card 
                key={game.path} 
                className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/50"
                onClick={() => navigate(game.path)}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform">
                      <game.icon className={`h-8 w-8 ${game.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {game.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium text-muted-foreground">
                    {game.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* AdSense */}
        <div className="flex justify-center py-8">
          <AdSense 
            adSlot="1234567890"
            adFormat="auto"
            className="max-w-2xl w-full"
          />
        </div>

        {/* Footer */}
        <footer className="text-center pt-4 space-y-3 border-t border-border/50 mt-8 pb-8">
          <p className="text-lg font-bold text-foreground">Small actions. Big growth. Keep challenging yourself 🌻</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link to="/about" className="font-semibold text-primary hover:text-accent transition-colors">
              About
            </Link>
            <span className="text-border">•</span>
            <Link to="/privacy" className="font-semibold text-primary hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">•</span>
            <p className="text-muted-foreground">
              Developed with <span className="text-destructive">💜</span> using <span className="font-semibold text-foreground">Lovable</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
