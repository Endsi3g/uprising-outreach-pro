# Script de developpement pour Uprising Outreach Pro
# Usage: .\dev.ps1

Write-Host "Starting development environment..." -ForegroundColor Green

# Check Ollama
if (Get-Process -Name "ollama" -ErrorAction SilentlyContinue) {
    Write-Host "Ollama is running." -ForegroundColor Cyan
} else {
    Write-Host "Ollama not detected. Launch it for local AI." -ForegroundColor Yellow
}

# Check .env.local
if (Test-Path ".env.local") {
    Write-Host ".env.local found." -ForegroundColor Cyan
} else {
    Write-Host ".env.local missing. Copy .env.local.example to start." -ForegroundColor Red
}

# Check Supabase Docker
Write-Host "Checking Supabase Docker..." -ForegroundColor Cyan
try {
    $dockerCheck = & docker ps --filter "name=supabase-db" --format "{{.Names}}"
    if ($dockerCheck) {
        Write-Host "Supabase Docker is running." -ForegroundColor Green
    } else {
        Write-Host "Supabase Docker is NOT running." -ForegroundColor Yellow
        $choice = Read-Host "Launch Supabase via Docker Compose? (y/n)"
        if ($choice -eq 'y') {
            if (-not (Test-Path "supabase/docker/.env")) {
                Write-Host "Creating supabase/docker/.env..." -ForegroundColor Yellow
                Copy-Item "supabase/docker/.env.example" "supabase/docker/.env"
            }
            Write-Host "Launching Docker Compose..." -ForegroundColor Green
            & docker compose -f supabase/docker/docker-compose.yml up -d
        }
    }
} catch {
    Write-Host "Docker not available or error during check." -ForegroundColor Yellow
}

Write-Host "Starting Next.js on http://localhost:3000" -ForegroundColor Green
npm run dev
