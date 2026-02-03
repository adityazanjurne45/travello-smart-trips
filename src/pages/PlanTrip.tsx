import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  Search
} from "lucide-react";

const steps = [
  { id: 1, title: "Departure", description: "Where are you starting?", icon: Navigation },
  { id: 2, title: "Destination", description: "Where do you want to go?", icon: MapPin },
  { id: 3, title: "Duration", description: "How long is your trip?", icon: Calendar },
  { id: 4, title: "Budget", description: "What's your budget?", icon: Wallet },
];

const popularCities = [
  "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Kerala", 
  "Udaipur", "Manali", "Shimla", "Agra", "Varanasi", "Rishikesh",
  "Darjeeling", "Ooty", "Kodaikanal", "Munnar", "Leh", "Gangtok"
];

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
  });

  const [showBoardingSuggestions, setShowBoardingSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  useEffect(() => {
    // Focus input on step change
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentStep]);

  const filterCities = (query: string) => {
    if (!query) return popularCities.slice(0, 8);
    return popularCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.boarding_city.trim()) {
      toast.error("Please enter your departure city");
      return;
    }
    if (currentStep === 2 && !formData.destination_city.trim()) {
      toast.error("Please enter your destination");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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

  const StepContent = ({ step }: { step: number }) => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-glow"
              >
                <Navigation className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Where are you starting from?
              </h2>
              <p className="text-muted-foreground text-lg">
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
                placeholder="Search for a city..."
                className="pl-12 h-14 text-lg bg-background border-border focus:border-primary rounded-xl"
              />
              <AnimatePresence>
                {showBoardingSuggestions && filterCities(formData.boarding_city).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated z-10 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {filterCities(formData.boarding_city).map((city) => (
                      <button
                        key={city}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                        onMouseDown={() => {
                          setFormData({ ...formData, boarding_city: city });
                          setShowBoardingSuggestions(false);
                        }}
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Popular cities</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    onClick={() => setFormData({ ...formData, boarding_city: city })}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
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
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-5 shadow-glow-accent"
              >
                <MapPin className="w-10 h-10 text-accent-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Where do you want to go?
              </h2>
              <p className="text-muted-foreground text-lg">
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
                placeholder="Search for a destination..."
                className="pl-12 h-14 text-lg bg-background border-border focus:border-primary rounded-xl"
              />
              <AnimatePresence>
                {showDestSuggestions && filterCities(formData.destination_city).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevated z-10 overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {filterCities(formData.destination_city).map((city) => (
                      <button
                        key={city}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3"
                        onMouseDown={() => {
                          setFormData({ ...formData, destination_city: city });
                          setShowDestSuggestions(false);
                        }}
                      >
                        <MapPin className="w-4 h-4 text-accent" />
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Popular destinations</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.slice(3, 9).map((city) => (
                  <button
                    key={city}
                    onClick={() => setFormData({ ...formData, destination_city: city })}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
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
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-glow"
              >
                <Calendar className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                How long is your trip?
              </h2>
              <p className="text-muted-foreground text-lg">
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

      case 4:
        const budgetInfo = getBudgetLabel(formData.budget);
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-5 shadow-glow-accent"
              >
                <Wallet className="w-10 h-10 text-accent-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                What's your budget?
              </h2>
              <p className="text-muted-foreground text-lg">
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
      <div className="gradient-hero min-h-screen pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Step Progress Indicator */}
          <div className="mb-4 text-center">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of 4
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 4) * 100}%` }}
                className="h-full gradient-primary rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: currentStep === step.id ? 1.1 : 1,
                    }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id
                        ? "gradient-primary shadow-glow"
                        : currentStep === step.id
                        ? "gradient-primary shadow-glow"
                        : "bg-card border-2 border-border"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <step.icon className={`w-5 h-5 md:w-6 md:h-6 ${currentStep === step.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    )}
                  </motion.div>
                  <span className={`text-xs md:text-sm mt-2 font-semibold text-center ${currentStep === step.id ? "text-primary" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              ))}
              {/* Progress Line */}
              <div className="absolute top-6 md:top-7 left-0 right-0 h-1 bg-border -z-0 mx-6">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  className="h-full gradient-primary rounded-full"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Step Content */}
          <motion.div 
            layout
            className="bg-card rounded-3xl border border-border p-6 md:p-10 shadow-elevated"
          >
            <AnimatePresence mode="wait">
              <StepContent step={currentStep} />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2 h-12 px-6 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep} className="gradient-primary gap-2 h-12 px-8 rounded-xl shadow-glow">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="gradient-primary gap-2 h-12 px-8 rounded-xl shadow-glow"
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
                className="mt-6 bg-card/80 backdrop-blur rounded-2xl p-5 border border-border shadow-soft"
              >
                <p className="text-sm font-semibold text-muted-foreground mb-3">Trip Summary</p>
                <div className="flex flex-wrap items-center gap-3 text-foreground">
                  {formData.boarding_city && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formData.boarding_city}</span>
                      {formData.destination_city && (
                        <>
                          <ChevronRight className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{formData.destination_city}</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-4 ml-auto text-muted-foreground text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formData.duration} days
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-accent" />
                      ₹{formData.budget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
