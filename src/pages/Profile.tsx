import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, User, MapPin, Wallet, Car, Utensils, Languages, Save } from "lucide-react";

const travelStyles = ["solo", "couple", "family", "group"] as const;
const accommodationTypes = ["budget", "mid-range", "luxury", "hostel", "homestay", "resort"] as const;
const transportTypes = ["bike", "car", "public", "flight", "train"] as const;

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    home_city: "",
    travel_style: "solo" as typeof travelStyles[number],
    min_budget: 0,
    max_budget: 50000,
    preferred_duration: 3,
    accommodation_preference: "mid-range" as typeof accommodationTypes[number],
    transportation_preference: "car" as typeof transportTypes[number],
    traffic_sensitive: true,
    food_preference: "",
    language_preference: "English",
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          home_city: data.home_city || "",
          travel_style: (data.travel_style as typeof travelStyles[number]) || "solo",
          min_budget: data.min_budget || 0,
          max_budget: data.max_budget || 50000,
          preferred_duration: data.preferred_duration || 3,
          accommodation_preference: (data.accommodation_preference as typeof accommodationTypes[number]) || "mid-range",
          transportation_preference: (data.transportation_preference as typeof transportTypes[number]) || "car",
          traffic_sensitive: data.traffic_sensitive ?? true,
          food_preference: data.food_preference || "",
          language_preference: data.language_preference || "English",
        });
      }
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to save profile");
      return;
    }

    toast.success("Profile updated successfully");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="gradient-hero min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              Customize your preferences for better AI recommendations
            </p>
          </div>

          <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_city">Home City</Label>
                  <Input
                    id="home_city"
                    value={formData.home_city}
                    onChange={(e) => setFormData({ ...formData, home_city: e.target.value })}
                    placeholder="Mumbai"
                  />
                </div>
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold">Travel Preferences</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Travel Style</Label>
                  <Select
                    value={formData.travel_style}
                    onValueChange={(v) => setFormData({ ...formData, travel_style: v as typeof travelStyles[number] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Traveler</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Trip Duration (days)</Label>
                  <div className="pt-2">
                    <Slider
                      value={[formData.preferred_duration]}
                      onValueChange={([v]) => setFormData({ ...formData, preferred_duration: v })}
                      min={1}
                      max={30}
                      step={1}
                    />
                    <p className="text-sm text-muted-foreground mt-2">{formData.preferred_duration} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold">Budget Range</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>₹{formData.min_budget.toLocaleString()}</span>
                  <span>₹{formData.max_budget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[formData.min_budget, formData.max_budget]}
                  onValueChange={([min, max]) => setFormData({ ...formData, min_budget: min, max_budget: max })}
                  min={0}
                  max={200000}
                  step={1000}
                />
              </div>
            </div>

            {/* Accommodation & Transport */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold">Accommodation & Transport</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Accommodation Type</Label>
                  <Select
                    value={formData.accommodation_preference}
                    onValueChange={(v) => setFormData({ ...formData, accommodation_preference: v as typeof accommodationTypes[number] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="mid-range">Mid-Range</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Transport</Label>
                  <Select
                    value={formData.transportation_preference}
                    onValueChange={(v) => setFormData({ ...formData, transportation_preference: v as typeof transportTypes[number] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="public">Public Transport</SelectItem>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between md:col-span-2">
                  <div>
                    <Label>Traffic Sensitive</Label>
                    <p className="text-sm text-muted-foreground">Optimize routes based on traffic conditions</p>
                  </div>
                  <Switch
                    checked={formData.traffic_sensitive}
                    onCheckedChange={(v) => setFormData({ ...formData, traffic_sensitive: v })}
                  />
                </div>
              </div>
            </div>

            {/* Food & Language */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="font-display text-xl font-semibold">Food & Language</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="food">Food Preference</Label>
                  <Input
                    id="food"
                    value={formData.food_preference}
                    onChange={(e) => setFormData({ ...formData, food_preference: e.target.value })}
                    placeholder="Vegetarian, Vegan, Non-veg, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language Preference</Label>
                  <Input
                    id="language"
                    value={formData.language_preference}
                    onChange={(e) => setFormData({ ...formData, language_preference: e.target.value })}
                    placeholder="English, Hindi, etc."
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="gradient-primary px-8"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
