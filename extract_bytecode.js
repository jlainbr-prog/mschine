const { providers } = require('ethers');

const main = async () => {
  const address = '0x419ecA43dB68E868E68d1aB460c8AC32523c7540';
  const provider = providers.getDefaultProvider('homestead'); // Usa Etherscan + Alchemy + Infura
  
  try {
    const bytecode = await provider.getCode(address);
    console.log('✓ Bytecode extraído com sucesso!');
    console.log('Tamanho:', bytecode.length, 'caracteres');
    console.log('Primeiros 200 chars:', bytecode.substring(0, 200));
    console.log('\nSalvando em arquivo...');
    
    const fs = require('fs');
    fs.writeFileSync('bytecode_onchain.hex', bytecode);
    console.log('✓ Bytecode salvo em: bytecode_onchain.hex');
  } catch (error) {
    console.error('✗ Erro:', error.message);
  }
};

main();
