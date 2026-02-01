import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Compass, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">Travello</span>
            </Link>
            <p className="text-background/70 max-w-md mb-6 text-lg leading-relaxed">
              Your AI-powered travel companion. Plan smarter, travel better with
              personalized recommendations tailored to your preferences.
            </p>
            <div className="flex items-center gap-2 text-background/60 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-accent fill-accent" />
              <span>for travelers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: "/plan-trip", label: "Plan a Trip" },
                { to: "/my-trips", label: "My Trips" },
                { to: "/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-background/70 hover:text-background transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-5">Support & Contact</h4>
            <div className="space-y-4">
              <p className="text-background font-semibold">Aditya Zanjurne</p>
              <a
                href="tel:9028267069"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                9028267069
              </a>
              <a
                href="mailto:zanjurneaditya@gmail.com"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                zanjurneaditya@gmail.com
              </a>
              <a
                href="https://instagram.com/travello_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity mt-3 font-medium shadow-lg"
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50 text-sm">
          © {new Date().getFullYear()} Travello. All rights reserved. Powered by AI.
        </div>
      </div>
    </footer>
  );
}
