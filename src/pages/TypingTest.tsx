import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon.",
  "Programming is the art of telling a computer what to do through a sequence of instructions.",
  "Success is not final and failure is not fatal. It is the courage to continue that counts.",
  "Technology has revolutionized the way we communicate and share information globally.",
  "The journey of a thousand miles begins with a single step forward into the unknown.",
];

const TypingTest = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    resetTest();
  }, []);

  const resetTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    inputRef.current?.focus();
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    setUserInput(value);

    if (value === text) {
      setEndTime(Date.now());
      setIsComplete(true);
    }
  }, [text, startTime]);

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordCount = text.split(" ").length;
    return Math.round(wordCount / timeInMinutes);
  };

  const calculateAccuracy = () => {
    if (userInput.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) correct++;
    }
    return Math.round((correct / userInput.length) * 100);
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-muted-foreground";
      if (index < userInput.length) {
        className = userInput[index] === char ? "text-green-500" : "text-red-500 bg-red-500/20";
      }
      if (index === userInput.length) {
        className += " border-l-2 border-primary animate-pulse";
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetTest}>
            <RotateCcw className="h-5 w-5" />
          </Button>
        </header>

        <Card className="p-6 mb-6">
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{isComplete ? calculateWPM() : "--"}</p>
              <p className="text-xs text-muted-foreground">WPM</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{calculateAccuracy()}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{userInput.length}/{text.length}</p>
              <p className="text-xs text-muted-foreground">Characters</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 mb-6 font-mono text-lg leading-relaxed">
            {renderText()}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isComplete}
            className="w-full p-4 rounded-lg border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start typing..."
            autoFocus
          />
        </Card>

        {isComplete && (
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-bold text-primary mb-2">Complete!</h2>
            <p className="text-muted-foreground mb-4">
              {calculateWPM()} WPM with {calculateAccuracy()}% accuracy
            </p>
            <Button onClick={resetTest}>Try Again</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TypingTest;
