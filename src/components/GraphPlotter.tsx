import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RainbowText } from "@/components/RainbowText";
import { TrendingUp, AlertCircle } from "lucide-react";

interface GraphPlotterProps {
  onClose: () => void;
}

const GraphPlotter = ({ onClose }: GraphPlotterProps) => {
  const [equation, setEquation] = useState("x^2");
  const [xMin, setXMin] = useState("-10");
  const [xMax, setXMax] = useState("10");
  const [error, setError] = useState<string | null>(null);

  const evaluateExpression = (expr: string, x: number): number => {
    try {
      // Replace common math notation with JavaScript equivalents
      let jsExpr = expr
        .replace(/\^/g, "**")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/abs\(/g, "Math.abs(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/pi/gi, "Math.PI")
        .replace(/e(?![a-z])/gi, "Math.E");
      
      // Replace x with the value
      jsExpr = jsExpr.replace(/x/g, `(${x})`);
      
      // Evaluate safely
      const result = Function(`"use strict"; return (${jsExpr})`)();
      return typeof result === "number" && isFinite(result) ? result : NaN;
    } catch {
      return NaN;
    }
  };

  const data = useMemo(() => {
    setError(null);
    const min = parseFloat(xMin) || -10;
    const max = parseFloat(xMax) || 10;
    const step = (max - min) / 200;
    const points: { x: number; y: number | null }[] = [];
    
    let hasValidPoints = false;
    
    for (let x = min; x <= max; x += step) {
      const y = evaluateExpression(equation, x);
      if (!isNaN(y) && isFinite(y)) {
        points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
        hasValidPoints = true;
      } else {
        points.push({ x: parseFloat(x.toFixed(4)), y: null });
      }
    }
    
    if (!hasValidPoints) {
      setError("Invalid equation. Try: x^2, sin(x), 2*x+1");
    }
    
    return points;
  }, [equation, xMin, xMax]);

  const presets = [
    { label: "x²", value: "x^2" },
    { label: "sin(x)", value: "sin(x)" },
    { label: "cos(x)", value: "cos(x)" },
    { label: "x³", value: "x^3" },
    { label: "√x", value: "sqrt(x)" },
    { label: "1/x", value: "1/x" },
  ];

  return (
    <Card className="glass-card p-4 border-0 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <RainbowText text="Graph Plotter" />
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>

      <div className="space-y-3">
        {/* Equation input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">y = </label>
          <Input
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Enter equation (e.g., x^2, sin(x))"
            className="font-mono"
          />
        </div>

        {/* Preset equations */}
        <div className="flex flex-wrap gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={equation === preset.value ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setEquation(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Range inputs */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">X Min</label>
            <Input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">X Max</label>
            <Input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-destructive text-xs">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}

        {/* Graph */}
        <div className="h-64 w-full bg-background/50 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="x" 
                type="number" 
                domain={['dataMin', 'dataMax']}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <YAxis 
                type="number"
                domain={['auto', 'auto']}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [value?.toFixed(4), 'y']}
                labelFormatter={(label) => `x = ${label}`}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Supports: x^2, sin(x), cos(x), tan(x), sqrt(x), log(x), ln(x), pi, e
        </p>
      </div>
    </Card>
  );
};

export default GraphPlotter;
