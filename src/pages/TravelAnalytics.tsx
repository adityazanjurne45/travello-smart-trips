import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, MapPin, Calendar, Wallet, TrendingUp, Globe, Users
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;

export default function TravelAnalytics() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTrips(data);
        setLoading(false);
      });
  }, [user]);

  const totalTrips = trips.length;
  const totalDays = trips.reduce((s, t) => s + t.duration, 0);
  const totalBudget = trips.reduce((s, t) => s + t.budget, 0);
  const avgBudget = totalTrips > 0 ? Math.round(totalBudget / totalTrips) : 0;
  const uniqueCities = [...new Set(trips.map(t => t.destination_city))];
  const avgDuration = totalTrips > 0 ? (totalDays / totalTrips).toFixed(1) : 0;

  // Most visited
  const cityCount: Record<string, number> = {};
  trips.forEach(t => { cityCount[t.destination_city] = (cityCount[t.destination_city] || 0) + 1; });
  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Monthly trend
  const monthlyTrips: Record<string, number> = {};
  trips.forEach(t => {
    const month = new Date(t.created_at).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    monthlyTrips[month] = (monthlyTrips[month] || 0) + 1;
  });

  const stats = [
    { icon: BarChart3, label: "Total Trips", value: totalTrips, color: "text-primary" },
    { icon: Globe, label: "Cities Explored", value: uniqueCities.length, color: "text-accent" },
    { icon: Calendar, label: "Total Days", value: totalDays, color: "text-primary" },
    { icon: Wallet, label: "Avg Budget", value: `₹${avgBudget.toLocaleString()}`, color: "text-accent" },
    { icon: TrendingUp, label: "Avg Duration", value: `${avgDuration} days`, color: "text-primary" },
    { icon: Users, label: "Total Budget", value: `₹${(totalBudget / 1000).toFixed(0)}k`, color: "text-accent" },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="gradient-hero min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Travel Analytics</h1>
            <p className="text-muted-foreground">Your personal travel insights</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Top Destinations */}
          <div className="bg-card rounded-2xl p-6 border border-border mb-6">
            <h2 className="font-display text-xl font-semibold mb-4">Top Destinations</h2>
            {topCities.length > 0 ? (
              <div className="space-y-3">
                {topCities.map(([city, count], i) => (
                  <div key={city} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" /> {city}
                        </span>
                        <span className="text-sm text-muted-foreground">{count} trip{count > 1 ? "s" : ""}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(count / (topCities[0]?.[1] || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No trips yet</p>
            )}
          </div>

          {/* Monthly Activity */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-display text-xl font-semibold mb-4">Monthly Activity</h2>
            {Object.keys(monthlyTrips).length > 0 ? (
              <div className="flex items-end gap-2 h-32">
                {Object.entries(monthlyTrips).slice(-8).map(([month, count]) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-primary/80 min-h-[8px] transition-all"
                      style={{ height: `${(count / Math.max(...Object.values(monthlyTrips))) * 100}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">No activity data yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
