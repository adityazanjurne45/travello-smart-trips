import { useState } from "react";
import { usePlaceImages } from "@/hooks/usePlaceImages";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ImageOff, MapPin, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceImageGalleryProps {
  placeName: string;
  stateName?: string;
  className?: string;
  showAttribution?: boolean;
  showLocationBadge?: boolean;
  maxImages?: number;
  variant?: "carousel" | "grid" | "single";
}

export function PlaceImageGallery({
  placeName,
  stateName,
  className = "",
  showAttribution = true,
  showLocationBadge = true,
  maxImages = 4,
  variant = "single",
}: PlaceImageGalleryProps) {
  const { images, loading, error } = usePlaceImages(placeName, stateName, maxImages);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (url: string) => {
    setFailedImages((prev) => new Set(prev).add(url));
  };

  const validImages = images.filter((img) => !failedImages.has(img.url));

  if (loading) {
    return (
      <div className={cn("relative", className)}>
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    );
  }

  if (error || validImages.length === 0) {
    return (
      <div 
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-lg",
          className
        )}
      >
        <div className="text-center text-muted-foreground p-4">
          <ImageOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  // Extract clean place name (remove destination suffix if present)
  const displayName = placeName.split(' ').slice(0, 3).join(' ');

  if (variant === "single") {
    return (
      <div className={cn("relative overflow-hidden rounded-lg group", className)}>
        <img
          src={validImages[0].thumbUrl}
          alt={`${displayName} – real location photo`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => handleImageError(validImages[0].url)}
        />
        {(showAttribution || showLocationBadge) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex items-end justify-between">
            {showLocationBadge && (
              <span className="inline-flex items-center gap-1 text-[9px] text-white/90 font-medium">
                <MapPin className="w-2.5 h-2.5" />
                Real photo
              </span>
            )}
            {showAttribution && (
              <span className="text-[9px] text-white/60">
                © Wikimedia Commons
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === "carousel") {
    return (
      <div className={cn("relative", className)}>
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {validImages.map((image, index) => (
              <CarouselItem key={image.url + index}>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={image.thumbUrl}
                    alt={`${displayName} – photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(image.url)}
                  />
                  {showLocationBadge && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                      <span className="inline-flex items-center gap-1 text-[9px] text-white/90 font-medium">
                        <MapPin className="w-2.5 h-2.5" />
                        Real photo
                      </span>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {validImages.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-card/80 hover:bg-card border-0" />
              <CarouselNext className="right-2 bg-card/80 hover:bg-card border-0" />
            </>
          )}
        </Carousel>
        {showAttribution && (
          <p className="text-[10px] text-muted-foreground mt-1 text-center">
            📍 Real location images © Wikimedia Commons
          </p>
        )}
      </div>
    );
  }

  // Grid variant
  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-cols-2 gap-2">
        {validImages.slice(0, 4).map((image, index) => (
          <div 
            key={image.url + index} 
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg group",
              index === 0 && validImages.length >= 3 && "col-span-2 aspect-video"
            )}
          >
            <img
              src={image.thumbUrl}
              alt={`${displayName} – photo ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={() => handleImageError(image.url)}
            />
            {index === 0 && showLocationBadge && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                <span className="inline-flex items-center gap-1 text-[9px] text-white/90 font-medium">
                  <MapPin className="w-2.5 h-2.5" />
                  Real photos of {displayName}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {showAttribution && (
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          📍 Real location images © Wikimedia Commons
        </p>
      )}
    </div>
  );
}
