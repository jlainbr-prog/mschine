#!/usr/bin/env node

const https = require('https');

const providers = [
  { name: 'Cloudflare', url: 'https://cloudflare-eth.com' },
  { name: 'Infura (sem auth)', url: 'https://mainnet.infura.io' },
  { name: '1RPC', url: 'https://1rpc.io/eth' },
  { name: 'Alchemy (demo)', url: 'https://eth-mainnet.g.alchemy.com/v2/demo' }
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 5000 }, (res) => {
      console.log(`  Status: ${res.statusCode}`);
      resolve(res.statusCode);
    });
    req.on('error', (err) => {
      console.log(`  Erro: ${err.code || err.message}`);
      resolve(null);
    });
    req.on('timeout', () => {
      console.log(`  Timeout`);
      req.destroy();
      resolve(null);
    });
  });
}

async function main() {
  console.log('\n=== TESTE DE CONECTIVIDADE ETH-MAINNET ===\n');
  for (const p of providers) {
    console.log(`[*] ${p.name}:`);
    console.log(`    URL: ${p.url}`);
    await testUrl(p.url);
    console.log();
  }
  console.log('✅ Se todos falharam, há bloqueio de rede ou os provedores estão indisponíveis.\n');
}

main();
