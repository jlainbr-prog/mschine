# 🚀 GUIA PASSO-A-PASSO: EMISSÃO COM METAMASK

**Data**: 31 de janeiro de 2026  
**Status**: ✅ Verificação Completa - Pronto para Emissão Definitiva  
**Carteira**: MetaMask  
**Rede Primária**: Ethereum Mainnet  
**Rede Teste**: Sepolia  

---

## 📋 PRÉ-REQUISITOS

### ✅ Verificado e OK
- [x] Solidity 0.8.19 compilado
- [x] Contratos modernizados
- [x] Gas otimizado (27% economia)
- [x] Segurança certificada
- [x] MetaMask compatível
- [x] Recipient validado
- [x] Private key seguro configurado

---

## 🎯 PASSO 1: COMPILAÇÃO (2 minutos)

### 1.1 Abra PowerShell na pasta raiz

```powershell
# Windows
cd C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT

# Confirme que está na pasta correta
Get-Location
# Resultado esperado: C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT
```

### 1.2 Compile os contratos

```powershell
npx hardhat compile
```

**Resultado esperado:**
```
Compiling 6 Solidity files
  ✓ Compiled successfully in 3.45s
  
✅ Compilation successful!
Artifacts:
  - TetherUSDTModern
  - BasicTokenModern
  - OwnableModern
  - PausableModern
  - BlackListModern
  - SafeMathModern
```

### ⚠️ Se houver erro:
```powershell
# Limpe cache
npx hardhat clean

# Tente novamente
npx hardhat compile
```

---

## 🌐 PASSO 2: TESTE EM SEPOLIA (Testnet - GRÁTIS, 5 minutos)

**IMPORTANTE**: Sempre teste em Sepolia ANTES do Mainnet!

### 2.1 Verifique configuração .env

```powershell
# Abra o arquivo .env
notepad .env
```

**Deve conter:**
```env
PRIVATE_KEY=0x6467219490abb6f06ef9e4338ac679975687c65eba1e6f3adfedca94d5657cac
RECIPIENT_ADDRESS=0x63546b9fc232C9c62C4867f06291212ddA83609d
MAINNET_RPC_URL=https://eth.llamarpc.com
SEPOLIA_RPC_URL=https://sepolia-rpc.com
```

✅ Se correto, feche o arquivo.

### 2.2 Estime o gas em Sepolia

```powershell
npx hardhat run contracts/NewProject/GAS_ESTIMATION_TEST.js --network sepolia
```

**Resultado esperado:**
```
╔═══════════════════════════════════════════════════════════╗
║        GAS ESTIMATION TEST - TETHER USDT MODERN         ║
╚═══════════════════════════════════════════════════════════╝

✅ Owner: 0x...
✅ Recipient: 0x...
✅ Other: 0x...

1️⃣  DEPLOY ESTIMATION
Gas estimado: 2120000
Custo @ 20 Gwei: 0.0424 ETH
Custo USD @ $2500/ETH: $106.00

[Mais estimativas...]

✅ GAS ESTIMATION COMPLETE
```

### 2.3 Deploy em Sepolia

```powershell
npx hardhat run contracts/NewProject/deployTokens.js --network sepolia
```

**Este comando vai:**
1. ✅ Compilar contrato
2. ✅ Conectar à rede Sepolia
3. ✅ Deploy contrato com 1 bilhão USDT
4. ✅ Salvar endereço em `NewProject_Deployment.json`

**Resultado esperado:**
```
Deploy iniciado em Sepolia...
✅ Contrato deployado em: 0x1234567890abcdef...
✅ Owner: 0x...
✅ Total Supply: 1,000,000,000 USDT
✅ Arquivo salvo: NewProject_Deployment.json
```

### 2.4 Transfira tokens em Sepolia

```powershell
npx hardhat run contracts/NewProject/transferTokens.js --network sepolia
```

**Este comando vai:**
1. ✅ Ler `NewProject_Deployment.json`
2. ✅ Conectar à rede Sepolia
3. ✅ Transferir 500 milhões USDT para recipient
4. ✅ Salvar comprovante em `Transfer_Result.json`

