require('dotenv').config();
const { TronWeb } = require('tronweb');

const PRIV_KEY = process.env.PRIVATE_KEY;
const TRON_RPC = 'https://api.shasta.trongrid.io'; // Testnet que respondeu antes

async function run() {
  if (!PRIV_KEY) {
    throw new Error('PRIVATE_KEY não configurada');
  }

  console.log('\n=== TESTE TRON (Testnet Shasta) ===\n');
  console.log('URL:', TRON_RPC);
  console.log('Chave: carregada\n');

  const tronweb = new TronWeb({
    fullHost: TRON_RPC,
    privateKey: PRIV_KEY
  });

  try {
    console.log('[*] Conectando...');
    const balance = await tronweb.trx.getBalance(tronweb.defaultAddress.hex);
    console.log(`[✓] Saldo na conta: ${balance} sun (${tronweb.fromSun(balance)} TRX)`);
    console.log(`[✓] Endereço: ${tronweb.defaultAddress.base58}`);
    console.log('\n=== CONECTIVIDADE OK ===\n');
  } catch (err) {
    console.error(`[✗] ERRO: ${err.message}`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error(`[FATAL] ${err.message}`);
  process.exit(1);
});
