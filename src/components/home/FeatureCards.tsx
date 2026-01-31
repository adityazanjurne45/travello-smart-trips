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
    gradient: "from-primary/20 to-teal-light",
  },
  {
    icon: Map,
    title: "Smart Maps",
    description: "Interactive route visualization with real-time traffic updates and optimized navigation paths.",
    image: featureMaps,
    gradient: "from-ocean/20 to-primary/10",
  },
  {
    icon: Wallet,
    title: "Budget Optimization",
    description: "Intelligent cost analysis ensuring you get the best experiences within your travel budget.",
    image: featureBudget,
    gradient: "from-accent/20 to-coral-light",
  },
  {
    icon: Hotel,
    title: "Hotel & Vehicle",
    description: "Curated accommodations and transport options ranked by value, proximity, and user reviews.",
    image: featureHotels,
    gradient: "from-forest/20 to-primary/10",
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
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to
            <br />
            <span className="text-gradient-primary">Plan Perfect Trips</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered recommendations to real-time traffic updates, 
            Travello has all the tools for a seamless travel experience.
          </p>
        </motion.div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
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
              <div className="relative h-full rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-soft hover:shadow-elevated">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} to-transparent opacity-60`} />
                  
                  {/* Floating Icon */}
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute bottom-4 right-4 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
                  >
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display font-semibold text-foreground mb-1">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
