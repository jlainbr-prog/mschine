# 🚀 VSCOLD - Sistema Multi-Chain Flash Loan + DEX Graphics

## 📋 Arquitetura do Sistema

```
┌─────────────────────────────────────────┐
│  VSCOLD COMPLETE SYSTEM                 │
├─────────────────────────────────────────┤
│                                         │
│  FASE 1: METADATA + WALLETS             │
│  ├─ Metadados universais (info.json)    │
│  ├─ Logos em 7 carteiras                │
│  └─ PRs automáticas (2-14 dias)         │
│                                         │
│  FASE 2: DEX POOLS + VOLUME             │
│  ├─ Pool Ethereum (Uniswap V2)          │
│  ├─ Pool BSC (PancakeSwap)              │
│  ├─ Volume sintético (20+ swaps)        │
│  └─ Liquidez inicial (100k/100k)        │
│                                         │
│  FASE 3: INDEXAÇÃO GRÁFICOS             │
│  ├─ DexScreener (1-6h)                  │
│  ├─ GeckoTerminal (24-48h)              │
│  ├─ DexTools (30-60m)                   │
│  ├─ CoinGecko (3-7 dias manual)         │
│  └─ CoinMarketCap (7-10 dias manual)    │
│                                         │
│  FASE 4: RECEIVERS MULTI-CHAIN          │
│  ├─ Deploy em Ethereum                  │
│  └─ Deploy em BSC                       │
│                                         │
│  FASE 5: BOT CONTÍNUO                   │
│  ├─ Multi-Chain Flash Loan (10s ciclos) │
│  ├─ Arbitragem USDT ↔ FUSDT             │
│  ├─ Zero-capital (flash loans)          │
│  └─ Lucro centralizado em receiver      │
│                                         │
└─────────────────────────────────────────┘
```

## ⚙️ Pré-requisitos

### 1. **Variáveis de Ambiente (.env)**

```bash
# Obrigatório
PRIVATE_KEY=your_private_key_here

# RPC (atualize com chaves reais)
RPC_ETH=wss://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_BSC=https://bsc-dataseed.binance.org/

# Receivers (auto-preenchido após deploy)
RECEIVER_ETH=0x...
RECEIVER_BSC=0x...

# Parâmetros do bot
SLIPPAGE=50          # 0.5%
MIN_PROFIT_USD=30    # Mínimo de lucro para executar
GAS_MULTIPLIER=1.2   # Multiplicador de gas
```

### 2. **Dependências instaladas**

```bash
npm install
```

Verificar:
```bash
npm list ethers dotenv hardhat @openzeppelin/contracts
```

### 3. **Wallet financiada**

- ETH para gas em Ethereum
- BNB para gas em BSC
- Não precisa ter USDT/FUSDT (flash loans = zero capital)

## 🚀 Execução Passo-a-Passo

### **OPÇÃO 1: Sistema Completo Automatizado**

```bash
# Executar tudo de uma vez
node scripts/vscold-multi-complete.js
```

Isso vai executar **automaticamente**:
1. ✓ Gerar metadados
2. ✓ Submeter PRs em carteiras
3. ✓ Criar pools ETH + BSC
4. ✓ Gerar volume sintético
5. ✓ Notificar agregadores
6. ✓ Deploy receivers (se necessário)
7. ✓ Iniciar bot em background

### **OPÇÃO 2: Passo-a-Passo Manual**

#### **Passo 1: Atualizar RPC Endpoints**

```bash
# Edite .env:
RPC_ETH=wss://eth-mainnet.g.alchemy.com/v2/YOUR_REAL_KEY
RPC_BSC=https://bsc-dataseed.binance.org/  # já funcionar
```

Obtenha chave gratuita em:
- **Ethereum**: https://alchemy.com (criar conta → criar app)
- **BSC**: Use pública ou Alchemy também fornece

#### **Passo 2: Criar Pools + Volume**

```bash
# Pool Ethereum
CHAIN=eth npx hardhat run scripts/setup-dex-graphics.js --network mainnet

# Pool BSC
CHAIN=bsc npx hardhat run scripts/setup-dex-graphics.js --network bsc
```

