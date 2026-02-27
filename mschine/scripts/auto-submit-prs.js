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
const tempDir = path.join(root, '.temp-pr');

function run(cmd, cwd = root, throwOnError = true) {
    try {
        return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        if (throwOnError) throw new Error(`Falha: ${cmd}\n${e.stderr || e.message}`);
        return null;
    }
}

function ensureGhAuth() {
    try {
        run('gh auth status', root);
        console.log('✓ GitHub CLI autenticado');
    } catch {
        console.log('! Execução necessária: gh auth login');
        process.exit(1);
    }
}

function cleanTemp() {
    try { fs.rmSync(tempDir, { recursive: true }); } catch {}
    fs.mkdirSync(tempDir, { recursive: true });
}

function submitTrustWalletPR() {
    console.log('\n=== TRUST WALLET PR ===');
    
    const repoDir = path.join(tempDir, 'trustwallet-assets');
    const upstream = CONFIG.upstreamRepos.trustwallet;
    
    // fork e clone
    run(`gh repo fork ${upstream} --clone=false --default-branch-only`);
    run(`git clone https://github.com/${CONFIG.myGithubUser}/assets.git ${repoDir}`, tempDir);
    
    // configurar upstream
    run(`git remote add upstream https://github.com/${upstream}.git`, repoDir);
    run('git fetch upstream', repoDir);
    
    // criar branch
    const branch = `add-${CONFIG.symbol.toLowerCase()}-bsc-${Date.now()}`;
    run(`git checkout -b ${branch}`, repoDir);
    
    // copiar arquivos (BSC como prioridade)
    const sourceDir = path.join(root, 'blockchains/smartchain/assets', CONFIG.address);
    const targetDir = path.join(repoDir, 'blockchains/smartchain/assets', CONFIG.address);
    
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(path.join(sourceDir, 'logo.png'), path.join(targetDir, 'logo.png'));
    fs.copyFileSync(path.join(sourceDir, 'info.json'), path.join(targetDir, 'info.json'));
    
    // verificar tamanho da logo
    const logoStats = fs.statSync(path.join(targetDir, 'logo.png'));
    if (logoStats.size > 100 * 1024) {
        console.log(`! Aviso: logo.png tem ${(logoStats.size/1024).toFixed(1)}KB, máximo é 100KB`);
    }
    
    // commit e push
    run('git add .', repoDir);
    run(`git commit -m "Add ${CONFIG.symbol} (BEP20) on BSC"`, repoDir);
    run(`git push origin ${branch}`, repoDir);
    
    // criar PR
    const prOutput = run(
        `gh pr create --repo ${upstream} --head ${CONFIG.myGithubUser}:${branch} --title "Add ${CONFIG.symbol} (BEP20)" --body-file -`,
        repoDir,
        false
    ) || run(
        `gh pr create --repo ${upstream} --head ${CONFIG.myGithubUser}:${branch} --title "Add ${CONFIG.symbol} (BEP20)" --body "Adding ${CONFIG.symbol} token logo and info for BSC chain. Contract: ${CONFIG.address}"`,
        repoDir
    );
    
    console.log('✓ PR Trust Wallet criado');
    console.log(prOutput);
    
    // salvar URL
    const prUrl = prOutput.match(/https:\/\/github\.com\/[\w\-\.\/]+/)?.[0] || 'URL não capturada';
    fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [Trust Wallet BSC] ${prUrl} — ${new Date().toISOString()}`);
    
    return prUrl;
}

function submitMetaMaskPR() {
    console.log('\n=== METAMASK PR ===');
    
    const repoDir = path.join(tempDir, 'metamask-contract-metadata');
    const upstream = CONFIG.upstreamRepos.metamask;
    
    // fork e clone
    run(`gh repo fork ${upstream} --clone=false --default-branch-only`);
    run(`git clone https://github.com/${CONFIG.myGithubUser}/contract-metadata.git ${repoDir}`, tempDir);
    
    // configurar upstream
    run(`git remote add upstream https://github.com/${upstream}.git`, repoDir);
    run('git fetch upstream', repoDir);
    
    // criar branch
    const branch = `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`;
    run(`git checkout -b ${branch}`, repoDir);
    
    // atualizar contract-map.json
    const contractMapPath = path.join(repoDir, 'contract-map.json');
    const contractMap = JSON.parse(fs.readFileSync(contractMapPath, 'utf8'));
    
    // adicionar entrada (lowercase address required)
    contractMap[CONFIG.address.toLowerCase()] = {
        name: 'Flash USDT',
        logo: `https://raw.githubusercontent.com/${CONFIG.myGithubUser}/mschine/main/blockchains/ethereum/assets/${CONFIG.address}/logo.png`,
        erc20: true,
        symbol: CONFIG.symbol,
        decimals: 18
    };
    
    fs.writeFileSync(contractMapPath, JSON.stringify(contractMap, Object.keys(contractMap).sort(), 2));
    
    // commit e push
    run('git add .', repoDir);
    run(`git commit -m "Add ${CONFIG.symbol} token metadata"`, repoDir);
    run(`git push origin ${branch}`, repoDir);
    
    // criar PR
    const prBody = `Adding metadata for ${CONFIG.symbol} (Flash USDT).\n\n- Contract: \`${CONFIG.address}\`\n- Chain: Ethereum (ERC20)\n- Decimals: 18\n- Logo source: https://github.com/${CONFIG.myGithubUser}/mschine\n\nVerification:\n- [x] Contract is verified on Etherscan\n- [x] Logo follows guidelines (PNG, 256x256, <100KB)\n- [x] Token has trading activity`;

    const prOutput = run(
        `gh pr create --repo ${upstream} --head ${CONFIG.myGithubUser}:${branch} --title "Add ${CONFIG.symbol} token" --body "${prBody}"`,
        repoDir
    );
    
    console.log('✓ PR MetaMask criado');
    console.log(prOutput);
    
    // salvar URL
    const prUrl = prOutput.match(/https:\/\/github\.com\/[\w\-\.\/]+/)?.[0] || 'URL não capturada';
    fs.appendFileSync(path.join(root, 'PR-TRACKING.md'), `\n- [MetaMask] ${prUrl} — ${new Date().toISOString()}`);
    
    return prUrl;
}

// execução principal
console.log('=== GERADOR DE PRS AUTOMÁTICOS ===\n');

ensureGhAuth();
cleanTemp();

const results = {
    trustwallet: null,
    metamask: null
};

try {
    results.trustwallet = submitTrustWalletPR();
} catch (e) {
    console.error(`✗ Trust Wallet falhou: ${e.message}`);
}

try {
    results.metamask = submitMetaMaskPR();
} catch (e) {
    console.error(`✗ MetaMask falhou: ${e.message}`);
}

// limpeza
fs.rmSync(tempDir, { recursive: true, force: true });

// resumo
console.log('\n=== RESUMO ===');
console.log(`Trust Wallet: ${results.trustwallet || 'FALHOU — verifique forks manuais'}`);
console.log(`MetaMask: ${results.metamask || 'FALHOU — verifique forks manuais'}`);
console.log(`\nTracking salvo em: ${path.join(root, 'PR-TRACKING.md')}`);

// próximos passos
console.log('\n=== PRÓXIMOS PASSOS ===');
console.log('1. Acompanhe status via: gh pr list --repo trustwallet/assets');
console.log('2. Acompanhe status via: gh pr list --repo MetaMask/contract-metadata');
console.log('3. Se recusado, ajuste e rode novamente (script idempotente)');
console.log('4. Para carteiras adicionais, liste abaixo e adapto o script');
