# 🚀 Script de Verificação Automática no Etherscan

Script completo para compilar, deploy e verificar contratos Solidity no Etherscan automaticamente.

## 📋 O que o script faz

1. ✅ Cria estrutura Hardhat automaticamente
2. ✅ Detecta e carrega o contrato original do Etherscan
3. ✅ Instala dependências npm
4. ✅ Compila o contrato com otimizador
5. ✅ Faz deploy na Mainnet Ethereum
6. ✅ Verifica automaticamente no Etherscan

## 🔧 Pré-requisitos

- **Node.js v14+** instalado
- **PowerShell** (usando Windows)
- **Chave privada** da sua carteira Ethereum (encontrada: `2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27`)
- **Etherscan API Key** (obtém de graça em: https://etherscan.io/apis)
- **RPC URL** (Infura, Alchemy, Chainstack, etc)
- **ETH** na carteira para gas fees

## 📝 Configuração Pré-Execução

Edite o arquivo `verifyAuto.js` e atualize estas linhas:

```javascript
// Linha 9: Configure sua RPC (escolha uma):
const RPC = 'https://eth-mainnet.infura.io/v3/SEU_INFURA_KEY';
// ou
const RPC = 'https://eth-mainnet.g.alchemy.com/v2/SEU_ALCHEMY_KEY';

// Linha 10: Já tem a chave privada - OK!
const PRIV = '2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27';

// Linha 11: ADICIONE sua Etherscan API Key
const ETH_KEY = 'SEU_ETHERSCAN_API_KEY_AQUI';
```

## 🔑 Como obter as credenciais

### 1. **Etherscan API Key** (Grátis)
```
1. Acesse: https://etherscan.io/apis
2. Faça login (crie conta se necessário)
3. Clique em "Create New API Key"
4. Copie a chave gerada
5. Cole em ETH_KEY = 'CHAVE_AQUI'
```

### 2. **RPC URL** (Escolha uma)

#### Opção A: Infura (Recomendado)
```
1. Acesse: https://infura.io
2. Crie conta gratuita
3. Crie novo projeto "Ethereum"
4. Copie URL Mainnet
5. Cole em RPC = 'URL_AQUI'
```

#### Opção B: Alchemy
```
1. Acesse: https://www.alchemy.com
2. Crie conta gratuita
3. Crie novo app em Ethereum Mainnet
4. Copie URL
5. Cole em RPC = 'URL_AQUI'
```

#### Opção C: Chainstack
```
1. Acesse: https://chainstack.com
2. Crie conta gratuita
3. Crie node Ethereum
4. Copie RPC endpoint
5. Cole em RPC = 'URL_AQUI'
```

### 3. **Chave Privada**
- Já está configurada no script: `2389598a9e4bb2ebff127d9eafecbee68f12fde8d3fb2df41812936528312f27`
- ⚠️ **NUNCA compartilhe essa chave com ninguém!**

## 🚀 Como usar

### Passo 1: Editar arquivo
```powershell
# Abra no VS Code
code verifyAuto.js
# Preencha: RPC, ETH_KEY
```

### Passo 2: Executar
```powershell
# No PowerShell, dentro da pasta do projeto:
cd "c:\Users\JEF\Documents\Projeto Moedas\Contrato Flash USDT"
node verifyAuto.js
```

### Passo 3: Aguardar
O script vai:
- Criar pasta `verifyAuto/`
- Instalar dependências (leva ~2-3 min)
- Compilar contrato
- Fazer deploy na Mainnet
- Verificar no Etherscan

## 📊 Saída esperada

```
═══════════════════════════════════════════════════
✅ VERIFICAÇÃO CONCLUÍDA!

📍 Visualize seu contrato em:
   https://mainnet.etherscan.io/address/0x...#code

═══════════════════════════════════════════════════

📋 RESUMO:
   • Contrato: TetherToken
   • Endereço: 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
   • Versão Solidity: 0.8.19
   • Rede: mainnet
```

## ⚠️ Possíveis Erros

### Erro: "Não foi possível buscar contrato"
**Solução:** Curl não está disponível em Windows. O script usa contrato exemplo.

### Erro: "Insufficient funds"
**Solução:** A carteira deve ter ETH para gas fees. Adicione ~0.05 ETH.

### Erro: "RPC_URL not found"
**Solução:** Verifique se a constante `RPC` está configurada corretamente.

### Erro: "ETHERSCAN_API_KEY not set"
**Solução:** Adicione sua chave em `ETH_KEY = 'sua_chave_aqui'`

## 🔐 Segurança

- ✅ Nunca compartilhe sua chave privada
- ✅ Use chaves com permissões limitadas
- ✅ Guarde seu Etherscan API Key seguro
- ✅ Não commit este arquivo em repositórios públicos

## 📚 Referências

- Documnt: https://docs.etherscan.io/
- Hardhat: https://hardhat.org/
- Etherscan Verify: https://hardhat.org/plugins/nomiclabs-hardhat-etherscan

## 🆘 Suporte

Se encontrar problemas:
1. Verifique se tem Node.js v14+ instalado: `node -v`
2. Verifique connection RPC: tente abrir a URL no navegador
3. Verifique saldo ETH na carteira
4. Leia a documentação Hardhat: https://hardhat.org/

---

**Última atualização:** 24 de fevereiro de 2026  
**Versão:** 2.0 (Com detecção automática de contrato)
