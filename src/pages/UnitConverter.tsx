import { useState } from "react";
import { ArrowLeftRight, Calculator, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RainbowText, RainbowNumber } from "@/components/RainbowText";
import SEO from "@/components/SEO";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Unit Converter",
  "description": "Free online unit converter. Convert length, weight, temperature, volume, speed and area units instantly.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any"
};

type ConversionCategory = "length" | "weight" | "temperature" | "volume" | "speed" | "area";

const conversions = {
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    mile: 0.000621371,
    yard: 1.09361,
    foot: 3.28084,
    inch: 39.3701,
  },
  weight: {
    kilogram: 1,
    gram: 1000,
    milligram: 1000000,
    pound: 2.20462,
    ounce: 35.274,
    ton: 0.001,
  },
  temperature: {
    celsius: (val: number) => val,
    fahrenheit: (val: number) => (val * 9/5) + 32,
    kelvin: (val: number) => val + 273.15,
  },
  volume: {
    liter: 1,
    milliliter: 1000,
    gallon: 0.264172,
    quart: 1.05669,
    pint: 2.11338,
    cup: 4.22675,
    fluid_ounce: 33.814,
  },
  speed: {
    mps: 1,
    kph: 3.6,
    mph: 2.23694,
    knot: 1.94384,
  },
  area: {
    square_meter: 1,
    square_kilometer: 0.000001,
    square_mile: 3.861e-7,
    square_yard: 1.19599,
    square_foot: 10.7639,
    hectare: 0.0001,
    acre: 0.000247105,
  },
};

const unitLabels: Record<string, string> = {
  meter: "Meter (m)",
  kilometer: "Kilometer (km)",
  centimeter: "Centimeter (cm)",
  millimeter: "Millimeter (mm)",
  mile: "Mile (mi)",
  yard: "Yard (yd)",
  foot: "Foot (ft)",
  inch: "Inch (in)",
  kilogram: "Kilogram (kg)",
  gram: "Gram (g)",
  milligram: "Milligram (mg)",
  pound: "Pound (lb)",
  ounce: "Ounce (oz)",
  ton: "Metric Ton (t)",
  celsius: "Celsius (°C)",
  fahrenheit: "Fahrenheit (°F)",
  kelvin: "Kelvin (K)",
  liter: "Liter (L)",
  milliliter: "Milliliter (mL)",
  gallon: "Gallon (gal)",
  quart: "Quart (qt)",
  pint: "Pint (pt)",
  cup: "Cup",
  fluid_ounce: "Fluid Ounce (fl oz)",
  mps: "Meters/Second (m/s)",
  kph: "Kilometers/Hour (km/h)",
  mph: "Miles/Hour (mph)",
  knot: "Knot (kn)",
  square_meter: "Square Meter (m²)",
  square_kilometer: "Square Kilometer (km²)",
  square_mile: "Square Mile (mi²)",
  square_yard: "Square Yard (yd²)",
  square_foot: "Square Foot (ft²)",
  hectare: "Hectare (ha)",
  acre: "Acre",
};

const UnitConverter = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ConversionCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("meter");
  const [toUnit, setToUnit] = useState<string>("foot");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const convert = (value: string, from: string, to: string, cat: ConversionCategory) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult("");
      return;
    }

    if (cat === "temperature") {
      const temp = conversions.temperature;
      let celsius = numValue;
      
      if (from === "fahrenheit") celsius = (numValue - 32) * 5/9;
      if (from === "kelvin") celsius = numValue - 273.15;
      
      let output = celsius;
      if (to === "fahrenheit") output = temp.fahrenheit(celsius);
      if (to === "kelvin") output = temp.kelvin(celsius);
      
      setResult(output.toFixed(2));
    } else {
      const rates = conversions[cat] as Record<string, number>;
      const baseValue = numValue / rates[from];
      const converted = baseValue * rates[to];
      setResult(converted.toFixed(4));
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    convert(value, fromUnit, toUnit, category);
  };

  const handleCategoryChange = (newCategory: ConversionCategory) => {
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setInputValue("");
    setResult("");
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (inputValue) {
      convert(inputValue, toUnit, temp, category);
    }
  };

  const categoryUnits = Object.keys(conversions[category]);

  return (
    <div className="min-h-screen">
      <SEO
        title="Unit Converter - Convert Length, Weight, Temperature & More"
        description="Free online unit converter. Instantly convert between meters, feet, kilograms, pounds, celsius, fahrenheit, liters, gallons and more units."
        keywords="unit converter, length converter, weight converter, temperature converter, volume converter, metric converter, imperial converter"
        structuredData={structuredData}
      />
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-start mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <Calculator className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2"><RainbowText text="Unit Converter" /></h1>
          <p className="text-muted-foreground"><RainbowText text="Fast and accurate conversions for everyday use" /></p>
        </div>

        {/* Category Tabs */}
        <Tabs value={category} onValueChange={(val) => handleCategoryChange(val as ConversionCategory)} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="length" className="font-semibold">Length</TabsTrigger>
            <TabsTrigger value="weight" className="font-semibold">Weight</TabsTrigger>
            <TabsTrigger value="temperature" className="font-semibold">Temp</TabsTrigger>
            <TabsTrigger value="volume" className="font-semibold">Volume</TabsTrigger>
            <TabsTrigger value="speed" className="font-semibold">Speed</TabsTrigger>
            <TabsTrigger value="area" className="font-semibold">Area</TabsTrigger>
          </TabsList>

          <TabsContent value={category} className="mt-8">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center capitalize">
                  <RainbowText text={`${category} Conversion`} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* From Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">From</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter value"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="flex-1 text-lg h-12"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="w-[200px] h-12 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unitLabels[unit]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwapUnits}
                    className="rounded-full h-12 w-12 border-2"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* To Output */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">To</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={result}
                      readOnly
                      placeholder="Result"
                      className="flex-1 text-lg h-12 bg-muted/50 font-semibold"
                    />
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="w-[200px] h-12 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unitLabels[unit]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnitConverter;
