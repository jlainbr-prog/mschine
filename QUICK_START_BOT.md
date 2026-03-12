# ⚡ FLASH ARB BOT - GUIA RÁPIDO DE ATIVAÇÃO

## 🚀 Como Activar em 5 Minutos

### **Opção 1: Setup Automático (Recomendado)**

```powershell
npm run setup
```

Responde as perguntas:
1. **Private Key** - sua chave privada (0x...)
2. **RPC ETH** - endpoint Ethereum (Alchemy/Infura)
3. **RPC BSC** - endpoint BSC (deixe em branco para usar padrão)
4. **RECEIVER ETH** - endereço para receber lucros em Ethereum
5. **RECEIVER BSC** - endereço para receber lucros em BSC
6. **MIN PROFIT** - lucro mínimo em USD (padrão: 30)

✅ Tudo será configurado automaticamente no `.env`

---

## 💻 Executar o Bot

### **Teste Rápido (executa 1x e sai)**
```powershell
npm run start-bot-once
```

### **Contínuo - 6 horas entre ciclos**
```powershell
npm run start-bot-6h
```

### **Contínuo - 12 horas entre ciclos**
```powershell
npm run start-bot-12h
```

### **Contínuo - 24 horas entre ciclos**
```powershell
npm run start-bot-24h
```

### **Com PM2 (servidor 24/7, auto-restart)**
```powershell
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 Monitorar Execução

### **Ver Logs em Tempo Real**
```powershell
tail -f multi-flash-arbbot.log
```

### **Com PM2**
```powershell
pm2 logs flash-arb-bot
pm2 monit
```

---

## 🔄 GitHub Actions (Automático a cada 5 min)

1. Vá para **Settings → Secrets and variables → Actions**
2. Clique **New repository secret**
3. Adicione estas variáveis:
   - `PRIVATE_KEY` = sua chave privada
   - `RPC_ETH` = RPC Ethereum
   - `RPC_BSC` = RPC BSC
   - `RECEIVER_ETH` = endereço receiver ETH
   - `RECEIVER_BSC` = endereço receiver BSC
   - `MIN_PROFIT_USD` = lucro mínimo

4. Vá para **Actions → Run Flash Arb Bot → Run workflow**

✅ Pronto! O bot rodará a cada 5 minutos automaticamente

---

## ⚙️ Variáveis de Ambiente Personalização

Edite o `.env` para ajustar:

```env
PRIVATE_KEY=0x...                    # Sua chave privada
RPC_ETH=https://...                  # RPC Ethereum
RPC_BSC=https://...                  # RPC BSC
RECEIVER_ETH=0x...                   # Receiver ETH
RECEIVER_BSC=0x...                   # Receiver BSC
MIN_PROFIT_USD=30                    # Lucro mínimo (USD)
SLIPPAGE=50                          # Slippage em bps
GAS_MULTIPLIER=1.2                   # Multiplicador gas
CYCLE_INTERVAL_HOURS=6               # Horas entre ciclos
```

---

## 🛠️ Troubleshooting

### Erro: "RPC not configured"
- Verifique se `RPC_ETH` e `RPC_BSC` estão no `.env`
- Use endpoints válidos (Alchemy, Infura, QuickNode)

### Erro: "npm ci - package-lock.json required"
- Já está resolvido! O repo possui `package-lock.json`
- Se não, rode: `npm install`

### Bot não encontra oportunidades
- Verifique se `MIN_PROFIT_USD` não está muito alto
- Comece com valor pequeno (ex: 10 USD)
- Verifique les liquidity nos pools

### Logs vazios ou travado
- Pressione `Ctrl+C` para parar
- Verifique os RPCs com: `ping <rpc-url>`
- Aumente `GAS_MULTIPLIER` se houver revert

---

## 📝 Estrutura de Logs

Cada execução gera um arquivo `multi-flash-arbbot.log`:

```
timestamp,chain,tx_hash,profit_usd,total_usd
2026-03-02T10:30:45.123Z,bsc,0x1234...,45.67,245.80
2026-03-02T10:36:12.456Z,eth,0x5678...,32.10,277.90
```

---

## ✨ Recursos Principais

- ✅ One-shot (GitHub Actions)
- ✅ Contínuo com auto-restart (VPS)
- ✅ Multi-chain (Ethereum + BSC)
- ✅ Auto-reinvestimento de lucros
- ✅ PM2 para alta disponibilidade
- ✅ Logs detalhados e rotacionáveis
- ✅ 100% sem intervenção humana

---

**Tudo pronto? 🚀 Execute agora:**

```powershell
npm run setup && npm run start-bot-once
```

Bom arbitraging! 💰
