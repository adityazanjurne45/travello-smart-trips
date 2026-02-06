import { Button } from "@/components/ui/button";
import { Plane, Train, ExternalLink, MapPin, Calendar, Clock, Shield } from "lucide-react";
import { format } from "date-fns";

interface BookTicketsTabProps {
  boardingCity: string;
  destinationCity: string;
  startDate: string | null;
  duration: number;
}

export function BookTicketsTab({ boardingCity, destinationCity, startDate, duration }: BookTicketsTabProps) {
  const travelDate = startDate ? format(new Date(startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  const displayDate = startDate ? format(new Date(startDate), "dd MMM yyyy") : "Not set";

  const bookFlight = () => {
    const url = `https://www.skyscanner.co.in/transport/flights/${encodeURIComponent(boardingCity)}/${encodeURIComponent(destinationCity)}/${travelDate.replace(/-/g, "").slice(2)}/`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const bookTrain = () => {
    const url = `https://www.irctc.co.in/nget/train-search`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Route Summary */}
      <div className="bg-muted/30 rounded-2xl p-5 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{boardingCity}</span>
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="font-semibold text-foreground">{destinationCity}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{displayDate}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Flight Booking */}
        <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Flight Booking</h3>
              <p className="text-sm text-muted-foreground">via Skyscanner</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Route</span>
              <span className="font-medium text-foreground">{boardingCity} → {destinationCity}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">{displayDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Approx. Duration</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> 1–3 hours
              </span>
            </div>
          </div>

          <Button onClick={bookFlight} className="w-full gradient-primary gap-2 h-11 rounded-xl shadow-glow">
            <Plane className="w-4 h-4" />
            Search Flights
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />
          </Button>
        </div>

        {/* Train Booking */}
        <div className="bg-card rounded-2xl border border-border p-6 hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
              <Train className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">Train Booking</h3>
              <p className="text-sm text-muted-foreground">via IRCTC</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Route</span>
              <span className="font-medium text-foreground">{boardingCity} → {destinationCity}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">{displayDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Approx. Duration</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Varies by route
              </span>
            </div>
          </div>

          <Button onClick={bookTrain} variant="outline" className="w-full gap-2 h-11 rounded-xl border-accent/30 hover:bg-accent/10 text-accent">
            <Train className="w-4 h-4" />
            Search Trains on IRCTC
            <ExternalLink className="w-3.5 h-3.5 ml-auto" />
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/30 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Booking is completed on official partner platforms (Skyscanner, IRCTC). Travello does not process payments or bookings directly. You will be redirected to the partner site in a new tab.
        </p>
      </div>
    </div>
  );
}
