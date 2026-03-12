# 🚀 GUIA COMPLETO: EMISSÃO E ENVIO DE TOKENS USDT

**Data**: 30 de janeiro de 2026  
**Status**: ✅ Pronto para Produção  
**Redes Suportadas**: Ethereum Mainnet, Sepolia, TRON, Polygon  

---

## 📋 RESUMO EXECUTIVO

Você vai:
1. ✅ Compilar o contrato modernizado (Solidity 0.8.19)
2. ✅ Deploy com Hardhat (local ou testnet)
3. ✅ Emitir 1 bilhão de tokens USDT
4. ✅ Transferir para sua carteira MetaMask/TrustWallet
5. ✅ Verificar no Etherscan/Explorers

**Tempo estimado**: 30 minutos  
**Custo**: Testnet = grátis | Mainnet = ~$50-200 (gas)

---

## 🔧 PASSO 1: PREPARAR AMBIENTE

### 1.1 Instalar dependências (se não tiver)

```powershell
cd "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox ethers
```

### 1.2 Verificar hardhat.config.js

Abra `hardhat.config.js` e verifique:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

---

## 🔐 PASSO 2: CONFIGURAR .env COM CHAVE PRIVADA

**Atualize** `C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT\.env`:

```env
# Chave privada do MetaMask (sem compartilhar aqui!)
PRIVATE_KEY=0x6467219490abb6f06ef9e4338ac679975687c65eba1e6f3adfedca94d5657cac

# RPC URLs
MAINNET_RPC_URL=https://eth.llamarpc.com
SEPOLIA_RPC_URL=https://sepolia-rpc.com
TRON_RPC_URL=https://api.trongrid.io

# Seu endereço de recebimento
RECIPIENT_ADDRESS=0x63546b9fc232C9c62C4867f06291212ddA83609d
```

**⚠️ NUNCA compartilhe seu PRIVATE_KEY!**

---

## 📝 PASSO 3: COMPILAR CONTRATO

```powershell
npx hardhat compile
```

**Esperado:**
```
Compiled 5 contracts successfully
```

Se tiver erro, verifique a pasta `contracts/NewProject/` e sintaxe Solidity.

---

## 🚀 PASSO 4: FAZER DEPLOY (TESTNET SEPOLIA)

### 4.1 Criar script de deploy

Crie arquivo `scripts/deployUSDT.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Iniciando deploy do TetherUSDT...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`📍 Deploying com: ${deployer.address}`);
  
  const initialSupply = 1000000000; // 1 bilhão tokens (com decimals = 1e15 wei)

  const TetherUSDT = await hre.ethers.getContractFactory("TetherUSDTModern");
  const token = await TetherUSDT.deploy(initialSupply);
  
  await token.deployed();

  console.log(`\n✅ Token deployado em: ${token.address}`);
  console.log(`💰 Supply inicial: ${initialSupply.toLocaleString()} USDT`);
  console.log(`📊 Owner: ${deployer.address}`);

  // Verificar saldo do deployer
  const balance = await token.balanceOf(deployer.address);
  console.log(`\n💵 Saldo do deployer: ${hre.ethers.utils.formatUnits(balance, 6)} USDT`);

  // Salvar endereço do contrato
  const fs = require("fs");
  const deployment = {
    address: token.address,
    owner: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync("deployment.json", JSON.stringify(deployment, null, 2));
  console.log("\n📋 Deployment salvo em deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 4.2 Executar deploy em Sepolia (testnet — grátis)

```powershell
npx hardhat run scripts/deployUSDT.js --network sepolia
```

**Output esperado:**
```
🚀 Iniciando deploy do TetherUSDT...

📍 Deploying com: 0x63546b9fc232C9c62C4867f06291212ddA83609d

✅ Token deployado em: 0x1234567890abcdef...
💰 Supply inicial: 1,000,000,000 USDT
📊 Owner: 0x63546b9fc232C9c62C4867f06291212ddA83609d

💵 Saldo do deployer: 1000000000 USDT

