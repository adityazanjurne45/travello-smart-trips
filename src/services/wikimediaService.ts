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

// File extensions to reject — only keep actual photos
const REJECTED_EXTENSIONS = [
  '.svg', '.ogg', '.ogv', '.webm', '.mp3', '.wav',
  '.pdf', '.djvu', '.tiff', '.tif', '.xcf', '.mid',
  '.flac', '.opus', '.stl',
];

/**
 * Fetches real images from Wikimedia Commons for a given place name
 */
export async function fetchPlaceImages(
  placeName: string,
  limit: number = 6
): Promise<WikimediaImage[]> {
  try {
    const searchQuery = buildSearchQuery(placeName);
    
    // Request more than needed to account for filtered-out non-photos
    const fetchLimit = Math.min(limit * 3, 20);
    
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: searchQuery,
      gsrlimit: fetchLimit.toString(),
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
      if (images.length >= limit) break;
      
      if (page.imageinfo && page.imageinfo.length > 0) {
        const info = page.imageinfo[0];
        const url = info.url.toLowerCase();
        
        // Filter out non-photo file types
        if (REJECTED_EXTENSIONS.some(ext => url.endsWith(ext))) {
          continue;
        }
        
        // Only accept common image formats
        const isImage = url.endsWith('.jpg') || url.endsWith('.jpeg') || 
                        url.endsWith('.png') || url.endsWith('.webp') ||
                        url.endsWith('.gif');
        if (!isImage) {
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
  
  // Context map for better search results
  const contextMap: Record<string, string> = {
    // Indian destinations
    "goa": "Goa India beach coastline",
    "jaipur": "Jaipur Rajasthan India palace",
    "udaipur": "Udaipur Rajasthan lake palace",
    "mumbai": "Mumbai Maharashtra skyline",
    "delhi": "Delhi India monument Red Fort",
    "new delhi": "New Delhi India Gate monument",
    "agra": "Agra Taj Mahal India",
    "varanasi": "Varanasi Ganges ghats India",
    "kerala": "Kerala India backwaters houseboat",
    "manali": "Manali Himachal Pradesh mountains snow",
    "shimla": "Shimla Himachal Pradesh hill station",
    "darjeeling": "Darjeeling West Bengal tea plantation",
    "ooty": "Ooty Nilgiris Tamil Nadu",
    "mysore": "Mysore Karnataka palace",
    "mysuru": "Mysuru Karnataka palace",
    "hampi": "Hampi Karnataka ruins temple",
    "rishikesh": "Rishikesh Uttarakhand Ganga bridge",
    "mahabaleshwar": "Mahabaleshwar Maharashtra viewpoint",
    "lonavala": "Lonavala Maharashtra hills",
    "munnar": "Munnar Kerala tea plantations hills",
    "kodaikanal": "Kodaikanal Tamil Nadu lake",
    "ladakh": "Ladakh India mountains monastery",
    "srinagar": "Srinagar Kashmir Dal Lake houseboat",
    "kashmir": "Kashmir Dal Lake Srinagar valley",
    "amritsar": "Amritsar Golden Temple Punjab",
    "jaisalmer": "Jaisalmer Rajasthan desert fort",
    "jodhpur": "Jodhpur Rajasthan blue city Mehrangarh",
    "pushkar": "Pushkar Rajasthan lake temple",
    "khajuraho": "Khajuraho temples Madhya Pradesh",
    "konark": "Konark Sun Temple Odisha",
    "puri": "Puri Odisha Jagannath temple beach",
    "bangalore": "Bangalore Karnataka Vidhana Soudha",
    "bengaluru": "Bengaluru Karnataka Vidhana Soudha",
    "chennai": "Chennai Tamil Nadu Marina Beach",
    "hyderabad": "Hyderabad Charminar monument",
    "kolkata": "Kolkata Victoria Memorial Howrah",
    "pune": "Pune Maharashtra Shaniwar Wada",
    "ahmedabad": "Ahmedabad Gujarat Sabarmati",
    "kochi": "Kochi Kerala Chinese fishing nets",
    "pondicherry": "Pondicherry French colony promenade",
    "puducherry": "Puducherry French colony promenade",
    "andaman": "Andaman Islands India beach turquoise",
    "leh": "Leh Ladakh monastery mountains",
    "satara": "Satara Maharashtra Kaas Plateau fort",
    "alleppey": "Alleppey Kerala houseboat backwaters",
    "alappuzha": "Alappuzha Kerala houseboat backwaters",
    "coorg": "Coorg Karnataka coffee plantation",
    "kodagu": "Kodagu Karnataka coffee plantation",
    "nainital": "Nainital Uttarakhand lake",
    "mussoorie": "Mussoorie Uttarakhand hill station",
    "gangtok": "Gangtok Sikkim mountains monastery",
    "shillong": "Shillong Meghalaya hills",
    "pahalgam": "Pahalgam Kashmir Lidder valley",
    "gulmarg": "Gulmarg Kashmir ski gondola meadow",
    "sonamarg": "Sonamarg Kashmir glacier mountain",
    "mount abu": "Mount Abu Rajasthan Dilwara temple",
    "ranthambore": "Ranthambore Rajasthan tiger fort",
    "ajanta": "Ajanta Caves Maharashtra Buddhist",
    "ellora": "Ellora Caves Maharashtra temple",
    // International
    "paris": "Paris France Eiffel Tower",
    "london": "London England Big Ben Thames",
    "new york": "New York City Manhattan skyline",
    "tokyo": "Tokyo Japan Shibuya temple",
    "dubai": "Dubai UAE Burj Khalifa skyline",
    "singapore": "Singapore Marina Bay Sands skyline",
    "bangkok": "Bangkok Thailand temple Grand Palace",
    "bali": "Bali Indonesia temple rice terrace",
    "rome": "Rome Italy Colosseum",
    "barcelona": "Barcelona Spain Sagrada Familia",
    "amsterdam": "Amsterdam Netherlands canal",
    "sydney": "Sydney Australia Opera House",
    "usa": "United States of America landmark scenic",
  };
  
  // Check if we have a specific context
  for (const [key, context] of Object.entries(contextMap)) {
    if (normalizedName.includes(key)) {
      return context;
    }
  }
  
  // For unknown places, use descriptive search
  return `${placeName} landmark tourist scenic photograph`;
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
