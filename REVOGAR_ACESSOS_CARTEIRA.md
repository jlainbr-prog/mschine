# Revogar todos os acessos à carteira 0x63546b9fc232C9c62C4867f06291212ddA83609d

**Objetivo:** cancelar acessos indevidos, bots, PRs e aprovações (approvals) ligados a esta carteira da Trust Wallet. Deixar em standby o que for possível.

---

## ✅ O que já foi feito no repositório (automático)

- **Lista de endereços revogados:** o arquivo `scripts/revoked-wallets.js` contém este endereço. Nenhum bot deve rodar com essa carteira.
- **Bots em standby para esta carteira:**
  - `scripts/flash-arbbot.js` — ao iniciar, se a carteira do `.env` for a revogada, o script **encerra** e não executa.
  - `scripts/multi-flash-arbbot.js` — mesma checagem; não roda com a carteira revogada.
  - `scripts/auto-reinvest.js` — não executa reinvestimento se a carteira for a revogada.
- Para **reativar** essa carteira no futuro: remova o endereço do array em `scripts/revoked-wallets.js`.

---

## 1. Revogar aprovações on-chain (token approvals)

Transações indevidas costumam vir de **approvals** que você deu a contratos ou dApps. Revogue todas:

- **Ethereum:**  
  - Acesse [revoke.cash](https://revoke.cash) ou [etherscan.io/tokenapprovalchecker](https://etherscan.io/tokenapprovalchecker).  
  - Conecte a carteira **0x63546b9f...** (ou importe “watch” só para ver).  
  - Revogue **todas** as aprovações listadas.

- **BSC (Smart Chain):**  
  - Use [revoke.cash](https://revoke.cash) e selecione a rede BNB Smart Chain, ou o aprovador no BscScan.  
  - Revogue todas as aprovações dessa carteira.

- **Outras redes (Polygon, etc.):**  
  - Em [revoke.cash](https://revoke.cash) troque a rede e repita o processo para essa carteira.

---

## 2. Trust Wallet – desconectar e limpar

- Abra **Trust Wallet**.
- **Configurações** (ou **Settings**) → **DApps** / **Browser** / **Conections** (nome pode variar).
- **Desconecte** todos os sites/dApps listados.
- Se houver “Revoke” ou “Revoke all” para essa carteira, use.
- Opcional: exportar o seed phrase para um lugar seguro e depois **reinstalar o app** (só se você tiver backup e quiser começar “limpo” no app).

---

## 3. Neste projeto (repositório) – revogar e colocar em standby

### 3.1 Remover o endereço e as chaves das configurações

**Opção A – Script (recomendado):** na pasta raiz do projeto, no PowerShell:

```powershell
.\scripts\remover-chave-revogada.ps1
```

O script faz backup do `.env`, comenta as linhas `PRIVATE_KEY` e `RECEIVER` ligadas à carteira revogada, **sem exibir** a chave.

**Opção B – Manual:** abra o **`.env`** na raiz (e qualquer outro `.env` que use essa carteira) e apague ou comente as linhas com `PRIVATE_KEY` e `RECEIVER` dessa carteira.

- **Nunca** compartilhe sua chave privada ou seed com ninguém (nem com assistentes).
- **Nunca** faça commit do `.env` no GitHub (ele deve estar no `.gitignore`).

### 3.2 Parar bots e scripts que usam essa carteira

- Não rode mais **scripts de bot** (ex.: `flash-arbbot.js`, `multi-flash-arbbot.js`, `auto-reinvest.js`, etc.) com essa carteira.
- Se algum script estiver agendado (Task Scheduler, cron, PM2), **desative** a tarefa ou o processo.
- Em resumo: **pausar/cancelar** qualquer serviço que use essa carteira = revogar o “acesso” do projeto a ela.

### 3.3 GitHub – Secrets e tokens

- No **GitHub** → repositório → **Settings** → **Secrets and variables** → **Actions**.
- Se existir secret com chave privada ou dados dessa carteira, **remova** o secret (ou substitua por um de outra carteira que você queira usar no futuro).
- Em **Settings** → **Integrations** ou **Applications**, revogue acesso de bots/apps que você não reconhecer ou que usem essa carteira.

---

## 4. PRs e “solicitações de bots”

- **Pull Requests:** se algum bot ou conta externa abriu PRs que tocam nessa carteira ou em secrets, **feche** esses PRs (Close) e não faça merge.
- **Branch protection:** você pode exigir revisão obrigatória antes de merge, para evitar que bots ou terceiros aprovem coisas sem você.

Assim você “revoga” o uso dessa carteira via PRs.

---

## 5. Resumo – checklist

| Ação | Feito? |
|------|--------|
| Revogar approvals em [revoke.cash](https://revoke.cash) (Ethereum + BSC + outras redes) | ☐ |
| Desconectar dApps no Trust Wallet para essa carteira | ☐ |
| Remover/comentar o endereço e chaves dessa carteira em todos os `.env` | ☐ |
| Parar e desagendar bots/scripts que usam essa carteira | ☐ |
| Remover/atualizar secrets no GitHub (Actions) | ☐ |
| Fechar PRs de bots que envolvam essa carteira | ☐ |

---

## 6. Futuro – o que podemos fazer depois

- **Standby:** com approvals revogados e bots parados, a carteira fica em standby. Nada neste projeto nem em dApps conectados poderá movimentar tokens por approvals antigos.
- Quando quiser usar de novo: criar **nova carteira** para bots/automação e não reutilizar essa para dApps desconhecidos.
- Para esta carteira: usar só para operações manuais e em sites que você confie, após reconectar com cuidado.

---

## O que só você pode fazer (não dá para fazer pelo assistente)

- **Revoke.cash / aprovações on-chain:** exigem você conectar a carteira e assinar a revogação no navegador.
- **Trust Wallet:** desconectar dApps e revogar conexões é feito no app no seu celular.
- **GitHub:** remover Secrets e fechar PRs exige seu login no GitHub.
- **Arquivo `.env`:** remova manualmente a linha da `PRIVATE_KEY` (ou do endereço) dessa carteira no `.env`; o assistente não abre `.env` por segurança.
