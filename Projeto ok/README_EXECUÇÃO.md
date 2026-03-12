# 📦 Projeto USDT - Contrato Flash
## Estrutura de Execução - Duas Modalidades

---

## **MODALIDADE 1️⃣: REMIX IDE (Arquivo Único)**

### 📁 Pasta: `1_REMIX_ARQUIVO_ÚNICO`
**Arquivo:** `TetherToken.sol`

### ✅ Como usar:
1. Acesse https://remix.ethereum.org
2. Crie um novo arquivo: `TetherToken.sol`
3. Copie **TODO** o conteúdo de `TetherToken.sol`
4. Cole no Remix
5. Compile com **Solidity 0.4.18**
6. Deploy via **Injected Provider (TrustWallet)**

### 📋 Parâmetros para Deploy:
```
_initialSupply:  1000000000000
_name:           Tether USD
_symbol:         USDT
_decimals:       6
```

### ⚙️ Operações disponíveis:
- `transfer()` - Transferir tokens
- `approve()` / `transferFrom()` - Aprovar e gastar allowance
- `issue()` - Emitir novos tokens (apenas owner)
- `redeem()` - Resgatar tokens (apenas owner)
- `pause()` / `unpause()` - Pausar/Retomar transferências
- `addBlackList()` - Blacklista endereço
- `destroyBlackFunds()` - Destruir fundos blacklistados
- `deprecate()` - Deprecar para novo contrato

---

## **MODALIDADE 2️⃣: HARDHAT / CLI (Arquivos Modulados)**

### 📁 Pasta: `2_HARDHAT_MODULADO`

**Arquivos:**
```
├── SafeMath.sol                  (Biblioteca de segurança)
├── BasicToken.sol               (Token básico ERC20)
├── StandardToken.sol            (Token padrão com allowances)
├── Ownable.sol                  (Controle de proprietário)
├── Pausable.sol                 (Funcionalidade de pausa)
├── BlackList.sol                (Sistema de blacklist)
├── StandardTokenWithFees.sol    (Token com taxas)
└── TetherToken.sol              (Contrato principal)
```

### ✅ Como usar com Hardhat:

**1. Setup do projeto:**
```bash
npm install -D hardhat @nomiclabs/hardhat-ethers ethers chai
npx hardhat init
```

**2. Copiar arquivos:**
- Copie todos os 8 arquivos `.sol` para a pasta `contracts/`

**3. Compilar:**
```bash
npx hardhat compile
```

**4. Deploy em testnet (Sepolia):**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**5. Rodar testes:**
```bash
npm test
```

---

## 🔄 Fluxo de Herança Modulado

```
SafeMath
   ↓
BasicToken (ERC20Basic)
   ↓
StandardToken (ERC20, BasicToken)
   ↓
StandardTokenWithFees (StandardToken, Ownable)
   ↓
TetherToken (Pausable, StandardTokenWithFees, BlackList)
```

---

## 📊 Comparação das Modalidades

| Recurso | Remix (1️⃣) | Hardhat (2️⃣) |
|---------|-----------|------------|
| Interface | Visual | CLI |
| Arquivo único | ✅ Sim | ❌ Não |
| Imports resolvidos | ✅ Automático | ✅ Sim |
| Testes | ⚠️ Manual | ✅ Automatizado |
| Deploy | 🔗 Carteira | 🔑 Scripts |
| Melhor para | Prototipagem rápida | Produção |

---

## 🔐 Segurança

✅ **SafeMath**: Proteção contra overflow/underflow
✅ **Pausable**: Congelamento de transferências
✅ **BlackList**: Bloqueio de endereços
✅ **Ownable**: Controle de acesso por proprietário
✅ **Deprecation**: Upgrade seguro de contrato

---

## 📝 Notas Importantes

- **Solidity 0.4.18**: Versão exata necessária
- **Sem constructor**: Usa função nomeada `TetherToken()`
- **Sem emit**: Eventos disparados sem `emit` keyword
- **SafeMath obrigatório**: Todas operações críticas usam `.add()`, `.sub()`

---

## 🚀 Próximos Passos

1. **Teste no Remix** (Modalidade 1) para validação rápida
2. **Deploy em testnet** com Hardhat (Modalidade 2)
3. **Auditoria profissional** recomendada antes de mainnet
4. **Mainnet deployment** após revisão completa

---

**Criado:** Janeiro 2026
**Versão:** 1.0
**Status:** Pronto para deploy ✅
