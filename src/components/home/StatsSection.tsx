import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Users, MapPin, Clock } from "lucide-react";

const stats = [
  { value: 10000, suffix: "+", label: "Happy Travelers", icon: Users, color: "primary" },
  { value: 500, suffix: "+", label: "Destinations", icon: MapPin, color: "accent" },
  { value: 4.9, suffix: "", label: "User Rating", icon: Star, isDecimal: true, color: "golden" },
  { value: 24, suffix: "/7", label: "AI Support", icon: Clock, color: "ocean" },
];

function AnimatedCounter({ 
  value, 
  suffix, 
  isDecimal = false 
}: { 
  value: number; 
  suffix: string; 
  isDecimal?: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 md:py-24 bg-card border-y border-border relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 mb-5 group-hover:shadow-glow transition-all duration-300"
              >
                <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </motion.div>
              <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  isDecimal={stat.isDecimal}
                />
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
