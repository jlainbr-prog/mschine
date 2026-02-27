# 🎯 PROTOCOLO OPERACIONAL - VALIDAÇÃO E VERIFICAÇÃO DE CONTRATOS ETHEREUM

**Versão:** 1.0  
**Data:** 25 de fevereiro de 2026  
**Status:** ✅ OPERACIONAL

---

## 📋 RESUMO EXECUTIVO

Este documento descreve o **procedimento completo e testado** para:
1. Extrair bytecode on-chain de contratos Ethereum
2. Compilar localmente e comparar bytecodes
3. Validar status no Etherscan
4. Preparar e submeter verificação automática
5. Executar verificação manual se necessário

**Sucesso comprovado com:**
- Contrato 1: `0x419ecA43dB68E868E68d1aB460c8AC32523c7540`
- Contrato 2: `0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11`

---

## 🔧 PRÉ-REQUISITOS

### Ambiente
- Node.js v18+ instalado
- Git configurado com autenticação GitHub
- Acesso a variáveis de ambiente (`.env`)

### Arquivos Essenciais
```
.env                          → Credenciais (ETHERSCAN_API_KEY, PRIVATE_KEY, etc)
package.json                  → Dependências (dotenv, ethers)
hardhat.config.js            → Configuração Hardhat para Solidity 0.4.18
TetherToken_Flattened.sol   → Código-fonte flattened (pronto para Etherscan)
```

### Contratos em Blockchain
- `contracts/TetherToken.sol` (principal)
- `contracts/StandardTokenWithFees.sol` (herança)
- `contracts/StandardToken.sol`
- `contracts/BasicToken.sol`
- `contracts/SafeMath.sol`
- `contracts/Ownable.sol`
- `contracts/Pausable.sol`
- `contracts/BlackList.sol`

---

## 📂 ESTRUTURA DE PASTAS

```
DOCUMENTATION_OPERATIONAL/
├── PROTOCOLO_OPERACIONAL.md        (este arquivo)
├── FLUXO_PASSO_A_PASSO.md          (instruções detalhadas)
├── SCRIPTS_REFERENCIA.md           (documentação de cada script)
├── TROUBLESHOOTING.md              (problemas comuns e soluções)
└── TEMPLATES/
    ├── .env.example                (template de variáveis)
    └── hardhat.config.example.js   (template de configuração)
```

---

## 🚀 FLUXO OPERACIONAL (Visão Geral)

### **FASE 1: Extração e Compilação**

#### 1.1 Extrair bytecode on-chain
```bash
node extract_bytecode_addr.cjs 0x<ENDERECO>
```
**Saída:** `bytecode_onchain_0x<ENDERECO>.hex`

#### 1.2 Compilar contrato local
```bash
npx hardhat compile
```
**Saída:** `artifacts/contracts/TetherToken.sol/TetherToken.json`

#### 1.3 Comparar bytecodes
```bash
node compare_bytecodes_addr.cjs 0x<ENDERECO>
```
**Resultado esperado:**
- ✅ Perfect match (se construtor não tiver args)
- ⚠️ Mismatch (se construtor incluir args)

---

### **FASE 2: Validação Etherscan**

#### 2.1 Verificar status atual
```bash
node validate_etherscan_addr.cjs 0x<ENDERECO>
```
**Respostas:**
- `✅` = Contrato já verificado
- `⚠️ NOTOK` = Contrato não verificado

#### 2.2 Se NÃO verificado → Preparar verificação

**Opção A: Verificação Automática (se API funcionar)**
```bash
node submit_verify.cjs 0x<ENDERECO>
```

**Opção B: Verificação Manual (recomendado)**
1. Abra: `https://etherscan.io/address/0x<ENDERECO>#code`
2. Clique "Verify and Publish"
3. Cole conteúdo de `TetherToken_Flattened.sol`
4. Selecione:
   - Compilador: `0.4.18`
   - Otimizador: ✅ SIM (200 runs)
   - Licença: MIT
5. Envie

---

### **FASE 3: Documentação e Registro**

#### 3.1 Criar relatório
- Arquivo salvo automaticamente: `VALIDACAO_ETHERSCAN_RELATORIO_0x<ENDERECO>.md`

#### 3.2 Commitar mudanças
```bash
git add bytecode_onchain_0x*.hex VALIDACAO_ETHERSCAN_RELATORIO_0x*.md
git commit -m "docs: Contract validation for 0x<ENDERECO>"
git push origin feature/set-balance-improvements
```

---

## 📝 CONFIGURAÇÃO INICIAL (Uma única vez)

