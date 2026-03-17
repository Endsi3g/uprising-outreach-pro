import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateProspectCopy = async (prospectData: any) => {
    const prompt = `
        Role: Tu es un expert en copywriting B2B cold outreach spécialisé dans le "pattern interrupt".
        Objectif: Générer un email court et un SMS impactant en français.
        Données: ${JSON.stringify(prospectData)}
        
        Contraintes:
        - Pas de politesse générique.
        - Direct, court, valeur ajoutée.
        - Le SMS doit être ultra-concis.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
};
