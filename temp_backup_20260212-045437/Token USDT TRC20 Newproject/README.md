# USDT∞ TRC-20 Token – Novo Projeto

Token infinito sem expiração para rede TRON (Testnet + Mainnet).

## 📍 Estrutura do Projeto

```
Token USDT TRC20 Newproject/
├── contracts/
│   └── USDTInfinitaTRC20_v2.sol      (contrato principal)
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy.js                   (deploy automático)
├── build/                            (gerado após compilar)
├── tronbox.js                        (⚠️ CONFIGURE AQUI)
├── package.json
├── .gitignore
├── 00_COMECE_AQUI.txt               (leia primeiro!)
├── QUICK_START.md                    (1 hora para token vivo)
├── README.md                         (este arquivo)
└── [outros arquivos de documentação]
```

## 🚀 Começar em 1 Hora

### 1️⃣ Leia Primeiro
```
Abra: 00_COMECE_AQUI.txt
Tempo: 5 minutos
```

### 2️⃣ Configure
```
Abra: tronbox.js
Cole sua chave privada nas linhas 4 e 10 (64 caracteres)
Salve: Ctrl+S
```

### 3️⃣ Compile
```bash
tronbox compile
```

### 4️⃣ Deploy em Testnet
```bash
tronbox migrate --network shasta --reset
```

### 5️⃣ Teste
```
TronLink > Assets > + > Custom > Cole endereço do contrato
Seu saldo: 1.000.000 USDT∞ ✅
```

## 📚 Documentação

- **00_COMECE_AQUI.txt** - Visão geral visual (LEIA PRIMEIRO!)
- **QUICK_START.md** - 1 hora até token vivo
- **SUMARIO_EXECUTIVO.md** - Visão geral
- **README_DEPLOYMENT.md** - Guia completo
- **FAQ_DICAS.md** - Perguntas & Respostas
- **INDICE_DE_ARQUIVOS.md** - Mapa visual

## 🔧 Requisitos

- Node.js >= 14
- TronBox >= 4.4.0
- TronLink (carteira)
- TRX para pagar gas

## 💎 Funcionalidades

✅ ERC20 Padrão (Transfer, Approve, etc)
✅ Pause/Unpause
✅ BlackList
✅ Issue/Redeem
✅ Deprecate (upgrade)

## ⚠️ CRÍTICO

```
CHAVE PRIVADA:
- Arquivo: tronbox.js (linhas 4, 10)
- NUNCA compartilhe
- NUNCA commite no Git
- FAÇA 2+ backups
```

## 🎯 Próximos Passos

1. Leia 00_COMECE_AQUI.txt
2. Configure tronbox.js
3. Execute `tronbox compile`
4. Execute `tronbox migrate --network shasta --reset`
5. Teste no TronLink

**Tempo: ~55 minutos até token vivo!**

## 📞 Dúvidas?

Consulte FAQ_DICAS.md ou README_DEPLOYMENT.md

---

**Data:** 18 de janeiro de 2026
**Status:** ✅ Pronto para desenvolvimento
**Versão:** 1.0
