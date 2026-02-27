const https = require('https');
const fs = require('fs');

const address = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';

// Tenta vários RPC endpoints
const endpoints = [
  'https://eth.public.alchemy.com/v1', 
  'https://1rpc.io/eth',
  'https://cloudflare-eth.com'
];

const callRpc = (endpoint) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getCode',
      params: [address, 'latest']
    });

    const options = {
      hostname: new URL(endpoint).hostname,
      path: new URL(endpoint).pathname + new URL(endpoint).search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.result) {
            resolve(result.result);
          } else {
            reject(new Error(result.error?.message || 'Erro RPC'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
};

const main = async () => {
  for (const endpoint of endpoints) {
    try {
      console.log(`Tentando: ${endpoint}...`);
      const bytecode = await callRpc(endpoint);
      
      if (bytecode && bytecode !== '0x') {
        console.log('✓ Bytecode extraído com sucesso!');
        console.log('Tamanho:', bytecode.length, 'caracteres');
        console.log('Primeiros 100 chars:', bytecode.substring(0, 100));
        
        fs.writeFileSync('bytecode_onchain.hex', bytecode);
        console.log('✓ Salvo em: bytecode_onchain.hex');
        return;
      }
    } catch (err) {
      console.log(`  ✗ Falhou: ${err.message}`);
    }
  }
  
  console.error('✗ Não foi possível extrair bytecode de nenhum endpoint.');
};

main().catch(console.error);
