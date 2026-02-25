const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

require('dotenv').config();

const API_KEY = process.env.ETHERSCAN_API_KEY;
if (!API_KEY) { console.error('ETHERSCAN_API_KEY not found'); process.exit(1); }

const address = process.argv[2];
if (!address) { console.error('Usage: node verify_v2.cjs <address>'); process.exit(1); }

const flattenedPath = 'TetherToken_Flattened.sol';
if (!fs.existsSync(flattenedPath)) { console.error('File not found'); process.exit(1); }

const sourceCode = fs.readFileSync(flattenedPath, 'utf8');

console.log('Using Etherscan API V2');
console.log('Address:', address);
console.log('Compiler: v0.4.18\n');

// Try using curl alternatively - more reliable for Etherscan
const formData = new URLSearchParams();
formData.append('apikey', API_KEY);
formData.append('action', 'verifysourcecode');
formData.append('codeformat', 'solidity-single-file');
formData.append('contractaddress', address);
formData.append('contractname', 'TetherToken');
formData.append('compilerversion', 'v0.4.18');
formData.append('optimizationUsed', '1');
formData.append('runs', '200');
formData.append('sourceCode', sourceCode);
formData.append('constructorArguements', '');

const postData = formData.toString();

const options = {
  hostname: 'api.etherscan.io',
  path: '/v2/contract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 30000
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('Response:', JSON.stringify(j, null, 2));
      
      if (j.status === '1') {
        console.log('\n✅ Submitted! GUID:', j.result);
        fs.writeFileSync(`verify_guid_${address}.txt`, j.result);
      } else {
        console.log('\n❌ Error:', j.message);
      }
    } catch (e) {
      console.log('Response (raw):', data);
      console.error('Parse error:', e.message);
    }
  });
});

req.on('error', e => console.error('Error:', e.message));
req.on('timeout', () => { req.destroy(); console.error('Timeout'); });

req.write(postData);
req.end();
