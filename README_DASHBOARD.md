# 📊 Dashboard de Visualização USDT

Este dashboard fornece visualizações gráficas para acompanhar o desempenho do token USDT (Flash USDT) em tempo real.

## 🚀 Como Usar

### 1. Abrir o Dashboard
```bash
# Abra o arquivo no navegador
start dashboard.html
```

### 2. Executar Análise de Estatísticas
```bash
# Buscar informações do token nas blockchains
node get-token-stats.js
```

## 📈 Funcionalidades

### Dashboard Web (`dashboard.html`)
- **Preço Atual**: Mostra o preço atual do token
- **Volume 24h**: Volume de trading nas últimas 24 horas
- **Variação 24h**: Percentual de mudança no preço
- **Market Cap**: Capitalização de mercado estimada

### Gráficos Disponíveis
1. **Evolução do Preço**: Gráfico de linha mostrando a variação histórica do preço
2. **Volume de Trading**: Gráfico de barras com o volume mensal

### Script de Análise (`get-token-stats.js`)
- Busca informações básicas do token (símbolo, decimais, supply total)
- Calcula preço baseado em reservas de DEX (Uniswap/PancakeSwap)
- Suporte para múltiplas blockchains (Ethereum e BSC)

## 🔧 Personalização

### Adicionar Dados Reais
Para conectar com dados reais do seu token:

1. **API de DEX**: Integre com The Graph ou APIs de subgraph para dados históricos
2. **Oracle de Preços**: Use Chainlink ou outros oracles para preços em tempo real
3. **Dados On-chain**: Busque transações diretamente dos contratos

### Exemplo de Integração com API
```javascript
// Exemplo para buscar dados de uma API personalizada
async function fetchRealTokenData() {
    const response = await fetch('https://sua-api.com/token-data');
    const data = await response.json();
    // Atualizar gráficos com dados reais
}
```

## 📊 Estrutura dos Dados

### Formato Esperado para Gráficos
```javascript
const chartData = {
    labels: ['Jan', 'Fev', 'Mar', ...], // Labels do eixo X
    datasets: [{
        label: 'Preço USDT',
        data: [1.00, 1.01, 1.02, ...], // Valores do gráfico
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
    }]
};
```

## 🎨 Customização Visual

O dashboard usa Chart.js para renderização. Você pode:
- Alterar cores dos gráficos
- Adicionar novos tipos de gráfico (pizza, área, etc.)
- Modificar layout e responsividade
- Adicionar tooltips personalizados

## 🔍 Próximos Passos

- [ ] Integrar com APIs de preços reais
- [ ] Adicionar gráficos de TVL (Total Value Locked)
- [ ] Implementar alertas de preço
- [ ] Adicionar análise técnica (RSI, MACD, etc.)
- [ ] Suporte para múltiplos tokens
- [ ] Exportação de dados em CSV/PDF

## 📝 Notas Técnicas

- **Chart.js**: Biblioteca usada para gráficos (CDN)
- **Ethers.js**: Para interações com blockchain
- **ES Modules**: Sintaxe moderna do JavaScript
- **Responsive**: Design adaptável para mobile/desktop