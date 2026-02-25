#!/usr/bin/env node

const hre = require("hardhat");
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const INITIAL_SUPPLY = '1000000000000'; // 1 trillion USDT with 6 decimals
const TOKEN_NAME = 'USD';
const TOKEN_SYMBOL = 'USDT';
const DECIMALS = 6;

async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 DEPLOYMENT INICIADO - ETHEREUM MAINNET');
  console.log('='.repeat(80) + '\n');

  // Verificar network
  const network = hre.hardhat.config.defaultNetwork;
  const provider = hre.ethers.provider;
  const chainId = (await provider.getNetwork()).chainId;
  
  if (chainId !== 1) {
    throw new Error(`❌ Conectado à rede ${chainId}, mas MAINNET é 1. Verifique hardhat.config.js`);
  }
  
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = deployer.address;
  
  console.log('📋 INFORMAÇÕES DE DEPLOYMENT:');
  console.log(`  ├─ Network: Ethereum Mainnet (ChainID: ${chainId})`);
  console.log(`  ├─ Deployer Address: ${deployerAddress}`);
  console.log(`  ├─ Name: ${TOKEN_NAME}`);
  console.log(`  ├─ Symbol: ${TOKEN_SYMBOL}`);
  console.log(`  ├─ Decimals: ${DECIMALS}`);
  console.log(`  └─ Initial Supply: ${INITIAL_SUPPLY}`);
  
  // Verificar balance de ETH
  const balance = await provider.getBalance(deployerAddress);
  const balanceEth = hre.ethers.utils.formatEther(balance);
  console.log(`\n💰 ETH Balance: ${balanceEth} ETH`);
  
  if (parseFloat(balanceEth) < 0.1) {
    throw new Error(`❌ Saldo insuficiente: ${balanceEth} ETH (mínimo 0.1 ETH para gas)`);
  }
  
  // Compilar contrato
  console.log('\n📦 Compilando TetherToken.sol...');
  try {
    await hre.run('compile');
    console.log('✅ Compilação bem-sucedida');
  } catch (err) {
    console.error('❌ Erro na compilação:', err.message);
    process.exit(1);
  }
  
  // Deploy
  console.log('\n🔧 Deployando contrato...');
  try {
    const TetherToken = await hre.ethers.getContractFactory('TetherToken');
    const contract = await TetherToken.deploy(INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS);
    
    console.log(`⏳ Transação enviada: ${contract.deployTransaction.hash}`);
    console.log('⏳ Aguardando confirmação (pode levar alguns minutos)...\n');
    
    const receipt = await contract.deployed();
    
    console.log('✅ CONTRATO DEPLOYADO COM SUCESSO!');
    console.log(`\n📍 Endereço do Contrato: ${receipt.address}`);
    console.log(`📍 Hash de Transação: ${contract.deployTransaction.hash}`);
    console.log(`📍 Gas Utilizada: ${contract.deployTransaction.gasLimit.toString()}`);
    
    // Verificar valores após deploy
    const totalSupply = await receipt.totalSupply();
    const ownerBalance = await receipt.balanceOf(deployerAddress);
    const name = await receipt.name();
    const symbol = await receipt.symbol();
    const decimals = await receipt.decimals();
    
    console.log('\n✅ VALIDAÇÃO PÓS-DEPLOY:');
    console.log(`  ├─ Nome: ${name}`);
    console.log(`  ├─ Symbol: ${symbol}`);
    console.log(`  ├─ Decimals: ${decimals}`);
    console.log(`  ├─ Total Supply: ${totalSupply.toString()}`);
    console.log(`  └─ Owner Balance: ${ownerBalance.toString()}`);
    
    // Salvar resultado
    const result = {
      timestamp: new Date().toISOString(),
      network: 'mainnet',
      chainId: chainId,
      contractAddress: receipt.address,
      transactionHash: contract.deployTransaction.hash,
      deployer: deployerAddress,
      tokenName: name,
      tokenSymbol: symbol,
      decimals: decimals,
      totalSupply: totalSupply.toString(),
      initialSupply: INITIAL_SUPPLY,
      ownerBalance: ownerBalance.toString(),
      status: 'SUCCESS'
    };
    
    const resultPath = path.join(__dirname, '../DEPLOYMENT_MAINNET_RESULT.json');
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
    console.log(`\n📄 Resultado salvo em: ${resultPath}`);
    
    // Instruções para Etherscan
    console.log('\n' + '='.repeat(80));
    console.log('🔍 PRÓXIMAS ETAPAS - ETHERSCAN VERIFICATION:');
    console.log('='.repeat(80));
    console.log(`\n1. Acesse: https://etherscan.io/address/${receipt.address}`);
    console.log('2. Clique em "Verify and Publish"');
    console.log('3. Selecione:');
    console.log('   ├─ Compiler Version: v0.4.18+commit.9cf6e910');
    console.log('   ├─ Optimization: Yes, 200 runs');
    console.log('   ├─ License: MIT');
    console.log('   └─ Code: Copie conteúdo de TetherToken_Flattened.sol');
    console.log('\n4. Constructor Arguments (em hexadecimal):');
    
    // Converter argumentos para hex
    const abiCoder = hre.ethers.utils.defaultAbiCoder;
    const encoded = abiCoder.encode(
      ['uint256', 'string', 'string', 'uint8'],
      [INITIAL_SUPPLY, TOKEN_NAME, TOKEN_SYMBOL, DECIMALS]
    );
    // Remove '0x' do início
    const constructorArgs = encoded.slice(2);
    console.log(`   ${constructorArgs}`);
    
    console.log('\n✅ DEPLOYMENT COMPLETO! Contrato pronto para uso.');
    console.log(`📍 Endereço: ${receipt.address}`);
    
  } catch (err) {
    console.error('❌ Erro no deployment:', err.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
