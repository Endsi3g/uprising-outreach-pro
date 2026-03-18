import { processScrapedLead } from '@/lib/scraping';
import { runOutreachSequence } from '../lib/orchestration';
import { supabase } from '../lib/supabase';
import { searchWeb } from '../lib/search';

/**
 * Script de test pour simuler un flux complet.
 * Utilisation: npx tsx src/scripts/test-flow.ts
 */
async function testFlow() {
  console.log('🚀 Démarrage du test de flux...');

  // Demander un sujet de test ou utiliser un vrai prospect cible
  const query = process.argv[2] || "Plombier à Montréal";
  console.log(`--- 0. Recherche de données réelles pour: "${query}" ---`);
  
  // Utilisation de Puppeteer pour trouver un vrai lead au lieu d'un mock
  const searchResults = await searchWeb(query);
  if (searchResults.length === 0) {
    throw new Error("Aucun résultat trouvé pour la recherche réelle.");
  }

  const firstResult = searchResults[0];
  
  // Normalisation du lead pour processScrapedLead
  const leadToProcess = {
    company_name: firstResult.company_name || firstResult.title || "Inconnu",
    website: firstResult.website || firstResult.link || null,
    city: firstResult.city || query.split('à')[1]?.trim() || 'Montréal',
    industry: firstResult.industry || query.split('à')[0]?.trim() || 'Service',
    phone_sms: firstResult.phone || firstResult.phone_sms || '5140000000',
    email: firstResult.email || 'votre-email@exemple.com',
    metadata: firstResult.metadata || {
      rating: firstResult.rating || 4.5,
      reviews: firstResult.reviews || 10,
    }
  };

  try {
    // 1. Création d'une campagne de test si nécessaire
    console.log('--- 1. Vérification campagne ---');
    let campaignId = '00000000-0000-0000-0000-000000000000';
    const { data: campaign } = await supabase.from('campaigns').select('id').limit(1).single();
    if (campaign) {
      campaignId = campaign.id;
    } else {
      const { data: newCampaign } = await supabase.from('campaigns').insert([{ name: 'Campagne de Test' }]).select().single();
      campaignId = newCampaign.id;
    }
    console.log(`Campagne ID: ${campaignId}`);

    // 2. Traitement du lead (Scraping -> DB)
    console.log('--- 2. Traitement du lead + Scoring ---');
    const prospect = await processScrapedLead({
      ...leadToProcess,
      campaign_id: campaignId
    });
    if (!prospect) throw new Error('Échec de la création du prospect');
    console.log(`Prospect créé: ${prospect.company_name} (${prospect.id})`);

    // 3. Lancement de la séquence (Ollama -> Envoi)
    console.log('--- 3. Lancement de la séquence (LLM + Envoi) ---');
    console.log('Note: Assure-toi qu\'Ollama est lancé avec kimi-k2.5');
    const result = await runOutreachSequence(prospect.id);

    if (result.success) {
      console.log('✅ Séquence terminée avec succès !');
    } else {
      console.log('❌ Erreur lors de la séquence:', result.error);
    }

  } catch (error) {
    console.error('💥 Erreur fatale pendant le test:', error);
  }
}

testFlow();
