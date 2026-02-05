import { useState, useEffect } from "react";
import { fetchPlaceImages, WikimediaImage } from "@/services/wikimediaService";
import { Skeleton } from "@/components/ui/skeleton";

interface DestinationImageProps {
  destination: string;
  className?: string;
  alt?: string;
  showAttribution?: boolean;
}

export function DestinationImage({ 
  destination, 
  className = "", 
  alt,
  showAttribution = true 
}: DestinationImageProps) {
  const [image, setImage] = useState<WikimediaImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
 
  useEffect(() => {
    async function loadImage() {
      try {
        const images = await fetchPlaceImages(destination, 1);
        if (images.length > 0) {
          setImage(images[0]);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadImage();
  }, [destination]);
 
  if (loading) {
    return (
      <Skeleton className={`${className}`} />
    );
  }
 
  if (error || !image) {
    return (
      <div
        className={`bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center ${className}`}
        aria-label={alt || destination}
      >
        <span className="text-muted-foreground text-sm font-medium">{destination}</span>
      </div>
    );
  }
 
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={image.thumbUrl}
        alt={alt || `${destination} destination`}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
        loading="lazy"
      />
      {showAttribution && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
          <p className="text-[9px] text-white/70">© Wikimedia Commons</p>
        </div>
      )}
    </div>
  );
}
