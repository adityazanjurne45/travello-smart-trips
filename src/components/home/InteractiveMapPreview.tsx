import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Car, Clock, Navigation, MapPin, Send } from "lucide-react";

export function InteractiveMapPreview() {
  const [vehiclePosition, setVehiclePosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animate vehicle along route
  useEffect(() => {
    if (!isVisible) return;

    const intervalId = setInterval(() => {
      setVehiclePosition((prev) => {
        const next = prev + 0.8;
        return next > 100 ? 0 : next;
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [isVisible]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsVisible(true)}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            Interactive Trip Map
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Visualize your journey with real-time route animations,
            traffic indicators, and distance calculations.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Map Card */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-elevated">
            {/* Route Info Panel - Top Left */}
            <div className="absolute top-4 left-4 z-20 p-3 bg-card/95 backdrop-blur-md rounded-xl border border-border shadow-lg">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">3 hr 45min</span>
                <span className="text-muted-foreground">· 1158 km</span>
              </div>
            </div>

            {/* Send/Share Button - Top Right */}
            <div className="absolute top-4 right-4 z-20">
              <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <Send className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* From Location Panel - Left */}
            <div className="absolute top-20 left-4 z-20 p-3 bg-card/95 backdrop-blur-md rounded-xl border border-border shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Mumbai</p>
                  <p className="text-xs text-muted-foreground">Pune</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center ml-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Map Visualization */}
            <div className="h-[400px] md:h-[500px] relative bg-gradient-to-br from-green-100/50 via-blue-50/30 to-green-100/50 overflow-hidden">
              {/* Decorative map background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />

              {/* Route Path SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
                {/* Main Route Path */}
                <motion.path
                  d="M 100 150 C 200 180 250 200 350 220 S 450 260 500 300 S 600 380 700 420"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Traffic overlay segments */}
                <motion.path
                  d="M 350 220 S 450 260 500 300"
                  fill="none"
                  stroke="hsl(30 100% 50%)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
                />
                
                <motion.path
                  d="M 500 300 S 600 380 700 420"
                  fill="none"
                  stroke="hsl(0 80% 55%)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
                />

                {/* Start Point - Mumbai */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                >
                  <circle cx="100" cy="150" r="12" fill="hsl(var(--primary))" />
                  <circle cx="100" cy="150" r="5" fill="white" />
                </motion.g>

                {/* End Point - Mahabaleshwar */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                >
                  <circle cx="700" cy="420" r="16" fill="hsl(var(--primary))" />
                  <circle cx="700" cy="420" r="6" fill="white" />
                </motion.g>
              </svg>

              {/* Animated Vehicle */}
              <motion.div
                className="absolute z-10"
                style={{
                  left: `${12 + (vehiclePosition / 100) * 75}%`,
                  top: `${30 + (vehiclePosition / 100) * 50}%`,
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg">
                  <Car className="w-5 h-5 text-primary" />
                </div>
              </motion.div>

              {/* Waypoint Label - Thane */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-[38%] left-[42%]"
              >
                <div className="flex items-center gap-1.5 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-border shadow-md">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Thane</span>
                </div>
              </motion.div>

              {/* Camera Icon */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute top-[55%] right-[25%]"
              >
                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shadow-md">
                  <span className="text-xs">📷</span>
                </div>
              </motion.div>

              {/* Destination Label - Mahabaleshwar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-[8%] right-[8%]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground bg-card/90 px-2 py-1 rounded-lg">Mahabaleshwar</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
