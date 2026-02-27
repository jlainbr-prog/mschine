require('dotenv').config();
const { ethers } = require('ethers');

const TOKEN_ADDR = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';
const RPCs = [
  'https://eth-mainnet.g.alchemy.com/v2/demo',
  'https://cloudflare-eth.com',
  'https://rpc.ankr.com/eth'
];

async function testRpc(rpc) {
  console.log('\n--- Testing RPC:', rpc);
  try {
    const provider = new ethers.JsonRpcProvider(rpc);
    const block = await provider.getBlockNumber();
    console.log(' blockNumber:', block);
    const code = await provider.getCode(TOKEN_ADDR);
    console.log(' contract code length:', code && code.length ? code.length : 0);

    if (!code || code === '0x') {
      console.log(' -> No contract deployed at', TOKEN_ADDR);
      return;
    }

    const ABI = [
      'function decimals() view returns (uint8)',
      'function balanceOf(address) view returns (uint)'
    ];
    const contract = new ethers.Contract(TOKEN_ADDR, ABI, provider);
    try {
      const d = await contract.decimals();
      console.log(' decimals:', d.toString());
    } catch (e) {
      console.log(' decimals() read failed:', e.message);
    }

    const sample = '0x0000000000000000000000000000000000000000';
    try {
      const b = await contract.balanceOf(sample);
      console.log(' sample balanceOf(0x0):', b.toString());
    } catch (e) {
      console.log(' balanceOf() read failed:', e.message);
    }
  } catch (err) {
    console.log(' RPC error:', err.message);
  }
}

(async () => {
  for (const r of RPCs) await testRpc(r);
})();
