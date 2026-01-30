import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Wallet, 
  Heart, 
  ChevronRight,
  Sparkles,
  Route
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;
type Profile = Tables<"profiles">;

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const [profileRes, tripsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (tripsRes.data) setRecentTrips(tripsRes.data);
      setLoading(false);
    }

    loadData();
  }, [user]);

  const quickActions = [
    {
      icon: Plus,
      title: "Plan New Trip",
      description: "Start a new adventure",
      href: "/plan-trip",
      gradient: "gradient-primary",
    },
    {
      icon: Route,
      title: "My Trips",
      description: "View all your trips",
      href: "/my-trips",
      gradient: "gradient-accent",
    },
  ];

  return (
    <Layout>
      <div className="gradient-hero min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Traveler"}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to plan your next adventure?
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${action.gradient} flex items-center justify-center group-hover:shadow-glow transition-shadow`}>
                    <action.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Trips */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Recent Trips
              </h2>
              <Link to="/my-trips" className="text-primary font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
                    <div className="h-6 bg-muted rounded w-2/3 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : recentTrips.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {recentTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/my-trips`}
                    className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-medium transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-foreground" />
                      </div>
                      {trip.is_favorite && (
                        <Heart className="w-5 h-5 text-accent fill-accent" />
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {trip.destination_city}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      From {trip.boarding_city}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trip.duration} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="w-4 h-4" />
                        ₹{trip.budget.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
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
            )}
          </div>

          {/* Profile Completion Card */}
          {profile && !profile.home_city && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Complete Your Profile
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Get better AI recommendations by adding your travel preferences
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
