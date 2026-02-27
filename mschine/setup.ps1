# Setup automatizado para mschine - 3 opções de teste
# Execute este arquivo como Administrator no PowerShell

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  SETUP AUTOMÁTICO: mschine (3 opções)                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$mschinePath = "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT\mschine"

if (-not (Test-Path $mschinePath)) {
  Write-Host "[✗] Pasta mschine não encontrada!" -ForegroundColor Red
  exit 1
}

Set-Location $mschinePath
Write-Host "[*] Diretório: $(Get-Location)" -ForegroundColor Yellow

Write-Host "`n[*] Instalando dependências..." -ForegroundColor Yellow
Write-Host "    - ethers (já instalado)" -ForegroundColor Gray
Write-Host "    - dotenv (já instalado)" -ForegroundColor Gray
Write-Host "    - tronweb (instalando agora)..." -ForegroundColor Gray

npm install tronweb --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
  Write-Host "`n[✓] Instalação concluída!" -ForegroundColor Green
  Write-Host "`n" -ForegroundColor Green
  Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Green
  Write-Host "  PRÓXIMO PASSO: Escolha uma das 3 opções" -ForegroundColor Green
  Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Green
  Write-Host `n  "1️⃣  TRON Testnet (recomendado):" -ForegroundColor Cyan
  Write-Host "    npm run test:tron`n" -ForegroundColor Yellow
  
  Write-Host "  2️⃣  RPC Customizado:                 " -ForegroundColor Cyan
  Write-Host "    (Configure CUSTOM_RPC_ENDPOINT em .env)" -ForegroundColor Gray
  Write-Host "    npm run test:custom-rpc`n" -ForegroundColor Yellow
  
  Write-Host "  3️⃣  API Keys (Infura/Alchemy):      " -ForegroundColor Cyan
  Write-Host "    (Configure INFURA_API_KEY ou ALCHEMY_API_KEY em .env)" -ForegroundColor Gray
  Write-Host "    npm run test:api-keys`n" -ForegroundColor Yellow
  
  Write-Host "═════════════════════════════════════════════════════" -ForegroundColor Green
  Write-Host "`n[*] Leia o guia completo em:" -ForegroundColor Cyan
  Write-Host "    GUIA_3_OPCOES.txt`n" -ForegroundColor Yellow
} else {
  Write-Host "`n[✗] Falha na instalação! Saída de erro acima." -ForegroundColor Red
  exit 1
}
