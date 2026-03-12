# ✅ PRÉ-REQUISITOS E CHECKLIST

## ANTES DE RODAR: `node verifyAuto.js`

### 🔐 Credenciais Necessárias (OBRIGATÓRIO)

- [ ] **Etherscan API Key**
  - Obtém em: https://etherscan.io/apis
  - Cole em `verifyAuto.js` linha 11
  - Formato: `const ETH_KEY = 'YOURKEY...';`
  - ⏱️ Tempo: 2 minutos

- [ ] **RPC URL** (Infura, Alchemy ou Chainstack)
  - Escolha um:
    - [ ] Infura: https://infura.io
    - [ ] Alchemy: https://www.alchemy.com
    - [ ] Chainstack: https://chainstack.com
  - Cole em `verifyAuto.js` linha 9
  - Formato: `const RPC = 'https://...';`
  - ⏱️ Tempo: 3 minutos

- [ ] **Chave Privada**
  - ✅ JÁ ESTÁ CONFIGURADA!
  - Não precisa fazer nada
  - `const PRIV = '2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27'`

### 💻 Ambiente Local

- [ ] **Node.js v14+** instalado
  ```powershell
  node -v
  # Resultado esperado: v16.x ou v18.x ou superior
  ```

- [ ] **npm** disponível
  ```powershell
  npm -v
  # Resultado esperado: v7.x ou superior
  ```

- [ ] **Git** (opcional, mas recomendado)
  ```powershell
  git --version
  ```

### 💰 Carteira Ethereum

- [ ] **Saldo em ETH** (~0.05 ETH mínimo)
  - Para pagar gas fees do deploy
  - Verifique em: https://etherscan.io/address/SEU_ENDERECO
  - Derivado da chave privada

### 🌐 Conectividade

- [ ] **Internet estável** (upload/download)
- [ ] **RPC URL responde** (teste no navegador)
  - Acesse sua RPC URL
  - Resultado esperado: erro JSON-RPC é normal
  - Resultado ruim: timeout ou "Connection refused"

---

## ⚡ EXECUÇÃO RÁPIDA (Checklist Final)

Verifique ANTES de executar:

1. **Abra `verifyAuto.js` e verifique:**
   ```javascript
   const RPC     = 'https://...' // Preenchido?
   const ETH_KEY = 'ABC123...'   // Preenchido?
   ```

2. **Execute o diagnóstico:**
   ```powershell
   # Teste RPC
   curl -X POST https://sua-rpc-aqui -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
   
   # Teste Node.js
   node -v
   
   # Teste npm
   npm -v
   ```

3. **Se tudo OK:**
   ```powershell
   node verifyAuto.js
   ```

---

## 🚨 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### ❌ "Module not found: child_process"
**Causa:** Versão Node.js incompatível  
**Solução:** Atualize Node.js para v14+ em https://nodejs.org

### ❌ "Cannot find module '@nomiclabs/hardhat-ethers'"
**Causa:** npm install falhou  
**Solução:** 
```powershell
npm install --save-exact
npm cache clean --force
npm install
```

### ❌ "Insufficient funds for gas"
**Causa:** Saldo ETH insuficiente  
**Solução:** 
- Adicione ~0.05 ETH à carteira
- Use testnet primeiro (Sepolia): `const CHAIN = 'sepolia'`

### ❌ "RPC_URL not responding"
**Causa:** RPC inválida ou sobrecarregada  
**Solução:** 
- Verifique se a URL está correta
- Tente outra RPC (Infura → Alchemy → Chainstack)
- Aguarde alguns minutos se RPC está sobrecarregada

### ❌ "ETHERSCAN_API_KEY invalid"
**Causa:** Chave não registrada ou expirada  
**Solução:**
- Gere uma nova em https://etherscan.io/apis
- Aguarde 2-3 minutos para ativar

---

## 📞 SUPORTE RÁPIDO

Se receber erro desconhecido:

1. **Leia a mensagem de erro completa**
   - Procure por "Error:" ou "ENOENT"

2. **Copie a mensagem e procure:**
   - Documentação Hardhat: https://hardhat.org
   - GitHub Issues: https://github.com/nomiclabs/hardhat

3. **Contacte:**
   - Suporte Etherscan: https://etherscan.io/apis
   - Suporte RPC (Infura, Alchemy, etc)

---

## 🎯 PRÓXIMOS PASSOS (Após sucesso)

1. Compare código no Etherscan com seu código local
2. Verifique eventos emitidos durante deploy
3. Teste funções: read/write através do Etherscan
4. Guarde endereço do contrato para documentação

---

**Tempo estimado para preparar:** 5 minutos  
**Tempo de execução do script:** 3-5 minutos  
**TEMPO TOTAL:** ~10 minutos

✅ Pronto? Vá para `GUIA_RAPIDO.ps1`
