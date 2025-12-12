import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Calculator, History, Copy, Check, Trash2, FlaskConical, Keyboard, X, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import GraphPlotter from "@/components/GraphPlotter";
import AIMathInput from "@/components/AIMathInput";
interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Advanced Calculator with Graph Plotter & AI",
  "description": "Free online calculator with AI natural language input, graph plotting, history, memory functions, and scientific mode.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any"
};

const BasicCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("calc-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const addToHistory = (expr: string, res: string) => {
    const newItem: HistoryItem = {
      expression: expr,
      result: res,
      timestamp: new Date(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calc-history");
    toast({ title: "History cleared" });
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(display);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(prev => prev === "0" ? digit : prev + digit);
    }
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(prev => prev + ".");
    }
  }, [waitingForOperand, display]);

  const clear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const backspace = useCallback(() => {
    if (display.length === 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  }, [display]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(result);
      setExpression(`${result} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }, [display, previousValue, operator]);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = useCallback(() => {
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operator);
      const fullExpression = `${previousValue} ${operator} ${inputValue}`;
      addToHistory(fullExpression, String(result));
      setDisplay(String(result));
      setExpression("");
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [operator, previousValue, display]);

  const toggleSign = useCallback(() => {
    setDisplay(prev => String(parseFloat(prev) * -1));
  }, []);

  const percentage = useCallback(() => {
    setDisplay(prev => String(parseFloat(prev) / 100));
  }, []);

  // Scientific functions
  const scientificOperation = (op: string) => {
    const value = parseFloat(display);
    let result: number;
    
    switch (op) {
      case "sin": result = Math.sin(value * Math.PI / 180); break;
      case "cos": result = Math.cos(value * Math.PI / 180); break;
      case "tan": result = Math.tan(value * Math.PI / 180); break;
      case "√": result = Math.sqrt(value); break;
      case "x²": result = Math.pow(value, 2); break;
      case "x³": result = Math.pow(value, 3); break;
      case "log": result = Math.log10(value); break;
      case "ln": result = Math.log(value); break;
      case "1/x": result = 1 / value; break;
      case "π": result = Math.PI; break;
      case "e": result = Math.E; break;
      case "!": result = factorial(value); break;
      default: result = value;
    }
    
    addToHistory(`${op}(${value})`, String(result));
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  // Memory functions
  const memoryAdd = () => {
    setMemory(prev => prev + parseFloat(display));
    toast({ title: "Added to memory" });
  };

  const memorySubtract = () => {
    setMemory(prev => prev - parseFloat(display));
    toast({ title: "Subtracted from memory" });
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
    toast({ title: "Memory cleared" });
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDecimal();
      } else if (e.key === "+" || e.key === "-") {
        performOperation(e.key);
      } else if (e.key === "*") {
        performOperation("×");
      } else if (e.key === "/") {
        e.preventDefault();
        performOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        clear();
      } else if (e.key === "Backspace") {
        backspace();
      } else if (e.key === "%") {
        percentage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, handleEquals, clear, backspace, percentage]);

  const useHistoryItem = (item: HistoryItem) => {
    setDisplay(item.result);
    setShowHistory(false);
    setWaitingForOperand(true);
  };

  const handleAIResult = (result: string) => {
    setDisplay(result);
    setShowAI(false);
    setWaitingForOperand(true);
  };

  const buttonClass = "h-12 sm:h-14 text-base sm:text-lg font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95";
  const sciButtonClass = "h-10 sm:h-12 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95";

  return (
    <div className="min-h-screen">
      <SEO
        title="Advanced Calculator - Graph Plotter & AI Math | Free Online"
        description="Free online calculator with AI natural language input, graph plotting, scientific mode, history, and memory. Type questions like 'what is 20% of 500?' or plot y=x²."
        keywords="calculator, graphing calculator, AI calculator, scientific calculator, graph plotter, online calculator, math calculator, plot equations"
        structuredData={structuredData}
      />
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold"><RainbowText text="Calculator" /></span>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setShowAI(!showAI)}
                className={`p-2 rounded-xl transition-colors ${showAI ? 'bg-accent text-accent-foreground' : 'bg-primary/10 hover:bg-primary/20'}`}
                title="AI Calculator"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setShowGraph(!showGraph)}
                className={`p-2 rounded-xl transition-colors ${showGraph ? 'bg-accent text-accent-foreground' : 'bg-primary/10 hover:bg-primary/20'}`}
                title="Graph Plotter"
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setShowScientific(!showScientific)}
                className={`p-2 rounded-xl transition-colors ${showScientific ? 'bg-primary text-primary-foreground' : 'bg-primary/10 hover:bg-primary/20'}`}
                title="Scientific Mode"
              >
                <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-xl transition-colors ${showHistory ? 'bg-primary text-primary-foreground' : 'bg-primary/10 hover:bg-primary/20'}`}
                title="History"
              >
                <History className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </header>

          {/* AI Math Input */}
          {showAI && (
            <div className="mb-4">
              <AIMathInput onResult={handleAIResult} onClose={() => setShowAI(false)} />
            </div>
          )}

          {/* Graph Plotter */}
          {showGraph && (
            <div className="mb-4">
              <GraphPlotter onClose={() => setShowGraph(false)} />
            </div>
          )}

          {/* History Panel */}
          {showHistory && (
            <Card className="glass-card p-3 sm:p-4 border-0 mb-4 animate-fade-in max-h-64 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <RainbowText text="History" />
                </h3>
                <div className="flex gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                      title="Clear History"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No calculations yet</p>
                ) : (
                  history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => useHistoryItem(item)}
                      className="w-full p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <p className="text-xs text-muted-foreground truncate">{item.expression}</p>
                      <p className="text-sm font-semibold text-colorful-primary">= {item.result}</p>
                    </button>
                  ))
                )}
              </div>
            </Card>
          )}

          <Card className="glass-card p-3 sm:p-4 border-0">
            {/* Expression Display */}
            {expression && (
              <div className="text-right text-sm text-muted-foreground mb-1 px-2">
                {expression}
              </div>
            )}
            
            {/* Main Display */}
            <div className="bg-background/50 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {memory !== 0 && (
                    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">M</span>
                  )}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
              <div className="text-right text-3xl sm:text-4xl font-bold truncate mt-1">
                <RainbowNumber value={display} />
              </div>
            </div>

            {/* Memory Buttons */}
            <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Button variant="ghost" className="h-8 text-xs font-medium" onClick={memoryClear}>MC</Button>
              <Button variant="ghost" className="h-8 text-xs font-medium" onClick={memoryRecall}>MR</Button>
              <Button variant="ghost" className="h-8 text-xs font-medium" onClick={memoryAdd}>M+</Button>
              <Button variant="ghost" className="h-8 text-xs font-medium" onClick={memorySubtract}>M−</Button>
            </div>

            {/* Scientific Buttons */}
            {showScientific && (
              <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-3 animate-fade-in">
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("sin")}>sin</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("cos")}>cos</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("tan")}>tan</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("√")}>√</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("x²")}>x²</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("x³")}>x³</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("log")}>log</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("ln")}>ln</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("1/x")}>1/x</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("!")}>n!</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("π")}>π</Button>
                <Button variant="secondary" className={sciButtonClass} onClick={() => scientificOperation("e")}>e</Button>
              </div>
            )}

            {/* Main Buttons */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              <Button variant="secondary" className={buttonClass} onClick={clear}>C</Button>
              <Button variant="secondary" className={buttonClass} onClick={backspace}>⌫</Button>
              <Button variant="secondary" className={buttonClass} onClick={percentage}>%</Button>
              <Button className={`${buttonClass} bg-primary hover:bg-primary/90`} onClick={() => performOperation("÷")}>÷</Button>

              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("7")}>7</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("8")}>8</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("9")}>9</Button>
              <Button className={`${buttonClass} bg-primary hover:bg-primary/90`} onClick={() => performOperation("×")}>×</Button>

              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("4")}>4</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("5")}>5</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("6")}>6</Button>
              <Button className={`${buttonClass} bg-primary hover:bg-primary/90`} onClick={() => performOperation("-")}>−</Button>

              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("1")}>1</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("2")}>2</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("3")}>3</Button>
              <Button className={`${buttonClass} bg-primary hover:bg-primary/90`} onClick={() => performOperation("+")}>+</Button>

              <Button variant="outline" className={buttonClass} onClick={toggleSign}>±</Button>
              <Button variant="outline" className={buttonClass} onClick={() => inputDigit("0")}>0</Button>
              <Button variant="outline" className={buttonClass} onClick={inputDecimal}>.</Button>
              <Button className={`${buttonClass} bg-accent hover:bg-accent/90`} onClick={handleEquals}>=</Button>
            </div>

            {/* Keyboard hint */}
            <div className="flex items-center justify-center gap-1 mt-3 sm:mt-4 text-xs text-muted-foreground">
              <Keyboard className="h-3 w-3" />
              <span>Keyboard supported</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasicCalculator;