**O que acontece:**
- ✓ Cria par FUSDT/USDT
- ✓ Adiciona 100k FUSDT + 100k USDT de liquidez
- ✓ Gera 20 swaps de volume (1-10k USDT cada)
- ✓ Salva `pool-setup-eth.json` e `pool-setup-bsc.json`

**Tempo esperado:** 5-15 min por chain (aguarda confirmações)

#### **Passo 3: Notificar Agregadores**

```bash
node scripts/submit-to-trackers.js
```

**O que submete:**
- DexScreener (automático em 1-6h)
- GeckoTerminal (automático em 24-48h)
- DexTools (manual via Telegram)
- CoinGecko (manual via form)
- CoinMarketCap (manual via form)

#### **Passo 4: Deploy Receivers (se necessário)**

```bash
# Ethereum
npx hardhat run scripts/deploy-receiver.js --network mainnet

# BSC
npx hardhat run scripts/deploy-receiver.js --network bsc
```

Salva endereços em `RECEIVER_ADDRESS.txt` e atualiza `.env`

#### **Passo 5: Iniciar Bot Multi-Chain**

```bash
# Terminal 1: Direto
node scripts/multi-flash-arbbot.js

# Terminal 2: Com log redirecionado (PowerShell)
node scripts/multi-flash-arbbot.js | Tee-Object multi-flash-arbbot.log

# Background (PowerShell)
Start-Process powershell -NoProfile -Command {
  cd 'c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT'
  node scripts/multi-flash-arbbot.js | Tee-Object multi-flash-arbbot.log
} -WindowStyle Minimized
```

## 📊 Monitorar o Sistema

### **Log do Bot**

```bash
# Tail em tempo real
Get-Content -Path multi-flash-arbbot.log -Wait

# Últimas 20 linhas
Get-Content -Path multi-flash-arbbot.log -Tail 20

# Filter por lucros
Select-String "STATS" multi-flash-arbbot.log | Select-Object -Last 5
```

### **Status das Pools**

```bash
# Ver informações geradas
Get-Content pool-setup-eth.json
Get-Content pool-setup-bsc.json

# Submissões aos agregadores
Get-Content tracker-request-eth.json
Get-Content tracker-request-bsc.json
```

### **Endereços dos Receivers**

```bash
Get-Content RECEIVER_ADDRESS.txt
Select-String "RECEIVER" .env
```

## 🔍 Verificar em Explorers

### **Ethereum Mainnet**

- **Pool**: https://app.uniswap.org/explore/pools/ethereum/0x419ecA43dB68E868E68d1aB460c8AC32523c7540-0xdAC17F958D2ee523a2206206994597C13D831ec7
- **Token FUSDT**: https://etherscan.io/token/0x419ecA43dB68E868E68d1aB460c8AC32523c7540
- **Receiver**: (após deploy) https://etherscan.io/address/RECEIVER_ETH

### **BSC Mainnet**

- **Pool**: https://pancakeswap.finance/pools/0x419ecA43dB68E868E68d1aB460c8AC32523c7540-0x55d398326f92c0feff448b16c8f694e914ce3ee8
- **Token FUSDT**: https://bscscan.com/token/0x419ecA43dB68E868E68d1aB460c8AC32523c7540
- **Receiver**: (após deploy) https://bscscan.com/address/RECEIVER_BSC

### **Agregadores de Gráficos**

- **DexScreener**: https://dexscreener.com/ethereum/POOL_ADDRESS
- **GeckoTerminal**: https://www.geckoterminal.com/ethereum/POOL_ADDRESS
- **DexTools**: https://www.dextools.io/app/ethereum/pair-explorer/POOL_ADDRESS

## ⏱️ Timeline Esperada

| Componente | Tempo | Status |
|---|---|---|
| Pool Ethereum criada | 5-15 min | ✓ Imediato |
| Pool BSC criada | 5-15 min | ✓ Imediato |
| Volume gerado | ~40 min (20 swaps) | ✓ Imediato |
| DexScreener indexa | 1-6h | ✓ Automático |
| GeckoTerminal indexa | 24-48h | ✓ Automático |
| Gráficos Trust Wallet | 24-48h | ✓ Via DexScreener |
| Gráficos MetaMask | 24-48h | ✓ Via DexScreener |
| DexTools indexa | 30-60 min | ℹ Manual (Telegram) |
| CoinGecko | 3-7 dias | ℹ Manual (form) |
| CoinMarketCap | 7-10 dias | ℹ Manual (form) |
| Bot arbitrando | Imediato | ✓ A cada 10s |

