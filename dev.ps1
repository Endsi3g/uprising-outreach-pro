# Script de développement pour Uprising Outreach Pro
# Usage: .\dev.ps1

Write-Host "🚀 Démarrage de l'environnement de développement..." -ForegroundColor Green

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

# Vérifier Supabase Docker
Write-Host "🐳 Vérification de Supabase Docker..." -ForegroundColor Cyan
$dockerCheck = docker ps --filter "name=supabase-db" --format "{{.Names}}"
if ($dockerCheck) {
    Write-Host "✅ Supabase Docker ($dockerCheck) est en cours d'exécution." -ForegroundColor Green
} else {
    Write-Host "⚠️ Supabase Docker n'est pas lancé." -ForegroundColor Yellow
    $choice = Read-Host "Voulez-vous lancer Supabase via Docker Compose ? (y/n)"
    if ($choice -eq 'y') {
        # S'assurer que le .env existe pour Docker
        if (-not (Test-Path "supabase/docker/.env")) {
            Write-Host "📝 Création de supabase/docker/.env à partir de l'exemple..." -ForegroundColor Yellow
            Copy-Item "supabase/docker/.env.example" "supabase/docker/.env"
        }
        Write-Host "🚀 Lancement de Docker Compose..." -ForegroundColor Green
        docker compose -f supabase/docker/docker-compose.yml up -d
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erreur : Docker n'est probablement pas lancé. Ouvre Docker Desktop." -ForegroundColor Red
        }
    }
}


Write-Host "📡 Lancement de Next.js sur http://localhost:3000" -ForegroundColor Green
npm run dev
