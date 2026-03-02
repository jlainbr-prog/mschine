#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG = {
    address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
    symbol: 'FUSDT',
    myGithubUser: 'jlainbr-prog'
};

const projectRoot = path.join(__dirname, '..');

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        console.error(`✗ Erro: ${e.message}`);
        return null;
    }
}

console.log('=== SUBMISSÃO VIA GITHUB API ===\n');

// Trust Wallet
console.log('📤 TRUST WALLET (BSC):\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-bsc-${Date.now()}`;
    const repo = `${CONFIG.myGithubUser}/assets`;
    const file = `blockchains/smartchain/assets/${CONFIG.address}/logo.png`;
    
    // ler ficheiro
    const logoPath = path.join(projectRoot, 'blockchains', 'smartchain', 'assets', CONFIG.address, 'logo.png');
    if (!fs.existsSync(logoPath)) {
        throw new Error(`Ficheiro não encontrado: ${logoPath}`);
    }
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    
    // criar branch
    console.log(`  1. Criando branch: ${branch}`);
    const headSha = run(`gh api repos/${repo}/git/refs/heads/main --jq '.object.sha' 2>/dev/null`) ||
                    run(`gh api repos/${repo}/git/refs/heads/master --jq '.object.sha'`);
    
    if (!headSha) {
        console.log('  ✗ Erro: não conseguiu obter SHA do head');
        throw new Error('SHA inválido');
    }
    
    run(`gh api repos/${repo}/git/refs -X POST -f ref=refs/heads/${branch} -f sha=${headSha}`);
    console.log(`  ✓ Branch criado`);
    
    // criar ficheiro
    console.log(`  2. Adicionando logo.png`);
    const uploadPayload = {
        message: `Add ${CONFIG.symbol} (BEP20) on BSC`,
        content: logoBase64,
        branch: branch
    };
    
    const tempFile = path.join(__dirname, '..', '.temp-upload.json');
    fs.writeFileSync(tempFile, JSON.stringify(uploadPayload));
    
    run(`gh api repos/${repo}/contents/${file} -X PUT --input ${tempFile}`);
    fs.unlinkSync(tempFile);
    console.log(`  ✓ Logo adicionado`);
    
    // criar info.json também
    console.log(`  3. Adicionando info.json`);
    const infoPath = `blockchains/smartchain/assets/${CONFIG.address}/info.json`;
    const infoContent = fs.readFileSync(
        path.join(__dirname, '..', 'blockchains', 'smartchain', 'assets', CONFIG.address, 'info.json'),
        'utf8'
    );
    const infoBase64 = Buffer.from(infoContent).toString('base64');
    
    const infoPayload = {
        message: `Add ${CONFIG.symbol} (BEP20) on BSC`,
        content: infoBase64,
        branch: branch
    };
    
    fs.writeFileSync(tempFile, JSON.stringify(infoPayload));
    run(`gh api repos/${repo}/contents/${infoPath} -X PUT --input ${tempFile}`);
    fs.unlinkSync(tempFile);
    console.log(`  ✓ Info JSON adicionado`);
    
    // criar PR
    console.log(`  4. Criando PR...`);
    const prPayload = {
        title: `Add ${CONFIG.symbol} (BEP20) on BSC`,
        head: `${CONFIG.myGithubUser}:${branch}`,
        base: 'main',
        body: `Adding ${CONFIG.symbol} token logo and metadata for BSC.\n\nContract: ${CONFIG.address}\n\nLogo source: https://github.com/jlainbr-prog/mschine`
    };
    
    const prFile = path.join(__dirname, '..', '.temp-pr.json');
    fs.writeFileSync(prFile, JSON.stringify(prPayload));
    
    const prUrl = run(`gh api repos/trustwallet/assets/pulls -X POST --input ${prFile} --jq '.html_url' 2>/dev/null`);
    fs.unlinkSync(prFile);
    
    if (prUrl) {
        console.log(`  ✓ PR criado!`);
        console.log(`  📍 ${prUrl}\n`);
        
        fs.appendFileSync(path.join(__dirname, '..', 'PR-TRACKING.md'), 
            `\n- [Trust Wallet BSC] ${prUrl} — ${new Date().toISOString()}`);
    } else {
        console.log(`  ✗ Erro ao criar PR`);
    }
    
} catch (e) {
    console.error(`  ✗ ${e.message}`);
}

