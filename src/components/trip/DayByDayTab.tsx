import { MapPin } from "lucide-react";

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  estimatedCost: number;
}

interface Itinerary {
  days: DayItinerary[];
  totalEstimatedCost: number;
}

interface DayByDayTabProps {
  itinerary: Itinerary;
}

export function DayByDayTab({ itinerary }: DayByDayTabProps) {
  if (!itinerary?.days?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No itinerary available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Day-wise Itinerary</h2>
          <p className="text-sm text-muted-foreground">
            Total estimated cost: ₹{itinerary.totalEstimatedCost?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <div key={day.day} className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">Day {day.day}: {day.title}</h4>
              <span className="text-sm text-primary font-medium">₹{day.estimatedCost?.toLocaleString()}</span>
            </div>
            <ul className="space-y-2">
              {day.activities?.map((activity, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mt-0.5">
                    {i + 1}
                  </span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
