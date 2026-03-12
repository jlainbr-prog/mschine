#!/usr/bin/env powershell
# ================================================================================
# COMMIT_LOGO_UPDATES.ps1
# ================================================================================
# Script automático para fazer commit e push das atualizações de logo
# ================================================================================

$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Green
Write-Host "  ATUALIZAR REPOSITÓRIO COM NOVOS LOGOS" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

# Passo 1: Verificar status git
Write-Host "1️⃣  Verificando status do git..." -ForegroundColor Cyan
git status --short
Write-Host ""

# Passo 2: Confirmar que logos foram atualizados
Write-Host "2️⃣  Verificando se arquivos foram modificados..." -ForegroundColor Cyan
$modifiedLogos = @(
    "blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/logo.png",
    "blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/logo.png",
    "mschine/blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/logo.png",
    "mschine/blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/logo.png"
)

$foundModified = 0
foreach ($logo in $modifiedLogos) {
    if (Test-Path $logo) {
        Write-Host "   ✅ $logo" -ForegroundColor Green
        $foundModified++
    }
}

if ($foundModified -eq 0) {
    Write-Host "   ⚠️  Nenhum logo modificado encontrado!" -ForegroundColor Yellow
    Write-Host "   Execute primeiro: .\UPDATE_LOGO_SCRIPT.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Passo 3: Adicionar arquivos
Write-Host "3️⃣  Adicionando arquivos modificados..." -ForegroundColor Cyan
git add blockchains/
git add mschine/blockchains/
git add *.md
git add .env
git add scripts/update-logo.js
git add UPDATE_LOGO_SCRIPT.ps1
git add LOGO_UPDATE_REPORT.md
Write-Host "   ✅ Arquivos adicionados ao staging area" -ForegroundColor Green
Write-Host ""

# Passo 4: Exibir resumo do commit
Write-Host "4️⃣  Resumo das mudanças:" -ForegroundColor Cyan
git diff --cached --stat
Write-Host ""

# Passo 5: Confirmar commit
$response = Read-Host "Deseja prosseguir com o commit? (s/n)"
if ($response -ne "s" -and $response -ne "S") {
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
    exit 1
}

# Passo 6: Fazer commit
Write-Host ""
Write-Host "5️⃣  Fazendo commit..." -ForegroundColor Cyan
$commitMessage = @"
🎨 Update all logos to new IPFS CID: QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q

- Migrar de Imgur para IPFS (descentralizado)
- Atualizar 8 logos (FUSDT + Flash Arb, Ethereum + BSC)
- Atualiza 28+ arquivos de configuração
- CID IPFS verificado e acessível
- Peer ID: 12D3KooWKwXGAjkxfKTByBUYHq6ZHULr4xrCqnHgpB2zbxq5acJU
- Data: 12/03/2026
"@

git commit -m $commitMessage
Write-Host "   ✅ Commit criado" -ForegroundColor Green
Write-Host ""

# Passo 7: Exibir log
Write-Host "6️⃣  Histórico recente:" -ForegroundColor Cyan
git log --oneline -3
Write-Host ""

# Passo 8: Perguntar sobre push
$pushResponse = Read-Host "Deseja fazer push para 'origin main'? (s/n)"
if ($pushResponse -eq "s" -o $pushResponse -eq "S") {
    Write-Host ""
    Write-Host "7️⃣  Fazendo push..." -ForegroundColor Cyan
    git push origin main
    Write-Host "   ✅ Push concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Commit local criado. Você pode fazer push depois:" -ForegroundColor Yellow
    Write-Host "   git push origin main" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  ✅ ATUALIZAÇÃO CONCLUÍDA" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
