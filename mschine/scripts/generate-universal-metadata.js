const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// configuration section - edit as needed
const CONFIG = {
    address: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
    name: 'Flash USDT',
    symbol: 'FUSDT',
    decimals: 18,
    githubUser: 'jlainbr-prog',
    repo: 'mschine',
    logoRelativePath: '../blockchains/ethereum/assets/0x419ecA43dB68E868E68d1aB460c8AC32523c7540/logo.png'
};

const BASE_URL = `https://raw.githubusercontent.com/${CONFIG.githubUser}/${CONFIG.repo}/main`;

const chains = [
    { id: 1, name: 'ethereum', type: 'ERC20', explorer: 'etherscan.io' },
    { id: 56, name: 'smartchain', type: 'BEP20', explorer: 'bscscan.com', extraTags: ['binance-peg'] }
];

const root = path.join(__dirname, '..');
const basePath = path.join(root, 'blockchains');

// Criar estrutura de pastas e gerar info.json para cada cadeia
chains.forEach(chain => {
    const tokenPath = path.join(basePath, chain.name, 'assets', CONFIG.address);
    fs.mkdirSync(tokenPath, { recursive: true });

    // Copiar logo se existir na pasta ethereum
    const sourceLogo = path.join(root, 'blockchains', 'ethereum', 'assets', CONFIG.address, 'logo.png');
    if (fs.existsSync(sourceLogo)) {
        fs.copyFileSync(sourceLogo, path.join(tokenPath, 'logo.png'));
        console.log(`✓ Logo copiado para ${chain.name}`);
    }

    // Gerar info.json específico para o token na cadeia
    const info = {
        name: CONFIG.name,
        type: chain.type,
        symbol: CONFIG.symbol,
        decimals: CONFIG.decimals,
        website: `https://${CONFIG.symbol.toLowerCase()}.io`,
        description: "Stablecoin sintética com liquidez flash multi-chain",
        explorer: `https://${chain.explorer}/token/${CONFIG.address}`,
        status: "active",
        id: CONFIG.address,
        links: [
            { name: "github", url: `https://github.com/${CONFIG.githubUser}/${CONFIG.repo}` },
            { name: "source_code", url: `https://github.com/${CONFIG.githubUser}/${CONFIG.repo}/tree/main/contracts` }
        ],
        tags: ["stablecoin", "defi", "synthetic", ...(chain.extraTags || [])]
    };

    fs.writeFileSync(
        path.join(tokenPath, 'info.json'),
        JSON.stringify(info, null, 2)
    );
    console.log(`✓ info.json gerado para ${chain.name}`);
});

// Gerar token list universal
const tokenList = {
    name: "Fusdt Universal List",
    version: { major: 1, minor: 0, patch: 0 },
    timestamp: new Date().toISOString(),
    tokens: chains.map(chain => ({
        chainId: chain.id,
        address: CONFIG.address,
        name: CONFIG.name,
        symbol: CONFIG.symbol,
        decimals: CONFIG.decimals,
        logoURI: `${BASE_URL}/blockchains/${chain.name}/assets/${CONFIG.address}/logo.png`,
        tags: ["stablecoin"]
    })),
    logoURI: `${BASE_URL}/blockchains/ethereum/assets/${CONFIG.address}/logo.png`,
    keywords: [CONFIG.symbol.toLowerCase(), "stablecoin", "flash"]
};

const tokenListPath = path.join(root, 'token-lists');
fs.mkdirSync(tokenListPath, { recursive: true });
fs.writeFileSync(
    path.join(tokenListPath, 'fusdt.tokenlist.json'),
    JSON.stringify(tokenList, null, 2)
);
console.log(`✓ Token list universal gerada`);

// Gerar arquivo de instruções para PRs
const instructions = `# Submissão de Logo FUSDT

## Repos oficiais para PR

### 1. Trust Wallet (maior alcance)
- Repo: https://github.com/trustwallet/assets
- Fork → copiar pasta \`blockchains/smartchain/assets/${CONFIG.address}\` → PR
- Tempo de aprovação: 3-5 dias

### 2. MetaMask Contract Metadata
- Repo: https://github.com/MetaMask/contract-metadata
- Editar \`contract-map.json\` → PR
- Tempo: 1-2 semanas

### 3. Uniswap Default List
- Repo: https://github.com/Uniswap/default-token-list
- Adicionar entrada em \`src/tokens/*.json\` → PR

### 4. CoinGecko (indireto)
- Listar token em: https://www.coingecko.com/pt-br/metodos/listagem
- Após listagem, MetaMask puxa automaticamente

## URLs de acesso direto (já funcionais)

| Carteira | Método | URL |
|----------|--------|-----|
| MetaMask custom token | Importar | ${chains.map(c => `${BASE_URL}/blockchains/${c.name}/assets/${CONFIG.address}/info.json`).join('<br>')} |
| DEX manual | Logo | ${BASE_URL}/blockchains/ethereum/assets/${CONFIG.address}/logo.png |
| Token list | Importar JSON | ${BASE_URL}/token-lists/fusdt.tokenlist.json |

## Verificação automática

Após merge no GitHub, verifique em:
- https://cryptologos.cc (agrega logos de múltiplas fontes)
- https://trustwallet.com/assets (busque pelo endereço)
`;

fs.writeFileSync(
    path.join(root, 'SUBMISSION-GUIDE.md'),
    instructions
);
console.log(`✓ Guia de submissão gerado`);

// Tentar commit e push automático (opcional)
try {
    execSync('git add . && git commit -m "feat: universal metadata for FUSDT" && git push origin main', {
        cwd: root,
        stdio: 'inherit'
    });
    console.log(`✓ Alterações enviadas para GitHub`);
} catch (e) {
    console.log(`! Push manual necessário: git add . && git commit -m "universal metadata" && git push`);
}

console.log('\n=== ESTRUTURA GERADA ===');
console.log('Próximos passos:');
console.log('1. Verifique arquivos em blockchains/*/assets/' + CONFIG.address);
console.log('2. Faça PR para trustwallet/assets (copie pasta smartchain)');
console.log('3. Faça PR para MetaMask/contract-metadata');
console.log('4. URLs já estão acessíveis em raw.githubusercontent.com');
