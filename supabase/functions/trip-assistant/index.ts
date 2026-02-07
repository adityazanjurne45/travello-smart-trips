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
    const { question, destination, boardingCity, duration, budget, recommendations } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const context = `Trip: ${boardingCity} → ${destination}, ${duration} days, ₹${budget} budget.
Weather: ${recommendations?.weather?.condition || "Unknown"}, ${recommendations?.weather?.temp || "N/A"}.
Tourist places: ${recommendations?.touristPlaces?.map((p: any) => p.name).join(", ") || "None listed"}.
Hotels: ${recommendations?.hotels?.map((h: any) => h.name).join(", ") || "None listed"}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI travel assistant for Travello. Answer concisely (2-3 sentences max). Use the trip context to give personalized answers. Context: ${context}`,
          },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ answer: "I'm a bit busy right now. Please try again in a moment." }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't process that question.";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Trip assistant error:", error);
    return new Response(
      JSON.stringify({ answer: "Sorry, I'm having trouble right now. Please try again later." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
