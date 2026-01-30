import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  ArrowLeft,
  Clock,
  Hotel,
  Car,
  Camera,
  AlertTriangle,
  Download,
  Heart,
  Loader2,
  Sparkles,
  Sun,
  CloudRain
} from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;

interface TouristPlace {
  name: string;
  description: string;
  visitDuration: string;
  bestTime: string;
  entryFee: number;
}

interface HotelRecommendation {
  name: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  location: string;
}

interface TransportOption {
  type: string;
  estimatedCost: number;
  duration: string;
  recommendation: string;
}

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  estimatedCost: number;
}

interface Recommendations {
  touristPlaces: TouristPlace[];
  hotels: HotelRecommendation[];
  transport: TransportOption[];
  warnings: string[];
  weather: { condition: string; temp: string };
}

interface Itinerary {
  days: DayItinerary[];
  totalEstimatedCost: number;
}

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      if (!id || !user) return;

      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setTrip(data);
        
        // If no recommendations yet, generate them
        if (!data.recommendations && data.status === "generating") {
          generateRecommendations(data);
        }
      }
      setLoading(false);
    }

    loadTrip();
  }, [id, user]);

  const generateRecommendations = async (tripData: Trip) => {
    setGenerating(true);

    try {
      const response = await supabase.functions.invoke("generate-trip-plan", {
        body: {
          boarding_city: tripData.boarding_city,
          destination_city: tripData.destination_city,
          duration: tripData.duration,
          budget: tripData.budget,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { recommendations, itinerary } = response.data;

      // Update the trip with recommendations
      const { data: updatedTrip, error: updateError } = await supabase
        .from("trips")
        .update({
          recommendations,
          itinerary,
          status: "planned",
        })
        .eq("id", tripData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setTrip(updatedTrip);
      toast.success("Trip plan generated!");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error("Failed to generate trip plan. Please try again.");
      
      // Update status to show error
      await supabase
        .from("trips")
        .update({ status: "planned" })
        .eq("id", tripData.id);
    }

    setGenerating(false);
  };

  const toggleFavorite = async () => {
    if (!trip) return;

    const { error } = await supabase
      .from("trips")
      .update({ is_favorite: !trip.is_favorite })
      .eq("id", trip.id);

    if (!error) {
      setTrip({ ...trip, is_favorite: !trip.is_favorite });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
            <Button asChild>
              <Link to="/my-trips">Go to My Trips</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const recommendations = trip.recommendations as unknown as Recommendations | null;
  const itinerary = trip.itinerary as unknown as Itinerary | null;

  return (
    <Layout>
      <div className="gradient-hero min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/my-trips"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Trips
            </Link>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {trip.boarding_city} → {trip.destination_city}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {trip.duration} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    ₹{trip.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={toggleFavorite}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${trip.is_favorite ? "fill-accent text-accent" : ""}`} />
                  {trip.is_favorite ? "Favorited" : "Favorite"}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Generating State */}
          {(generating || trip.status === "generating") && !recommendations && (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Sparkles className="w-10 h-10 text-primary-foreground animate-pulse" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Generating Your Perfect Trip Plan
              </h2>
              <p className="text-muted-foreground mb-4">
                Our AI is analyzing destinations, hotels, and transport options based on your preferences...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </div>
          )}

          {/* Recommendations Content */}
          {recommendations && (
            <div className="space-y-8">
              {/* Weather & Warnings */}
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.weather && (
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      {recommendations.weather.condition?.toLowerCase().includes("rain") ? (
                        <CloudRain className="w-8 h-8 text-ocean" />
                      ) : (
                        <Sun className="w-8 h-8 text-accent" />
                      )}
                      <div>
                        <h3 className="font-display font-semibold">Weather</h3>
                        <p className="text-muted-foreground text-sm">{recommendations.weather.temp}</p>
                      </div>
                    </div>
                    <p className="text-foreground">{recommendations.weather.condition}</p>
                  </div>
                )}

                {recommendations.warnings && recommendations.warnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                      <h3 className="font-display font-semibold text-amber-800 dark:text-amber-200">
                        Smart Warnings
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {recommendations.warnings.map((warning, i) => (
                        <li key={i} className="text-amber-700 dark:text-amber-300 text-sm">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tourist Places */}
              {recommendations.touristPlaces && recommendations.touristPlaces.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-display text-xl font-semibold">Tourist Attractions</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations.touristPlaces.map((place, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
                        <h4 className="font-semibold text-foreground mb-2">{place.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{place.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-teal-light text-primary">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {place.visitDuration}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-coral-light text-accent">
                            ₹{place.entryFee} entry
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels */}
              {recommendations.hotels && recommendations.hotels.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <h2 className="font-display text-xl font-semibold">Recommended Hotels</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {recommendations.hotels.map((hotel, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border">
                        <h4 className="font-semibold text-foreground mb-1">{hotel.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{hotel.location}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">
                            ₹{hotel.pricePerNight.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">/night</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities?.slice(0, 3).map((amenity, j) => (
                            <span key={j} className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transport */}
              {recommendations.transport && recommendations.transport.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <Car className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="font-display text-xl font-semibold">Transport Options</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendations.transport.map((option, i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Car className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground capitalize">{option.type}</h4>
                          <p className="text-sm text-muted-foreground">{option.duration}</p>
                          <p className="text-primary font-medium mt-1">
                            ₹{option.estimatedCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{option.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-wise Itinerary */}
              {itinerary && itinerary.days && itinerary.days.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold">Day-wise Itinerary</h2>
                      <p className="text-sm text-muted-foreground">
                        Total estimated cost: ₹{itinerary.totalEstimatedCost?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {itinerary.days.map((day) => (
                      <div key={day.day} className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-foreground">
                            Day {day.day}: {day.title}
                          </h4>
                          <span className="text-sm text-primary font-medium">
                            ₹{day.estimatedCost.toLocaleString()}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Retry Button if no recommendations */}
          {!recommendations && !generating && trip.status !== "generating" && (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                No recommendations generated yet
              </h2>
              <Button 
                onClick={() => generateRecommendations(trip)}
                className="gradient-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Trip Plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
