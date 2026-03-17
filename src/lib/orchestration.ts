import { supabase } from './supabase';
import { generateProspectCopy } from './llm';
import { sendGmail } from './gmail';
import { sendResendEmail } from './resend'; // Ajout Resend
import { sendSMS } from './twilio';

/**
 * Orchestrateur de séquence multicanale.
 * Gere le flux : Generation -> Envoi Email -> (Wait) -> Envoi SMS.
 */
export const runOutreachSequence = async (prospectId: string) => {
  try {
    // 1. Récupérer le prospect
    const { data: prospect, error: fetchError } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (fetchError || !prospect) throw new Error('Prospect introuvable');

    // 2. Générer la copy via Ollama
    const copy = await generateProspectCopy(prospect);

    // 3. Sauvegarder la copy générée
    await supabase.from('generated_copy').insert([
      { prospect_id: prospectId, type: 'email_1', content: copy.email_body, used_variables: { summary: copy.subject } },
      { prospect_id: prospectId, type: 'sms_1', content: copy.sms_body }
    ]);

    // 4. Envoyer l'email (Gmail par défaut, Resend possible)
    let emailRes: any;
    if (process.env.USE_RESEND === 'true') {
      emailRes = await sendResendEmail(prospect.email, copy.subject, `<p>${copy.email_body.replace(/\n/g, '<br>')}</p>`);
    } else {
      emailRes = await sendGmail(prospect.email, copy.subject, copy.email_body);
    }

    if (emailRes.success) {
      await supabase.from('events_log').insert([{ 
        prospect_id: prospectId, 
        channel: 'email', 
        event_type: 'sent',
        metadata: { messageId: emailRes.messageId }
      }]);
      
      // Mettre à jour le statut du prospect
      await supabase.from('prospects').update({ status: 'contacted' }).eq('id', prospectId);
    }

    // Note: Pour le SMS, on attendrait normalement quelques jours. 
    // Ici on simule ou on prepare le terrain.
    return { success: true };
  } catch (error) {
    console.error('Orchestration Error:', error);
    return { success: false, error };
  }
};
