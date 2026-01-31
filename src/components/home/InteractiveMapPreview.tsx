import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Car, Bike, Clock, Navigation, MapPin, Route as RouteIcon } from "lucide-react";

// Route points for visualization
const routePoints = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Lonavala", lat: 18.7546, lng: 73.4062 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
];

export function InteractiveMapPreview() {
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [vehiclePosition, setVehiclePosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();

  // Animate vehicle along route
  useEffect(() => {
    if (!isVisible) return;

    const animate = () => {
      setVehiclePosition((prev) => {
        const next = prev + 0.5;
        return next > 100 ? 0 : next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    const intervalId = setInterval(() => {
      setVehiclePosition((prev) => {
        const next = prev + 1;
        return next > 100 ? 0 : next;
      });
    }, 50);

    return () => {
      clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsVisible(true)}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Live Route Preview
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interactive <span className="text-gradient-primary">Smart Maps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize your journey with real-time route animations, traffic indicators, 
            and distance calculations.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />

          {/* Map Card */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-elevated">
            {/* Vehicle Toggle */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 p-1 bg-card/90 backdrop-blur-md rounded-full border border-border shadow-lg">
              <button
                onClick={() => setVehicleType("car")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  vehicleType === "car"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Car className="w-4 h-4" />
                <span className="text-sm font-medium">Car</span>
              </button>
              <button
                onClick={() => setVehicleType("bike")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  vehicleType === "bike"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bike className="w-4 h-4" />
                <span className="text-sm font-medium">Bike</span>
              </button>
            </div>

            {/* Route Info Panel */}
            <div className="absolute bottom-4 left-4 z-20 p-4 bg-card/90 backdrop-blur-md rounded-2xl border border-border shadow-lg max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-semibold text-foreground">Mumbai</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-semibold text-foreground">Pune</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{vehicleType === "car" ? "3h 15m" : "4h 30m"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground">148 km</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">Low Traffic</span>
                </div>
              </div>
            </div>

            {/* Map Visualization */}
            <div className="h-[500px] relative bg-gradient-to-br from-muted via-background to-muted overflow-hidden">
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px"
                }}
              />

              {/* Route Path SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
                {/* Route Path - Dashed */}
                <motion.path
                  d="M 150 100 Q 300 150 400 200 T 650 400"
                  fill="none"
                  stroke="hsl(var(--primary) / 0.3)"
                  strokeWidth="8"
                  strokeDasharray="20 10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Route Path - Solid Glow */}
                <motion.path
                  d="M 150 100 Q 300 150 400 200 T 650 400"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                  filter="url(#glow)"
                />

                {/* Glow Filter */}
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Start Point */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                >
                  <circle cx="150" cy="100" r="20" fill="hsl(var(--forest))" opacity="0.2" />
                  <circle cx="150" cy="100" r="12" fill="hsl(var(--forest))" />
                  <circle cx="150" cy="100" r="5" fill="white" />
                </motion.g>

                {/* Waypoint */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                >
                  <circle cx="400" cy="200" r="15" fill="hsl(var(--primary))" opacity="0.2" />
                  <circle cx="400" cy="200" r="8" fill="hsl(var(--primary))" />
                  <circle cx="400" cy="200" r="3" fill="white" />
                </motion.g>

                {/* End Point */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                >
                  <circle cx="650" cy="400" r="20" fill="hsl(var(--accent))" opacity="0.2" />
                  <circle cx="650" cy="400" r="12" fill="hsl(var(--accent))" />
                  <circle cx="650" cy="400" r="5" fill="white" />
                </motion.g>
              </svg>

              {/* Animated Vehicle */}
              <motion.div
                className="absolute z-10"
                style={{
                  left: `${15 + (vehiclePosition / 100) * 55}%`,
                  top: `${10 + (vehiclePosition / 100) * 65}%`,
                }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-glow"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {vehicleType === "car" ? (
                    <Car className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <Bike className="w-6 h-6 text-primary-foreground" />
                  )}
                </motion.div>
              </motion.div>

              {/* City Labels */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-[8%] left-[15%] text-center"
              >
                <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-md">
                  <p className="font-semibold text-foreground text-sm">Mumbai</p>
                  <p className="text-xs text-muted-foreground">Start</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-[35%] left-[48%] text-center"
              >
                <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-md">
                  <p className="font-semibold text-foreground text-sm">Lonavala</p>
                  <p className="text-xs text-muted-foreground">Waypoint</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="absolute bottom-[12%] right-[15%] text-center"
              >
                <div className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-md">
                  <p className="font-semibold text-foreground text-sm">Pune</p>
                  <p className="text-xs text-muted-foreground">Destination</p>
                </div>
              </motion.div>

              {/* Distance/Time Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute top-[22%] left-[32%]"
              >
                <div className="bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-full border border-primary/20">
                  <p className="text-xs text-primary font-medium">65 km • 1h 30m</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="absolute bottom-[35%] right-[28%]"
              >
                <div className="bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-full border border-primary/20">
                  <p className="text-xs text-primary font-medium">83 km • 1h 45m</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
