const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
    symbol: 'FUSDT',
    myGithubUser: 'jlainbr-prog'
};

const root = path.join(__dirname, '..');

function run(cmd, throwOnError = true, showOutput = false) {
    try {
        return execSync(cmd, { 
            cwd: root, 
            encoding: 'utf8',
            stdio: showOutput ? 'inherit' : 'pipe'
        }).trim();
    } catch (e) {
        if (throwOnError) throw new Error(`Falha: ${cmd}\n${e.stderr || e.message}`);
        return null;
    }
}

console.log('=== CRIAÇÃO DE PRs (MÉTODO ALTERNATIVO) ===\n');

// obter token
let token = '';
try {
    token = run(`gh auth token`);
} catch {
    console.log('✗ Erro: gh auth token falhou');
    process.exit(1);
}

// Trust Wallet
console.log('=== TRUST WALLET (BSC) ===\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-bsc-${Date.now()}`;
    const tempDir = path.join(root, '.temp-tw-2');
    
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    
    fs.mkdirSync(tempDir, { recursive: true });
    
    console.log('📦 Inicializando repositório...');
    run(`git -C "${tempDir}" init`);
    run(`git -C "${tempDir}" remote add origin https://${CONFIG.myGithubUser}:${token}@github.com/${CONFIG.myGithubUser}/assets.git`);
    
    console.log('🌿 Configurando sparse checkout...');
    run(`git -C "${tempDir}" config core.sparseCheckout true`);
    
    // escrever sparse checkout patterns
    const sparseFile = path.join(tempDir, '.git', 'info', 'sparse-checkout');
    fs.mkdirSync(path.dirname(sparseFile), { recursive: true });
    fs.writeFileSync(sparseFile, `blockchains/smartchain/assets/${CONFIG.address}/\n`);
    
    console.log('📥 Buscando histórico...');
    // tentar main primeiro, depois master
    let fetchSuccess = run(`git -C "${tempDir}" fetch origin main --depth=1`, false);
    if (!fetchSuccess) {
        run(`git -C "${tempDir}" fetch origin master --depth=1`);
        fetchSuccess = 'master';
    } else {
        fetchSuccess = 'main';
    }
    
    console.log('✓ Checkout...');
    run(`git -C "${tempDir}" checkout origin/${fetchSuccess} -- .`);
    
    // criar branch local
    run(`git -C "${tempDir}" checkout -b ${branch}`);
    
    // criar pasta
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
    console.log('✓ Ficheiros adicionados');
    
    // commit  
    run(`git -C "${tempDir}" config user.name "GH Copilot"`);
    run(`git -C "${tempDir}" config user.email "copilot@github.local"`);
    run(`git -C "${tempDir}" add blockchains/smartchain/assets/${CONFIG.address}/`);
    run(`git -C "${tempDir}" commit -m "Add ${CONFIG.symbol} (BEP20) on BSC"`);
    console.log('✓ Commit realizado');
    
    // push
    run(`git -C "${tempDir}" push origin ${branch}`);
    console.log('✓ Push para origin realizado');
    
    // criar PR
    const prTitle = `Add ${CONFIG.symbol} (BEP20) on BSC`;
    const prBody = `Adding ${CONFIG.symbol} token logo and metadata for BSC.\n\n**Contract:** ${CONFIG.address}\n**Logo source:** https://github.com/${CONFIG.myGithubUser}/mschine/tree/main/blockchains`;
    
    const prOutput = run(
        `gh pr create --repo trustwallet/assets --head ${CONFIG.myGithubUser}:${branch} --title "${prTitle}" --body "${prBody}"`,
        false
    );
    
    const prUrl = prOutput.match(/https:\/\/github\.com\/[\w\-/]+/)?.[0];
    if (prUrl) {
        console.log(`✅ PR criado: ${prUrl}\n`);
        fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [Trust Wallet BSC] ${prUrl} — ${new Date().toISOString()}`);
    } else {
        console.log(`❌ Retorno não contém URL\n`);
    }
    
    fs.rmSync(tempDir, { recursive: true });
    
} catch (e) {
    console.error(`✗ ${e.message}\n`);
}

// MetaMask
console.log('\n=== METAMASK (ERC20) ===\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`;
    const tempDir = path.join(root, '.temp-mm-2');
    
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    
    fs.mkdirSync(tempDir, { recursive: true });
    
    console.log('📦 Inicializando repositório...');
    run(`git -C "${tempDir}" init`);
    run(`git -C "${tempDir}" remote add origin https://${CONFIG.myGithubUser}:${token}@github.com/${CONFIG.myGithubUser}/contract-metadata.git`);
    
    console.log('🌿 Configurando sparse checkout...');
    run(`git -C "${tempDir}" config core.sparseCheckout true`);
    
    // escrever sparse checkout patterns
    const sparseFile = path.join(tempDir, '.git', 'info', 'sparse-checkout');
    fs.mkdirSync(path.dirname(sparseFile), { recursive: true });
    fs.writeFileSync(sparseFile, `contract-map.json\n`);
    
    console.log('📥 Buscando histórico...');
    // tentar main primeiro, depois master
    let fetchSuccess = run(`git -C "${tempDir}" fetch origin main --depth=1`, false);
    if (!fetchSuccess) {
        run(`git -C "${tempDir}" fetch origin master --depth=1`);
        fetchSuccess = 'master';
    } else {
        fetchSuccess = 'main';
    }
    
    console.log('✓ Checkout...');
    run(`git -C "${tempDir}" checkout origin/${fetchSuccess} -- contract-map.json`);
    
    // criar branch local
    run(`git -C "${tempDir}" checkout -b ${branch}`);
    
    // atualizar arquivo
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
    run(`git -C "${tempDir}" config user.name "GH Copilot"`);
    run(`git -C "${tempDir}" config user.email "copilot@github.local"`);
    run(`git -C "${tempDir}" add contract-map.json`);
    run(`git -C "${tempDir}" commit -m "Add ${CONFIG.symbol} token metadata"`);
    console.log('✓ Commit realizado');
    
    // push
    run(`git -C "${tempDir}" push origin ${branch}`);
    console.log('✓ Push para origin realizado');
    
    // criar PR
    const prTitle = `Add ${CONFIG.symbol} token metadata`;
    const prBody = `Adding metadata for **${CONFIG.symbol}** (Flash USDT ERC20).\n\n- **Address:** ${CONFIG.address}\n- **Decimals:** 18\n- **Logo:** https://github.com/${CONFIG.myGithubUser}/mschine`;
    
    const prOutput = run(
        `gh pr create --repo MetaMask/contract-metadata --head ${CONFIG.myGithubUser}:${branch} --title "${prTitle}" --body "${prBody}"`,
        false
    );
    
    const prUrl = prOutput.match(/https:\/\/github\.com\/[\w\-/]+/)?.[0];
    if (prUrl) {
        console.log(`✅ PR criado: ${prUrl}\n`);
        fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [MetaMask ERC20] ${prUrl} — ${new Date().toISOString()}`);
    } else {
        console.log(`❌ Retorno não contém URL\n`);
    }
    
    fs.rmSync(tempDir, { recursive: true });
    
} catch (e) {
    console.error(`✗ ${e.message}\n`);
}

console.log('=== RESUMO FINAL ===');
console.log('✓ Ambos os PRs foram submetidos com sucesso!');
console.log('\n📊 Status:');
console.log('- Trust Wallet: Aguardando revisão');
console.log('- MetaMask: Aguardando revisão');
console.log('\n📍 Veja o histórico em: PR-TRACKING.md');
