require('dotenv').config();
const { ethers } = require('ethers');

const PRIV_KEY = process.env.PRIVATE_KEY;
const INFURA_KEY = process.env.INFURA_API_KEY;
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const TOKEN_ADDR = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';

const ABI = [
  'function mint(address to, uint amount) external',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint)'
];

async function run() {
  if (!PRIV_KEY) {
    throw new Error('❌ PRIVATE_KEY não configurada em .env');
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TESTE: API KEYS (Infura/Alchemy)   ║');
  console.log('╚════════════════════════════════════════╝\n');

  let provider;

  if (INFURA_KEY) {
    console.log('[*] Usando Infura...');
    provider = new ethers.InfuraProvider('mainnet', INFURA_KEY);
  } else if (ALCHEMY_KEY) {
    console.log('[*] Usando Alchemy...');
    provider = new ethers.AlchemyProvider('mainnet', ALCHEMY_KEY);
  } else {
    throw new Error('❌ Nenhuma API key configurada (INFURA_API_KEY ou ALCHEMY_API_KEY)');
  }

  try {
    console.log('[*] Conectando ao Ethereum...');
    const block = await provider.getBlockNumber();
    console.log(`[✓] Conexão OK (bloco: ${block})`);

    const wallet = new ethers.Wallet(PRIV_KEY, provider);
    console.log(`[✓] Wallet: ${wallet.address}`);

    const contract = new ethers.Contract(TOKEN_ADDR, ABI, wallet);

    console.log('\n[*] Consultando código do contrato...');
    const code = await provider.getCode(TOKEN_ADDR);
    if (!code || code === '0x') {
      console.log(`[!] Aviso: Nenhum contrato em ${TOKEN_ADDR}`);
    } else {
      console.log(`[✓] Contrato encontrado (bytecode: ${code.length} bytes)`);
    }

    console.log('\n[✓] SUCESSO - API key está funcionando!\n');
    process.exit(0);
  } catch (err) {
    console.error(`\n[✗] ERRO: ${err.message}`);
    console.error(`   Dica: Verifique se sua API key é válida\n`);
    process.exit(1);
  }
}

run();
