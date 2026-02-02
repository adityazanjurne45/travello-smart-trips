import { motion } from "framer-motion";
import { Sparkles, Map, Wallet, Hotel } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Smart AI",
    subtitle: "Itineraries",
    description: "Personalized plans based on your preferences",
  },
  {
    icon: Map,
    title: "Interactive",
    subtitle: "Maps",
    description: "Real-time route previews with traffic awareness",
  },
  {
    icon: Wallet,
    title: "Budget",
    subtitle: "Optimization",
    description: "Plan according to your desired budget",
  },
  {
    icon: Hotel,
    title: "Hotels &",
    subtitle: "Vehicles",
    description: "Find stays and transport options with ease",
  },
];

export function FeatureCards() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background blur decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            Everything You Need to
          </h2>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Explore with Ease
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            From AI-powered recommendations to real-time traffic updates,
            Travello has all the tools for a seamless travel style.
          </p>
        </motion.div>

        {/* Feature Cards - 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-5 md:p-6 border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                {/* Title */}
                <h3 className="font-display font-bold text-foreground text-base md:text-lg leading-tight">
                  {feature.title}
                </h3>
                <h3 className="font-display font-bold text-primary text-base md:text-lg mb-2">
                  {feature.subtitle}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
