import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Sparkles, 
  Route, 
  Hotel, 
  Car, 
  Shield, 
  Zap,
  ChevronRight,
  Star
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      description: "Our intelligent engine learns your preferences to suggest perfect destinations, hotels, and transport.",
    },
    {
      icon: Route,
      title: "Smart Itineraries",
      description: "Get day-by-day travel plans optimized for time, budget, and local traffic conditions.",
    },
    {
      icon: Hotel,
      title: "Budget-Friendly Hotels",
      description: "Find the best accommodations matching your budget and comfort preferences.",
    },
    {
      icon: Car,
      title: "Transport Optimization",
      description: "Choose between bikes, cars, or public transport based on distance and cost efficiency.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your travel data is encrypted and stored securely. Your privacy is our priority.",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Get smart warnings about budget overflow, time constraints, and heavy traffic.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Travelers" },
    { value: "500+", label: "Destinations" },
    { value: "4.9", label: "User Rating", icon: Star },
    { value: "24/7", label: "AI Support" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-light border border-primary/20 text-primary font-medium text-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              AI-Powered Trip Planning
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-up">
              Travel Smarter,{" "}
              <span className="text-gradient-primary">Explore More</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Plan your perfect trip with personalized AI recommendations for destinations, 
              hotels, and transport—all tailored to your budget and preferences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="gradient-primary shadow-glow hover:opacity-90 transition-all text-lg px-8">
                <Link to="/register">
                  Start Planning Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  {stat.icon && <stat.icon className="w-6 h-6 text-accent fill-accent" />}
                </div>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Everything You Need to Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From AI recommendations to real-time updates, Travello has all the tools 
              you need for a seamless travel experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-primary-foreground">
            <MapPin className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="font-display text-4xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of travelers who trust Travello for their trip planning needs.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/register">
                Create Free Account
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
