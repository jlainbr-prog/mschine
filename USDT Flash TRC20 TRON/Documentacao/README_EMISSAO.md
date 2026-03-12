# USDT Flash TRC20 TRON - Projeto Pronto para Emissão

## 📋 Descrição

Projeto completo e pronto para emitir tokens USDT em TRC-20 na blockchain TRON. Inclui contratos compilados, scripts de deploy, emissão e testes em testnet.

## ✅ Status do Projeto

- ✅ Contratos compilados (Solidity 0.4.18)
- ✅ Artefatos prontos em `build/contracts/`
- ✅ Testado em Nile testnet
- ✅ Primeira emissão: 1 bilhão + 10 bilhões + 1 trilhão de tokens
- ✅ Transferências verificadas na blockchain

## 📁 Estrutura de Pastas

```
USDT Flash TRC20 TRON/
├── Contratos/              # Código-fonte dos contratos Solidity
├── build/contracts/        # Artefatos compilados (.json)
├── Scripts/                # Scripts Node.js para operações
├── Resultados/             # JSON com histórico de emissões
├── Documentacao/           # Documentação e guias
├── tronbox.js              # Configuração TRON
├── package.json            # Dependências Node
└── README.md               # Este arquivo
```

## 🔧 Instalação

```bash
# Entrar na pasta
cd "USDT Flash TRC20 TRON"

# Instalar dependências
npm install

# Verificar instalação
npm ls tronweb
```

## 📡 Configuração de Rede

Atualmente configurado para:
- **Testnet Nile** (padrão): `https://nile.trongrid.io`
- **Testnet Shasta**: `https://api.shasta.trongrid.io`
- **Mainnet**: `https://api.trongrid.io` (adicione endereço real)

Para trocar de rede, edite `tronbox.js`:

```javascript
module.exports = {
  networks: {
    nile: { ... },    // Padrão: Nile testnet
    shasta: { ... },
    mainnet: { ... }  // Para mainnet, ADICIONE validações de segurança!
  }
};
```

## 🎯 Scripts Disponíveis

### 1. **Emitir Tokens Customizado** (RECOMENDADO)
```bash
npm run issue -- <quantidade>
# ou
node Scripts/emit_custom.js 1000000000    # 1 bilhão
node Scripts/emit_custom.js 10000000000   # 10 bilhões
node Scripts/emit_custom.js 1000000000000 # 1 trilhão
```

Resultado salvo em `Resultados/emission_*.json`

### 2. **Emitir 10 Bilhões (Pré-configurado)**
```bash
npm run issue
# ou
node Scripts/issue_tokens.js
```

### 3. **Emitir 1 Trilhão (Pré-configurado)**
```bash
npm run issue:1t
# ou
node Scripts/issue_tokens_1trillion.js
```

### 4. **Solicitar TRX da Faucet**
```bash
node Scripts/request_trx.js <endereco> [network]
# Exemplos:
node Scripts/request_trx.js TW6XkKvwZTF82YYbnRwXoop7ufwDuKDbrW nile
node Scripts/request_trx.js TW6XkKvwZTF82YYbnRwXoop7ufwDuKDbrW shasta
```

### 5. **Verificar Saldo**
```bash
npm run balance
# ou
node Scripts/check_balance.js
```

### 6. **Testar Transferência**
```bash
npm run transfer
# ou
node Scripts/test_transfer.js
```

### 7. **Deploy do Contrato** (se necessário)
```bash
npm run deploy
# ou
node Scripts/deploy.js
```

## 📊 Endereços Principais (Nile Testnet)

- **Contrato TRC20**: `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp`
- **Carteira Receptora**: `TW6XkKvwZTF82YYbnRwXoop7ufwDuKDbrW`
- **Chave Privada**: Configurada em `tronbox.js` (não compartilhe!)

## 🔐 Segurança

⚠️ **IMPORTANTE PARA MAINNET:**
1. Nunca commit a chave privada no repositório
2. Use variáveis de ambiente para credenciais
3. Teste em testnet ANTES de mainnet
4. Implemente validações adicionais de segurança
5. Considere usar multi-sig wallet para contratos de produção

## 📝 Fluxo de Emissão Futura

Para futuras emissões, siga este fluxo:

### Passo 1: Verificar Saldo de TRX
```bash
node Scripts/request_trx.js <seu_endereco> nile
```

### Passo 2: Verificar Saldo de Tokens
```bash
npm run balance
```

### Passo 3: Emitir Tokens
```bash
node Scripts/emit_custom.js 1000000000   # Customize a quantidade
```

### Passo 4: Verificar Resultado
```bash
npm run balance
# Verificar arquivo em: Resultados/emission_*.json
```

## 🔍 Verificação OnChain

Todos os hashes de transação podem ser verificados em:
- **Nile**: https://nile.tronscan.org/
- **Shasta**: https://shasta.tronscan.org/
- **Mainnet**: https://tronscan.org/

Cole o TX hash ou endereço do contrato para verificar.

## 📈 Histórico de Emissões

Todos os resultados são salvos em `Resultados/`:
- `deployment_result.json` - Deploy inicial do contrato
- `transfer_result.json` - Primeira transferência de teste
- `issue_result.json` - Emissão de 10 bilhões
- `issue_result_1trillion.json` - Emissão de 1 trilhão
- `emission_*.json` - Novas emissões (customizadas)

## 🛠️ Troubleshooting

### Erro: "CONTRACT_VALIDATE_ERROR"
- **Causa**: Conta sem saldo de TRX
- **Solução**: Solicite TRX na faucet

### Erro: "Invalid private key"
- **Causa**: Chave privada malformada em `tronbox.js`
- **Solução**: Verifique o formato (deve ter 64 caracteres hexadecimais)

### Erro: "Connection timeout"
- **Causa**: Endpoint TRON indisponível
- **Solução**: Tente mudar de rede ou aguarde

### Tokens não aparecem na carteira UI
- **Solução**: Adicione manualmente o contrato na carteira
  - Address: `TYm8MYNHrXexqyBJ1A6hENcuAoEKHqCmwp`
  - Symbol: `USDT`
  - Decimals: `6`

## 📞 Informações Técnicas

- **Blockchain**: TRON
- **Padrão**: TRC-20 (equivalente a ERC-20)
- **Decimals**: 6
- **Solidity Version**: 0.4.18
- **Status**: Testado ✅

## 📚 Contratos Inclusos

1. **TetherToken.sol** - Contrato principal (combinado/flattened)
2. **BasicToken.sol** - Base de token (ERC20Basic)
3. **StandardToken.sol** - Aprovações (allowance)
4. **StandardTokenWithFees.sol** - Taxa de transferência
5. **SafeMath.sol** - Operações matemáticas seguras
6. **Ownable.sol** - Controle de acesso
7. **Pausable.sol** - Pausa de transferências
8. **BlackList.sol** - Lista de bloqueio

## 🎓 Próximos Passos

1. ✅ **Testnet Nile**: Emissões completadas com sucesso
2. ⬜ **Testnet Shasta**: Testar com diferentes configurações (opcional)
3. ⬜ **Mainnet TRON**: Após validação final (REQUER SEGURANÇA ADICIONAL)

## 📄 Licença

MIT

---

**Última Atualização**: 31 de Janeiro de 2026
**Versão**: 1.0.0
**Status**: Pronto para produção (testnet validado)
