import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Users, MapPin, Clock } from "lucide-react";

const stats = [
  { value: 10000, suffix: "+", label: "Happy Travelers", icon: Users },
  { value: 500, suffix: "+", label: "Destinations", icon: MapPin },
  { value: 4.9, suffix: "", label: "User Rating", icon: Star, isDecimal: true },
  { value: 24, suffix: "/7", label: "AI Support", icon: Clock },
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
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-4xl font-bold text-foreground mb-1">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  isDecimal={stat.isDecimal}
                />
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
