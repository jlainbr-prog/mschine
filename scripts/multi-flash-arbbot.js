#!/usr/bin/env node

import 'dotenv/config.js';
import { ethers } from 'ethers';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { addProfit, startAutoReinvest, getStats } from './auto-reinvest.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHAINS = {
    eth: {
        rpc: process.env.RPC_ETH,
        chainId: 1,
        name: 'Ethereum',
        fusdt: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
        usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',      // Balancer
        router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',    // Uniswap V2
        receiver: process.env.RECEIVER_ETH || '0x0000000000000000000000000000000000000000',
        flashFee: 0, // Balancer 0 bps
        gasToken: 'ETH'
    },
    bsc: {
        rpc: process.env.RPC_BSC,
        chainId: 56,
        name: 'BSC',
        fusdt: '0x419ecA43dB68E868E68d1aB460c8AC32523c7540',
        usdt: '0x55d398326f92c0feff448b16c8f694e914ce3ee8',
        wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',      // Balancer BSC
        router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',    // PancakeSwap
        receiver: process.env.RECEIVER_BSC || '0x0000000000000000000000000000000000000000',
        flashFee: 25, // PancakeSwap 0.025%
        gasToken: 'BNB'
    }
};

// ABIs mínimas
const ERC20_ABI = [
    'function balanceOf(address) view returns (uint)',
    'function approve(address,uint) returns (bool)',
    'function transfer(address,uint) returns (bool)',
    'function decimals() view returns (uint8)'
];

const ROUTER_ABI = [
    'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)',
    'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] path, address to, uint deadline) returns (uint[] amounts)'
];

const VAULT_ABI = [
    'function flashLoan(address recipient, address[] tokens, uint256[] amounts, bytes userData) external'
];

class MultiChainFlashBot {
    constructor() {
        this.chains = {};
        this.profits = { eth: 0, bsc: 0 };
        this.cycles = { eth: 0, bsc: 0 };
        this.txCount = { eth: 0, bsc: 0 };
        this.lastChain = 'eth';
        this.log = [];
        
        this.initChains();
    }

    initChains() {
        for (const [name, cfg] of Object.entries(CHAINS)) {
            if (!cfg.rpc) {
                console.log(`[INIT] ${name.toUpperCase()} RPC não configurado, pulando...`);
                continue;
            }

            try {
                const provider = new ethers.WebSocketProvider(cfg.rpc);
                const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x' + '0'.repeat(64), provider);

                this.chains[name] = {
                    ...cfg,
                    provider,
                    wallet,
                    usdt: new ethers.Contract(cfg.usdt, ERC20_ABI, wallet),
                    fusdt: new ethers.Contract(cfg.fusdt, ERC20_ABI, wallet),
                    vault: new ethers.Contract(cfg.vault, VAULT_ABI, wallet),
                    router: new ethers.Contract(cfg.router, ROUTER_ABI, wallet)
                };

                console.log(`[INIT] ${name.toUpperCase()} inicializado | Wallet: ${wallet.address}`);
            } catch (e) {
                console.error(`[INIT] Erro ao inicializar ${name}:`, e.message);
            }
        }
    }

    async getGasPrice(chain) {
        try {
            const base = await this.chains[chain].provider.getGasPrice();
            const multiplier = Number(process.env.GAS_MULTIPLIER || 1.2);
            return base.mul(Math.floor(multiplier * 10)).div(10);
        } catch (e) {
            console.error(`[GAS] Erro ao obter gas price em ${chain}:`, e.message);
            return ethers.parseUnits('20', 'gwei');
        }
    }

