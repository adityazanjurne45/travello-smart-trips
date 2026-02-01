import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Wallet, 
  Heart, 
  ChevronRight,
  Sparkles,
  Route,
  TrendingUp,
  Globe,
  Clock,
  Star
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;
type Profile = Tables<"profiles">;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const [profileRes, tripsRes, countRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
        supabase.from("trips").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (tripsRes.data) setRecentTrips(tripsRes.data);
      if (countRes.count) setTotalTrips(countRes.count);
      setLoading(false);
    }

    loadData();
  }, [user]);

  const quickActions = [
    {
      icon: Plus,
      title: "Plan New Trip",
      description: "Start your next adventure with AI",
      href: "/plan-trip",
      gradient: "gradient-primary",
      glowClass: "group-hover:shadow-glow",
    },
    {
      icon: Route,
      title: "My Trips",
      description: "View and manage all your trips",
      href: "/my-trips",
      gradient: "gradient-accent",
      glowClass: "group-hover:shadow-glow-accent",
    },
  ];

  const stats = [
    { icon: Globe, label: "Total Trips", value: totalTrips, color: "primary" },
    { icon: Heart, label: "Favorites", value: recentTrips.filter(t => t.is_favorite).length, color: "accent" },
    { icon: TrendingUp, label: "This Month", value: recentTrips.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).length, color: "ocean" },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Layout>
      <div className="gradient-hero min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
              <div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground font-medium mb-1"
                >
                  {getTimeOfDay()}
                </motion.p>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Welcome back, {profile?.full_name?.split(" ")[0] || "Traveler"}! 👋
                </h1>
              </div>
              <Button asChild className="gradient-primary shadow-soft hover:shadow-glow transition-all w-fit">
                <Link to="/plan-trip">
                  <Plus className="w-4 h-4 mr-2" />
                  New Trip
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-lg">
              Ready to plan your next adventure?
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-4 md:gap-6 mb-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-soft hover:shadow-medium transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-5 md:gap-6 mb-12"
          >
            {quickActions.map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  to={action.href}
                  className="group block p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 card-hover"
                >
                  <div className="flex items-start gap-5">
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${action.gradient} flex items-center justify-center shadow-soft ${action.glowClass} transition-shadow`}
                    >
                      <action.icon className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Trips */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Recent Trips
              </h2>
              <Link to="/my-trips" className="text-primary font-semibold hover:underline flex items-center gap-1 group">
                View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
                    <div className="h-6 bg-muted rounded w-2/3 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : recentTrips.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-5">
                {recentTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/trip/${trip.id}`}
                      className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all card-hover"
                    >
                      {/* Gradient header */}
                      <div className="h-24 gradient-primary relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/10 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div className="w-12 h-12 rounded-xl bg-card/90 backdrop-blur flex items-center justify-center shadow-lg">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          {trip.is_favorite && (
                            <div className="w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center">
                              <Heart className="w-4 h-4 text-accent fill-accent" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {trip.destination_city}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          From {trip.boarding_city}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            {trip.duration} days
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Wallet className="w-4 h-4 text-accent" />
                            ₹{trip.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-12 border border-border text-center"
              >
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  No trips yet
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start planning your first adventure with AI-powered recommendations tailored just for you.
                </p>
                <Button asChild className="gradient-primary px-8 h-12 text-lg font-semibold shadow-glow">
                  <Link to="/plan-trip">
                    <Plus className="w-5 h-5 mr-2" />
                    Plan Your First Trip
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Profile Completion Card */}
          {profile && !profile.home_city && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 border border-primary/20"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                  <Star className="w-7 h-7 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-muted-foreground">
                    Get better AI recommendations by adding your travel preferences
                  </p>
                </div>
                <Button asChild variant="outline" className="border-primary/30 hover:bg-primary/10">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
