import { NextResponse } from 'next/server';
import { processScrapedLead } from '@/lib/scraping';
import { runOutreachSequence } from '@/lib/orchestration';

const DEFAULT_CAMPAIGN_ID = '00000000-0000-0000-0000-000000000000'; // À remplacer par une vraie ID

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Si c'est un webhook Apify, les data sont dans le body directement ou dans un array
    const rawLeads = Array.isArray(body) ? body : [body];
    
    for (const rawData of rawLeads) {
      const prospect = await processScrapedLead(rawData, DEFAULT_CAMPAIGN_ID);
      
      if (prospect) {
        // Optionnel: Déclencher la séquence immédiatement pour les leads qualifiés
        if (prospect.email) {
          await runOutreachSequence(prospect.id);
        }
      }
    }

    return NextResponse.json({ success: true, processed: rawLeads.length });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
