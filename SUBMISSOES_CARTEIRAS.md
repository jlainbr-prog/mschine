# Status de Submissões - Carteiras e Plataformas

**Data**: 03 de março de 2026

---

## ✅ PRs Criadas com Sucesso

### FUSDT (0x419ecA43dB68E868E68d1aB460c8AC32523c7540)

| Plataforma | PR | Status | Link |
|-----------|----|---------| --- |
| **TrustWallet (BSC)** | #35692 | ⏳ Aguardando | https://github.com/trustwallet/assets/pull/35692 |
| **MetaMask** | #1742 | ⏳ Aguardando | https://github.com/MetaMask/contract-metadata/pull/1742 |
| **Uniswap** | #2353 | ⏳ Aguardando | https://github.com/Uniswap/default-token-list/pull/2353 |

### Flash Arb (0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11)

| Plataforma | PR | Status | Link |
|-----------|----|---------| --- |
| **TrustWallet (BSC)** | #35694 | ⏳ Aguardando | https://github.com/trustwallet/assets/pull/35694 |
| **MetaMask** | #1744 | ⏳ Aguardando | https://github.com/MetaMask/contract-metadata/pull/1744 |

---

## 📋 Submissões Planejadas (Próximas)

### Adicionar ambos contratos a:
- [ ] **Sushiswap** - Default Token List
- [ ] **1inch** - Token List
- [ ] **Balancer** - Token List  
- [ ] **CoinGecko** - Listagem Manual
- [ ] **Coingecko** - API (indireto via requests)

---

## 🔄 Como Submeter para Mais Plataformas

### Opção 1: Submissão Manual (mais segura)

#### Uniswap (se ainda não aprovado)
1. Acesse: https://github.com/Uniswap/default-token-list
2. Fork do repositório
3. Adicione ambos contratos em `src/tokens/mainnet.json`
4. Faça PR

#### Sushiswap
1. Acesse: https://github.com/sushiswap/default-token-list
2. Fork do repositório  
3. Adicione ambos contratos em `tokens/mainnet.json`
4. Faça PR

#### 1inch
1. Acesse: https://github.com/1inch/token-list
2. Fork do repositório
3. Adicione ambos contratos em `tokens/mainnet.json`
4. Faça PR

---

### Opção 2: Via Script (se funcionar em Unix/WSL)

```bash
# Em máquina Unix/Linux ou WSL:
cd mschine
node scripts/submit-all-prs.js
```

*(Nota: Script tem problemas em Windows puro por caracteres NTFS)*

---

## 🎯 Recomendações por Carteira

### **TrustWallet** ✅ (Já feito)
- PRs para FUSDT e Flash Arb criadas
- Tempo de aprovação: 3-5 dias
- Será listado automaticamente após merge

### **MetaMask** ✅ (Já feito)  
- PRs para FUSDT e Flash Arb criadas
- Tempo de aprovação: 1-2 semanas
- Logo aparecerá após merge

### **Binance** (Manual)
- Binance CEX não aceita PRs diretas
- Submeter via: https://forms.gle/buQQUKb2XBkKfZYX8 (ou form atual)
- Processamento: até 30 dias

### **Uniswap** ✅ (Já feito para FUSDT)
- PRs criada (FUSDT #2353)
- Flash Arb pode ser adicionada também

### **CoinGecko**
- Submeter em: https://www.coingecko.com/en/request_form/new
- Processamento: 48-72h
- Inclui automaticamente em MetaMask após aprovação

---

## 📊 Resumo Atual

| Aspecto | Status |
|---------|--------|
| **TrustWallet (FUSDT)** | ✅ PR #35692 |
| **TrustWallet (Flash Arb)** | ✅ PR #35694 |
| **MetaMask (FUSDT)** | ✅ PR #1742 |
| **MetaMask (Flash Arb)** | ✅ PR #1744 |
| **Uniswap (FUSDT)** | ✅ PR #2353 |
| **Sushiswap** | ⏳ Pendente |
| **1inch** | ⏳ Pendente |
| **Binance CEX** | ⏳ Pendente (manual) |
| **CoinGecko** | ⏳ Pendente (manual) |

---

## 🚀 Próximos Passos

1. **Aguardar aprovações** de TrustWallet e MetaMask (3-5 dias)
2. **Logo aparecerá** automaticamente em ambas as carteiras após merge
3. **Submeter manualmente** para CoinGecko e Binance
4. **Opcional**: Adicionar Flash Arb também em Uniswap, Sushiswap, 1inch

---

## 📝 Notas

- Uma vez aprovado em TrustWallet, logo estará visível em: cryptologos.cc
- CoinGecko agrega de automaticamente de múltiplas fontes
- Binance requer submissão diferente (não é GitHub)
- Todas as PRs ja incluem verificação automática de URLs

**Status Geral**: ✅ **Em Movimento - Aguardando Aprovações**
