# USDT∞ TRC-20 – FAQ & Dicas Práticas

## ❓ Perguntas Frequentes

### P: Por quanto tempo meu token vai funcionar?
**R:** Para sempre! Ele é "infinito" (sem expiração, sem cap de suprimento). Desde que não depreciar para outro contrato, continua funcionando eternamente.

### P: Qual a diferença entre Testnet e Mainnet?
**R:**
- **Testnet (Shasta):** Ambiente de teste, TRX grátis, sem risco real
- **Mainnet:** Ambiente de produção, custa TRX real, permanente

**Sempre teste em Testnet primeiro!**

### P: Como deposito TRX em minha carteira?
**R:**
- **Testnet:** https://www.trongrid.io/shasta (grátis)
- **Mainnet:** Compre em exchange (Binance, OKX, etc) e transfira

### P: O contrato pode ser hackeado?
**R:** Não. Solidity 0.8.26 tem segurança embutida. O código usa SafeMath e require() para validações. Mas:
- ⚠️ Guarde sua chave privada com segurança
- ⚠️ Nunca compartilhe seu arquivo `tronbox.js`
- ⚠️ Mantenha sua seed em local seguro

### P: Quantos tokens posso criar?
**R:** Infinitos! Pode chamar `issue()` várias vezes. Cada call aumenta o suprimento e você recebe os tokens na sua carteira.

### P: Como vendo meus tokens?
**R:** Depois de listar em DEX (SunSwap):
1. Vá para https://sunswap.com/swap
2. Selecione seu token
3. Digite a quantidade que quer vender
4. Clique "Swap" e confirme

### P: O que significa "deprecate"?
**R:** Redireciona o contrato antigo para um novo. Todas as operações passam para o novo endereço. É útil para upgrades, mas **irreversível**.

### P: Como recupero minha conta se perdi a seed?
**R:** **Não pode.** Se perdeu:
- 12 palavras (seed) = perdeu a carteira para sempre
- Chave privada = perdeu a carteira para sempre
- Arquivo tronbox.js = pode recriar, precisa da chave privada

**Sempre guarde em 2+ lugares!**

---

## 💡 Dicas Práticas

### ✅ Para Economizar TRX (gas)

1. **Alugar Energy** (1-2 TRX por 100 transferências)
   - https://tronlending.org
   - Mais barato que pagar gas direto

2. **Batch Operations**
   - Faça múltiplas operações no mesmo bloco
   - Economiza gas total

3. **Use Shasta para Testes**
   - TRX grátis, nenhum risco
   - Aprenda antes de ir para Mainnet

### ✅ Para Aumentar Segurança

1. **Nunca compartilhe:**
   - Chave privada (64 caracteres)
   - Arquivo tronbox.js
   - Arquivo com sua seed

2. **Guarde em múltiplos lugares:**
   - Papel (em casa segura)
   - Pen-drive #1 (bancário)
   - Pen-drive #2 (casa de parente)
   - Cofre digital (criptografado)

3. **Use senhas fortes:**
   - 16+ caracteres
   - Misture: maiúsculas, minúsculas, números, símbolos
   - Diferente para cada serviço

### ✅ Para Crescer o Projeto

1. **Crie comunidade**
   - Discord/Telegram para holders
   - Anuncie em grupos crypto
   - Seja transparente sobre roadmap

2. **Faça marketing**
   - Listings em sites como CoinGecko (grátis)
   - Partnerships com outros projetos
   - Airdrop inicial para criadores

3. **Mantenha a token útil**
   - Use em games, DeFi, NFTs
   - Crie caso de uso real
   - Seja inovador

### ✅ Para Monitorar o Token

1. **Verificar saldo:**
   ```bash
   tronbox console --network mainnet
   > const token = await USDTInfinitaTRC20.deployed()
   > (await token.balanceOf("endereco")).toString()
   ```

2. **Ver holders:**
   - Acesse: https://tronscan.org
   - Cole endereço do contrato
   - Veja "Token Holders"

3. **Monitorar preço:**
   - https://sunswap.com/swap (se listar)
   - https://coingecko.com (buscar símbolo)

---

## ⚙️ Operações Avançadas

### Trocar o Owner (proprietário)

```javascript
const token = await USDTInfinitaTRC20.deployed()
await token.transferOwnership("novo_endereco_owner")
```

**⚠️ Irreversível!** Só faça se tem certeza!

### Configurar Taxa de Transferência

```javascript
// Taxa: 0.1% (10 pontos base)
// Máx por transferência: 1 token
await token.setParams(10, web3.utils.toWei("1", "ether"))
```

**Fórmula:**
- `basisPoints`: taxa em 0.01% (1 = 0.01%, 100 = 1%)
- `maximumFee`: limite máximo em tokens

### Deprecar para Novo Contrato

```javascript
// Após deployar novo contrato em "novo_endereco"
const token = await USDTInfinitaTRC20.deployed()
await token.deprecate("novo_endereco")
```

**Efeito:**
- Contrato antigo para de processar
- Todas as calls vão para novo contrato
- Balances são migrados

---

## 🔍 Como Ler Logs e Erros

### Erro Comum: "Insufficient balance"

```
Error: revert
    at <invalid>:0:0

Reason: SafeMath: subtraction overflow
```

**Solução:** Seu saldo é menor que o valor que quer transferir.

### Erro Comum: "Invalid address"

```
Error: The to address is not a valid address
```

**Solução:** Você copiou um endereço inválido. Verifique:
- Começa com "T" (TRON)?
- 34 caracteres no total?
- Sem espaços extras?

### Erro Comum: "Compilation failed"

```
ParserError: Expected ';' but got '}'
```

**Solução:** Erro de sintaxe no contrato. Verifique:
- Linhas com erros (arquivo apontará)
- Parênteses, chaves, pontos-e-vírgulas
- Espaçamento

---

## 📊 Métricas para Monitorar

| Métrica | Como Verificar |
|---------|---|
| **Total Supply** | `token.totalSupply()` |
| **Seu Saldo** | `token.balanceOf("seu_endereco")` |
| **Holders** | https://tronscan.org (contrato) |
| **Gas Usado** | Último tx em TronLink |
| **Volume (DEX)** | https://sunswap.com |
| **Preço** | SunSwap ou CoinGecko |

---

## 🚀 Roadmap Sugerido

**Semana 1:**
- [ ] Deploy em Testnet
- [ ] Testar todas as funções
- [ ] Testar transferências
- [ ] Verificar saldos

**Semana 2:**
- [ ] Deploy em Mainnet
- [ ] Listar no SunSwap
- [ ] Criar comunidade Discord/Telegram
- [ ] Anunciar em grupos crypto

**Semana 3+:**
- [ ] Aumentar comunidade
- [ ] Listar em sites (CoinGecko, etc)
- [ ] Parcerias com outros projetos
- [ ] Inovações (staking, farming, etc)

---

## 🆘 Precisa de Ajuda?

### Recursos Oficiais
- 📖 [TronBox Docs](https://tronbox.io)
- 📖 [Solidity Docs](https://docs.soliditylang.org)
- 📖 [TRON Docs](https://developers.tron.network)

### Comunidades
- 🔗 TRON Community: https://tron.network/community
- 🔗 SunSwap: https://sunswap.com
- 🔗 Reddit: r/Tronix

### Ferramentas Úteis
- 🔍 Block Explorer: https://tronscan.org
- 💰 Gas Estimator: https://tronlending.org
- 🔗 Address Converter: https://tron.network/tools

---

**Parabéns! Seu token TRC-20 está pronto para o mundo! 🌍**

*Lembre-se: segurança em primeiro lugar, depois crescimento!*
