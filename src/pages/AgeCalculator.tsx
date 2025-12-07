import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Cake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AgeCalculator = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: number;
  } | null>(null);

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
    if (day && month && year) {
      calculateAge();
    } else {
      setResult(null);
    }
  }, [day, month, year]);

  const calculateAge = () => {
    const birthDate = new Date(parseInt(year), parseInt(month), parseInt(day));
    const today = new Date();

    if (birthDate > today) {
      setResult(null);
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days lived
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate days until next birthday
    let nextBirthday = new Date(today.getFullYear(), parseInt(month), parseInt(day));
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, parseInt(month), parseInt(day));
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthday: daysUntilBirthday,
    });
  };

  const getDaysInMonth = (monthIndex: string, yearValue: string) => {
    if (!monthIndex || !yearValue) return 31;
    return new Date(parseInt(yearValue), parseInt(monthIndex) + 1, 0).getDate();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  const daysInMonth = getDaysInMonth(month, year || currentYear.toString());
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysArray.map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m, i) => (
                      <SelectItem key={m} value={i.toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {result && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your Age</p>
                  <p className="text-3xl font-bold text-primary">
                    {result.years} years, {result.months} months, {result.days} days
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Days Lived</p>
                    <p className="text-2xl font-bold text-foreground">
                      {result.totalDays.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Cake className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Next Birthday</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.nextBirthday} days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgeCalculator;
