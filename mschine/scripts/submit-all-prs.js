// scripts/submit-all-prs.js
// full script for submitting PRs across many token-list repositories
// NOTE: this version performs `git clone` operations; on Windows the
// upstream repositories (trustwallet/assets, etc.) contain filenames with
// characters (`:`) that are invalid on NTFS. If the script errors during
// `git clone` you can either run it on a Unix machine or use the
// lighter `submit-final.js` that works via the GitHub API (but only covers
// TrustWallet & MetaMask).

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
    symbol: 'FUSDT',
    name: 'Flash USDT',
    decimals: 18,
    githubUser: 'jlainbr-prog',
    repo: 'mschine',
    logoUrl: (chain='ethereum') =>
        `https://raw.githubusercontent.com/jlainbr-prog/mschine/main/blockchains/${chain}/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/logo.png`
};

const root = path.join(__dirname, '..');
const tempDir = path.join(root, '.temp-pr');
const trackingMd = path.join(root, 'PR-TRACKING.md');

const TARGETS = [
    {
        key: 'trustwallet',
        upstream: 'trustwallet/assets',
        fileChange: (repoDir) => {
            const sourceDir = path.join(root, 'blockchains/smartchain/assets', CONFIG.address);
            const targetDir = path.join(repoDir, 'blockchains/smartchain/assets', CONFIG.address);
            fs.mkdirSync(targetDir, {recursive:true});
            fs.copyFileSync(path.join(sourceDir, 'logo.png'), path.join(targetDir, 'logo.png'));
            fs.copyFileSync(path.join(sourceDir, 'info.json'), path.join(targetDir, 'info.json'));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-bsc-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol} (BEP20) on BSC`,
        prTitle: () => `Add ${CONFIG.symbol} (BEP20)`,
        prBody: () =>
            `Adding ${CONFIG.symbol} token logo and info for BSC chain.\n\n- Contract: \`${CONFIG.address}\`\n- Decimals: ${CONFIG.decimals}\n- Status: active\n- Logo: ${CONFIG.logoUrl('smartchain')}`
    },
    {
        key: 'metamask',
        upstream: 'MetaMask/contract-metadata',
        fileChange: (repoDir) => {
            const mapPath = path.join(repoDir, 'contract-map.json');
            const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
            map[CONFIG.address.toLowerCase()] = {
                name: CONFIG.name,
                logo: CONFIG.logoUrl('ethereum'),
                erc20: true,
                symbol: CONFIG.symbol,
                decimals: CONFIG.decimals
            };
            fs.writeFileSync(mapPath, JSON.stringify(map, Object.keys(map).sort(), 2));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol} token metadata`,
        prTitle: () => `Add ${CONFIG.symbol} token`,
        prBody: () =>
            `Adding metadata for ${CONFIG.symbol} (Flash USDT).\n\n- Contract: \`${CONFIG.address}\`\n- Chain: Ethereum (ERC20)\n- Decimals: ${CONFIG.decimals}\n- Logo verified: ${CONFIG.logoUrl('ethereum')}`
    },
    {
        key: 'uniswapList',
        upstream: 'Uniswap/default-token-list',
        fileChange: (repoDir) => {
            const listPath = path.join(repoDir, 'src', 'tokens', 'mainnet.json');
            const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
            list.push({
                name: CONFIG.name,
                address: CONFIG.address,
                symbol: CONFIG.symbol,
                decimals: CONFIG.decimals,
                chainId: 1,
                logoURI: CONFIG.logoUrl('ethereum'),
                tags: ['stablecoin']
            });
            fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-mainnet-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol} to mainnet list`,
        prTitle: () => `Add ${CONFIG.symbol} token`,
        prBody: () =>
            `Adding ${CONFIG.symbol} to default list.\n\n- Contract: \`${CONFIG.address}\`\n- Tags: stablecoin, defi\n- Logo: ${CONFIG.logoUrl('ethereum')}`
    },
    {
        key: 'sushiswapList',
        upstream: 'sushiswap/default-token-list',
        fileChange: (repoDir) => {
            const listPath = path.join(repoDir, 'tokens', 'mainnet.json');
            const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
            list.tokens.push({
                name: CONFIG.name,
                address: CONFIG.address,
                symbol: CONFIG.symbol,
                decimals: CONFIG.decimals,
                chainId: 1,
                logoURI: CONFIG.logoUrl('ethereum')
            });
            fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol} token`,
        prTitle: () => `Add ${CONFIG.symbol}`,
        prBody: () =>
            `Add ${CONFIG.symbol} (Flash USDT) with verified logo.`
    },
    {
        key: 'inchList',
        upstream: '1inch/token-list',
        fileChange: (repoDir) => {
            const listPath = path.join(repoDir, 'tokens', 'mainnet.json');
            const list = JSON.parse(fs.readFileSync(listPath, 'utf8'));
            list.push({ ...CONFIG, chainId: 1, tags: ['stablecoin']});
            fs.writeFileSync(listPath, JSON.stringify(list, null, 2));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol}`,
        prTitle: () => `Add ${CONFIG.symbol} token`,
        prBody: () =>
            `- Contract: \`${CONFIG.address}\`\n- Symbol: ${CONFIG.symbol}\n- Chain: Mainnet`
    },
    {
        key: 'keplrRegistry',
        upstream: 'cosmos/chain-registry',
        fileChange: (repoDir) => {
            const outDir = path.join(repoDir, '_non-cosmos', 'evm-assets');
            fs.mkdirSync(outDir,{recursive:true});
            const outFile = path.join(outDir, `${CONFIG.address}.json`);
            fs.writeFileSync(outFile, JSON.stringify({
                chainId: 1,
                chainName: 'Ethereum',
                address: CONFIG.address,
                name: CONFIG.name,
                symbol: CONFIG.symbol,
                decimals: CONFIG.decimals,
                image: CONFIG.logoUrl('ethereum'),
                genLogoURI: CONFIG.logoUrl('ethereum')
            }, null, 2));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-evm-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol} EVM asset`,
        prTitle: () => `Add ${CONFIG.symbol} (EVM)`,
        prBody: () =>
            `Register ${CONFIG.symbol} as cross-chain EVM asset for Keplr.`
    },
    {
        key: 'solanaList',      // opcional — caso envy wrapper SPL
        upstream: 'solana-labs/token-list',
        fileChange: (repoDir) => {
            const src = JSON.parse(fs.readFileSync(path.join(root,'token-lists','fusdt.tokenlist.json'),'utf8'));
            const dest = JSON.parse(fs.readFileSync(path.join(repoDir, 'src', 'tokens', 'solana.tokenlist.json'),'utf8'));
            dest.tokens.push(...src.tokens.filter(t => t.chainId === 103));
            fs.writeFileSync(path.join(repoDir, 'src', 'tokens', 'solana.tokenlist.json'), JSON.stringify(dest, null, 2));
        },
        branchName: () => `add-${CONFIG.symbol.toLowerCase()}-solana-${Date.now()}`,
        commitMsg: () => `Add ${CONFIG.symbol} (SPL)`,
        prTitle: () => `Add ${CONFIG.symbol} SPL`,
        prBody: () =>
            'SPL wrapper of FUSDT for Solana ecosystem.'
    }
];

function run(cmd, cwd=root, throwOnError=true){
    try{ return execSync(cmd,{cwd,encoding:'utf8',stdio:'pipe'}).trim(); }
    catch(e){ if(throwOnError) throw new Error(`${cmd}\n${e.message}`); return null; }
}
function ensureGhAuth(){
    try{ run('gh auth status'); console.log('✓ GitHub CLI autenticado'); }
    catch{ console.log('! Exec: gh auth login'); process.exit(1); }
}
function cleanTemp(){
    try{ fs.rmSync(tempDir,{recursive:true,force:true}); }catch{}
    fs.mkdirSync(tempDir,{recursive:true});
}
function ensureTrackingMd(){
    if(!fs.existsSync(trackingMd)) fs.writeFileSync(trackingMd,'# PR tracking\n');
}
function appendTracking(target,url,extra=''){
    fs.appendFileSync(trackingMd,`\n- [${target}] ${url} — ${new Date().toISOString()} ${extra}`);
}

function attemptPR(target){
    const tdir = path.join(tempDir, target.upstream.replace('/','-'));
    run(`git clone https://github.com/${CONFIG.githubUser}/${target.upstream.split('/')[1]}.git "${tdir}"`, tempDir);
    run(`git remote add upstream https://github.com/${target.upstream}.git`, tdir);
    run('git fetch upstream', tdir);
    
    const branch = target.branchName();
    run(`git checkout -b ${branch}`, tdir);
    target.fileChange(tdir);
    
    run('git add .', tdir);
    run(`git commit -m \"${target.commitMsg()}\"`, tdir);
    run(`git push origin ${branch}`, tdir);
    
    const prBodyFixed = target.prBody().replace(/\"/g,'\\\"');
    const cmd = `gh pr create --repo ${target.upstream} --head ${CONFIG.githubUser}:${branch} --title \"${target.prTitle()}\" --body \"${prBodyFixed}\"`;
    const out = run(cmd, tdir, false);
    if(!out) throw new Error('PR creation failed');

    // match first github URL (avoid multiline regex issues)
    const url = out.match(new RegExp('https://github\\.com/[^\\s]+'))?.[0] || 'URL n/a';
    appendTracking(target.key, url, `(branch ${branch})`);
    console.log(`✓ ${target.key} PR criado: ${url}`);
    return url;
}

(async ()=>{
    ensureGhAuth();
    cleanTemp();
    ensureTrackingMd();

    console.log('=== SUBMISSÃO DE PRS — TODAS CARTEIRAS ===\n');
    const successes = {};
    
    for(const t of TARGETS){
        try{
            console.log(`Tentando ${t.key}...`);
            successes[t.key] = attemptPR(t);
        }catch(e){
            console.log(`✗ ${t.key}: ${e.message}`);
            successes[t.key] = null;
        }
    }
    
    // limpeza
    fs.rmSync(tempDir,{recursive:true,force:true});
    
    console.log('\n=== RESUMO ===');
    Object.entries(successes).forEach(([k,v])=>console.log(`${k.padEnd(20)} ${v||'FALHOU'}`));
    console.log(`\nTracking completo em: ${trackingMd}`);
    console.log('Próximos passos: acompanhe PRs por: gh pr list --repo <upstream>');
})();