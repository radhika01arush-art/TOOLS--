import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a math calculator assistant. The user will ask math questions in natural language.

Your job is to:
1. Parse the math question
2. Calculate the answer
3. Return ONLY a JSON response in this exact format:
{"result": <number>, "expression": "<the mathematical expression>", "explanation": "<brief explanation>"}

Examples:
- "what is 20% of 500" → {"result": 100, "expression": "500 × 0.20", "explanation": "20% of 500 equals 100"}
- "15% tip on $47.50" → {"result": 7.125, "expression": "47.50 × 0.15", "explanation": "15% tip on $47.50 is $7.13"}
- "compound interest 5000 at 7% for 3 years" → {"result": 6125.22, "expression": "5000 × (1 + 0.07)³", "explanation": "Compound interest: $5000 at 7% for 3 years = $6125.22"}
- "square root of 144" → {"result": 12, "expression": "√144", "explanation": "The square root of 144 is 12"}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just the JSON object.`
          },
          { role: "user", content: query }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from AI
    try {
      const mathResult = JSON.parse(content);
      return new Response(JSON.stringify(mathResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      // If AI didn't return valid JSON, return raw content
      return new Response(JSON.stringify({ error: "Could not parse math question", raw: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("ai-math error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
