 // Wikimedia Commons API service for fetching real location images
 
 const WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php";
 
 export interface WikimediaImage {
   title: string;
   url: string;
   thumbUrl: string;
   descriptionUrl: string;
 }
 
 interface WikimediaResponse {
   query?: {
     pages?: Record<string, {
       pageid: number;
       title: string;
       imageinfo?: Array<{
         url: string;
         descriptionurl: string;
         thumburl?: string;
       }>;
     }>;
   };
 }
 
 /**
  * Fetches real images from Wikimedia Commons for a given place name
  * @param placeName - Name of the place (city, landmark, tourist spot)
  * @param limit - Maximum number of images to fetch (default: 6)
  * @returns Array of image objects with URLs
  */
 export async function fetchPlaceImages(
   placeName: string,
   limit: number = 6
 ): Promise<WikimediaImage[]> {
   try {
     // Build search query with location context for better results
     const searchQuery = buildSearchQuery(placeName);
     
     const params = new URLSearchParams({
       action: "query",
       generator: "search",
       gsrsearch: searchQuery,
       gsrlimit: limit.toString(),
       gsrnamespace: "6", // File namespace
       prop: "imageinfo",
       iiprop: "url|extmetadata",
       iiurlwidth: "800", // Get thumbnail at 800px width
       format: "json",
       origin: "*",
     });
 
     const response = await fetch(`${WIKIMEDIA_API_URL}?${params}`);
     
     if (!response.ok) {
       throw new Error(`Wikimedia API error: ${response.status}`);
     }
 
     const data: WikimediaResponse = await response.json();
     
     if (!data.query?.pages) {
       return [];
     }
 
     const images: WikimediaImage[] = [];
     
     for (const page of Object.values(data.query.pages)) {
       if (page.imageinfo && page.imageinfo.length > 0) {
         const info = page.imageinfo[0];
         
         // Filter out SVG, audio, video files - only keep actual photos
         const url = info.url.toLowerCase();
         if (url.endsWith('.svg') || url.endsWith('.ogg') || url.endsWith('.ogv') || 
             url.endsWith('.webm') || url.endsWith('.mp3') || url.endsWith('.wav')) {
           continue;
         }
         
         images.push({
           title: page.title.replace('File:', ''),
           url: info.url,
           thumbUrl: info.thumburl || info.url,
           descriptionUrl: info.descriptionurl,
         });
       }
     }
 
     return images;
   } catch (error) {
     console.error("Error fetching Wikimedia images:", error);
     return [];
   }
 }
 
 /**
  * Builds an optimized search query for Indian and international locations
  */
 function buildSearchQuery(placeName: string): string {
   const normalizedName = placeName.toLowerCase().trim();
   
   // Add context for common Indian destinations
   const indianContextMap: Record<string, string> = {
     "goa": "Goa India beach",
     "jaipur": "Jaipur Rajasthan India palace",
     "udaipur": "Udaipur Rajasthan lake palace",
     "mumbai": "Mumbai Maharashtra India",
     "delhi": "Delhi India monument",
     "agra": "Agra Taj Mahal India",
     "varanasi": "Varanasi Ganges India",
     "kerala": "Kerala India backwaters",
     "manali": "Manali Himachal Pradesh mountains",
     "shimla": "Shimla Himachal Pradesh hill station",
     "darjeeling": "Darjeeling West Bengal tea",
     "ooty": "Ooty Tamil Nadu hill station",
     "mysore": "Mysore Karnataka palace",
     "hampi": "Hampi Karnataka ruins",
     "rishikesh": "Rishikesh Uttarakhand yoga",
     "mahabaleshwar": "Mahabaleshwar Maharashtra hill station",
     "lonavala": "Lonavala Maharashtra",
     "munnar": "Munnar Kerala tea plantations",
     "kodaikanal": "Kodaikanal Tamil Nadu",
     "ladakh": "Ladakh India mountains",
     "srinagar": "Srinagar Kashmir Dal Lake",
     "amritsar": "Amritsar Golden Temple Punjab",
     "jaisalmer": "Jaisalmer Rajasthan desert fort",
     "jodhpur": "Jodhpur Rajasthan blue city",
     "pushkar": "Pushkar Rajasthan",
     "khajuraho": "Khajuraho temples Madhya Pradesh",
     "konark": "Konark Sun Temple Odisha",
     "puri": "Puri Odisha Jagannath temple beach",
     "bangalore": "Bangalore Karnataka India",
     "chennai": "Chennai Tamil Nadu India",
     "hyderabad": "Hyderabad Charminar India",
     "kolkata": "Kolkata West Bengal Victoria Memorial",
     "pune": "Pune Maharashtra India",
     "ahmedabad": "Ahmedabad Gujarat India",
     "kochi": "Kochi Kerala Chinese fishing nets",
     "pondicherry": "Pondicherry French colony India",
     "andaman": "Andaman Islands India beach",
     "leh": "Leh Ladakh monastery",
   };
   
   // Check if we have a specific context for this place
   for (const [key, context] of Object.entries(indianContextMap)) {
     if (normalizedName.includes(key)) {
       return context;
     }
   }
   
   // For other places, add "India" if it seems like an Indian location
   // or just use the place name as-is for international destinations
   return `${placeName} landmark tourist`;
 }
 
 /**
  * Fetches images with retry and fallback logic
  */
 export async function fetchPlaceImagesWithFallback(
   placeName: string,
   stateName?: string,
   limit: number = 6
 ): Promise<WikimediaImage[]> {
   // First attempt with place name
   let images = await fetchPlaceImages(placeName, limit);
   
   if (images.length === 0 && stateName) {
     // Second attempt with state context
     images = await fetchPlaceImages(`${placeName} ${stateName}`, limit);
   }
   
   if (images.length === 0) {
     // Third attempt with broader search
     images = await fetchPlaceImages(`${placeName} India tourism`, limit);
   }
   
   return images;
 }