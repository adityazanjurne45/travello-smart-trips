import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Camera, Car, Bike, MapPin, Navigation, Utensils, Eye, EyeOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DestinationImage } from "./DestinationImage";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom creative icons with emojis
const createCreativeIcon = (type: "hotel" | "attraction" | "start" | "end" | "transport" | "food", label?: string) => {
  const configs = {
    hotel: { emoji: "🏨", bg: "#3b82f6", shadow: "rgba(59, 130, 246, 0.4)" },
    attraction: { emoji: "📍", bg: "#f59e0b", shadow: "rgba(245, 158, 11, 0.4)" },
    start: { emoji: "🚀", bg: "#22c55e", shadow: "rgba(34, 197, 94, 0.4)" },
    end: { emoji: "🎯", bg: "#ef4444", shadow: "rgba(239, 68, 68, 0.4)" },
    transport: { emoji: "🚗", bg: "#8b5cf6", shadow: "rgba(139, 92, 246, 0.4)" },
    food: { emoji: "🍴", bg: "#ec4899", shadow: "rgba(236, 72, 153, 0.4)" },
  };

  const config = configs[type];

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: ${config.bg};
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px ${config.shadow};
          border: 3px solid white;
          font-size: 18px;
          transform: rotate(-10deg);
          transition: transform 0.2s;
        ">
          ${config.emoji}
        </div>
        ${label ? `
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">${label}</div>
        ` : ''}
      </div>
    `,
    className: "creative-marker",
    iconSize: [44, 56],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
};

// City coordinates database
const cityCoordinates: Record<string, [number, number]> = {
  "mumbai": [19.0760, 72.8777],
  "delhi": [28.6139, 77.2090],
  "new delhi": [28.6139, 77.2090],
  "bangalore": [12.9716, 77.5946],
  "bengaluru": [12.9716, 77.5946],
  "hyderabad": [17.3850, 78.4867],
  "chennai": [13.0827, 80.2707],
  "kolkata": [22.5726, 88.3639],
  "pune": [18.5204, 73.8567],
  "ahmedabad": [23.0225, 72.5714],
  "jaipur": [26.9124, 75.7873],
  "goa": [15.2993, 74.1240],
  "panaji": [15.4909, 73.8278],
  "shimla": [31.1048, 77.1734],
  "manali": [32.2432, 77.1892],
  "rishikesh": [30.0869, 78.2676],
  "varanasi": [25.3176, 82.9739],
  "udaipur": [24.5854, 73.7125],
  "jodhpur": [26.2389, 73.0243],
  "jaisalmer": [26.9157, 70.9083],
  "amritsar": [31.6340, 74.8723],
  "kerala": [10.8505, 76.2711],
  "kochi": [9.9312, 76.2673],
  "mysore": [12.2958, 76.6394],
  "ooty": [11.4102, 76.6950],
  "kodaikanal": [10.2381, 77.4892],
  "munnar": [10.0889, 77.0595],
  "mahabaleshwar": [17.9307, 73.6477],
  "lonavala": [18.7546, 73.4062],
  "darjeeling": [27.0360, 88.2627],
  "gangtok": [27.3389, 88.6065],
  "leh": [34.1526, 77.5771],
  "agra": [27.1767, 78.0081],
  "dubai": [25.2048, 55.2708],
  "singapore": [1.3521, 103.8198],
  "bangkok": [13.7563, 100.5018],
  "paris": [48.8566, 2.3522],
  "london": [51.5074, -0.1278],
  "tokyo": [35.6762, 139.6503],
  "bali": [-8.3405, 115.0920],
};

function getCityCoordinates(city: string): [number, number] | null {
  const normalized = city.toLowerCase().trim();
  if (cityCoordinates[normalized]) {
    return cityCoordinates[normalized];
  }
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  return null;
}

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
}

interface MapLocation {
  name: string;
  type: "hotel" | "attraction" | "start" | "end" | "transport" | "food";
  coordinates: [number, number];
  description?: string;
}

interface EnhancedMapProps {
  boardingCity: string;
  destinationCity: string;
  hotels?: { name: string; location: string }[];
  attractions?: { name: string; description: string }[];
  className?: string;
}

export function EnhancedMap({
  boardingCity,
  destinationCity,
  hotels = [],
  attractions = [],
  className = "",
}: EnhancedMapProps) {
  const [mapStyle, setMapStyle] = useState<"satellite" | "street">("satellite");
  const [showHotels, setShowHotels] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isMobileMapExpanded, setIsMobileMapExpanded] = useState(false);
  
  const startCoords = getCityCoordinates(boardingCity);
  const endCoords = getCityCoordinates(destinationCity);
  
  if (!startCoords || !endCoords) {
    return (
      <div className={`bg-muted rounded-2xl flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Map coordinates not available for these locations</p>
        </div>
      </div>
    );
  }

  const generateNearbyCoordinates = (base: [number, number], index: number, spread: number = 0.02): [number, number] => {
    const angle = (index * 60) * (Math.PI / 180);
    const distance = spread * (0.5 + Math.random() * 0.5);
    return [
      base[0] + Math.cos(angle) * distance,
      base[1] + Math.sin(angle) * distance,
    ];
  };

  const locations: MapLocation[] = [
    { name: boardingCity, type: "start", coordinates: startCoords, description: "Your starting point" },
    { name: destinationCity, type: "end", coordinates: endCoords, description: "Your destination" },
    ...(showHotels ? hotels.slice(0, 3).map((hotel, i) => ({
      name: hotel.name,
      type: "hotel" as const,
      coordinates: generateNearbyCoordinates(endCoords, i, 0.015),
      description: hotel.location,
    })) : []),
    ...(showAttractions ? attractions.slice(0, 5).map((attraction, i) => ({
      name: attraction.name,
      type: "attraction" as const,
      coordinates: generateNearbyCoordinates(endCoords, i + 3, 0.025),
      description: attraction.description,
    })) : []),
  ];

  const bounds = L.latLngBounds([startCoords, endCoords]);
  locations.forEach(loc => {
    if (loc.coordinates) {
      bounds.extend(loc.coordinates);
    }
  });

  const routePath: [number, number][] = [
    startCoords,
    [(startCoords[0] + endCoords[0]) / 2 + 0.1, (startCoords[1] + endCoords[1]) / 2],
    endCoords,
  ];

  const tileUrls = {
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  // City taglines
  const getTagline = (city: string) => {
    const taglines: Record<string, string> = {
      goa: "Beach paradise awaits",
      jaipur: "The Pink City of royalty",
      udaipur: "City of Lakes",
      kerala: "God's Own Country",
      manali: "Adventure in the Himalayas",
      varanasi: "Spiritual capital of India",
      paris: "City of Love",
      dubai: "City of the Future",
      bali: "Island of Gods",
    };
    const normalized = city.toLowerCase();
    for (const [key, tagline] of Object.entries(taglines)) {
      if (normalized.includes(key)) return tagline;
    }
    return "Explore the beauty";
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-border ${className}`}>
      {/* Mobile Expand Button */}
      <button
        onClick={() => setIsMobileMapExpanded(!isMobileMapExpanded)}
        className="md:hidden absolute top-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium border border-border shadow-lg"
      >
        {isMobileMapExpanded ? "Collapse" : "Expand"} Map
        <ChevronDown className={`w-4 h-4 transition-transform ${isMobileMapExpanded ? "rotate-180" : ""}`} />
      </button>

      {/* Map Style Toggle */}
      <div className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg p-1 flex gap-1">
        <button
          onClick={() => setMapStyle("satellite")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mapStyle === "satellite" 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapStyle("street")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mapStyle === "street" 
              ? "bg-primary text-primary-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Street
        </button>
      </div>

      {/* Filter Toggles */}
      <div className="absolute top-16 right-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg p-3 space-y-2">
        <button
          onClick={() => setShowHotels(!showHotels)}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
            showHotels ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "text-muted-foreground"
          }`}
        >
          {showHotels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          🏨 Hotels
        </button>
        <button
          onClick={() => setShowAttractions(!showAttractions)}
          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
            showAttractions ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "text-muted-foreground"
          }`}
        >
          {showAttractions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          📍 Attractions
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg overflow-hidden">
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          Legend
          <ChevronDown className={`w-4 h-4 transition-transform ${isLegendOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isLegendOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-3 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🚀</span>
                <span className="text-muted-foreground">Start Point</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🎯</span>
                <span className="text-muted-foreground">Destination</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🏨</span>
                <span className="text-muted-foreground">Hotels</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">📍</span>
                <span className="text-muted-foreground">Attractions</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-lg">🚗</span>
                <span className="text-muted-foreground">Transport</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Destination Preview Card */}
      <div className="absolute bottom-4 right-4 z-[1000] hidden md:block">
        <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-lg overflow-hidden w-64">
          <div className="h-24 relative">
            <DestinationImage destination={destinationCity} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-3 right-3">
              <h4 className="font-semibold text-white text-sm">{destinationCity}</h4>
              <p className="text-white/80 text-xs">{getTagline(destinationCity)}</p>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{hotels.length} Hotels</span>
            <span>{attractions.length} Places</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={endCoords}
        zoom={10}
        style={{ height: isMobileMapExpanded ? "600px" : "400px", width: "100%", minHeight: "400px" }}
        scrollWheelZoom={true}
        className="md:!h-full"
      >
        <TileLayer
          url={tileUrls[mapStyle]}
          attribution={mapStyle === "satellite" 
            ? '&copy; Esri'
            : '&copy; OpenStreetMap contributors'
          }
        />
        
        <FitBounds bounds={bounds} />
        
        {/* Route Line */}
        <Polyline
          positions={routePath}
          pathOptions={{
            color: "#22c55e",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10",
          }}
        />
        
        {/* Markers */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.coordinates}
            icon={createCreativeIcon(location.type)}
            eventHandlers={{
              click: () => setSelectedLocation(location),
            }}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {location.type === "hotel" ? "🏨" : 
                     location.type === "attraction" ? "📍" :
                     location.type === "start" ? "🚀" : "🎯"}
                  </span>
                  <h4 className="font-semibold text-sm">{location.name}</h4>
                </div>
                {location.description && (
                  <p className="text-xs text-gray-600">{location.description}</p>
                )}
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-muted capitalize">
                  {location.type}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
