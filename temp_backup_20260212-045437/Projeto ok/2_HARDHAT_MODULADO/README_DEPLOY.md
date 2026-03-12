Checklist de Deploy Seguro — TetherToken

1) Preparação (local)
- Instalar dependências:
  npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers dotenv
- (Opcional para verificação) instalar plugin etherscan:
  npm install --save-dev @nomiclabs/hardhat-etherscan

2) Arquivos importantes
- `hardhat.config.js`: configure `networks` com RPC URL e accounts (use `.env`).
- `.env` (não versionar):
  - `RPC_URL`: URL do provider (Alchemy/Infura/Node)
  - `PRIVATE_KEY`: chave privada do signer (use multisig ou chave temporária em testnet)
  - `ETHERSCAN_API_KEY`: para verificação automática

3) Passos para deploy em testnet
- Configure `.env` com `RPC_URL` e `PRIVATE_KEY`.
- Execute (exemplo Goerli/Sepholia):
  npx hardhat run --network <network> Projeto\ ok/2_HARDHAT_MODULADO/scripts/deploy_testnet.js

4) Emissão via Multisig
- O script `deploy_testnet.js` pode deployar `TetherToken`, deployar `MultiSigWallet` (N-of-M), transferir `owner` para multisig e submeter a transação de `issue`.
- Confirme N-of-M e fundos do multisig antes de executar.

5) Verificação do contrato
- Após deploy, rode (se plugin instalado):
  npx hardhat verify --network <network> <CONTRACT_ADDRESS> "<constructorArg1>" "<constructorArg2>" ...

6) Checklist de segurança antes da emissão real (mainnet)
- Auditoria externa concluída e aceita
- Owner migrado para MultiSig (N>=2)
- Chaves armazenadas em HSM ou signer service
- Teste completo em testnet replicando o fluxo de emissão
- Backup de ABIs, bytecode e constructor args
- Plano de rollback/upgrade (contrato `deprecate` pronto)

7) Execução final (mainnet)
- Repetir passos de deploy em mainnet com `PRIVATE_KEY` do multisig (ou usar multisig para executar issuance)
- Registrar transações e publicá-las no canal de governança

---
Arquivos úteis:
- scripts/deploy_testnet.js — deploy + multisig + submit issue
- scripts/deploy_multisig_issue.js — fluxo de teste local (já presente)

Se quiser, eu executo o deploy em testnet: envie o `RPC_URL` e `PRIVATE_KEY` (preferencialmente uma conta de teste) ou autorize que eu guie você passo-a-passo para executar localmente.
