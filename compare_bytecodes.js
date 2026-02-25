import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactPath = path.join(__dirname, 'artifacts/contracts/TetherToken.sol/TetherToken.json');

try {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const bytecode = artifact.bytecode;
  
  console.log('\n✓ Bytecode compilado extraído com sucesso!');
  console.log('Tamanho:', bytecode.length, 'caracteres');
  console.log('Primeiros 100 chars:', bytecode.substring(0, 100));
  
  // Salva em arquivo
  fs.writeFileSync('bytecode_compiled.hex', bytecode);
  console.log('✓ Salvo em: bytecode_compiled.hex\n');
  
  // Compara com on-chain
  if (fs.existsSync('bytecode_onchain.hex')) {
    const onchainBytecode = fs.readFileSync('bytecode_onchain.hex', 'utf8').trim();
    
    console.log('\n📊 COMPARAÇÃO DE BYTECODES:');
    console.log('On-chain size:', onchainBytecode.length, 'caracteres');
    console.log('Compiled size:', bytecode.length, 'caracteres');
    
    if (bytecode === onchainBytecode) {
      console.log('\n✅ MATCH PERFEITO! Bytecodes são idênticos!');
      console.log('O contrato é verificável no Etherscan.');
    } else {
      console.log('\n⚠️  MISMATCH! Bytecodes são diferentes.');
      console.log('Isso pode ser causado por:');
      console.log('  - Otimizador desabilitado vs habilitado');
      console.log('  - Versão diferente do compilador');
      console.log('  - Argumentos do construtor inclusos/exclusos');
      
      // Tenta comparar sem os primeiros 200 chars (construtor)
      const compiledRuntime = bytecode.substring(200);
      const onchainRuntime = onchainBytecode.substring(200);
      if (compiledRuntime === onchainRuntime) {
        console.log('\n✓ Runtime bytecode matches! Diferença apenas no construtor.');
      }
    }
  } else {
    console.log('⚠️  bytecode_onchain.hex não encontrado para comparação');
  }
} catch (error) {
  console.error('✗ Erro:', error.message);
  process.exit(1);
}
