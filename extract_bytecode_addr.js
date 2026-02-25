const https = require('https');
const fs = require('fs');

const address = process.argv[2];
if (!address) {
  console.error('Usage: node extract_bytecode_addr.js <address>');
  process.exit(1);
}

const endpoints = [
  'https://1rpc.io/eth',
  'https://cloudflare-eth.com',
  'https://eth.public.alchemy.com/v1'
];

const callRpc = (endpoint) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getCode', params: [address, 'latest'] });
    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.result) resolve(result.result);
          else reject(new Error(result.error?.message || 'RPC error'));
        } catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(postData);
    req.end();
  });
};

(async () => {
  for (const ep of endpoints) {
    try {
      console.log('Trying', ep);
      const code = await callRpc(ep);
      if (code && code !== '0x') {
        const fname = `bytecode_onchain_${address}.hex`;
        fs.writeFileSync(fname, code);
        console.log('Saved to', fname);
        process.exit(0);
      } else {
        console.log('Empty bytecode from', ep);
      }
    } catch (e) {
      console.log('Failed', ep, e.message);
    }
  }
  console.error('Could not retrieve bytecode from endpoints');
  process.exit(2);
})();
