import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Car, Bike, Clock, Navigation, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Custom vehicle icons
const createVehicleIcon = (type: "car" | "bike") => {
  return L.divIcon({
    className: "custom-vehicle-icon",
    html: `
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          ${type === "car" 
            ? '<path d="M5 11h14l1-3H4l1 3zm11 5a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4zm12-5.5V16a1 1 0 01-1 1h-1a2 2 0 01-4 0H10a2 2 0 01-4 0H5a1 1 0 01-1-1v-5.5l1.5-4.5a1 1 0 01.95-.7h11.1a1 1 0 01.95.7l1.5 4.5z"/>'
            : '<path d="M19 10h-1V8.95a1 1 0 00-.42-.8L14.12 5.7a3 3 0 00-4.24 0L6.42 8.15a1 1 0 00-.42.8V10H5a1 1 0 100 2h1v5a2 2 0 002 2h8a2 2 0 002-2v-5h1a1 1 0 100-2zm-7-3a1 1 0 011 0l2 1.5H10L12 7zm2 10H10v-5h4v5z"/>'
          }
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const startIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="w-8 h-8 rounded-full bg-forest flex items-center justify-center shadow-lg border-2 border-white">
      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const endIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg border-2 border-white">
      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Route coordinates (Mumbai to Pune example)
const routeCoordinates: [number, number][] = [
  [19.076, 72.8777], // Mumbai
  [19.0144, 72.8479],
  [18.9667, 72.8194],
  [18.8523, 73.0129],
  [18.7167, 73.2036],
  [18.5204, 73.8567], // Pune
];

// Animated vehicle component
function AnimatedVehicle({ 
  route, 
  vehicleType 
}: { 
  route: [number, number][]; 
  vehicleType: "car" | "bike";
}) {
  const [position, setPosition] = useState<[number, number]>(route[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    let startTime: number;
    const duration = 4000; // 4 seconds per segment

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress >= 1) {
        setRouteIndex((prev) => {
          const next = (prev + 1) % (route.length - 1);
          return next;
        });
        startTime = timestamp;
      } else {
        const currentIndex = routeIndex;
        const nextIndex = (currentIndex + 1) % route.length;
        
        const lat = route[currentIndex][0] + (route[nextIndex][0] - route[currentIndex][0]) * progress;
        const lng = route[currentIndex][1] + (route[nextIndex][1] - route[currentIndex][1]) * progress;
        
        setPosition([lat, lng]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [routeIndex, route]);

  return <Marker position={position} icon={createVehicleIcon(vehicleType)} />;
}

// Map bounds fitter
function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, coordinates]);

  return null;
}

export function InteractiveMapPreview() {
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [isVisible, setIsVisible] = useState(false);

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
            <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 p-1 bg-card/90 backdrop-blur-md rounded-full border border-border shadow-lg">
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
            <div className="absolute bottom-4 left-4 z-[1000] p-4 bg-card/90 backdrop-blur-md rounded-2xl border border-border shadow-lg max-w-xs">
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
                  <span className="text-sm font-medium">3h 15m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground">148 km</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">Low Traffic</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[500px]">
              {isVisible && (
                <MapContainer
                  center={[18.8, 73.3]}
                  zoom={9}
                  className="h-full w-full"
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <FitBounds coordinates={routeCoordinates} />
                  
                  {/* Route Line */}
                  <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                      color: "hsl(174, 62%, 40%)",
                      weight: 5,
                      opacity: 0.8,
                      dashArray: "10, 10",
                    }}
                  />
                  
                  {/* Solid route overlay */}
                  <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                      color: "hsl(174, 62%, 50%)",
                      weight: 3,
                      opacity: 1,
                    }}
                  />

                  {/* Start Marker */}
                  <Marker position={routeCoordinates[0]} icon={startIcon} />
                  
                  {/* End Marker */}
                  <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={endIcon} />
                  
                  {/* Animated Vehicle */}
                  <AnimatedVehicle route={routeCoordinates} vehicleType={vehicleType} />
                </MapContainer>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
