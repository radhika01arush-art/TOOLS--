import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, LogOut, Calculator, Percent, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const tools = [
  {
    title: "Unit Converter",
    icon: Calculator,
    path: "/unit-converter",
  },
  {
    title: "Percentage Calculator",
    icon: Percent,
    path: "/percentage-calculator",
  },
  {
    title: "Profit & Loss",
    icon: TrendingUp,
    path: "/profit-loss-calculator",
  },
  {
    title: "Time Converter",
    icon: Clock,
    path: "/time-converter",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-end gap-3 mb-12">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card
              key={tool.path}
              className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200 group"
              onClick={() => navigate(tool.path)}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="font-semibold text-foreground">{tool.title}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          © 2024 Daily Tools
        </footer>
      </div>
    </div>
  );
};

export default Index;
