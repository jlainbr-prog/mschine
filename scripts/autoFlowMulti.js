// scripts/autoFlowMulti.js
const { addLiquidity } = require("./addLiquidity");
const { deployAndRunArb } = require("./flashArb");

/**
 * autoFlowMulti
 * Reads process.env.CONTRACTS as comma-separated token addresses.
 * For each token: adds liquidity (pair with TOKEN_B) and deploys+runs arbitrage.
 * Designed to be run with: npx hardhat run scripts/autoFlowMulti.js --network bsc
 */
async function main() {
  const raw = process.env.CONTRACTS || process.env.TARGET_CONTRACTS || "";
  if (!raw) {
    console.error("Nenhum contrato informado. Defina CONTRACTS no .env (comma-separated)");
    process.exit(1);
  }

  const list = raw.split(",").map(s => s.trim()).filter(Boolean);
  console.log(`Encontrados ${list.length} contrato(s)`);

  for (const tokenAddr of list) {
    try {
      console.log("\n=== Processando:", tokenAddr);
      // Amounts podem ser controlados por vars específicas por contrato, mas por simplicidade usamos AMOUNT_A/B
      const pair = await addLiquidity(tokenAddr);
      console.log("Pair result:", pair);
      const flashAddr = await deployAndRunArb(tokenAddr);
      console.log("FlashArb deployado em:", flashAddr);
    } catch (err) {
      console.error("Erro processing ", tokenAddr, err && err.message ? err.message : err);
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
