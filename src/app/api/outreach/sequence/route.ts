import { NextResponse } from 'next/server';
import { runOutreachSequence } from '@/lib/orchestration';
import { enrichSocialProfiles } from '@/lib/social-enrichment';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { prospectId } = await request.json();

    if (!prospectId) {
      return NextResponse.json({ error: 'prospectId is required' }, { status: 400 });
    }

    // 1. Enrichissement social automatique si nécessaire
    const { data: prospect } = await supabase
      .from('prospects')
      .select('website, linkedin, facebook, instagram')
      .eq('id', prospectId)
      .single();

    if (prospect?.website && (!prospect.linkedin || !prospect.facebook)) {
      console.log(`🔍 Enrichissement social pour le prospect ${prospectId}`);
      const social = await enrichSocialProfiles(prospect.website);
      await supabase
        .from('prospects')
        .update({ 
          linkedin: prospect.linkedin || social.linkedin,
          facebook: prospect.facebook || social.facebook,
          instagram: prospect.instagram || social.instagram
        })
        .eq('id', prospectId);
    }

    // 2. Lancer la séquence
    const result = await runOutreachSequence(prospectId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Sequence API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
