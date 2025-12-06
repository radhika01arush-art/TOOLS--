import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timezones = [
  { value: "UTC", label: "UTC", offset: 0 },
  { value: "America/New_York", label: "New York (EST/EDT)", offset: -5 },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", offset: -8 },
  { value: "America/Chicago", label: "Chicago (CST/CDT)", offset: -6 },
  { value: "Europe/London", label: "London (GMT/BST)", offset: 0 },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", offset: 1 },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: 1 },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: 9 },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: 8 },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: 4 },
  { value: "Asia/Kolkata", label: "India (IST)", offset: 5.5 },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: 8 },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", offset: 10 },
  { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)", offset: 12 },
];

const TimeConverter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("Asia/Kolkata");
  const [inputTime, setInputTime] = useState("");
  const [convertedTime, setConvertedTime] = useState("");

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
    if (inputTime) {
      convertTime();
    } else {
      setConvertedTime("");
    }
  }, [inputTime, fromZone, toZone]);

  const convertTime = () => {
    if (!inputTime) return;

    const fromOffset = timezones.find(tz => tz.value === fromZone)?.offset || 0;
    const toOffset = timezones.find(tz => tz.value === toZone)?.offset || 0;

    const [hours, minutes] = inputTime.split(":").map(Number);
    
    // Convert to UTC first, then to target timezone
    let utcHours = hours - fromOffset;
    let targetHours = utcHours + toOffset;
    
    // Handle day overflow/underflow
    if (targetHours >= 24) {
      targetHours -= 24;
    } else if (targetHours < 0) {
      targetHours += 24;
    }

    const formattedHours = Math.floor(targetHours).toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    
    // Handle half-hour offsets (like India)
    const fractionalHours = toOffset % 1;
    let adjustedMinutes = minutes;
    if (fractionalHours !== 0) {
      adjustedMinutes = minutes + (fractionalHours * 60);
      if (adjustedMinutes >= 60) {
        adjustedMinutes -= 60;
      }
    }

    setConvertedTime(`${formattedHours}:${adjustedMinutes.toString().padStart(2, "0")}`);
  };

  const swapTimezones = () => {
    setFromZone(toZone);
    setToZone(fromZone);
  };

  const setCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setInputTime(`${hours}:${minutes}`);
  };

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
            <div className="space-y-2">
              <Label>From Timezone</Label>
              <Select value={fromZone} onValueChange={setFromZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="icon" onClick={swapTimezones}>
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>To Timezone</Label>
              <Select value={toZone} onValueChange={setToZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Time (24-hour format)</Label>
                <Button variant="link" size="sm" onClick={setCurrentTime} className="h-auto p-0">
                  Use current time
                </Button>
              </div>
              <Input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="text-lg"
              />
            </div>

            {convertedTime && (
              <div className="p-4 rounded-lg bg-primary/10 text-center">
                <p className="text-sm text-muted-foreground mb-1">Converted Time</p>
                <p className="text-4xl font-bold text-primary">{convertedTime}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimeConverter;
