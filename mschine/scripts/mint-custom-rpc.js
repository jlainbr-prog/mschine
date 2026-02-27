require('dotenv').config();
const { ethers } = require('ethers');

const PRIV_KEY = process.env.PRIVATE_KEY;
const CUSTOM_RPC = process.env.CUSTOM_RPC_ENDPOINT;
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
  if (!CUSTOM_RPC) {
    throw new Error('❌ CUSTOM_RPC_ENDPOINT não configurada em .env');
  }

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   TESTE: RPC CUSTOMIZADO (Ethereum)   ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`RPC: ${CUSTOM_RPC}`);
  console.log(`Contrato: ${TOKEN_ADDR}`);
  console.log(`Chave: carregada\n`);

  try {
    console.log('[*] Conectando ao RPC customizado...');
    const provider = new ethers.JsonRpcProvider(CUSTOM_RPC);
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

    console.log('\n[✓] SUCESSO - RPC customizado está funcionando!\n');
    process.exit(0);
  } catch (err) {
    console.error(`\n[✗] ERRO: ${err.message}`);
    console.error(`   Dica: Verifique se CUSTOM_RPC_ENDPOINT está correto\n`);
    process.exit(1);
  }
}

run();
