# 🔐 Scripts de Verificação Etherscan

Este diretório contém scripts automatizados para verificar contratos inteligentes no Etherscan.

## 📋 Arquivos

### `etherscan_verify.py`
Script Python para submeter contratos para verificação no Etherscan via API.

**Características:**
- ✅ Submissão automática em lote
- ✅ Verificação de status
- ✅ Tratamento de erros
- ✅ Relatório detalhado
- ✅ Suporte a múltiplos contratos

---

## 🚀 Uso Rápido

### 1. Instalação

**Python 3.6+:**
```bash
# Verificar versão
python --version  # ou python3

# Instalar dependências
pip install requests
```

### 2. Obter API Key

1. Acesse: https://etherscan.io/apis
2. Crie uma conta gratuita (se não tiver)
3. Clique em "New API Key"
4. Copie a chave gerada

### 3. Executar Script

**Para verificar ambos os contratos:**
```bash
python scripts/etherscan_verify.py --key YOUR_API_KEY
```

Substitua `YOUR_API_KEY` pela chave obtida acima.

**Exemplo Com Chave Real:**
```bash
python scripts/etherscan_verify.py --key "abcdef123456789ghijklmnop"
```

---

## 💻 Comandos Disponíveis

### Verificar Ambos os Contratos
```bash
python etherscan_verify.py --key YOUR_API_KEY
```

### Verificar Contrato Específico
```bash
python etherscan_verify.py --key YOUR_API_KEY --contract 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
```

### Usar Arquivo Source Diferente
```bash
python etherscan_verify.py --key YOUR_API_KEY --source /path/to/file.sol
```

### Verificar Status de Submissão
```bash
python etherscan_verify.py --key YOUR_API_KEY --check-guid GUID_HERE
```
(Substitua `GUID_HERE` pelo GUID retornado na submissão)

### Exibir Ajuda
```bash
python etherscan_verify.py --help
```

---

## 📊 Exemplo de Saída

```
============================================================
ETHERSCAN CONTRACT VERIFICATION
============================================================

✅ Source code loaded: 45632 characters

📤 Submitting verification for: 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
   Contract: TetherToken
   Compiler: v0.4.18
   Optimization: Enabled (200 runs)
✅ Submitted successfully!
   GUID: abcd1234efgh5678ijkl9012mnop3456

📤 Submitting verification for: 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
   Contract: TetherToken
   Compiler: v0.4.18
   Optimization: Enabled (200 runs)
✅ Submitted successfully!
   GUID: efgh5678ijkl9012mnop3456qrst7890

============================================================
VERIFICATION RESULTS
============================================================

✅ 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
   Status: Submitted
   GUID: abcd1234efgh5678ijkl9012mnop3456
   Check status: https://etherscan.io/address/0x419ecA43dB68E868E68d1aB460c8AC32523c7540

✅ 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
   Status: Submitted
   GUID: efgh5678ijkl9012mnop3456qrst7890
   Check status: https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11

============================================================
NEXT STEPS:
============================================================
1. Visit https://etherscan.io/address/{CONTRACT_ADDRESS}
2. Look for 'Contract Source Code Verified' message
3. Source code should appear in the Contract tab
4. ABI will be auto-populated
5. Verification usually takes 30-60 seconds
============================================================
```

---

## 🔍 Acompanhar Status

Depois de submeter, você pode verificar o status:

**Opção 1: Via Website**
```
https://etherscan.io/address/0x419ecA43dB68E868E68d1aB460c8AC32523c7540
```
Procure por: "Contract Source Code Verified ✓"

**Opção 2: Via Script**
```bash
python etherscan_verify.py --key YOUR_API_KEY --check-guid GUID_AQUI
```

---

## ⚙️ Configuração Padrão do Script

O script foi configurado com as seguintes definições:

```python
CONTRACT_NAME = "TetherToken"
COMPILER_VERSION = "v0.4.18"
OPTIMIZATION_ENABLED = "1"  # Sim
OPTIMIZATION_RUNS = "200"
SPDX_LICENSE = "MIT"
```

Você pode modificar estas constantes no arquivo `etherscan_verify.py` se necessário.

---

## 🐛 Solução de Problemas

### Erro: "No module named 'requests'"
**Solução:**
```bash
pip install requests
```

### Erro: "API key not valid"
**Solução:**
- Verifique se a chave está correta
- Gere uma nova em https://etherscan.io/apis

### Erro: "File not found"
**Solução:**
- Confirme que `contracts/TetherToken.sol` existe
- Use `--source` para especificar o caminho correto:
```bash
python etherscan_verify.py --key YOUR_KEY --source /path/to/file.sol
```

### Erro: "Bytecode does not match"
**Solução:**
- Não modifique o arquivo de source code
- Recompile com a mesma versão (0.4.18)
- Use a otimização (200 runs)

### Erro: "Timeout"
**Solução:**
- Aguarde alguns minutos
- Tente novamente com `--check-guid` para verificar status anterior

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- ✅ Nunca compartilhe sua chave API
- ✅ Não faça commit da chave no Git
- ✅ Use variáveis de ambiente em produção:

```bash
# Linux/macOS
export ETHERSCAN_KEY="your_key_here"
python etherscan_verify.py --key $ETHERSCAN_KEY

# Windows
set ETHERSCAN_KEY=your_key_here
python etherscan_verify.py --key %ETHERSCAN_KEY%
```

---

## 📈 Estrutura do Script

```python
EtherscanVerifier
├── __init__(api_key, source_code_file)
├── load_source_code()
├── submit_verification(contract_address)
├── check_verification_status(guid)
├── verify_all_contracts()
└── print_results(results)
```

---

## 🎯 Checklist de Execução

```
✅ Python 3.6+ instalado
✅ requests instalada (pip install requests)
✅ API Key do Etherscan obtida
✅ Arquivo TetherToken.sol existe
✅ Contratos já deployados no Ethereum mainnet
✅ Você tem acesso à internet
✅ Endereços dos contratos corretos
✅ Argumentos do construtor preparados
```

---

## 📞 Suporte

Se encontrar problemas:

1. **Leia:**
   - [ETHERSCAN_VERIFICATION_GUIDE.md](../ETHERSCAN_VERIFICATION_GUIDE.md)
   - [ETHERSCAN_QUICK_START.md](../ETHERSCAN_QUICK_START.md)

2. **Verifique:**
   - Arquivo `contracts/TetherToken.sol` existe
   - Chave API está correta
   - Internet está funcionando
   - Contratos estão em Ethereum Mainnet

3. **Contate:**
   - Suporte do Etherscan: https://etherscan.io/support

---

## 📝 Próximos Passos

1. ✅ Execute o script de verificação
2. ✅ Aguarde confirmação de submissão
3. ✅ Acompanhe o status via Etherscan
4. ✅ Confirme "Contract Source Code Verified"
5. ✅ Atualize seu README com links

---

## 📜 Licença

MIT License - Veja LICENSE para detalhes

---

## 📌 Referências

- **Etherscan API:** https://docs.etherscan.io/
- **Verify Contract:** https://etherscan.io/verifyContract
- **Smart Contract Verification:** https://docs.etherscan.io/contract-apis/contracts

---

## 🚀 Começar Agora

```bash
# 1. Instale dependências
pip install requests

# 2. Obtenha API Key em https://etherscan.io/apis

# 3. Execute
python etherscan_verify.py --key YOUR_API_KEY
```

**Pronto!** ✅ Seus contratos serão verificados automaticamente.

---

*Última atualização: 2024*
*Versão: 1.0*
