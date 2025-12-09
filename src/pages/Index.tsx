import { ThemeToggle } from "@/components/ThemeToggle";
import { Calculator, Percent, TrendingUp, Calendar, Scale, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const tools = [
  {
    title: "Unit Converter",
    icon: Calculator,
    path: "/unit-converter",
    gradient: "from-primary to-accent",
  },
  {
    title: "Percentage Calculator",
    icon: Percent,
    path: "/percentage-calculator",
    gradient: "from-secondary to-primary",
  },
  {
    title: "Profit & Loss",
    icon: TrendingUp,
    path: "/profit-loss-calculator",
    gradient: "from-accent to-success",
  },
  {
    title: "Age Calculator",
    icon: Calendar,
    path: "/age-calculator",
    gradient: "from-primary to-secondary",
  },
  {
    title: "BMI Calculator",
    icon: Scale,
    path: "/bmi-calculator",
    gradient: "from-success to-accent",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold gradient-text">Daily Tools</span>
            </div>
            <ThemeToggle />
          </header>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {tools.map((tool, index) => (
              <Card
                key={tool.path}
                className="group glass-card p-6 cursor-pointer hover:scale-[1.03] transition-all duration-300 hover:shadow-xl border-0 overflow-hidden relative"
                onClick={() => navigate(tool.path)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground">{tool.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
