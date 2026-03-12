siGuia rápido: Deploy via Remix + Trust Wallet (WalletConnect)

1) Requisitos:
 - Trust Wallet no celular
 - Remix IDE (https://remix.ethereum.org) no desktop
 - Arquivos: Contract_ABI.json, Contract_Bytecode.txt, Constructor_Args.txt

2) Passos no Remix:
 - Abra Remix → "Solidity".
 - Vá em "Deploy & Run Transactions" (aba lateral).
 - Em "Environment" selecione "Injected Provider - MetaMask" (mas para Trust Wallet: use WalletConnect plugin no Remix ou abra via browser móvel).

3) Conectar Trust Wallet:
 - No Remix web, clique em "Connect to WalletConnect" (ou use o plugin WalletConnect).
 - Abra Trust Wallet → Settings → WalletConnect → escaneie o QR code exibido pelo Remix.
 - Após conectar, Remix usará Trust Wallet como signer.

4) Deploy do bytecode:
 - Em Remix, abra a aba "Compile" e selecione "Bytecode" (ou cole o conteúdo de Contract_Bytecode.txt em um novo arquivo e compile manualmente se necessário).
 - Em "Deploy" forneça os argumentos do construtor (veja Constructor_Args.txt).
 - Clique em "Deploy"; Trust Wallet pedirá confirmação no celular.
 - Confirme; aguarde a transação ser minerada.

5) Pós-deploy:
 - Copie o endereço do contrato
 - Use Contract_ABI.json para interagir via Remix ou Etherscan
 - Salve `address`, `txHash` e `network` em local seguro

6) Observações de segurança:
 - Nunca conecte a sua carteira principal sem revisar as taxas e o destino do contrato
 - Verifique o `constructor args` antes de confirmar
 - Para MAINNET, verifique checklist e custos


Se quiser, eu já coloquei os arquivos preparados em:
`EXECUTAVEIS/TRUSTWALLET_DEPLOY/`

Quer que eu gere o QR de WalletConnect agora (para deploy real) ou prefere que eu mostre o comando final para enviar o bytecode raw (não recomendado sem wallet conectada)?