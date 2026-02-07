import { useState, useEffect } from "react";
import { CheckSquare, Square, Plus, Trash2, Luggage } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PackingItem {
  id: string;
  text: string;
  packed: boolean;
  category: string;
}

interface PackingChecklistProps {
  tripId: string;
  destination: string;
  duration: number;
  weather?: { condition: string; temp: string };
}

function generatePackingList(destination: string, duration: number, weather?: { condition: string; temp: string }): PackingItem[] {
  const items: PackingItem[] = [];
  let id = 0;
  const add = (text: string, category: string) => items.push({ id: `gen-${id++}`, text, packed: false, category });

  // Essentials
  add("ID Card / Passport", "Documents");
  add("Printed tickets / boarding pass", "Documents");
  add("Hotel booking confirmation", "Documents");
  add("Travel insurance documents", "Documents");
  add("Phone charger & power bank", "Electronics");
  add("Earphones / headphones", "Electronics");
  add("Wallet & cash", "Essentials");
  add("Medicines / first-aid kit", "Health");
  add("Water bottle", "Essentials");
  add("Sunglasses", "Accessories");
  add("Sunscreen", "Health");

  // Weather-based
  const condition = weather?.condition?.toLowerCase() || "";
  const temp = weather?.temp || "";
  if (condition.includes("rain") || condition.includes("monsoon")) {
    add("Umbrella / raincoat", "Weather");
    add("Waterproof bag cover", "Weather");
    add("Quick-dry clothes", "Weather");
  }
  if (condition.includes("cold") || condition.includes("winter") || temp.includes("0°") || temp.includes("5°") || temp.includes("-")) {
    add("Warm jacket / sweater", "Weather");
    add("Thermal wear", "Weather");
    add("Gloves & beanie", "Weather");
    add("Warm socks", "Weather");
  }
  if (condition.includes("hot") || condition.includes("summer")) {
    add("Light cotton clothes", "Weather");
    add("Cap / hat", "Weather");
    add("Extra water bottles", "Weather");
  }

  // Duration-based
  const clothingSets = Math.min(duration, 7);
  add(`${clothingSets} sets of clothes`, "Clothing");
  add(`${clothingSets} pairs of underwear`, "Clothing");
  add("Comfortable walking shoes", "Clothing");
  add("Sleepwear", "Clothing");

  if (duration >= 4) {
    add("Laundry bag", "Essentials");
    add("Extra toiletries", "Health");
  }
  if (duration >= 7) {
    add("Travel pillow", "Comfort");
    add("Entertainment (books / tablet)", "Comfort");
  }

  add("Toothbrush & toothpaste", "Health");
  add("Shampoo & soap (travel size)", "Health");

  return items;
}

export function PackingChecklist({ tripId, destination, duration, weather }: PackingChecklistProps) {
  const storageKey = `packing-${tripId}`;
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(generatePackingList(destination, duration, weather));
    }
    setInitialized(true);
  }, [storageKey]);

  useEffect(() => {
    if (initialized) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, initialized, storageKey]);

  const toggle = (id: string) => setItems(items.map(i => i.id === id ? { ...i, packed: !i.packed } : i));
  const remove = (id: string) => setItems(items.filter(i => i.id !== id));
  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: `custom-${Date.now()}`, text: newItem.trim(), packed: false, category: "Custom" }]);
    setNewItem("");
  };

  const packedCount = items.filter(i => i.packed).length;
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0;
  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
            <Luggage className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold">Packing Checklist</h2>
            <p className="text-sm text-muted-foreground">{packedCount}/{items.length} items packed</p>
          </div>
          <span className="text-2xl font-bold text-primary">{progress.toFixed(0)}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-muted mb-6">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Add custom item */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Add custom item..."
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
            maxLength={50}
          />
          <Button size="sm" onClick={addItem} className="gap-1">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Items by category */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h4>
              <div className="space-y-1">
                {items.filter(i => i.category === category).map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <button onClick={() => toggle(item.id)} className="shrink-0">
                      {item.packed ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${item.packed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => remove(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