    async simulate(chain, loanAmount) {
        const c = this.chains[chain];
        if (!c) return null;

        try {
            const path1 = [c.usdt, c.fusdt];
            const path2 = [c.fusdt, c.usdt];

            const amounts1 = await c.router.getAmountsOut(loanAmount, path1);
            const fusdtReceived = amounts1[1];

            const amounts2 = await c.router.getAmountsOut(fusdtReceived, path2);
            const usdtReturned = amounts2[1];

            const grossProfit = usdtReturned - loanAmount;
            const fee = (loanAmount * BigInt(c.flashFee)) / 10000n;
            const netProfit = grossProfit - fee;
            const profitUsd = Number(ethers.formatUnits(netProfit, 6));

            return { 
                profitUsd, 
                loanAmount, 
                fusdtReceived, 
                usdtReturned, 
                grossProfit, 
                fee, 
                path1, 
                path2,
                viable: profitUsd > 0
            };
        } catch (e) {
            return null;
        }
    }

    async findBestOpportunity() {
        const loans = [
            ethers.parseUnits('10000', 6),
            ethers.parseUnits('50000', 6),
            ethers.parseUnits('100000', 6),
            ethers.parseUnits('500000', 6),
            ethers.parseUnits('1000000', 6)
        ];

        const results = [];

        for (const chain of Object.keys(this.chains)) {
            for (const loan of loans) {
                try {
                    const sim = await this.simulate(chain, loan);
                    if (sim && sim.viable) {
                        results.push({ chain, ...sim });
                    }
                } catch (e) {
                    // ignorar
                }
            }
        }

        results.sort((a, b) => b.profitUsd - a.profitUsd);
        return results[0] || null;
    }

    async executeFlashLoan(op) {
        const c = this.chains[op.chain];
        const loanStr = ethers.formatUnits(op.loanAmount, 6);
        
        console.log(`[FLASH-${op.chain.toUpperCase()}] Executando: ${loanStr} USDT → ${op.profitUsd.toFixed(2)} USD`);

        try {
            const callbackData = ethers.AbiCoder.defaultAbiCoder().encode(
                ['uint256', 'uint256', 'address[]', 'address[]'],
                [
                    op.loanAmount,
                    (op.fusdtReceived * BigInt(10000 - Number(process.env.SLIPPAGE || 50))) / 10000n,
                    op.path1,
                    op.path2
                ]
            );

            const gasPrice = await this.getGasPrice(op.chain);
            const tx = await c.vault.flashLoan(
                c.receiver,
                [c.usdt],
                [op.loanAmount],
                callbackData,
                { gasPrice, gasLimit: 500000 }
            );

            const receipt = await tx.wait();
            this.profits[op.chain] += op.profitUsd;
            this.cycles[op.chain]++;
            this.txCount[op.chain]++;

            console.log(`[FLASH-${op.chain.toUpperCase()}] ✓ ${receipt.hash}`);
            console.log(`[STATS] ETH: ${this.profits.eth.toFixed(2)} USD (${this.cycles.eth} tx) | BSC: ${this.profits.bsc.toFixed(2)} USD (${this.cycles.bsc} tx)`);

            // Integração: enviar lucro pro reinvestimento automático
            addProfit(op.chain, op.profitUsd);

            const logLine = `${new Date().toISOString()},${op.chain},${receipt.hash},${op.profitUsd.toFixed(2)},${(this.profits.eth + this.profits.bsc).toFixed(2)}\n`;
            fs.appendFileSync('multi-flash-arbbot.log', logLine);
            this.log.push(logLine);

            this.lastChain = op.chain;
            return receipt;
        } catch (e) {
            console.error(`[FLASH-ERR] ${op.chain}:`, e.message);
            return null;
        }
    }

    async cycle() {
        try {
            const best = await this.findBestOpportunity();
            
            if (!best) {
                console.log('[ARB] Nenhuma oportunidade viável detectada');
                return;
            }

            const minProfit = Number(process.env.MIN_PROFIT_USD || 30);
            if (best.profitUsd >= minProfit) {
                await this.executeFlashLoan(best);
            } else {
                console.log(`[ARB] ${best.chain}: ${best.profitUsd.toFixed(2)} USD (abaixo de ${minProfit} USD)`);
            }
        } catch (e) {
            console.error('[CYCLE-ERR]', e.message);
        }
    }

