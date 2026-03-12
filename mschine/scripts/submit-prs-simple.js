const fs = require('fs');
const path = require('path');

const CONFIG = {
    address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
    symbol: 'FUSDT',
    myGithubUser: 'jlainbr-prog',
    upstreamRepos: {
        trustwallet: 'trustwallet/assets',
        metamask: 'MetaMask/contract-metadata'
    }
};

const root = path.join(__dirname, '..');

console.log('=== SUBMISSÃO MANUAL VIA NAVEGADOR ===\n');

console.log('✓ GitHub CLI autenticado como: jlainbr-prog\n');

console.log('🔗 TRUST WALLET (BSC) — Copie e abra no navegador:');
console.log('https://github.com/trustwallet/assets/forks/new?template_name=new_token&_owner=jlainbr-prog\n');

console.log('📋 Após fazer o fork:');
console.log('1. Clone seu fork: git clone https://github.com/jlainbr-prog/assets.git');
console.log('2. Copie a pasta:');
console.log('   cp -r blockchains/smartchain/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540 \\');
console.log('        seu-fork-assets/blockchains/smartchain/assets/');
console.log('3. Faça commit e push');
console.log('4. Crie um Pull Request\n');

console.log('==================\n');

console.log('🔗 METAMASK — Copie e abra no navegador:');
console.log('https://github.com/MetaMask/contract-metadata/forks/new?template_name=new_token\n');

console.log('📋 Após fazer o fork:');
console.log('1. Clone seu fork: git clone https://github.com/jlainbr-prog/contract-metadata.git');
console.log('2. Edite contract-map.json e adicione:');
console.log(`   "${CONFIG.address.toLowerCase()}": {`);
console.log(`     "name": "Flash USDT",`);
console.log(`     "logo": "https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/ethereum/assets/${CONFIG.address}/logo.png",`);
console.log(`     "erc20": true,`);
console.log(`     "symbol": "FUSDT",`);
console.log(`     "decimals": 18`);
console.log('   }');
console.log('3. Faça commit e push');
console.log('4. Crie um Pull Request\n');

console.log('📁 Arquivos para copiar:');
console.log(`  - Logo: ${path.join(root, 'blockchains', 'smartchain', 'assets', CONFIG.address, 'logo.png')}`);
console.log(`  - Info JSON: ${path.join(root, 'blockchains', 'smartchain', 'assets', CONFIG.address, 'info.json')}\n`);

console.log('URLs acessíveis via raw.githubusercontent.com:');
console.log(`  - ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q`);
console.log(`  - https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/smartchain/assets/${CONFIG.address}/info.json\n`);

// salvar tracking
if (!fs.existsSync(path.join(root, 'PR-TRACKING.md'))) {
    fs.writeFileSync(path.join(root, 'PR-TRACKING.md'), '# PR Tracking\n\n');
}

fs.appendFileSync(
    path.join(root, 'PR-TRACKING.md'),
    `\n## Submissão Manual - ${new Date().toISOString()}\n- Trust Wallet: https://github.com/trustwallet/assets\n- MetaMask: https://github.com/MetaMask/contract-metadata\n`
);

console.log('✓ Instruções gravadas em PR-TRACKING.md');
