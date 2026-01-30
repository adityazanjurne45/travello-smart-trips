import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TripPlanRequest {
  boarding_city: string;
  destination_city: string;
  duration: number;
  budget: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { boarding_city, destination_city, duration, budget }: TripPlanRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert travel planner AI. Generate comprehensive, realistic travel recommendations based on the user's trip details. 

Your recommendations should be:
- Budget-aware: Ensure all costs fit within the specified budget
- Traffic-optimized: Consider typical traffic conditions and travel times
- Locally relevant: Suggest popular and well-reviewed attractions, hotels, and transport options
- Day-wise organized: Create a logical day-by-day itinerary

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. The response must be parseable JSON.`;

    const userPrompt = `Create a detailed travel plan for the following trip:

**Trip Details:**
- Departure City: ${boarding_city}
- Destination City: ${destination_city}
- Duration: ${duration} days
- Total Budget: ₹${budget.toLocaleString()}

Please provide:
1. Top tourist attractions to visit
2. Budget-appropriate hotel recommendations
3. Transport options (bike, car, public transport) with costs
4. Day-wise itinerary with activities
5. Any warnings about budget, time constraints, or traffic

Return the response in this exact JSON structure:
{
  "recommendations": {
    "touristPlaces": [
      {
        "name": "Place Name",
        "description": "Brief description",
        "visitDuration": "2-3 hours",
        "bestTime": "Morning",
        "entryFee": 100
      }
    ],
    "hotels": [
      {
        "name": "Hotel Name",
        "pricePerNight": 2000,
        "rating": 4.5,
        "amenities": ["WiFi", "AC", "Breakfast"],
        "location": "Near city center"
      }
    ],
    "transport": [
      {
        "type": "car",
        "estimatedCost": 3000,
        "duration": "4-5 hours",
        "recommendation": "Best for family travel with luggage"
      }
    ],
    "warnings": ["Budget may be tight for luxury hotels", "Book transport in advance during peak season"],
    "weather": {
      "condition": "Sunny with mild temperatures expected",
      "temp": "25-32°C"
    }
  },
  "itinerary": {
    "days": [
      {
        "day": 1,
        "title": "Arrival & Local Exploration",
        "activities": ["Check-in at hotel", "Visit nearby market", "Evening at local attraction"],
        "estimatedCost": 3000
      }
    ],
    "totalEstimatedCost": 15000
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from AI
    let parsedContent;
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      
      // Return a fallback response
      parsedContent = {
        recommendations: {
          touristPlaces: [
            {
              name: `${destination_city} City Center`,
              description: "Explore the heart of the city with its vibrant markets and local culture",
              visitDuration: "3-4 hours",
              bestTime: "Morning",
              entryFee: 0
            },
            {
              name: "Local Heritage Site",
              description: "Historical landmark showcasing the region's rich heritage",
              visitDuration: "2 hours",
              bestTime: "Afternoon",
              entryFee: 50
            }
          ],
          hotels: [
            {
              name: "Budget Inn",
              pricePerNight: Math.round(budget / duration / 3),
              rating: 3.8,
              amenities: ["WiFi", "AC", "TV"],
              location: "City center"
            },
            {
              name: "Comfort Stay Hotel",
              pricePerNight: Math.round(budget / duration / 2),
              rating: 4.2,
              amenities: ["WiFi", "AC", "Breakfast", "Parking"],
              location: "Near main attractions"
            }
          ],
          transport: [
            {
              type: "car",
              estimatedCost: Math.round(budget * 0.15),
              duration: "Travel time varies",
              recommendation: "Comfortable for families and groups"
            },
            {
              type: "bike",
              estimatedCost: Math.round(budget * 0.05),
              duration: "Faster in city traffic",
              recommendation: "Economical choice for solo travelers"
            }
          ],
          warnings: budget < 10000 ? ["Budget is limited - consider homestays or hostels"] : [],
          weather: {
            condition: "Pleasant weather expected",
            temp: "24-30°C"
          }
        },
        itinerary: {
          days: Array.from({ length: duration }, (_, i) => ({
            day: i + 1,
            title: i === 0 ? "Arrival Day" : i === duration - 1 ? "Departure Day" : `Exploration Day ${i}`,
            activities: i === 0 
              ? ["Arrive and check into hotel", "Light exploration of nearby areas", "Dinner at local restaurant"]
              : i === duration - 1
              ? ["Breakfast at hotel", "Last-minute shopping", "Check out and depart"]
              : ["Morning sightseeing", "Lunch at local eatery", "Afternoon attraction visit", "Evening leisure"],
            estimatedCost: Math.round(budget / duration)
          })),
          totalEstimatedCost: budget
        }
      };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-trip-plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
