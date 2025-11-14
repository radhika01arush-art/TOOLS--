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
      color: "text-blue-500"
    },
    {
      title: "Mathematics",
      description: "Challenge your math skills",
      icon: Calculator,
      path: "/quiz/mathematics",
      color: "text-green-500"
    },
    {
      title: "Memory Game",
      description: "Match the emoji pairs",
      icon: Grid3x3,
      path: "/memory",
      color: "text-purple-500"
    },
    {
      title: "Trivia Facts",
      description: "Learn interesting facts",
      icon: Lightbulb,
      path: "/trivia",
      color: "text-yellow-500"
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
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            Challenge Me
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your skills with fun games and challenges
          </p>
        </header>

        {/* Leaderboard Link */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate("/leaderboard")} size="lg">
            <Trophy className="mr-2 h-5 w-5" />
            View Leaderboard
          </Button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {games.map((game) => (
            <Card key={game.path} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(game.path)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <game.icon className={`h-8 w-8 ${game.color}`} />
                  <CardTitle>{game.title}</CardTitle>
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Play Now</Button>
              </CardContent>
            </Card>
          ))}
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
        <footer className="text-center space-y-4 pt-8 pb-8">
          <p className="text-lg text-muted-foreground italic">
            Small actions. Big growth. Keep challenging yourself 🌻
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors underline">
              About
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-primary transition-colors underline">
              Privacy Policy
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
