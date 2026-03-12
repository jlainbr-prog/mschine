# 📐 Arquitetura do Sistema VSCOLD Multi-Chain

## Evolução da Arquitetura

### **Fase 1: Flash Loan Simples (v0.1)**
```
SingleChain Bot
    ↓
  ETH Only
    ↓
  USDT → FUSDT → USDT
    ↓
  Receiver: 0x95fd050F...
```

**Limitações:**
- Apenas Ethereum
- Liquidez limitada
- Ciclos lentos (15s)

---

### **Fase 2: Multi-Chain Flash (v1.0 ATUAL)**
```
╔════════════════════════════════════╗
║    VSCOLD MULTI-CHAIN SYSTEM       ║
╠════════════════════════════════════╣
║                                    ║
║  ┌──────────────────────────────┐  ║
║  │   BOT ORQUESTRADOR CENTRAL    │  ║
║  │  scripts/multi-flash-arbbot.js│  ║
║  └─────────────┬────────────────┘  ║
║                │                   ║
║        ┌───────┴────────┐          ║
║        │                │          ║
║   ┌────▼────┐      ┌────▼────┐   ║
║   │ ETHEREUM │      │   BSC   │   ║
║   │  Chain   │      │  Chain  │   ║
║   └────┬────┘      └────┬────┘   ║
║        │                │         ║
║  ┌─────▼────────────────▼─────┐  ║
║  │ DEX POOLS + VOLUME         │  ║
║  │ Uniswap V2  │ PancakeSwap  │  ║
║  │ (100k liq)  │ (100k liq)   │  ║
║  └─────┬──────────────┬───────┘  ║
║        │              │          ║
║  ┌─────▼──────────────▼─────┐   ║
║  │ RECEIVERS LUCROS         │   ║
║  │ 0x95fd050F... (todas)    │   ║
║  └──────────────────────────┘   ║
║                                  ║
╚════════════════════════════════════╝
```

**Melhorias:**
✅ 2 chains simultâneas  
✅ Ciclos rápidos (10s)  
✅ Pools com volume  
✅ Gráficos em wallets  
✅ Indexação automática  

---

## Estrutura de Componentes

### **1. Bot Principal**

**Arquivo:** `scripts/multi-flash-arbbot.js`

```javascript
MultiChainFlashBot
├── initChains()
│   ├── ETH: Provider + Contracts (USDT, FUSDT, Router, Vault)
│   └── BSC: Provider + Contracts (USDT, FUSDT, Router, Vault)
│
├── cycle() [10s loop]
│   ├── findBestOpportunity()
│   │   ├── simulate(chain, loanAmount) × 5 loans × 2 chains
│   │   └── select top profit
│   └── executeFlashLoan(opportunity)
│       ├── Encode calldata
│       ├── Submit flashLoan() call
│       └── Log to multi-flash-arbbot.log
│
└── start()
    └── setInterval(cycle, 10000ms)
```

**Contracções utilizadas:**

| Protocolo | Rede | Endereço |
|---|---|---|
| **Uniswap V2 Router** | ETH | 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D |
| **Balancer Vault** | ETH | 0xBA12222222228d8Ba445958a75a0704d566BF2C8 |
| **PancakeSwap Router** | BSC | 0x10ED43C718714eb63d5aA57B78B54704E256024E |
| **Balancer Vault** | BSC | 0xBA12222222228d8Ba445958a75a0704d566BF2C8 |

**Tokens:**

| Token | ETH | BSC |
|---|---|---|
| **FUSDT** | 0x419ecA43dB68E868E68d1aB460c8AC32523c7540 | 0x419ecA43dB68E868E68d1aB460c8AC32523c7540 |
| **USDT** | 0xdAC17F958D2ee523a2206206994597C13D831ec7 | 0x55d398326f92c0feff448b16c8f694e914ce3ee8 |

---

### **2. Setup de Pools + Gráficos**

**Arquivo:** `scripts/setup-dex-graphics.js`

