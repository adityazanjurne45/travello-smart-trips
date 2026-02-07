import { PlaceImageGallery } from "@/components/trip/PlaceImageGallery";
import { 
  Clock, Camera, Hotel, Car, Sun, CloudRain, AlertTriangle
} from "lucide-react";

interface TouristPlace {
  name: string;
  description: string;
  visitDuration: string;
  bestTime: string;
  entryFee: number;
}

interface HotelRecommendation {
  name: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  location: string;
}

interface TransportOption {
  type: string;
  estimatedCost: number;
  duration: string;
  recommendation: string;
}

interface Recommendations {
  touristPlaces: TouristPlace[];
  hotels: HotelRecommendation[];
  transport: TransportOption[];
  warnings: string[];
  weather: { condition: string; temp: string };
}

interface OverviewTabProps {
  recommendations: Recommendations;
  destinationCity: string;
}

export function OverviewTab({ recommendations, destinationCity }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Weather & Warnings */}
      <div className="grid md:grid-cols-2 gap-6">
        {recommendations.weather && (
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              {recommendations.weather.condition?.toLowerCase().includes("rain") ? (
                <CloudRain className="w-8 h-8 text-primary" />
              ) : (
                <Sun className="w-8 h-8 text-accent" />
              )}
              <div>
                <h3 className="font-display font-semibold">Weather</h3>
                <p className="text-muted-foreground text-sm">{recommendations.weather.temp}</p>
              </div>
            </div>
            <p className="text-foreground">{recommendations.weather.condition}</p>
          </div>
        )}

        {recommendations.warnings && recommendations.warnings.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <h3 className="font-display font-semibold text-amber-800 dark:text-amber-200">
                Smart Warnings
              </h3>
            </div>
            <ul className="space-y-2">
              {recommendations.warnings.map((warning, i) => (
                <li key={i} className="text-amber-700 dark:text-amber-300 text-sm">• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tourist Places */}
      {recommendations.touristPlaces?.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold">Tourist Attractions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.touristPlaces.map((place, i) => (
              <div key={i} className="rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors overflow-hidden">
                <PlaceImageGallery placeName={`${place.name} ${destinationCity}`} className="h-32" variant="single" showAttribution={false} />
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-2">{place.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{place.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                      <Clock className="w-3 h-3 inline mr-1" />{place.visitDuration}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-accent/10 text-accent">₹{place.entryFee ?? 0} entry</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-4">Images © Wikimedia Commons</p>
        </div>
      )}

      {/* Hotels */}
      {recommendations.hotels?.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
              <Hotel className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold">Recommended Hotels</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.hotels.map((hotel, i) => (
              <div key={i} className="rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors overflow-hidden">
                <PlaceImageGallery placeName={`${hotel.name} hotel ${destinationCity}`} className="h-28" variant="single" showAttribution={false} />
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">{hotel.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{hotel.location}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-primary">₹{(hotel.pricePerNight ?? 0).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/night</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hotel.amenities?.slice(0, 3).map((a, j) => (
                      <span key={j} className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-4">Images © Wikimedia Commons</p>
        </div>
      )}

      {/* Transport */}
      {recommendations.transport?.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold">Transport Options</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.transport.map((option, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-4 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Car className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground capitalize">{option.type}</h4>
                  <p className="text-sm text-muted-foreground">{option.duration}</p>
                  <p className="text-primary font-medium mt-1">₹{(option.estimatedCost ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{option.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
