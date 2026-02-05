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
 import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface PlaceImageGalleryProps {
   placeName: string;
   stateName?: string;
   className?: string;
   showAttribution?: boolean;
   maxImages?: number;
   variant?: "carousel" | "grid" | "single";
 }
 
 export function PlaceImageGallery({
   placeName,
   stateName,
   className = "",
   showAttribution = true,
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
 
   if (variant === "single") {
     return (
       <div className={cn("relative overflow-hidden rounded-lg", className)}>
         <img
           src={validImages[0].thumbUrl}
           alt={placeName}
           className="w-full h-full object-cover"
           loading="lazy"
           onError={() => handleImageError(validImages[0].url)}
         />
         {showAttribution && (
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
             <p className="text-[10px] text-white/70">
               Images © Wikimedia Commons
             </p>
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
                     alt={`${placeName} - ${index + 1}`}
                     className="w-full h-full object-cover"
                     loading="lazy"
                     onError={() => handleImageError(image.url)}
                   />
                 </div>
               </CarouselItem>
             ))}
           </CarouselContent>
           {validImages.length > 1 && (
             <>
               <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-0" />
               <CarouselNext className="right-2 bg-white/80 hover:bg-white border-0" />
             </>
           )}
         </Carousel>
         {showAttribution && (
           <p className="text-[10px] text-muted-foreground mt-1 text-center">
             Images © Wikimedia Commons
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
               "relative aspect-square overflow-hidden rounded-lg",
               index === 0 && validImages.length >= 3 && "col-span-2 aspect-video"
             )}
           >
             <img
               src={image.thumbUrl}
               alt={`${placeName} - ${index + 1}`}
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
               loading="lazy"
               onError={() => handleImageError(image.url)}
             />
           </div>
         ))}
       </div>
       {showAttribution && (
         <p className="text-[10px] text-muted-foreground mt-2 text-center">
           Images © Wikimedia Commons
         </p>
       )}
     </div>
   );
 }