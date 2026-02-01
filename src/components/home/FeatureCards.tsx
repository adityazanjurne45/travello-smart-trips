import { motion } from "framer-motion";
import { Sparkles, Map, Wallet, Hotel, Car, Shield, Zap, Route } from "lucide-react";
import featureAI from "@/assets/feature-ai.jpg";
import featureMaps from "@/assets/feature-maps.jpg";
import featureBudget from "@/assets/feature-budget.jpg";
import featureHotels from "@/assets/feature-hotels.jpg";

const features = [
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Smart suggestions for attractions, dining, and activities tailored to your preferences and travel style.",
    image: featureAI,
    color: "primary",
  },
  {
    icon: Map,
    title: "Smart Maps",
    description: "Interactive route visualization with real-time traffic updates and optimized navigation paths.",
    image: featureMaps,
    color: "ocean",
  },
  {
    icon: Wallet,
    title: "Budget Optimization",
    description: "Intelligent cost analysis ensuring you get the best experiences within your travel budget.",
    image: featureBudget,
    color: "accent",
  },
  {
    icon: Hotel,
    title: "Hotel & Vehicle",
    description: "Curated accommodations and transport options ranked by value, proximity, and user reviews.",
    image: featureHotels,
    color: "forest",
  },
];

const additionalFeatures = [
  {
    icon: Route,
    title: "Day-wise Itineraries",
    description: "Detailed schedules optimized for time and distance",
  },
  {
    icon: Car,
    title: "Traffic Awareness",
    description: "Real-time traffic integration for smarter routes",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your travel data is encrypted and protected",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Live alerts for weather, delays, and changes",
  },
];

export function FeatureCards() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            Powerful Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            Everything You Need to
            <br />
            <span className="text-gradient-primary">Plan Perfect Trips</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From AI-powered recommendations to real-time traffic updates, 
            Travello has all the tools for a seamless travel experience.
          </p>
        </motion.div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-500 shadow-soft hover:shadow-elevated card-hover">
                {/* Image with stronger overlay */}
                <div className="relative h-52 md:h-56 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark gradient overlay for text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-60" />
                  
                  {/* Floating Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute top-5 right-5 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
                  >
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h4 className="font-display font-bold text-foreground mb-2 text-base md:text-lg">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
