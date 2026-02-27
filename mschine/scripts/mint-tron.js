require('dotenv').config();
const { TronWeb } = require('tronweb');

const PRIV_KEY = process.env.PRIVATE_KEY;
const TRON_RPC = process.env.TRON_TESTNET_RPC || 'https://api.shasta.trongrid.io';

async function run() {
  if (!PRIV_KEY) {
    throw new Error('❌ PRIVATE_KEY não configurada em .env');
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TESTE: TRON TESTNET (SHASTA)        ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`RPC: ${TRON_RPC}`);
  console.log(`Chave: carregada\n`);

  const tronweb = new TronWeb({
    fullHost: TRON_RPC,
    privateKey: PRIV_KEY
  });

  try {
    console.log('[*] Conectando ao TRON Testnet...');
    const balance = await tronweb.trx.getBalance(tronweb.defaultAddress.hex);
    const balanceTRX = tronweb.fromSun(balance);
    const walletAddr = tronweb.defaultAddress.base58;

    console.log(`[✓] Conexão OK`);
    console.log(`[✓] Endereço: ${walletAddr}`);
    console.log(`[✓] Saldo: ${balanceTRX} TRX (${balance} sun)`);

    if (balance < 1000000) { // < 1 TRX
      console.log(`\n⚠️  Saldo baixo! Você precisa de mínimo 1 TRX para fazer transações.`);
      console.log(`   Você pode obter TRX grátis em: https://shasta.tronscan.org/#/transfer`);
      process.exit(1);
    }

    console.log(`\n[✓] SUCESSO - Você está conectado ao testnet TRON!`);
    console.log(`[✓] Saldo suficiente para testes\n`);
    process.exit(0);
  } catch (err) {
    console.error(`\n[✗] ERRO: ${err.message}`);
    console.error(`   Dica: Verifique se a RPC ${TRON_RPC} está acessível\n`);
    process.exit(1);
  }
}

run();