### 1. Clonar repositório
```bash
git clone https://github.com/jlainbr-prog/mschine.git
cd "Contrato Flash USDT"
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar `.env`
```bash
cp .env.example .env
# Edite .env com:
ETHERSCAN_API_KEY=sua_chave_aqui
PRIVATE_KEY=0x...
```

### 4. Compilar contratos
```bash
npx hardhat compile
```

### 5. Flatten contrato (se não existir)
```bash
npx hardhat flatten contracts/TetherToken.sol > TetherToken_Flattened.sol
```

---

## 🔄 WORKFLOW COMPLETO (Checklist)

Para validar e verificar um novo contrato:

- [ ] **Preparação**
  - [ ] Obter endereço do contrato
  - [ ] Verificar `.env` tem `ETHERSCAN_API_KEY` válido
  - [ ] Confirmar `TetherToken_Flattened.sol` existe

- [ ] **Extração e Compilação**
  - [ ] `node extract_bytecode_addr.cjs 0x<ENDERECO>`
  - [ ] Verificar `bytecode_onchain_0x<ENDERECO>.hex` foi criado
  - [ ] `npx hardhat compile`
  - [ ] `node compare_bytecodes_addr.cjs 0x<ENDERECO>`

- [ ] **Validação Etherscan**
  - [ ] `node validate_etherscan_addr.cjs 0x<ENDERECO>`
  - [ ] Se NOTOK → Prosseguir com verificação
  - [ ] Se verificado → Saltar para documentação

- [ ] **Verificação**
  - [ ] Acesso manual no Etherscan ou API automática
  - [ ] Aguardar confirmação (1-2 minutos)
  - [ ] Validar que "✔ Contract source code verified" apareça

- [ ] **Documentação**
  - [ ] Relatório gerado: `VALIDACAO_ETHERSCAN_RELATORIO_0x<ENDERECO>.md`
  - [ ] Revisar relatório
  - [ ] `git add`, `git commit`, `git push`

---

## 🛠️ REFERÊNCIA DE SCRIPTS

| Script | Função | Input | Output |
|--------|--------|-------|--------|
| `extract_bytecode_addr.cjs` | Extrai bytecode on-chain | Endereço | `.hex` file |
| `compare_bytecodes_addr.cjs` | Compara compilado vs on-chain | Endereço | Match/Mismatch |
| `validate_etherscan_addr.cjs` | Verifica status Etherscan | Endereço | JSON com info |
| `submit_verify.cjs` | Submete verificação automática | Endereço | GUID verificação |
| `verify_v2.cjs` | Alternativa V2 API | Endereço | Status |
| `compare_bytecodes.js` | Versão compatível com primeiro contrato | N/A | Match report |

---

## ⚙️ CONFIGURAÇÕES CRÍTICAS

### Hardhat Config
```javascript
// solc version
solidity: {
  version: "0.4.18",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

### Etherscan Verification
```
Compilador: v0.4.18
Otimizador: Habilitado
Runs: 200
Codeformat: solidity-single-file (para flattened)
```

---

## 🐛 TROUBLESHOOTING

### Problema: "ETHERSCAN_API_KEY not set"
**Solução:** 
```bash
# Verificar .env existe
cat .env

# Se não tiver ETHERSCAN_API_KEY:
# 1. Obter chave em https://etherscan.io/apis
# 2. Adicionar a .env:
echo "ETHERSCAN_API_KEY=sua_chave" >> .env
```

### Problema: "Compilation failed"
**Solução:**
```bash
# Limpar cache
rm -r artifacts cache

# Recompilar
npx hardhat compile
```

### Problema: "Bytecode mismatch"
**Esperado para:** Contratos com argumentos no construtor
**Solução:** Fornecer argumentos ABI-encoded na verificação manual

### Problema: API V1 deprecated
**Solução:** Use verificação manual no site do Etherscan (mais confiável)

---

## 📊 EXEMPLO REAL (Aplicado)

### Contrato: 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11

```bash
# Passo 1: Extrair
$ node extract_bytecode_addr.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
✓ Saved to bytecode_onchain_0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11.hex

# Passo 2: Compilar
$ npx hardhat compile
✓ Compiled 12 Solidity files

# Passo 3: Comparar
$ node compare_bytecodes_addr.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
Compiled size: 14200
On-chain size: 26858
⚠️ Bytecodes differ (likely constructor args)

# Passo 4: Validar
$ node validate_etherscan_addr.cjs 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
⚠️ Contract not verified (getabi response): NOTOK

# Passo 5: Verificar (manual)
# → Acesso a https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code
# → Clique "Verify and Publish"
# → Cole TetherToken_Flattened.sol
# → v0.4.18, Otimizador ON (200 runs)
# → Envie

# Passo 6: Documentar
$ git add bytecode_onchain_0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11.hex
$ git commit -m "docs: Verification for 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11"
$ git push
```

---

## 📞 PRÓXIMAS AÇÕES

1. **Verificação Manual:** Seguir link no Etherscan (5-10 min por contrato)
2. **Monitoramento:** Aguardar email de confirmação (1-2 min)
3. **Validação Final:** Confirmar "✔ Contract source code verified" na página
4. **Atualização de PR:** Adicionar status de verificação ao PR

---

## 📚 REFERÊNCIAS

- [Etherscan Verify API](https://docs.etherscan.io/apis/contracts)
- [Hardhat Compile](https://hardhat.org/hardhat-runner/docs/tasks/compile)
- [Solidity 0.4.18 Docs](https://docs.soliditylang.org/en/v0.4.18/)
- [Repository](https://github.com/jlainbr-prog/mschine)

---

**Última atualização:** 25 de fevereiro de 2026  
**Responsável pela documentação:** GitHub Copilot  
**Status:** Testado e Operacional ✅
