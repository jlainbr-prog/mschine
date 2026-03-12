# Guia: Usar Trust Wallet com TetherToken Deploy

## Passo 1: Exportar Chave Privada da Trust Wallet

### No Celular/Tablet (Trust Wallet)
1. Abra o **Trust Wallet**
2. Toque na carteira que deseja usar (ex: Ethereum)
3. Toque no ícone **⚙️ (Configurações)** ou **⋯ (Menu)**
4. Selecione **Configurações** → **Chaves Privadas** (ou **Backup**)
5. Toque em **Mostrar Chave Privada** (pode pedir Face ID ou PIN)
6. A chave aparecerá assim: `0x1234567890abcdef...` (64 caracteres hexadecimais)
7. **Copie e salve em local seguro** (NOT no git, NOT no grupo, NOT em email)

### Alternativa: Importar Seed Phrase em Hardware/CLI
Se preferir não exportar a chave privada diretamente:
- Use **Ledger Live** ou **Trezor Suite** para gerar chaves derivadas
- Ou importe a seed phrase no MetaMask e exporte de lá (mesmos passos acima)

---

## Passo 2: Configurar `.env` do Projeto

### Criar arquivo `.env` (NÃO versionar no git)

Na raiz do projeto:
```bash
cd "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"
```

Crie o arquivo `.env`:
```
# Testnet (Goerli/Sepolia) - Recomendado para testes
RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
PRIVATE_KEY="0xsua_chave_privada_trust_wallet"
ETHERSCAN_API_KEY="your_etherscan_api_key"

# Mainnet (APENAS após auditoria e testes completos)
# RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
# PRIVATE_KEY="0xsua_chave_privada_trust_wallet"
```

### ⚠️ SEGURANÇA CRÍTICA
- **NUNCA faça commit do `.env`** (já está em `.gitignore`)
- **NUNCA compartilhe a chave privada** por Slack, email, WhatsApp
- **Use chaves de TESTE** (com pouco ETH) antes de usar chave principal
- **Guarde a chave em local seguro:** 1Password, LastPass, ou hardware wallet

---

## Passo 3: Obter Chave de API da Alchemy (RPC Provider)

### 1. Registre-se na Alchemy
- Acesse https://www.alchemy.com/
- Crie conta gratuita
- Confirme email

### 2. Crie um App
- Dashboard → Criar App
- Nome: `TetherToken Deploy`
- Chain: **Ethereum**
- Network: **Sepolia** (testnet) ou **Mainnet** (produção)
- Copy API Key: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`

### 3. Coloque no `.env`
```
RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"
```

---

## Passo 4: Obter Teste ETH (Faucet) - Para Testnet

Se usar **Sepolia testnet**, você precisa de ETH de teste gratuito:

### Opção A: Alchemy Faucet
- https://www.alchemy.com/faucets/ethereum
- Cole seu endereço Trust Wallet
- Clique "Send me ETH"
- Recebe 1-2 ETH em segundos

### Opção B: Chainlink Faucet
- https://faucets.chain.link/sepolia
- Cole endereço
- Clique "Send me LINK and ETH"

### Opção C: Ethereum Sepolia Faucet
- https://www.sepoliafaucet.com/
- Cole endereço

---

## Passo 5: Atualizar `hardhat.config.js` para Trust Wallet

Abra `hardhat.config.js` e atualize:

```javascript
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.4.25" }
    ]
  },
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5
    },
    mainnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1
    }
  }
};
```

---

## Passo 6: Deploy com Trust Wallet via CLI

### Teste Local Primeiro (SEM gasto de ETH)
```bash
npx hardhat run --network hardhat "Projeto ok/2_HARDHAT_MODULADO/scripts/deploy_testnet.js"
```

### Deploy em Sepolia Testnet (com Trust Wallet)
```bash
npx hardhat run --network sepolia "Projeto ok/2_HARDHAT_MODULADO/scripts/deploy_testnet.js"
```

### Resultado esperado
```
Deployer: 0x... (seu endereço Trust Wallet)
TetherToken deployed at: 0x...
MultiSigWallet deployed at: 0x...
```

### Deploy em Mainnet (APENAS após validação)
```bash
npx hardhat run --network mainnet "Projeto ok/2_HARDHAT_MODULADO/scripts/deploy_testnet.js"
```

---

## Passo 7: Verificar Transações na Blockchain

Após deploy, veja suas transações:

### Sepolia Testnet
- https://sepolia.etherscan.io/
- Procure seu endereço ou endereço do contrato

### Goerli Testnet
- https://goerli.etherscan.io/

### Mainnet
- https://etherscan.io/

---

## Passo 8: Importar Token na Trust Wallet

Após deploy bem-sucedido:

1. Abra **Trust Wallet**
2. Toque em **+ (Adicionar Token)**
3. Selecione **Ethereum** (ou a rede usada)
4. Cole o endereço do contrato TetherToken
5. O token deve aparecer como **USDT**
6. Agora você verá seu saldo de tokens

---

## Checklist de Segurança

- [ ] `.env` criado e NÃO commitado no git
- [ ] Chave privada armazenada em local seguro (1Password, hardware wallet, etc)
- [ ] RPC_URL configurado (Alchemy/Infura)
- [ ] Teste ETH obtido via faucet (se testnet)
- [ ] `hardhat.config.js` atualizado com redes
- [ ] Deploy testado em `--network hardhat` antes de testnet
- [ ] Deploy em testnet bem-sucedido
- [ ] Transação verificada no Etherscan
- [ ] Token importado na Trust Wallet
- [ ] Saldo refletido corretamente
- [ ] **APENAS DEPOIS:** Deploy em mainnet (se necessário)

---

## Troubleshooting

### Erro: "Invalid private key"
- Certifique-se que a chave começa com `0x`
- Tem 66 caracteres (0x + 64 hex)
- Não tem espaços

### Erro: "Insufficient funds"
- Adicione mais ETH via faucet
- Verifique RPC_URL correto

### Erro: "Network not found"
- Verifique spelling em `.env` (RPC_URL, PRIVATE_KEY)
- Verifique `hardhat.config.js`

### Transação lenta em testnet
- Aguarde 20-60 segundos
- Verifique em Etherscan se está pending

---

## Próximas Ações

1. **Imediatamente:** Exporte chave da Trust Wallet + configure `.env`
2. **Hoje:** Deploy em testnet Sepolia
3. **Após auditoria:** Deploy em mainnet (se produção)
4. **Continuous:** Monitore saldo e transações no Etherscan

---

**Salvo em:** `Projeto ok/GUIA_TRUSTWALLET.md`
