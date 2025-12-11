import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const PercentageCalculator = () => {
  const navigate = useNavigate();
  
  // What is X% of Y?
  const [percentOf, setPercentOf] = useState({ percent: "", value: "" });
  const percentOfResult = percentOf.percent && percentOf.value
    ? (parseFloat(percentOf.percent) / 100) * parseFloat(percentOf.value)
    : null;

  // X is what % of Y?
  const [whatPercent, setWhatPercent] = useState({ value: "", total: "" });
  const whatPercentResult = whatPercent.value && whatPercent.total && parseFloat(whatPercent.total) !== 0
    ? (parseFloat(whatPercent.value) / parseFloat(whatPercent.total)) * 100
    : null;

  // Percentage increase/decrease from X to Y
  const [change, setChange] = useState({ from: "", to: "" });
  const changeResult = change.from && change.to && parseFloat(change.from) !== 0
    ? ((parseFloat(change.to) - parseFloat(change.from)) / parseFloat(change.from)) * 100
    : null;

  // Increase/Decrease X by Y%
  const [adjustBy, setAdjustBy] = useState({ value: "", percent: "" });
  const adjustByResult = adjustBy.value && adjustBy.percent
    ? parseFloat(adjustBy.value) * (1 + parseFloat(adjustBy.percent) / 100)
    : null;

  const formatNumber = (num: number | null) => {
    if (num === null) return "—";
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className="min-h-screen">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-start">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary mb-4">
              <Percent className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
            <p className="text-muted-foreground">Calculate percentages quickly and easily</p>
          </div>

          <Tabs defaultValue="percent-of" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1 bg-muted/50 p-1">
              <TabsTrigger value="percent-of" className="text-xs sm:text-sm">X% of Y</TabsTrigger>
              <TabsTrigger value="what-percent" className="text-xs sm:text-sm">X is ?% of Y</TabsTrigger>
              <TabsTrigger value="change" className="text-xs sm:text-sm">% Change</TabsTrigger>
              <TabsTrigger value="adjust" className="text-xs sm:text-sm">Adjust by %</TabsTrigger>
            </TabsList>

            <TabsContent value="percent-of" className="mt-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">What is X% of Y?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="percent-of-percent">Percentage</Label>
                      <Input
                        id="percent-of-percent"
                        type="number"
                        placeholder="e.g. 25"
                        value={percentOf.percent}
                        onChange={(e) => setPercentOf({ ...percentOf, percent: e.target.value })}
                      />
                    </div>
                    <span className="mt-6 text-muted-foreground">% of</span>
                    <div className="flex-1">
                      <Label htmlFor="percent-of-value">Value</Label>
                      <Input
                        id="percent-of-value"
                        type="number"
                        placeholder="e.g. 200"
                        value={percentOf.value}
                        onChange={(e) => setPercentOf({ ...percentOf, value: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">Result</p>
                    <p className="text-3xl font-bold gradient-text">{formatNumber(percentOfResult)}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="what-percent" className="mt-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">X is what % of Y?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="what-percent-value">Value</Label>
                      <Input
                        id="what-percent-value"
                        type="number"
                        placeholder="e.g. 50"
                        value={whatPercent.value}
                        onChange={(e) => setWhatPercent({ ...whatPercent, value: e.target.value })}
                      />
                    </div>
                    <span className="mt-6 text-muted-foreground">is ?% of</span>
                    <div className="flex-1">
                      <Label htmlFor="what-percent-total">Total</Label>
                      <Input
                        id="what-percent-total"
                        type="number"
                        placeholder="e.g. 200"
                        value={whatPercent.total}
                        onChange={(e) => setWhatPercent({ ...whatPercent, total: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">Result</p>
                    <p className="text-3xl font-bold gradient-text">
                      {whatPercentResult !== null ? `${formatNumber(whatPercentResult)}%` : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="change" className="mt-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Percentage Change</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="change-from">From</Label>
                      <Input
                        id="change-from"
                        type="number"
                        placeholder="e.g. 100"
                        value={change.from}
                        onChange={(e) => setChange({ ...change, from: e.target.value })}
                      />
                    </div>
                    <span className="mt-6 text-muted-foreground">→</span>
                    <div className="flex-1">
                      <Label htmlFor="change-to">To</Label>
                      <Input
                        id="change-to"
                        type="number"
                        placeholder="e.g. 150"
                        value={change.to}
                        onChange={(e) => setChange({ ...change, to: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">Change</p>
                    <p className={`text-3xl font-bold ${changeResult !== null ? (changeResult >= 0 ? 'text-success' : 'text-destructive') : 'gradient-text'}`}>
                      {changeResult !== null ? `${changeResult >= 0 ? '+' : ''}${formatNumber(changeResult)}%` : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adjust" className="mt-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Increase/Decrease by Percentage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="adjust-value">Value</Label>
                      <Input
                        id="adjust-value"
                        type="number"
                        placeholder="e.g. 100"
                        value={adjustBy.value}
                        onChange={(e) => setAdjustBy({ ...adjustBy, value: e.target.value })}
                      />
                    </div>
                    <span className="mt-6 text-muted-foreground">±</span>
                    <div className="flex-1">
                      <Label htmlFor="adjust-percent">Percent</Label>
                      <Input
                        id="adjust-percent"
                        type="number"
                        placeholder="e.g. 20 or -20"
                        value={adjustBy.percent}
                        onChange={(e) => setAdjustBy({ ...adjustBy, percent: e.target.value })}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Use negative numbers for decrease (e.g., -20 for 20% decrease)</p>
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-1">Result</p>
                    <p className="text-3xl font-bold gradient-text">{formatNumber(adjustByResult)}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PercentageCalculator;
