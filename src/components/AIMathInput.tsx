import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";
import { Sparkles, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIMathInputProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

interface MathResult {
  result: number;
  expression: string;
  explanation: string;
  error?: string;
}

const AIMathInput = ({ onResult, onClose }: AIMathInputProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MathResult | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("ai-math", {
        body: { query: query.trim() }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast({
          title: "Could not calculate",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("AI Math error:", err);
      toast({
        title: "Error",
        description: "Failed to process your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const useResult = () => {
    if (result?.result !== undefined) {
      onResult(String(result.result));
    }
  };

  const examples = [
    "what is 20% of 500?",
    "15% tip on $47.50",
    "square root of 144",
    "5000 at 7% interest for 3 years"
  ];

  return (
    <Card className="glass-card p-3 sm:p-4 border-0 animate-fade-in">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <RainbowText text="AI Calculator" />
        </h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask any math question..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 text-sm h-9"
            disabled={loading}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !query.trim()}
            className="shrink-0 h-9 w-9 p-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          </Button>
        </div>

        {/* Examples */}
        <div className="grid grid-cols-2 gap-1">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="text-[10px] sm:text-xs px-2 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors truncate text-left"
              title={example}
            >
              {example}
            </button>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-background/50 rounded-xl p-2 sm:p-3 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate flex-1">{result.expression}</span>
              <Button size="sm" variant="outline" onClick={useResult} className="h-6 text-[10px] sm:text-xs shrink-0">
                Use
              </Button>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              <RainbowNumber value={String(result.result)} />
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{result.explanation}</p>
          </div>
        )}

        <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
          Ask in plain English - AI calculates for you!
        </p>
      </div>
    </Card>
  );
};

export default AIMathInput;
