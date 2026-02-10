import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Loader2,
  Check,
  Search,
  LocateFixed,
  AlertCircle
} from "lucide-react";

const steps = [
  { id: 1, title: "Departure", description: "Where are you starting?", icon: Navigation },
  { id: 2, title: "Destination", description: "Where do you want to go?", icon: MapPin },
  { id: 3, title: "Dates", description: "When are you traveling?", icon: Calendar },
  { id: 4, title: "Duration", description: "How long is your trip?", icon: Calendar },
  { id: 5, title: "Budget", description: "What's your budget?", icon: Wallet },
];

const popularCities = [
  "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Kerala", 
  "Udaipur", "Manali", "Shimla", "Agra", "Varanasi", "Rishikesh",
  "Darjeeling", "Ooty", "Kodaikanal", "Munnar", "Leh", "Gangtok",
  "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Lucknow",
  "Chandigarh", "Bhopal", "Indore", "Kochi", "Mysore", "Jodhpur"
];

const quickSelectDeparture = ["Mumbai", "Delhi", "Pune", "Bangalore", "Hyderabad"];
const quickSelectDestination = ["Goa", "Jaipur", "Manali", "Kerala", "Udaipur", "Shimla"];

export default function PlanTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    boarding_city: "",
    destination_city: "",
    duration: 3,
    budget: 20000,
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
  });

  const [showBoardingSuggestions, setShowBoardingSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [boardingError, setBoardingError] = useState("");
  const [destError, setDestError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentStep]);

  // Clear errors when input changes
  useEffect(() => {
    if (formData.boarding_city.trim()) setBoardingError("");
  }, [formData.boarding_city]);

  useEffect(() => {
    if (formData.destination_city.trim()) setDestError("");
  }, [formData.destination_city]);

  const filterCities = (query: string) => {
    if (!query) return popularCities.slice(0, 8);
    return popularCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const isValidCity = (value: string) => {
    return value.trim().length >= 2;
  };

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep === 1) {
      if (!isValidCity(formData.boarding_city)) {
        setBoardingError("Please select a departure city from the list");
        inputRef.current?.focus();
        return;
      }
    }
    if (currentStep === 2) {
      if (!isValidCity(formData.destination_city)) {
        setDestError("Please select a destination from the list");
        inputRef.current?.focus();
        return;
      }
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBoardingKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const suggestions = filterCities(formData.boarding_city);
      if (suggestions.length > 0 && formData.boarding_city.trim()) {
        // Auto-select first suggestion
        setFormData({ ...formData, boarding_city: suggestions[0] });
        setShowBoardingSuggestions(false);
        // Move to next step after a tick
        setTimeout(() => nextStep(), 50);
      } else if (isValidCity(formData.boarding_city)) {
        nextStep();
      } else {
        setBoardingError("Please select a departure city from the list");
      }
    }
  };

  const handleDestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const suggestions = filterCities(formData.destination_city);
      if (suggestions.length > 0 && formData.destination_city.trim()) {
        setFormData({ ...formData, destination_city: suggestions[0] });
        setShowDestSuggestions(false);
        setTimeout(() => nextStep(), 50);
      } else if (isValidCity(formData.destination_city)) {
        nextStep();
      } else {
        setDestError("Please select a destination from the list");
      }
    }
  };

  const handleUseLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || "Unknown";
          setFormData(prev => ({ ...prev, boarding_city: city }));
          setBoardingError("");
          toast.success(`Location detected: ${city}`);
        } catch {
          toast.error("Couldn't detect your city. Please enter manually.");
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        toast.error("Location permission denied. Please enter your city manually.");
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        boarding_city: formData.boarding_city,
        destination_city: formData.destination_city,
        duration: formData.duration,
        budget: formData.budget,
        start_date: formData.start_date ? formData.start_date.toISOString().split("T")[0] : null,
        end_date: formData.end_date ? formData.end_date.toISOString().split("T")[0] : null,
        status: "generating",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create trip");
      setLoading(false);
      return;
    }

    navigate(`/trip/${trip.id}`);
  };

  const getBudgetLabel = (budget: number) => {
    if (budget < 10000) return { label: "Budget Friendly", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    if (budget < 30000) return { label: "Moderate", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    if (budget < 60000) return { label: "Comfortable", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
    return { label: "Premium", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !isValidCity(formData.boarding_city);
    if (currentStep === 2) return !isValidCity(formData.destination_city);
    return false;
  };

  const StepContent = ({ step }: { step: number }) => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow"
              >
                <Navigation className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                Where are you starting from?
              </h2>
              <p className="text-muted-foreground">
                Enter your departure city or select from popular options
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={formData.boarding_city}
                onChange={(e) => {
                  setFormData({ ...formData, boarding_city: e.target.value });
                  setShowBoardingSuggestions(true);
                }}
                onFocus={() => setShowBoardingSuggestions(true)}
                onBlur={() => setTimeout(() => setShowBoardingSuggestions(false), 200)}
                onKeyDown={handleBoardingKeyDown}
                placeholder="Enter your departure city or country"
                aria-label="Departure city"
                aria-invalid={!!boardingError}
                aria-describedby={boardingError ? "boarding-error" : undefined}
                className={`pl-12 pr-12 h-14 text-lg bg-background rounded-xl transition-colors ${
                  boardingError 
                    ? "border-destructive focus:border-destructive focus:ring-destructive" 
                    : "border-border focus:border-primary"
                }`}
              />
              {/* Use Current Location Button */}
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={geoLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                title="Use my current location"
              >
                {geoLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LocateFixed className="w-5 h-5" />
                )}
              </button>

              {/* Inline Error */}
              <AnimatePresence>
                {boardingError && (
                  <motion.p
                    id="boarding-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-sm text-destructive mt-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {boardingError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Dropdown Suggestions */}
              <AnimatePresence>
                {showBoardingSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {filterCities(formData.boarding_city).length > 0 ? (
                      filterCities(formData.boarding_city).map((city) => (
                        <button
                          key={city}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                          onMouseDown={() => {
                            setFormData({ ...formData, boarding_city: city });
                            setShowBoardingSuggestions(false);
                          }}
                        >
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-medium">{city}</span>
                          <span className="text-xs text-muted-foreground ml-auto">India</span>
                        </button>
                      ))
                    ) : formData.boarding_city.trim() ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No cities found
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Select Chips */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2.5">Quick select</p>
              <div className="flex flex-wrap gap-2">
                {quickSelectDeparture.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setFormData({ ...formData, boarding_city: city });
                      setBoardingError("");
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.boarding_city === city
                        ? "gradient-primary text-primary-foreground shadow-glow"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4 shadow-glow-accent"
              >
                <MapPin className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                Where do you want to go?
              </h2>
              <p className="text-muted-foreground">
                Enter your dream destination
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={formData.destination_city}
                onChange={(e) => {
                  setFormData({ ...formData, destination_city: e.target.value });
                  setShowDestSuggestions(true);
                }}
                onFocus={() => setShowDestSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                onKeyDown={handleDestKeyDown}
                placeholder="Enter your destination city or country"
                aria-label="Destination city"
                aria-invalid={!!destError}
                className={`pl-12 h-14 text-lg bg-background rounded-xl transition-colors ${
                  destError 
                    ? "border-destructive focus:border-destructive focus:ring-destructive" 
                    : "border-border focus:border-primary"
                }`}
              />

              <AnimatePresence>
                {destError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-1.5 text-sm text-destructive mt-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {destError}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showDestSuggestions && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated z-50 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {filterCities(formData.destination_city).length > 0 ? (
                      filterCities(formData.destination_city).map((city) => (
                        <button
                          key={city}
                          className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                          onMouseDown={() => {
                            setFormData({ ...formData, destination_city: city });
                            setShowDestSuggestions(false);
                          }}
                        >
                          <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                          <span className="font-medium">{city}</span>
                          <span className="text-xs text-muted-foreground ml-auto">India</span>
                        </button>
                      ))
                    ) : formData.destination_city.trim() ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No cities found
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2.5">Popular destinations</p>
              <div className="flex flex-wrap gap-2">
                {quickSelectDestination.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setFormData({ ...formData, destination_city: city });
                      setDestError("");
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.destination_city === city
                        ? "gradient-accent text-accent-foreground shadow-glow-accent"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4 shadow-glow-accent"
              >
                <Calendar className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                When are you traveling?
              </h2>
              <p className="text-muted-foreground">
                Select your travel start date (optional)
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 flex flex-col items-center">
              <CalendarComponent
                mode="single"
                selected={formData.start_date}
                onSelect={(date) => setFormData({ ...formData, start_date: date })}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-xl border border-border bg-card"
              />
              {formData.start_date && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-primary font-medium"
                >
                  ✓ Starting on {formData.start_date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </motion.p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                You can skip this step — date is optional
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow"
              >
                <Calendar className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                How long is your trip?
              </h2>
              <p className="text-muted-foreground">
                Select or enter the number of days
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <motion.span 
                  key={formData.duration}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-7xl font-bold text-primary inline-block"
                >
                  {formData.duration}
                </motion.span>
                <span className="text-2xl text-muted-foreground ml-3">days</span>
              </div>

              <div className="space-y-4">
                <Slider
                  value={[formData.duration]}
                  onValueChange={([v]) => setFormData({ ...formData, duration: v })}
                  min={1}
                  max={14}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>1 day</span>
                  <span>14 days</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Label className="text-sm font-medium">Or enter manually:</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Math.min(30, Math.max(1, parseInt(e.target.value) || 1)) })}
                  min={1}
                  max={30}
                  className="w-24 h-10 text-center"
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        const budgetInfo = getBudgetLabel(formData.budget);
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4 shadow-glow-accent"
              >
                <Wallet className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                What's your budget?
              </h2>
              <p className="text-muted-foreground">
                Set your total trip budget
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="text-center mb-6">
                <motion.span 
                  key={formData.budget}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-display text-5xl md:text-6xl font-bold text-primary inline-block"
                >
                  ₹{formData.budget.toLocaleString()}
                </motion.span>
                <motion.div 
                  key={budgetInfo.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${budgetInfo.color}`}>
                    {budgetInfo.label}
                  </span>
                </motion.div>
              </div>

              <div className="space-y-4">
                <Slider
                  value={[formData.budget]}
                  onValueChange={([v]) => setFormData({ ...formData, budget: v })}
                  min={5000}
                  max={100000}
                  step={1000}
                  className="py-4"
                />
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>₹5,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Label className="text-sm font-medium">Or enter manually:</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Math.min(500000, Math.max(1000, parseInt(e.target.value) || 5000)) })}
                  min={1000}
                  className="w-32 h-10"
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout showFooter={false}>
      <TooltipProvider>
        <div className="gradient-hero min-h-screen pt-24 pb-8">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* Step Progress Label */}
            <div className="mb-3 text-center">
              <span className="text-sm font-semibold text-muted-foreground">
                Step {currentStep} of {totalSteps} — {steps[currentStep - 1].title}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  className="h-full gradient-primary rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: currentStep === step.id ? 1.1 : 1,
                      }}
                      className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        currentStep > step.id
                          ? "gradient-primary shadow-glow"
                          : currentStep === step.id
                          ? "gradient-primary shadow-glow"
                          : "bg-card border-2 border-border"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <step.icon className={`w-4 h-4 md:w-5 md:h-5 ${currentStep === step.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      )}
                    </motion.div>
                    <span className={`text-xs mt-1.5 font-semibold text-center hidden md:block ${currentStep === step.id ? "text-primary" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
                {/* Progress Line */}
                <div className="absolute top-5 md:top-[22px] left-0 right-0 h-1 bg-border -z-0 mx-6">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    className="h-full gradient-primary rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Step Content */}
            <motion.div 
              layout
              className="bg-card rounded-3xl border border-border p-6 md:p-8 shadow-elevated"
            >
              <AnimatePresence mode="wait">
                <StepContent step={currentStep} />
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-5 border-t border-border">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={currentStep === 1 ? () => navigate("/dashboard") : prevStep}
                      className="gap-2 h-11 px-5 rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {currentStep === 1 ? "Dashboard" : "Back"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {currentStep === 1 ? "Go back to dashboard" : `Back to ${steps[currentStep - 2]?.title}`}
                  </TooltipContent>
                </Tooltip>

                {currentStep < totalSteps ? (
                  <Button 
                    onClick={nextStep} 
                    disabled={isNextDisabled()}
                    className="gradient-primary gap-2 h-11 px-7 rounded-xl shadow-glow disabled:opacity-50 disabled:shadow-none"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="gradient-primary gap-2 h-11 px-7 rounded-xl shadow-glow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Trip Plan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Summary Card */}
            <AnimatePresence>
              {(formData.boarding_city || formData.destination_city) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-5 bg-card/80 backdrop-blur rounded-2xl p-4 border border-border shadow-soft"
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Trip Summary</p>
                  <div className="flex flex-wrap items-center gap-3 text-foreground">
                    {formData.boarding_city && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{formData.boarding_city}</span>
                        {formData.destination_city && (
                          <>
                            <ChevronRight className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm">{formData.destination_city}</span>
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 ml-auto text-muted-foreground text-xs">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {formData.duration} days
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-accent" />
                        ₹{formData.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </TooltipProvider>
    </Layout>
  );
}
