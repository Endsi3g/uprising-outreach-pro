/**
 * Service pour interagir avec Ollama en local.
 */

export const generateProspectCopy = async (prospectData: any) => {
  const prompt = `
Role: Tu es un expert en copywriting B2B cold outreach spécialisé dans le "pattern interrupt".
Objectif: Générer un email court et un SMS impactant en français pour le service d'Uprising Studio.

Données du prospect:
- Entreprise: ${prospectData.company_name}
- Ville: ${prospectData.city}
- Secteur: ${prospectData.industry}
- Signal d'intérêt: ${prospectData.intent_type || 'Visite site'}

Contraintes:
- Pas de "Cher/Chère" ou "J'espère que vous allez bien".
- Ton casual, direct, axé sur les résultats.
- Email: max 60 mots.
- SMS: max 160 caractères.
- Format de réponse attendu: JSON uniquement avec les clés "subject", "email_body", "sms_body".

Exemple de ton: "Salut, j'ai vu ton site pour ${prospectData.company_name}. C'est direct, mais j'ai une idée pour doubler tes leads à ${prospectData.city}."
`;

  try {
    const apiBase = process.env.OLLAMA_API_BASE || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'kimi-k2.5';
    
    const response = await fetch(`${apiBase}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.message.content);
  } catch (error) {
    console.error('Ollama Generation Error:', error);
    // Fallback minimaliste en cas d'erreur Ollama
    return {
      subject: `Question pour ${prospectData.company_name}`,
      email_body: `Salut, j'ai vu votre entreprise à ${prospectData.city}. J'ai une idée pour votre acquisition. On en parle ?`,
      sms_body: `Salut! C'est [Prénom] d'Uprising. J'ai une idée pour ${prospectData.company_name}. Je t'ai envoyé un mail !`,
    };
  }
};
