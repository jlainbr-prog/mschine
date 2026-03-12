# Auditoria de Segurança Detalhada — Contrato Flash USDT (Tether-like)

**Data**: 20 de janeiro de 2026  
**Versão Solidity**: 0.4.18  
**Stack**: SafeMath → BasicToken → StandardToken → StandardTokenWithFees → TetherToken  

---

## 📊 Resumo Executivo

O contrato `TetherToken` é um token ERC20 com recursos avançados (taxas, pausa, blacklist, deprecação). **Achado crítico**: não há proteção contra transferência não autorizada após deprecação (upgrade), dependência total do novo contrato ser seguro. Recomendações: implementar time-lock, exigir multisig, adicionar validações.

---

## 🔍 Achados de Segurança

### 1️⃣ **CRÍTICO: Mecanismo de Upgrade (Deprecação) sem Validação**

**Localização**: [File 10 TetherToken.sol](File%2010%20TetherToken.sol#L103-L108)

```solidity
function deprecate(address _upgradedAddress) public onlyOwner {
    require(_upgradedAddress != address(0));
    deprecated = true;
    upgradedAddress = _upgradedAddress;
    Deprecate(_upgradedAddress);
}
```

**Risco**:
- Uma vez que `deprecated = true`, TODAS as operações (transfer, approve, balanceOf, etc.) delegam para `upgradedAddress`
- Se `upgradedAddress` for um contrato malicioso ou tiver bugs, **TODOS os fundos são comprometidos**
- Não há período de transição ou reversão

**Cenários de Ataque**:
1. Owner alterado/chave comprometida → aponta para contrato malicioso → confisco de fundos
2. Bug no novo contrato → perda permanente de fundos
3. Falta de validação do novo bytecode → ninguém pode verificar antecipadamente

**Recomendações**:
- ✅ **Time-lock**: Implementar atraso (e.g., 7 dias) entre chamada de `deprecate()` e ativação (variável `deprecated = true`)
- ✅ **Multisig ou governança**: Exigir aprovação de múltiplos signatários antes de upgrade
- ✅ **Publicar novo bytecode**: Documentar e verificar o novo contrato antes de ativar
- ✅ **Teste de compatibilidade**: Validar que `UpgradedStandardToken` implementa todas as funções corretamente

---

### 2️⃣ **CRÍTICO: Operação Irreversível `destroyBlackFunds()`**

**Localização**: [File 10 TetherToken.sol](File%2010%20TetherToken.sol#L152-L158)

```solidity
function destroyBlackFunds (address _blackListedUser) public onlyOwner {
    require(isBlackListed[_blackListedUser]);
    uint dirtyFunds = balanceOf(_blackListedUser);
    balances[_blackListedUser] = 0;
    _totalSupply = _totalSupply.sub(dirtyFunds);
    DestroyedBlackFunds(_blackListedUser, dirtyFunds);
}
```

**Risco**:
- Zera o saldo de um endereço na blacklist e reduz supply
- **NÃO há reversão** — os fundos são perdidos permanentemente
- Sem período de recurso ou notificação prévia

**Cenários de Abuso**:
1. Owner erroneamente marca endereço como blacklisted
2. Chave comprometida → lista endereços legitimados e confisca
3. Censura política / coerção

**Recomendações**:
- ✅ **Adicionar função `removeBlackFunds()`**: Permitir recuperação se marcado por engano (com validação)
- ✅ **Time-lock**: Atraso entre `destroyBlackFunds()` e execução efetiva
- ✅ **Event logging aprimorado**: Registrar quem e quando marcou para destruição
- ✅ **Govern by multisig**: Exigir aprovação de múltiplos signatários

---

### 3️⃣ **ALTO: Emissão/Queima Sem Limites (`issue()` / `redeem()`)**

**Localização**: [File 10 TetherToken.sol](File%2010%20TetherToken.sol#L124-L141)

```solidity
function issue(uint amount) public onlyOwner {
    balances[owner] = balances[owner].add(amount);
    _totalSupply = _totalSupply.add(amount);
    Issue(amount);
    Transfer(address(0), owner, amount);
}

function redeem(uint amount) public onlyOwner {
    _totalSupply = _totalSupply.sub(amount);
    balances[owner] = balances[owner].sub(amount);
    Redeem(amount);
    Transfer(owner, address(0), amount);
}
```

**Risco**:
- Owner pode criar infinitos tokens (`issue`) ou destruir arbitrariamente (`redeem`)
- Sem verificação de limite máximo ou cap
- Inflation ilimitada possível

**Cenários de Abuso**:
1. Dilução massiva: inflar suprimento 1000x → devaluar token de titulares
2. Chave comprometida → inflação maliciosa
3. Falta de governança: usuários não têm mecanismo de aprovação

**Recomendações**:
- ✅ **Cap máximo**: Definir `MAX_TOTAL_SUPPLY` e verificar antes de `issue()`
- ✅ **Governança de emissão**: Implementar DAO votação ou multisig approval
- ✅ **Time-lock**: Atraso entre proposta e execução
- ✅ **Eventos aprimorados**: Registrar quantidades e timestamps

---

### 4️⃣ **MÉDIO: Parâmetros de Taxa sem Transparência (`setParams()`)**

**Localização**: [File 9 StandardTokenWithFees.sol](File%209%20StandardTokenWithFees.sol#L59-L67)

```solidity
function setParams(uint newBasisPoints, uint newMaxFee) public onlyOwner {
    require(newBasisPoints < MAX_SETTABLE_BASIS_POINTS);
    require(newMaxFee < MAX_SETTABLE_FEE);
    
    basisPointsRate = newBasisPoints;
    maximumFee = newMaxFee.mul(uint(10)**decimals);
    
    Params(basisPointsRate, maximumFee);
}
```

**Risco**:
- Owner pode aumentar taxas arbitrariamente (até 20 basis points ≈ 0.2%)
- Sem notificação prévia ou período de carência
- Usuários podem ser surpreendidos com taxas aumentadas

**Recomendações**:
- ✅ **Time-lock**: Atraso entre `setParams()` call e efeito
- ✅ **Notificação**: Emitir event 7 dias antes de mudança
- ✅ **Cap reduzido**: Limitar max a 10 basis points (0.1%)
- ✅ **Governança**: Colocar mudanças de taxa sob votação

---

### 5️⃣ **MÉDIO: Blacklist sem Recurso**

**Localização**: [File 2 BlackList.sol](File%202%20BlackList.sol)

```solidity
function addBlackList(address _evilUser) public onlyOwner {
    isBlackListed[_evilUser] = true;
    AddedBlackList(_evilUser);
}

function removeBlackList(address _clearedUser) public onlyOwner {
    isBlackListed[_clearedUser] = false;
    RemovedBlackList(_clearedUser);
}
```

**Risco**:
- Qualquer endereço pode ser marcado e bloqueado da noite para o dia
- Sem tempo de reação ou direito de recurso
- Pode ser usado para censura

**Recomendações**:
- ✅ **Notificação e período de recurso**: 48-72h entre `addBlackList()` e efeito
- ✅ **Governança**: Exigir multisig ou votação para blacklist
- ✅ **Transparência**: Publicar lista completa de blacklistados (transparência radical)
- ✅ **Apelo**: Mecanismo de apelação para recuperação

---

### 6️⃣ **MÉDIO: Pausa Global sem Limite de Tempo**

**Localização**: [File 6 Pausable.sol](File%206%20Pausable.sol)

```solidity
function pause() public onlyOwner {
    paused = true;
    Pause();
}

function unpause() public onlyOwner {
    paused = false;
    Unpause();
}
```

**Risco**:
- Owner pode pausar indefinidamente → travamento total
- Sem automático unpause ou período máximo
- Não há comunicação obrigatória

**Recomendações**:
- ✅ **Auto-unpause**: Implementar timer que despausa automaticamente após 30 dias
- ✅ **Notificação**: Exigir publicação de motivo na blockchain
- ✅ **Limite de pausa**: Máximo 30 dias por ano
- ✅ **Governança**: Votação para pausas > 7 dias

---

## 🛠️ Boas Práticas Implementadas ✅

| Aspecto | Status | Observação |
|--------|--------|-----------|
| **SafeMath** | ✅ | Overflow/underflow protegido |
| **Modifier `onlyOwner`** | ✅ | Controle de acesso básico |
| **Eventos** | ✅ | Transferências registradas |
| **Herança clara** | ✅ | Hierarquia legível |
| **Require statements** | ✅ | Validações presentes |

---

## 🚨 Checklist de Remediação

- [ ] Implementar time-lock em `deprecate()`
- [ ] Implementar time-lock em `destroyBlackFunds()`
- [ ] Adicionar `MAX_TOTAL_SUPPLY` cap
- [ ] Exigir multisig para operações admin
- [ ] Adicionar período de recurso para blacklist
- [ ] Auto-unpause em Pausable
- [ ] Publicar novo bytecode antes de upgrade
- [ ] Auditoria externa completa antes de mainnet
- [ ] Testes unitários com coverage > 90%
- [ ] Monitorer eventos críticos 24/7

---

## 📋 Próximas Ações Recomendadas

1. **Curto prazo (1-2 semanas)**:
   - Implementar time-lock genérico
   - Adicionar cap de suprimento
   - Gerar testes automatizados

2. **Médio prazo (1 mês)**:
   - Integrar multisig wallet (Gnosis Safe)
   - Auditar com firma especializada (Trail of Bits, OpenZeppelin)
   - Implementar governança (Snapshot ou DAO)

3. **Longo prazo (pós-audit)**:
   - Deploy testnet com monitoring
   - Mainnet com período beta (limite de volume)
   - Transição gradual

---

**Classificação de Risco Geral**: 🔴 **ALTO** (sem time-lock e multisig)

Para melhorias, veja: [MELHORIAS.md](MELHORIAS.md)
