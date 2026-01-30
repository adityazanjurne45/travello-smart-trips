import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Loader2,
  Check
} from "lucide-react";

const steps = [
  { id: 1, title: "Departure", icon: Navigation },
  { id: 2, title: "Destination", icon: MapPin },
  { id: 3, title: "Duration", icon: Calendar },
  { id: 4, title: "Budget", icon: Wallet },
];

const popularCities = [
  "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Kerala", 
  "Udaipur", "Manali", "Shimla", "Agra", "Varanasi", "Rishikesh"
];

export default function PlanTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    boarding_city: "",
    destination_city: "",
    duration: 3,
    budget: 20000,
  });

  const [filteredBoardingCities, setFilteredBoardingCities] = useState<string[]>([]);
  const [filteredDestCities, setFilteredDestCities] = useState<string[]>([]);

  const filterCities = (query: string) => {
    if (!query) return [];
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

    // First create the trip
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

    // Navigate to the trip details page which will generate recommendations
    navigate(`/trip/${trip.id}`);
  };

  const getBudgetLabel = (budget: number) => {
    if (budget < 10000) return "Budget Friendly";
    if (budget < 30000) return "Moderate";
    if (budget < 60000) return "Comfortable";
    return "Premium";
  };

  return (
    <Layout showFooter={false}>
      <div className="gradient-hero min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? "gradient-primary"
                        : currentStep === step.id
                        ? "gradient-primary shadow-glow"
                        : "bg-card border border-border"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${currentStep === step.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium ${currentStep === step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              ))}
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-0">
                <div
                  className="h-full gradient-primary transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-2xl border border-border p-8 shadow-soft">
            {/* Step 1: Boarding City */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Navigation className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Where are you starting from?
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your departure city
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={formData.boarding_city}
                      onChange={(e) => {
                        setFormData({ ...formData, boarding_city: e.target.value });
                        setFilteredBoardingCities(filterCities(e.target.value));
                      }}
                      placeholder="Enter city name..."
                      className="text-lg py-6"
                    />
                    {filteredBoardingCities.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-medium z-10 overflow-hidden">
                        {filteredBoardingCities.map((city) => (
                          <button
                            key={city}
                            className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                            onClick={() => {
                              setFormData({ ...formData, boarding_city: city });
                              setFilteredBoardingCities([]);
                            }}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Popular cities</p>
                    <div className="flex flex-wrap gap-2">
                      {popularCities.slice(0, 6).map((city) => (
                        <button
                          key={city}
                          onClick={() => setFormData({ ...formData, boarding_city: city })}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.boarding_city === city
                              ? "gradient-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Destination */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Where do you want to go?
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your dream destination
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={formData.destination_city}
                      onChange={(e) => {
                        setFormData({ ...formData, destination_city: e.target.value });
                        setFilteredDestCities(filterCities(e.target.value));
                      }}
                      placeholder="Enter destination..."
                      className="text-lg py-6"
                    />
                    {filteredDestCities.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-medium z-10 overflow-hidden">
                        {filteredDestCities.map((city) => (
                          <button
                            key={city}
                            className="w-full text-left px-4 py-3 hover:bg-muted transition-colors"
                            onClick={() => {
                              setFormData({ ...formData, destination_city: city });
                              setFilteredDestCities([]);
                            }}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Popular destinations</p>
                    <div className="flex flex-wrap gap-2">
                      {popularCities.slice(3, 9).map((city) => (
                        <button
                          key={city}
                          onClick={() => setFormData({ ...formData, destination_city: city })}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.destination_city === city
                              ? "gradient-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Duration */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    How long is your trip?
                  </h2>
                  <p className="text-muted-foreground">
                    Select the number of days
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <span className="font-display text-6xl font-bold text-primary">
                      {formData.duration}
                    </span>
                    <span className="text-2xl text-muted-foreground ml-2">days</span>
                  </div>

                  <Slider
                    value={[formData.duration]}
                    onValueChange={([v]) => setFormData({ ...formData, duration: v })}
                    min={1}
                    max={14}
                    step={1}
                    className="py-4"
                  />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 day</span>
                    <span>14 days</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Budget */}
            {currentStep === 4 && (
              <div className="animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    What's your budget?
                  </h2>
                  <p className="text-muted-foreground">
                    Set your total trip budget
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="text-center">
                    <span className="font-display text-5xl font-bold text-primary">
                      ₹{formData.budget.toLocaleString()}
                    </span>
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.budget < 10000 ? "bg-green-100 text-green-700" :
                        formData.budget < 30000 ? "bg-blue-100 text-blue-700" :
                        formData.budget < 60000 ? "bg-purple-100 text-purple-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {getBudgetLabel(formData.budget)}
                      </span>
                    </div>
                  </div>

                  <Slider
                    value={[formData.budget]}
                    onValueChange={([v]) => setFormData({ ...formData, budget: v })}
                    min={5000}
                    max={100000}
                    step={1000}
                    className="py-4"
                  />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹5,000</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep} className="gradient-primary gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="gradient-primary gap-2"
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
          </div>

          {/* Summary Card */}
          {(formData.boarding_city || formData.destination_city) && (
            <div className="mt-6 bg-card/50 backdrop-blur rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Trip Summary</p>
              <div className="flex items-center gap-2 text-foreground">
                {formData.boarding_city && (
                  <>
                    <span className="font-medium">{formData.boarding_city}</span>
                    {formData.destination_city && (
                      <>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{formData.destination_city}</span>
                      </>
                    )}
                  </>
                )}
                {formData.duration && (
                  <span className="ml-auto text-muted-foreground">
                    {formData.duration} days • ₹{formData.budget.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
