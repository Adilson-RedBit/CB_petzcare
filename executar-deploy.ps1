# Script Interativo de Deploy - PetCare Agenda
# Execute: .\executar-deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "Deploy Automatizado - PetCare Agenda" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar autenticação
Write-Host "Verificando autenticacao..." -ForegroundColor Yellow
$authCheck = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nao autenticado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Escolha uma opcao:" -ForegroundColor Yellow
    Write-Host "1. Usar API Token (Recomendado)" -ForegroundColor Cyan
    Write-Host "2. Tentar login OAuth" -ForegroundColor Cyan
    $choice = Read-Host "Digite 1 ou 2"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "Para criar um API Token:" -ForegroundColor Yellow
        Write-Host "1. Acesse: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Cyan
        Write-Host "2. Clique em Create Token" -ForegroundColor Cyan
        Write-Host "3. Use o template Edit Cloudflare Workers" -ForegroundColor Cyan
        Write-Host "4. Copie o token gerado" -ForegroundColor Cyan
        Write-Host ""
        $token = Read-Host "Cole o token aqui"
        $env:CLOUDFLARE_API_TOKEN = $token
        wrangler whoami
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Token invalido!" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Abrindo login OAuth..." -ForegroundColor Yellow
        wrangler login
        Write-Host "Complete o login no navegador e pressione Enter quando terminar..." -ForegroundColor Yellow
        Read-Host
    }
}

Write-Host "Autenticado!" -ForegroundColor Green
Write-Host ""

# Criar banco de dados D1
Write-Host "Criando banco de dados D1..." -ForegroundColor Yellow
$dbOutput = wrangler d1 create petcare-db 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "Banco criado!" -ForegroundColor Green
    Write-Host $dbOutput -ForegroundColor Cyan
    
    # Extrair database_id
    if ($dbOutput -match 'database_id = "([^"]+)"') {
        $databaseId = $matches[1]
        Write-Host ""
        Write-Host "Database ID encontrado: $databaseId" -ForegroundColor Green
        
        # Atualizar wrangler.json
        Write-Host "Atualizando wrangler.json..." -ForegroundColor Yellow
        $jsonContent = Get-Content wrangler.json -Raw
        $jsonObj = $jsonContent | ConvertFrom-Json
        $jsonObj.d1_databases[0].database_name = "petcare-db"
        $jsonObj.d1_databases[0].database_id = $databaseId
        $jsonObj | ConvertTo-Json -Depth 10 | Set-Content wrangler.json -Encoding UTF8
        Write-Host "wrangler.json atualizado!" -ForegroundColor Green
    } else {
        Write-Host "Nao foi possivel extrair o database_id automaticamente" -ForegroundColor Yellow
        Write-Host "Por favor, atualize manualmente o wrangler.json com o database_id acima" -ForegroundColor Yellow
        Read-Host "Pressione Enter apos atualizar o wrangler.json"
    }
} else {
    Write-Host "Erro ao criar banco ou banco ja existe" -ForegroundColor Yellow
    Write-Host $dbOutput -ForegroundColor Yellow
}

# Criar bucket R2
Write-Host ""
Write-Host "Criando bucket R2..." -ForegroundColor Yellow
$r2Output = wrangler r2 bucket create petcare-files 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "Bucket criado!" -ForegroundColor Green
} else {
    Write-Host "Bucket pode ja existir" -ForegroundColor Yellow
}

# Executar migrations
Write-Host ""
Write-Host "Executando migrations..." -ForegroundColor Yellow
$migrations = 1..10
foreach ($migration in $migrations) {
    Write-Host "   Executando migration $migration..." -ForegroundColor Cyan -NoNewline
    $result = wrangler d1 execute petcare-db --file="./migrations/$migration.sql" 2>&1
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
    Write-Host "Erro no build do worker!" -ForegroundColor Red
    exit 1
}

Write-Host "Fazendo deploy do worker..." -ForegroundColor Yellow
$workerOutput = wrangler deploy 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "Worker deployado!" -ForegroundColor Green
    Write-Host $workerOutput -ForegroundColor Cyan
    
    # Tentar extrair a URL do worker
    if ($workerOutput -match 'https://([^\s]+\.workers\.dev)') {
        $workerUrl = "https://$($matches[1])"
        Write-Host ""
        Write-Host "Worker URL: $workerUrl" -ForegroundColor Green
        Write-Host "ANOTE ESTA URL! Voce precisara dela para configurar o Next.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "Erro no deploy do worker!" -ForegroundColor Red
    Write-Host $workerOutput -ForegroundColor Red
    exit 1
}

# Build e deploy do Next.js
Write-Host ""
Write-Host "Fazendo build do Next.js..." -ForegroundColor Yellow
npm run build:pages
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build do Next.js!" -ForegroundColor Red
    exit 1
}

Write-Host "Fazendo deploy do Next.js..." -ForegroundColor Yellow
$pagesOutput = wrangler pages deploy .vercel/output/static 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "Next.js deployado!" -ForegroundColor Green
    Write-Host $pagesOutput -ForegroundColor Cyan
    
    # Tentar extrair a URL do Pages
    if ($pagesOutput -match 'https://([^\s]+\.pages\.dev)') {
        $pagesUrl = "https://$($matches[1])"
        Write-Host ""
        Write-Host "Pages URL: $pagesUrl" -ForegroundColor Green
    }
} else {
    Write-Host "Erro no deploy do Next.js!" -ForegroundColor Red
    Write-Host $pagesOutput -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deploy concluido com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Configure a variavel WORKER_URL no Cloudflare Pages Dashboard" -ForegroundColor Cyan
Write-Host "2. Configure o dominio customizado petzcare.org" -ForegroundColor Cyan
Write-Host "3. Teste a aplicacao!" -ForegroundColor Cyan
Write-Host ""
