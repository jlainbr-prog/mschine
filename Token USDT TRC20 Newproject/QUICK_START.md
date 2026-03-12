# ⚡ QUICK START – 1 Hora para Token Vivo!

## 🎯 Objetivo
Você vai ter um token USDT∞ TRC-20 100% funcional em **menos de 1 hora**.

## ⏱️ Cronograma
```
0:00-0:05  Leitura
0:05-0:15  Preparação
0:15-0:20  Configuração
0:20-0:25  Compilação
0:25-0:35  Deploy
0:35-0:45  Testes
0:45-1:00  Celebração 🎉
```

---

## 📖 Leitura (5 minutos)

Leia APENAS estas seções:

### 1. SUMARIO_EXECUTIVO.md
- Seção: "O que foi criado"
- Tempo: 2 min

### 2. README_DEPLOYMENT.md
- Seção: "Preparação Inicial"
- Apenas subsções 1-3 (carteira, TRX)
- Tempo: 3 min

---

## 🛠️ Preparação (10 minutos)

### Passo 1: Carteira TronLink (3 min)
```
1. Chrome > 3 pontinhos > Extensões
2. Buscar "TronLink" > Adicionar
3. Clique ícone > Create Wallet
4. ANOTE as 12 palavras em papel ⚠️
5. Crie senha
6. Clique ícone > copie endereço (T...)
```

### Passo 2: Pegar TRX Grátis (5 min)
```
1. Abra: https://www.trongrid.io/shasta
2. Cole seu endereço TronLink
3. Clique "Request 10000 TRX"
4. Aguarde 1-2 minutos
5. Volte ao TronLink > veja saldo
```

### Passo 3: Exportar Chave Privada (2 min)
```
1. TronLink > ícone carteira
2. "Export Private Key"
3. Insira sua senha
4. COPIE (64 caracteres) ⚠️
5. GUARDE para próximo passo
```

---

## ⚙️ Configuração (5 minutos)

### Passo 1: Editar tronbox.js
```
1. Abra: tronbox.js (na pasta do projeto)
2. Linha 4: Cola chave privada (Testnet)
3. Linha 10: Cola chave privada (Mainnet)
4. Salva arquivo (Ctrl+S)
```

**Exemplo:**
```javascript
// Linha 4:
privateKey: "abc123def456abc123def456abc123def456abc123def456abc123def456abc1",
```

⚠️ **Nunca compartilhe este arquivo!**

---

## 🔨 Compilação (5 minutos)

### Terminal/Prompt
```bash
# Mude para a pasta do projeto
cd "c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT\USDT TRC20"

# Compile
tronbox compile
```

### Esperado
```
✔ Compiled successfully using:
   - solc: 0.8.26+commit...

Compiling USDTInfinitaTRC20.sol...
✓ USDTInfinitaTRC20.sol
```

**Se der erro:** Pare, leia README_DEPLOYMENT.md seção "Troubleshooting"

---

## 🚀 Deploy (10 minutos)

### Terminal
```bash
# Deploy em Testnet
tronbox migrate --network shasta --reset
```

### Aguarde (2-5 minutos)

### Esperado
```
Starting migrations...
======================

2_deploy.js
================================================
Iniciando Deploy do USDT∞ TRC-20
================================================
...

✅ Deploy realizado com sucesso!
📍 Endereço do contrato: TRxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Ação Crítica
```
COPIE este endereço (começa com TR...)!
Você vai usar nos próximos passos!
```

---

## 🧪 Testes (10 minutos)

### Passo 1: Adicionar Token à Carteira (3 min)
```
1. TronLink > aba "Assets"
2. Clique "+" (add token)
3. Escolha "Custom Token"
4. Cole endereço (que você copiou)
5. Clique "Next" > "Add"
6. Vê seu saldo: 1.000.000 USDT∞
```

### Passo 2: Testar Transferência (5 min)
```
1. TronLink > clique "Send"
2. Cole endereço de um amigo (ou crie outra carteira)
3. Digite: 1 (um token)
4. Clique "Confirm"
5. Aguarde ~2 minutos
6. Vê status: SUCCESS ✅
7. Saldo diminuiu em ~1 USDT∞ + gas
```

### Passo 3: Verificar Saldo (2 min)
```
1. TronLink > Seu Assets
2. Veja: seu saldo atual
3. Amigo recebeu ~1 USDT∞
```

---

## 🎉 Pronto!

Seu token está **100% funcional**!

```
✅ Token criado
✅ Testado
✅ Transferências funcionando
✅ Pronto para Mainnet
✅ Pronto para SunSwap
```

---

## ⏭️ Próximos Passos (Opcional)

### Listar em DEX (SunSwap)
```
1. https://sunswap.com
2. Pool > Create Pair
3. Token A: TRX
4. Token B: seu contrato (endereço)
5. Quantidade: 100 TRX + 10.000 USDT∞
6. Supply > Confirm
7. Pronto! Qualquer um pode comprar/vender
```

### Deploy em Mainnet
```bash
# Quando pronto (não agora!)
tronbox migrate --network mainnet --reset
```

⚠️ **Mainnet = gasta TRX real, é permanente!**

---

## 📚 Se Precisar de Ajuda

| Problema | Solução |
|----------|---------|
| Erro ao compilar | README_DEPLOYMENT.md > "Troubleshooting" |
| Não encontra TronBox | `npm install -g tronbox` |
| Chave privada inválida | Verifique 64 caracteres, sem espaços |
| Contrato não aparece | Verifique endereço está correto |
| Gas está caro | Alugue energy em tronlending.org |

---

## 🔑 Checklist Rápido

```
✅ Leu SUMARIO_EXECUTIVO.md (5 min)
✅ Criou carteira TronLink
✅ Pegou TRX grátis em Shasta
✅ Exportou chave privada
✅ Editou tronbox.js
✅ Compilou (tronbox compile)
✅ Deployou (tronbox migrate --network shasta)
✅ Copiou endereço do contrato
✅ Adicionou token ao TronLink
✅ Testou transferência
✅ Aguardou ~2 minutos
✅ Viu SUCCESS ✅
✅ Seu token está VIVO! 🎉
```

---

## 💬 FAQ Rápido

**P: Perdi a chave privada. O que faço?**
R: Extraia novamente de TronLink. Só existem naquela carteira.

**P: Quanto custa fazer deploy?**
R: Testnet = grátis. Mainnet = ~50 TRX (~0.50 USD).

**P: Posso mudar o suprimento?**
R: Sim! `token.issue(valor)` emite novos.

**P: E se der erro no deploy?**
R: Leia README_DEPLOYMENT.md > seção Troubleshooting

**P: Meu token é seguro?**
R: Sim! SafeMath, ERC20 padrão, validações em tudo.

---

## 🎯 Resumo em 3 Linhas

```
1. Configure tronbox.js (cole chave privada)
2. Execute: tronbox compile && tronbox migrate --network shasta
3. Copie endereço, adicione ao TronLink, transfira 1 token ✅
```

---

## 🚀 Está pronto? Comece agora!

**Tempo:** ~1 hora
**Custo:** Grátis (testnet)
**Resultado:** Token infinito vivo! 🎊

**Dúvidas?** Consulte FAQ_DICAS.md ou README_DEPLOYMENT.md

---

**BOA SORTE! Seu token em breve estará gerando valor real! 💰**

*Versão: 1.0 | Data: 18/01/2026 | Status: ✅ Pronto*
