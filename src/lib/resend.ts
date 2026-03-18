import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const generateEmailHtml = (companyName: string, intro: string) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2563eb;">Bonjour ${companyName},</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #374151;">
        ${intro}
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #6b7280;">
        Cordialement,<br>
        <strong>L'équipe Uprising</strong>
      </div>
    </div>
  `;
};

export const sendResendEmail = async (to: string, subject: string, htmlContent: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY manquant');
    return { success: false, error: 'API Key missing' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acquisition <onboarding@resend.dev>', // À changer avec ton domaine vérifié
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    console.error('Resend Exception:', error);
    return { success: false, error: error.message };
  }
};

