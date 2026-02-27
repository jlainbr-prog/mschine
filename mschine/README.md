# mschine — 3 Opções de Teste com Suas Credenciais

## Setup Rápido

```powershell
cd "mschine"
npm install tronweb --legacy-peer-deps
```

Depois escolha UMA das 3 opções abaixo:

---

## 🟦 Opção 1: TRON Testnet (Recomendado ⭐)

**Não precisa API key. Funciona agora.**

```powershell
npm run test:tron
```

- Conecta ao TRON Shasta testnet  
- Verifica seu saldo em TRX
- Se saldo baixo, obtenha grátis: https://shasta.tronscan.org/#/transfer

---

## 🟦 Opção 2: RPC Customizado

**Se tiver seu próprio nó ou RPC pago.**

1. Abra `mschine/.env`
2. Configure:
   ```
   CUSTOM_RPC_ENDPOINT=https://seu-rpc-aqui.com
   ```
3. Execute:
   ```powershell
   npm run test:custom-rpc
   ```

Exemplos:
- Seu nó local: `http://localhost:8545`
- Infura com key: `https://mainnet.infura.io/v3/YOUR_KEY`
- Alchemy com key: `https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY`

---

## 🟦 Opção 3: Infura ou Alchemy API Keys

**Gratuito com limitações ou pago sem limites.**

### Infura:
1. Crie conta: https://www.infura.io/
2. Crie projeto → pegue API Key
3. Configure em `mschine/.env`:
   ```
   INFURA_API_KEY=seu_api_key
   ```
4. Execute:
   ```powershell
   npm run test:api-keys
   ```

### Alchemy:
1. Crie conta: https://www.alchemy.com/
2. Crie app Ethereum Mainnet → pegue API Key
3. Configure em `mschine/.env`:
   ```
   ALCHEMY_API_KEY=seu_api_key
   ```
4. Execute:
   ```powershell
   npm run test:api-keys
   ```

---

## 📁 Estrutura

(ajustada depois de fevereiro‑2026 para incluir metadados de token: `blockchains/`, `token-lists/`, etc.)


```
mschine/
├── .env                    ← Configurações (PRIVATE_KEY + opções)
├── package.json            ← npm scripts
├── scripts/
│   ├── mint-tron.js       ← Teste Opção 1
│   ├── mint-custom-rpc.js ← Teste Opção 2
│   ├── mint-api-keys.js   ← Teste Opção 3
│   └── ...
├── GUIA_3_OPCOES.txt      ← Guia detalhado
└── README.md              ← Este arquivo
```

---

## Credenciais Carregadas

- **PRIVATE_KEY**: `2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27`
- **Chave para wallet**: Sua chave TRONLINK

---

## Qual Opção Escolher?

| Opção | Setup | Custo | Velocidade | Recom. |
|-------|-------|-------|-----------|--------|
| 1. TRON Testnet | 2 min | Grátis | Rápido | ⭐ SIM |
| 2. Custom RPC | 5 min | Varia | Muito rápido | Se tiver RPC |
| 3. API Keys | 10 min | Grátis/Pago | Rápido | Para produção |

**Para teste agora**: Escolha Opção 1 (TRON Testnet)  
**Para Ethereum mainnet**: Escolha Opção 2 ou 3

---

## Troubleshooting

**npm: comando não encontrado**
- Node.js não está instalado ou não está no PATH
- Reinstale Node: https://nodejs.org/

**ECONNREFUSED ao testar**
- RPC está indispoível ou bloqueado
- Tente outra opção

**Timeout esperando resposta**
- RPC sobrecarregada
- Aguarde alguns minutos e tente novamente

---

Pronto? Execute:

```powershell
npm run test:tron
```