```javascript
createPoolAndVolume(chain)
├── 1. Factory Integration
│   ├── Check se par FUSDT/USDT existe
│   └── Criar se inexistente
│
├── 2. Adicionar Liquidez
│   ├── Approve: 100k FUSDT
│   ├── Approve: 100k USDT
│   └── addLiquidity() → Mint LP tokens
│
├── 3. Gerar Volume Sintético
│   ├── 20 swaps sequenciais
│   ├── Buy: 1k-10k USDT → FUSDT
│   ├── Delay: 2s entre swaps
│   └── Sell: FUSDT → USDT
│
└── 4. Salvar Info
    └── pool-setup-{chain}.json
        ├── pair address
        ├── liquidity amounts
        ├── dex name (Uniswap/PancakeSwap)
        └── timestamps
```

**Factorys + Routers:**

| DEX | Chain | Factory | Router |
|---|---|---|---|
| **Uniswap V2** | ETH | 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f | 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D |
| **PancakeSwap** | BSC | 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73 | 0x10ED43C718714eb63d5aA57B78B54704E256024E |

---

### **3. Submissões a Agregadores**

**Arquivo:** `scripts/submit-to-trackers.js`

```javascript
Agregadores
├── DexScreener
│   ├── Tipo: Automático
│   ├── Latência: 1-6h
│   └── Requisito: Volume detectado
│
├── GeckoTerminal
│   ├── Tipo: Automático
│   ├── Latência: 24-48h
│   └── Requisito: Liquidez ativa
│
├── DexTools
│   ├── Tipo: Manual (Telegram)
│   ├── Latência: 30-60 min
│   └── Contact: @DEXToolsCommunityBot
│
├── CoinGecko
│   ├── Tipo: Manual (Form)
│   ├── Latência: 3-7 dias
│   └── URL: coingecko.com/request_form
│
└── CoinMarketCap
    ├── Tipo: Manual (Form)
    ├── Latência: 7-10 dias
    └── URL: coinmarketcap.com/request/
```

---

### **4. Orquestrador Mestre**

**Arquivo:** `scripts/vscold-multi-complete.js`

```javascript
Main Pipeline
│
├─── FASE 1: Metadados ───────────────┐
│   ├── generate-universal-metadata.js │
│   └── submit-all-prs.js (7 carteiras)│
│                                      │
├─── FASE 2: DEX Pools ───────────────┤
│   ├── setup-dex-graphics.js (ETH)   │
│   ├── setup-dex-graphics.js (BSC)   │
│   └── submit-to-trackers.js         │
│                                      │
├─── FASE 3: Receivers ───────────────│
│   ├── deploy-receiver.js (ETH)      │
│   └── deploy-receiver.js (BSC)      │
│                                      │
└─── FASE 4: Bot Contínuo ───────────┴─── START
    └── multi-flash-arbbot.js (background)
```

**Tempo esperado:**
- Metadata: ~5 min
- Pools: ~30 min (20 swaps × 2 chains)
- Receivers: ~5 min
- Total: ~40 min (+ bot em background indefinidamente)

---

## Fluxo de Dados

### **Bot Cycle (10s)**

```
START CYCLE
    │
    ├─→ For each chain (ETH, BSC):
    │    │
    │    ├─→ For each loan amount (10k, 50k, 100k, 500k, 1M USDT):
    │    │    │
    │    │    ├─→ Path: [USDT → FUSDT → USDT]
    │    │    ├─→ Simulate: getAmountsOut() × 2 hops
    │    │    └─→ Calculate profit = out - in - fees
    │    │
    │    └─→ Collect results
    │
    ├─→ Sort by profit (descending)
    │
    ├─→ Select top result
    │
    ├─→ IF profit >= MIN_PROFIT_USD:
    │    │
    │    ├─→ Encode calldata
    │    ├─→ Execute flashLoan()
    │    └─→ Log to file
    │
    └─→ WAIT 10s
    └─→ REPEAT
```

### **Exemplo de Execução**

