Título: Automate flash arbitrage bot for both contracts

Resumo
- Adiciona automação completa para executar arbitragem (add liquidity → deploy → startArbitrage) para múltiplos tokens, com suporte explícito aos dois contratos alvo:
  - 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
  - 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
- Inclui workflow GitHub Actions agendado (a cada 5 min) e opção de execução contínua local (PM2).

Principais alterações
- `scripts/addLiquidity.js` — função reutilizável para criar/atualizar par
- `scripts/flashArb.js` — deploy + chamada de arbitragem
- `scripts/autoFlowMulti.js` — orquestrador que percorre `CONTRACTS`
- `scripts/bot.js` — loop contínuo; suporta `ARB_ADDRESS` ou `ARB_ADDRESSES`
- `scripts/checkSecrets.cjs` — validação local de `PRIVATE_KEY`, `RPC_URL`, `CONTRACTS`
- `.env.example` / `.env` — placeholders e `CONTRACTS` preenchido
- `docs/ENV_SETUP.md` — instruções rápidas
- `.github/workflows/run-bot.yml` — agendamento 5min para `autoFlowMulti`
- `ecosystem.config.js` — config PM2 para execução persistente
- `package.json` — scripts convenientes (`start-bot`, `check-secrets`, `auto-flow`)

Como testar (pré-merge)
1. Na tua máquina:
```bash
git checkout feature/auto-bot
git push origin feature/auto-bot
```
2. Criar PR no GitHub (ou com `gh`):
```bash
gh pr create --fill --base main
```
3. Definir Secrets no repositório:
- `PRIVATE_KEY` (carteira com BNB)
- `RPC_URL` (endpoint BSC)
- `CONTRACTS` = `0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11,0x419ecA43dB68E868E68d1aB460c8AC32523c7540`
- (opcional) `TOKEN_B`, `AMOUNT_A`, `AMOUNT_B`, `ROUTER`
4. Após merge, forçar 1 execução manual ou aguardar o cron (5 min) e validar logs em **Actions**.

Como testar localmente
```bash
cp .env.example .env
# editar .env com PRIVATE_KEY, RPC_URL, CONTRACTS
npm ci
node scripts/checkSecrets.cjs          # deve retornar OK
npx hardhat compile
npx hardhat run scripts/autoFlowMulti.js --network bscTestnet
# ou para execução contínua
npm run start-bot -- --network bscTestnet
```

Riscos / Observações
- A conta definida em `PRIVATE_KEY` precisa de BNB para gás. Testar sempre em testnet primeiro.
- Não commitar chaves privadas. Use Secrets do GitHub.
- O `autoFlowMulti` faz deploys; se preferir reusar um `FlashArb` existente use `ARB_ADDRESSES`.

Checklist antes de merge
- [ ] `feature/auto-bot` foi pushado para o remoto
- [ ] Secrets (`PRIVATE_KEY`, `RPC_URL`, `CONTRACTS`) configurados no repo
- [ ] Testes básicos executados em testnet e logs validados
- [ ] Revisão de segurança (chaves, amounts, slippage)
