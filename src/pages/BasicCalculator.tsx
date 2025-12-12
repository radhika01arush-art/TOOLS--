import { useState } from "react";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";
import SEO from "@/components/SEO";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Basic Calculator",
  "description": "Free online calculator for basic arithmetic operations. Add, subtract, multiply, divide with decimals and percentages.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any"
};

const BasicCalculator = () => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const buttonClass = "h-16 text-xl font-medium rounded-2xl transition-all duration-200 hover:scale-105";

  return (
    <div className="min-h-screen">
      <SEO
        title="Basic Calculator - Free Online Calculator"
        description="Free online basic calculator for quick arithmetic. Perform addition, subtraction, multiplication, division with decimals and percentage calculations."
        keywords="basic calculator, online calculator, free calculator, arithmetic calculator, math calculator"
        structuredData={structuredData}
      />
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-sm mx-auto">
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
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold"><RainbowText text="Calculator" /></span>
            </div>
            <div className="w-10" />
          </header>

          <Card className="glass-card p-4 border-0">
            {/* Display */}
            <div className="bg-background/50 rounded-2xl p-4 mb-4">
              <div className="text-right text-4xl font-bold truncate">
                <RainbowNumber value={display} />
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button variant="secondary" className={buttonClass} onClick={clear}>C</Button>
              <Button variant="secondary" className={buttonClass} onClick={toggleSign}>±</Button>
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

              <Button variant="outline" className={`${buttonClass} col-span-2`} onClick={() => inputDigit("0")}>0</Button>
              <Button variant="outline" className={buttonClass} onClick={inputDecimal}>.</Button>
              <Button className={`${buttonClass} bg-accent hover:bg-accent/90`} onClick={handleEquals}>=</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BasicCalculator;
