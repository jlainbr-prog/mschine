# 📋 FLUXO PASSO-A-PASSO - GUIA EXECUTIVO

**Para:** Validar e verificar contratos Ethereum no Etherscan  
**Tempo estimado:** 15-30 minutos (mais tempo de espera)  
**Dificuldade:** ⭐ Fácil (automático com opção manual)

---

## ✅ CHECKLIST PRÉ-EXECUÇÃO

Antes de começar, certifique-se de:

```
☐ Terminal aberto no diretório raiz do projeto
☐ Arquivo .env configurado (se undefined, pule o 'submit_verify.cjs')
☐ Arquivo TetherToken_Flattened.sol existe
☐ Node.js v18+ instalado
☐ Git configurado
```

---

## 🎯 FLUXO PRINCIPAL

### **ETAPA 1: PREPARAÇÃO (2 min)**

#### 1.1 Obter o endereço do contrato
```
Exemplo: 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
```

#### 1.2 Verificar ambiente
```bash
# Abra PowerShell na pasta do projeto
cd "C:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"

# Confirme que está na pasta correta
dir TetherToken_Flattened.sol
```

---

### **ETAPA 2: EXTRAÇÃO (3-5 min)**

#### 2.1 Extrair bytecode on-chain
```bash
node extract_bytecode_addr.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
```

**Esperado:**
```
Trying https://1rpc.io/eth
Saved to bytecode_onchain_0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11.hex
```

**Se falhar:** Tente outro RPC na lista do script (cloudflare-eth.com, etc)

#### 2.2 Verificar arquivo foi criado
```bash
dir bytecode_onchain_0x*.hex
```

---

### **ETAPA 3: COMPILAÇÃO (5-10 min)**

#### 3.1 Compilar contrato
```bash
npx hardhat compile
```

**Esperado:**
```
Compiled 12 Solidity files
✓ Compilation successful
```

#### 3.2 Comparar bytecodes
```bash
node compare_bytecodes_addr.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
```

**Resultado esperado (um dos dois):**
```
✅ Perfect match: bytecodes are identical
   (Se construtor foi mesmo que no deploy)

⚠️ Bytecodes differ
   ✓ Runtime matches (difference likely in constructor args)
   (Normal — é por causa dos args do construtor)
```

---

### **ETAPA 4: VALIDAÇÃO ETHERSCAN (2-3 min)**

#### 4.1 Verificar status atual
```bash
node validate_etherscan_addr.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
```

**Resultado:**
```
Checking Etherscan for 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
✅ Contract verified on Etherscan
(Se já foi verificado → Pronto!)

⚠️ Contract not verified (getabi response): NOTOK
(Se não foi → Prosseguir com próximo passo)
```

---

### **ETAPA 5: VERIFICAÇÃO (5-10 min)**

#### **Se NÃO foi verificado, escolha UMA opção:**

---

##### **OPÇÃO A: Automática via API (rápido, às vezes falha)**

```bash
node submit_verify.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
```

**Se funcionar:**
```
Etherscan Response:
{
  "status": "1",
  "message": "OK",
  "result": "GUID123456"
}
✅ Verification submitted successfully!
GUID: GUID123456
```

**Aguarde 1-2 minutos e acesse:**
```
https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code
```

---

##### **OPÇÃO B: Manual no site (confiável, 5 min)**

1. **Acesse a página do contrato:**
   ```
   https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code
   ```

2. **Clique em "Verify and Publish"** (botão azul)

3. **Preencha o formulário:**

   | Campo | Valor |
   |-------|-------|
   | Contract Address | 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11 |
   | Compiler Type | Solidity (Single File) |
   | Compiler Version | 0.4.18 |
   | Is Optimization Enabled? | YES |
   | Runs | 200 |
   | License | MIT |

4. **Cole o código-fonte:**
   - Abra `TetherToken_Flattened.sol` em VS Code
   - Selecione tudo (Ctrl+A)
   - Copie (Ctrl+C)
   - Paste no campo "Solidity Contract Code"

5. **Constructor Arguments (opcional):**
   - Se souber: Cole em formato ABI-encoded
   - Se não souber: Deixe em branco

6. **Resolva o CAPTCHA** e clique **"Verify and Publish"**

7. **Aguarde 1-2 minutos**

---

### **ETAPA 6: CONFIRMAÇÃO (2 min)**

#### 6.1 Verificar se verificado
Acesse novamente:
```
https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code
```

**Esperado na página:**
```
✔ Contract source code verified (Version 0.4.18)
```

---

### **ETAPA 7: DOCUMENTAÇÃO (3 min)**

#### 7.1 Arquivo de relatório foi gerado automaticamente
```
VALIDACAO_ETHERSCAN_RELATORIO_0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11.md
```

#### 7.2 Commitar mudanças
```bash
git add bytecode_onchain_0x*.hex VALIDACAO_ETHERSCAN_RELATORIO_0x*.md

git commit -m "docs: Contract verification for 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11

- Bytecode extracted and compared
- Contract verified on Etherscan
- Source code now public"

git push origin feature/set-balance-improvements
```

---

## 🔄 ATALHO COMPLETO (Copie-e-Cole)

Para um novo contrato `0xNOVO_ENDERECO`:

```bash
# 1. Extrair
node extract_bytecode_addr.cjs 0xNOVO_ENDERECO

# 2. Compilar
npx hardhat compile

# 3. Comparar
node compare_bytecodes_addr.cjs 0xNOVO_ENDERECO

# 4. Validar
node validate_etherscan_addr.cjs 0xNOVO_ENDERECO

# 5a. Se não verificado - tentar automático:
node submit_verify.cjs 0xNOVO_ENDERECO

# Ou 5b. Manual no site (mais confiável):
# → https://etherscan.io/address/0xNOVO_ENDERECO#code
# → Clique "Verify and Publish"
# → Cole TetherToken_Flattened.sol
# → v0.4.18, Otimizador ON (200 runs)

# 6. Após sucesso - documentar:
git add bytecode_onchain_0xNOVO_ENDERECO.hex
git commit -m "docs: Contract verification for 0xNOVO_ENDERECO"
git push
```

---

## 🆘 RESPOSTAS RÁPIDAS

**P: Onde está o TetherToken_Flattened.sol?**  
R: Na raiz do projeto. Se não existir:
```bash
npx hardhat flatten contracts/TetherToken.sol > TetherToken_Flattened.sol
```

**P: Como obter ETHERSCAN_API_KEY?**  
R: Para submissão automática (opcional):
1. Visite https://etherscan.io/apis
2. Faça login / crie conta
3. Crie nova API key
4. Adicione a `.env`: `ETHERSCAN_API_KEY=sua_chave`

**P: Quanto tempo leva?**  
R: Total ~20-30 min (incluso espera do Etherscan)

**P: E se der erro?**  
R: Consulte `TROUBLESHOOTING.md` ou tente a opção manual no site

**P: Preciso fazer para ambos os contratos?**  
R: Sim, repita para cada:
- 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
- 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11

---

## 📞 SUPORTE

Arquivo de troubleshooting: `TROUBLESHOOTING.md`  
Protocolo completo: `PROTOCOLO_OPERACIONAL.md`  
Scripts disponíveis: `SCRIPTS_REFERENCIA.md`

---

**Última atualização:** 25 de fevereiro de 2026  
**Status:** ✅ Testado e aprovado
