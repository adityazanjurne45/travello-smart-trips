import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyTripsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-12 border border-border text-center"
    >
      {/* Illustration */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10" />
        
        {/* Main icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
        >
          <Compass className="w-12 h-12 text-primary" />
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -left-2 top-4 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"
        >
          <MapPin className="w-4 h-4 text-accent" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -right-2 bottom-4 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-primary" />
        </motion.div>
      </div>

      {/* Content */}
      <h3 className="font-display text-2xl font-bold text-foreground mb-3">
        No Trips Yet
      </h3>
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
        You haven't planned any trips yet. Start planning your first adventure and let AI create the perfect itinerary for you!
      </p>

      {/* CTA Button */}
      <Button asChild size="lg" className="gradient-primary shadow-glow">
        <Link to="/plan-trip">
          <MapPin className="w-5 h-5 mr-2" />
          Plan Your First Trip
        </Link>
      </Button>

      {/* Features hint */}
      <div className="mt-10 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground mb-4">What you'll get:</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
            ✨ AI-powered itineraries
          </span>
          <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
            🏨 Hotel recommendations
          </span>
          <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
            📍 Top attractions
          </span>
        </div>
      </div>
    </motion.div>
  );
}
