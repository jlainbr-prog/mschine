const https = require('https');
const fs = require('fs');

const API_KEY = process.env.ETHERSCAN_API_KEY;
if (!API_KEY) { console.error('ETHERSCAN_API_KEY not set in env'); process.exit(1); }

const address = process.argv[2];
if (!address) { console.error('Usage: node submit_verify_etherscan.cjs <address>'); process.exit(1); }

const flattenedPath = 'TetherToken_Flattened.sol';
if (!fs.existsSync(flattenedPath)) { console.error('Flattened file not found:', flattenedPath); process.exit(1); }
const sourceCode = fs.readFileSync(flattenedPath, 'utf8');

const postData = new URLSearchParams({
  apikey: API_KEY,
  module: 'contract',
  action: 'verifysourcecode',
  contractaddress: address,
  sourceCode: sourceCode,
  codeformat: 'solidity-single-file',
  contractname: 'TetherToken',
  compilerversion: 'v0.4.18',
  optimizationUsed: '1',
  runs: '200',
  constructorArguements: ''
}).toString();

const options = {
  hostname: 'api.etherscan.io',
  path: '/api',
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('Response:', j);
      if (j.status == '1') {
        console.log('Verification submitted, GUID:', j.result);
        // poll status
        checkStatus(j.result);
      } else {
        console.error('Verification submission failed:', j.message, j.result);
      }
    } catch (e) { console.error('Parse error:', e.message); }
  });
});

req.on('error', (e) => { console.error('Request error:', e.message); });
req.write(postData);
req.end();

function checkStatus(guid) {
  const qs = new URLSearchParams({ apikey: API_KEY, module: 'contract', action: 'checkverifystatus', guid }).toString();
  const url = `https://api.etherscan.io/api?${qs}`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(data);
        console.log('Status response:', j);
      } catch (e) { console.error('Status parse error:', e.message); }
    });
  }).on('error', e => console.error('Status request error:', e.message));
}
