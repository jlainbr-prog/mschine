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

console.log('=== GERADOR DE PRS VIA API ===\n');

// verificar autenticação
try {
    run('gh auth status');
    console.log('✓ GitHub CLI autenticado\n');
} catch {
    console.log('! Erro: execute `gh auth login` antes');
    process.exit(1);
}

// criar forks se não existirem
console.log('📦 Verificando forks...\n');

try {
    run(`gh repo fork ${CONFIG.upstreamRepos.trustwallet} --clone=false 2>/dev/null`, false);
} catch {}

try {
    run(`gh repo fork ${CONFIG.upstreamRepos.metamask} --clone=false 2>/dev/null`, false);
} catch {}

// Trust Wallet PR
console.log('=== TRUST WALLET (BSC) ===');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-bsc-${Date.now()}`;
    const repo = `${CONFIG.myGithubUser}/assets`;
    const upstream = CONFIG.upstreamRepos.trustwallet;
    
    // obter SHA do HEAD do upstream
    const sha = run(`gh api repos/${upstream}/git/refs/heads/main --jq '.object.sha'`);
    console.log(`✓ Branch base SHA: ${sha.substring(0, 8)}...`);
    
    // criar novo branch
    run(`gh api repos/${repo}/git/refs -X POST -f "ref=refs/heads/${branch}" -f "sha=${sha}"`);
    console.log(`✓ Branch criado: ${branch}`);
    
    // ler ficheiros
    const logoPath = path.join(root, 'blockchains', 'smartchain', 'assets', CONFIG.address, 'logo.png');
    const infoPath = path.join(root, 'blockchains', 'smartchain', 'assets', CONFIG.address, 'info.json');
    
    if (!fs.existsSync(logoPath) || !fs.existsSync(infoPath)) {
        throw new Error('Ficheiros de metadados não encontrados');
    }
    
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const infoContent = fs.readFileSync(infoPath, 'utf8');
    
    // upload logo
    const logoBlobResponse = run(
        `gh api repos/${repo}/git/blobs -X POST -f "content=${logoBase64}" -F "encoding=base64" --jq '.sha'`
    );
    console.log(`✓ Logo uploaded: ${logoBlobResponse.substring(0, 8)}...`);
    
    // upload info.json
    const infoBase64 = Buffer.from(infoContent).toString('base64');
    const infoBlobResponse = run(
        `gh api repos/${repo}/git/blobs -X POST -f "content=${infoBase64}" -F "encoding=base64" --jq '.sha'`
    );
    console.log(`✓ Info JSON uploaded: ${infoBlobResponse.substring(0, 8)}...`);
    
    // criar tree com os dois ficheiros
    const treeContent = JSON.stringify({
        base_tree: sha,
        tree: [
            {
                path: `blockchains/smartchain/assets/${CONFIG.address}/logo.png`,
                mode: '100644',
                type: 'blob',
                sha: logoBlobResponse
            },
            {
                path: `blockchains/smartchain/assets/${CONFIG.address}/info.json`,
                mode: '100644',
                type: 'blob',
                sha: infoBlobResponse
            }
        ]
    });
    
    const treePath = path.join(root, '.temp-tree.json');
    fs.writeFileSync(treePath, treeContent);
    
    const treeResponse = run(`gh api repos/${repo}/git/trees -X POST --input ${treePath} --jq '.sha'`);
    fs.unlinkSync(treePath);
    console.log(`✓ Tree criada: ${treeResponse.substring(0, 8)}...`);
    
    // criar commit
    const commitContent = JSON.stringify({
        message: `Add ${CONFIG.symbol} (BEP20) on BSC`,
        tree: treeResponse,
        parents: [sha]
    });
    
    const commitPath = path.join(root, '.temp-commit.json');
    fs.writeFileSync(commitPath, commitContent);
    
    const commitSha = run(`gh api repos/${repo}/git/commits -X POST --input ${commitPath} --jq '.sha'`);
    fs.unlinkSync(commitPath);
    console.log(`✓ Commit criado: ${commitSha.substring(0, 8)}...`);
    
    // atualizar referência do branch
    run(`gh api repos/${repo}/git/refs/heads/${branch} -X PATCH -f "sha=${commitSha}"`);
    console.log(`✓ Branch atualizado`);
    
    // criar PR
    const prBody = `Adding ${CONFIG.symbol} token logo and info for BSC chain.\n\nContract: ${CONFIG.address}\nSource: https://github.com/jlainbr-prog/mschine`;
    const prContent = JSON.stringify({
        title: `Add ${CONFIG.symbol} (BEP20) on BSC`,
        head: `${CONFIG.myGithubUser}:${branch}`,
        base: 'main',
        body: prBody
    });
    
    const prPath = path.join(root, '.temp-pr.json');
    fs.writeFileSync(prPath, prContent);
    
    const prUrl = run(`gh api repos/${CONFIG.upstreamRepos.trustwallet}/pulls -X POST --input ${prPath} --jq '.html_url'`);
    fs.unlinkSync(prPath);
    
    console.log(`\n✅ PR criado: ${prUrl}\n`);
    
    fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [Trust Wallet BSC] ${prUrl} — ${new Date().toISOString()}`);
    
} catch (e) {
    console.error(`✗ Falhou: ${e.message}\n`);
}

// MetaMask PR
console.log('=== METAMASK (ERC20) ===');

try {
    const branch = `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`;
    const repo = `${CONFIG.myGithubUser}/contract-metadata`;
    const upstream = CONFIG.upstreamRepos.metamask;
    
    // obter SHA do HEAD do upstream
    const sha = run(`gh api repos/${upstream}/git/refs/heads/main --jq '.object.sha'`);
    console.log(`✓ Branch base SHA: ${sha.substring(0, 8)}...`);
    
    // obter arquivo atual do upstream
    const contractMapSha = run(
        `gh api repos/${upstream}/contents/contract-map.json --jq '.sha'`,
        false
    );
    
    // ler arquivo do upstream
    let contractMap = {};
    try {
        const upstreamMapContent = run(
            `gh api repos/${upstream}/contents/contract-map.json --jq '.content' | base64 -d`,
            false
        );
        contractMap = JSON.parse(upstreamMapContent);
    } catch (e) {
        console.log('ℹ Criando novo contract-map.json');
    }
    
    // adicionar entrada
    contractMap[CONFIG.address.toLowerCase()] = {
        name: 'Flash USDT',
        logo: `https://raw.githubusercontent.com/${CONFIG.myGithubUser}/mschine/main/blockchains/ethereum/assets/${CONFIG.address}/logo.png`,
        erc20: true,
        symbol: CONFIG.symbol,
        decimals: 18
    };
    
    const mapContent = JSON.stringify(contractMap, Object.keys(contractMap).sort(), 2);
    const mapBase64 = Buffer.from(mapContent).toString('base64');
    
    // criar novo branch
    run(`gh api repos/${repo}/git/refs -X POST -f "ref=refs/heads/${branch}" -f "sha=${sha}"`);
    console.log(`✓ Branch criado: ${branch}`);
    
    // fazer upload do arquivo atualizado
    const uploadPayload = {
        message: `Add ${CONFIG.symbol} token metadata`,
        content: mapBase64,
        branch: branch
    };
    
    if (contractMapSha) {
        uploadPayload.sha = contractMapSha;
    }
    
    const payloadPath = path.join(root, '.temp-upload.json');
    fs.writeFileSync(payloadPath, JSON.stringify(uploadPayload));
    
    run(`gh api repos/${repo}/contents/contract-map.json -X PUT --input ${payloadPath}`);
    fs.unlinkSync(payloadPath);
    console.log(`✓ Contract-map.json atualizado`);
    
    // criar PR
    const prBody = `Adding metadata for ${CONFIG.symbol} (Flash USDT).\n\n- Contract: \`${CONFIG.address}\`\n- Chain: Ethereum (ERC20)\n- Decimals: 18\n- Logo: https://github.com/jlainbr-prog/mschine`;
    const prContent = JSON.stringify({
        title: `Add ${CONFIG.symbol} token metadata`,
        head: `${CONFIG.myGithubUser}:${branch}`,
        base: 'main',
        body: prBody
    });
    
    const prPath = path.join(root, '.temp-pr2.json');
    fs.writeFileSync(prPath, prContent);
    
    const prUrl = run(`gh api repos/${CONFIG.upstreamRepos.metamask}/pulls -X POST --input ${prPath} --jq '.html_url'`);
    fs.unlinkSync(prPath);
    
    console.log(`\n✅ PR criado: ${prUrl}\n`);
    
    fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [MetaMask ERC20] ${prUrl} — ${new Date().toISOString()}`);
    
} catch (e) {
    console.error(`✗ Falhou: ${e.message}\n`);
}

console.log('=== RESUMO ===');
console.log('PRs tracking: PR-TRACKING.md');
console.log('\n✓ Próximos passos:');
console.log('1. Verifique os PRs no GitHub');
console.log('2. Se houver conflitos, ajuste e faça push novamente');
console.log('3. Aguarde revisão das maintainers (3-7 dias típico)');
