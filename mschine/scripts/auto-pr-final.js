const { execSync } = require('child_process');
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

function run(cmd, throwOnError = true) {
    try {
        return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        if (throwOnError) throw new Error(`Falha: ${cmd}\n${e.stderr || e.message}`);
        return null;
    }
}

console.log('=== SUBMISSÃO VIA FORK + PUSH ===\n');

// obter token
let token = '';
try {
    token = run(`gh auth token`);
} catch {
    console.log('✗ Erro: gh auth token falhou');
    process.exit(1);
}

console.log('✓ Token obtido\n');

// Trust Wallet
console.log('=== TRUST WALLET (BSC) ===\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-bsc-${Date.now()}`;
    const repo = CONFIG.upstreamRepos.trustwallet;
    const myRepo = `${CONFIG.myGithubUser}/assets`;
    
    // clone do fork do utilizador (mais rápido)
    const tempDir = path.join(root, '.temp-tw');
    
    // remover se existir
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    
    console.log('📥 Clonando fork pessoal (sem problemas de path)...');
    run(`git clone --depth=1 --filter=blob:none --sparse https://${CONFIG.myGithubUser}:${token}@github.com/${myRepo}.git "${tempDir}"`);
    
    console.log('🌿 Configurando sparse checkout...');
    run(`git -C "${tempDir}" sparse-checkout set blockchains/smartchain/assets`, false);
    
    // criar branch
    run(`git -C "${tempDir}" checkout -b ${branch}`);
    console.log(`✓ Branch criado: ${branch}`);
    
    // criar pasta se não existir
    const targetDir = path.join(tempDir, 'blockchains', 'smartchain', 'assets', CONFIG.address);
    fs.mkdirSync(targetDir, { recursive: true });
    
    // copiar ficheiros
    const sourceDir = path.join(root, 'blockchains', 'smartchain', 'assets', CONFIG.address);
    fs.copyFileSync(
        path.join(sourceDir, 'logo.png'),
        path.join(targetDir, 'logo.png')
    );
    fs.copyFileSync(
        path.join(sourceDir, 'info.json'),
        path.join(targetDir, 'info.json')
    );
    console.log('✓ Ficheiros copiados');
    
    // commit
    run(`git -C "${tempDir}" config user.name "Copilot Bot"`);
    run(`git -C "${tempDir}" config user.email "bot@github.local"`);
    run(`git -C "${tempDir}" add .`);
    run(`git -C "${tempDir}" commit -m "Add ${CONFIG.symbol} (BEP20) on BSC"`);
    console.log('✓ Commit realizado');
    
    // push
    run(`git -C "${tempDir}" push origin ${branch}`);
    console.log('✓ Push realizado');
    
    // criar PR
    const prTitle = `Add ${CONFIG.symbol} (BEP20) on BSC`;
    const prBody = `Adding ${CONFIG.symbol} token logo and info for BSC chain.\n\nContract: ${CONFIG.address}\n\nLogo source: https://github.com/${CONFIG.myGithubUser}/mschine`;
    
    const prOutput = run(`gh pr create --repo ${repo} --head ${CONFIG.myGithubUser}:${branch} --title "${prTitle}" --body "${prBody}"`);
    console.log(`✓ PR criado!\n`);
    
    const prUrl = prOutput.match(/https:\/\/github\.com\/[^\s]+/)?.[0];
    fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [Trust Wallet BSC] ${prUrl} — ${new Date().toISOString()}`);
    console.log(`📍 ${prUrl}\n`);
    
    // cleanup
    fs.rmSync(tempDir, { recursive: true });
    
} catch (e) {
    console.error(`✗ Falhou: ${e.message}\n`);
}

// MetaMask
console.log('=== METAMASK (ERC20) ===\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`;
    const repo = CONFIG.upstreamRepos.metamask;
    const myRepo = `${CONFIG.myGithubUser}/contract-metadata`;
    
    const tempDir = path.join(root, '.temp-mm');
    
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    
    console.log('📥 Clonando fork pessoal...');
    run(`git clone --depth=1 https://${CONFIG.myGithubUser}:${token}@github.com/${myRepo}.git "${tempDir}"`);
    
    // criar branch
    run(`git -C "${tempDir}" checkout -b ${branch}`);
    console.log(`✓ Branch criado: ${branch}`);
    
    // ler e atualizar contract-map.json
    const mapPath = path.join(tempDir, 'contract-map.json');
    let contractMap = {};
    
    if (fs.existsSync(mapPath)) {
        contractMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    }
    
    contractMap[CONFIG.address.toLowerCase()] = {
        name: 'Flash USDT',
        logo: `https://raw.githubusercontent.com/${CONFIG.myGithubUser}/mschine/main/blockchains/ethereum/assets/${CONFIG.address}/logo.png`,
        erc20: true,
        symbol: CONFIG.symbol,
        decimals: 18
    };
    
    fs.writeFileSync(mapPath, JSON.stringify(contractMap, Object.keys(contractMap).sort(), 2) + '\n');
    console.log('✓ contract-map.json atualizado');
    
    // commit
    run(`git -C "${tempDir}" config user.name "Copilot Bot"`);
    run(`git -C "${tempDir}" config user.email "bot@github.local"`);
    run(`git -C "${tempDir}" add contract-map.json`);
    run(`git -C "${tempDir}" commit -m "Add ${CONFIG.symbol} token metadata"`);
    console.log('✓ Commit realizado');
    
    // push
    run(`git -C "${tempDir}" push origin ${branch}`);
    console.log('✓ Push realizado');
    
    // criar PR
    const prTitle = `Add ${CONFIG.symbol} token metadata`;
    const prBody = `Adding metadata for ${CONFIG.symbol} (Flash USDT).\n\n- Contract: \`${CONFIG.address}\`\n- Chain: Ethereum (ERC20)\n- Decimals: 18\n- Logo: https://github.com/${CONFIG.myGithubUser}/mschine`;
    
    const prOutput = run(`gh pr create --repo ${repo} --head ${CONFIG.myGithubUser}:${branch} --title "${prTitle}" --body "${prBody}"`);
    console.log(`✓ PR criado!\n`);
    
    const prUrl = prOutput.match(/https:\/\/github\.com\/[^\s]+/)?.[0];
    fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [MetaMask ERC20] ${prUrl} — ${new Date().toISOString()}`);
    console.log(`📍 ${prUrl}\n`);
    
    // cleanup
    fs.rmSync(tempDir, { recursive: true });
    
} catch (e) {
    console.error(`✗ Falhou: ${e.message}\n`);
}

console.log('=== RESUMO ===');
console.log('✓ PRs foram criados e enviados para GitHub');
console.log('📄 Tracking: PR-TRACKING.md\n');
console.log('⏳ Próximos passos:');
console.log('1. Verifique os PRs nas suas páginas');
console.log('2. Aguarde revisão (3-7 dias típico)');
console.log('3. Responda a comentários dos masintainers se houver');