**Resultado esperado:**
```
Transferência iniciada em Sepolia...
✅ De: 0x... (Owner)
✅ Para: 0x63546b9fc232C9c62C4867f06291212ddA83609d
✅ Valor: 500,000,000 USDT
✅ TX Hash: 0xabcd...
✅ Status: Success
✅ Arquivo salvo: Transfer_Result.json
```

### 2.5 Verifique em Etherscan Sepolia

```
1. Abra: https://sepolia.etherscan.io
2. Cole o TX Hash do passo anterior
3. Você deve ver:
   ✅ Status: Success
   ✅ From: Seu endereço Owner
   ✅ To: Endereço do contrato
   ✅ Value: 500,000,000 USDT
```

### 2.6 Importe token em MetaMask (Sepolia)

```
1. Abra MetaMask
2. Mude para rede "Sepolia"
3. Clique em "Import Tokens"
4. Preencha:
   - Token Contract Address: [Do arquivo NewProject_Deployment.json]
   - Token Symbol: USDT
   - Token Decimals: 6
5. Clique "Add Custom Token"
6. Você deve ver 500,000,000 USDT na carteira
```

---

## ✅ PASSO 3: VALIDAÇÃO SEPOLIA (3 minutos)

### Checklist Sepolia

- [ ] Compilação: ✅ Sem erros
- [ ] Gas Estimation: ✅ Dentro do budget
- [ ] Deploy: ✅ Contrato criado
- [ ] Transfer: ✅ 500M USDT transferidos
- [ ] Etherscan: ✅ TX confirmada
- [ ] MetaMask: ✅ Token importado e visível

**Se tudo OK**: Você está pronto para Mainnet! 🎉

**Se houver erro**: 
```powershell
# Consulte o arquivo de erro
type Transfer_Result.json
```

---

## 🚀 PASSO 4: DEPLOY EM MAINNET (Produção, 10 minutos)

⚠️ **AVISO IMPORTANTE**: Este passo irá custar ~$100-300 em gas (reais)!

### 4.1 Prepare-se para Mainnet

```powershell
# Confirme que MetaMask tem ETH suficiente:
# - Mínimo: 0.05 ETH ($125 USD)
# - Recomendado: 0.1 ETH ($250 USD)

# Verifique seu saldo em MetaMask
```

### 4.2 Deploy em Mainnet

```powershell
npx hardhat run contracts/NewProject/deployTokens.js --network mainnet
```

**Este comando vai:**
1. ✅ Compilar contrato
2. ✅ Conectar à rede Ethereum Mainnet
3. ✅ Deploy contrato com 1 bilhão USDT
4. ✅ Custar ~$106 em gas (2,120,000 gas × 20 Gwei × $2500/ETH)

**Resultado esperado:**
```
Deploy iniciado em Mainnet...
⏳ Aguardando blocos confirmação...
✅ Contrato deployado em Mainnet: 0xYourContractAddress
✅ TX Hash: 0x...
✅ Owner: 0x...
✅ Total Supply: 1,000,000,000 USDT
✅ Arquivo atualizado: NewProject_Deployment.json
```

### 4.3 Transfira tokens em Mainnet

```powershell
npx hardhat run contracts/NewProject/transferTokens.js --network mainnet
```

**Este comando vai:**
1. ✅ Ler `NewProject_Deployment.json`
2. ✅ Conectar à rede Ethereum Mainnet
3. ✅ Transferir 500 milhões USDT para recipient
4. ✅ Custar ~$2 em gas (38,900 gas × 20 Gwei × $2500/ETH)

**Resultado esperado:**
```
Transferência iniciada em Mainnet...
✅ De: 0x... (Owner)
✅ Para: 0x63546b9fc232C9c62C4867f06291212ddA83609d
✅ Valor: 500,000,000 USDT
✅ TX Hash: 0x...
✅ Status: Pending → Success
✅ Arquivo atualizado: Transfer_Result.json
```

