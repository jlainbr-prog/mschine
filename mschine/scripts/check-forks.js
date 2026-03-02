#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
    symbol: 'FUSDT',
    myGithubUser: 'jlainbr-prog'
};

const root = path.join(__dirname, '..');

function run(cmd, throwOnError = true) {
    try {
        return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        if (throwOnError) throw new Error(e.stderr || e.message);
        return null;
    }
}

console.log('=== VERIFICAÇÃO E CRIAÇÃO DE FORKS ===\n');

// verificar autenticação
try {
    run('gh auth status');
    console.log('✓ Autenticação OK\n');
} catch {
    console.log('✗ Não autenticado');
    process.exit(1);
}

// Trust Wallet
console.log('📦 Trust Wallet Assets...');
const twCheck = run(`gh repo view ${CONFIG.myGithubUser}/assets`, false);
if (!twCheck) {
    console.log('   Criando fork...');
    run(`gh repo fork trustwallet/assets --clone=false`);
    console.log('   ✓ Fork criado');
} else {
    console.log('   ✓ Fork já existe');
}

// MetaMask
console.log('📦 MetaMask Metadata...');
const mmCheck = run(`gh repo view ${CONFIG.myGithubUser}/contract-metadata`, false);
if (!mmCheck) {
    console.log('   Criando fork...');
    run(`gh repo fork MetaMask/contract-metadata --clone=false`);
    console.log('   ✓ Fork criado');
} else {
    console.log('   ✓ Fork já existe');
}

console.log('\n=== INSTRUÇÕES MANUAIS ===\n');

console.log('Como os repositórios upstream têm ficheiros com nomes inválidos no Windows,');
console.log('siga estes passos MANUAIS (é bem rápido):\n');

console.log('### TRUST WALLET (BSC) ###');
console.log(`1. Abra: https://github.com/${CONFIG.myGithubUser}/assets`);
console.log(`2. Crie um novo ficheiro: blockchains/smartchain/assets/${CONFIG.address}/logo.png`);
console.log('   (ou upload binárico)');
console.log(`3. Cole o conteúdo de: mschine/blockchains/smartchain/assets/${CONFIG.address}/logo.png`);
console.log('4. Commit com mensagem: "Add FUSDT (BEP20) on BSC"');
console.log('5. Crie PR contra trustwallet/assets\n');

console.log('### METAMASK (ERC20) ###');
console.log(`1. Abra: https://github.com/${CONFIG.myGithubUser}/contract-metadata`);
console.log('2. Edite: contract-map.json');
console.log('3. Adicione esta entrada:');
console.log(`   "${CONFIG.address.toLowerCase()}": {`);
console.log(`     "name": "Flash USDT",`);
console.log(`     "logo": "https://raw.githubusercontent.com/${CONFIG.myGithubUser}/mschine/main/blockchains/ethereum/assets/${CONFIG.address}/logo.png",`);
console.log(`     "erc20": true,`);
console.log(`     "symbol": "FUSDT",`);
console.log(`     "decimals": 18`);
console.log('   }');
console.log('4. Commit com mensagem: "Add FUSDT token metadata"');
console.log('5. Crie PR contra MetaMask/contract-metadata\n');

console.log('=== URLs PARA COPIAR ===\n');

const logoUrl = `https://i.imgur.com/wrb7z76.png`;
const infoUrl = `https://raw.githubusercontent.com/${CONFIG.myGithubUser}/mschine/main/blockchains/smartchain/assets/${CONFIG.address}/info.json`;

console.log('Trust Wallet logo (para copiar em base64):\n' + logoUrl);
console.log('\nMetaMask info.json:\n' + infoUrl);

console.log('\n✅ Forks foram criados/verificados!');
console.log('   Agora siga as instruções manuais acima.\n');

fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n\n## Submissão Manual - ${new Date().toISOString()}\nForks criados em:\n- ${CONFIG.myGithubUser}/assets\n- ${CONFIG.myGithubUser}/contract-metadata\n`);
