import { processScrapedLead } from '../lib/scraping';
import { runOutreachSequence } from '../lib/orchestration';
import { supabase } from '../lib/supabase';

/**
 * Script de test pour simuler un flux complet.
 * Utilisation: npx tsx src/scripts/test-flow.ts
 */
async function testFlow() {
  console.log('🚀 Démarrage du test de flux...');

  const mockLead = {
    title: 'Plomberie Dupont Test',
    website: 'https://example.com',
    city: 'Montréal',
    categoryName: 'Plomberie',
    phoneNumber: '5145550000',
    email: 'test@example.com', // Remplace par ton email pour tester l'envoi réel
    totalScore: 4.8,
    reviewsCount: 120,
    address: '123 Rue Test, Montréal, QC H1H 1H1',
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
    console.log('--- 2. Traitement du lead ---');
    const prospect = await processScrapedLead(mockLead, campaignId);
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
