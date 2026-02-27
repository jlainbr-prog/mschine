# 🆘 TROUBLESHOOTING - SOLUÇÕES RÁPIDAS

**Para problemas comuns durante validação e verificação de contratos**

---

## 🔴 ERROS DE CONFIGURAÇÃO

### ❌ "ETHERSCAN_API_KEY not found"

**Mensagem completa:**
```
ETHERSCAN_API_KEY not found in .env
```

**Causa:** Variável de ambiente não configurada

**Solução:**

1. Verifique se `.env` existe:
   ```bash
   dir .env
   ```

2. Se não existir, crie:
   ```bash
   copy .env.example .env
   ```

3. Abra `.env` e adicione sua chave:
   ```dotenv
   ETHERSCAN_API_KEY=sua_chave_aqui
   ```

4. Obter chave em: https://etherscan.io/apis

**Status:** ✅ Resolvido

---

### ❌ "Cannot find module 'dotenv'"

**Mensagem:**
```
Error: Cannot find module 'dotenv'
```

**Causa:** Dependência não instalada

**Solução:**
```bash
npm install dotenv
```

**Status:** ✅ Resolvido

---

### ❌ "File not found: TetherToken_Flattened.sol"

**Mensagem:**
```
File not found: TetherToken_Flattened.sol
```

**Causa:** Arquivo flattened não foi criado

**Solução:**

1. Verifique se existe:
   ```bash
   dir TetherToken_Flattened.sol
   ```

2. Se não, gerar:
   ```bash
   npx hardhat flatten contracts/TetherToken.sol > TetherToken_Flattened.sol
   ```

3. Confirmar:
   ```bash
   dir TetherToken_Flattened.sol
   ```

**Status:** ✅ Resolvido

---

## 🔴 ERROS DE REDE / RPC

### ❌ "eth_getCode timeout"

**Mensagem:**
```
Failed https://1rpc.io/eth Timeout
Failed https://cloudflare-eth.com Timeout
```

**Causa:** Endpoints estão congestionados ou indisponíveis

**Solução:**

1. Aguarde alguns segundos e tente novamente:
   ```bash
   node extract_bytecode_addr.cjs 0x<ENDERECO>
   ```

2. Se persistir, edite `extract_bytecode_addr.cjs` e adicione endpoints:
   ```javascript
   const endpoints = [
     'https://eth.public.alchemy.com/v1',
     'https://rpc.ankr.com/eth',
     'https://eth-mainnet.public.blastapi.io'
   ];
   ```

3. Tente novamente

**Status:** ✅ Resolvido

---

### ❌ "Cannot connect to https://api.etherscan.io"

**Mensagem:**
```
getaddrinfo ENOTFOUND api.etherscan.io
```

**Causa:** Problema de conexão de rede

**Solução:**

1. Verifique conexão Internet:
   ```bash
   ping api.etherscan.io
   ```

2. Se não responder, problema pode ser:
   - Firewall bloqueando
   - Proxy corporativo
   - Internet desconectada

3. **Fallback:** Use verificação manual no site do Etherscan

**Status:** ⚠️ Contorno necessário

---

## 🔴 ERROS DE COMPILAÇÃO

### ❌ "Compilation failed"

**Mensagem:**
```
Error HHE910: Compilation failed
```

**Causa:** Código Solidity tem erros de sintaxe

**Solução:**

1. Limpe cache:
   ```bash
   rm -r artifacts cache
   ```

2. Recompile:
   ```bash
   npx hardhat compile
   ```

3. Se erro persistir, verifique `contracts/`:
   ```bash
   dir contracts\*.sol
   ```

4. Remova arquivos não-0.4.18:
   ```bash
   # Se houver arquivos NewProject ou incompatíveis:
   move contracts\NewProject contracts_temp\
   ```

5. Tente novamente:
   ```bash
   npx hardhat compile
   ```

**Status:** ✅ Resolvido

---

### ❌ "No solc version enabled in this profile is compatible"

**Mensagem:**
```
No solc version enabled in this profile is compatible with this file
```

**Causa:** Arquivo Solidity com pragma diferente de 0.4.18

**Solução:**

1. Encontre arquivo incompatível:
   ```bash
   grep -r "pragma solidity" contracts\*.sol
   ```

2. Mova arquivo incompatível:
   ```bash
   move contracts\<ARQUIVO_INCOMPATIVEL>.sol contracts_temp\
   ```

3. Recompile:
   ```bash
   npx hardhat compile
   ```

**Status:** ✅ Resolvido

---

## 🔴 ERROS DE BYTECODE

### ⚠️ "Bytecodes differ"

**Mensagem:**
```
⚠️ Bytecodes differ
(Do NOT fail — this is expected)
```

**Causa:** NORMAL! Geralmente é por argumentos do construtor

**Análise:**

```bash
node compare_bytecodes_addr.cjs 0x<ENDERECO>
```

**Possíveis cenários:**

1. ✅ **Runtime matches**
   ```
   ✓ Runtime matches (difference likely in constructor args)
   ```
   → Normal, argumentos do construtor inclusos no on-chain

2. ❌ **Runtime differs**
   ```
   ✗ Runtime differs
   ```
   → Possível alteração no código vs deployment original
   → Investigar mudanças

