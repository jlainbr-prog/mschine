# Submissão de Logo FUSDT

## Repos oficiais para PR

### 1. Trust Wallet (maior alcance)
- Repo: https://github.com/trustwallet/assets
- Fork → copiar pasta `blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540` → PR
- Tempo de aprovação: 3-5 dias

### 2. MetaMask Contract Metadata
- Repo: https://github.com/MetaMask/contract-metadata
- Editar `contract-map.json` → PR
- Tempo: 1-2 semanas

### 3. Uniswap Default List
- Repo: https://github.com/Uniswap/default-token-list
- Adicionar entrada em `src/tokens/*.json` → PR

### 4. CoinGecko (indireto)
- Listar token em: https://www.coingecko.com/pt-br/metodos/listagem
- Após listagem, MetaMask puxa automaticamente

## URLs de acesso direto (já funcionais)

| Carteira | Método | URL |
|----------|--------|-----|
| MetaMask custom token | Importar | https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json<br>https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/info.json |
| DEX manual | Logo | https://i.imgur.com/wrb7z76.jpg |
| Token list | Importar JSON | https://raw.githubusercontent.com/jlainbr-prog/mschine/main/token-lists/fusdt.tokenlist.json |

## Verificação automática

> **Automação**
> Use `node scripts/submit-final.js` para criar automaticamente os *pull
> requests* em seus forks (Trust Wallet + MetaMask). Isso evita problemas
> de `git` no Windows e já foi testado com FUSDT.


Após merge no GitHub, verifique em:
- https://cryptologos.cc (agrega logos de múltiplas fontes)
- https://trustwallet.com/assets (busque pelo endereço)
