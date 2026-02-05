 import { useState, useEffect } from "react";
 import { fetchPlaceImages, WikimediaImage as WikimediaImageType } from "@/services/wikimediaService";
 import { Skeleton } from "@/components/ui/skeleton";
 import { ImageOff } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface WikimediaImageProps {
   placeName: string;
   className?: string;
   alt?: string;
   showAttribution?: boolean;
   fallbackGradient?: boolean;
 }
 
 export function WikimediaImage({
   placeName,
   className = "",
   alt,
   showAttribution = false,
   fallbackGradient = true,
 }: WikimediaImageProps) {
   const [image, setImage] = useState<WikimediaImageType | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
 
   useEffect(() => {
     if (!placeName) {
       setLoading(false);
       return;
     }
 
     let cancelled = false;
 
     async function loadImage() {
       setLoading(true);
       setError(false);
 
       try {
         const images = await fetchPlaceImages(placeName, 1);
         if (!cancelled && images.length > 0) {
           setImage(images[0]);
         }
       } catch (err) {
         if (!cancelled) {
           setError(true);
         }
       } finally {
         if (!cancelled) {
           setLoading(false);
         }
       }
     }
 
     loadImage();
 
     return () => {
       cancelled = true;
     };
   }, [placeName]);
 
   if (loading) {
     return <Skeleton className={cn("rounded-lg", className)} />;
   }
 
   if (error || !image) {
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
     <div className={cn("relative overflow-hidden", className)}>
       <img
         src={image.thumbUrl}
         alt={alt || placeName}
         className="w-full h-full object-cover"
         loading="lazy"
         onError={() => setError(true)}
       />
       {showAttribution && (
         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
           <p className="text-[9px] text-white/70">© Wikimedia Commons</p>
         </div>
       )}
     </div>
   );
 }