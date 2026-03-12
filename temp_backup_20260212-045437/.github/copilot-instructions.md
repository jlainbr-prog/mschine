# Instruções para agentes IA — Contrato Flash USDT (Solidity 0.4.18)

## Arquitetura do projeto

**Stack de contratos em herança**: `SafeMath` → `BasicToken` (ERC20Basic, balance) → `StandardToken` (allowances) → `StandardTokenWithFees` (taxa de transferência) → `TetherToken` (adições: pausável, blacklist, deprecação e upgrade).

**Padrão de upgrade**: `TetherToken` suporta deprecação para um endereço `upgradedAddress`. Ao deprecar, todas as operações (transfer, approve, etc.) delegam para `UpgradedStandardToken` em vez de executarem localmente.

**Contratos auxiliares**:
- `Ownable`: base para controle de acesso via `onlyOwner` (deploy, issue, redeem, blacklist, pausa, deprecação)
- `Pausable`: permite owner pausar/despausar transferências (`whenNotPaused`)
- `BlackList`: mapping `isBlackListed` que bloqueia transfer/transferFrom para endereços listados
- `MultiSigWallet`: gerenciamento multisig separado (não integrado ao token principal)
- `Migrations`: Truffle migration script

## Padrões e convenções

1. **Nomenclatura de arquivos**: "File N" (ex: `File 1 BasicToken.sol`, `File 10 TetherToken.sol`) — mantenha referências exatas ao editar ou criar PRs.

2. **Sintaxe Solidity 0.4.x**:
   - Construtores nomeados: `function TetherToken(...) public { ... }` (não `constructor`)
   - Eventos sem `emit`: `Transfer(from, to, value)` em vez de `emit Transfer(...)`
   - Qualificadores `constant` e `view` coexistem; preferir `view` para novo código
   - `require` para assertions (não `throw`)

3. **SafeMath obrigatório**: `using SafeMath for uint256` em contratos que somam/subtraem (BasicToken, StandardToken, StandardTokenWithFees). Todas as operações críticas (transfer, issue, redeem) usam `.add()` e `.sub()`.

4. **Artefatos compilados**: `Contract ABI.txt`, `Byte Code.txt`, `Constructor Argument.txt` — gerados via Remix/IDE, podem ser usados para deploy sem recompilação.

## Fluxos críticos e riscos de segurança

### Operações administrativas (todas `onlyOwner`):
- **`issue(amount)`** + **`redeem(amount)`**: manipulam `_totalSupply` e saldo do owner sem verificação de limite. Owner pode inflar/desinflar suprimento arbitrariamente.
- **`deprecate(address)`**: redireciona lógica para contrato externo; confiança total no novo endereço é necessária.
- **`pause()`** + **`unpause()`**: bloqueia transferências globalmente.
- **`addBlackList(address)`** + **`removeBlackList(address)`**: marca endereços como censurados.
- **`destroyBlackFunds(address)`**: **operação irreversível** — zera saldo de endereço blacklistado e reduz `_totalSupply`. Nenhuma recuperação possível.

### Pontos de integração:
- **transfer/transferFrom**: ambas verificam `!isBlackListed[sender]` antes de processar e delegam para `upgradedAddress` se `deprecated == true`.
- **Eventos**: `Transfer`, `Approval`, `Issue`, `Redeem`, `Pause`, `Unpause`, `AddedBlackList`, `RemovedBlackList`, `DestroyedBlackFunds`, `Deprecate`.

## Workflow de desenvolvimento

### Compilação (Hardhat — recomendado)
```bash
npm install  # instala @nomiclabs/hardhat-ethers, ethers, chai
npx hardhat compile  # compila contra solc 0.4.18 (configurado em hardhat.config.js)
```

### Testes
```bash
npx hardhat test  # executa test/tether.test.js (fixtures: owner, addr1, addr2; casos: deploy, transfer, approve/transferFrom, issue, redeem)
```

### Remix (alternativa sem CLI)
1. Abra https://remix.ethereum.org
2. Upload de `File 1..10 *.sol` (ou use `TetherToken_combined.sol` + remova imports)
3. Selecione compilador `0.4.18`, compile `File 10 TetherToken.sol`
4. Exporte ABI/bytecode do painel "Compile"

### Modernização para Solidity 0.8+ (tarefa segura com validação)
Se solicitado, sempre:
1. Atualize `pragma` para `^0.8.19`
2. Converta `function TetherToken(...) {}` → `constructor() {}`
3. Adicione `emit` em eventos
4. Teste com `npx hardhat test` após cada arquivo
5. Documente breaking changes (SafeMath não necessário em 0.8+)

## Checklist para prompts seguros de agentes

✓ **Seguro**: análise estática, testes, documentação, refatoração sem mudança de lógica, modernização com testes  
✗ **Requer review humano**: mudanças na lógica de controle (is, redeem, blacklist), remoção de funções administrativas, deploy para mainnet

## Referência de arquivos-chave

- **Arquivo principal**: [File 10 TetherToken.sol](File%2010%20TetherToken.sol) — orquestra herança + deprecated/upgrade
- **Herança de token**: [File 8 StandardToken.sol](File%208%20%20StandardToken.sol), [File 9 StandardTokenWithFees.sol](File%209%20StandardTokenWithFees.sol)
- **Controle**: [File 5 Ownable.sol](File%205%20%20Ownable.sol), [File 2 BlackList.sol](File%202%20BlackList.sol), [File 6 Pausable.sol](File%206%20Pausable.sol)
- **Testes**: [test/tether.test.js](test/tether.test.js)
- **Segurança**: [security-report.md](security-report.md)