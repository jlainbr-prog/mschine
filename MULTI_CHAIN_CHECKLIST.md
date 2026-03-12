# ✅ CHECKLIST PRÉ-EXECUÇÃO - VSCOLD Multi-Chain

## 📋 Verificação de Ambiente

```powershell
# 1. Verificar Node.js versão
node --version
# Esperado: v18.x ou superior

# 2. Verificar npm
npm --version
# Esperado: v9.x ou superior

# 3. Verificar diretório correto
pwd
# Esperado: c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT

# 4. Verificar arquivo .env existe
Test-Path .env
# Esperado: True
```

## 🔐 Checklist de Segurança

- [ ] PRIVATE_KEY configurada em .env (nunca commitar!)
- [ ] .env incluído em .gitignore
- [ ] Nenhuma chave API exposta ou em logs
- [ ] Wallet PRIVADA (não usar em múltiplos bots)
- [ ] RPC endpoint verificado e testado
- [ ] Min gas na wallet (0.5 ETH Ethereum + 0.1 BNB BSC)

## ⚙️ Checklist de Configuração

- [ ] **PRIVATE_KEY**: Preenchida
  ```powershell
  # Verificar
  (Get-Content .env | Select-String "PRIVATE_KEY=").ToString()
  # Não deve ter "0x0000..." ou "YOUR_KEY"
  ```

- [ ] **RPC_ETH**: Chave Alchemy real
  ```powershell
  (Get-Content .env | Select-String "RPC_ETH=").ToString()
  # Deve ter: wss://eth-mainnet.g.alchemy.com/v2/KEY_REAL
  ```

- [ ] **RPC_BSC**: Pode ser pública
  ```powershell
  (Get-Content .env | Select-String "RPC_BSC=").ToString()
  # OK: https://bsc-dataseed.binance.org/
  ```

- [ ] **RECEIVER_ETH** e **RECEIVER_BSC**: Configuradas
  ```powershell
  (Get-Content .env | Select-String "RECEIVER_").ToString()
  # Devem aparecer 2 linhas com endereços válidos
  ```

- [ ] **Parâmetros do bot**: Validados
  ```powershell
  (Get-Content .env | Select-String "SLIPPAGE|MIN_PROFIT|GAS_MULTIPLIER").ToString()
  # SLIPPAGE=50, MIN_PROFIT_USD=30, GAS_MULTIPLIER=1.2
  ```

## 📦 Checklist de Dependências

```powershell
# Verificar se dependências estão instaladas
npm list ethers dotenv hardhat @openzeppelin/contracts

# Se faltar algo, instale:
npm install

# Verificar package.json tem "type": "module"
(Get-Content package.json | Select-String '"type"')
# Esperado: "type": "module"
```

## 📁 Checklist de Estrutura de Arquivos

```powershell
# Verificar scripts existem
Test-Path scripts/multi-flash-arbbot.js
Test-Path scripts/setup-dex-graphics.js
Test-Path scripts/submit-to-trackers.js
Test-Path scripts/vscold-multi-complete.js
# Todos devem retornar True

# Verificar contratos existem
Test-Path contracts/FlashLoanReceiver.sol
# Deve retornar True

# Verificar configurações Hardhat
Test-Path hardhat.config.js
# Deve retornar True
```

## 🧪 Checklist de Validação de Sintaxe

```powershell
# Executar validation
node -c scripts/multi-flash-arbbot.js
node -c scripts/setup-dex-graphics.js
node -c scripts/submit-to-trackers.js
node -c scripts/vscold-multi-complete.js

# Sem output = sucesso ✓
# Com erros = crítico ✗
```

## ⏱️ Cronograma de Execução

```
00:00 - INICIAR: node scripts/vscold-multi-complete.js
00:05 - Metadados gerados
00:15 - PRs submetidas em 7 carteiras
00:20 - Pool Ethereum: criando (volume gerado)
00:40 - Pool BSC: criando (volume gerado)
00:55 - Agregadores notificados
01:00 - Receivers deployed
01:00 - BOT INICIADO EM BACKGROUND

Continuação:
1-6h   - DexScreener indexando
24-48h - Gráficos aparecem em wallets
3-7d   - CoinGecko manual
7-10d  - CoinMarketCap manual
```

## 🎯 Execução Final

**QUANDO PRONTO:**

```powershell
# Terminal 1: EXECUTAR O SISTEMA
cd 'c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT'
node scripts/vscold-multi-complete.js

# Aguardar até: "✓ SISTEMA VSCOLD ATIVO"

# Terminal 2: MONITORAR BOT (abrir DEPOIS que sistema iniciar)
Get-Content -Path multi-flash-arbbot.log -Wait
```

## ✅ Verificação Final

Após sistema iniciar, verificar:

```powershell
# 1. Log criado
Test-Path multi-flash-arbbot.log
# True = OK

# 2. Receiver configurado
(Get-Content .env | Select-String "RECEIVER")
# Dois endereços = OK

# 3. Bot rodando
Get-Content multi-flash-arbbot.log -Tail 5
# Deve ter "[INIT]" e "[MULTI-FLASH]" = OK

# 4. Arquivos de pool criados
Test-Path pool-setup-eth.json
Test-Path pool-setup-bsc.json
# Ambos True = OK
```

---

**✨ Sistema pronto para execução! Siga os passos em QUICK_START.md**
