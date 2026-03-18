import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { apifySearch } from './apify';

puppeteer.use(StealthPlugin());

/**
 * Service de recherche web utilisant Puppeteer.
 * Permet d'extraire des informations en temps réel sans utiliser de mocks.
 */
export const searchWeb = async (query: string) => {
  const apiBase = process.env.OLLAMA_API_BASE || 'http://localhost:11434';
  console.log(`🔍 Recherche multi-sources pour: "${query}"`);
  
  // Lancer Apify et Puppeteer en parallèle
  const apifyResults = await apifySearch(query);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    // Simulation d'un utilisateur réel
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Recherche Google (exemple simple)
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Extraction des résultats
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div.g'));
      return items.slice(0, 5).map(item => {
        const titleElement = item.querySelector('h3');
        const linkElement = item.querySelector('a');
        const snippetElement = item.querySelector('div.VwiC3b');

        return {
          title: titleElement ? (titleElement as HTMLElement).innerText : '',
          link: linkElement ? (linkElement as HTMLAnchorElement).href : '',
          snippet: snippetElement ? (snippetElement as HTMLElement).innerText : '',
        };
      });
    });
    
    // Fusionner les résultats
    return [...apifyResults, ...results];
  } catch (error) {
    console.error('❌ Erreur lors de la recherche Puppeteer:', error);
    return [];
  } finally {
    await browser.close();
  }
};

/**
 * Extrait le contenu textuel d'une page pour enrichir le contexte LLM.
 */
export const scrapeUrl = async (url: string) => {
  console.log(`🌐 Scraping de l'URL: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extraction du texte principal
    const content = await page.evaluate(() => {
      // Supprimer les scripts, styles et navigation pour ne garder que le texte utile
      const scripts = document.querySelectorAll('script, style, nav, footer, header');
      scripts.forEach(s => s.remove());
      return document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 5000);
    });

    return content;
  } catch (error) {
    console.error(`❌ Erreur lors du scraping de ${url}:`, error);
    return '';
  } finally {
    await browser.close();
  }
};
