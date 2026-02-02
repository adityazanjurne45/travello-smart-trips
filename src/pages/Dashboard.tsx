import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Wallet, 
  ChevronRight,
  Route,
  Briefcase,
  IndianRupee,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";
import heroImage from "@/assets/hero-mountains.jpg";

type Trip = Tables<"trips">;
type Profile = Tables<"profiles">;

// Dashboard Stats Component
function TravelStats({ trips }: { trips: Trip[] }) {
  const totalTrips = trips.length;
  const totalDays = trips.reduce((sum, trip) => sum + trip.duration, 0);
  const totalSpent = trips.reduce((sum, trip) => sum + trip.budget, 0);

  const stats = [
    { icon: Briefcase, value: totalTrips, label: "Total Trips", color: "primary" },
    { icon: Calendar, value: totalDays, label: "Days Traveled", color: "primary" },
    { icon: IndianRupee, value: `₹${(totalSpent / 1000).toFixed(0)}k`, label: "Total Spent", color: "primary" },
  ];

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-display text-lg font-bold text-foreground mb-1">Travel Stats</h3>
      <p className="text-sm text-muted-foreground mb-4">Hello, here's your trip progress!</p>
      
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-foreground text-lg">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Destinations Chart Component
function DestinationsChart({ trips }: { trips: Trip[] }) {
  // Calculate destination percentages
  const destinationCounts: Record<string, number> = {};
  trips.forEach(trip => {
    destinationCounts[trip.destination_city] = (destinationCounts[trip.destination_city] || 0) + 1;
  });

  const total = trips.length || 1;
  const destinations = Object.entries(destinationCounts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  const colors = ["bg-primary", "bg-accent", "bg-muted-foreground", "bg-muted"];

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Destinations Visited</h3>
      
      {/* Simple Donut representation */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            {destinations.length > 0 && (
              <>
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeDasharray={`${destinations[0]?.percentage || 0} ${100 - (destinations[0]?.percentage || 0)}`}
                  strokeLinecap="round"
                />
                {destinations[1] && (
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="4"
                    strokeDasharray={`${destinations[1].percentage} ${100 - destinations[1].percentage}`}
                    strokeDashoffset={`-${destinations[0]?.percentage || 0}`}
                    strokeLinecap="round"
                  />
                )}
              </>
            )}
          </svg>
          {destinations.slice(0, 2).map((dest, i) => (
            <span 
              key={i}
              className={`absolute text-xs font-semibold ${i === 0 ? 'top-2 right-0' : 'bottom-2 left-0'}`}
              style={{ color: i === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))' }}
            >
              {dest.percentage}%
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <span>✓ 📊</span> Destinations Visited
        </p>
        {destinations.map((dest, i) => (
          <div key={dest.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${colors[i]}`} />
              <span className="text-sm text-foreground">{dest.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{dest.percentage}%</span>
          </div>
        ))}
        {destinations.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No trips yet</p>
        )}
      </div>
    </div>
  );
}

// Trip Card Component
function TripCard({ trip, variant = "default" }: { trip: Trip; variant?: "default" | "compact" }) {
  const isCompact = variant === "compact";
  
  return (
    <Link
      to={`/trip/${trip.id}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-medium"
    >
      {/* Placeholder image with gradient */}
      <div className={`relative ${isCompact ? 'h-28' : 'h-36'} bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20fill%3D%22%2314b8a6%22%20fill-opacity%3D%220.1%22%20d%3D%22M0%2C100%20L50%2C20%20L100%2C100%20Z%22%2F%3E%3C%2Fsvg%3E')] bg-cover opacity-50" />
      </div>
      
      <div className={`${isCompact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-display font-bold text-foreground group-hover:text-primary transition-colors ${isCompact ? 'text-sm' : 'text-base'}`}>
          {trip.destination_city}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          From {trip.boarding_city}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {trip.duration} days
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            ₹{trip.budget.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const [profileRes, tripsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (tripsRes.data) setTrips(tripsRes.data);
      setLoading(false);
    }

    loadData();
  }, [user]);

  const recentTrips = trips.slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-12">
        {/* Welcome Banner with Background */}
        <div className="relative overflow-hidden mb-6">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
          
          <div className="relative container mx-auto px-4 py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Welcome back, {profile?.full_name?.split(" ")[0] || "Traveler"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to plan your next adventure?
              </p>
            </motion.div>

            {/* Quick Action Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4 mt-6 max-w-lg"
            >
              <Link
                to="/plan-trip"
                className="group flex items-center gap-3 p-4 rounded-xl bg-card/95 backdrop-blur border border-border hover:border-primary/40 transition-all hover:shadow-medium"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Plus className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">Plan New Trip</h3>
                  <p className="text-xs text-muted-foreground">Start a new adventure</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </Link>

              <Link
                to="/my-trips"
                className="group flex items-center gap-3 p-4 rounded-xl bg-card/95 backdrop-blur border border-border hover:border-primary/40 transition-all hover:shadow-medium"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Route className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">My Trips</h3>
                  <p className="text-xs text-muted-foreground">View all your trips</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Trips */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Trips - Large Cards */}
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Recent Trips</h2>
                {loading ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse">
                        <div className="h-36 bg-muted rounded-lg mb-3" />
                        <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : recentTrips.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recentTrips.slice(0, 2).map((trip) => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-xl p-8 border border-border text-center">
                    <p className="text-muted-foreground mb-4">No trips yet. Start planning!</p>
                    <Button asChild className="gradient-primary">
                      <Link to="/plan-trip">
                        <Plus className="w-4 h-4 mr-2" />
                        Plan Your First Trip
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* More Recent Trips - Compact Cards */}
              {trips.length > 2 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="font-display text-lg font-bold text-foreground">Recent Trips</h2>
                    </div>
                    <Link to="/my-trips" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                      View All <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trips.slice(0, 3).map((trip) => (
                      <TripCard key={trip.id} trip={trip} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Profile Card */}
              {profile && !profile.home_city && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl p-5 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground mb-1">Complete Your Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Get better AI recommendations by adding your travel preferences
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bottom Banner */}
              <div className="relative rounded-xl overflow-hidden h-40">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
                <div className="relative h-full flex items-center justify-end p-6">
                  <Button asChild className="gradient-primary">
                    <Link to="/profile">Save Profile</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              <TravelStats trips={trips} />
              <DestinationsChart trips={trips} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
