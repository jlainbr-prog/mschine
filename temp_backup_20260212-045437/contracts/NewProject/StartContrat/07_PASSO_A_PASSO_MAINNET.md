# 🚀 PASSO A PASSO - DEPLOYMENT EM ETHEREUM MAINNET

## ✅ PRÉ-REQUISITOS

Antes de começar, certifique-se que você tem:

1. **ETH suficiente em sua carteira**
   - Mínimo: 0.05 ETH
   - Recomendado: 0.1 ETH
   - Endereço: `0x63546b9fc232C9c62C4867f06291212ddA83609d`

2. **Chave API Infura**
   - Você já tem: `bb6c950bae874373b593d28c42fe9674`
   - URLs configuradas em `.env`

3. **Hardhat instalado**
   ```bash
   npm install
   ```

4. **Contratos compilados**
   ```bash
   npx hardhat compile
   ```

---

## 📋 CHECKLIST PRÉ-DEPLOYMENT

- [ ] Saldo em MetaMask: **0.05+ ETH**
- [ ] Rede conectada: **Ethereum Mainnet**
- [ ] .env preenchido com:
  - [ ] PRIVATE_KEY
  - [ ] MAINNET_RPC_URL
  - [ ] RECIPIENT_ADDRESS
- [ ] Contratos compilados sem erros
- [ ] Testes passados em Sepolia ✅

---

## 🎯 PASSO 1: VERIFICAR ETH NA CARTEIRA

**No MetaMask:**
1. Mude para rede **Ethereum Mainnet**
2. Veja seu saldo em ETH
3. Deve ter no mínimo **0.05 ETH**
4. **Anote seu endereço:** `0x63546b9fc232C9c62C4867f06291212ddA83609d`

**Se não tiver ETH suficiente:**
- Compre em exchange (Binance, Kraken, Coinbase)
- Ou transfira de outra carteira

---

## 🎯 PASSO 2: VERIFICAR ARQUIVO .env

**Localização:** `Config/.env.atual`

**Verifique se contém:**
```env
PRIVATE_KEY=0x6467219490abb6f06ef9e4338ac679975687c65eba1e6f3adfedca94d5657cac
MAINNET_RPC_URL=https://mainnet.infura.io/v3/bb6c950bae874373b593d28c42fe9674
RECIPIENT_ADDRESS=0x63546b9fc232C9c62C4867f06291212ddA83609d
```

**IMPORTANTE:** Use este `.env` na raiz do projeto antes de executar deploy!

---

## 🎯 PASSO 3: COMPILAR CONTRATOS

Execute no terminal:
```bash
npx hardhat compile
```

**Esperado:**
```
Compiled 6 Solidity files successfully
```

---

## 🎯 PASSO 4: DEPLOY EM MAINNET

Execute o script de deployment:
```bash
npx hardhat run Scripts/DEPLOY_MAINNET.js --network mainnet
```

**O que vai acontecer:**
1. Verifica rede (Mainnet) ✅
2. Verifica saldo ETH ✅
3. Compila contratos ✅
4. Faz deploy de 1 bilhão USDT ✅
5. Salva em `MAINNET_Deployment.json` ✅

**Tempo estimado:** 5-20 minutos (depende da rede)

**Custo estimado:** ~0.035 ETH (~$90 USD)

---

## 🎯 PASSO 5: COPIAR ENDEREÇO DO CONTRATO

Após deploy bem-sucedido, você verá:
```
📍 Endereço: 0x... (seu novo contrato)
```

**Salve este endereço!** Você vai precisar para:
- Importar em MetaMask
- Verificar em Etherscan
- Transferências futuras

---

## 🎯 PASSO 6: IMPORTAR TOKEN EM METAMASK

**No MetaMask:**
1. **Mude para Mainnet**
2. **Clique em "Import Tokens"**
3. **Cole o endereço do contrato** (do passo 5)
4. **Os dados preenchem automaticamente:**
   - Symbol: USDT
   - Decimals: 6
