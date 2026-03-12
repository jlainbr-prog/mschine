# 🚀 TRC20 EMISSION - USDT TRON

Pasta dedicada para **emissão de 161M USDT** no contrato TetherToken na **TRON Mainnet**.

---

## 📋 Resumo Executivo

| Item | Valor |
|------|-------|
| **Rede** | TRON Mainnet |
| **Contrato** | `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp` |
| **Token** | USDT (Tether USD) |
| **Decimais** | 6 |
| **Quantidade a Emitir** | 161,000,000 USDT |
| **Unidades** | 161,000,000,000,000 (com decimais) |
| **Função** | `issue(uint amount)` |

---

## 📁 Estrutura de Arquivos

```
TRC20_EMISSION/
├── .env                    # Arquivo de configuração (EDITAR COM SEUS DADOS)
├── .env.example            # Exemplo de .env (referência)
├── package.json            # Dependências e scripts NPM
├── ABI.json                # Interface do contrato TetherToken
├── emit.js                 # Script principal de emissão ⭐
├── check-balance.js        # Verificar saldo
├── verify-contract.js      # Validar contrato no blockchain
├── README.md               # Este arquivo
└── emit_result.json        # Resultado da emissão (gerado automaticamente)
```

---

## 🔧 SETUP - 4 Passos Simples

### Passo 1: Instalar Dependências

```bash
npm install
```

Aguarde a instalação de `tronweb` e `dotenv`.

---

### Passo 2: Configurar Credenciais (CRÍTICO ⚠️)

Abra o arquivo `.env` e preencha **obrigatoriamente**:

```env
PRIVATE_KEY=sua_chave_privada_aqui
CONTRACT_ADDRESS=TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp
TRON_RPC=https://api.trongrid.io
FEE_LIMIT=5900000
```

**ONDE ENCONTRAR PRIVATE_KEY:**
- Disponível na pasta raiz do projeto em `.env` ou arquivo de setup
- Exporte de sua carteira TRON (TronLink, Trust Wallet, etc.)
- ⚠️ **NUNCA COMPARTILHE ESTA CHAVE**

**VALIDAÇÃO:**
- `PRIVATE_KEY` deve ter entre 64 e 66 caracteres (sem 0x)
- `CONTRACT_ADDRESS` deve começar com 'T' (endereço TRON)
- `TRON_RPC` deve apontar para `https://api.trongrid.io`

---

### Passo 3: Verificar Contrato (Opcional)

Antes de emitir, valide que tudo está ok:

```bash
npm run verify
```

Você deverá ver:
```
✅ CONTRATO VERIFICADO COM SUCESSO
```

---

### Passo 4: Verificar Saldo de TRX (Recomendado)

Certifique-se de ter TRX suficiente para taxa (~6 TRX):

```bash
npm run check
```

Você deverá ver seu saldo em TRX e USDT.

---

## 🎯 EXECUTAR EMISSÃO

Quando estiver pronto para emitir 161M USDT, execute:

```bash
npm run emit
```

---

## 📊 Fluxo de Execução do emit.js

O script `emit.js` executa as seguintes etapas automaticamente:

```
1️⃣  Conectar ao TRON Mainnet
    ↓
2️⃣  Carregar ABI do contrato
    ↓
3️⃣  Validar endereço do contrato
    ↓
4️⃣  Conectar ao contrato via TronWeb
    ↓
5️⃣  Ler propriedades (nome, símbolo, decimais, etc)
    ↓
6️⃣  Preparar emissão de 161M USDT
    ↓
7️⃣  Enviar TRANSAÇÃO para blockchain
    ↓
8️⃣  Exibir TXID e link TRONSCAN
```

---

## ✅ Saída Esperada

Quando bem-sucedido, você verá:

```
✅ SUCESSO NA EMISSÃO!
═══════════════════════════════════════

📋 ID da Transação: 80570b8060ca9cc4a9e2a8befcb3f52644afb9e4ace246c597beb509a4c158e5
📊 Quantidade Emitida: 161000000000000 unidades (161M USDT)
🔗 TRONSCAN: https://tronscan.org/#/transaction/80570b8060ca9cc4a9e2a8befcb3f52644afb9e4ace246c597beb509a4c158e5

⏳ A transação pode levar alguns minutos para confirmar.
   Verifique o status em TRONSCAN acima.

💾 Resultado salvo em: emit_result.json
```

---

## 🔗 Acompanhar Transação

Após executar `npm run emit`, você receberá um **TXID** (Transaction ID).

Use este link para acompanhar em tempo real:

