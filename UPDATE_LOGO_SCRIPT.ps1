# ================================================================================
# UPDATE_LOGO_SCRIPT.ps1
# ================================================================================
# Atualiza todos os logos do projeto para o novo logo IPFS
# CID novo: QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q
# Data: 12 de março de 2026
# ================================================================================

param(
    [string]$LogoSourcePath = ".\assets\logo.png",
    [string]$LogoUri = "ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q"
)

Write-Host "=== ATUALIZAÇÃO DE LOGOS ===" -ForegroundColor Green
Write-Host "Fonte: $LogoSourcePath" -ForegroundColor Cyan
Write-Host "CID IPFS: $LogoUri" -ForegroundColor Cyan
Write-Host ""

# Diretórios onde os logos precisam ser atualizados
$LogoTargets = @(
    ".\blockchains\smartchain\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\blockchains\ethereum\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\mschine\blockchains\smartchain\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\mschine\blockchains\ethereum\assets\0x419ecA43dB68E868E68d1aB460c8AC32523c7540\logo.png",
    ".\mschine\blockchains\smartchain\assets\0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11\logo.png",
    ".\mschine\blockchains\ethereum\assets\0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11\logo.png"
)

# Verificar se a imagem fonte existe
if (-not (Test-Path $LogoSourcePath)) {
    Write-Host "❌ Arquivo de logo não encontrado: $LogoSourcePath" -ForegroundColor Red
    Write-Host "   Favor colocar o novo logo em: $LogoSourcePath"
    exit 1
}

Write-Host "✅ Arquivo de logo encontrado" -ForegroundColor Green
Write-Host ""

# Copiar para todos os destinos
$UpdatedCount = 0
foreach ($target in $LogoTargets) {
    $targetDir = Split-Path $target
    
    if (-not (Test-Path $targetDir)) {
        Write-Host "📁 Criando diretório: $targetDir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    try {
        Copy-Item -Path $LogoSourcePath -Destination $target -Force
        Write-Host "✅ Atualizado: $target" -ForegroundColor Green
        $UpdatedCount++
    } catch {
        Write-Host "❌ Erro ao copiar para $target : $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== RESULTADO ===" -ForegroundColor Green
Write-Host "Logos atualizados: $UpdatedCount / $($LogoTargets.Count)" -ForegroundColor Cyan
Write-Host ""

# Próximas etapas
Write-Host "=== PRÓXIMAS ETAPAS ===" -ForegroundColor Yellow
Write-Host "1. Verificar arquivos alterados:"
Write-Host "   git status"
Write-Host ""
Write-Host "2. Adicionar arquivos modificados:"
Write-Host "   git add blockchains/ mschine/blockchains/"
Write-Host ""
Write-Host "3. Fazer commit com mensagem:"
Write-Host "   git commit -m 'Update logos to new IPFS CID: QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q'"
Write-Host ""
Write-Host "4. Push para remoto:"
Write-Host "   git push origin main"
Write-Host ""
