# Script para continuar o deploy apos autenticacao
# Execute: .\continuar-deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "Continuando deploy do PetCare Agenda..." -ForegroundColor Green
Write-Host ""

# Verificar se esta autenticado
Write-Host "Verificando autenticacao..." -ForegroundColor Yellow
$whoami = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Nao esta autenticado!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\configurar-token.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "Autenticado!" -ForegroundColor Green
Write-Host ""

# Criar banco de dados D1
Write-Host "Criando banco de dados D1..." -ForegroundColor Yellow
$dbResult = wrangler d1 create petcare-db 2>&1 | Out-String
Write-Host $dbResult

if ($dbResult -match 'database_id = "([^"]+)"') {
    $databaseId = $matches[1]
    Write-Host ""
    Write-Host "Database ID encontrado: $databaseId" -ForegroundColor Green
    
    # Atualizar wrangler.json
    Write-Host "Atualizando wrangler.json..." -ForegroundColor Yellow
    $json = Get-Content wrangler.json -Raw | ConvertFrom-Json
    $json.d1_databases[0].database_name = "petcare-db"
    $json.d1_databases[0].database_id = $databaseId
    $json.r2_buckets[0].bucket_name = "petcare-files"
    $json | ConvertTo-Json -Depth 10 | Set-Content wrangler.json -Encoding UTF8
    Write-Host "wrangler.json atualizado!" -ForegroundColor Green
} else {
    Write-Host "AVISO: Nao foi possivel extrair o database_id automaticamente" -ForegroundColor Yellow
    Write-Host "Por favor, atualize manualmente o wrangler.json" -ForegroundColor Yellow
}

# Criar bucket R2
Write-Host ""
Write-Host "Criando bucket R2..." -ForegroundColor Yellow
wrangler r2 bucket create petcare-files 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Bucket R2 criado!" -ForegroundColor Green
} else {
    Write-Host "Bucket pode ja existir (isso e normal)" -ForegroundColor Yellow
}

# Executar migrations
Write-Host ""
Write-Host "Executando migrations..." -ForegroundColor Yellow
for ($i = 1; $i -le 10; $i++) {
    Write-Host "  Migration $i..." -ForegroundColor Cyan -NoNewline
    wrangler d1 execute petcare-db --file="./migrations/$i.sql" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " AVISO" -ForegroundColor Yellow
    }
}

# Build e deploy do worker
Write-Host ""
Write-Host "Fazendo build do worker..." -ForegroundColor Yellow
npm run build:worker
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO no build do worker!" -ForegroundColor Red
    exit 1
}

Write-Host "Fazendo deploy do worker..." -ForegroundColor Yellow
$workerOutput = wrangler deploy 2>&1 | Out-String
Write-Host $workerOutput

if ($workerOutput -match 'https://([^\s]+\.workers\.dev)') {
    $workerUrl = "https://$($matches[1])"
    Write-Host ""
    Write-Host "Worker URL: $workerUrl" -ForegroundColor Green
    Write-Host "ANOTE ESTA URL!" -ForegroundColor Yellow
}

# Build e deploy do Next.js
Write-Host ""
Write-Host "Fazendo build do Next.js..." -ForegroundColor Yellow
npm run build:pages
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO no build do Next.js!" -ForegroundColor Red
    exit 1
}

Write-Host "Fazendo deploy do Next.js..." -ForegroundColor Yellow
$pagesOutput = wrangler pages deploy .vercel/output/static 2>&1 | Out-String
Write-Host $pagesOutput

if ($pagesOutput -match 'https://([^\s]+\.pages\.dev)') {
    $pagesUrl = "https://$($matches[1])"
    Write-Host ""
    Write-Host "Pages URL: $pagesUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Deploy concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure WORKER_URL no Cloudflare Pages Dashboard" -ForegroundColor Cyan
Write-Host "2. Configure o dominio petzcare.org" -ForegroundColor Cyan


