import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { triviaFacts } from "@/data/quizData";
import { ArrowLeft, RefreshCw } from "lucide-react";

const Trivia = () => {
  const navigate = useNavigate();
  const [currentFact, setCurrentFact] = useState("");

  useEffect(() => {
    getRandomFact();
  }, []);

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * triviaFacts.length);
    setCurrentFact(triviaFacts[randomIndex]);
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
            <CardTitle>Fun Trivia</CardTitle>
            <CardDescription>Did you know?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">{currentFact}</p>
            <Button onClick={getRandomFact} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Show Another Fact
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trivia;
