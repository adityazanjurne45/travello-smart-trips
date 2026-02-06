import { Clock, Globe } from "lucide-react";
import { useEffect, useState } from "react";

// Major international cities mapped to their IANA timezones
const TIMEZONE_MAP: Record<string, string> = {
  "new york": "America/New_York", "los angeles": "America/Los_Angeles", "chicago": "America/Chicago",
  "london": "Europe/London", "paris": "Europe/Paris", "berlin": "Europe/Berlin",
  "tokyo": "Asia/Tokyo", "sydney": "Australia/Sydney", "dubai": "Asia/Dubai",
  "singapore": "Asia/Singapore", "hong kong": "Asia/Hong_Kong", "bangkok": "Asia/Bangkok",
  "toronto": "America/Toronto", "vancouver": "America/Vancouver",
  "rome": "Europe/Rome", "madrid": "Europe/Madrid", "amsterdam": "Europe/Amsterdam",
  "istanbul": "Europe/Istanbul", "moscow": "Europe/Moscow", "cairo": "Africa/Cairo",
  "beijing": "Asia/Shanghai", "shanghai": "Asia/Shanghai", "seoul": "Asia/Seoul",
  "kuala lumpur": "Asia/Kuala_Lumpur", "jakarta": "Asia/Jakarta",
  "auckland": "Pacific/Auckland", "melbourne": "Australia/Melbourne",
  "zurich": "Europe/Zurich", "vienna": "Europe/Vienna", "lisbon": "Europe/Lisbon",
  "athens": "Europe/Athens", "prague": "Europe/Prague", "budapest": "Europe/Budapest",
  "bali": "Asia/Makassar", "kathmandu": "Asia/Kathmandu", "colombo": "Asia/Colombo",
  "dhaka": "Asia/Dhaka", "karachi": "Asia/Karachi",
};

// Indian states/cities — all IST
const INDIA_KEYWORDS = [
  "india", "mumbai", "delhi", "bangalore", "bengaluru", "chennai", "kolkata", "hyderabad",
  "pune", "jaipur", "goa", "kerala", "agra", "varanasi", "shimla", "manali", "udaipur",
  "rishikesh", "darjeeling", "ooty", "kodaikanal", "munnar", "leh", "gangtok", "lucknow",
  "ahmedabad", "surat", "chandigarh", "bhopal", "indore", "patna", "ranchi", "guwahati",
  "thiruvananthapuram", "coimbatore", "mysore", "jodhpur", "amritsar", "haridwar",
  "mahabaleshwar", "lonavala", "hampi", "khajuraho", "andaman", "ladakh",
];

function getTimezone(city: string): string {
  const lower = city.toLowerCase().trim();
  if (INDIA_KEYWORDS.some(k => lower.includes(k))) return "Asia/Kolkata";
  for (const [key, tz] of Object.entries(TIMEZONE_MAP)) {
    if (lower.includes(key)) return tz;
  }
  return "Asia/Kolkata"; // default IST for unknown
}

interface DestinationTimeCardProps {
  destinationCity: string;
}

export function DestinationTimeCard({ destinationCity }: DestinationTimeCardProps) {
  const [time, setTime] = useState("");
  const [tzLabel, setTzLabel] = useState("");
  const timezone = getTimezone(destinationCity);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-IN", {
        timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
      });
      const label = now.toLocaleDateString("en-IN", {
        timeZone: timezone, timeZoneName: "short",
      }).split(",").pop()?.trim() || timezone;
      setTime(formatted);
      setTzLabel(timezone === "Asia/Kolkata" ? "IST" : label);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Destination Time • {tzLabel}</p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
