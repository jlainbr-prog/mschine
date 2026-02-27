require('dotenv').config();
const { ethers } = require('ethers');

const PRIV_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDR = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';

const ABI = [
  'function mint(address to, uint amount) external',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint)'
];

async function run() {
  if (!PRIV_KEY) {
    throw new Error('PRIVATE_KEY não configurada no .env');
  }

  console.log('\n=== TESTE DE MINT ===\n');
  console.log('Contrato:', TOKEN_ADDR);
  console.log('Chave privada: carregada\n');

  console.log('[*] Conectando ao Ethereum (usando provider padrão)...');
  // ethers.getDefaultProvider() usa múltiplos backends (Infura, Alchemy, etc)
  const provider = ethers.getDefaultProvider('mainnet');

  try {
    const block = await provider.getBlockNumber();
    console.log(`[✓] Provider OK (bloco atual: ${block})`);
  } catch (err) {
    console.error(`[✗] Falha ao conectar: ${err.message}`);
    console.log('\n📝 Ajuste: Configure INFURA_API_KEY ou tente com seu próprio RPC');
    process.exit(1);
  }

  console.log('\n[*] Criando wallet...');
  const wallet = new ethers.Wallet(PRIV_KEY, provider);
  console.log('[✓] Wallet:', wallet.address);

  const contract = new ethers.Contract(TOKEN_ADDR, ABI, wallet);

  console.log('\n[*] Consultando estado anterior...');
  try {
    const decimals = await contract.decimals();
    const balBefore = await contract.balanceOf(wallet.address);
    console.log(`[✓] Decimals: ${decimals}`);
    console.log(`[✓] Saldo antes: ${balBefore.toString()}`);
  } catch (err) {
    console.log(`[!] Aviso ao ler estado: ${err.message}`);
  }

  const dest = wallet.address;
  const amount = ethers.parseUnits('1000000', 6); // 1M com 6 decimais

  console.log('\n[*] Enviando mint transaction...');
  console.log(`   To: ${dest}`);
  console.log(`   Amount: ${ethers.formatUnits(amount, 6)} USDT`);

  try {
    const tx = await contract.mint(dest, amount);
    console.log(`[✓] TX enviada: ${tx.hash}`);
    console.log(`[*] Aguardando confirmação (máx 30 blocos)...`);
    const receipt = await tx.wait(1);
    if (receipt) {
      console.log(`[✓] TX confirmada no bloco ${receipt.blockNumber}`);
    } else {
      console.log(`[!] Timeout esperando confirmação (TX pode estar pendente)`);
    }

    console.log('\n[*] Consultando saldo final...');
    const balAfter = await contract.balanceOf(dest);
    console.log(`[✓] Saldo depois: ${balAfter.toString()}`);
    console.log('\n=== SUCESSO ===\n');
  } catch (err) {
    console.error(`\n[✗] ERRO ao executar mint:\n${err.toString()}\n`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error(`\n[FATAL] ${err.message}\n`);
  process.exit(1);
});
