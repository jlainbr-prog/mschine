import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ADDRESS = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

// Function to call Etherscan API
const callEtherscanAPI = (params) => {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${ETHERSCAN_API_URL}?${queryString}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const main = async () => {
  console.log('\n🔍 VALIDAÇÃO NO ETHERSCAN');
  console.log('=' .repeat(60));
  console.log(`Endereço: ${ADDRESS}`);
  console.log(`Data: ${new Date().toISOString()}\n`);

  try {
    // Check if contract is verified
    console.log('📡 Consultando status de verificação...\n');
    
    const checkParams = {
      apikey: ETHERSCAN_API_KEY,
      module: 'contract',
      action: 'getabi',
      address: ADDRESS,
      format: 'json'
    };

    const response = await callEtherscanAPI(checkParams);

    if (response.status === '1') {
      console.log('✅ CONTRATO JÁ VERIFICADO NO ETHERSCAN!');
      console.log('\n📄 ABI encontrada:');
      const abi = JSON.parse(response.result);
      console.log(`- Número de funções: ${abi.filter(x => x.type === 'function').length}`);
      console.log(`- Número de eventos: ${abi.filter(x => x.type === 'event').length}`);
      
      // Save ABI
      fs.writeFileSync(
        path.join(__dirname, 'etherscan_abi.json'),
        JSON.stringify(abi, null, 2)
      );
      console.log('\n✓ ABI salvo em: etherscan_abi.json');

      // Check source code
      const sourceParams = {
        apikey: ETHERSCAN_API_KEY,
        module: 'contract',
        action: 'getsourcecode',
        address: ADDRESS,
        format: 'json'
      };

      const sourceResponse = await callEtherscanAPI(sourceParams);
      
      if (sourceResponse.status === '1' && sourceResponse.result.length > 0) {
        const contractInfo = sourceResponse.result[0];
        
        console.log('\n📋 INFORMAÇÕES DO CONTRATO:');
        console.log(`- Nome: ${contractInfo.ContractName}`);
        console.log(`- Compilador: ${contractInfo.CompilerVersion}`);
        console.log(`- Otimizador: ${contractInfo.OptimizationUsed === '1' ? 'Habilitado' : 'Desabilitado'}`);
        
        if (contractInfo.OptimizationUsed === '1') {
          console.log(`- Runs: ${contractInfo.Runs}`);
        }
        
        console.log(`- Biblioteca: ${contractInfo.Library || 'Nenhuma'}`);
        
        fs.writeFileSync(
          path.join(__dirname, 'etherscan_verification_status.json'),
          JSON.stringify(contractInfo, null, 2)
        );
        console.log('\n✓ Detalhes salvos em: etherscan_verification_status.json');
      }

      console.log('\n' + '='.repeat(60));
      console.log('🎉 Verificação bem-sucedida!');
      console.log('O contrato está verificado e público no Etherscan.');
      
    } else if (response.message === 'NOTOK') {
      console.log('⚠️  CONTRATO NÃO VERIFICADO');
      console.log('\nPróximos passos para verificar:');
      console.log('1. Acesse: https://etherscan.io/address/' + ADDRESS + '#code');
      console.log('2. Clique em "Verify and Publish"');
      console.log('3. Escolha "Solidity (Multi-file)" como tipo de compilação');
      console.log('4. Selecione compilador 0.4.18');
      console.log('5. Upload dos arquivos do contrato');
      console.log('6. Cole os argumentos do construtor se necessário');
      
    } else {
      console.log('ℹ️  Status desconhecido:', response.message);
    }

    // Get block info
    console.log('\n\n📊 INFORMAÇÕES ON-CHAIN:');
    const blockParams = {
      apikey: ETHERSCAN_API_KEY,
      module: 'account',
      action: 'balance',
      address: ADDRESS,
      tag: 'latest'
    };

    const blockResponse = await callEtherscanAPI(blockParams);
    if (blockResponse.status === '1') {
      console.log(`- Saldo: ${parseInt(blockResponse.result) / 1e18} ETH`);
    }

  } catch (error) {
    console.error('✗ Erro:', error.message);
    
    if (!ETHERSCAN_API_KEY) {
      console.log('\n⚠️  API Key do Etherscan não configurada!');
      console.log('Configure com: export ETHERSCAN_API_KEY=sua_chave_aqui');
      console.log('Obtém uma em: https://etherscan.io/apis');
    }
  }

  console.log('\n');
};

main();
