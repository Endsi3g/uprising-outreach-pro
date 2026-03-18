import { NextResponse } from 'next/server';
import { searchWeb } from '@/lib/search';
import { processScrapedLead } from '@/lib/scraping';
import { supabase } from '@/lib/supabase';

/**
 * API pour déclencher une prospection automatique.
 * Peut être appelée par un CRON ou manuellement.
 */
export async function POST(request: Request) {
  try {
    const { query, campaignId, maxLeads = 5 } = await request.json();

    if (!query || !campaignId) {
      return NextResponse.json({ error: 'Query and campaignId are required' }, { status: 400 });
    }

    console.log(`🤖 Automatisation: Début de la prospection pour "${query}"`);
    
    // 1. Recherche multi-sources
    const leads = await searchWeb(query);
    const limitedLeads = leads.slice(0, maxLeads);

    const results = [];
    for (const lead of limitedLeads) {
      try {
        const processed = await processScrapedLead({
          ...lead,
          campaign_id: campaignId
        });
        results.push({ name: lead.company_name, success: !!processed });
      } catch (err: any) {
        results.push({ name: lead.company_name, success: false, error: err.message });
      }
    }

    return NextResponse.json({ 
      message: 'Prospection terminée', 
      processed: results.length,
      details: results 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
