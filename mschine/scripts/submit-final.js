#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// configuration for submitting PRs; to handle another contract, duplicate
// this object (or run the script again with values edited) and adjust the
// address/symbol accordingly.
const CONFIG = {
    address: '0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11',
    symbol: 'FLASH',
    myGithubUser: 'jlainbr-prog'
};

const projectRoot = path.join(__dirname, '..');

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        console.error(`  ✗ Erro: ${e.message}`);
        return null;
    }
}

// get default branch for a repo (returns string or null)
function getDefaultBranch(repo) {
    const res = run(`gh api repos/${repo}`);
    if (!res) return null;
    try {
        return JSON.parse(res).default_branch;
    } catch (_) {
        return null;
    }
}

// get SHA of head for given repo and branch
function getHeadSha(repo, branch) {
    const res = run(`gh api repos/${repo}/git/refs/heads/${branch}`);
    if (!res) return null;
    try {
        return JSON.parse(res).object.sha;
    } catch (_) {
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
    
    // verificar logo existente
    const logoPath = path.join(projectRoot, 'blockchains', 'smartchain', 'assets', CONFIG.address, 'logo.png');
    if (!fs.existsSync(logoPath)) {
        console.log(`  ⚠ Logo ausente em ${logoPath}`);
        console.log('  → Faça o upload manual ou coloque um logo.png e execute o script novamente.\n');
    } else {
        const logoBuffer = fs.readFileSync(logoPath);
        const logoBase64 = logoBuffer.toString('base64');
        
        // criar branch usando branch padrão do repo
        const baseBranch = getDefaultBranch(repo) || 'master';
        const repoHead = getHeadSha(repo, baseBranch);
        if (!repoHead) throw new Error('SHA não encontrado para a branch ' + baseBranch);
        
        console.log(`  1. Criando branch: ${branch} (base ${baseBranch})`);
        run(`gh api repos/${repo}/git/refs -X POST -f ref=refs/heads/${branch} -f sha=${repoHead}`);
        console.log(`  ✓ Branch criado`);
        
        // adicionar logo
        console.log(`  2. Adicionando logo.png`);
        const uploadPayload = {
            message: `Add ${CONFIG.symbol} (BEP20) on BSC`,
            content: logoBase64,
            branch: branch
        };
        
        let tempFile = path.join(projectRoot, '.temp-upload.json');
        fs.writeFileSync(tempFile, JSON.stringify(uploadPayload));
        run(`gh api repos/${repo}/contents/${file} -X PUT --input "${tempFile}"`);
        fs.unlinkSync(tempFile);
        console.log(`  ✓ Logo adicionado`);
        
        // adicionar info.json
        console.log(`  3. Adicionando info.json`);
        const infoPath = `blockchains/smartchain/assets/${CONFIG.address}/info.json`;
        const infoContent = fs.readFileSync(path.join(projectRoot, infoPath), 'utf8');
        const infoBase64 = Buffer.from(infoContent).toString('base64');
        
        const infoPayload = {
            message: `Add ${CONFIG.symbol} (BEP20) on BSC`,
            content: infoBase64,
            branch: branch
        };
        
        fs.writeFileSync(tempFile, JSON.stringify(infoPayload));
        run(`gh api repos/${repo}/contents/${infoPath} -X PUT --input "${tempFile}"`);
        fs.unlinkSync(tempFile);
        console.log(`  ✓ Info JSON adicionado`);
        
        // criar PR
        console.log(`  4. Criando PR...`);
        const prPayload = {
            title: `Add ${CONFIG.symbol} (BEP20) on BSC`,
            head: `${CONFIG.myGithubUser}:${branch}`,
            base: baseBranch,
            body: `Adding ${CONFIG.symbol} token logo and metadata for BSC.\n\nContract: ${CONFIG.address}\n\nLogo source: https://github.com/jlainbr-prog/mschine`
        };
        
        let prFile = path.join(projectRoot, '.temp-pr.json');
        fs.writeFileSync(prFile, JSON.stringify(prPayload));
        const prResp = run(`gh api repos/trustwallet/assets/pulls -X POST --input "${prFile}"`);
        fs.unlinkSync(prFile);
        let prUrl;
        if (prResp) {
            try { prUrl = JSON.parse(prResp).html_url; } catch (_){ prUrl = null; }
        }
        if (prUrl) {
            console.log(`  ✓ PR criado!`);
            console.log(`  📍 ${prUrl}\n`);
            fs.appendFileSync(path.join(projectRoot, 'PR-TRACKING.md'), 
                `\n- [Trust Wallet BSC] ${prUrl} — ${new Date().toISOString()}`);
        } else {
            console.log(`  ✗ Erro ao criar PR (resposta: ${prResp})\n`);
        }
    }
} catch (e) {
    console.error(`  ✗ ${e.message}\n`);
}

// MetaMask
console.log('📤 METAMASK (ERC20):\n');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`;
    const repo = `${CONFIG.myGithubUser}/contract-metadata`;
    const file = 'contract-map.json';
    
    // obter arquivo atual
    console.log(`  1. Obtendo contract-map.json...`);
    const fileInfoJson = run(`gh api repos/${repo}/contents/${file}`);
    if (!fileInfoJson) throw new Error('Não conseguiu obter arquivo');
    
    const fileInfo = JSON.parse(fileInfoJson);
    const currentContent = Buffer.from(fileInfo.content, 'base64').toString('utf8');
    let contractMap = JSON.parse(currentContent);
    
    // adicionar entrada
    contractMap[CONFIG.address.toLowerCase()] = {
        name: 'Flash USDT',
        logo: `ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q`,
        decimals: 18
    };
    
    const newContent = JSON.stringify(contractMap, Object.keys(contractMap).sort(), 2) + '\n';
    
    // criar branch
    const baseBranch = getDefaultBranch(repo) || 'master';
    console.log(`  2. Criando branch: ${branch} (base ${baseBranch})`);
    const head = getHeadSha(repo, baseBranch);
    if (!head) throw new Error('SHA não encontrado para ' + baseBranch);
    run(`gh api repos/${repo}/git/refs -X POST -f ref=refs/heads/${branch} -f sha=${head}`);
    console.log(`  ✓ Branch criado`);
    
    // atualizar arquivo
    console.log(`  3. Atualizando contract-map.json...`);
    const fileSha = fileInfo.sha;
    
    const updatePayload = {
        message: `Add ${CONFIG.symbol} token metadata`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileSha,
        branch: branch
    };
    
    let tempFile = path.join(projectRoot, '.temp-update.json');
    fs.writeFileSync(tempFile, JSON.stringify(updatePayload));
    run(`gh api repos/${repo}/contents/${file} -X PUT --input "${tempFile}"`);
    fs.unlinkSync(tempFile);
    console.log(`  ✓ Arquivo atualizado`);
    
    // criar PR
    console.log(`  4. Criando PR...`);
    const prPayload = {
        title: `Add ${CONFIG.symbol} token metadata`,
        head: `${CONFIG.myGithubUser}:${branch}`,
        base: baseBranch,
        body: `Adding metadata for **${CONFIG.symbol}** (Flash USDT ERC20).\n\n- **Address:** ${CONFIG.address}\n- **Decimals:** 18\n- **Logo:** https://github.com/jlainbr-prog/mschine`
    };
    
    let prFile = path.join(projectRoot, '.temp-pr2.json');
    fs.writeFileSync(prFile, JSON.stringify(prPayload));
    const prResp = run(`gh api repos/MetaMask/contract-metadata/pulls -X POST --input "${prFile}"`);
    fs.unlinkSync(prFile);
    let prUrl;
    if (prResp) {
        try { prUrl = JSON.parse(prResp).html_url; } catch (_){ prUrl = null; }
    }
    if (prUrl) {
        console.log(`  ✓ PR criado!`);
        console.log(`  📍 ${prUrl}\n`);
        fs.appendFileSync(path.join(projectRoot, 'PR-TRACKING.md'), 
            `\n- [MetaMask ERC20] ${prUrl} — ${new Date().toISOString()}`);
    } else {
        console.log(`  ✗ Erro ao criar PR (resposta: ${prResp})\n`);
    }
    
} catch (e) {
    console.error(`  ✗ ${e.message}\n`);
}

console.log('✅ Processo concluído!');
console.log('📊 Ver: mschine/PR-TRACKING.md\n');
