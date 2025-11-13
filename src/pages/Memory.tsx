import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const emojis = ["🎮", "🎯", "🎪", "🎨", "🎭", "🎬", "🎸", "🎺"];

const Memory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => emoji);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setIsComplete(true);
          saveScore();
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  const saveScore = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from("scores").insert({
        user_id: user.id,
        game_type: "memory",
        score: moves,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error saving score:", error);
    }
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Memory Game</CardTitle>
            <CardDescription>
              {isComplete ? `Complete! Moves: ${moves}` : `Moves: ${moves}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card, index) => (
                <Button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className="h-20 text-3xl"
                  variant="outline"
                  disabled={matched.includes(index)}
                >
                  {flipped.includes(index) || matched.includes(index) ? card : "?"}
                </Button>
              ))}
            </div>
            <Button onClick={initializeGame} className="w-full">
              New Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Memory;
