import { motion } from "framer-motion";
import { Sparkles, MapPin, Hotel, Car, Loader2 } from "lucide-react";

const loadingSteps = [
  { icon: MapPin, text: "Finding best destinations...", delay: 0 },
  { icon: Hotel, text: "Analyzing hotels...", delay: 1.5 },
  { icon: Car, text: "Calculating routes...", delay: 3 },
  { icon: Sparkles, text: "Creating your perfect itinerary...", delay: 4.5 },
];

export function AILoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl p-8 md:p-12 border border-border text-center"
    >
      {/* Animated AI Icon */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-2 rounded-full gradient-primary flex items-center justify-center shadow-glow"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
        Our AI is Working
      </h2>
      <p className="text-muted-foreground text-lg mb-8">
        Analyzing your trip details and creating personalized recommendations...
      </p>

      {/* Loading Steps */}
      <div className="max-w-md mx-auto space-y-3 mb-8">
        {loadingSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay }}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 text-left"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: step.delay }}
              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
            >
              <step.icon className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-foreground">{step.text}</span>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: step.delay + 1 }}
              className="ml-auto"
            >
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="max-w-xs mx-auto">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "easeInOut" }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">This usually takes 10-15 seconds</p>
      </div>
    </motion.div>
  );
}
