// scripts/flashArb.js
const { ethers } = require("hardhat");

/**
 * deployAndRunArb(tokenAddr, amountStr)
 * Deploys FlashArb and starts arbitrage for given token and amount (string).
 */
async function deployAndRunArb(tokenAddr, amountStr) {
  const [deployer] = await ethers.getSigners();

  const FlashArb = await ethers.getContractFactory("FlashArb");
  const flash = await FlashArb.deploy();
  await flash.deployed();
  console.log("Flash loan deployado em:", flash.address);

  const tokenAddress = tokenAddr || process.env.TOKEN_A || "0x419ecA43dB68E868E68d1aB460c8AC32523c7540";
  const tokenContract = await ethers.getContractAt("IERC20", tokenAddress).catch(async () => {
    // fallback minimal ABI
    const erc20 = ["function decimals() view returns (uint8)"];
    return new ethers.Contract(tokenAddress, erc20, deployer);
  });

  const decimals = Number(await tokenContract.decimals().catch(() => 18));
  const amtStr = amountStr || process.env.FLASH_AMOUNT || "10000";
  const amount = ethers.utils.parseUnits(amtStr, decimals);

  const tx = await flash.startArbitrage(
    tokenAddress,
    amount,
    { gasLimit: 500000 }
  );

  console.log("Arbitragem iniciada:", tx.hash);
  await tx.wait();
  console.log("Concluído! Verifique lucro no saldo do contrato");
  return flash.address;
}

module.exports = { deployAndRunArb };

