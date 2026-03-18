import axios from 'axios';

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const API_BASE = 'https://api.apify.com/v2';

/**
 * Service pour interagir avec Apify pour le scraping de Google Maps, Yelp, etc.
 */
export const apifySearch = async (query: string, location: string = 'Québec') => {
  if (!APIFY_TOKEN) {
    console.warn('⚠️ APIFY_API_TOKEN manquant dans .env.local. Utilisation limitée à Puppeteer.');
    return [];
  }

  try {
    console.log(`📡 Lancement de la recherche Apify (Google Maps) pour: "${query}" à "${location}"`);
    
    // Exemple avec l'Actor Google Maps Scraper
    // Note: L'ID de l'actor peut varier selon l'abonnement ou le besoin spécifique
    const actorId = 'search_google_maps'; 
    
    const response = await axios.post(`${API_BASE}/acts/apify~google-maps-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
      searchQueries: [`${query} in ${location}`],
      maxItems: 20,
      language: 'fr',
    });

    return response.data.map((item: any) => ({
      company_name: item.title,
      website: item.website,
      phone: item.phone,
      address: item.address,
      city: location,
      industry: query,
      source: 'Google Maps (Apify)',
      metadata: {
        reviews: item.reviewsCount,
        rating: item.totalScore,
        category: item.categoryName
      }
    }));
  } catch (error) {
    console.error('❌ Erreur Apify:', error);
    return [];
  }
};
