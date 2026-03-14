# 📊 Dashboard de Visualização USDT

Este dashboard fornece visualizações gráficas para acompanhar o desempenho do token USDT (Flash USDT) em tempo real, com suporte a múltiplas blockchains e integração com APIs de dados históricos.

## 🚀 Como Usar

### 1. Executar Análise de Estatísticas
```bash
# Buscar informações do token nas blockchains
node get-token-stats.js
```

### 2. Abrir o Dashboard
```bash
# Abra o arquivo no navegador
start dashboard.html
# ou .\open-dashboard.ps1
```

## 📈 Funcionalidades

### Dashboard Web (`dashboard.html`)
- **Multi-chain**: Mostra dados separados para Ethereum e BSC
- **Status em Tempo Real**: Indica sucesso/erro para cada blockchain
- **Dados do Contrato**: Símbolo, decimals, supply total
- **Preços na DEX**: Calculados a partir de reservas de liquidity pools
- **Gráficos Históricos**: Integração com The Graph para dados passados
- **Fallback Automático**: Usa dados simulados quando APIs falham

### Script de Análise (`get-token-stats.js`)
- Busca informações básicas do token (símbolo, decimais, supply)
- Calcula preço baseado em reservas de DEX (Uniswap/PancakeSwap)
- Suporte para múltiplas blockchains (Ethereum e BSC)
- Gera arquivo `token-stats.json` para consumo do dashboard
- Tratamento robusto de erros e fallbacks de RPC

## 🔧 Endereço do Contrato

**USDT Flash Token**: `0x419ecA43dB68E868E68d1aB460c8AC32523c7540`

Este endereço é usado em ambas as blockchains (Ethereum e BSC).

## 📊 Estrutura dos Dados

### Arquivo `token-stats.json`
```json
{
  "generatedAt": "2026-03-14T17:25:05.268Z",
  "data": [
    {
      "chain": "Ethereum",
      "success": true,
      "symbol": "USDT",
      "decimals": "18",
      "totalSupply": "1000000.0",
      "priceData": {
        "pair": "USDT/WETH",
        "price": 1.000123,
        "reserves": {
          "token": "50000.0",
          "base": "50000.0"
        }
      }
    }
  ]
}
```

## 🎯 Integração com APIs de Dados Históricos

### The Graph (Subgraph)
Para dados históricos reais, configure um endpoint do The Graph:

```javascript
// Exemplo de query para Uniswap V3 subgraph
const query = `
{
  token(id: "0x419eca43db68e868e68d1ab460c8ac32523c7540") {
    tokenDayData(first: 30, orderBy: date, orderDirection: desc) {
      date
      priceUSD
      volumeUSD
    }
  }
}`;
```

### Configuração
1. Substitua a função `fetchHistoricalData()` no dashboard
2. Configure seu endpoint do subgraph
3. Ajuste a query conforme necessário

## 🔍 Status e Troubleshooting

### Status Possíveis
- ✅ **Sucesso**: Dados carregados corretamente
- ❌ **Erro**: Problema na blockchain ou contrato
- ⚠️ **Dados Simulados**: Fallback quando APIs falham

### Problemas Comuns
1. **Contrato não encontrado**: Verifique se o endereço está correto
2. **RPC indisponível**: Script tenta múltiplos RPCs automaticamente
3. **Sem dados históricos**: Configure endpoint do The Graph

## 📝 Próximos Passos

- [ ] Configurar endpoint real do The Graph
- [ ] Adicionar alertas de preço
- [ ] Implementar análise técnica (RSI, MACD)
- [ ] Suporte para dados de transações on-chain
- [ ] Exportação de relatórios em PDF

## 🛠️ Personalização

### Adicionar Nova Blockchain
1. Atualize o objeto `CHAINS` em `get-token-stats.js`
2. Adicione seção HTML no dashboard
3. Configure RPCs e endereços de DEX

### Modificar Gráficos
- Use Chart.js para customizar cores, tipos e opções
- Adicione novos tipos de gráfico conforme necessário

## 📞 Suporte

Para sincronizar o contrato no mercado:
1. Verifique se está deployado corretamente
2. Configure listagem em DEXs (Uniswap, PancakeSwap)
3. Submeta para carteiras (MetaMask, Trust Wallet)
4. Configure monitoramento via The Graph