import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hotel, Camera, MapPin, Navigation } from "lucide-react";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons
const createCustomIcon = (color: string, iconType: "hotel" | "attraction" | "start" | "end") => {
  const iconSvg = {
    hotel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    attraction: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    start: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
    end: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  };

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <div style="width: 18px; height: 18px;">
          ${iconSvg[iconType]}
        </div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

// City coordinates database
const cityCoordinates: Record<string, [number, number]> = {
  // Major Indian Cities
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
  "surat": [21.1702, 72.8311],
  "lucknow": [26.8467, 80.9462],
  "kanpur": [26.4499, 80.3319],
  "nagpur": [21.1458, 79.0882],
  "indore": [22.7196, 75.8577],
  "thane": [19.2183, 72.9781],
  "bhopal": [23.2599, 77.4126],
  "visakhapatnam": [17.6868, 83.2185],
  "vizag": [17.6868, 83.2185],
  "patna": [25.5941, 85.1376],
  "vadodara": [22.3072, 73.1812],
  "coimbatore": [11.0168, 76.9558],
  "ludhiana": [30.9010, 75.8573],
  "kochi": [9.9312, 76.2673],
  "agra": [27.1767, 78.0081],
  "goa": [15.2993, 74.1240],
  "panaji": [15.4909, 73.8278],
  "shimla": [31.1048, 77.1734],
  "manali": [32.2432, 77.1892],
  "dharamshala": [32.2190, 76.3234],
  "rishikesh": [30.0869, 78.2676],
  "haridwar": [29.9457, 78.1642],
  "varanasi": [25.3176, 82.9739],
  "udaipur": [24.5854, 73.7125],
  "jodhpur": [26.2389, 73.0243],
  "jaisalmer": [26.9157, 70.9083],
  "amritsar": [31.6340, 74.8723],
  "chandigarh": [30.7333, 76.7794],
  "mysore": [12.2958, 76.6394],
  "madurai": [9.9252, 78.1198],
  "tiruchirappalli": [10.7905, 78.7047],
  "vijayawada": [16.5062, 80.6480],
  "raipur": [21.2514, 81.6296],
  "ranchi": [23.3441, 85.3096],
  "guwahati": [26.1445, 91.7362],
  "bhubaneswar": [20.2961, 85.8245],
  "thiruvananthapuram": [8.5241, 76.9366],
  "nainital": [29.3919, 79.4542],
  "mussoorie": [30.4598, 78.0644],
  "dehradun": [30.3165, 78.0322],
  "darjeeling": [27.0360, 88.2627],
  "gangtok": [27.3389, 88.6065],
  "leh": [34.1526, 77.5771],
  "srinagar": [34.0837, 74.7973],
  "gulmarg": [34.0484, 74.3805],
  "ooty": [11.4102, 76.6950],
  "kodaikanal": [10.2381, 77.4892],
  "munnar": [10.0889, 77.0595],
  "mahabaleshwar": [17.9307, 73.6477],
  "lonavala": [18.7546, 73.4062],
  "alibag": [18.6414, 72.8722],
  "pondicherry": [11.9416, 79.8083],
  "andaman": [11.7401, 92.6586],
  "port blair": [11.6234, 92.7265],
  "puri": [19.8135, 85.8312],
  "konark": [19.8876, 86.0945],
  "hampi": [15.3350, 76.4601],
  "ranthambore": [26.0173, 76.5026],
  "jim corbett": [29.5300, 78.7747],
  "kaziranga": [26.5775, 93.1711],
  // International
  "dubai": [25.2048, 55.2708],
  "singapore": [1.3521, 103.8198],
  "bangkok": [13.7563, 100.5018],
  "paris": [48.8566, 2.3522],
  "london": [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
  "maldives": [3.2028, 73.2207],
  "bali": [-8.3405, 115.0920],
  "tokyo": [35.6762, 139.6503],
  "rome": [41.9028, 12.4964],
  "amsterdam": [52.3676, 4.9041],
  "sydney": [-33.8688, 151.2093],
};

function getCityCoordinates(city: string): [number, number] | null {
  const normalized = city.toLowerCase().trim();
  if (cityCoordinates[normalized]) {
    return cityCoordinates[normalized];
  }
  
  // Partial match
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  
  return null;
}

// Component to fit bounds
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
}

interface MapLocation {
  name: string;
  type: "hotel" | "attraction" | "start" | "end";
  coordinates?: [number, number];
  description?: string;
}

interface SatelliteMapProps {
  boardingCity: string;
  destinationCity: string;
  hotels?: { name: string; location: string }[];
  attractions?: { name: string; description: string }[];
  className?: string;
}

export function SatelliteMap({
  boardingCity,
  destinationCity,
  hotels = [],
  attractions = [],
  className = "",
}: SatelliteMapProps) {
  const [mapStyle, setMapStyle] = useState<"satellite" | "street">("satellite");
  
  const startCoords = getCityCoordinates(boardingCity);
  const endCoords = getCityCoordinates(destinationCity);
  
  if (!startCoords || !endCoords) {
    return (
      <div className={`bg-muted rounded-2xl flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">Map coordinates not available for these locations</p>
      </div>
    );
  }

  // Generate locations for hotels and attractions around destination
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
    ...hotels.slice(0, 3).map((hotel, i) => ({
      name: hotel.name,
      type: "hotel" as const,
      coordinates: generateNearbyCoordinates(endCoords, i, 0.015),
      description: hotel.location,
    })),
    ...attractions.slice(0, 5).map((attraction, i) => ({
      name: attraction.name,
      type: "attraction" as const,
      coordinates: generateNearbyCoordinates(endCoords, i + 3, 0.025),
      description: attraction.description,
    })),
  ];

  const bounds = L.latLngBounds([startCoords, endCoords]);
  locations.forEach(loc => {
    if (loc.coordinates) {
      bounds.extend(loc.coordinates);
    }
  });

  // Route path (simplified - curved line between cities)
  const routePath: [number, number][] = [
    startCoords,
    [(startCoords[0] + endCoords[0]) / 2 + 0.1, (startCoords[1] + endCoords[1]) / 2],
    endCoords,
  ];

  const tileUrls = {
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-border ${className}`}>
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

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg p-3">
        <div className="text-xs font-medium text-foreground mb-2">Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Navigation className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
              <MapPin className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-muted-foreground">Destination</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <Hotel className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-muted-foreground">Hotels</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
              <Camera className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-muted-foreground">Attractions</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={endCoords}
        zoom={10}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={tileUrls[mapStyle]}
          attribution={mapStyle === "satellite" 
            ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        />
        
        <FitBounds bounds={bounds} />
        
        {/* Route Line */}
        <Polyline
          positions={routePath}
          pathOptions={{
            color: "hsl(168, 80%, 45%)",
            weight: 4,
            opacity: 0.8,
            dashArray: "10, 10",
          }}
        />
        
        {/* Markers */}
        {locations.map((location, index) => {
          if (!location.coordinates) return null;
          
          const iconColors = {
            start: "hsl(168, 80%, 45%)",
            end: "hsl(12, 90%, 60%)",
            hotel: "#3b82f6",
            attraction: "#f59e0b",
          };
          
          return (
            <Marker
              key={index}
              position={location.coordinates}
              icon={createCustomIcon(iconColors[location.type], location.type)}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-semibold text-sm">{location.name}</h4>
                  {location.description && (
                    <p className="text-xs text-gray-600 mt-1">{location.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
