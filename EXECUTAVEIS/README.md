# 🚀 EXECUTÁVEIS - TODAS AS OPERAÇÕES DO USDT

## 📋 Scripts Disponíveis

### 1️⃣ DEPLOY
```bash
npx hardhat run ../scripts/deploy_sepolia.js --network hardhat
```
Cria um novo contrato USDT

---

### 2️⃣ ISSUE (EMITIR TOKENS)
```bash
npx hardhat run issue.js --network hardhat
```
Emite novos tokens (aumenta supply)

**Configuração:**
- Abra `issue.js`
- Altere `amount` para quantidade desejada

---

### 3️⃣ TRANSFER (TRANSFERIR TOKENS)
```bash
npx hardhat run transfer.js --network hardhat
```
Transfere tokens para outro endereço

**Configuração:**
- `recipientAddress` = para quem enviar
- `amount` = quantidade de USDT

---

### 4️⃣ APPROVE (AUTORIZAR GASTO)
```bash
npx hardhat run approve.js --network hardhat
```
Autoriza alguém a gastar seus tokens

---

### 5️⃣ TRANSFERFROM (TRANSFERIR EM NOME DE ALGUÉM)
```bash
npx hardhat run transferfrom.js --network hardhat
```
Transfere tokens no nome de outro endereço

---

### 6️⃣ PAUSE (CONGELAR OPERAÇÕES)
```bash
npx hardhat run pause.js --network hardhat
```
Pausa TODAS as transferências (emergência)

---

### 7️⃣ UNPAUSE (DESCONGELAR)
```bash
npx hardhat run unpause.js --network hardhat
```
Volta a permitir transferências

---

### 8️⃣ BLACKLIST (BLOQUEAR ENDEREÇO)
```bash
npx hardhat run blacklist.js --network hardhat
```
Adiciona endereço à blacklist (compliance)

---

### 9️⃣ REMOVE BLACKLIST
```bash
npx hardhat run remove_blacklist.js --network hardhat
```
Remove endereço da blacklist

---

### 🔟 BALANCE (VER SALDO)
```bash
npx hardhat run balance.js --network hardhat
```
Consulta saldo de um endereço

---

## 💡 EXEMPLO RÁPIDO

1. **Deploy inicial:**
   ```bash
   npx hardhat run ../scripts/deploy_sepolia.js --network hardhat
   ```
   Você recebe 1.000.000 USDT

2. **Transferir 100 USDT:**
   ```bash
   npx hardhat run transfer.js --network hardhat
   ```

3. **Ver seu novo saldo:**
   ```bash
   npx hardhat run balance.js --network hardhat
   ```

---

## ⚙️ CONFIGURAÇÃO

Edite o arquivo `.env` na raiz com:
```
PRIVATE_KEY=0x...
RPC_URL=https://sepolia.infura.io/v3/...
```

---

## 🌐 USAR EM SEPOLIA REAL

Substitua `--network hardhat` por `--network sepolia`:

```bash
npx hardhat run issue.js --network sepolia
```

⚠️ Precisa de Sepolia ETH real para gas!

---

## 📊 RESULTADO

Cada script gera um `result_*.json` em RESULTADOS/

---

## ❓ DÚVIDAS?

Abra o arquivo do script que quer usar:
- Veja os comentários explicando cada linha
- Altere os valores conforme necessário
- Execute!

---

**Vamos começar? Qual operação você quer fazer?**
