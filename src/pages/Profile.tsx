import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);

      const { data: scoresData } = await supabase
        .from("scores")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const gameStats = scoresData?.reduce((acc: any, score: any) => {
        if (!acc[score.game_type]) {
          acc[score.game_type] = { total: 0, best: 0, count: 0 };
        }
        acc[score.game_type].total += score.score;
        acc[score.game_type].count += 1;
        acc[score.game_type].best = Math.max(acc[score.game_type].best, score.score);
        return acc;
      }, {});

      setStats(gameStats || {});
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              {profile?.username || user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Statistics</CardTitle>
            <CardDescription>Your performance across games</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(stats).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats).map(([gameType, data]: [string, any]) => (
                  <div key={gameType} className="border rounded-lg p-4">
                    <h3 className="font-semibold capitalize mb-2">
                      {gameType.replace("_", " ")}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Games Played</p>
                        <p className="text-lg font-bold">{data.count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Best Score</p>
                        <p className="text-lg font-bold">{data.best}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Average</p>
                        <p className="text-lg font-bold">
                          {(data.total / data.count).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No games played yet!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
