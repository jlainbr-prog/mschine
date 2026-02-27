# Script para testar as 3 opções do mschine
# Executar: .\test-all.ps1

$mschinePath = "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT\mschine"
Set-Location $mschinePath

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  INSTALANDO DEPENDÊNCIAS E TESTANDO 3 OPÇÕES                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "[1/4] Instalando tronweb..." -ForegroundColor Yellow
npm install tronweb --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
  Write-Host "[x] Erro ao instalar tronweb" -ForegroundColor Red
  exit 1
}
Write-Host "[OK] tronweb instalado`n" -ForegroundColor Green

Write-Host "[2/4] Testando OPÇÃO 1: TRON Testnet Shasta...`n" -ForegroundColor Yellow
npm run test:tron
$resultTron = $LASTEXITCODE
Write-Host ""
if ($resultTron -eq 0) {
  Write-Host "[OK] TRON Testnet: FUNCIONANDO ✓`n" -ForegroundColor Green
} else {
  Write-Host "[x] TRON Testnet: FALHOU`n" -ForegroundColor Red
}

Write-Host "[3/4] Testando OPÇÃO 2: RPC Customizado...`n" -ForegroundColor Yellow
npm run test:custom-rpc
$resultCustom = $LASTEXITCODE
Write-Host ""
if ($resultCustom -eq 0) {
  Write-Host "[OK] RPC Customizado: FUNCIONANDO ✓`n" -ForegroundColor Green
} else {
  Write-Host "[x] RPC Customizado: Não configurado (normal)`n" -ForegroundColor Yellow
  Write-Host "   Configure CUSTOM_RPC_ENDPOINT em .env`n" -ForegroundColor Gray
}

Write-Host "[4/4] Testando OPÇÃO 3: API Keys (Infura/Alchemy)...`n" -ForegroundColor Yellow
npm run test:api-keys
$resultKeys = $LASTEXITCODE
Write-Host ""
if ($resultKeys -eq 0) {
  Write-Host "[OK] API Keys: FUNCIONANDO ✓`n" -ForegroundColor Green
} else {
  Write-Host "[x] API Keys: Não configuradas (normal)`n" -ForegroundColor Yellow
  Write-Host "   Configure INFURA_API_KEY ou ALCHEMY_API_KEY em .env`n" -ForegroundColor Gray
}

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  RESUMO DOS TESTES                                             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

if ($resultTron -eq 0) {
  Write-Host "✓ Opção 1 (TRON Testnet)    : FUNCIONANDO" -ForegroundColor Green
} else {
  Write-Host "✗ Opção 1 (TRON Testnet)    : Falhou" -ForegroundColor Red
}

if ($resultCustom -eq 0) {
  Write-Host "✓ Opção 2 (RPC Customizado) : FUNCIONANDO" -ForegroundColor Green
} else {
  Write-Host "- Opção 2 (RPC Customizado) : Não configurado" -ForegroundColor Yellow
}

if ($resultKeys -eq 0) {
  Write-Host "✓ Opção 3 (API Keys)        : FUNCIONANDO`n" -ForegroundColor Green
} else {
  Write-Host "- Opção 3 (API Keys)        : Não configurado`n" -ForegroundColor Yellow
}

Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Se TRON funcionou: Use npm run test:tron para novos testes" -ForegroundColor Gray
Write-Host "  2. Se Custom RPC não funciona: Configure CUSTOM_RPC_ENDPOINT em .env" -ForegroundColor Gray
Write-Host "  3. Se API Keys não funcionam: Configure INFURA_API_KEY ou ALCHEMY_API_KEY em .env`n" -ForegroundColor Gray

Write-Host "Pressione ENTER para sair..." -ForegroundColor Gray
Read-Host
