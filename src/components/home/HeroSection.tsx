import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Wallet, ArrowRight, Navigation } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";

export function HeroSection() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    days: "",
    budget: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImage}
          alt="Mountain highway at sunset"
          className="w-full h-[120%] object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 pt-28 md:pt-32 pb-16">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-foreground"
        >
          Your Smarter. Travel Better.
        </motion.h1>

        {/* Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-block px-6 py-3 rounded-full bg-primary/90 backdrop-blur-sm">
            <p className="text-sm md:text-base text-primary-foreground text-center font-medium">
              AI-powered, budget-friendly, and traffic-aware trip planning tailored to your unique travel style.
            </p>
          </div>
        </motion.div>

        {/* Quick Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border p-4 md:p-6 shadow-elevated">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                {/* From */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">From</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input
                      placeholder="Departure city"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="pl-10 h-11 bg-background border-border rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* To */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input
                      placeholder="Destination city"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="pl-10 h-11 bg-background border-border rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Duration</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Days"
                      min="1"
                      max="30"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      className="pl-10 h-11 bg-background border-border rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Budget</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="₹ Amount"
                      min="1000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="pl-10 h-11 bg-background border-border rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-all rounded-xl group"
                >
                  Plan My Trip
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
