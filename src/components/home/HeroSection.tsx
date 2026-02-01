import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Wallet, Sparkles, ArrowRight, Navigation, Play } from "lucide-react";
import heroImage from "@/assets/hero-mountains.jpg";

export function HeroSection() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
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
    <section className="relative min-h-screen overflow-hidden">
      {/* Parallax Background with stronger overlay */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImage}
          alt="Mountain highway at sunset"
          className="w-full h-[120%] object-cover"
        />
        {/* Stronger gradient overlays for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/70" />
        <div className="absolute inset-0 bg-foreground/5" />
      </motion.div>

      {/* Subtle animated gradient orbs */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 container mx-auto px-4 pt-28 md:pt-36 pb-20 min-h-screen flex flex-col justify-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-card/95 backdrop-blur-xl border border-border shadow-medium">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-foreground">AI-Powered Trip Planning</span>
            <span className="text-xs px-2.5 py-1 bg-accent/15 text-accent rounded-full font-semibold">New</span>
          </div>
        </motion.div>

        {/* Headline - Improved visibility */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-6 leading-tight"
        >
          <span className="text-foreground drop-shadow-sm">Your Journey,</span>
          <br />
          <span className="text-gradient-primary">Our Intelligence.</span>
        </motion.h1>

        {/* Tagline - Better contrast */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-foreground/80 text-center max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
        >
          AI-powered, budget-friendly, and traffic-aware trip planning 
          that adapts to your unique travel style.
        </motion.p>

        {/* Floating Trip Planner */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto w-full"
        >
          <form onSubmit={handleSubmit} className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 rounded-3xl blur-2xl opacity-40" />
            
            <div className="relative bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/80 p-6 md:p-8 shadow-elevated">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-6">
                {/* From */}
                <div className="relative group">
                  <label className="text-xs font-semibold text-foreground/70 mb-2 block uppercase tracking-wide">From</label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-transform group-focus-within:scale-110" />
                    <Input
                      placeholder="Departure city"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="pl-12 h-14 bg-background/80 border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base rounded-xl"
                    />
                  </div>
                </div>

                {/* To */}
                <div className="relative group">
                  <label className="text-xs font-semibold text-foreground/70 mb-2 block uppercase tracking-wide">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent transition-transform group-focus-within:scale-110" />
                    <Input
                      placeholder="Destination city"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="pl-12 h-14 bg-background/80 border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base rounded-xl"
                    />
                  </div>
                </div>

                {/* Days */}
                <div className="relative group">
                  <label className="text-xs font-semibold text-foreground/70 mb-2 block uppercase tracking-wide">Duration</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean transition-transform group-focus-within:scale-110" />
                    <Input
                      type="number"
                      placeholder="Days"
                      min="1"
                      max="30"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      className="pl-12 h-14 bg-background/80 border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base rounded-xl"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="relative group">
                  <label className="text-xs font-semibold text-foreground/70 mb-2 block uppercase tracking-wide">Budget</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest transition-transform group-focus-within:scale-110" />
                    <Input
                      type="number"
                      placeholder="₹ Amount"
                      min="1000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="pl-12 h-14 bg-background/80 border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto sm:px-12 h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow group rounded-xl"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Plan My Trip
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mt-12"
        >
          {[
            { color: "bg-green-500", text: "10,000+ Happy Travelers" },
            { color: "bg-primary", text: "500+ Destinations" },
            { color: "bg-accent", text: "4.9★ Average Rating" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="flex items-center gap-2.5 text-sm font-medium text-foreground/80"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg`} />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-7 h-11 border-2 border-foreground/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
