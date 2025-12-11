import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, Calculator, DollarSign } from "lucide-react";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";

const ProfitLossCalculator = () => {
  const navigate = useNavigate();

  // Profit/Loss Amount
  const [costPrice1, setCostPrice1] = useState("");
  const [sellingPrice1, setSellingPrice1] = useState("");
  const [plResult, setPlResult] = useState<{ amount: number; type: string; percentage: number } | null>(null);

  // Selling Price Calculator
  const [costPrice2, setCostPrice2] = useState("");
  const [desiredProfit, setDesiredProfit] = useState("");
  const [spResult, setSpResult] = useState<number | null>(null);

  // Cost Price Calculator
  const [sellingPrice3, setSellingPrice3] = useState("");
  const [profitPercent3, setProfitPercent3] = useState("");
  const [cpResult, setCpResult] = useState<number | null>(null);

  // Markup vs Margin
  const [cost4, setCost4] = useState("");
  const [markup4, setMarkup4] = useState("");
  const [marginResult, setMarginResult] = useState<{ sellingPrice: number; margin: number } | null>(null);

  const calculateProfitLoss = () => {
    const cp = parseFloat(costPrice1);
    const sp = parseFloat(sellingPrice1);
    if (isNaN(cp) || isNaN(sp) || cp <= 0) return;

    const amount = sp - cp;
    const percentage = ((sp - cp) / cp) * 100;
    const type = amount >= 0 ? "Profit" : "Loss";

    setPlResult({ amount: Math.abs(amount), type, percentage: Math.abs(percentage) });
  };

  const calculateSellingPrice = () => {
    const cp = parseFloat(costPrice2);
    const profit = parseFloat(desiredProfit);
    if (isNaN(cp) || isNaN(profit) || cp <= 0) return;

    const sp = cp + (cp * profit) / 100;
    setSpResult(sp);
  };

  const calculateCostPrice = () => {
    const sp = parseFloat(sellingPrice3);
    const profit = parseFloat(profitPercent3);
    if (isNaN(sp) || isNaN(profit)) return;

    const cp = (sp * 100) / (100 + profit);
    setCpResult(cp);
  };

  const calculateMarkupMargin = () => {
    const cost = parseFloat(cost4);
    const markup = parseFloat(markup4);
    if (isNaN(cost) || isNaN(markup) || cost <= 0) return;

    const sellingPrice = cost + (cost * markup) / 100;
    const margin = ((sellingPrice - cost) / sellingPrice) * 100;

    setMarginResult({ sellingPrice, margin });
  };

  return (
    <div className="min-h-screen">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-success/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-start">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-success mb-4">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold"><RainbowText text="Profit & Loss Calculator" /></h1>
            <p className="text-muted-foreground">
              <RainbowText text="Calculate profit, loss, margins, and pricing for your business" />
            </p>
          </div>

          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Calculations
              </CardTitle>
              <CardDescription>
                Choose the type of calculation you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profit-loss" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50">
                  <TabsTrigger value="profit-loss">Profit/Loss</TabsTrigger>
                  <TabsTrigger value="selling-price">Selling Price</TabsTrigger>
                  <TabsTrigger value="cost-price">Cost Price</TabsTrigger>
                  <TabsTrigger value="markup-margin">Markup/Margin</TabsTrigger>
                </TabsList>

                <TabsContent value="profit-loss" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Calculate profit or loss from cost and selling price
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cp1">Cost Price</Label>
                      <Input
                        id="cp1"
                        type="number"
                        placeholder="Enter cost price"
                        value={costPrice1}
                        onChange={(e) => setCostPrice1(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sp1">Selling Price</Label>
                      <Input
                        id="sp1"
                        type="number"
                        placeholder="Enter selling price"
                        value={sellingPrice1}
                        onChange={(e) => setSellingPrice1(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateProfitLoss} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  {plResult && (
                    <div className={`p-4 rounded-xl ${plResult.type === "Profit" ? "bg-success/10" : "bg-destructive/10"}`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {plResult.type === "Profit" ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                        <span className={`text-xl font-bold ${plResult.type === "Profit" ? "text-success" : "text-destructive"}`}>
                          {plResult.type}
                        </span>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-2xl font-bold"><span className="text-colorful-success">$</span><RainbowNumber value={plResult.amount.toFixed(2)} /></p>
                        <p className="text-muted-foreground">
                          <RainbowNumber value={plResult.percentage.toFixed(2)} /><span className="text-colorful-accent">%</span> {plResult.type.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="selling-price" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Calculate selling price for a desired profit percentage
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cp2">Cost Price</Label>
                      <Input
                        id="cp2"
                        type="number"
                        placeholder="Enter cost price"
                        value={costPrice2}
                        onChange={(e) => setCostPrice2(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profit2">Desired Profit %</Label>
                      <Input
                        id="profit2"
                        type="number"
                        placeholder="Enter profit percentage"
                        value={desiredProfit}
                        onChange={(e) => setDesiredProfit(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateSellingPrice} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Selling Price
                  </Button>
                  {spResult !== null && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-center">
                      <p className="text-sm mb-1"><RainbowText text="Selling Price" /></p>
                      <p className="text-3xl font-bold"><span className="text-colorful-success">$</span><RainbowNumber value={spResult.toFixed(2)} /></p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cost-price" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Calculate cost price from selling price and profit percentage
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sp3">Selling Price</Label>
                      <Input
                        id="sp3"
                        type="number"
                        placeholder="Enter selling price"
                        value={sellingPrice3}
                        onChange={(e) => setSellingPrice3(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profit3">Profit %</Label>
                      <Input
                        id="profit3"
                        type="number"
                        placeholder="Enter profit percentage"
                        value={profitPercent3}
                        onChange={(e) => setProfitPercent3(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateCostPrice} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Cost Price
                  </Button>
                  {cpResult !== null && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-center">
                      <p className="text-sm mb-1"><RainbowText text="Cost Price" /></p>
                      <p className="text-3xl font-bold"><span className="text-colorful-success">$</span><RainbowNumber value={cpResult.toFixed(2)} /></p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="markup-margin" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Convert markup percentage to profit margin
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost4">Cost Price</Label>
                      <Input
                        id="cost4"
                        type="number"
                        placeholder="Enter cost price"
                        value={cost4}
                        onChange={(e) => setCost4(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="markup4">Markup %</Label>
                      <Input
                        id="markup4"
                        type="number"
                        placeholder="Enter markup percentage"
                        value={markup4}
                        onChange={(e) => setMarkup4(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={calculateMarkupMargin} className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  {marginResult && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm mb-1"><RainbowText text="Selling Price" /></p>
                          <p className="text-2xl font-bold"><span className="text-colorful-success">$</span><RainbowNumber value={marginResult.sellingPrice.toFixed(2)} /></p>
                        </div>
                        <div>
                          <p className="text-sm mb-1"><RainbowText text="Profit Margin" /></p>
                          <p className="text-2xl font-bold"><RainbowNumber value={marginResult.margin.toFixed(2)} /><span className="text-colorful-accent">%</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ProfitLossCalculator;