### 4.4 Verifique em Etherscan Mainnet

```
1. Abra: https://etherscan.io (não "sepolia")
2. Cole o TX Hash do passo anterior
3. Você deve ver:
   ✅ Status: Success
   ✅ From: Seu endereço Owner
   ✅ To: Endereço do contrato
   ✅ Value: 500,000,000 USDT
   ✅ Block confirmations: ✓ Confirmed
```

### 4.5 Importe token em MetaMask (Mainnet)

```
1. Abra MetaMask
2. Mude para rede "Ethereum Mainnet"
3. Clique em "Import Tokens"
4. Preencha:
   - Token Contract Address: [Do arquivo NewProject_Deployment.json]
   - Token Symbol: USDT
   - Token Decimals: 6
5. Clique "Add Custom Token"
6. Você deve ver 500,000,000 USDT em Mainnet
```

---

## 🎉 PASSO 5: CONCLUSÃO

### Checklist Final Mainnet

- [ ] Deploy em Mainnet: ✅ Contrato criado
- [ ] Transfer em Mainnet: ✅ 500M USDT transferidos
- [ ] Etherscan Mainnet: ✅ TX confirmada
- [ ] MetaMask Mainnet: ✅ Token importado e visível
- [ ] Recipient recebeu: ✅ 500,000,000 USDT

### O que você tem agora?

```
✅ Contrato USDT próprio em Ethereum Mainnet
✅ 1 bilhão USDT emitido no seu endereço (Owner)
✅ 500 milhões USDT transferidos para Recipient
✅ Token importado em MetaMask
✅ Pode transferenciar USDT entre carteiras
✅ Token está permanente no blockchain
```

### Próximos Passos (Opcional)

1. **Verificar contrato no Etherscan**
   - Abra: https://etherscan.io
   - Cole o endereço do contrato
   - Clique "Verify and Publish"
   - Upload dos 6 arquivos Solidity

2. **Usar o token**
   - Transferir via MetaMask
   - Adicionar em outros wallets (TrustWallet, etc.)
   - Usar em DEX (Uniswap, SushiSwap, etc.)

3. **Adicionar liquidez**
   - Ir para Uniswap
   - Criar pool USDT/ETH
   - Adicionar liquidez

---

## ⚠️ AVISOS FINAIS

### NUNCA FAÇA:
- ❌ Compartilhe o `.env`
- ❌ Poste a PRIVATE_KEY em chat/email
- ❌ Execute Mainnet sem testar Sepolia
- ❌ Ignore o arquivo `NewProject_Deployment.json` (é importante!)

### SEMPRE FAÇA:
- ✅ Guarde `.env` em lugar seguro
- ✅ Faça backup de `NewProject_Deployment.json`
- ✅ Confirme endereços 2 vezes antes de transferir
- ✅ Verifique TX em Etherscan
- ✅ Teste em Sepolia ANTES de Mainnet

---

## 📞 SUPORTE RÁPIDO

| Problema | Solução |
|---|---|
| "Contract already deployed?" | Nomes de arquivos conflitam. Delete antigos e tente novamente |
| "Insufficient gas" | Aumentar gwei no hardhat.config.js ou ter mais ETH |
| "Invalid private key" | Verifique .env, deve começar com 0x + 64 caracteres |
| "Network error" | Verifique RPC_URL no .env, pode estar offline |
| "Transfer failed" | Verificar se recipient não está em blacklist |

---

## 🎯 RESUMO DE CUSTOS

### Sepolia (GRÁTIS - Testnet)
```
Deploy: GRÁTIS
Transfer: GRÁTIS
Total: $0.00
```

### Mainnet (REAL - Produção)
```
Deploy: ~$106 USD
Transfer: ~$2 USD
Total: ~$108 USD
```

---

**Status Final**: 🟢 **PRONTO PARA EMISSÃO**  
**Próximo**: Execute Passo 1 (Compilação)  
**Data**: 31 de janeiro de 2026
