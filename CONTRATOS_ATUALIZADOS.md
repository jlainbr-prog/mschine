# Contratos Primários Atualizados - Status Final

Data: 2 de março de 2026

---

## 📑 Contratos Operacionais

### 1️⃣ FUSDT (Flash USDT)
- **Rede**: Ethereum + BSC (Binance Smart Chain)
- **Endereço Ethereum**: `0x419ecA43dB68E868E68d1aB460c8AC32523c7540`
- **Endereço BSC**: `0x419ecA43dB68E868E68d1aB460c8AC32523c7540`
- **Símbolo**: FUSDT
- **Decimals**: 18
- **Tipo**: ERC20 / BEP20
- **Status**: ✅ Ativo em repositório

### 2️⃣ Flash Arb (Contrato Auxiliar)
- **Rede**: Ethereum + BSC
- **Endereço Ethereum**: `0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11`
- **Endereço BSC**: `0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11`
- **Símbolo**: FLASH
- **Decimals**: 18
- **Tipo**: ERC20 / BEP20 (Contrato Flash Arbitrage)
- **Status**: ✅ Ativo em repositório

---

## 📂 Estrutura de Arquivos Preparada

### `mschine/blockchains/ethereum/assets/`
```
├── 0x419ecA43dB68E868E68d1aB460c8AC32523c7540/
│   ├── logo.png
│   └── info.json (com logo URL)
├── 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/
│   ├── logo.png
│   └── info.json (com logo URL)
```

### `mschine/blockchains/smartchain/assets/`
```
├── 0x419ecA43dB68E868E68d1aB460c8AC32523c7540/
│   ├── logo.png
│   └── info.json (com logo URL)
├── 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/
│   ├── logo.png
│   └── info.json (com logo URL)
```

### `artifacts/contracts/`
```
├── FlashArb.sol/
│   ├── FlashArb.json (ABI + bytecode)
│   ├── IERC20.json
│   └── IUniswapV2Pair.json
├── build-info/
│   └── solc-0_8_19-*.json (compilação completa)
```

---

## 🔗 URLs Verificadas

Todos os endereços abaixo agora possuem `logo` apontando para **ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q**

### Ethereum (Mainnet)
- ✅ https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json
- ✅ https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/info.json

### SmartChain (BSC)
- ✅ https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json
- ✅ https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/smartchain/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/info.json

### Logo
- ✅ ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q

---

## 🤖 Scripts Operacionais

### Bot Principal
- **Arquivo**: `scripts/multi-flash-arbbot.js`
- **Status**: ✅ Configurado com ambos contratos
- **Redes**: Ethereum + BSC
- **Modos**: One-shot (`SINGLE_CYCLE`) e contínuo

### Verificação de URLs
- **Arquivo**: `mschine/scripts/check-urls.js`
- **Status**: ✅ Monitoriza ambos contratos
- **Frequência**: Agendado a cada 1h via GitHub Actions

### Submissão de PRs
- **Arquivo**: `mschine/scripts/submit-final.js`
- **Status**: ✅ Configurado para TrustWallet + MetaMask
- **Contrato Padrão**: FUSDT (0x419ecA...)
- **Nota**: Para incluir Flash Arb em PRs, execute o script com endereço alternativo

---

## ✅ Validações Realizadas

| Item | Status | Detalhes |
|------|--------|----------|
| **Logo Adicionado** | ✅ | Campo `"logo"` em todos os info.json |
| **Assets em 2 Redes** | ✅ | Ethereum + BSC (ambos contratos) |
| **ABIs Presentes** | ✅ | FlashArb.json em artifacts/ |
| **Scripts Sincronizados** | ✅ | Bot, verificação, submissão |
| **Documentação Atualizada** | ✅ | SUBMISSION-GUIDE, check-urls |
| **URLs Funcionais** | ✅ | Testadas e validadas |

---

## 🔐 Próximos Passos

### 1. Verificação Etherscan
Para verificar ambos os contratos em Etherscan (usando a assinatura fornecida):

```bash
# Ethereum
https://etherscan.io/address/0x419ecA43dB68E868E68d1aB460c8AC32523c7540#code
https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code

# BSC
https://bscscan.com/address/0x419ecA43dB68E868E68d1aB460c8AC32523c7540#code
https://bscscan.com/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code
```

### 2. Submissão de PRs
```bash
# TrustWallet + MetaMask (FUSDT)
node mschine/scripts/submit-final.js

# Para submeter Flash Arb, edite CONFIG.address em submit-final.js
```

### 3. Integração em Carteiras
Importar via URL direto em MetaMask:
- FUSDT: https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json
- Flash Arb: https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11/info.json

---

## 📊 Resumo de Implementação

✅ **Contratos Primários**: 2 (FUSDT + Flash Arb)
✅ **Redes Suportadas**: 2 (Ethereum + BSC)
✅ **Assets Preparados**: 4 pastas (2 por contrato × 2 redes)
✅ **Scripts Operacionais**: 3 (Bot, verificação, PR)
✅ **Documentação**: Completa e atualizada
✅ **Logo**: Centralizado em IPFS (CID QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q)

---

## 🎯 Status: PRONTO PARA PRODUÇÃO

Todos os dois contratos foram atualizados e testados. Estrutura completa em repositório.
Basta executar scripts de submissão e aguardar aprovação em plataformas.
