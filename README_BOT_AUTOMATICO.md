# 🔁 README - Bot Automático (24/7 sem interrupção)
Este documento explica como **acionar o bot** e deixá‑lo rodando de forma contínua e automática
com os dados atuais do projeto. Inclui também o novo módulo `rub/` para reinvestimento
objetivo e farm fake.

---

## 🧩 Pré‑requisitos

1. **Repositório atualizado** – todos os arquivos descritos neste workspace.
2. **Node.js 18+** instalado (você já tem, pois usa `node -c`).
3. **Dependências do núcleo** instaladas:
   ```bash
   cd "c:/Users/JEF/Documents/Projeto Moedas/Contrato Flash USDT"
   npm install
   ```
4. **Dependências do módulo `rub/`** (opcional, mas recomendado):
   ```bash
   cd rub && npm install --legacy-peer-deps
   ```
5. **Arquivo `.env` configurado** com as variáveis listadas abaixo.
   - Assuma que valores como `PRIVATE_KEY` e `RPC_ETH` já estão preenchidos.

6. **Arquivo `rub/.env.rub` configurado** (se utilizar o módulo) ou simplesmente deixá‑lo vazio;
   o orquestrador mescla automaticamente os valores do `.env` principal.

---

## 📋 Variáveis de ambiente principais
Envie estas variáveis para `.env`; use `code .env` ou `notepad`.

```dotenv
PRIVATE_KEY=0x...             # sua carteira de deploy/gás
RPC_ETH=wss://eth-mainnet...   # Alchemy/Infura (Ether)
RPC_BSC=https://bsc-dataseed... # node BSC
RECEIVER_ETH=0x95fd050F...     # receiver flash loan ETH
RECEIVER_BSC=0x95fd050F...     # receiver flash loan BSC
SLIPPAGE=50                    # 0.5% tolerância
MIN_PROFIT_USD=30              # lucro mínimo por flash
GAS_MULTIPLIER=1.2             # gas price multiplier

# Auto-reinvest
REINVEST_PCT=50                # % lucro reinvestido
MIN_REINVEST_USD=30            # gatilho de buffer
REINVEST_MIN=15                # intervalo em min
```

> Se usar `rub/`, adicione também `CHAIN`, `LP_TOKEN` etc em `.env.rub`.

---

## 🚀 Iniciando o bot automaticamente

### Passo único - orquestrador geral

```powershell
cd "c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"
node scripts/vscold-multi-complete.js
```

O script fará o seguinte de forma sequencial e sem intervenção:

1. gera metadados se houver (não impacta o bot);
2. cria pools de liquidez em ETH e BSC (se RPC válidos);
3. notifica agregadores (DexScreener etc);
4. deploya receivers se ainda não existirem;
5. a) inicia o **bot multi-chain** em background com log `bot-multi-out.log`;
   b) se existir `rub/`, mescla `.env` e executa o módulo rub (vende LP + farm fake);
6. exibe resumo final com etapas concluídas.

Se o passo 5 falhar, os logs `bot-multi-out.log` e `bot-multi-err.log` estarão na raiz.

> O bot principal continua rodando mesmo após o orquestrador terminar.

### Monitoramento contínuo
Use dois terminais separados para acompanhar:

```powershell
# Terminal A - pipeline de arbitragens
Get-Content multi-flash-arbbot.log -Wait

# Terminal B - reinvestimentos
Get-Content auto-reinvest.log -Wait
```

Para ver o status do módulo rub (quando ativo):

```powershell
Get-Content rub/whatever-log.txt -Wait   # não existe por padrão, mas você pode adicionar
```

---

## 🔄 Mantendo o bot ativo em caso de reinício da máquina

### ⏰ Agendamento automático (a cada 10 minutos)
Se você quer que o orquestrador seja executado sem sua intervenção em intervalos
regulares, basta registrar uma tarefa agendada do Windows que execute o comando
abaixo a cada 10 minutos. Um helper já foi incluído no repositório (`scripts/schedule-bot.ps1`).

```powershell
# exemplo de criação de tarefa manual (pode ser executado em qualquer terminal):
$action = New-ScheduledTaskAction -Execute "node" -Argument "scripts/vscold-multi-complete.js"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -TaskName "VSCOLD-AutoRestart" -Action $action -Trigger $trigger -Settings (New-ScheduledTaskSettingsSet -StartWhenAvailable)
```

# Alternativa: usar o script auxiliar

```powershell
cd "c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"
powershell -ExecutionPolicy Bypass -File scripts\schedule-bot.ps1
```

Isso criará a tarefa `VSCOLD-AutoRestart` que dispara a cada 10 minutos 24/7;
você não precisará confirmar nada e o bot reiniciará automaticamente.


## 🔄 Mantendo o bot ativo em caso de reinício da máquina

1. Crie um atalho ou tarefa agendada para executar o comando acima na inicialização do sistema.
2. Certifique‑se de iniciar um terminal com `cd` no diretório do projeto.
3. O script cuidará de tudo automaticamente.

> Alternativamente, use `pm2` ou `nssm` para executar o script em background como serviço.

```powershell
npm install -g pm2
pm2 start "node scripts/vscold-multi-complete.js" --name vscold
pm2 save
# pm2 resurrect após reboot
```

---

## 📝 Observações finais

- O bot está projetado para rodar **indefinidamente**; monitore apenas se houver erros de RPC ou saldo insuficiente.
- Ajuste os parâmetros (`MIN_PROFIT_USD`, `SLIPPAGE`, `REINVEST_PCT`) editando `.env` e reiniciando o orquestrador.
- O módulo `rub/` é totalmente independente: se quiser apenas executar o bot sem ele, basta removê‑lo ou deixar a pasta vazia.
- Logs são produzidos na raiz `multi-flash-arbbot.log` e `auto-reinvest.log`; faça rotação ou backup conforme necessário.

---

## 📌 Como parar o bot

```powershell
# descobrir PID
Get-Process node | Select-Object Name,Id,ProcessName
# matar processo
Stop-Process -Id <PID> -Force
```

> Se estiver usando `pm2`, faça `pm2 stop vscold`.

---

## 📦 Dados atuais do projeto (referência)

- Flash USDT contrato: `0x419ecA43dB68E868E68d1aB460c8AC32523c7540`
- FUSDT token: `0x419ecA43dB68E868E68d1aB460c8AC32523c7540`
- Routers: Uniswap V2 `0x7a250d...`, PancakeSwap `0x10ED4...`
- Padrão de pools: FUSDT/USDT, reinvest usando FUSDT/ETH ou FUSDT/BNB.

Esses valores já estão codificados nos scripts; altere apenas em `.env` se precisar de outra rede.

---

⛑️ **Pronto — basta executar `node scripts/vscold-multi-complete.js` e deixar o sistema
operar indefinidamente.**

Qualquer outra modificação futura pode ser documentada aqui.
