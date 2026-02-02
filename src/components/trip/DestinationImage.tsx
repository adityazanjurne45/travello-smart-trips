import { useState } from "react";

// Mapping of popular Indian destinations to Unsplash image URLs
const destinationImages: Record<string, string> = {
  // Mountains & Hill Stations
  "shimla": "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80",
  "manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
  "mussoorie": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  "darjeeling": "https://images.unsplash.com/photo-1622308644420-ed96f19b61b4?w=800&q=80",
  "ooty": "https://images.unsplash.com/photo-1574852922153-f1d93f0a1f6c?w=800&q=80",
  "nainital": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
  "mahabaleshwar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "munnar": "https://images.unsplash.com/photo-1594392175511-30eca83d51c8?w=800&q=80",
  "kodaikanal": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "ladakh": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "leh": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "srinagar": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  
  // Beaches
  "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
  "kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
  "andaman": "https://images.unsplash.com/photo-1586500036017-7f7597e7e7fc?w=800&q=80",
  "puri": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "kochi": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
  "pondicherry": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "vizag": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "kovalam": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
  
  // Heritage & Cities
  "jaipur": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
  "udaipur": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80",
  "jodhpur": "https://images.unsplash.com/photo-1542397284385-6010376c5337?w=800&q=80",
  "jaisalmer": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
  "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  "varanasi": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
  "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
  "new delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
  "mumbai": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80",
  "kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80",
  "chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  "bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
  "bengaluru": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
  "hyderabad": "https://images.unsplash.com/photo-1603118647806-a2e8b2e8e7c5?w=800&q=80",
  "mysore": "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80",
  "hampi": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
  "pune": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80",
  "ahmedabad": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
  "amritsar": "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80",
  "rishikesh": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
  "haridwar": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
  
  // Wildlife
  "ranthambore": "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
  "jim corbett": "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
  "kaziranga": "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
  
  // International
  "dubai": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
  "singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  "thailand": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80",
  "bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  "maldives": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
  "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  "switzerland": "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80",
};

// Default fallback images by category
const fallbackImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Mountains
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Beach
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80", // Heritage
  "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80", // City
];

function getDestinationImage(destination: string): string {
  const normalizedDest = destination.toLowerCase().trim();
  
  // Direct match
  if (destinationImages[normalizedDest]) {
    return destinationImages[normalizedDest];
  }
  
  // Partial match
  for (const [key, url] of Object.entries(destinationImages)) {
    if (normalizedDest.includes(key) || key.includes(normalizedDest)) {
      return url;
    }
  }
  
  // Fallback based on hash of destination name for consistency
  const hash = normalizedDest.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return fallbackImages[hash % fallbackImages.length];
}

interface DestinationImageProps {
  destination: string;
  className?: string;
  alt?: string;
}

export function DestinationImage({ destination, className = "", alt }: DestinationImageProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getDestinationImage(destination);
  
  if (imageError) {
    // Gradient fallback
    return (
      <div 
        className={`bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 ${className}`}
        aria-label={alt || destination}
      />
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={alt || `${destination} destination`}
      className={`object-cover ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}

export { getDestinationImage };
