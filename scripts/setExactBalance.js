
require('dotenv').config();
const ethers = require('ethers');

const RPC        = 'https://eth-mainnet.g.alchemy.com/v2/demo';
const PRIV_KEY   = process.env.PRIVATE_KEY;
const TOKEN_ADDR = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';
const TARGET     = 374625537617239860000000000000n; // valor desejado em unidades base (6 decimais)

const ABI = [
  'function mint(address,uint256)',
  'function burn(uint256)',
  'function balanceOf(address) view returns (uint256)'
];

async function run() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  if (!PRIV_KEY) {
    console.error('PRIVATE_KEY não definida. Configure .env com PRIVATE_KEY=0x...');
    process.exit(1);
  }

  const wallet   = new ethers.Wallet(PRIV_KEY, provider);
  const contract = new ethers.Contract(TOKEN_ADDR, ABI, wallet);

  const me = wallet.address;
  const current = await contract.balanceOf(me);
  console.log('Saldo atual :', current.toString());

  if (current === TARGET) {
    console.log('Já está exato. Nada a fazer.');
    return;
  }

  if (current > TARGET) {
    const diff = current - TARGET;
    console.log('Queimando  :', diff.toString());
    const tx = await contract.burn(diff);
    console.log('Tx burn    :', tx.hash);
    await tx.wait();
  } else {
    const diff = TARGET - current;
    console.log('Mintando   :', diff.toString());
    const tx = await contract.mint(me, diff);
    console.log('Tx mint    :', tx.hash);
    await tx.wait();
  }

  const final = await contract.balanceOf(me);
  console.log('Saldo final:', final.toString());
}

run().catch(console.error);
