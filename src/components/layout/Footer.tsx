import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Travello</span>
            </Link>
            <p className="text-background/70 max-w-md mb-6">
              Your AI-powered travel companion. Plan smarter, travel better with
              personalized recommendations tailored to your preferences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/plan-trip" className="text-background/70 hover:text-background transition-colors">
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="text-background/70 hover:text-background transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-background/70 hover:text-background transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support & Contact</h4>
            <div className="space-y-3">
              <p className="text-background/90 font-medium">Aditya Zanjurne</p>
              <a
                href="tel:9028267069"
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
              >
                <Phone className="w-4 h-4" />
                9028267069
              </a>
              <a
                href="mailto:zanjurneaditya@gmail.com"
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
              >
                <Mail className="w-4 h-4" />
                zanjurneaditya@gmail.com
              </a>
              <a
                href="https://instagram.com/travello_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity mt-2"
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 text-center text-background/60 text-sm">
          © {new Date().getFullYear()} Travello. All rights reserved. Powered by AI.
        </div>
      </div>
    </footer>
  );
}
