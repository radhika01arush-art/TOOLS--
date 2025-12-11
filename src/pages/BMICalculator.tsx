import { useState } from "react";
import { ArrowLeft, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";

const BMICalculator = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const calculateBMI = () => {
    let bmi = 0;
    
    if (unit === "metric") {
      const h = parseFloat(height) / 100; // cm to m
      const w = parseFloat(weight);
      if (h > 0 && w > 0) {
        bmi = w / (h * h);
      }
    } else {
      const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      const w = parseFloat(weight);
      if (totalInches > 0 && w > 0) {
        bmi = (w / (totalInches * totalInches)) * 703;
      }
    }
    
    return bmi;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi === 0) return { label: "Enter values", color: "text-muted-foreground" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normal", color: "text-green-500" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
    return { label: "Obese", color: "text-red-500" };
  };

  const bmi = calculateBMI();
  const category = getBMICategory(bmi);

  return (
    <div className="min-h-screen">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-primary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold"><RainbowText text="BMI Calculator" /></span>
            </div>
            <div className="w-10" /> {/* Spacer for alignment */}
          </header>

          <Card className="glass-card p-6 border-0">
            <Tabs value={unit} onValueChange={(v) => setUnit(v as "metric" | "imperial")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="metric">Metric</TabsTrigger>
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
              </TabsList>

              <TabsContent value="metric" className="space-y-4">
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="imperial" className="space-y-4">
                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="5"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                    />
                    <span className="flex items-center text-muted-foreground">ft</span>
                    <Input
                      type="number"
                      placeholder="10"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                    />
                    <span className="flex items-center text-muted-foreground">in</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Weight (lbs)</Label>
                  <Input
                    type="number"
                    placeholder="154"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Result */}
            <div className="mt-8 text-center">
              <div className="text-5xl font-bold mb-2">
                {bmi > 0 ? <RainbowNumber value={bmi.toFixed(1)} /> : "—"}
              </div>
              <div className={`text-lg font-medium ${category.color}`}>
                <RainbowText text={category.label} />
              </div>
            </div>

            {/* BMI Scale */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-colorful-primary">Underweight</span>
                <span className="text-colorful-success">Normal</span>
                <span className="text-colorful-accent">Overweight</span>
                <span className="text-colorful-pink">Obese</span>
              </div>
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{"<18.5"}</span>
                <span>18.5-24.9</span>
                <span>25-29.9</span>
                <span>{"≥30"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
