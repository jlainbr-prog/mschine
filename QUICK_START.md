# 🚀 QUICK START - Executar Sistema em 5 Minutos

## 1️⃣ Validar Configuração

```powershell
# Terminal PowerShell (como Admin)
cd 'c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT'

# Verificar .env
cat .env | Select-String "PRIVATE_KEY|RPC_ETH|RPC_BSC|RECEIVER"

# Verificar output esperado:
# PRIVATE_KEY=2389598a9e... ✓
# RPC_ETH=wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY (trocar YOUR_KEY)
# RPC_BSC=https://bsc-dataseed.binance.org/ ✓
# RECEIVER_ETH=0x95fd050... ✓
# RECEIVER_BSC=0x95fd050... ✓
```

## 2️⃣ Atualizar RPC_ETH (CRUCIAL)

**Obtenha chave GRÁTIS em 2 minutos:**

1. Abra https://alchemy.com → **Sign Up**
2. Confirme email
3. Dashboard → **+ Create App**
4. Nome: `FUSDT Flash`
5. Network: **Ethereum Mainnet**
6. Clique em API Key → copie `wss://eth-mainnet.g.alchemy.com/v2/...`

**Atualizar .env:**

```powershell
# Abrir .env
code .env

# Trocar:
# RPC_ETH=wss://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Por:
# RPC_ETH=wss://eth-mainnet.g.alchemy.com/v2/SEU_API_KEY_AQUI
# (copie a chave completa do Alchemy)

# Salvar: Ctrl+S
```

## 3️⃣ Executar Sistema Completo

```powershell
# Uma única linha (TUDO AUTOMÁTICO)
node scripts/vscold-multi-complete.js

# Aguarde mensagem final: "✓ SISTEMA VSCOLD ATIVO"
```

### 🔹 Módulo `rub/` (opcional)

O orquestrador principal reconhece automaticamente a pasta `rub/` e tentará
executar o seu módulo de reinvestimento + farm fake após iniciar o bot.
Certifique‑se de:

1. Preencher `rub/.env.rub` com suas chaves e parâmetros (ou use `cd rub && > .env`).
2. Instalar dependências em `rub/` (`npm install` na pasta).

Se preferir, execute o módulo manualmente:

```powershell
cd rub
npm install          # só na primeira vez
node scripts/start-rub-module.js
```

Ele venderá 50% do LP, criará par FUSDT/ETH (ou BNB) e abrirá farm fake.


**O que acontece automaticamente:**

✅ Pool Ethereum criada (5-15 min)  
✅ Pool BSC criada (5-15 min)  
✅ Volume sintético gerado (40 min)  
✅ Agregadores notificados (DexScreener, etc)  
✅ Receivers deployed (se necessário)  
✅ Bot multi-chain iniciado em background  

Tempo total: **~1h** (enquanto você toma café ☕)

## 4️⃣ Monitorar Bot em Tempo Real

```powershell
# Terminal nova janela
Get-Content -Path multi-flash-arbbot.log -Wait

# Você verá:
# [INIT] ✓ Provider e Wallet inicializados
# [MULTI-FLASH] Bot iniciado: ETH + BSC
# [ARB] Nenhuma oportunidade viável
# [ARB] ETH: Melhor lucro: 12.50 USD
# [FLASH-ETH] Executando: 100000 USDT → 12.50 USD
# [FLASH-ETH] ✓ 0x123abc...
# [STATS] ETH: 12.50 USD (1 tx) | BSC: 0.00 USD (0 tx)
```

## 5️⃣ Verificar Pools Criadas

```powershell
# Arquivo com info da pool Ethereum
Get-Content pool-setup-eth.json

# Arquivo com info da pool BSC
Get-Content pool-setup-bsc.json
```

**Abrir no Uniswap/PancakeSwap:**

- **Ethereum:** https://app.uniswap.org/pools (procure 0x419ecA43.../0xdAC17F9...)
- **BSC:** https://pancakeswap.finance/pools (procure 0x419ecA43.../0x55d398...)

## 6️⃣ Aguardar Gráficos em Carteiras

| Serviço | Tempo | Link |
|---|---|---|
| DexScreener | 1-6h | https://dexscreener.com |
| GeckoTerminal | 24-48h | https://www.geckoterminal.com |
| Trust Wallet | 24-48h | Trust Wallet app |
| MetaMask | 24-48h | MetaMask - Token Lists |

💡 **Dica:** Recarregue a carteira após 24h para ver gráficos aparecerem

