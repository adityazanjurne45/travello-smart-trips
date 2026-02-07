import { useState, useEffect } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface TripRatingProps {
  tripId: string;
  tripEndDate?: string | null;
}

export function TripRating({ tripId, tripEndDate }: TripRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("trip_ratings")
      .select("*")
      .eq("trip_id", tripId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setRating(data.rating ?? 0);
          setReview(data.review ?? "");
          setSubmitted(true);
        }
        setLoading(false);
      });
  }, [tripId, user]);

  const submitRating = async () => {
    if (!user || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const { error } = await supabase.from("trip_ratings").insert({
      trip_id: tripId,
      user_id: user.id,
      rating,
      review: review.trim() || null,
    });

    if (error) {
      toast.error("Failed to submit rating");
      return;
    }
    setSubmitted(true);
    toast.success("Thanks for your feedback!");
  };

  if (loading) return null;

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
          <Star className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Rate Your Trip</h2>
          <p className="text-sm text-muted-foreground">
            {submitted ? "Thanks for your feedback!" : "How was your experience?"}
          </p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            disabled={submitted}
            onClick={() => setRating(star)}
            onMouseEnter={() => !submitted && setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-transform hover:scale-110 disabled:cursor-default"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredStar || rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        {(hoveredStar || rating) > 0 && (
          <span className="text-sm font-medium text-foreground ml-2">
            {ratingLabels[hoveredStar || rating]}
          </span>
        )}
      </div>

      {/* Review */}
      {!submitted ? (
        <div className="space-y-3">
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your experience (optional)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              maxLength={500}
            />
          </div>
          <Button onClick={submitRating} className="gradient-primary gap-2">
            <Send className="w-4 h-4" /> Submit Rating
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          {review && <p className="text-sm text-foreground italic">"{review}"</p>}
          <p className="text-xs text-muted-foreground mt-2">Your feedback helps improve AI recommendations</p>
        </div>
      )}
    </div>
  );
}
