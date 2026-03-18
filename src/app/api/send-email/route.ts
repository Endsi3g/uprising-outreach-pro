import { NextResponse } from 'next/server';
import { sendResendEmail } from '@/lib/resend';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { to, subject, html, prospectId } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendResendEmail(to, subject, html);

    if (result.success && prospectId) {
      // Mettre à jour le statut du prospect dans Supabase
      await supabase
        .from('prospects')
        .update({ status: 'contacted', last_contacted_at: new Date().toISOString() })
        .eq('id', prospectId);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
