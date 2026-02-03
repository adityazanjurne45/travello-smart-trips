import { useEffect, useState, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  User, 
  MapPin, 
  Wallet, 
  Car, 
  Utensils, 
  Languages, 
  Save,
  Camera,
  Mail,
  Phone,
  Home,
  Users,
  Clock,
  Hotel,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const travelStyles = ["solo", "couple", "family", "group"] as const;
const accommodationTypes = ["budget", "mid-range", "luxury", "hostel", "homestay", "resort"] as const;
const transportTypes = ["bike", "car", "public", "flight", "train"] as const;

const getTravelStyleLabel = (style: string) => {
  const labels: Record<string, { label: string; emoji: string }> = {
    solo: { label: "Solo Explorer", emoji: "🎒" },
    couple: { label: "Romantic Getaway", emoji: "💑" },
    family: { label: "Family Adventure", emoji: "👨‍👩‍👧‍👦" },
    group: { label: "Group Travel", emoji: "👥" },
  };
  return labels[style] || { label: style, emoji: "✈️" };
};

const getBudgetLabel = (min: number, max: number) => {
  if (max < 20000) return { label: "Budget Traveler", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
  if (max < 50000) return { label: "Mid-Range Explorer", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
  return { label: "Luxury Seeker", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
};

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);

      setAvatarUrl(publicUrl);
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
      setAvatarUrl(null);
    }
  };

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

    setSaved(true);
    toast.success("Profile saved successfully!");
    setTimeout(() => setSaved(false), 3000);
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

  const travelStyleInfo = getTravelStyleLabel(formData.travel_style);
  const budgetInfo = getBudgetLabel(formData.min_budget, formData.max_budget);

  return (
    <Layout>
      <div className="gradient-hero min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Customize your preferences for better AI recommendations
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Travel Preference Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20"
            >
              <h3 className="font-semibold text-foreground mb-4">Your Travel Style</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
                  {travelStyleInfo.emoji} {travelStyleInfo.label}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${budgetInfo.color}`}>
                  💰 {budgetInfo.label}
                </span>
                <span className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
                  🏨 {formData.accommodation_preference}
                </span>
                <span className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
                  🚗 {formData.transportation_preference}
                </span>
              </div>
            </motion.div>

            {/* Avatar & Personal Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-soft"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">Your basic account details</p>
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-muted/30 rounded-2xl">
                <div className="relative">
                  <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-lg">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold">
                      {formData.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-foreground mb-1">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a photo to personalize your account
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input id="email" value={user?.email || ""} disabled className="h-12 bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_city" className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    Home City
                  </Label>
                  <Input
                    id="home_city"
                    value={formData.home_city}
                    onChange={(e) => setFormData({ ...formData, home_city: e.target.value })}
                    placeholder="Mumbai"
                    className="h-12"
                  />
                </div>
              </div>
            </motion.div>

            {/* Travel Preferences */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-soft"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Travel Preferences</h2>
                  <p className="text-sm text-muted-foreground">How you like to travel</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Travel Style
                  </Label>
                  <Select
                    value={formData.travel_style}
                    onValueChange={(v) => setFormData({ ...formData, travel_style: v as typeof travelStyles[number] })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">🎒 Solo Traveler</SelectItem>
                      <SelectItem value="couple">💑 Couple</SelectItem>
                      <SelectItem value="family">👨‍👩‍👧‍👦 Family</SelectItem>
                      <SelectItem value="group">👥 Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Preferred Trip Duration
                  </Label>
                  <div className="pt-2 px-1">
                    <Slider
                      value={[formData.preferred_duration]}
                      onValueChange={([v]) => setFormData({ ...formData, preferred_duration: v })}
                      min={1}
                      max={30}
                      step={1}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-muted-foreground">1 day</span>
                      <span className="text-sm font-semibold text-primary">{formData.preferred_duration} days</span>
                      <span className="text-sm text-muted-foreground">30 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-soft"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Budget Range</h2>
                  <p className="text-sm text-muted-foreground">Your typical trip budget range</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Minimum</p>
                    <p className="text-2xl font-bold text-foreground">₹{formData.min_budget.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Maximum</p>
                    <p className="text-2xl font-bold text-primary">₹{formData.max_budget.toLocaleString()}</p>
                  </div>
                </div>
                <Slider
                  value={[formData.min_budget, formData.max_budget]}
                  onValueChange={([min, max]) => setFormData({ ...formData, min_budget: min, max_budget: max })}
                  min={0}
                  max={200000}
                  step={1000}
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹0</span>
                  <span>₹2,00,000</span>
                </div>
              </div>
            </motion.div>

            {/* Accommodation & Transport */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-soft"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Hotel className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Accommodation & Transport</h2>
                  <p className="text-sm text-muted-foreground">Your stay and travel preferences</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-muted-foreground" />
                    Accommodation Type
                  </Label>
                  <Select
                    value={formData.accommodation_preference}
                    onValueChange={(v) => setFormData({ ...formData, accommodation_preference: v as typeof accommodationTypes[number] })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">💵 Budget</SelectItem>
                      <SelectItem value="mid-range">🏨 Mid-Range</SelectItem>
                      <SelectItem value="luxury">✨ Luxury</SelectItem>
                      <SelectItem value="hostel">🎒 Hostel</SelectItem>
                      <SelectItem value="homestay">🏡 Homestay</SelectItem>
                      <SelectItem value="resort">🏝️ Resort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    Preferred Transport
                  </Label>
                  <Select
                    value={formData.transportation_preference}
                    onValueChange={(v) => setFormData({ ...formData, transportation_preference: v as typeof transportTypes[number] })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bike">🏍️ Bike</SelectItem>
                      <SelectItem value="car">🚗 Car</SelectItem>
                      <SelectItem value="public">🚌 Public Transport</SelectItem>
                      <SelectItem value="flight">✈️ Flight</SelectItem>
                      <SelectItem value="train">🚆 Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-muted-foreground" />
                    Food Preference
                  </Label>
                  <Input
                    value={formData.food_preference}
                    onChange={(e) => setFormData({ ...formData, food_preference: e.target.value })}
                    placeholder="Vegetarian, Non-veg, Vegan..."
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    Language Preference
                  </Label>
                  <Input
                    value={formData.language_preference}
                    onChange={(e) => setFormData({ ...formData, language_preference: e.target.value })}
                    placeholder="English, Hindi..."
                    className="h-12"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-foreground">Traffic Sensitive</p>
                      <p className="text-sm text-muted-foreground">Avoid heavy traffic routes</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.traffic_sensitive}
                    onCheckedChange={(checked) => setFormData({ ...formData, traffic_sensitive: checked })}
                  />
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSave}
                disabled={saving}
                size="lg"
                className="w-full h-14 text-lg gradient-primary shadow-glow"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
