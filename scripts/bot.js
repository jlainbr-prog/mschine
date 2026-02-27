// scripts/bot.js
// Simple loop that calls one or more FlashArb contracts to perform arbitrage periodically
// Accepts either ARB_ADDRESS (single) or ARB_ADDRESSES (comma-separated list)
const { ethers } = require("hardhat");

async function main() {
  const single = process.env.ARB_ADDRESS;
  const list = process.env.ARB_ADDRESSES;
  let addrs;
  if (list) {
    addrs = list.split(",").map(s => s.trim()).filter(Boolean);
  } else if (single) {
    addrs = [single.trim()];
  }

  if (!addrs || addrs.length === 0) {
    console.error("ARB_ADDRESS or ARB_ADDRESSES not set in .env");
    process.exit(1);
  }

  const FlashArb = await ethers.getContractFactory("FlashArb");
  const tokenAddr = process.env.TOKEN_A || "0x419ecA43dB68E868E68d1aB460c8AC32523c7540";
  const amount = ethers.utils.parseUnits(process.env.FLASH_AMOUNT || "10000", 18);
  const delay = parseInt(process.env.LOOP_DELAY || "600000", 10); // default 10 minutes

  console.log("Starting bot with contracts", addrs);

  while (true) {
    for (const arbAddress of addrs) {
      const flash = FlashArb.attach(arbAddress);
      try {
        console.log(`Launching arbitrage on ${arbAddress}...`);
        const tx = await flash.startArbitrage(tokenAddr, amount);
        console.log("tx sent", tx.hash);
        await tx.wait();
        console.log("tx confirmed");
      } catch (err) {
        console.error(`arb error on ${arbAddress}`, err.message || err);
      }
    }
    console.log(`waiting ${delay/1000}s`);
    await new Promise(r => setTimeout(r, delay));
  }
}

main().catch(err => { console.error(err); process.exit(1); });