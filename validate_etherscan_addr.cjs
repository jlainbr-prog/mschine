const https = require('https');
const fs = require('fs');

const address = process.argv[2];
if (!address) { console.error('Usage: node validate_etherscan_addr.cjs <address>'); process.exit(1); }
const API_KEY = process.env.ETHERSCAN_API_KEY || '';
const api = (params) => new Promise((res, rej) => {
  const qs = new URLSearchParams(params).toString();
  const url = `https://api.etherscan.io/api?${qs}`;
  https.get(url, (r) => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>{ try{ res(JSON.parse(d)); }catch(e){ rej(e); } }); }).on('error', rej);
});

(async()=>{
  console.log('Checking Etherscan for', address);
  try{
    const abiResp = await api({ module:'contract', action:'getabi', address, apikey:API_KEY });
    if (abiResp && abiResp.status === '1') {
      console.log('✅ Contract verified on Etherscan (ABI available)');
      fs.writeFileSync(`etherscan_abi_${address}.json`, abiResp.result);
    } else {
      console.log('⚠️ Contract not verified (getabi response):', abiResp.message || abiResp.result);
    }

    const srcResp = await api({ module:'contract', action:'getsourcecode', address, apikey:API_KEY });
    if (srcResp && srcResp.status === '1' && srcResp.result && srcResp.result.length>0) {
      const info = srcResp.result[0];
      fs.writeFileSync(`etherscan_source_${address}.json`, JSON.stringify(info, null, 2));
      console.log('Source info saved: etherscan_source_' + address + '.json');
      console.log('- Compiler:', info.CompilerVersion);
      console.log('- OptimizationUsed:', info.OptimizationUsed);
    }
  } catch (e) {
    console.error('Error calling Etherscan API:', e.message);
    if (!API_KEY) console.log('Note: set ETHERSCAN_API_KEY env var for higher rate limits.');
  }
})();