5. **Clique em "Add"**

**Resultado:** Você verá **1.000.000.000 USDT** na sua carteira! 🎉

---

## 🎯 PASSO 7 (OPCIONAL): TRANSFERIR 500M USDT

Se quiser transferir 500 milhões para outro endereço:

```bash
npx hardhat run Scripts/TRANSFER.js --network mainnet
```

**Vai transferir:**
- De: Seu endereço (deployer)
- Para: `RECIPIENT_ADDRESS` do .env
- Valor: 500.000.000 USDT
- Custo: ~0.0015 ETH (~$4 USD)

---

## ✅ VERIFICAÇÃO FINAL

1. **No Etherscan:**
   - Vá para: https://etherscan.io
   - Cole o endereço do contrato
   - Verifique se está lá com 1B USDT

2. **No MetaMask:**
   - Mude para Mainnet
   - Veja seus 1B USDT (ou 500M se transferiu)

3. **Testar funcionalidades:**
   - Transfer: Envie uma pequena quantia
   - Approve: Autorize outro para gastar
   - Pause: Pausar transferências (owner)

---

## 🚨 TROUBLESHOOTING

### "Saldo insuficiente para gas"
**Solução:** Adicione mais ETH na carteira

### "Network timeout"
**Solução:** Aguarde 5 minutos e tente novamente

### "Invalid JSON-RPC response"
**Solução:** Verifique a chave API Infura em .env

### "Deployment pendente"
**Solução:** Aguarde 10+ minutos. Transações em Mainnet são lentas durante congestionamento

---

## 📊 CUSTOS ESPERADOS

| Operação | Gas | Custo ETH | USD |
|----------|-----|-----------|-----|
| Deploy | ~200k | ~0.035 | ~$90 |
| Transfer | ~65k | ~0.0015 | ~$4 |
| **TOTAL** | **~265k** | **~0.0365** | **~$94** |

---

## 📁 ARQUIVOS IMPORTANTES

```
NewProject/
├── Scripts/
│   ├── DEPLOY_MAINNET.js     ← USE ESTE PARA DEPLOY
│   ├── TRANSFER.js            ← USE ESTE PARA TRANSFERIR
│   ├── TEST.js                ← USE PARA TESTAR
│   └── DEPLOY_SEPOLIA.js      ← Para Sepolia (backup)
├── Contratos/
│   ├── TetherUSDTModern.sol
│   ├── BasicTokenModern.sol
│   ├── OwnableModern.sol
│   ├── PausableModern.sol
│   ├── BlackListModern.sol
│   └── SafeMathModern.sol
├── Config/
│   ├── .env.atual             ← Configure com seus dados
│   └── .env.example           ← Template
├── Deployment/
│   ├── SEPOLIA_Deployment.json ← Sepolia (referência)
│   └── MAINNET_Deployment.json ← Será criado após deploy
└── Leia/
    └── (Documentação)
```

---

## ⚠️ SEGURANÇA

🔒 **NUNCA:**
- ❌ Compartilhe sua PRIVATE_KEY
- ❌ Faça commit do .env no Git
- ❌ Cole sua chave em websites suspeitos

✅ **SEMPRE:**
- ✅ Guarde sua PRIVATE_KEY em lugar seguro
- ✅ Use arquivo .env local
- ✅ Verifique endereços antes de enviar

---

## 🎉 PRONTO!

Você está 100% pronto para:
1. ✅ Fazer deploy em Mainnet
2. ✅ Criar 1 bilhão USDT
3. ✅ Transferir para recipientes
4. ✅ Usar todas as funcionalidades

**Sucesso! 🚀**

---

**Data:** 31/01/2026
**Status:** ✅ TESTE COMPLETO EM SEPOLIA
**Próximo Passo:** Deploy em Ethereum Mainnet
