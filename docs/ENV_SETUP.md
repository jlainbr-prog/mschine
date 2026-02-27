# Configuração de ambiente (rápida)

Este arquivo descreve os passos mínimos para configurar variáveis de ambiente e executar os scripts locais.

1) Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2) Edite `.env` e preencha `PRIVATE_KEY` e `RPC_URL`. **NUNCA** comite sua chave privada.

3) Verifique as variáveis obrigatórias localmente:

```bash
node scripts/checkSecrets.cjs
```

4) (opcional) se já tiver contratos FlashArb implantados para cada token, adicione seus endereços em `ARB_ADDRESSES` (vírgula-separados). Caso contrário, o fluxo `autoFlowMulti` implanta um novo a cada execução.

4) Compile os contratos:

```bash
npx hardhat compile
```

5) Rodar fluxo multi (testnet exemplo):

```bash
npx hardhat run scripts/autoFlowMulti.js --network bscTestnet
```

6) Observação para CI (GitHub Actions): configure os Secrets `PRIVATE_KEY`, `RPC_URL` e `CONTRACTS` no repositório para que o workflow `.github/workflows/run-bot.yml` funcione.

7) Para execução contínua local ou em um servidor próprio você pode usar `pm2`:

```bash
npm install -g pm2        # instale globalmente se ainda não
pm2 start ecosystem.config.js
pm2 save                  # para persistir a configuração
``` 

O arquivo `ecosystem.config.js` já está no repositório e executará `scripts/bot.js` em modo production.

8) Os comandos npm úteis agora são:

```bash
npm run check-secrets    # validar .env
npm run start-bot -- --network bscTestnet   # iniciar bot manualmente
npm run auto-flow -- --network bscTestnet   # executar autoFlowMulti sem hardhat prefix
```