// MetaMask
console.log('\n📤 METAMASK (ERC20):\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`;
    const repo = `${CONFIG.myGithubUser}/contract-metadata`;
    const file = 'contract-map.json';
    
    // obter arquivo atual
    console.log(`  1. Obtendo contract-map.json...`);
    const fileInfoJson = run(`gh api repos/${repo}/contents/${file}`);
    const fileInfo = JSON.parse(fileInfoJson);
    const currentContent = Buffer.from(fileInfo.content, 'base64').toString('utf8');
    let contractMap = JSON.parse(currentContent);
    
    // adicionar entrada
    contractMap[CONFIG.address.toLowerCase()] = {
        name: 'Flash USDT',
        logo: `https://raw.githubusercontent.com/${CONFIG.myGithubUser}/mschine/main/blockchains/ethereum/assets/${CONFIG.address}/logo.png`,
        erc20: true,
        symbol: CONFIG.symbol,
        decimals: 18
    };
    
    const newContent = JSON.stringify(contractMap, Object.keys(contractMap).sort(), 2) + '\n';
    
    // criar branch
    console.log(`  2. Criando branch: ${branch}`);
    const headSha = run(`gh api repos/${repo}/git/refs/heads/main --jq '.object.sha' 2>/dev/null`) ||
                    run(`gh api repos/${repo}/git/refs/heads/master --jq '.object.sha'`);
    
    run(`gh api repos/${repo}/git/refs -X POST -f ref=refs/heads/${branch} -f sha=${headSha}`);
    console.log(`  ✓ Branch criado`);
    
    // create PR
    console.log(`  4. Criando PR...`);
    const prPayload = {
        title: `Add ${CONFIG.symbol} token metadata`,
        head: `${CONFIG.myGithubUser}:${branch}`,
        base: 'main',
        body: `Adding metadata for **${CONFIG.symbol}** (Flash USDT ERC20).\n\n- **Address:** ${CONFIG.address}\n- **Decimals:** 18\n- **Logo:** https://github.com/jlainbr-prog/mschine`
    };
    
    const prFile = path.join(__dirname, '..', '.temp-pr2.json');
    fs.writeFileSync(prFile, JSON.stringify(prPayload));
    
    const prUrl = run(`gh api repos/MetaMask/contract-metadata/pulls -X POST --input ${prFile} --jq '.html_url' 2>/dev/null`);
    fs.unlinkSync(prFile);
    
    // obter SHA do arquivo
    console.log(`  3. Atualizando contract-map.json...`);
    const fileSha = fileInfo.sha;
    
    const updatePayload = {
        message: `Add ${CONFIG.symbol} token metadata`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileSha,
        branch: branch
    };
    
    const tempFile = path.join(__dirname, '..', '.temp-update.json');
    fs.writeFileSync(tempFile, JSON.stringify(updatePayload));
    
    run(`gh api repos/${repo}/contents/${file} -X PUT --input ${tempFile}`);
    fs.unlinkSync(tempFile);
    console.log(`  ✓ Arquivo atualizado`);
    
    // criar PR
    console.log(`  4. Criando PR...`);
    const prPayload = {
        title: `Add ${CONFIG.symbol} token metadata`,
        head: `${CONFIG.myGithubUser}:${branch}`,
        base: 'main',
        body: `Adding metadata for **${CONFIG.symbol}** (Flash USDT ERC20).\n\n- **Address:** ${CONFIG.address}\n- **Decimals:** 18\n- **Logo:** https://github.com/jlainbr-prog/mschine`
    };
    
    const prFile = path.join(__dirname, '..', '.temp-pr2.json');
    fs.writeFileSync(prFile, JSON.stringify(prPayload));
    
    const prUrl = run(`gh api repos/MetaMask/contract-metadata/pulls -X POST --input ${prFile} --jq '.html_url' 2>/dev/null`);
    fs.unlinkSync(prFile);
    
    if (prUrl) {
        console.log(`  ✓ PR criado!`);
        console.log(`  📍 ${prUrl}\n`);
        
        fs.appendFileSync(path.join(__dirname, '..', 'PR-TRACKING.md'), 
            `\n- [MetaMask ERC20] ${prUrl} — ${new Date().toISOString()}`);
    } else {
        console.log(`  ✗ Erro ao criar PR`);
    }
    
} catch (e) {
    console.error(`  ✗ ${e.message}`);
}

console.log('\n✅ Processo concluído!');
console.log('📊 Ver: mschine/PR-TRACKING.md\n');
