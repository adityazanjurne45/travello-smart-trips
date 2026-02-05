 import { useState, useEffect } from "react";
 import { fetchPlaceImagesWithFallback, WikimediaImage } from "@/services/wikimediaService";
 
 interface UsePlaceImagesResult {
   images: WikimediaImage[];
   loading: boolean;
   error: string | null;
 }
 
 /**
  * Hook to fetch real images from Wikimedia Commons for a place
  */
 export function usePlaceImages(
   placeName: string,
   stateName?: string,
   limit: number = 6
 ): UsePlaceImagesResult {
   const [images, setImages] = useState<WikimediaImage[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     if (!placeName) {
       setLoading(false);
       return;
     }
 
     let cancelled = false;
 
     async function loadImages() {
       setLoading(true);
       setError(null);
 
       try {
         const fetchedImages = await fetchPlaceImagesWithFallback(
           placeName,
           stateName,
           limit
         );
 
         if (!cancelled) {
           setImages(fetchedImages);
         }
       } catch (err) {
         if (!cancelled) {
           setError("Failed to load images");
           console.error("Error loading place images:", err);
         }
       } finally {
         if (!cancelled) {
           setLoading(false);
         }
       }
     }
 
     loadImages();
 
     return () => {
       cancelled = true;
     };
   }, [placeName, stateName, limit]);
 
   return { images, loading, error };
 }