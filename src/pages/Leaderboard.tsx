import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy } from "lucide-react";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboards, setLeaderboards] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      const { data: scores } = await supabase
        .from("scores")
        .select("*, profiles(username)")
        .order("score", { ascending: false });

      const gameTypes = ["general_knowledge", "mathematics", "memory"];
      const boards: any = {};

      gameTypes.forEach((type) => {
        boards[type] = scores
          ?.filter((s) => s.game_type === type)
          .slice(0, 10) || [];
      });

      setLeaderboards(boards);
    } catch (error) {
      console.error("Error loading leaderboards:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const renderLeaderboard = (scores: any[]) => (
    <div className="space-y-2">
      {scores.length > 0 ? (
        scores.map((score, index) => (
          <div
            key={score.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                {index === 0 ? (
                  <Trophy className="h-4 w-4 text-primary" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <span className="font-medium">
                {score.profiles?.username || "Anonymous"}
              </span>
            </div>
            <span className="text-lg font-bold">{score.score}</span>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">No scores yet!</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Leaderboards
            </CardTitle>
            <CardDescription>Top players across all games</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general_knowledge">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general_knowledge">GK</TabsTrigger>
                <TabsTrigger value="mathematics">Math</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
              </TabsList>
              <TabsContent value="general_knowledge" className="mt-4">
                {renderLeaderboard(leaderboards.general_knowledge)}
              </TabsContent>
              <TabsContent value="mathematics" className="mt-4">
                {renderLeaderboard(leaderboards.mathematics)}
              </TabsContent>
              <TabsContent value="memory" className="mt-4">
                {renderLeaderboard(leaderboards.memory)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
