#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Suporte para múltiplos contratos
const CONFIGS = [
    {
        address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
        symbol: 'FUSDT',
        name: 'Flash USDT',
        decimals: 18,
        logoUrl: 'ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q'
    },
    {
        address: '0xDCa62E01D8764f887d7364Ab0e877e4CA8ACCa11',
        symbol: 'FLASH',
        name: 'Flash Arb',
        decimals: 18,
        logoUrl: 'ipfs://QmStnABpnxqfJQyjSGHXVS9h8kqrYi17bnsFzCKvoLeE7q'
    }
];

const projectRoot = path.join(__dirname, '..');
const myGithubUser = 'jlainbr-prog';

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        console.error(`  ✗ Erro: ${e.message}`);
        return null;
    }
}

function getDefaultBranch(repo) {
    const res = run(`gh api repos/${repo}`);
    if (!res) return null;
    try {
        return JSON.parse(res).default_branch;
    } catch (_) {
        return null;
    }
}

function getHeadSha(repo, branch) {
    const res = run(`gh api repos/${repo}/git/refs/heads/${branch}`);
    if (!res) return null;
    try {
        return JSON.parse(res).object.sha;
    } catch (_) {
        return null;
    }
}

console.log('=== SUBMISSÃO MULTI-CONTRATO PARA DEXs ===\n');

const targets = [
    {
        name: 'Uniswap',
        repo: 'Uniswap/default-token-list',
        fileChange: (cfg) => {
            const baseBranch = getDefaultBranch(`${myGithubUser}/default-token-list`) || 'main';
            const branch = `add-${cfg.symbol.toLowerCase()}-${Date.now()}`;
            
            console.log(`  Uniswap: adicionando ${cfg.symbol}...`);
            console.log(`    → Branch: ${branch}`);
            console.log(`    → Endereço: ${cfg.address}`);
        }
    },
    {
        name: 'Sushiswap',
        repo: 'sushiswap/default-token-list',
        fileChange: (cfg) => {
            const baseBranch = getDefaultBranch(`${myGithubUser}/default-token-list`) || 'main';
            const branch = `add-${cfg.symbol.toLowerCase()}-${Date.now()}`;
            
            console.log(`  Sushiswap: adicionando ${cfg.symbol}...`);
            console.log(`    → Branch: ${branch}`);
            console.log(`    → Endereço: ${cfg.address}`);
        }
    },
    {
        name: '1inch',
        repo: '1inch/token-list',
        fileChange: (cfg) => {
            const baseBranch = getDefaultBranch(`${myGithubUser}/token-list`) || 'main';
            const branch = `add-${cfg.symbol.toLowerCase()}-${Date.now()}`;
            
            console.log(`  1inch: adicionando ${cfg.symbol}...`);
            console.log(`    → Branch: ${branch}`);
            console.log(`    → Endereço: ${cfg.address}`);
        }
    }
];

console.log('📋 CONTRATOS A SUBMETER:\n');
CONFIGS.forEach(cfg => {
    console.log(`  • ${cfg.symbol} (${cfg.address})`);
});
console.log('');

console.log('🎯 PLATAFORMAS:\n');
targets.forEach(t => {
    console.log(`  • ${t.name}`);
    CONFIGS.forEach(cfg => t.fileChange(cfg));
    console.log('');
});

console.log('\n✅ Próximos passos:');
console.log('  1. Fazer fork manualmente em cada repositório:');
targets.forEach(t => {
    console.log(`     • ${t.repo} → https://github.com/${t.repo}`);
});
console.log('  2. Adicionar ambos os contratos aos arquivos Token List');
console.log('  3. Fazer PR para o repositório principal');
console.log('  4. Aguardar aprovação (geralmente 1-3 dias)');
console.log('\n📝 Exemplo de entrada no tokenlist JSON:');
console.log(JSON.stringify({
    address: CONFIGS[0].address,
    name: CONFIGS[0].name,
    symbol: CONFIGS[0].symbol,
    decimals: CONFIGS[0].decimals,
    chainId: 1,
    logoURI: CONFIGS[0].logoUrl,
    tags: ['stablecoin', 'defi']
}, null, 2));
console.log('\n');