    start() {
        console.log('\n╔════════════════════════════════════╗');
        console.log('║  MULTI-CHAIN FLASH ARB BOT         ║');
        console.log('║  Ethereum + BSC                    ║');
        console.log('╚════════════════════════════════════╝\n');

        console.log(`[INIT] Receiver ETH: ${CHAINS.eth.receiver}`);
        console.log(`[INIT] Receiver BSC: ${CHAINS.bsc.receiver}`);
        console.log(`[INIT] Min Profit: ${process.env.MIN_PROFIT_USD || 30} USD`);
        console.log(`[INIT] Slippage: ${process.env.SLIPPAGE || 50} bps`);
        console.log(`[INIT] Gas Multiplier: ${process.env.GAS_MULTIPLIER || 1.2}x\n`);

        // Inicia reinvestimento automático
        startAutoReinvest();
    }

    async startContinuous(interval) {
        this.start();
        console.log(`[MODO] CONTÍNUO - Ciclos a cada ${(interval/1000/60/60).toFixed(1)} horas\n`);

        let cycleCount = 0;
        while (true) {
            cycleCount++;
            console.log(`\n${'═'.repeat(40)}`);
            console.log(`[CICLO #${cycleCount}] ${new Date().toISOString()}`);
            console.log(`${'═'.repeat(40)}`);

            await this.cycle();

            console.log(`\n[PAUSA] Aguardando ${(interval/1000/60/60).toFixed(1)} horas até próximo ciclo...`);
            const nextRun = new Date(Date.now() + interval).toISOString();
            console.log(`[PRÓXIMO] Próxima execução: ${nextRun}\n`);

            await new Promise(r => setTimeout(r, interval));
        }
    }
}

// Inicializa
const bot = new MultiChainFlashBot();

// ========== MODO DE OPERAÇÃO ==========
// SINGLE_CYCLE=1 → GitHub Actions (one-shot)
// Caso contrário  → Servidor/VPS (contínuo com pausas)
const singleCycle = process.env.SINGLE_CYCLE === '1';
const cycleIntervalHours = Number(process.env.CYCLE_INTERVAL_HOURS || 6);
const cycleIntervalMs = cycleIntervalHours * 60 * 60 * 1000;

if (singleCycle) {
    // ✅ GitHub Actions: executa UM ciclo e encerra
    console.log('[MODO] ONE-SHOT (GitHub Actions)\n');
    (async () => {
        bot.start();
        await bot.cycle();
        
        const total = bot.profits.eth + bot.profits.bsc;
        console.log(`\n${'═'.repeat(40)}`);
        console.log(`[FINAL] ETH: ${bot.profits.eth.toFixed(2)} USD`);
        console.log(`[FINAL] BSC: ${bot.profits.bsc.toFixed(2)} USD`);
        console.log(`[FINAL] TOTAL: ${total.toFixed(2)} USD`);
        console.log(`${'═'.repeat(40)}\n`);
        
        process.exit(0);
    })().catch(e => {
        console.error('[FATAL]', e);
        process.exit(1);
    });
} else {
    // ✅ Servidor/VPS: ciclos contínuos com pausas entre eles
    console.log(`[MODO] CONTÍNUO (Servidor/VPS) - ${cycleIntervalHours}h(s) entre ciclos\n`);
    bot.startContinuous(cycleIntervalMs);
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n[SHUTDOWN] Encerrando bot...');
    console.log(`[STATS] Total ETH: ${bot.profits.eth.toFixed(2)} USD`);
    console.log(`[STATS] Total BSC: ${bot.profits.bsc.toFixed(2)} USD`);
    console.log(`[STATS] Total: ${(bot.profits.eth + bot.profits.bsc).toFixed(2)} USD\n`);
    process.exit(0);
});
