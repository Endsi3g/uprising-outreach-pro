import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResendEmail = async (to: string, subject: string, htmlContent: string) => {
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
