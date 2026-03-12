WalletConnect QR Generator — Deploy via Trust Wallet (Mainnet)

1) Avisos IMPORTANTES
- Rede: MAINNET (ETH real). Transações são PERMANENTES e custam ETH.
- Não execute sem ter fundos e sem completar o CHECKLIST_MAINNET_COMPLETO.txt
- Recomendo testar antes em Sepolia

2) Instalar dependências (na pasta TRUSTWALLET_DEPLOY):

```bash
cd "EXECUTAVEIS/TRUSTWALLET_DEPLOY"
npm install @walletconnect/client qrcode-terminal
```

3) Gerar QR (vai imprimir URI + QR ASCII no terminal):

```bash
node walletconnect_qr_generator.js
```

4) Conectar Trust Wallet:
- Abra Trust Wallet no celular
- Settings → WalletConnect → Scan QR
- Aponte para o QR do terminal

5) Depois de conectado:
- Use Remix ou o DApp que emite a transação (deploy) apontando para a sessão WalletConnect
- No Remix, selecione "Connect with WalletConnect" (ou plugin WalletConnect) para que as transações mandem para sua Trust Wallet

6) Deploy do bytecode via Remix:
- Abra Remix (https://remix.ethereum.org)
- Em "Deploy & Run Transactions", selecione "WalletConnect"/conexão
- Cole `Contract_Bytecode.txt` como bytecode se necessário
- Insira `Constructor_Args.txt` nos campos do construtor
- Clique Deploy → Trust Wallet irá pedir assinatura

7) Segurança:
- Verifique endereço do contrato destino antes de confirmar
- Revise gas limit / gas price
- Para MAINNET, faça backup das chaves privadas e use hardware wallet se possível


Se quiser, eu posso: 
- Gerar o QR agora (precisa que você rode o script localmente) 
- Ou te guiar passo-a-passo para fazer o deploy pelo Remix após conectar a Trust Wallet
