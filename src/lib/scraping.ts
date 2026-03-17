import { supabase } from './supabase';

/**
 * Service pour traiter les données provenant d'Apify (ou autres scrapers).
 */
export const processScrapedLead = async (rawData: any, campaignId: string) => {
  // Transformation des données Apify -> Schema Prospect
  const prospect = {
    campaign_id: campaignId,
    company_name: rawData.title || rawData.name || 'Inconnu',
    website: rawData.website,
    city: rawData.city || extractCity(rawData.address),
    industry: rawData.categoryName || 'PME',
    email: rawData.email || extractEmail(rawData.description),
    phone_sms: formatPhone(rawData.phoneNumber || rawData.phone),
    intent_type: 'google_maps_find',
    intent_strength: 'medium',
    metadata: {
      google_stars: rawData.totalScore,
      reviews_count: rawData.reviewsCount,
      apify_url: rawData.url,
      address: rawData.address,
    },
    status: 'new',
  };

  // Insertion dans Supabase
  if (prospect.email || prospect.phone_sms) {
    const { data, error } = await supabase
      .from('prospects')
      .insert([prospect])
      .select()
      .single();

    if (error) {
      console.error('Error inserting prospect:', error);
      return null;
    }
    return data;
  }

  return null;
};

// Helpers simples
function extractCity(address: string) {
  if (!address) return null;
  const parts = address.split(',');
  return parts.length > 1 ? parts[parts.length - 2].trim() : null;
}

function extractEmail(text: string) {
  if (!text) return null;
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function formatPhone(phone: string) {
  if (!phone) return null;
  // Nettoyage basique pour Twilio (format E.164 simplifié)
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11 && cleaned.startsWith('1')) return `+${cleaned}`;
  return phone;
}
