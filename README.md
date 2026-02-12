# scripts/setExactBalance.js

Este repositório contém um script para ajustar o saldo exato de um endereço no token `0x419ecA43dB68E868E68d1aB460c8AC32523c7540` (USDT no contexto deste projeto) — apenas para uso em ambientes controlados.

ATENÇÃO: Este script realiza operações administrativas (`mint`/`burn`). Use apenas com chaves que você controla e em contratos onde sua conta tem permissão.

Como usar

1. Copie `.env.example` para `.env` e preencha os valores:

```
PRIVATE_KEY=0xSEU_PRIVATE_KEY
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/SUA_KEY
TOKEN_ADDR=0x419ecA43dB68E868E68d1aB460c8AC32523c7540
#TARGET=374625537617239860000000000000
```

2. Instale dependências:

```bash
npm install
```

3. Execute:

```bash
npm run set-balance
```

O script verifica se o contrato expõe `mint(address,uint256)` e `burn(uint256)` antes de tentar as operações. Se faltar a função necessária (por exemplo, faltar `burn` quando o saldo está acima do alvo), o script aborta com mensagem de erro.

Notas de segurança

- Nunca exponha sua chave privada. Não commit o `.env`.
- Use um `RPC_URL` com permissão para enviar transações (Alchemy/Infura ou seu nó).
- Operações `mint`/`burn` podem ser irreversíveis; tenha certeza do que está fazendo.

Contato

Se precisar que eu adicione verificações adicionais, logs ou um modo "dry-run" (apenas calcular diferença sem enviar tx), solicite e eu implemento.
