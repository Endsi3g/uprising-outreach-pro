# Guide de Mise en Route - Uprising Outreach Pro

## 1. Installation
```bash
npm install
```

## 2. Configuration Ollama
Assure-toi que Ollama est installé et tourne sur ton PC.
```bash
ollama pull kimi-k2.5
```

## 3. Variables d'Environnement
Copie `.env.local.example` vers `.env.local` et remplis les valeurs :
- **Supabase** : URL et Clé Anon (pour le client) + Service Role Key (pour les webhooks).
- **LLM** : Pas de clé nécessaire (Ollama local).
- **Email** : `RESEND_API_KEY` ou config `GMAIL` OAuth.
- **SMS** : Twilio SID, Token et Numéro.

## 4. Test Rapide
Pour vérifier que tout fonctionne (Ollama + Envoi) :
```bash
npx tsx src/scripts/test-flow.ts
```

## 5. Lancement Dashboard
```bash
npm run dev
```
Accède à `http://localhost:3000`.
