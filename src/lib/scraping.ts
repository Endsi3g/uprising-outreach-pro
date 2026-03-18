import { supabase } from './supabase';
import { generateProspectCopy } from './llm';
import { calculateLeadScore } from './scoring';
import { enrichSocialProfiles } from './social-enrichment';

/**
 * Service pour traiter les données provenant d'Apify (ou autres scrapers).
 */
export async function processScrapedLead(lead: any) {
  console.log(`⚙️ Traitement du prospect: ${lead.company_name}`);
  
  // 0. Enrichissement social
  const social = lead.website ? await enrichSocialProfiles(lead.website) : { linkedin: null, facebook: null, instagram: null };
  
  // 1. Calculer le score d'intelligence
  const scoring = await calculateLeadScore(lead.website, lead.metadata, social);
  
  // 2. Générer le contenu personnalisé
  const copy = await generateProspectCopy({
    ...lead,
    score: scoring.total,
    isOldWebsite: scoring.isOldWebsite,
    social
  });

  // Transformation des données Apify -> Schema Prospect
  const prospect = {
    campaign_id: lead.campaign_id,
    company_name: lead.company_name,
    website: lead.website,
    city: lead.city,
    industry: lead.industry,
    email: lead.email,
    phone_sms: lead.phone_sms,
    intent_type: 'google_maps_find', // Assuming this remains constant or comes from lead
    intent_strength: 'medium', // Assuming this remains constant or comes from lead
    status: 'new',
    outreach_copy: copy,
    score: scoring.total,
    website_age_tag: scoring.isOldWebsite ? '> 3 ans' : 'Récent',
    metadata: {
      ...lead.metadata,
      social
    }
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
