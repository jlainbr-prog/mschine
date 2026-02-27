const fs = require('fs');
const path = require('path');

const address = process.argv[2];
if (!address) {
  console.error('Usage: node compare_bytecodes_addr.cjs <address>');
  process.exit(1);
}

const artifactPath = path.join(__dirname, 'artifacts/contracts/TetherToken.sol/TetherToken.json');
if (!fs.existsSync(artifactPath)) {
  console.error('Artifact not found:', artifactPath);
  process.exit(1);
}

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const compiledBytecode = artifact.bytecode.trim();
const onchainFile = path.join(__dirname, `bytecode_onchain_${address}.hex`);
if (!fs.existsSync(onchainFile)) {
  console.error('On-chain bytecode file not found:', onchainFile);
  process.exit(1);
}
const onchainBytecode = fs.readFileSync(onchainFile, 'utf8').trim();

console.log('Compiled size:', compiledBytecode.length);
console.log('On-chain size:', onchainBytecode.length);

if (compiledBytecode === onchainBytecode) {
  console.log('\n✅ Perfect match: bytecodes are identical');
} else {
  console.log('\n⚠️ Bytecodes differ');
  if (compiledBytecode.substring(200) === onchainBytecode.substring(200)) {
    console.log('✓ Runtime matches (difference likely in constructor args)');
  } else {
    console.log('✗ Runtime differs');
  }
}
