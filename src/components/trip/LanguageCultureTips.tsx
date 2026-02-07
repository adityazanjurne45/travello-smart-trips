import { Languages, Utensils, Heart, Info } from "lucide-react";

interface LanguageCultureTipsProps {
  destination: string;
}

interface CultureData {
  phrases: { phrase: string; meaning: string }[];
  customs: string[];
  foodEtiquette: string[];
  culturalTips: string[];
}

function getCultureData(city: string): CultureData {
  const c = city.toLowerCase();

  // Hindi-speaking regions
  if (["delhi", "agra", "jaipur", "varanasi", "lucknow", "rishikesh", "manali", "shimla", "haridwar", "mathura", "bhopal", "indore"].some(x => c.includes(x))) {
    return {
      phrases: [
        { phrase: "Namaste", meaning: "Hello / Greetings" },
        { phrase: "Dhanyavaad", meaning: "Thank you" },
        { phrase: "Kitna hai?", meaning: "How much is this?" },
        { phrase: "Kahan hai?", meaning: "Where is it?" },
        { phrase: "Madad karo", meaning: "Please help" },
      ],
      customs: ["Remove shoes before entering temples", "Use right hand for eating & exchanging items", "Greet elders with 'Namaste' and folded hands"],
      foodEtiquette: ["Street food is popular — try chaat & samosas", "Vegetarian food is widely available", "Always wash hands before meals"],
      culturalTips: ["Dress modestly at religious places", "Bargaining is expected in local markets", "Tipping 10% is appreciated at restaurants"],
    };
  }

  // South India
  if (["chennai", "bangalore", "bengaluru", "mysore", "ooty", "kodaikanal", "madurai", "kochi", "munnar", "coorg", "wayanad", "coimbatore", "pondicherry", "tirupati", "kerala", "alleppey", "kovalam", "varkala"].some(x => c.includes(x))) {
    return {
      phrases: [
        { phrase: "Vanakkam", meaning: "Hello (Tamil)" },
        { phrase: "Nandri", meaning: "Thank you (Tamil)" },
        { phrase: "Namaskara", meaning: "Hello (Kannada)" },
        { phrase: "Dhanyavadagalu", meaning: "Thank you (Kannada)" },
        { phrase: "Evide?", meaning: "Where? (Malayalam)" },
      ],
      customs: ["South Indian temples have strict dress codes", "Remove footwear outside temples", "Respectful of local traditions"],
      foodEtiquette: ["Meals served on banana leaves are traditional", "Eat with right hand when eating traditional meals", "Filter coffee is a must-try"],
      culturalTips: ["Learn a few local words — locals appreciate it", "South India is generally conservative in dress", "Festivals are celebrated with great enthusiasm"],
    };
  }

  // Goa
  if (c.includes("goa")) {
    return {
      phrases: [
        { phrase: "Dev borem korum", meaning: "God bless you (Konkani)" },
        { phrase: "Kitem chal?", meaning: "How are you? (Konkani)" },
        { phrase: "Borem", meaning: "Good (Konkani)" },
      ],
      customs: ["Respect church etiquette during visits", "Nudity is not allowed on beaches despite common perception", "Siesta time (2-4 PM) is observed by many shops"],
      foodEtiquette: ["Seafood is the specialty — try fish curry rice", "Feni is the local spirit made from cashew", "Beach shacks are affordable dining options"],
      culturalTips: ["Carry sunscreen and stay hydrated", "Rent a scooter for easy travel", "Night markets are great for shopping and food"],
    };
  }

  // Northeast India
  if (["gangtok", "shillong", "guwahati", "kaziranga", "darjeeling", "tawang", "aizawl"].some(x => c.includes(x))) {
    return {
      phrases: [
        { phrase: "Khamméd", meaning: "Hello (Khasi)" },
        { phrase: "Tashi Delek", meaning: "Hello (Tibetan/Sikkimese)" },
        { phrase: "Namaskar", meaning: "Hello (Assamese/Nepali)" },
      ],
      customs: ["Respect local tribal customs and restricted areas", "Inner Line Permits needed for some areas", "Photography may be restricted in some villages"],
      foodEtiquette: ["Momos are a staple — try them everywhere", "Thukpa (noodle soup) is perfect for cold weather", "Local tea varieties are exceptional"],
      culturalTips: ["Carry warm clothes even in summer at high altitudes", "Roads can be challenging — plan extra travel time", "Local handicrafts make great souvenirs"],
    };
  }

  // Default for international or unrecognized
  return {
    phrases: [
      { phrase: "Hello / Hi", meaning: "Universal greeting" },
      { phrase: "Thank you", meaning: "Express gratitude" },
      { phrase: "Excuse me", meaning: "Get attention politely" },
      { phrase: "How much?", meaning: "Ask about price" },
    ],
    customs: ["Research local customs before visiting", "Respect religious sites and dress codes", "Follow local tipping customs"],
    foodEtiquette: ["Try local cuisine for authentic experience", "Check for allergens and dietary restrictions", "Carry water bottles in areas with unsafe tap water"],
    culturalTips: ["Learn basic local phrases — locals appreciate the effort", "Be mindful of photography restrictions", "Respect local wildlife and environment"],
  };
}

export function LanguageCultureTips({ destination }: LanguageCultureTipsProps) {
  const data = getCultureData(destination);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
          <Languages className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Language & Culture</h2>
          <p className="text-sm text-muted-foreground">Tips for {destination}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Phrases */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground text-sm">Common Phrases</h4>
          </div>
          <div className="space-y-2">
            {data.phrases.map((p, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{p.phrase}</span>
                <span className="text-muted-foreground">{p.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customs */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-accent" />
            <h4 className="font-semibold text-foreground text-sm">Local Customs</h4>
          </div>
          <ul className="space-y-2">
            {data.customs.map((c, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Food */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-4 h-4 text-amber-500" />
            <h4 className="font-semibold text-foreground text-sm">Food Etiquette</h4>
          </div>
          <ul className="space-y-2">
            {data.foodEtiquette.map((f, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-500" />
            <h4 className="font-semibold text-foreground text-sm">Cultural Tips</h4>
          </div>
          <ul className="space-y-2">
            {data.culturalTips.map((t, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