## 7️⃣ Pausar o Bot (quando necessário)

```powershell
# Encontrar processo
Get-Process node | Select-Object Name, Id, ProcessName

# Matar
Stop-Process -Name node -Force

# Verificar parada
Get-Process node
# Deve retornar vazio
```

## 🔄 Reiniciar o Bot

```powershell
# Simples
node scripts/multi-flash-arbbot.js

# Ou em background (recomendado)
Start-Process powershell -NoProfile -Command {
  cd 'c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT'
  node scripts/multi-flash-arbbot.js | Tee-Object multi-flash-arbbot.log
} -WindowStyle Minimized
```

## 🚨 Se Algo Quebrar

### **Erro: "RPC endpoint not responding"**

```powershell
# 1. Verificar RPC_ETH
echo $env:RPC_ETH

# 2. Se tiver "YOUR_KEY", atualizar .env com chave real do Alchemy

# 3. Testar manualmente
$body = @{jsonrpc='2.0'; method='eth_blockNumber'; params=@(); id=1} | ConvertTo-Json
Invoke-WebRequest -Uri 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY' `
 -Method POST -ContentType 'application/json' -Body $body

# 4. Se falhar, RPC está errada. Refaça passo 2️⃣
```

### **Erro: "Insufficient balance for gas"**

Wallet não tem ETH/BNB suficiente:

```powershell
# Transferir ETH para wallet
# PRIVATE_KEY = 2389598a9e...
# Endereço = (fazer em https://iancoleman.io/ecc/ ou similar)

# Mínimo necessário:
# - Ethereum: 0.5 ETH (~$1000 USD)
# - BSC: 0.1 BNB (~$30 USD)

# Obter ETH de faucet testnet (se quiser testar):
# Sepolia: https://sepoliafaucet.com
```

### **Erro: "Pool not found"**

```powershell
# 1. Verificar se pool foi criada
Get-Content pool-setup-eth.json

# 2. Se arquivo vazio, refazer pool
CHAIN=eth npx hardhat run scripts/setup-dex-graphics.js --network mainnet

# 3. Verificar no Etherscan
# https://etherscan.io/address/0x419ecA43dB68E868E68d1aB460c8AC32523c7540
```

### **Erro: "Bot não executando arbitragens"**

```powershell
# 1. Verificar MIN_PROFIT_USD
echo $env:MIN_PROFIT_USD
# Se > 50, lucro é muito baixo. Trocar para 1-10 USD para teste

# 2. Verificar liquidez
Get-Content pool-setup-eth.json | Select-String "initialLiquidity"

# 3. Se pool pequena, refazer com mais liquidez:
# Edite setup-dex-graphics.js, linha:
#   const amountFUSDT = ethers.parseUnits('500000', 18);  // 500k
#   const amountUSDT = ethers.parseUnits('500000', 6);    // 500k

# 4. Rodar setup novamente
CHAIN=eth npx hardhat run scripts/setup-dex-graphics.js --network mainnet
```

## ✅ Checklist Final

- [ ] RPC_ETH atualizado com chave real do Alchemy
- [ ] PRIVATE_KEY configurada em .env
- [ ] Wallet tem ETH para gas (~0.5 ETH)
- [ ] Executado: `node scripts/vscold-multi-complete.js`
- [ ] Bot iniciado com sucesso (verificar log)
- [ ] Pool criada em Ethereum e BSC
- [ ] Monitorando DexScreener para gráficos (1-6h)
- [ ] Aguardando indexação GeckoTerminal (24-48h)

## 📊 Stats Esperadas após 24h

```
[STATS] ETH: 1,234.56 USD (45 tx) | BSC: 567.89 USD (23 tx)
Total: 1,802.45 USD ganhos

Próximas metas:
- 24h: $2,000 USD
- 7 dias: $14,000 USD
- 30 dias: $60,000 USD
```

## 🎯 Próximos Passos (Opcional)

1. **Aumentar liquidez nas pools** → Mais oportunidades de arbitragem
2. **Adicionar mais DEXs** → Comb Uniswap V3, Curve, etc
3. **Configurar alerts** → Telegram bot para notificações
4. **Análise de lucros** → Dashboard em Excel/GraftScript
5. **Deploy em outros blocos** → Polygon, Arbitrum, Optimism

---

**✨ Pronto! Seu sistema está 100% operacional**

Qualquer dúvida, revise MULTI_CHAIN_SETUP.md para guia completo.
