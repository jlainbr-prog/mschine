# GUIA MANUAL DE VERIFICAÇÃO NO ETHERSCAN

**Data:** 25 de fevereiro de 2026

## Contratos a Verificar

- **Contrato 1:** 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
- **Contrato 2:** 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11

---

## Passo 1: Acesse a página do Contrato no Etherscan

Para cada contrato, acesse:
```
https://etherscan.io/address/0x419ecA43dB68E868E68d1aB460c8AC32523c7540#code
```

ou 

```
https://etherscan.io/address/0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11#code
```

---

## Passo 2: Clique em "Verify and Publish"

Na página do contrato, você verá um botão **"Verify and Publish"** (em azul).

---

## Passo 3: Escolha o Método de Verificação

**Tipo:** `Solidity (Single File)`

> Isso usar o arquivo flattened (`TetherToken_Flattened.sol`)

---

## Passo 4: Preencha o Formulário

### Arquivo de Código-Fonte
Cola o conteúdo completo de `TetherToken_Flattened.sol` neste campo.

> **Como obter:** Abra o arquivo em VS Code (já está na raiz do projeto) ou copie:
> ```bash
> cat TetherToken_Flattened.sol
> ```

### Versão do Compilador
```
0.4.18
```

### Descrição da Licença (License)
```
MIT
```
(ou a que preferir; não afeta a verificação)

### Código de Otimização (Compiler Settings)
- **Is Optimization Enabled?** ✅ YES
- **Runs:** `200`

---

## Passo 5: Argumentos do Construtor (Opcional)

Se você sabe os argumentos usados no deploy, cole em formato **ABI-encoded**:

Exemplo (para valores típicos):
```
0000000000000000000000000000000000000000000000000000000000000000
```

Se não souber, deixe em branco e o Etherscan tentará inferir.

---

## Passo 6: Verifikace CAPTCHA e Envio

1. Preencha o CAPTCHA
2. Clique em "Verify and Publish"

---

## Passo 7: Aguarde Confirmação

A verificação deve levar **1-2 minutos**. Você receberá um email em seu endereço registrado no Etherscan.

Quando pronto:
- O código-fonte aparecerá na aba **"Code"** do contrato
- Será exibido "✔ Contract source code verified" em verde

---

## Referência Rápida de Valores

| Campo | Valor |
|-------|-------|
| Tipo | Solidity (Single File) |
| Compilador | 0.4.18 |
| Otimizador | Sim (200 runs) |
| Licença | MIT |
| Arquivo | `TetherToken_Flattened.sol` |

---

## Endereços a Verificar

```
Contrato 1: 0x419ecA43dB68E868E68d1aB460c8AC32523c7540
Contrato 2: 0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11
```

---

## Após Verificação

Após verificar ambos:
1. Volte aqui
2. Execute:
   ```bash
   git add GUIA_VERIFICACAO_MANUAL.md
   git commit -m "docs: Manual Etherscan verification guide - both contracts"
   git push
   ```

---

**Arquivo de Código-Fonte Preparado:** `TetherToken_Flattened.sol` (pronto para copiar-colar)
**Documentação Completa:** Este arquivo e os relatórios anteriores
