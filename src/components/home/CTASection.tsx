import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Sparkles, Shield, Star, Globe } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full border border-primary-foreground/10"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full border border-primary-foreground/10"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/15 backdrop-blur-md border border-primary-foreground/20 mb-8"
          >
            <Lock className="w-4 h-4 text-primary-foreground/90" />
            <span className="text-sm font-semibold text-primary-foreground">Secure & Private</span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-primary-foreground/90">Next Adventure?</span>
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/85 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
            Login to unlock your personalized travel plan crafted by our AI engine, 
            tailored perfectly to your style and budget.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
            {[
              { icon: Shield, text: "Bank-grade Encryption" },
              { icon: Star, text: "4.9/5 User Rating" },
              { icon: Globe, text: "500+ Destinations" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-primary-foreground/80">
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 h-14 shadow-lg group rounded-xl font-semibold"
            >
              <Link to="/register">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 h-14 rounded-xl font-semibold"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          {/* Bottom Text */}
          <p className="text-primary-foreground/60 text-sm mt-8 font-medium">
            No credit card required • Free forever for basic features
          </p>
        </motion.div>
      </div>
    </section>
  );
}
