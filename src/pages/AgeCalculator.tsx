import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Cake, PartyPopper, Calendar } from "lucide-react";
import { Confetti } from "@/components/Confetti";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";
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
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
  } | null>(null);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMinutes: number;
  } | null>(null);
  const [nextBirthdayDate, setNextBirthdayDate] = useState<Date | null>(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (day && month && year) {
      calculateAge();
    } else {
      setResult(null);
    }
  }, [day, month, year]);

  // Check if today is birthday on date selection
  useEffect(() => {
    if (day && month && year) {
      const today = new Date();
      const selectedMonth = parseInt(month);
      const selectedDay = parseInt(day);
      
      // Check if today is the user's birthday
      if (today.getMonth() === selectedMonth && today.getDate() === selectedDay) {
        setShowBirthdayMessage(true);
        setShowConfetti(true);
        
        // Play birthday sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Autoplay might be blocked, ignore error
        });
        
        // Hide after 3 seconds
        setTimeout(() => {
          setShowBirthdayMessage(false);
          setShowConfetti(false);
        }, 3000);
      }
    }
  }, [day, month, year]);

  // Live countdown timer
  useEffect(() => {
    if (!nextBirthdayDate || !showCountdown) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = nextBirthdayDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMinutes: 0 });
        // Trigger birthday celebration
        setShowBirthdayMessage(true);
        setShowConfetti(true);
        setShowCountdown(false);
        
        // Play birthday sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Autoplay might be blocked, ignore error
        });
        
        // Hide after 3 seconds
        setTimeout(() => {
          setShowBirthdayMessage(false);
          setShowConfetti(false);
        }, 3000);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const totalMinutes = Math.floor(diff / (1000 * 60));

      setCountdown({ days, hours, minutes, seconds, totalMinutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextBirthdayDate, showCountdown]);

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

    // Calculate totals
    const diffMs = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);

    // Calculate next birthday date
    let nextBirthday = new Date(today.getFullYear(), parseInt(month), parseInt(day));
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, parseInt(month), parseInt(day));
    }
    setNextBirthdayDate(nextBirthday);

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
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

  return (
    <div className="min-h-screen relative">
      {showConfetti && <Confetti show={showConfetti} />}
      
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-accent/15 rounded-full blur-3xl" />
      </div>
      
      {/* Birthday Message Overlay */}
      {showBirthdayMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-scale-in">
            <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
              Happy Birthday!
            </h1>
            <p className="text-2xl md:text-3xl text-foreground font-semibold">
              🎉 Celebrate! 🎉
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8">
        <div className="max-w-xl mx-auto">
          <header className="flex items-center justify-start mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </header>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
              <Calendar className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <RainbowText text="Age Calculator" />
            </h1>
            <p className="text-muted-foreground">
              <RainbowText text="Discover exactly how long you've been alive" />
            </p>
          </div>

          <Card className="glass-card p-6 border-0">
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
                <div className="space-y-4 fade-up">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-center">
                    <p className="text-sm mb-1"><RainbowText text="Your Age" /></p>
                    <p className="text-3xl font-bold">
                      <span className="text-colorful-primary">{result.years}</span>
                      <span className="text-colorful-secondary"> years, </span>
                      <span className="text-colorful-accent">{result.months}</span>
                      <span className="text-colorful-success"> months, </span>
                      <span className="text-colorful-purple">{result.days}</span>
                      <span className="text-colorful-pink"> days</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm mb-1"><span className="text-colorful-primary">Total Days</span></p>
                      <p className="text-xl font-bold">
                        <RainbowNumber value={result.totalDays.toLocaleString()} />
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm mb-1"><span className="text-colorful-secondary">Total Hours</span></p>
                      <p className="text-xl font-bold">
                        <RainbowNumber value={result.totalHours.toLocaleString()} />
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <p className="text-sm mb-1"><span className="text-colorful-accent">Total Minutes</span></p>
                      <p className="text-xl font-bold">
                        <RainbowNumber value={result.totalMinutes.toLocaleString()} />
                      </p>
                    </div>
                  </div>

                  {/* Birthday Countdown - Always Visible */}
                  {countdown && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-center animate-fade-in">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Cake className="h-5 w-5 text-colorful-pink" />
                        <p className="text-sm font-medium text-colorful-pink">Next Birthday Countdown</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="p-2 rounded-lg bg-background/80">
                          <p className="text-2xl font-bold"><RainbowNumber value={countdown.days} /></p>
                          <p className="text-xs text-colorful-primary">Days</p>
                        </div>
                        <div className="p-2 rounded-lg bg-background/80">
                          <p className="text-2xl font-bold"><RainbowNumber value={countdown.hours} /></p>
                          <p className="text-xs text-colorful-secondary">Hours</p>
                        </div>
                        <div className="p-2 rounded-lg bg-background/80">
                          <p className="text-2xl font-bold"><RainbowNumber value={countdown.minutes} /></p>
                          <p className="text-xs text-colorful-accent">Mins</p>
                        </div>
                        <div className="p-2 rounded-lg bg-background/80">
                          <p className="text-2xl font-bold"><RainbowNumber value={countdown.seconds} /></p>
                          <p className="text-xs text-colorful-success">Secs</p>
                        </div>
                        <div className="p-2 rounded-lg bg-background/80">
                          <p className="text-lg font-bold"><RainbowNumber value={countdown.totalMinutes.toLocaleString()} /></p>
                          <p className="text-xs text-colorful-purple">Total Mins</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
