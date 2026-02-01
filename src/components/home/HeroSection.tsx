import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Wallet, Sparkles, ArrowRight, Navigation } from "lucide-react";
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

  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFloating((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
      </motion.div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 container mx-auto px-4 pt-32 pb-20 min-h-screen flex flex-col justify-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-md border border-primary/20 shadow-lg">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">AI-Powered Trip Planning</span>
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">New</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6"
        >
          <span className="text-foreground">Your Journey,</span>
          <br />
          <span className="text-gradient-primary">Our Intelligence.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground text-center max-w-2xl mx-auto mb-12"
        >
          AI-powered, budget-friendly, and traffic-aware trip planning 
          that adapts to your unique travel style.
        </motion.p>

        {/* Floating Trip Planner */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: isFloating ? -5 : 0, 
            scale: 1 
          }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            y: { duration: 3, ease: "easeInOut" }
          }}
          className="max-w-4xl mx-auto w-full"
        >
          <form onSubmit={handleSubmit} className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            
            <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-6 shadow-elevated">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* From */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-transform group-focus-within:scale-110" />
                    <Input
                      placeholder="Departure city"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* To */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent transition-transform group-focus-within:scale-110" />
                    <Input
                      placeholder="Destination city"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Days */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Duration</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean transition-transform group-focus-within:scale-110" />
                    <Input
                      type="number"
                      placeholder="Days"
                      min="1"
                      max="30"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="relative group">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Budget</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest transition-transform group-focus-within:scale-110" />
                    <Input
                      type="number"
                      placeholder="₹ Amount"
                      min="1000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto md:px-12 h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow group"
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
          className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>10,000+ Happy Travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>500+ Destinations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>4.9★ Average Rating</span>
          </div>
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
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2"
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
