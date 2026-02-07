import { useState, useEffect } from "react";
import { Bell, CloudRain, Sun, Thermometer, Wind, Calendar, MapPin, X, Shirt, Star, Ticket, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  type: "reminder" | "weather" | "info";
}

function getWeatherNotifications(trip: Trip): Notification[] {
  const recs = trip.recommendations as any;
  if (!recs?.weather) return [];
  const condition = recs.weather.condition?.toLowerCase() || "";
  const notifications: Notification[] = [];

  if (condition.includes("rain")) {
    notifications.push({
      id: `weather-rain-${trip.id}`,
      icon: <CloudRain className="w-4 h-4 text-blue-500" />,
      title: "Rain Expected",
      message: `Carry an umbrella or raincoat for ${trip.destination_city}`,
      time: "Weather alert",
      type: "weather",
    });
  }
  if (condition.includes("cold") || condition.includes("winter") || recs.weather.temp?.includes("0°") || recs.weather.temp?.includes("5°")) {
    notifications.push({
      id: `weather-cold-${trip.id}`,
      icon: <Thermometer className="w-4 h-4 text-blue-400" />,
      title: "Cold Weather",
      message: `Carry warm clothes for ${trip.destination_city}`,
      time: "Weather alert",
      type: "weather",
    });
  }
  if (condition.includes("hot") || condition.includes("summer")) {
    notifications.push({
      id: `weather-hot-${trip.id}`,
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      title: "Hot Weather",
      message: `Light cotton clothes recommended for ${trip.destination_city}`,
      time: "Weather alert",
      type: "weather",
    });
  }
  if (condition.includes("storm") || condition.includes("extreme") || condition.includes("cyclone")) {
    notifications.push({
      id: `weather-extreme-${trip.id}`,
      icon: <Wind className="w-4 h-4 text-red-500" />,
      title: "⚠️ Extreme Weather Warning",
      message: `Check conditions before traveling to ${trip.destination_city}`,
      time: "Urgent",
      type: "weather",
    });
  }
  if (notifications.length === 0) {
    notifications.push({
      id: `weather-ok-${trip.id}`,
      icon: <Shirt className="w-4 h-4 text-primary" />,
      title: "Weather looks good!",
      message: `${recs.weather.temp} — ${recs.weather.condition} at ${trip.destination_city}`,
      time: "Weather",
      type: "weather",
    });
  }
  return notifications;
}

function getTripReminders(trip: Trip): Notification[] {
  if (!trip.start_date) return [];
  const startDate = parseISO(trip.start_date);
  const daysUntil = differenceInDays(startDate, new Date());
  const notifications: Notification[] = [];

  if (daysUntil < 0) {
    // Post-trip reminder
    if (daysUntil >= -7) {
      notifications.push({
        id: `post-trip-${trip.id}`,
        icon: <Star className="w-4 h-4 text-amber-500" />,
        title: "Rate your trip!",
        message: `How was your trip to ${trip.destination_city}? Share your feedback.`,
        time: "Post-trip",
        type: "info",
      });
    }
    return notifications;
  }

  if (daysUntil === 0) {
    notifications.push({
      id: `reminder-today-${trip.id}`,
      icon: <MapPin className="w-4 h-4 text-accent" />,
      title: "Trip starts today! 🎉",
      message: `Your trip to ${trip.destination_city} begins today`,
      time: "Now",
      type: "reminder",
    });
  } else if (daysUntil === 1) {
    notifications.push({
      id: `reminder-tomorrow-${trip.id}`,
      icon: <Calendar className="w-4 h-4 text-primary" />,
      title: "Trip starts tomorrow!",
      message: `Pack your bags for ${trip.destination_city}`,
      time: "1 day away",
      type: "reminder",
    });
  } else if (daysUntil <= 3) {
    notifications.push({
      id: `reminder-soon-${trip.id}`,
      icon: <Calendar className="w-4 h-4 text-primary" />,
      title: `Trip in ${daysUntil} days`,
      message: `Your trip to ${trip.destination_city} is coming up soon`,
      time: `${daysUntil} days away`,
      type: "reminder",
    });
  } else if (daysUntil <= 7) {
    notifications.push({
      id: `reminder-week-${trip.id}`,
      icon: <Calendar className="w-4 h-4 text-muted-foreground" />,
      title: `Trip in ${daysUntil} days`,
      message: `${trip.destination_city} — start preparing!`,
      time: `${daysUntil} days away`,
      type: "info",
    });
  }

  // Book tickets reminder
  if (daysUntil <= 14 && daysUntil > 3) {
    notifications.push({
      id: `book-tickets-${trip.id}`,
      icon: <Ticket className="w-4 h-4 text-accent" />,
      title: "Book your tickets",
      message: `Book transport for ${trip.destination_city} trip soon`,
      time: `${daysUntil} days away`,
      type: "reminder",
    });
  }

  // Hotel check-in reminder
  if (daysUntil <= 2 && daysUntil >= 0) {
    notifications.push({
      id: `checkin-${trip.id}`,
      icon: <Hotel className="w-4 h-4 text-blue-500" />,
      title: "Confirm hotel check-in",
      message: `Double-check your ${trip.destination_city} hotel reservation`,
      time: daysUntil === 0 ? "Today" : "Tomorrow",
      type: "reminder",
    });
  }

  return notifications;
}

export function NotificationPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    async function fetchTrips() {
      try {
        const { data: trips } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!trips) return;
        const allNotifs: Notification[] = [];
        trips.forEach((trip) => {
          allNotifs.push(...getTripReminders(trip));
          allNotifs.push(...getWeatherNotifications(trip));
        });
        setNotifications(allNotifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    fetchTrips();
  }, [user]);

  const dismiss = (id: string) => setDismissed(prev => new Set(prev).add(id));
  const visible = notifications.filter(n => !dismissed.has(n.id));
  const unreadCount = visible.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full p-0">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full gradient-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 max-h-[420px] overflow-y-auto">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground text-sm">Notifications</h3>
          <p className="text-xs text-muted-foreground">{unreadCount} active alerts</p>
        </div>
        {visible.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No notifications right now
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visible.map((n) => (
              <div key={n.id} className="p-3 hover:bg-muted/50 transition-colors flex items-start gap-3">
                <div className="mt-1 shrink-0">{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                <button onClick={() => dismiss(n.id)} className="shrink-0 p-1 hover:bg-muted rounded">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
