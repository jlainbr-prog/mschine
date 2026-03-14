import { ethers } from 'ethers';
import fs from 'fs/promises';

// Configurações das redes (vários RPCs para redundância)
const CHAINS = {
    eth: {
        name: 'Ethereum',
        rpc: [
            'https://rpc.ankr.com/eth',
            'https://cloudflare-eth.com',
            'https://rpc.flashbots.net'
        ],
        chainId: 1,
        usdtOfficial: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        usdt: process.env.USDT_ADDRESS || '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
        factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // Uniswap V2 Factory
        router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'  // Uniswap V2 Router
    },
    bsc: {
        name: 'BSC',
        rpc: [
            'https://bsc-dataseed.binance.org',
            'https://bsc-dataseed1.defibit.io',
            'https://bsc.publicnode.com'
        ],
        chainId: 56,
        usdtOfficial: '0x55d398326f92c0feff448b16c8f694e914ce3ee8',
        usdt: process.env.USDT_ADDRESS || '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
        factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // PancakeSwap Factory
        router: '0x10ED43C718714eb63d5aA57B78B54704E256024E'  // PancakeSwap Router
    }
};

// ABI para ERC20 e Uniswap/PancakeSwap
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

const FACTORY_ABI = [
    "function getPair(address tokenA, address tokenB) view returns (address pair)"
];

const PAIR_ABI = [
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() view returns (address)",
    "function token1() view returns (address)"
];

async function getTokenInfo(provider, tokenAddress) {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    try {
        const [symbol, decimals, totalSupply] = await Promise.all([
            contract.symbol(),
            contract.decimals(),
            contract.totalSupply()
        ]);

        return {
            symbol,
            decimals,
            totalSupply: ethers.formatUnits(totalSupply, decimals)
        };
    } catch (error) {
        throw new Error(`Falha ao ler token ${tokenAddress}: ${error.message}`);
    }
}

async function getProvider(chain) {
    // Tenta os RPCs em ordem até achar um que responde
    for (const rpc of chain.rpc) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpc);
            await provider.getNetwork();
            return provider;
        } catch (err) {
            console.warn(`RPC falhou (${chain.name}): ${rpc} -> ${err.message}`);
        }
    }
    throw new Error(`Nenhum RPC disponível para ${chain.name}`);
}

async function getPriceFromDEX(chain, tokenAddress) {
    const provider = await getProvider(chain);
    const factory = new ethers.Contract(chain.factory, FACTORY_ABI, provider);

    // Tentar pares com USDT oficial e WBNB/WETH
    const pairs = [
        chain.usdtOfficial, // Par com USDT oficial
        chain.name === 'BSC' ? '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' : '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WBNB ou WETH
    ];

    for (const baseToken of pairs) {
        try {
            const pairAddress = await factory.getPair(tokenAddress, baseToken);
            if (pairAddress !== ethers.ZeroAddress) {
                const pair = new ethers.Contract(pairAddress, PAIR_ABI, provider);
                const [reserve0, reserve1] = await pair.getReserves();
                const token0 = await pair.token0();
                const token1 = await pair.token1();

                const token0Info = await getTokenInfo(provider, token0);
                const token1Info = await getTokenInfo(provider, token1);

                const isToken0 = token0.toLowerCase() === tokenAddress.toLowerCase();
                const reserveToken = isToken0 ? reserve0 : reserve1;
                const reserveBase = isToken0 ? reserve1 : reserve0;

                const price = Number(reserveBase) / Number(reserveToken);

                // Ajustar para decimais
                const decimalsDiff = token0Info.decimals - token1Info.decimals;
                const adjustedPrice = price * Math.pow(10, decimalsDiff);

                return {
                    pair: `${token0Info.symbol}/${token1Info.symbol}`,
                    price: adjustedPrice,
                    reserves: {
                        token: ethers.formatUnits(reserveToken, isToken0 ? token0Info.decimals : token1Info.decimals),
                        base: ethers.formatUnits(reserveBase, isToken0 ? token1Info.decimals : token0Info.decimals)
                    }
                };
            }
        } catch (error) {
            console.log(`Erro ao buscar par com ${baseToken}:`, error.message);
        }
    }

    return null;
}

async function getTokenStats(chain) {
    const provider = await getProvider(chain);
    const tokenInfo = await getTokenInfo(provider, chain.usdt);

    console.log(`\n📊 Estatísticas do Token ${tokenInfo.symbol} na ${chain.name}`);
    console.log('═'.repeat(60));
    console.log(`Símbolo: ${tokenInfo.symbol}`);
    console.log(`Decimals: ${tokenInfo.decimals}`);
    console.log(`Supply Total: ${Number(tokenInfo.totalSupply).toLocaleString()} ${tokenInfo.symbol}`);

    const priceData = await getPriceFromDEX(chain, chain.usdt);
    if (priceData) {
        console.log(`\n💰 Preço na DEX:`);
        console.log(`Par: ${priceData.pair}`);
        console.log(`Preço: $${priceData.price.toFixed(6)}`);
        console.log(`Reservas - ${priceData.pair.split('/')[0]}: ${priceData.reserves.token}`);
        console.log(`Reservas - ${priceData.pair.split('/')[1]}: ${priceData.reserves.base}`);
    } else {
        console.log('\n❌ Nenhum par encontrado na DEX');
    }

    return {
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        totalSupply: tokenInfo.totalSupply,
        priceData: priceData || null
    };
}

async function main() {
    console.log('🚀 Buscando estatísticas do USDT em diferentes chains...\n');

    const report = [];

    for (const [key, chain] of Object.entries(CHAINS)) {
        try {
            const stats = await getTokenStats(chain);
            report.push({ chain: chain.name, success: true, ...stats });
        } catch (error) {
            console.error(`Erro na chain ${chain.name}:`, error.message);
            report.push({ chain: chain.name, success: false, error: error.message });
        }
    }

    // Escrever relatório local para o dashboard consumir
    await fs.writeFile('token-stats.json', JSON.stringify({
        generatedAt: new Date().toISOString(),
        data: report
    }, null, 2), 'utf8');

    console.log('\n✅ Análise completa!');
    console.log('\n💡 Para visualizar gráficos, abra dashboard.html no navegador');
    console.log('\n🎯 Dica: se o token não existir em alguma chain, ajuste o endereço em `process.env.USDT_ADDRESS` ou no objeto `CHAINS`');
}

main().catch(console.error);