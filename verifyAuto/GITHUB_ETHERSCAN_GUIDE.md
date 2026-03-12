# 🚀 Guia: GitHub + Etherscan

## 📝 GitHub Setup

### 1. Configurar Git (primeira vez)
```bash
git config user.email "seu.email@example.com"
git config user.name "Seu Nome"
```

### 2. Adicionar Arquivos
```bash
git add .
```

### 3. Fazer Commit
```bash
git commit -m "Deploy TetherToken (USD/USDT) - 1T supply - Validado e testado"
```

### 4. Setup Remote (se novo repositório)
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git branch -M main
git push -u origin main
```

---

## ✅ Etherscan Verification

### Informações Necessárias:
```json
{
  "contractName": "TetherToken",
  "solidity": "0.4.18",
  "optimizer": "yes",
  "runs": 200,
  "license": "MIT",
  "constructorArguments": {
    "initialSupply": "1000000000000",
    "name": "USD",
    "symbol": "USDT",
    "decimals": 6
  }
}
```

### Passos:

1. **Deploy o contrato** (testnet ou mainnet)
2. **Copie o Contract Address** do resultado do deploy
3. **Acesse:** https://etherscan.io/address/CONTRACT_ADDRESS#code
4. **Clique em:** "Verify and Publish"
5. **Configure:**
   - Compiler Version: v0.4.18+commit.9cf6e910
   - Optimization: Yes
   - Runs: 200
6. **Cole o código:** 
   - Use `scripts/flatten.js` para combinar arquivos
   OR
   - Upload manual de cada arquivo
7. **Insira Constructor Arguments** (em hex)
8. **Verifique!**

---

## 📄 Arquivos para Commit

```
✅ Contratos (8 arquivos)
✅ Configuração Hardhat
✅ Documentação de Deploy
✅ Scripts de Validação
```

Total: 17 arquivos prontos

---

**Status:** Pronto para producão
