# Project Configuration Guide

Complete guide for configuring the Tether (USDT) smart contract project.

## Environment Setup

### 1. System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: v2.0.0 or higher
- **RAM**: At least 4GB (8GB recommended for testing)
- **Disk Space**: At least 500MB for dependencies

### 2. Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/tether-usdt-contract.git
cd tether-usdt-contract

# Install npm dependencies
npm install

# Verify installation
npx hardhat --version
```

### 3. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
# Network RPC Endpoints
INFURA_API_KEY=your_infura_key_here
ALCHEMY_API_KEY=your_alchemy_key_here

# Deployment Account (Private Key)
PRIVATE_KEY=0x1234567890123456789012345678901234567890123456789012345678901234

# Block Explorer APIs
ETHERSCAN_API_KEY=your_etherscan_key_here
POLYGONSCAN_API_KEY=your_polygonscan_key_here

# Optional: Custom RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
POLYGON_RPC_URL=https://polygon-rpc.com

# Optional: Deployment Parameters
INITIAL_SUPPLY=2600000000
TOKEN_NAME=Tether USD
TOKEN_SYMBOL=USDT
DECIMALS=6
```

**⚠️ IMPORTANT**: Never commit `.env` to version control!

## Hardhat Configuration

### Networks Configured

The project includes configuration for multiple networks:

#### Testnet Networks
- **Sepolia** (Ethereum Testnet) - Recommended for initial testing
- **Goerli** (Ethereum Testnet)
- **Mumbai** (Polygon Testnet)
- **BSC Testnet** (Binance Smart Chain Testnet)

#### Mainnet Networks
- **Mainnet** (Ethereum Mainnet)
- **Polygon** (Polygon Mainnet)
- **BSC** (Binance Smart Chain)

### Custom Network Configuration

To add a custom network, edit `hardhat.config.js`:

```javascript
networks: {
  mynetwork: {
    url: "https://rpc.mynetwork.com",
    accounts: [process.env.PRIVATE_KEY],
    chainId: 123,
    gasPrice: 20000000000
  }
}
```

## Solidity Compiler Configuration

### Current Settings

```javascript
solidity: {
  version: "0.4.18",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

### Optimization Notes

- **Enabled**: Compiler optimization is turned on
- **Runs**: 200 optimization passes (balance between deployment and execution gas)

Adjust `runs` value:
- Higher value (e.g., 10000): Optimizes for execution cost
- Lower value (e.g., 0): Optimizes for deployment code size

## Project Directory Structure

```
tether-usdt-contract/
├── contracts/                 # Smart contract source files
│   └── TetherToken.sol       # Main consolidated contract
├── test/                      # Test files
│   └── TetherToken.test.js   # Comprehensive test suite
├── scripts/                   # Deployment and utility scripts
│   └── deploy.js             # Deployment script
├── artifacts/                # Generated build artifacts
├── cache/                     # Hardhat cache
├── docs/                      # Additional documentation (optional)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Project dependencies
├── README.md                 # Project overview
├── SECURITY.md               # Security guidelines
├── DEPLOYMENT.md             # Deployment guide
├── CHANGELOG.md              # Version history
└── LICENSE                   # MIT License
```

## Compilation

### Compile Contracts

```bash
# Standard compilation
npm run compile

# Clean and recompile
npm run clean && npm run compile

# View compiler output
npx hardhat compile --show-stacks
```

### Build Artifacts

Compiled contracts are stored in:
- `artifacts/contracts/` - Contract ABIs and bytecode
- `cache/` - Compilation cache
- `artifacts/build-info/` - Full build metadata

## Testing

### Run All Tests

```bash
npm run test
```

### Run Specific Test

```bash
npx hardhat test test/TetherToken.test.js
```

### Test Coverage

```bash
npm run coverage
```

### Watch Mode

```bash
npx hardhat test --watch
```

## Gas Analysis

### Calculate Gas Usage

```bash
npm run test -- --reporter=gas
```

### Gas Reporter Configuration

Add to `hardhat.config.js`:

```javascript
require("hardhat-gas-reporter");

module.exports = {
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  }
};
```

## Contract Deployment

### Local Network (Hardhat)

```bash
# Start hardhat node
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Deploy to Goerli
npx hardhat run scripts/deploy.js --network goerli

# Deploy to Mumbai
npx hardhat run scripts/deploy.js --network mumbai
```

### Mainnet Deployment

⚠️ **CRITICAL**: Only deploy to mainnet after:
- ✓ Thorough testing on testnet
- ✓ Professional security audit
- ✓ Community review and feedback
- ✓ Team review and approval

```bash
npm run deploy
```

## Contract Verification

### Verify on Etherscan

```bash
npx hardhat verify --network sepolia \
  CONTRACT_ADDRESS \
  "2600000000000000" \
  "Tether USD" \
  "USDT" \
  "6"
```

### Verify Multiple Contracts

```bash
# Create verify script
npx hardhat run scripts/verify.js --network sepolia
```

## Debugging

### Enable Debugging

```bash
# Run with debug logging
DEBUG=hardhat:* npx hardhat test
```

### Use Hardhat Console

```bash
# Interactive console
npx hardhat console --network sepolia

# Then in console:
> const token = await ethers.getContractAt("TetherToken", "0x...");
> await token.balanceOf("0x...");
```

### Trace Transactions

```bash
# Run with trace logging
npx hardhat test --trace
```

## Performance Optimization

### Optimize for Production

```bash
# Enable full optimization
hardhat.config.js:
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000
    }
  }
```

### Reduce Build Size

```bash
# Remove build artifacts
npm run clean

# Rebuild minimal
npx hardhat compile
```

## Security Checklist

Before deployment:

- [ ] Environment variables configured correctly
- [ ] Private key is secure (use hardware wallet)
- [ ] Contract compiled successfully
- [ ] All tests passing
- [ ] Gas estimates reasonable
- [ ] Security audit completed
- [ ] Network correctly selected
- [ ] Deployment address verified

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module 'hardhat'"
```bash
npm install --save-dev hardhat
```

**Issue**: "Invalid private key"
```bash
# Ensure PRIVATE_KEY starts with 0x and is 64 hex characters
```

**Issue**: "Insufficient funds for gas"
```bash
# Add more ETH to deployer address or reduce gas price
```

**Issue**: "Network timeout"
```bash
# Check network RPC endpoint is working
# Try different RPC provider
```

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run compile` | Compile contracts |
| `npm run test` | Run test suite |
| `npm run deploy` | Deploy to mainnet |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run clean` | Remove build files |
| `npm run flatten` | Flatten contract for verification |
| `npm run coverage` | Generate coverage report |

## Advanced Configuration

### Custom Gas Settings

```javascript
// In deploy script
const gasPrice = ethers.utils.parseUnits("100", "gwei");
const gasLimit = 5000000;

await tetherToken.deploy(..., {
  gasPrice,
  gasLimit
});
```

### Custom Signer

```javascript
// Use different signer
const signer = await ethers.getSigner("0xaddress");
const contract = TetherToken.connect(signer);
```

### Batch Operations

```javascript
// Use multicall for multiple reads
const results = await ethers.getContract(...);
const balances = await results.balanceOf(addrs);
```

## Documentation

- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.io/)
- [Solidity Docs](https://solidity.readthedocs.io/)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)

## Support

For configuration issues:
1. Check this guide first
2. Search GitHub issues
3. Review Hardhat documentation
4. Post detailed question to community

---

**Last Updated**: February 21, 2024