## 🐛 Troubleshooting

### **"RPC endpoint not responding"**

**Solução:**
```bash
# Verificar RPC_ETH em .env
echo $env:RPC_ETH

# Testar conexão
curl -X POST https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### **"Insufficient balance for gas"**

**Solução:**
- Financiar wallet com ETH (mín 0.5 ETH para 2-3 txs)
- Financiar BSC wallet com BNB (mín 0.1 BNB)

### **"Pool not appearing in DexScreener"**

**Procedimento manual:**
1. Abra https://discord.gg/DEXTools
2. Canais: #token-listing → #add-pair
3. Envie: `/add_pair ethereum 0xPAIR_ADDRESS`

### **"Bot não encontrando arbitragens"**

**Verificar:**
```bash
# Min profit configurado?
echo $env:MIN_PROFIT_USD

# RPC conectado?
curl -s wss://eth-mainnet.g.alchemy.com/v2/YOUR_KEY | head

# Liquidez adequada na pool?
Get-Content pool-setup-eth.json | Select-String "initialLiquidity"
```

## 📁 Estrutura de Arquivos Gerados

```
📦 Projeto Moedas/Contrato Flash USDT/
├── scripts/
│   ├── multi-flash-arbbot.js              ← Bot principal
│   ├── setup-dex-graphics.js              ← Setup de pools
│   ├── submit-to-trackers.js              ← Agregadores
│   └── vscold-multi-complete.js           ← Orquestrador
│
├── artifacts/
│   ├── contracts/FlashLoanReceiver.sol.json
│   └── ...
│
├── .env                                   ← Config (PRIVADO)
├── hardhat.config.js
├── package.json
│
├── RECEIVER_ADDRESS.txt                   ← Receiver salvo
├── VSCOLD-ACTIVE.lock                     ← Status do sistema
│
├── pool-setup-eth.json                    ← Pool info Ethereum
├── pool-setup-bsc.json                    ← Pool info BSC
├── tracker-request-eth.json               ← Agregador info
├── tracker-request-bsc.json               ← Agregador info
│
├── multi-flash-arbbot.log                 ← Log do bot
├── bot-multi-out.log                      ← Stdout bot
├── bot-multi-err.log                      ← Stderr bot
│
└── mschine/
    ├── blockchains/ethereum/assets/0x419ecA43.../
    │   ├── logo.png
    │   └── info.json
    └── blockchains/smartchain/assets/0x419ecA43.../
        ├── logo.png
        └── info.json
```

## 🔐 Segurança

**✓ Práticas implementadas:**
- ✓ PRIVATE_KEY nunca commitado (`.env` em `.gitignore`)
- ✓ Flash loans = zero capital (sem risco de perda inicial)
- ✓ Receiver centralizado (profit acumula em um endereço)
- ✓ Slippage limit (default 50 bps = 0.5%)
- ✓ Gas price multiplier (ajuste automático)

**⚠️ Pontos de atenção:**
- ⚠️ Testar primeiro em Sepolia (testnet)
- ⚠️ Validar pool liquidity antes de lançamento
- ⚠️ Monitorar gas prices (market-dependent)
- ⚠️ Manter PRIVATE_KEY seguro e nunca compartilhar

## 📞 Suporte

| Problema | Referência | Solução |
|---|---|---|
| Pool not indexing | DexScreener FAQ | Aguardar 1-6h, volume detectado = automático |
| Low gas prices | Hardhat Docs | Aumentar GAS_MULTIPLIER em .env |
| Bot não ejecutando | logs | Verificar PRIVATE_KEY + RPC_ETH + gas na wallet |
| Charts not showing | Wallet docs | Aguardar CoinGecko/CMC (7-14 dias) |

---

**Sistema pronto! 🚀 Execute `node scripts/vscold-multi-complete.js` para começar.**
