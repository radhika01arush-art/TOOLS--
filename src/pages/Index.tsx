import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, User, LogOut, LogIn, Calculator, Percent } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
            Daily Tools Hub
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Essential Tools for Daily Life
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access powerful utilities designed to make your everyday tasks easier and more efficient
          </p>
        </header>

        {/* Tools Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Available Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50"
              onClick={() => navigate("/unit-converter")}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Unit Converter</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Convert between different units of measurement including length, weight, temperature, volume, speed, and area
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50"
              onClick={() => navigate("/percentage-calculator")}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Percent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Percentage Calculator</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Calculate percentages easily - find X% of Y, percentage change, and more
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground space-y-4 mt-16 pb-8">
          <div className="flex justify-center gap-6 flex-wrap">
            <Link to="/about" className="hover:text-foreground transition-colors font-bold">
              About
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors font-bold">
              Privacy Policy
            </Link>
          </div>
          <p className="font-bold text-sm">
            © 2024 Daily Tools Hub. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
