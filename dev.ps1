# Script de développement pour Uprising Outreach Pro
# Usage: .\dev.ps1

Write-Host "🚀 Démarrage de l'environnement de développement..." -ForegroundColor Emerald

# Vérifier si Ollama est lancé
if (Get-Process -Name "ollama" -ErrorAction SilentlyContinue) {
    Write-Host "✅ Ollama est en cours d'exécution." -ForegroundColor Cyan
} else {
    Write-Host "⚠️ Ollama n'est pas détecté. Assure-toi de le lancer pour l'IA locale." -ForegroundColor Yellow
}

# Charger les variables d'environnement si .env.local existe
if (Test-Path ".env.local") {
    Write-Host "✅ Chargement de .env.local" -ForegroundColor Cyan
} else {
    Write-Host "❌ .env.local introuvable. Copie .env.local.example pour commencer." -ForegroundColor Red
}

Write-Host "📡 Lancement de Next.js sur http://localhost:3000" -ForegroundColor Green
npm run dev
