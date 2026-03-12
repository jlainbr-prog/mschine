# TRC20 USDT∞ Mainnet Deploy v2.0

🚀 Contrato Solidity 0.8.26 para TRON Blockchain

## ⚡ Início Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
npm install
```

### Execução

```bash
npm start
```

Ou directe:

```bash
node scripts/config_deploy_mainnet.js
```

## 📋 Estrutura do Projeto

```
Projeto ok/
├── contratos/                    # Arquivos Solidity
│   └── USDTInfinitaTRC20Mainnet.sol
├── scripts/                      # Scripts de deployment
│   ├── config_deploy_mainnet.js  # Configuração (sempre execute primeiro)
│   └── deploy_mainnet_v2.js      # Deploy automático
├── docs/                         # Documentação completa
│   ├── COMECE_AQUI.txt
│   ├── CHECKLIST_DEPLOY.txt
│   ├── PARAMETROS_CONVERSAO.txt
│   ├── GUIA_DEPLOY_MAINNET_V2.txt
│   └── [mais arquivos]
├── resultados/                   # Outputs (JSONs de deploy)
├── .env                          # Variáveis de ambiente (PRIVADO)
├── .env.example                  # Template do .env
├── package.json                  # Dependências
└── CONFIGURACAO_RAPIDA.txt      # Guia de setup
```

## 🔐 Configuração Private Key

A private key está salva em `.env` e carregada automaticamente:

```bash
# Arquivo: .env
PRIVATE_KEY=2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27
RECIPIENT_ADDRESS=TYXW15TEZPtZjGmczmewci95xarNFimYnf
NETWORK=mainnet
RPC_ENDPOINT=https://api.tron.network
```

⚠️ **NUNCA compartilhe `.env`** - está no `.gitignore`

## 🚀 Como Fazer Deploy

### Passo 1: Instalação
```bash
npm install
```

### Passo 2: Configuração
```bash
npm start
```

O script:
- ✅ Carrega private key de `.env`
- ✅ Carrega endereço receptor de `.env`
- ✅ Pede apenas: Rede (M/T) e Supply
- ✅ Valida todos os parâmetros
- ✅ Salva configuração em `resultados/`

### Passo 3: Deploy
```bash
node scripts/deploy_mainnet_v2.js [PRIVATE_KEY] [RECIPIENT] [SUPPLY] [RPC_URL]
```

(Ou copie o comando que o script gera)

## 📊 Parâmetros Comuns

### Supply (veja `docs/PARAMETROS_CONVERSAO.txt`)
- 1M USDT = `1000000000000`
- 10M USDT = `10000000000000`
- 50M USDT = `50000000000000`
- 100M USDT = `100000000000000`
- **161M USDT = `161000000000000`** ⭐

### Redes
- **Mainnet**: Produção real (tokens reais!)
- **Testnet**: Testes em Shasta (tokens fictícios)

## 📄 Documentação

Leia os arquivos em `docs/`:

1. **COMECE_AQUI.txt** - Início rápido (5 min)
2. **CHECKLIST_DEPLOY.txt** - 40 verificações pré-deploy
3. **PARAMETROS_CONVERSAO.txt** - Tabelas de supply
4. **GUIA_DEPLOY_MAINNET_V2.txt** - Passo-a-passo detalhado
5. **STATUS_NOVO_CONTRATO_V2.md** - Detalhes técnicos
6. **RELATORIO_EMISSAO.txt** - Histórico e dados

## ✅ Especificações do Token

| Propriedade | Valor |
|---|---|
| Nome | Tether USD Infinito TRC |
| Símbolo | USDT∞ |
| Decimais | 6 |
| Padrão | TRC20 (ERC20 compatível) |
| Compiler | Solidity 0.8.26 |
| Supply | Configurável (padrão 161M) |

## 🔒 Segurança

- ✅ Sem owner (imutável)
- ✅ Sem pausa
- ✅ Sem taxa de transferência
- ✅ Sem blacklist
- ✅ Sem upgrade

## 📞 Suporte

Para dúvidas:
- Consulte `docs/GUIA_DEPLOY_MAINNET_V2.txt`
- Verifique `CHECKLIST_DEPLOY.txt`
- Veja `PARAMETROS_CONVERSAO.txt` para valores

## 📝 Verificação

Após deploy:

1. **Arquivo de resultado**: `resultados/deploy_result_*.json`
2. **TronScan**: https://tronscan.org (busque pelo address)
3. **Carteira**: Adicione token manualmente à sua carteira

---

**Versão**: 2.0  
**Data**: Fevereiro 2026  
**Rede Padrão**: TRON Mainnet
