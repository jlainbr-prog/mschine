# USDT∞ TRC-20 – Guia Completo de Deployment

## 📋 Índice
1. [O que você vai precisar](#o-que-você-vai-precisar)
2. [Preparação Inicial](#preparação-inicial)
3. [Compilação](#compilação)
4. [Deployment](#deployment)
5. [Testes](#testes)
6. [Troubleshooting](#troubleshooting)

---

## O que você vai precisar

### Hardware/Software
- ✅ Computador com acesso à internet
- ✅ Node.js v14+ (já instalado no seu sistema)
- ✅ TronBox v4.4.0+ (já instalado)
- ✅ Editor de texto (VS Code, Notepad++, etc)

### Criptomoedas/Redes
- ✅ Carteira TronLink (extensão Chrome)
- ✅ 30 TRX em sua carteira (para pagar gas/energy em testnet)
- ✅ Acesso à rede Shasta (testnet) ou MainNet (produção)

### Arquivos do Projeto
```
usdt-trc20/
├── contracts/
│   └── USDTInfinitaTRC20_v2.sol  (contrato principal)
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy.js                (script de deploy)
├── build/                         (gerado automaticamente)
├── tronbox.js                     (configuração)
└── README.md                      (este arquivo)
```

---

## Preparação Inicial

### 1️⃣ Criar Carteira TronLink

1. Abra **Chrome** > **3 pontinhos** > **Mais ferramentas** > **Extensões**
2. Pesquise "TronLink" e adicione
3. Clique no ícone da extensão > **Create Wallet**
4. **Anote as 12 palavras secretas em papel** (NUNCA perca!)
5. Crie uma senha segura
6. Clique no ícone > copie seu endereço (começa com `T`)

### 2️⃣ Adicionar TRX na Carteira

**Testnet (Shasta):**
- Acesse: https://www.trongrid.io/shasta
- Cole seu endereço TronLink
- Clique "Request 10000 TRX" (grátis para testes)

**Mainnet:**
- Compre TRX em exchange (Binance, OKX, Mercado Bitcoin, etc)
- Transfira para seu endereço TronLink (rede TRC-20)

### 3️⃣ Exportar Chave Privada

**⚠️ CUIDADO! Guarde em segurança!**

1. Abra **TronLink** > ícone da carteira
2. Clique em **Export Private Key**
3. Insira sua senha
4. Copie a chave (64 caracteres hexadecimais)
5. Cole no arquivo **tronbox.js** (onde diz `COLE_SUA_CHAVE_PRIVADA_AQUI`)

---

## Compilação

### Compilar o Contrato

```bash
# Abra o terminal na pasta do projeto
cd usdt-trc20

# Compile
tronbox compile
```

**Esperado:**
```
✔ Compiled successfully using:
   - solc: 0.8.26+commit...

Compiling USDTInfinitaTRC20.sol...
✓ USDTInfinitaTRC20.sol
```

Se houver erro, verifique:
- ✅ Node.js instalado: `node -v`
- ✅ TronBox instalado: `tronbox version`
- ✅ Sintaxe do contrato (linha e coluna do erro)

---

## Deployment

### Deploy em TESTNET (Shasta) – Recomendado Primeiro

```bash
tronbox migrate --network shasta --reset
```

**Esperado:**
```
Starting migrations...
======================

2_deploy.js
================================================
Iniciando Deploy do USDT∞ TRC-20
================================================
Suprimento inicial: 1000000 USDT∞
...

✅ Deploy realizado com sucesso!
📍 Endereço do contrato: TRxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Copie este endereço!** Você vai usar para:
- Adicionar token à carteira
- Listar no SunSwap
- Fazer transferências

### Deploy em MAINNET (Produção) – Após Testar

```bash
tronbox migrate --network mainnet --reset
```

**⚠️ AVISO IMPORTANTE:**
- Uma vez deployado em mainnet, é **PERMANENTE**
- Custa TRX real (não é grátis)
- Certifique-se de ter testado em Shasta primeiro

---

## Testes

### Adicionar Token à Carteira TronLink

1. Abra **TronLink** > aba **Assets**
2. Clique no **+** (add token)
3. Escolha **Custom Token**
4. Cole o endereço do contrato
5. Clique **Next** > **Add**
6. Seu saldo (1.000.000 USDT∞) aparece!

### Testar Transferência

1. Em **TronLink**, clique **Send**
2. Cole endereço de um amigo
3. Digite uma quantidade (ex: 1)
4. Clique **Confirm**
5. Aguarde a confirmação (1-2 min)
6. Verifique o status: **SUCCESS**

### Consultar Saldo via Console

```bash
tronbox console --network shasta
```

```javascript
> const token = await USDTInfinitaTRC20.deployed()
> const bal = await token.balanceOf("seu_endereco_aqui")
> bal.toString()
'1000000000000'  // 1 milhão com 6 decimais
```

---

## Operações Administrativas

### Emitir Novos Tokens (aumentar suprimento)

```javascript
const token = await USDTInfinitaTRC20.deployed()
await token.issue(web3.utils.toWei("100000", "ether"))  // Emite 100k tokens
```

### Resgatar Tokens (diminuir suprimento)

```javascript
await token.redeem(web3.utils.toWei("50000", "ether"))  // Resgata 50k tokens
```

### Pausar/Despausar

```javascript
await token.pause()     // Para todas as transferências
await token.unpause()   // Retoma as transferências
```

### Adicionar/Remover da BlackList

```javascript
await token.addBlackList("endereco_da_pessoa")
await token.removeBlackList("endereco_da_pessoa")
```

### Destruir Fundos Censurados (IRREVERSÍVEL!)

```javascript
await token.destroyBlackFunds("endereco_censurado")  // Remove tokens permanentemente
```

---

## Listar em DEX (SunSwap)

### Criar Par de Trading

1. Acesse: https://sunswap.com
2. Clique **Pool** > **Create Pair**
3. **Token A:** TRX (padrão)
4. **Token B:** Custom > cole endereço do contrato > Import
5. **Quantidade:** 
   - Token A: 100 TRX (ou mais)
   - Token B: 10.000 USDT∞ (ou mais)
6. Clique **Supply** > Aprove > Confirm (paga gas)
7. **Pronto!** Qualquer pessoa pode comprar/vender

### Verificar Volume

- Acesse: https://sunswap.com/swap
- Procure o símbolo **USDT∞**
- Veja o gráfico de preço e volume

---

## Optimization (Energy - Pagar menos Gas)

### Alugar Energy para Economizar

1. Acesse: https://tronlending.org
2. Alugue 1.000+ Energy
3. Custa ~5 TRX por 1 dia
4. Pode fazer ~100 transfers sem queimar TRX

---

## Backup (MUITO IMPORTANTE!)

### Anotar e Guardar:

1. **12 palavras secretas** (seed) - em papel guardado
2. **Endereço do contrato** - em arquivo de texto
3. **Chave privada** - em 2 pen-drives diferentes
4. **ABI do contrato** - em arquivo JSON (`build/contracts/USDTInfinitaTRC20.json`)

**Perdeu a seed = Perdeu tudo para sempre!**

---

## Troubleshooting

### ❌ Erro: "permission denied" ou "command not found"

```bash
# Solução: Use npm com caminho absoluto (Windows)
"C:\Program Files\nodejs\npm.cmd" install -g tronbox

# Ou use cmd.exe diretamente
cmd /c npm install -g tronbox
```

### ❌ Erro: "No matching version" para Solidity

```bash
# Solução: Force compilador específico
tronbox compile --compiler-version 0.8.26
```

### ❌ Erro: "Invalid private key"

- Verifique se tem 64 caracteres
- Remova espaços extras
- Certifique-se que é hexadecimal (0-9, A-F)

### ❌ Erro: "Insufficient balance"

- Precisa de ~50 TRX para deploy + gas
- Em testnet, pegue TRX grátis em https://www.trongrid.io/shasta
- Em mainnet, compre TRX

### ❌ Contrato aparece mas não funciona

- Verifique se compilou sem erros: `tronbox compile`
- Verifique endereço do contrato está correto
- Tente re-adicioná-lo à carteira TronLink

---

## Próximos Passos

✅ **Testnet completo?** → Deploy em **Mainnet**
✅ **Mainnet ativo?** → Liste em **DEX (SunSwap)**
✅ **DEX pronto?** → Publique em **CoinGecko** (grátis)
✅ **Lá!** → Comece a crescer a comunidade

---

## Documentação Oficial

- 🔗 [TronBox Docs](https://tronbox.io)
- 🔗 [Solidity 0.8 Docs](https://docs.soliditylang.org/en/v0.8.26/)
- 🔗 [TRON Network](https://tron.network)
- 🔗 [SunSwap DEX](https://sunswap.com)

---

**Sucesso! 🚀 Seu token infinito está pronto!**

*Dúvidas? Verifique o arquivo `tronbox.js` e `USDTInfinitaTRC20_v2.sol`*
