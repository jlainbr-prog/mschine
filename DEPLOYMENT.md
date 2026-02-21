# Deployment Guide

Complete guide for deploying the Tether (USDT) Token contract.

## Prerequisites

### System Requirements
- Node.js v16.0.0 or higher
- npm v8.0.0 or higher
- Git installed

### Required Accounts & Keys
1. **RPC Endpoint Access**
   - Infura, Alchemy, or your own node
   - API key for the network you're using

2. **Deployer Account**
   - Private key with sufficient ETH for gas fees
   - ~0.5 - 2 ETH recommended for initial deployment + interactions
   - Keep private key secure

3. **Etherscan API Key** (for verification)
   - Create account at https://etherscan.io
   - Generate API key for contract verification

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/tether-usdt-contract.git
cd tether-usdt-contract
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
INFURA_API_KEY=your_key_here
PRIVATE_KEY=0xyour_private_key_here
ETHERSCAN_API_KEY=your_key_here
```

⚠️ **SECURITY WARNING**: Never commit `.env` file to git. Keep private keys secure and confidential.

## Deployment Steps

### Step 1: Compile Contract
```bash
npm run compile
```

This should complete without errors.

### Step 2: Test on Local Network
```bash
npm run test
```

### Step 3: Deploy to Testnet (Recommended First)

#### Sepolia Testnet
```bash
npm run deploy:sepolia
```

#### Goerli Testnet
```bash
npx hardhat run scripts/deploy.js --network goerli
```

#### Mumbai (Polygon Testnet)
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### Step 4: Verify Deployment
After deployment, save the contract address and verify:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS \
  "InitialSupply" "TokenName" "TokenSymbol" "Decimals"
```

Example:
```bash
npx hardhat verify --network sepolia 0x123abc... \
  "2600000000000000" "Tether USD" "USDT" "6"
```

### Step 5: Deploy to Mainnet (Production)

**Before doing this:**
- ✓ Test thoroughly on testnet
- ✓ Have contract audited
- ✓ Verify all parameters
- ✓ Backup private key
- ✓ Prepare emergency procedures

```bash
npm run deploy
```

Or for specific network:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## Deployment Parameters

### Required Parameters
```javascript
const initialSupply = 2600000000 * 10**6;  // 2.6 billion USDT
const tokenName = "Tether USD";
const tokenSymbol = "USDT";
const decimals = 6;
```

### Calculate Token Supply
- 1 USDT = 10^6 units (with 6 decimals)
- For 2.6 billion USDT: 2600000000 * 10^6 = 2.6 * 10^15 units

### Gas Estimation
| Network | Est. Gas | Est. Cost (at 100 gwei) |
|---------|----------|------------------------|
| Ethereum | 2-3M | 0.2-0.3 ETH |
| Polygon | 2-3M | 1-3 MATIC |
| BSC | 2-3M | 0.1-0.2 BNB |

## Post-Deployment Verification

### 1. Verify Contract on Blockchain Explorer
```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 2. Check Token Details
```javascript
// Using ethers.js
const supply = await contract.totalSupply();
const balance = await contract.balanceOf(ownerAddress);
const decimals = await contract.decimals();
const name = await contract.name();
const symbol = await contract.symbol();
```

### 3. Test Basic Functions
```javascript
// Transfer tokens
await contract.transfer('0x...', 1000000); // 1 USDT

// Approve spending
await contract.approve('0x...', 1000000);

// Check balance
const balance = await contract.balanceOf('0x...');
```

## Common Issues & Solutions

### Issue: `INSUFFICIENT_FUNDS`
**Solution**: Ensure deployer account has enough ETH for gas fees

### Issue: `NONCE_TOO_HIGH`
**Solution**: Reset nonce or wait for pending transactions to complete
```bash
# In hardhat
npx hardhat console --network sepolia
# Then get current nonce and adjust
```

### Issue: Transaction Timeout
**Solution**: Increase gas price or check network congestion
```javascript
// In deploy script
const tx = await contract.deploy({
  gasPrice: ethers.utils.parseUnits('100', 'gwei'),
  gasLimit: 5000000
});
```

### Issue: Contract Verification Fails
**Solution**: Ensure inputs match exactly:
- Constructor parameters
- Compiler version (0.4.18)
- Optimization settings

## Network Configuration Reference

### Ethereum Mainnet
- ChainID: 1
- RPC: https://mainnet.infura.io/v3/{API_KEY}
- Block Explorer: https://etherscan.io

### Sepolia Testnet
- ChainID: 11155111
- RPC: https://sepolia.infura.io/v3/{API_KEY}
- Block Explorer: https://sepolia.etherscan.io
- Faucet: https://sepoliafaucet.com

### Polygon Mainnet
- ChainID: 137
- RPC: https://polygon-rpc.com
- Block Explorer: https://polygonscan.com

### Polygon Mumbai Testnet
- ChainID: 80001
- RPC: https://rpc-mumbai.maticvigil.com
- Block Explorer: https://mumbai.polygonscan.com
- Faucet: https://faucet.polygon.technology/

### BSC (Binance Smart Chain)
- ChainID: 56
- RPC: https://bsc-dataseed.binance.org
- Block Explorer: https://bscscan.com

## Post-Deployment Operations

### Update Contract Metadata
After deployment, update:
1. Contract address in documentation
2. Token logo in contracts list
3. Liquidity pools information
4. Trading pairs
5. Bridge configurations

### Monitor Contract
```javascript
// Watch for transfers
contract.on('Transfer', (from, to, value) => {
  console.log(`Transfer: ${from} -> ${to}: ${value}`);
});

// Watch for approval
contract.on('Approval', (owner, spender, value) => {
  console.log(`Approval: ${owner} allows ${spender}: ${value}`);
});
```

### Upgrade (If Needed)
```javascript
// Deprecate old contract
await oldContract.deprecate(newContractAddress);

// This allows forwarding to new contract
```

## Security Checklist Before Mainnet

- [ ] Contract audited by professional auditors
- [ ] All tests passing
- [ ] Testnet deployment successful
- [ ] Verified on testnet block explorer
- [ ] Backup of private keys secured
- [ ] Emergency procedures documented
- [ ] Team trained on contract operations
- [ ] Monitoring systems in place
- [ ] Communication plan ready
- [ ] Legal compliance verified

## Support & Troubleshooting

For help with deployment:
1. Check GitHub Issues
2. Review Hardhat documentation
3. Consult Solidity documentation
4. Reach out to development team

## Useful Commands

```bash
# Compile contract
npm run compile

# Run tests
npm run test

# Deploy script
npm run deploy

# Flatten contract (for verification)
npm run flatten

# Clean build artifacts
npm run clean

# Check gas usage
npx hardhat gas-reporter --network mainnet
```

## References

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Solidity Security](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
