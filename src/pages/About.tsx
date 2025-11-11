import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, Heart, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 right-10 text-6xl opacity-20 float-animation">🎨</div>
      <div className="absolute bottom-20 left-20 text-6xl opacity-20 float-animation" style={{ animationDelay: "1s" }}>💡</div>
      <div className="absolute top-1/2 left-10 text-6xl opacity-20 float-animation" style={{ animationDelay: "2s" }}>🌟</div>

      <div className="w-full max-w-3xl space-y-8 relative z-10">
        <header className="flex items-center justify-between fade-up">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
        </header>

        <Card className="glass-card p-8 md:p-12 space-y-8 bounce-in">
          <div className="text-center space-y-4">
            <Sparkles className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-5xl font-bold gradient-text">About Challenge Me</h1>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-center text-xl text-muted-foreground">
              Making your day brighter — one small action at a time.
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex gap-4 items-start">
                <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    Challenge Me was built to help you grow through small, daily actions. Whether you're improving your fitness, creativity, kindness, or mindfulness — each challenge helps you become a little better every day.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Heart className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl mb-2">Why Daily Challenges?</h3>
                  <p className="text-muted-foreground">
                    Small, consistent actions create lasting change. By completing one challenge each day, you build positive habits, discover new experiences, and create momentum that transforms your life.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Zap className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-xl mb-2">How It Works</h3>
                  <p className="text-muted-foreground">
                    Every day, get a new random challenge from categories like fitness, creativity, kindness, mindfulness, and fun. Complete it, track your streak, and watch yourself grow. You can even add your own custom challenges!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t text-center space-y-3">
              <p className="text-muted-foreground">
                Built with 💜 using{" "}
                <a 
                  href="https://lovable.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Lovable
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                A passion project to spread positivity and growth, one challenge at a time.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link to="/">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Challenge
              </Button>
            </Link>
          </div>
        </Card>

        <footer className="text-center text-muted-foreground text-sm fade-up pb-8">
          Keep challenging yourself 🌻
        </footer>
      </div>
    </div>
  );
};

export default About;
