
require('dotenv').config();
const ethers = require('ethers');

const RPC        = process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo';
const PRIV_KEY   = process.env.PRIVATE_KEY;
const TOKEN_ADDR = process.env.TOKEN_ADDR || '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';
// valor desejado em unidades base (6 decimais) como string para BigNumber; pode ser sobrescrito por env TARGET
const TARGET_STR = process.env.TARGET || '374625537617239860000000000000';

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
  const TARGET = ethers.BigNumber.from(TARGET_STR);

  // verifica se contrato expõe as funções mint/burn
  let hasMint = true;
  let hasBurn = true;
  try {
    contract.interface.getFunction('mint(address,uint256)');
  } catch (e) {
    hasMint = false;
  }
  try {
    contract.interface.getFunction('burn(uint256)');
  } catch (e) {
    hasBurn = false;
  }

  console.log('Funções disponíveis -> mint:', hasMint, ' burn:', hasBurn);

  if (current.eq(TARGET)) {
    console.log('Já está exato. Nada a fazer.');
    return;
  }

  if (current.gt(TARGET)) {
    if (!hasBurn) {
      console.error('Saldo maior que TARGET, mas contrato não tem `burn`. Abortando.');
      process.exit(1);
    }
    const diff = current.sub(TARGET);
    console.log('Queimando  :', diff.toString());
    const tx = await contract.burn(diff);
    console.log('Tx burn    :', tx.hash);
    await tx.wait();
  } else {
    if (!hasMint) {
      console.error('Saldo menor que TARGET, mas contrato não tem `mint`. Abortando.');
      process.exit(1);
    }
    const diff = TARGET.sub(current);
    console.log('Mintando   :', diff.toString());
    const tx = await contract.mint(me, diff);
    console.log('Tx mint    :', tx.hash);
    await tx.wait();
  }

  const final = await contract.balanceOf(me);
  console.log('Saldo final:', final.toString());
}

run().catch(console.error);
