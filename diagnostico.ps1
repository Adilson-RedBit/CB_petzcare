# Script de diagnóstico para PetCare Agenda
Write-Host "=== DIAGNOSTICO PETCARE AGENDA ===" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: Node.js nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar npm
Write-Host "2. Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    Write-Host "   npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: npm nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar package.json
Write-Host "3. Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "   ERRO: package.json nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar node_modules
Write-Host "4. Verificando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   node_modules existe" -ForegroundColor Green
} else {
    Write-Host "   AVISO: node_modules nao encontrado. Executando npm install..." -ForegroundColor Yellow
    npm install
}

# Verificar .env.local
Write-Host "5. Verificando .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   .env.local existe" -ForegroundColor Green
} else {
    Write-Host "   AVISO: .env.local nao encontrado. Criando..." -ForegroundColor Yellow
    $envContent = @"
JWT_SECRET=K8j3mN9pQ2rT5vX8zA1bC4dE7fG0hI3jK6mN9pQ2rT5vX8zA1bC4dE7fG0hI
NODE_ENV=development
WORKER_URL=http://localhost:5173
"@
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "   .env.local criado" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== TESTANDO BUILD ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluido com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no build" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DIAGNOSTICO CONCLUIDO ===" -ForegroundColor Cyan




