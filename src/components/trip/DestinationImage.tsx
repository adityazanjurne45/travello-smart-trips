import { useState, useEffect, useCallback } from "react";
import { fetchPlaceImages, WikimediaImage } from "@/services/wikimediaService";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationImageProps {
  destination: string;
  className?: string;
  alt?: string;
  showAttribution?: boolean;
  showLocationBadge?: boolean;
  showRefresh?: boolean;
}

export function DestinationImage({ 
  destination, 
  className = "", 
  alt,
  showAttribution = true,
  showLocationBadge = true,
  showRefresh = false,
}: DestinationImageProps) {
  const [images, setImages] = useState<WikimediaImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadImages = useCallback(async () => {
    if (!destination) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const fetched = await fetchPlaceImages(destination, 5);
      setImages(fetched);
      setCurrentIndex(0);
      if (fetched.length === 0) setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [destination]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleRefresh = () => {
    if (images.length > 1) {
      setRefreshing(true);
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setTimeout(() => setRefreshing(false), 300);
    }
  };

  const currentImage = images[currentIndex] || null;

  if (loading) {
    return <Skeleton className={cn("rounded-lg", className)} />;
  }

  if (error || !currentImage) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center rounded-lg",
          className
        )}
        aria-label={alt || destination}
      >
        <div className="text-center text-muted-foreground p-4">
          <MapPin className="w-6 h-6 mx-auto mb-1 opacity-50" />
          <span className="text-sm font-medium">{destination}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden group", className)}>
      <img
        src={currentImage.thumbUrl}
        alt={alt || `${destination} – real location photo`}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          refreshing ? "opacity-60" : "opacity-100"
        )}
        onError={() => {
          // Try next image on error
          if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setError(true);
          }
        }}
        loading="lazy"
      />
      
      {/* Bottom overlay with attribution + location badge */}
      {(showAttribution || showLocationBadge) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 flex items-end justify-between">
          <div className="flex items-center gap-1.5">
            {showLocationBadge && (
              <span className="inline-flex items-center gap-1 text-[10px] text-white/90 font-medium">
                <MapPin className="w-2.5 h-2.5" />
                Real photo of {destination}
              </span>
            )}
          </div>
          {showAttribution && (
            <span className="text-[9px] text-white/60">© Wikimedia Commons</span>
          )}
        </div>
      )}

      {/* Refresh button */}
      {showRefresh && images.length > 1 && (
        <button
          onClick={handleRefresh}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="View another real photo"
          title="View another real photo"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
        </button>
      )}
    </div>
  );
}
