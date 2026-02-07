import { Shield, Phone, CreditCard, FileText, Building2, Globe } from "lucide-react";

interface TravelerEssentialsProps {
  destination: string;
  boardingCity: string;
}

const INDIAN_CITIES = [
  "mumbai", "delhi", "bangalore", "bengaluru", "chennai", "kolkata", "hyderabad",
  "pune", "ahmedabad", "jaipur", "goa", "lucknow", "kanpur", "nagpur", "indore",
  "thane", "bhopal", "visakhapatnam", "patna", "vadodara", "ghaziabad", "ludhiana",
  "agra", "nashik", "faridabad", "meerut", "rajkot", "varanasi", "srinagar",
  "aurangabad", "dhanbad", "amritsar", "allahabad", "ranchi", "howrah", "coimbatore",
  "jabalpur", "gwalior", "vijayawada", "jodhpur", "madurai", "raipur", "kota",
  "chandigarh", "guwahati", "solapur", "hubli", "mysore", "tiruchirappalli",
  "bareilly", "aligarh", "tiruppur", "moradabad", "jalandhar", "bhubaneswar",
  "salem", "warangal", "guntur", "bhilai", "kochi", "gorakhpur", "shimla",
  "manali", "udaipur", "rishikesh", "darjeeling", "ooty", "kodaikanal", "munnar",
  "leh", "gangtok", "shillong", "mussoorie", "nainital", "mount abu", "mahabaleshwar",
  "lonavala", "hampi", "khajuraho", "ajmer", "pushkar", "jaisalmer", "ranthambore",
  "kaziranga", "kerala", "andaman", "lakshadweep", "pondicherry", "tirupati",
  "madikeri", "coorg", "wayanad", "alleppey", "kovalam", "varkala",
];

function isIndianDestination(city: string): boolean {
  return INDIAN_CITIES.some(c => city.toLowerCase().includes(c));
}

function getEssentials(destination: string, isIndia: boolean) {
  if (isIndia) {
    return {
      documents: [
        "Government-issued Photo ID (Aadhaar, Voter ID, Driving License)",
        "PAN Card (for hotel check-ins over ₹50,000)",
        "Travel tickets (print or digital)",
        "Hotel booking confirmations",
      ],
      emergency: [
        { label: "Police", number: "100" },
        { label: "Ambulance", number: "108" },
        { label: "Women Helpline", number: "1091" },
        { label: "Tourist Helpline", number: "1363" },
        { label: "Railway Enquiry", number: "139" },
      ],
      medical: [
        "Nearest government hospital (available in all cities)",
        "Keep personal medicines handy",
        "Carry basic first-aid supplies",
      ],
      payment: [
        "UPI payments widely accepted (Google Pay, PhonePe, Paytm)",
        "Carry some cash for rural areas / small vendors",
        "ATMs available in most towns",
        "Credit/Debit cards accepted at hotels and restaurants",
      ],
    };
  }

  return {
    documents: [
      "Valid Passport (6+ months validity recommended)",
      "Visa / e-Visa as per destination country requirements",
      "Travel insurance (strongly recommended)",
      "Return flight tickets",
      "Hotel reservations",
      "Foreign currency or Forex card",
    ],
    emergency: [
      { label: "Local Emergency", number: "112 (International)" },
      { label: "Indian Embassy", number: "Check MEA website" },
      { label: "Travel Insurance", number: "Check your policy" },
    ],
    medical: [
      "Check vaccination requirements before travel",
      "Carry prescription medicines with doctor's note",
      "Know the nearest hospital at your destination",
      "International health insurance recommended",
    ],
    payment: [
      "Carry local currency or use Forex cards",
      "International credit/debit cards accepted in most places",
      "Check currency exchange rates before travel",
      "Notify your bank about international travel",
    ],
  };
}

export function TravelerEssentials({ destination, boardingCity }: TravelerEssentialsProps) {
  const isIndia = isIndianDestination(destination);
  const essentials = getEssentials(destination, isIndia);

  const sections = [
    { icon: FileText, title: "Required Documents", items: essentials.documents, color: "text-primary" },
    { icon: Phone, title: "Emergency Contacts", items: essentials.emergency, color: "text-destructive", isContacts: true },
    { icon: Building2, title: "Medical Info", items: essentials.medical, color: "text-blue-500" },
    { icon: CreditCard, title: "Payment Tips", items: essentials.payment, color: "text-green-500" },
  ];

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Traveler Essentials</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {isIndia ? "Domestic travel" : "International travel"} — {destination}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map(section => (
          <div key={section.title} className="rounded-xl bg-muted/50 p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <section.icon className={`w-5 h-5 ${section.color}`} />
              <h4 className="font-semibold text-foreground text-sm">{section.title}</h4>
            </div>
            <ul className="space-y-2">
              {section.items.map((item: any, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {typeof item === "string" ? (
                    item
                  ) : (
                    <span>
                      <span className="font-medium text-foreground">{item.label}:</span> {item.number}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
