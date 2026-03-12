# GUIA RÁPIDO - USDT Flash TRC20 TRON

## 🚀 Comece em 3 Passos

### Passo 1: Instalar Dependências
```bash
cd "USDT Flash TRC20 TRON"
npm install
```

### Passo 2: Solicitar TRX (se necessário)
```bash
node Scripts/request_trx.js TW6XkKvwZTF82YYbnRwXoop7ufwDuKDbrW nile
```

### Passo 3: Emitir Tokens
```bash
node Scripts/emit_custom.js 1000000000   # 1 bilhão
```

✅ Pronto! Tokens emitidos na carteira.

---

## 📋 Comandos Principais

| Ação | Comando |
|------|---------|
| **Emitir X tokens** | `node Scripts/emit_custom.js <quantidade>` |
| **Verificar saldo** | `node Scripts/check_balance.js` |
| **Solicitar TRX** | `node Scripts/request_trx.js <endereco> nile` |
| **Testar transferência** | `node Scripts/test_transfer.js` |
| **Deploy contrato** | `node Scripts/deploy.js` |

---

## 💡 Exemplos de Emissão

```bash
# 1 bilhão
node Scripts/emit_custom.js 1000000000

# 10 bilhões
node Scripts/emit_custom.js 10000000000

# 1 trilhão
node Scripts/emit_custom.js 1000000000000

# 500 bilhões
node Scripts/emit_custom.js 500000000000

# 100 trilhões
node Scripts/emit_custom.js 100000000000000
```

---

## 🔍 Verificação On-Chain

**Contrato**: `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp`  
**Link Nile**: https://nile.tronscan.org/contract/TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp/

Cole o endereço no Tronscan para verificar:
- Saldo total de tokens
- Histórico de transferências
- Transações de emissão
- Holders do token

---

## ⚙️ Mudando de Rede

Edite `tronbox.js`:

```javascript
// Para NILE (padrão - testnet)
const FULLNODE = 'https://nile.trongrid.io';

// Para SHASTA (outro testnet)
const FULLNODE = 'https://api.shasta.trongrid.io';

// Para MAINNET (produção - cuidado!)
const FULLNODE = 'https://api.trongrid.io';
```

Depois execute os scripts normalmente.

---

## 🆘 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| `Insufficient balance` | Execute `request_trx.js` |
| `CONNECTION_TIMEOUT` | Verifique endpoint em `tronbox.js` |
| `Invalid privateKey` | Verifique chave em `tronbox.js` (64 hex chars) |
| `Contract not found` | Verifique contrato em `deployment_result.json` |

---

## 📊 Resultado de Emissão

Após executar, você verá:

```
📋 Contrato: TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp
💰 Emitindo: 1000000000 tokens
🔢 Unidades (base): 1000000000000000
⏳ Processando emissão...
✅ Emissão enviada!
TX Hash: 0x...

📊 SALDOS ATUALIZADOS:
Recipient human: 1000000000 tokens
Owner human: 1000000000 tokens

✅ Resultado salvo em: Resultados/emission_1000000000_1706...json
```

---

## 📁 Arquivos Importantes

- `tronbox.js` - Configuração (edite aqui se mudar rede/chave)
- `Scripts/emit_custom.js` - Script principal para emissão
- `Resultados/` - Histórico de todas as emissões
- `Documentacao/README_EMISSAO.md` - Documentação completa

---

## 💾 Onde Encontrar Resultados

```
Resultados/
├── deployment_result.json        ← Deploy inicial
├── transfer_result.json          ← Primeira transferência
├── issue_result.json             ← Emissão 10B
├── issue_result_1trillion.json   ← Emissão 1T
└── emission_XXXXX_XXXXX.json     ← Novas emissões
```

Cada emissão cria um novo arquivo JSON com:
- Quantidade emitida
- Hash da transação
- Saldos atualizados
- Data/hora

---

## 🔐 Chave Privada

A chave privada está em `tronbox.js`:

```javascript
const PRIVATE_KEY = '2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27';
```

⚠️ **NUNCA** compartilhe esta chave!  
⚠️ **NUNCA** commite em repositório público!

---

## 🌐 Redes Disponíveis

| Rede | URL | Testnet? | Status |
|------|-----|----------|--------|
| Nile | https://nile.trongrid.io | ✅ Sim | ✅ Funcional |
| Shasta | https://api.shasta.trongrid.io | ✅ Sim | ✅ Funcional |
| Mainnet | https://api.trongrid.io | ❌ Não | ⚠️ Cuidado! |

---

## 🎯 Fluxo Padrão de Emissão

```
1. Verificar saldo de TRX
   └─> node Scripts/request_trx.js <endereco>

2. Emitir tokens
   └─> node Scripts/emit_custom.js <quantidade>

3. Verificar saldo
   └─> node Scripts/check_balance.js

4. Consultar resultado
   └─> Abrir arquivo em Resultados/emission_*.json
```

---

Pronto! Agora você tem um projeto completo e reutilizável.

Para documentação completa, leia: `Documentacao/README_EMISSAO.md`
