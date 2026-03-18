# 🚀 Uprising Outreach Pro

Système de prospection B2B multicanal (Email + SMS) avec intelligence artificielle locale (**Ollama**) et interface premium.

## 🛠️ Stack Technique
- **Frontend** : Next.js 14, TailwindCSS, Shadcn/UI, Recharts.
- **Backend** : Next.js API Routes, Supabase (PostgreSQL).
- **IA** : Ollama en local avec le modèle **`kimi-k2.5`**.
- **Canaux** : Gmail API (OAuth2), Twilio (SMS), Resend (Transactional Email).
- **Automation** : Inngest/Cron compatible et Webhooks pour le scraping (Apify).

## 📋 Prérequis
1. **Ollama** : Doit être installé et lancé.
   ```bash
   ollama pull kimi-k2.5
   ```
2. **Supabase** : Un projet actif avec le schéma fourni dans `supabase/migrations`.
3. **Node.js** : v18+ recommandé.

## 🚀 Installation & Lancement
1. Clone le projet ou accède au dossier.
2. Installe les dépendances :
   ```bash
   npm install
   ```
3. Configure ton fichier `.env.local` (voir `.env.local.example`).
4. Lance l'environnement de développement :
   ```powershell
   .\dev.ps1
   ```

## 📂 Structure du Projet
- `src/lib/llm.ts` : Moteur de personnalisation IA.
- `src/lib/orchestration.ts` : Logique de séquence multicanale.
- `src/lib/scraping.ts` : Traitement des données entrantes.
- `src/app/` : Pages du dashboard (Prospects, Campagnes, Analytics).

---
*Propulsé par Uprising Studio • v1.0.0*