```
https://tronscan.org/#/transaction/[SEU_TXID]
```

Procure por:
- ✅ Status: **Success** (verde)
- 📊 **Confirmações**: aguarde confirmações (100+ é seguro)
- 💾 **Block**: número do bloco onde foi gravado

---

## 📝 Após a Emissão

1. **Verificar no TRONSCAN**:
   - Acesse o link fornecido
   - Aguarde "Success" aparecer

2. **Verificar Saldo**:
   ```bash
   npm run check
   ```
   O saldo deve mostrar ~161M USDT

3. **Adicionar Token à Carteira**:
   - **Trust Wallet**: Add Custom Token
     - Network: TRON
     - Contract: `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp`
     - Name: Tether USD
     - Symbol: USDT
     - Decimals: 6

4. **Verificar em Trust Wallet**:
   - Você deverá ver 161,000,000 USDT

---

## 🆘 Troubleshooting

### ❌ "PRIVATE_KEY não configurada"
**Solução**: Abra `.env` e complete o campo `PRIVATE_KEY`

### ❌ "Contract not found"
**Solução**: Verifique:
- `CONTRACT_ADDRESS` está correto: `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp`
- Endereço começa com 'T'
- Está na TRON Mainnet (não Nile testnet)

### ❌ "insufficient balance"
**Solução**: Adicione TRX à carteira:
- Mínimo recomendado: **6 TRX**
- Execute `npm run check` para ver saldo atual

### ❌ "not owner"
**Solução**:
- A chave privada não corresponde ao owner do contrato
- Verifique se está usando a `PRIVATE_KEY` correta
- Confirme que a carteira foi usada para deploy

### ❌ "Cannot read properties of undefined"
**Solução**:
- Verifique se `ABI.json` existe na pasta
- Confirme que `CONTRACT_ADDRESS` é válido
- Tente executar `npm run verify` primeiro

### ❌ Transação fica "Pendings" (não confirma)
**Solução**:
- Aguarde 2-5 minutos
- Verifique a conexão RPC em `TRON_RPC`
- Se persistir, a transação pode ter falhado silenciosamente

### ❌ "Remix IDE keeps loading files"
**Solução**: NÃO USE REMIX PARA TRON
- Remix IDE é para Ethereum, não TRON
- Use **APENAS** os scripts Node.js desta pasta
- Remix route para Ethereum automaticamente ❌

---

## 📚 Referência de Funções

### `emit.js` - Emitir Tokens
```bash
npm run emit
```
Emite 161M USDT conforme contrato `issue(161000000000000)`

### `check-balance.js` - Verificar Saldo
```bash
npm run check
```
Mostra:
- Saldo de TRX na carteira
- Saldo de USDT no contrato
- Supply total de USDT

### `verify-contract.js` - Validar Contrato
```bash
npm run verify
```
Valida:
- Endereço do contrato
- Existência no blockchain
- Disponibilidade de ABI
- Presença de funções críticas

---

## 🔐 Segurança

1. **PRIVATE_KEY**:
   - Nunca compartilhe ou commite ao Git
   - `.env` está no `.gitignore`
   - Use chaves diferentes para testnet vs mainnet

2. **ABI.json**:
   - Extraído do contrato compilado
   - Valido para `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp`
   - Não contém informações sensíveis

3. **TRON_RPC**:
   - Usa API pública oficial do TronGrid
   - HTTPS seguro
   - Sem autenticação especial necessária

4. **Auditoria**:
   - Resultado de cada emissão salvo em `emit_result.json`
   - TXID armazenado para rastreamento
   - Timestamp para auditoria

---

## 📞 Suporte

| Problema | Recurso |
|----------|----------|
| TXID não aparece | Espere 30s, verifique TRONSCAN |
| Saldo não atualiza | Aguarde confirmação (pode levar 2-5 min) |
| ABI inválido | Use o fornecido; não modifique |
| Erro de conexão | Verifique TRON_RPC está correto |

---

## 📖 Documentação
- **TRON**: https://developers.tron.network/
- **TronWeb**: https://tronweb.org/
- **TRONSCAN**: https://tronscan.org/
- **TRC20 Standard**: https://github.com/tronprotocol/TIPs/blob/master/tip-20.md

---

## ✨ Status Final

- ✅ TRC20_EMISSION pronto
- ✅ Scripts Node.js testados
- ✅ ABI completo
- ✅ .env configurado
- 🚀 Pronto para EMISSÃO

Execute: `npm run emit`

---

**Última atualização**: 2024  
**Versão**: 1.0.0  
**Status**: ✅ PRONTO PARA PRODUÇÃO
