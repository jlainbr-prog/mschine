const hre = require("hardhat");

async function main() {
  console.log("========================================");
  console.log("   Deploying Tether (USDT) Token");
  console.log("========================================\n");

  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from account: ${deployer.address}`);

  // Get account balance
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH\n`);

  // Deployment parameters
  const initialSupply = ethers.utils.parseUnits("2600000000", 6); // 2.6 billion USDT with 6 decimals
  const tokenName = "Tether USD";
  const tokenSymbol = "USDT";
  const decimals = 6;

  console.log("Deployment parameters:");
  console.log(`  Initial Supply: ${ethers.utils.formatUnits(initialSupply, decimals)} ${tokenSymbol}`);
  console.log(`  Token Name: ${tokenName}`);
  console.log(`  Token Symbol: ${tokenSymbol}`);
  console.log(`  Decimals: ${decimals}\n`);

  // Get contract factory
  const TetherToken = await hre.ethers.getContractFactory("TetherToken");
  console.log("Deploying contract...");

  // Deploy contract
  const tetherToken = await TetherToken.deploy(
    initialSupply,
    tokenName,
    tokenSymbol,
    decimals
  );

  await tetherToken.deployed();

  console.log("\n✓ TetherToken deployed successfully!");
  console.log(`✓ Contract address: ${tetherToken.address}\n`);

  // Log contract details
  const owner = await tetherToken.owner();
  const totalSupply = await tetherToken.totalSupply();
  const balance_ = await tetherToken.balanceOf(deployer.address);

  console.log("Contract details:");
  console.log(`  Owner: ${owner}`);
  console.log(`  Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} ${tokenSymbol}`);
  console.log(`  Owner Balance: ${ethers.utils.formatUnits(balance_, decimals)} ${tokenSymbol}\n`);

  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await tetherToken.deployTransaction.wait(5);

  console.log("\n========================================");
  console.log("   Deployment Summary");
  console.log("========================================");
  console.log(`Network: ${hre.network.name}`);
  console.log(`Contract Address: ${tetherToken.address}`);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Transaction Hash: ${tetherToken.deployTransaction.hash}`);
  console.log(`Block Number: ${tetherToken.deployTransaction.blockNumber}`);
  console.log("\nNext steps:");
  console.log("1. Save the contract address");
  console.log("2. Verify on block explorer (optional)");
  console.log("3. Add to token lists and exchanges");
  console.log("4. Update documentation with address");
  console.log("========================================\n");

  // Optionally verify contract on Etherscan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Run the following command to verify on Etherscan:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${tetherToken.address} "${initialSupply}" "${tokenName}" "${tokenSymbol}" ${decimals}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
