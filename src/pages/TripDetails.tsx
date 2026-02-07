import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DestinationImage } from "@/components/trip/DestinationImage";
import { EnhancedMap } from "@/components/trip/EnhancedMap";
import { AILoadingState } from "@/components/trip/AILoadingState";
import { OverviewTab } from "@/components/trip/OverviewTab";
import { DayByDayTab } from "@/components/trip/DayByDayTab";
import { BookTicketsTab } from "@/components/trip/BookTicketsTab";
import { DestinationTimeCard } from "@/components/trip/DestinationTimeCard";
import { ExpenseTracker } from "@/components/trip/ExpenseTracker";
import { PackingChecklist } from "@/components/trip/PackingChecklist";
import { TripRating } from "@/components/trip/TripRating";
import { TravelerEssentials } from "@/components/trip/TravelerEssentials";
import { LanguageCultureTips } from "@/components/trip/LanguageCultureTips";
import { ShareTrip } from "@/components/trip/ShareTrip";
import { TripAssistant } from "@/components/trip/TripAssistant";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { 
  Calendar, Wallet, ArrowLeft, Download, Heart, Loader2, Map, 
  Eye, CalendarDays, Ticket, MapPin, Shield, Luggage, DollarSign, 
  Languages, Bot
} from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;

interface Recommendations {
  touristPlaces: { name: string; description: string; visitDuration: string; bestTime: string; entryFee: number }[];
  hotels: { name: string; pricePerNight: number; rating: number; amenities: string[]; location: string }[];
  transport: { type: string; estimatedCost: number; duration: string; recommendation: string }[];
  warnings: string[];
  weather: { condition: string; temp: string };
}

interface Itinerary {
  days: { day: number; title: string; activities: string[]; estimatedCost: number }[];
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
      if (response.error) throw new Error(response.error.message);
      const { recommendations, itinerary } = response.data;
      const { data: updatedTrip, error: updateError } = await supabase
        .from("trips")
        .update({ recommendations, itinerary, status: "planned" })
        .eq("id", tripData.id)
        .select()
        .single();
      if (updateError) throw updateError;
      setTrip(updatedTrip);
      toast.success("Trip plan generated!");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error("Failed to generate trip plan. Please try again.");
      await supabase.from("trips").update({ status: "planned" }).eq("id", tripData.id);
    }
    setGenerating(false);
  };

  const toggleFavorite = async () => {
    if (!trip) return;
    const { error } = await supabase
      .from("trips")
      .update({ is_favorite: !trip.is_favorite })
      .eq("id", trip.id);
    if (!error) setTrip({ ...trip, is_favorite: !trip.is_favorite });
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
            <Button asChild><Link to="/my-trips">Go to My Trips</Link></Button>
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
            <Link to="/my-trips" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to My Trips
            </Link>

            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
              <DestinationImage destination={trip.destination_city} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {trip.boarding_city} → {trip.destination_city}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{trip.duration} days</span>
                  <span className="flex items-center gap-1"><Wallet className="w-4 h-4" />₹{trip.budget.toLocaleString()}</span>
                  {trip.start_date && (
                    <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" />{trip.start_date}</span>
                  )}
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="sm" onClick={toggleFavorite} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                  <Heart className={`w-4 h-4 ${trip.is_favorite ? "fill-accent text-accent" : "text-white"}`} />
                </Button>
              </div>
            </div>

            {/* Destination Time + Share */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <DestinationTimeCard destinationCity={trip.destination_city} />
              </div>
              <ShareTrip
                tripId={trip.id}
                boardingCity={trip.boarding_city}
                destinationCity={trip.destination_city}
                duration={trip.duration}
                budget={trip.budget}
                startDate={trip.start_date}
              />
            </div>
          </div>

          {/* AI Loading */}
          {(generating || trip.status === "generating") && !recommendations && <AILoadingState />}

          {/* Tabbed Content */}
          {recommendations && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-card border border-border p-1.5 rounded-xl">
                <TabsTrigger value="overview" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow">
                  <Eye className="w-3.5 h-3.5" /> Overview
                </TabsTrigger>
                <TabsTrigger value="map" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow">
                  <Map className="w-3.5 h-3.5" /> Map
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow">
                  <CalendarDays className="w-3.5 h-3.5" /> Day-by-Day
                </TabsTrigger>
                <TabsTrigger value="essentials" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow">
                  <Shield className="w-3.5 h-3.5" /> Essentials
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow">
                  <DollarSign className="w-3.5 h-3.5" /> Budget
                </TabsTrigger>
                <TabsTrigger value="packing" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow-accent">
                  <Luggage className="w-3.5 h-3.5" /> Packing
                </TabsTrigger>
                <TabsTrigger value="book" className="flex-1 min-w-[80px] gap-1.5 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow-accent">
                  <Ticket className="w-3.5 h-3.5" /> Book
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <OverviewTab recommendations={recommendations} destinationCity={trip.destination_city} />
                  <LanguageCultureTips destination={trip.destination_city} />
                </div>
              </TabsContent>

              <TabsContent value="map">
                <ErrorBoundary fallback={
                  <div className="bg-card rounded-2xl p-6 border border-border text-center py-12">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Map could not be loaded.</p>
                  </div>
                }>
                  <div className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Map className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold">Interactive Trip Map</h2>
                        <p className="text-sm text-muted-foreground">Explore hotels and attractions</p>
                      </div>
                    </div>
                    <EnhancedMap
                      boardingCity={trip.boarding_city}
                      destinationCity={trip.destination_city}
                      hotels={recommendations.hotels}
                      attractions={recommendations.touristPlaces}
                      className="h-[400px] md:h-[500px]"
                    />
                  </div>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="itinerary">
                {itinerary ? (
                  <DayByDayTab itinerary={itinerary} />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No itinerary generated yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="essentials">
                <TravelerEssentials destination={trip.destination_city} boardingCity={trip.boarding_city} />
              </TabsContent>

              <TabsContent value="expenses">
                <ExpenseTracker tripId={trip.id} budget={trip.budget} />
              </TabsContent>

              <TabsContent value="packing">
                <PackingChecklist
                  tripId={trip.id}
                  destination={trip.destination_city}
                  duration={trip.duration}
                  weather={recommendations.weather}
                />
              </TabsContent>

              <TabsContent value="book">
                <BookTicketsTab
                  boardingCity={trip.boarding_city}
                  destinationCity={trip.destination_city}
                  startDate={trip.start_date}
                  duration={trip.duration}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Sidebar features below tabs */}
          {recommendations && (
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <TripAssistant
                destination={trip.destination_city}
                boardingCity={trip.boarding_city}
                duration={trip.duration}
                budget={trip.budget}
                recommendations={recommendations}
              />
              <TripRating tripId={trip.id} tripEndDate={trip.end_date} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
