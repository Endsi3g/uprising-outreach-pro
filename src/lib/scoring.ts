import axios from 'axios';

/**
 * Calcule un score d'opportunité pour un prospect.
 * @param website URL du site web
 * @param metadata Métadonnées additionnelles (avis, notes, etc.)
 * @param social Réseaux sociaux trouvés
 */
export const calculateLeadScore = async (website: string | null, metadata: any = {}, social: any = {}) => {
  let score = 50; // Score de base
  let ageScore = 0;
  let completenessScore = 0;
  let socialScore = 0;

  if (!website) return { total: 20, breakDown: { website: 0, age: 0, completeness: 0 } };

  try {
    // 1. Détection de l'âge du site (Heuristique via headers ou meta)
    // Note: Une vraie détection nécessiterait l'API WHOIS ou Archive.org
    // On simule ici par une analyse des headers (Last-Modified) ou des patterns
    const response = await axios.head(website, { timeout: 5000 }).catch(() => null);
    
    if (response) {
      const lastModified = response.headers['last-modified'];
      if (lastModified) {
        const date = new Date(lastModified);
        const yearsOld = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
        
        if (yearsOld > 3) {
          ageScore = 30; // Bonus pour les sites de plus de 3 ans (besoin de refonte !)
        } else if (yearsOld > 1) {
          ageScore = 15;
        }
      } else {
        // Si pas de header, on peut checker le copyright dans le body ou assumer un score moyen
        ageScore = 10; 
      }
    }

    // 2. Complétude des données
    if (metadata.reviews > 10) completenessScore += 10;
    if (metadata.rating > 4) completenessScore += 5;
    if (metadata.category) completenessScore += 5;

    // 3. Présence sociale
    if (social.linkedin) socialScore += 15;
    if (social.facebook) socialScore += 10;
    if (social.instagram) socialScore += 10;

    const total = Math.min(100, score + ageScore + completenessScore + socialScore);

    return {
      total,
      breakDown: {
        base: score,
        age: ageScore,
        completeness: completenessScore,
        social: socialScore
      },
      isOldWebsite: ageScore >= 30,
      hasSocial: !!(social.linkedin || social.facebook || social.instagram)
    };
  } catch (error) {
    return { total: 40, breakDown: { base: 40, age: 0, completeness: 0 } };
  }
};
