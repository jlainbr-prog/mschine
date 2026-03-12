# Submissão de PRs - Instruções Finais

## 🎯 Contratos Primários Prontos

- ✅ **FUSDT** (0x419ecA43dB68E868E68d1aB460c8AC32523c7540)
- ✅ **Flash Arb** (0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11)

---

## 📤 Submeter PRs para TrustWallet + MetaMask

### Comando Padrão (FUSDT)
```bash
cd mschine
node scripts/submit-final.js
```

Isto criará PRs em:
- **TrustWallet/assets** (BSC token FUSDT)
- **MetaMask/contract-metadata** (Ethereum metadata)

### Para Submeter Flash Arb também

Edite `mschine/scripts/submit-final.js` e altere:

```javascript
const CONFIG = {
    address: '0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11',  // MUDE PARA ISTO
    symbol: 'FLASH',                                          // MUDE PARA ISTO
    myGithubUser: 'jlainbr-prog'
};
```

Depois execute novamente:
```bash
node scripts/submit-final.js
```

---

## 🔗 Status de URLs

Verifique que ambos contratos estão acessíveis:

```bash
node scripts/check-urls.js
```

Esperado: Todos "200 OK" para ambos os `info.json` (Ethereum + BSC).

---

## ✅ Verificação Etherscan

Consulte [ETHERSCAN_VERIFICATION_GUIDE.md](ETHERSCAN_VERIFICATION_GUIDE.md) para instruções de verificação em:
- **Etherscan** (Ethereum)
- **BscScan** (BSC)

---

## 📊 Resumo dos 2 Contratos

| Aspecto | FUSDT | Flash Arb |
|---------|-------|-----------|
| **Endereço Ethereum** | 0x419ecA... | 0xDCa62E... |
| **Endereço BSC** | 0x419ecA... | 0xDCa62E... |
| **Símbolo** | FUSDT | FLASH |
| **Decimals** | 18 | 18 |
| **Logo** | ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q | ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q |
| **Info.json** | ✅ Assets prontos | ✅ Assets prontos |
| **ABI** | ✅ Disponível | ✅ FlashArb.json |
| **PR Automática** | ✅ Configurada | ℹ️ Executar script 2x |

---

## 🚀 Próximos Passos

1. Execute `submit-final.js` para FUSDT
2. Aguarde aprovação em TrustWallet + MetaMask
3. Edite `CONFIG` e execute novamente para Flash Arb
4. Verifique em Etherscan/BscScan
5. Logo aparecerá em carteiras após merge

---

**Status Final**: ✅ Ambos contratos prontos para operação completa