```
[INIT] Receiver ETH: 0x95fd050F7d4Cd2bABf844a67A518CD97aAdAadFd
[INIT] Receiver BSC: 0x95fd050F7d4Cd2bABf844a67A518CD97aAdAadFd

Ciclo 1:
├─ [ARB] Simulando ETH: 10k USDT
├─ [ARB] Simulando ETH: 50k USDT → Profit: $12.50 ✓
├─ [ARB] Simulando ETH: 100k USDT → Profit: $45.20 ✓ TOP
├─ [ARB] Simulando BSC: 10k USDT → Profit: $3.20
├─ [ARB] Melhor: ETH 100k → $45.20
├─ [FLASH-ETH] Executando: 100000 USDT → 45.20 USD
├─ [FLASH-ETH] ✓ 0xabcd1234...
└─ [STATS] ETH: 45.20 USD | BSC: 0.00 USD

Ciclo 2:
├─ [ARB] Simulando ETH: 50k USDT → Profit: $8.50
├─ [ARB] Simulando BSC: 100k USDT → Profit: $25.30 ✓
├─ [FLASH-BSC] Executando: 100000 USDT → 25.30 USD
├─ [FLASH-BSC] ✓ 0xbcde5678...
└─ [STATS] ETH: 45.20 USD | BSC: 25.30 USD (TOTAL: 70.50)
```

---

## Integração com Wallets

### **Timeline de Sincronização**

```
Pool Criada (t=0)
    │
    ├─ 1-6h: DexScreener indexa
    │   └─→ Dados disponíveis em API
    │
    ├─ 2-4h: Wallet providers consultam DexScreener
    │   ├─→ Trust Wallet (sync)
    │   ├─→ MetaMask (Charts via DexScreener)
    │   └─→ Rabby Wallet (sync)
    │
    └─ 24-48h: Gráficos aparecem
        ├─→ Candlestick charts
        ├─→ Volume 24h
        ├─→ Price change %
        └─→ Liquidity info
```

### **Smart Contract Integration**

```
Wallet App
    │
    ├─→ Detecta FUSDT contract (0x419ecA43...)
    │
    ├─→ Consulta DexScreener API
    │   └─→ GET https://api.dexscreener.com/latest/dex/tokens/0x419ecA43...
    │
    ├─→ Recebe resposta:
    │   {
    │     "pairs": [
    │       {
    │         "pairAddress": "0x...",
    │         "baseToken": {"symbol": "FUSDT"},
    │         "quoteToken": {"symbol": "USDT"},
    │         "priceUsd": "1.0050",
    │         "volume": {"h24": "500000"},
    │         "priceChange": {"h24": "+5.2%"}
    │       }
    │     ]
    │   }
    │
    └─→ Renderiza gráficos
```

---

## Status Atual vs. Planejado

| Componente | Status | Deadline |
|---|---|---|
| Bot single-chain | ✅ Completo | - |
| Bot multi-chain ETH | ✅ Pronto | - |
| Bot multi-chain BSC | ✅ Pronto | - |
| Pool Ethereum | ⏳ Pronto (executar) | 5-15 min |
| Pool BSC | ⏳ Pronto (executar) | 5-15 min |
| Volume sintético | ⏳ Pronto (executar) | 40 min |
| DexScreener indexação | ⏳ Automático | 1-6h |
| Gráficos em wallets | ⏳ Automático | 24-48h |
| CoinGecko listagem | ⏳ Manual | 3-7 dias |
| CoinMarketCap | ⏳ Manual | 7-10 dias |

---

## Próximas Extensões (Roadmap)

### **v1.1 (Próximo)**
- [ ] Suporte para mais DEXs (Uniswap V3, Curve)
- [ ] Dashboard de lucros (Excel/Google Sheets)
- [ ] Alertas Telegram para arbitragens

### **v2.0 (Futuro)**
- [ ] 5+ blockchains (Polygon, Arbitrum, Optimism)
- [ ] Liquidez dinâmica (aumentar pools com lucros)
- [ ] Deploy automático em novos DEXs

### **v3.0 (Longo prazo)**
- [ ] DAO governance token (governança)
- [ ] Protocolo de lucro compartilhado
- [ ] Integração com CeFi exchanges

---

**Sistema 100% escalável e pronto para expansão! 🚀**
