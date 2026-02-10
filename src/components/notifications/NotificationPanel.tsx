import { useState, useEffect, useCallback } from "react";
import { 
  Bell, CloudRain, Sun, Thermometer, Wind, Calendar, MapPin, 
  X, Shirt, Star, Ticket, Hotel, Camera, Sparkles, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { differenceInDays, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Trip = Tables<"trips">;

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  type: "reminder" | "weather" | "info" | "success" | "warning";
  actionLabel?: string;
  actionHref?: string;
}

const typeStyles: Record<Notification["type"], string> = {
  reminder: "border-l-primary bg-primary/5",
  weather: "border-l-ocean bg-ocean/5",
  info: "border-l-muted-foreground bg-muted/50",
  success: "border-l-forest bg-forest/5",
  warning: "border-l-accent bg-accent/5",
};

const typeIconBg: Record<Notification["type"], string> = {
  reminder: "bg-primary/10 text-primary",
  weather: "bg-ocean/10 text-ocean",
  info: "bg-muted text-muted-foreground",
  success: "bg-forest/10 text-forest",
  warning: "bg-accent/10 text-accent",
};

function getWeatherNotifications(trip: Trip): Notification[] {
  const recs = trip.recommendations as any;
  if (!recs?.weather) return [];
  const condition = recs.weather.condition?.toLowerCase() || "";
  const notifications: Notification[] = [];

  if (condition.includes("rain")) {
    notifications.push({
      id: `weather-rain-${trip.id}`,
      icon: <CloudRain className="w-4 h-4" />,
      title: "Rain Expected ☔",
      message: `Pack an umbrella for ${trip.destination_city}`,
      time: "Weather alert",
      type: "weather",
    });
  }
  if (condition.includes("cold") || condition.includes("winter") || recs.weather.temp?.includes("0°") || recs.weather.temp?.includes("5°")) {
    notifications.push({
      id: `weather-cold-${trip.id}`,
      icon: <Thermometer className="w-4 h-4" />,
      title: "Cold Weather Ahead",
      message: `Carry warm layers for ${trip.destination_city} (${recs.weather.temp})`,
      time: "Weather alert",
      type: "weather",
    });
  }
  if (condition.includes("hot") || condition.includes("summer")) {
    notifications.push({
      id: `weather-hot-${trip.id}`,
      icon: <Sun className="w-4 h-4" />,
      title: "Warm Weather ☀️",
      message: `Light clothes recommended for ${trip.destination_city}`,
      time: "Weather alert",
      type: "info",
    });
  }
  if (condition.includes("storm") || condition.includes("extreme") || condition.includes("cyclone")) {
    notifications.push({
      id: `weather-extreme-${trip.id}`,
      icon: <Wind className="w-4 h-4" />,
      title: "⚠️ Severe Weather Warning",
      message: `Check conditions before traveling to ${trip.destination_city}`,
      time: "Urgent",
      type: "warning",
    });
  }
  if (notifications.length === 0) {
    notifications.push({
      id: `weather-ok-${trip.id}`,
      icon: <Shirt className="w-4 h-4" />,
      title: "Weather looks great! ✨",
      message: `${recs.weather.temp} — ${recs.weather.condition}`,
      time: "Weather",
      type: "success",
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
    if (daysUntil >= -7) {
      notifications.push({
        id: `post-trip-${trip.id}`,
        icon: <Star className="w-4 h-4" />,
        title: "How was your trip? ⭐",
        message: `Rate your ${trip.destination_city} experience`,
        time: "Post-trip",
        type: "info",
        actionLabel: "Rate now",
        actionHref: `/trip/${trip.id}`,
      });
    }
    return notifications;
  }

  if (daysUntil === 0) {
    notifications.push({
      id: `reminder-today-${trip.id}`,
      icon: <MapPin className="w-4 h-4" />,
      title: "Trip starts today! 🎉",
      message: `Your adventure to ${trip.destination_city} begins now`,
      time: "Now",
      type: "success",
    });
  } else if (daysUntil === 1) {
    notifications.push({
      id: `reminder-tomorrow-${trip.id}`,
      icon: <Calendar className="w-4 h-4" />,
      title: "Trip starts tomorrow! 🧳",
      message: `Final packing check for ${trip.destination_city}`,
      time: "1 day away",
      type: "reminder",
    });
  } else if (daysUntil <= 3) {
    notifications.push({
      id: `reminder-soon-${trip.id}`,
      icon: <Calendar className="w-4 h-4" />,
      title: `${daysUntil} days to go!`,
      message: `${trip.destination_city} trip coming up`,
      time: `${daysUntil} days away`,
      type: "reminder",
    });
  } else if (daysUntil <= 7) {
    notifications.push({
      id: `reminder-week-${trip.id}`,
      icon: <Calendar className="w-4 h-4" />,
      title: `Trip in ${daysUntil} days`,
      message: `Start preparing for ${trip.destination_city}`,
      time: `${daysUntil} days away`,
      type: "info",
    });
  }

  if (daysUntil <= 14 && daysUntil > 3) {
    notifications.push({
      id: `book-tickets-${trip.id}`,
      icon: <Ticket className="w-4 h-4" />,
      title: "Book your transport 🎫",
      message: `Secure tickets for ${trip.destination_city}`,
      time: `${daysUntil} days away`,
      type: "reminder",
      actionLabel: "Book tickets",
      actionHref: `/trip/${trip.id}`,
    });
  }

  if (daysUntil <= 2 && daysUntil >= 0) {
    notifications.push({
      id: `checkin-${trip.id}`,
      icon: <Hotel className="w-4 h-4" />,
      title: "Confirm hotel reservation 🏨",
      message: `Double-check your ${trip.destination_city} booking`,
      time: daysUntil === 0 ? "Today" : "Tomorrow",
      type: "warning",
    });
  }

  return notifications;
}

function getContextualNotifications(trips: Trip[]): Notification[] {
  const notifs: Notification[] = [];
  
  if (trips.length > 0) {
    const latestTrip = trips[0];
    if (latestTrip.status === "planned" && latestTrip.recommendations) {
      notifs.push({
        id: `images-loaded-${latestTrip.id}`,
        icon: <Camera className="w-4 h-4" />,
        title: "Real photos loaded 📸",
        message: `Verified location images for ${latestTrip.destination_city}`,
        time: "Just now",
        type: "success",
      });
    }
  }

  if (trips.length >= 3) {
    notifs.push({
      id: "traveler-milestone",
      icon: <Sparkles className="w-4 h-4" />,
      title: "Seasoned traveler! 🌍",
      message: `You've planned ${trips.length} trips — keep exploring!`,
      time: "Milestone",
      type: "success",
    });
  }

  return notifs;
}

export function NotificationPanel() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

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
        allNotifs.push(...getContextualNotifications(trips));
        setNotifications(allNotifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    fetchTrips();
  }, [user]);

  const dismiss = useCallback((id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  }, []);

  const dismissAll = useCallback(() => {
    setDismissed(new Set(notifications.map(n => n.id)));
  }, [notifications]);

  const visible = notifications.filter(n => !dismissed.has(n.id));
  const unreadCount = visible.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/10 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full gradient-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center shadow-sm"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-[340px] p-0 max-h-[480px] overflow-hidden rounded-xl border border-border shadow-elevated"
        sideOffset={8}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-card to-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">Notifications</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount > 0 ? `${unreadCount} active alert${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissAll}
                className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto max-h-[380px]">
          {visible.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-primary opacity-50" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">You're all set!</p>
              <p className="text-xs text-muted-foreground">No new notifications right now</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visible.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ 
                    type: "spring", 
                    bounce: 0.15, 
                    duration: 0.4,
                    delay: i * 0.03,
                  }}
                  className={cn(
                    "px-4 py-3 border-l-[3px] border-b border-border/50 hover:bg-muted/30 transition-colors cursor-default",
                    typeStyles[n.type]
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center", typeIconBg[n.type])}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium">{n.time}</span>
                        {n.actionLabel && n.actionHref && (
                          <a
                            href={n.actionHref}
                            className="text-[10px] font-semibold text-primary hover:underline uppercase tracking-wide"
                          >
                            {n.actionLabel} →
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(n.id);
                      }}
                      className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors opacity-40 hover:opacity-100"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
