import { useState, useEffect, useCallback } from "react";
import { fetchPlaceImages, WikimediaImage as WikimediaImageType } from "@/services/wikimediaService";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, MapPin, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface WikimediaImageProps {
  placeName: string;
  className?: string;
  alt?: string;
  showAttribution?: boolean;
  showLocationBadge?: boolean;
  showRefresh?: boolean;
  fallbackGradient?: boolean;
}

export function WikimediaImage({
  placeName,
  className = "",
  alt,
  showAttribution = false,
  showLocationBadge = false,
  showRefresh = false,
  fallbackGradient = true,
}: WikimediaImageProps) {
  const [images, setImages] = useState<WikimediaImageType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadImages = useCallback(async () => {
    if (!placeName) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);

    try {
      const fetched = await fetchPlaceImages(placeName, 5);
      if (!cancelled) {
        setImages(fetched);
        setCurrentIndex(0);
        if (fetched.length === 0) setError(true);
      }
    } catch {
      if (!cancelled) setError(true);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => { cancelled = true; };
  }, [placeName]);

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
    if (fallbackGradient) {
      return (
        <div
          className={cn(
            "bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center",
            className
          )}
          aria-label={alt || placeName}
        >
          <div className="text-center text-muted-foreground">
            <ImageOff className="w-6 h-6 mx-auto mb-1 opacity-50" />
            <p className="text-xs">{placeName}</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden group", className)}>
      <img
        src={currentImage.thumbUrl}
        alt={alt || `${placeName} – real location photo`}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          refreshing ? "opacity-60" : "opacity-100"
        )}
        loading="lazy"
        onError={() => {
          if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setError(true);
          }
        }}
      />
      
      {/* Attribution & Location badge */}
      {(showAttribution || showLocationBadge) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1 flex items-end justify-between">
          {showLocationBadge && (
            <span className="inline-flex items-center gap-1 text-[9px] text-white/90 font-medium">
              <MapPin className="w-2.5 h-2.5" />
              Real photo
            </span>
          )}
          {showAttribution && (
            <span className="text-[9px] text-white/70">© Wikimedia Commons</span>
          )}
        </div>
      )}

      {/* Refresh */}
      {showRefresh && images.length > 1 && (
        <button
          onClick={handleRefresh}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="View another real photo"
          title="View another real photo"
        >
          <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} />
        </button>
      )}
    </div>
  );
}
