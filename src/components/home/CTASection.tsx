import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Sparkles, Shield, Star } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full border border-white/10"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full border border-white/10"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <Lock className="w-4 h-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">Secure & Private</span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Start Your
            <br />
            <span className="text-white/90">Adventure?</span>
          </h2>

          <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
            Login to unlock your personalized travel plan crafted by our AI engine, 
            tailored perfectly to your style and budget.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Bank-grade Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Star className="w-5 h-5" />
              <span className="text-sm">4.9/5 User Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">AI-Powered</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 h-14 shadow-lg group"
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
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 h-14"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>

          {/* Bottom Text */}
          <p className="text-white/60 text-sm mt-6">
            No credit card required • Free forever for basic features
          </p>
        </motion.div>
      </div>
    </section>
  );
}
