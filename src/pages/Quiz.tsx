import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { gkQuestions, mathQuestions } from "@/data/quizData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const Quiz = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  const questions = type === "gk" ? gkQuestions : mathQuestions;
  const gameType = type === "gk" ? "General Knowledge" : "Mathematics";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        saveScore();
      }
    }, 1000);
  };

  const saveScore = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from("scores").insert({
        user_id: user.id,
        game_type: type === "gk" ? "general_knowledge" : "mathematics",
        score: score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0),
        total_questions: questions.length,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error saving score:", error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Quiz Complete! 🎉</CardTitle>
            <CardDescription className="text-center text-lg">
              You scored {score} out of {questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={(score / questions.length) * 100} className="h-2" />
            <div className="flex gap-2">
              <Button onClick={resetQuiz} className="flex-1">
                Try Again
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                Back Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{gameType} Quiz</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {questions.length}
            </CardDescription>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">{questions[currentQuestion].question}</h2>
            <div className="grid gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  variant={
                    selectedAnswer === index
                      ? index === questions[currentQuestion].correctAnswer
                        ? "default"
                        : "destructive"
                      : "outline"
                  }
                  className="h-auto py-3 text-left justify-start"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
