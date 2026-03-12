# Projeto: Contrato Flash USDT

Este repositório contém um conjunto de contratos Solidity (versão 0.4.x) — um token estilo Tether com camadas: SafeMath → BasicToken → StandardToken → StandardTokenWithFees → TetherToken, além de contratos auxiliares (`Ownable`, `Pausable`, `BlackList`, `MultiSigWallet`, `Migrations`).

Este README explica como compilar e testar os contratos localmente (Remix / Truffle / Hardhat), e notas de segurança e migração.

## Artefatos importantes
- `File 1 BasicToken.sol` … `File 10 TetherToken.sol` — arquivos fonte originais (Solidity 0.4.x).
- `TetherToken_combined.sol` — concatenação literal dos 10 arquivos, preservando exatamente os pragmas/imports e o conteúdo original. Use com atenção (veja abaixo).

## Recomendação rápida para usar no Remix
Opções para compilar no Remix:

1) Upload dos arquivos individuais
- Abra https://remix.ethereum.org
- Crie um novo workspace e faça upload de todos os `File N *.sol` (1..10).
- Selecione o compilador `0.4.18` no painel "Solidity Compiler" e compile `File 10 TetherToken.sol` (ou outro que queira).

2) Usar `TetherToken_combined.sol` (se quiser um só arquivo)
- Observação importante: `TetherToken_combined.sol` é uma concatenação literal — ele ainda contém linhas `import "./..."` em algumas seções. Se você carregar somente esse arquivo no Remix, os imports residuais podem falhar.
- Duas abordagens:
  - (a) Carregue também os arquivos referenciados pelos `import` (por ex. `SafeMath.sol`) na mesma pasta do workspace Remix; então compile o arquivo combinado.
  - (b) Remova as linhas `import` do `TetherToken_combined.sol` antes de compilar. Um comando PowerShell rápido (no Windows) para gerar uma cópia sem `import` é:

```powershell
# cria uma cópia sem linhas que contenham 'import '
Get-Content .\TetherToken_combined.sol | Where-Object { $_ -notmatch '^\s*import\s' } | Set-Content .\TetherToken_combined_noimports.sol
```

- No Remix, então abra `TetherToken_combined_noimports.sol`, selecione compilador `0.4.18` e compile.

Configurações do compilador recomendadas em Remix:
- Versão: `0.4.18`
- Optimization: Off (padrão) — habilite apenas se souber o impacto nas gas/contratos.

## Usando Truffle
- Instale Truffle globalmente (opcional) e inicialize projeto:

```powershell
npm init -y; npm install --save-dev truffle
npx truffle init
```

- Em `truffle-config.js`, force o compilador 0.4.18:

```js
module.exports = {
  compilers: {
    solc: {
      version: "0.4.18"
    }
  }
};
```

- Coloque os arquivos `File N *.sol` em `contracts/` e crie uma migration em `migrations/` para deploy.
- Compile e migre:

```powershell
npx truffle compile
npx truffle migrate --network development
```

## Esqueleto Hardhat (rápido)
Se quiser testes modernos com `ethers.js` + Hardhat:

```powershell
npm init -y; npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
npx hardhat # escolher "Create an empty hardhat.config.js" ou projeto sample
```

Edite `hardhat.config.js` para usar Solidity 0.4.18, por exemplo:

```js
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.4.18",
};
```

Coloque os arquivos `File N` em `contracts/` e crie testes em `test/` com Mocha/Chai e ethers.js. Exemplos de testes a criar (prioridade mínima):
- deploy do `TetherToken` e checagem de `totalSupply` e `balanceOf(owner)`;
- transfer / transferFrom fluxo;
- `issue` / `redeem` (somente owner);
- blacklist: `addBlackList`, tentar transferir do endereço bloqueado;
- pause/unpause: checar `whenNotPaused` impede transferências.

Comandos para executar testes (após ter os arquivos):

```powershell
npx hardhat test
```

## Notas de segurança e auditoria rápida
- Os contratos usam padrões antigos (Solidity 0.4.x): construtores nomeados, `throw` em alguns locais, eventos sem `emit`. Não faça upgrade automático sem revisão.
- Funções administrativas críticas:
  - `issue` e `redeem` podem criar/queimar tokens pelo `owner` — mantenha chaves seguras.
  - `destroyBlackFunds` remove saldo de endereços na blacklist — risco centralizado e irreversível.
  - `deprecate` e `upgradedAddress` transferem lógica para um contrato externo — revise o contrato `upgradedAddress` antes de apontar.
- Recomendado: rodar análise estática (`solhint`, `slither`) e testes unitários completos antes de deploy.

## Próximos passos recomendados
- Gerar testes unitários (Hardhat) cobrindo os fluxos listados acima (posso gerar um esqueleto se você quiser).
- (Opcional) Modernizar para Solidity 0.8.x — é um trabalho não-trivial (mudar sintaxe, overflow checks, events `emit`, migrar `throw`), recomendo testes e revisão de breaking changes.

---
Se quiser, eu posso agora:
- Gerar `README.md` (feito) e também criar um esqueleto Hardhat + testes básicos (marque que quer que eu gere a tarefa 4 e eu crio os arquivos). 
- Criar `TetherToken_combined_noimports.sol` automaticamente (removendo linhas de import) e colocá-lo no repositório para uso imediato no Remix.
