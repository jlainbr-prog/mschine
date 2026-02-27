const https = require('https');
const fs = require('fs');

// Load .env
require('dotenv').config();

const API_KEY = process.env.ETHERSCAN_API_KEY;
if (!API_KEY) { console.error('ETHERSCAN_API_KEY not found in .env'); process.exit(1); }

const address = process.argv[2];
if (!address) { console.error('Usage: node submit_verify.cjs <address>'); process.exit(1); }

const flattenedPath = 'TetherToken_Flattened.sol';
if (!fs.existsSync(flattenedPath)) { console.error('File not found:', flattenedPath); process.exit(1); }

const sourceCode = fs.readFileSync(flattenedPath, 'utf8');

console.log('Submitting verification for', address);
console.log('Using API key:', API_KEY.substring(0, 8) + '...');
console.log('Compiler: v0.4.18');
console.log('Optimizer: enabled (200 runs)\n');

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
  path: '/api/v2/contract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 30000
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('Etherscan Response:');
      console.log(JSON.stringify(j, null, 2));
      
      if (j.status === '1') {
        console.log('\n✅ Verification submitted successfully!');
        console.log('GUID:', j.result);
        console.log('\nCheck status at:');
        console.log('https://etherscan.io/address/' + address + '#code');
        
        // Save GUID
        fs.writeFileSync(`verification_guid_${address}.txt`, j.result);
        console.log('GUID saved to: verification_guid_' + address + '.txt');
        
        // Poll after 5 seconds
        setTimeout(() => checkStatus(j.result, address), 5000);
      } else {
        console.log('\n❌ Verification submission failed');
        console.log('Message:', j.message);
        console.log('Result:', j.result);
      }
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  console.error('Request timeout');
  process.exit(1);
});

req.write(postData);
req.end();

function checkStatus(guid, address) {
  const qs = new URLSearchParams({
    apikey: API_KEY,
    module: 'contract',
    action: 'checkverifystatus',
    guid: guid
  }).toString();

  const url = `https://api.etherscan.io/api?${qs}`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(data);
        console.log('\n--- Verification Status Check (5s) ---');
        console.log(JSON.stringify(j, null, 2));
        console.log('Note: Verification may take 1-2 minutes. Check back at:');
        console.log('https://etherscan.io/address/' + address + '#code');
      } catch (e) {
        console.error('Status parse error:', e.message);
      }
    });
  }).on('error', e => console.error('Status request error:', e.message));
}
