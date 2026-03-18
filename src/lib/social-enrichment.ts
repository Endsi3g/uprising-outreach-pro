import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Service pour extraire les liens de réseaux sociaux d'un site web.
 */
export const enrichSocialProfiles = async (website: string) => {
  if (!website) return { linkedin: null, facebook: null, instagram: null };

  try {
    console.log(`🌐 Enrichissement social pour: ${website}`);
    const response = await axios.get(website, { 
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const links: string[] = [];
    
    $('a').each((_: number, element: any) => {
      const href = $(element).attr('href');
      if (href) links.push(href);
    });

    const social = {
      linkedin: links.find(l => l.includes('linkedin.com/company') || l.includes('linkedin.com/in')) || null,
      facebook: links.find(l => l.includes('facebook.com') && !l.includes('sharer')) || null,
      instagram: links.find(l => l.includes('instagram.com')) || null,
    };

    return social;
  } catch (error: any) {
    console.error(`❌ Erreur d'enrichissement pour ${website}:`, error.message);
    return { linkedin: null, facebook: null, instagram: null };
  }
};
