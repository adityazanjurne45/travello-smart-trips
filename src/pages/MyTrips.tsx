import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DestinationImage } from "@/components/trip/DestinationImage";
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Heart, 
  Search, 
  Plus,
  Trash2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;

export default function MyTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadTrips() {
      if (!user) return;

      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setTrips(data);
      setLoading(false);
    }

    loadTrips();
  }, [user]);

  const toggleFavorite = async (tripId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("trips")
      .update({ is_favorite: !currentState })
      .eq("id", tripId);

    if (!error) {
      setTrips(trips.map(t => 
        t.id === tripId ? { ...t, is_favorite: !currentState } : t
      ));
    }
  };

  const deleteTrip = async (tripId: string) => {
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId);

    if (error) {
      toast.error("Failed to delete trip");
      return;
    }

    setTrips(trips.filter(t => t.id !== tripId));
    toast.success("Trip deleted");
  };

  const filteredTrips = trips.filter(trip =>
    trip.destination_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.boarding_city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteTrips = filteredTrips.filter(t => t.is_favorite);
  const otherTrips = filteredTrips.filter(t => !t.is_favorite);

  return (
    <Layout>
      <div className="gradient-hero min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                My Trips
              </h1>
              <p className="text-muted-foreground">
                {trips.length} trip{trips.length !== 1 ? "s" : ""} planned
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="gradient-primary gap-2">
                <Link to="/plan-trip">
                  <Plus className="w-4 h-4" />
                  New Trip
                </Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
                  <div className="h-6 bg-muted rounded w-2/3 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No trips yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start planning your first adventure with AI-powered recommendations
              </p>
              <Button asChild className="gradient-primary">
                <Link to="/plan-trip">
                  <Plus className="w-4 h-4 mr-2" />
                  Plan Your First Trip
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Favorites Section */}
              {favoriteTrips.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent fill-accent" />
                    Favorites
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        onToggleFavorite={toggleFavorite}
                        onDelete={deleteTrip}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Trips */}
              <div>
                {favoriteTrips.length > 0 && (
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    All Trips
                  </h2>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteTrip}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function TripCard({
  trip,
  onToggleFavorite,
  onDelete,
}: {
  trip: Trip;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-medium transition-all">
      {/* Destination Image */}
      <div className="relative h-32 overflow-hidden">
        <DestinationImage 
          destination={trip.destination_city}
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(trip.id, trip.is_favorite ?? false);
            }}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                trip.is_favorite ? "text-accent fill-accent" : "text-white"
              }`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(trip.id);
            }}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-red-500/50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Destination name overlay */}
        <div className="absolute bottom-2 left-3">
          <h3 className="font-display text-lg font-semibold text-white drop-shadow-lg">
            {trip.destination_city}
          </h3>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-3">
          From {trip.boarding_city}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {trip.duration} days
          </span>
          <span className="flex items-center gap-1">
            <Wallet className="w-4 h-4" />
            ₹{trip.budget.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          trip.status === "completed" ? "bg-green-100 text-green-700" :
          trip.status === "generating" ? "bg-amber-100 text-amber-700" :
          "bg-blue-100 text-blue-700"
        }`}>
          {trip.status === "generating" ? "Generating..." : trip.status}
        </span>
        <Link
          to={`/trip/${trip.id}`}
          className="flex items-center gap-1 text-primary font-medium hover:underline"
        >
          View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