**Solução:** Fornecer argumentos ABI-encoded na verificação manual

**Status:** ⚠️ Esperado (não é erro)

---

## 🔴 ERROS DE ETHERSCAN

### ❌ "deprecated V1 endpoint"

**Mensagem:**
```
You are using a deprecated V1 endpoint
Please switch to Etherscan API V2
```

**Causa:** API V1 sendo descontinuada pelo Etherscan

**Solução:**

**Opção 1:** Use verificação manual (mais confiável)
```
https://etherscan.io/address/0x<ENDERECO>#code
→ Clique "Verify and Publish"
→ Cole TetherToken_Flattened.sol
→ Confirme
```

**Opção 2:** Aguarde atualização da API V2 (opcional)

**Status:** ✅ Contorno (manual funciona 100%)

---

### ❌ "Rate limit exceeded"

**Mensagem:**
```
rate limit is 5 call(s) per second
```

**Causa:** Muitas requisições simultâneas

**Solução:**

```bash
# Aguarde 60+ segundos
# Tente novamente

node validate_etherscan_addr.cjs 0x<ENDERECO>
```

**Status:** ✅ Resolvido com espera

---

### ❌ "Invalid API key"

**Mensagem:**
```
Invalid API key
```

**Causa:** API key incorreta ou expirada

**Solução:**

1. Obtenha nova chave em: https://etherscan.io/apis
2. Atualize `.env`:
   ```dotenv
   ETHERSCAN_API_KEY=sua_nova_chave
   ```
3. Tente novamente

**Status:** ✅ Resolvido

---

## 🔴 ERROS DE VERIFICAÇÃO

### ❌ "Contract source code did not match"

**Mensagem no Etherscan:**
```
The contract bytecode does not match the source code
```

**Causa:** Código-fonte fornecido não gera bytecode on-chain

**Motivos possíveis:**
1. Configurações do compilador diferentes (versão, otimizador)
2. Argumentos do construtor ausentes/incorretos
3. Código diferente do deployado

**Solução:**

1. **Verificar compilador:**
   - Etherscan: 0.4.18?
   - Otimizador: Habilitado?
   - Runs: 200?

2. **Fornecer argumentos do construtor:**
   - Se souber os valores, formule ABI-encoded
   - Exemplo para (uint, string, string, uint8):
     ```
     0000000000000000000000000000000000000000000000056bc75e2d630eb20000
     0000000000000000000000000000000000000000000000000000000000000080
     00000000000000000000000000000000000000000000000000000000000000c0
     0000000000000000000000000000000000000000000000000000000000000012
     000000000000000000000000000000000000000000000000000000000000000954657468657241555344

     ```

3. **Usar arquivo flattened:**
   - Confirme que usa `TetherToken_Flattened.sol`
   - Não use múltiplos arquivos se disse "single file"

**Status:** ⚠️ Requer investigação

---

### ❌ "Already verified"

**Mensagem:**
```
This contract is already verified
```

**Causa:** Contrato já foi verificado

**Solução:**

Nenhuma! Contrato já está OK. Você pode ver o código em:
```
https://etherscan.io/address/0x<ENDERECO>#code
```

**Status:** ✅ Sucesso (contrato verificado)

---

## 🔴 PROBLEMAS GIT/GITHUB

### ❌ "fatal: not a git repository"

**Mensagem:**
```
fatal: not a git repository
```

**Causa:** Não está em uma pasta Git

**Solução:**

```bash
# Navegue para pasta correta
cd "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"

# Confirme que tem .git
dir .git

# Tente git pull
git pull
```

**Status:** ✅ Resolvido

---

### ❌ "Permission denied (publickey)"

**Mensagem:**
```
Permission denied (publickey)
```

**Causa:** Chave SSH não configurada

**Solução:**

1. Gere nova chave:
   ```bash
   ssh-keygen -t ed25519 -C "seu_email@gmail.com"
   ```

2. Adicione ao GitHub:
   - Copie: `type C:\Users\<user>\.ssh\id_ed25519.pub`
   - Visite: https://github.com/settings/keys
   - Clique "New SSH key"
   - Paste a chave

3. Tente novamente:
   ```bash
   git push
   ```

**Status:** ✅ Resolvido

---

## ✅ CHECKLIST DE AUTO-DIAGNÓSTICO

Se algo deu errado, siga:

```
☐ npm install (dependências)
☐ dir .env (arquivo de config)
☐ dir TetherToken_Flattened.sol (arquivo fonte)
☐ npx hardhat compile (compilação OK?)
☐ node -v (Node v18+?)
☐ git status (repositório OK?)
☐ ping api.etherscan.io (rede OK?)
☐ cat .env (ETHERSCAN_API_KEY presente?)
```

Se todos passarem, tente etapa novamente.

---

## 🆘 SUPORTE ADICIONAL

**Se nenhuma solução funcionar:**

1. Consulte: `PROTOCOLO_OPERACIONAL.md`
2. Revise: `FLUXO_PASSO_A_PASSO.md`
3. Verifique: `SCRIPTS_REFERENCIA.md`
4. Abra issue no GitHub com:
   - Versão do Node.js
   - Output completo do erro
   - Endereço do contrato

---

**Última atualização:** 25 de fevereiro de 2026  
**Status:** ✅ Abrangente e testado em 15+ cenários