📋 Deployment salvo em deployment.json
```

**COPIE o endereço do token**: `0x1234567890abcdef...` (você usará isso em breve)

---

## 💸 PASSO 5: TRANSFERIR TOKENS PARA SUA CARTEIRA

### 5.1 Criar script de transferência

Crie `scripts/transferTokens.js`:

```javascript
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const deployment = JSON.parse(fs.readFileSync("deployment.json", "utf-8"));
  const tokenAddress = deployment.address;
  const recipientAddress = process.env.RECIPIENT_ADDRESS;

  console.log(`\n💸 Transferindo tokens...\n`);
  console.log(`📍 Token: ${tokenAddress}`);
  console.log(`📍 Recipient: ${recipientAddress}\n`);

  const [deployer] = await hre.ethers.getSigners();
  const token = await hre.ethers.getContractAt("TetherUSDTModern", tokenAddress);

  // Verificar saldo antes
  const balanceBefore = await token.balanceOf(deployer.address);
  console.log(`Saldo antes: ${hre.ethers.utils.formatUnits(balanceBefore, 6)} USDT`);

  // Transferir metade (500 bilhões)
  const amountToTransfer = hre.ethers.utils.parseUnits("500000000", 6);
  console.log(`\n📤 Enviando: ${hre.ethers.utils.formatUnits(amountToTransfer, 6)} USDT...`);

  const tx = await token.transfer(recipientAddress, amountToTransfer);
  const receipt = await tx.wait();

  console.log(`\n✅ Transação confirmada!`);
  console.log(`📍 TX Hash: ${receipt.transactionHash}`);

  // Verificar saldo depois
  const balanceAfter = await token.balanceOf(deployer.address);
  const recipientBalance = await token.balanceOf(recipientAddress);

  console.log(`\n💰 Saldos após transferência:`);
  console.log(`   Deployer: ${hre.ethers.utils.formatUnits(balanceAfter, 6)} USDT`);
  console.log(`   Recipient: ${hre.ethers.utils.formatUnits(recipientBalance, 6)} USDT`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 5.2 Executar transferência

```powershell
npx hardhat run scripts/transferTokens.js --network sepolia
```

**Esperado:** Tokens aparecerão na sua carteira MetaMask/TrustWallet

---

## 🔍 PASSO 6: VERIFICAR NO ETHERSCAN

Abra seu navegador:

- **Sepolia (testnet)**: https://sepolia.etherscan.io/address/0xSEU_ENDERECO
- **Mainnet**: https://etherscan.io/address/0xSEU_ENDERECO

Procure por **"Token Holdings"** — você deve ver os tokens ali!

---

## 📱 PASSO 7: IMPORTAR TOKEN NA CARTEIRA

### No MetaMask:

1. Abra MetaMask
2. Clique em **"Importar Token"**
3. Cole o endereço do contrato (da seção 4.2)
4. Symbol: `USDT`
5. Decimals: `6`
6. Clique em **"Adicionar Token"**

### Na Trust Wallet:

1. Abra Trust Wallet
2. Vá em **"Tokens"** → **"+"**
3. Procure por "Custom Token"
4. Cole o endereço do contrato
5. Preencha dados (USDT, 6 decimals)
6. Salve

---

## 🎯 PASSO 8: PARA MAINNET (REAL)

Quando estiver pronto para produção:

### 8.1 Garantir que tem ETH suficiente

Você precisa de ~$50-200 em ETH para gas (depende da rede).

### 8.2 Executar deploy em Mainnet

```powershell
npx hardhat run scripts/deployUSDT.js --network mainnet
```

⚠️ **Cuidado:** Isto cuста ETH real! Confirme tudo antes!

---

## 🆘 TROUBLESHOOTING

| Erro | Solução |
|------|---------|
| "NETWORK_ERROR" | Verifique RPC_URL no .env |
| "Insufficient balance" | Você não tem ETH para gas |
| "Contract not found" | Verifique endereço do token em deployment.json |
| "Token not appearing" | Espere 1-2 minutos ou atualize a carteira |

---

## ✅ CHECKLIST FINAL

- [ ] Compilou com sucesso (`npx hardhat compile`)
- [ ] Deploy em Sepolia funcionou
- [ ] Tokens apareceram na carteira
- [ ] Transferência foi confirmada no Etherscan
- [ ] Token importado em MetaMask/TrustWallet
- [ ] Saldos estão corretos

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Após sucesso em testnet, faça em **Mainnet** (com ETH real)
2. ✅ Compartilhe endereço do token (`0x...`) com comunidade
3. ✅ Liste em exploradores (Etherscan, CoinGecko, etc.)
4. ✅ Crie site/documentação do token

---

**Pronto? Comece pelo Passo 1!** 🎯
