// scripts/addLiquidity.js
const { ethers } = require("hardhat");

/**
 * addLiquidity(tokenA, tokenB, amountA_str, amountB_str, router)
 * All params optional; falls back to env vars / defaults.
 */
async function addLiquidity(tokenA, tokenB, amountA_str, amountB_str, router) {
  const [deployer] = await ethers.getSigners();
  console.log("Usando conta:", deployer.address);

  const TOKEN_A = tokenA || process.env.TOKEN_A || "0x419ecA43dB68E868E68d1aB460c8AC32523c7540";
  const TOKEN_B = tokenB || process.env.TOKEN_B || "0x55d398326f99059fF775485246999027B3197955";
  const ROUTER = router || process.env.ROUTER || "0x10ED43C718714eb63d5aA57B78B54704E256024E";

  const routerABI = [
    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
  ];

  const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function transfer(address to, uint256 amount) external returns (bool)"
  ];

  const routerC = new ethers.Contract(ROUTER, routerABI, deployer);
  const tokenAContract = new ethers.Contract(TOKEN_A, erc20ABI, deployer);
  const tokenBContract = new ethers.Contract(TOKEN_B, erc20ABI, deployer);

  // read decimals to parse amounts correctly
  const decimalsA = Number(await tokenAContract.decimals().catch(() => 18));
  const decimalsB = Number(await tokenBContract.decimals().catch(() => 18));

  const amountAstr = amountA_str || process.env.AMOUNT_A || "1000";
  const amountBstr = amountB_str || process.env.AMOUNT_B || "1000";
  const amountA = ethers.utils.parseUnits(amountAstr, decimalsA);
  const amountB = ethers.utils.parseUnits(amountBstr, decimalsB);

  console.log("Saldos antes:");
  console.log("Token A:", ethers.utils.formatUnits(await tokenAContract.balanceOf(deployer.address), decimalsA));
  console.log("Token B:", ethers.utils.formatUnits(await tokenBContract.balanceOf(deployer.address), decimalsB));
  console.log("BNB:  ", ethers.utils.formatEther(await deployer.getBalance()));

  // approvals
  console.log("\nAprovando Token A...");
  let tx = await tokenAContract.approve(ROUTER, amountA);
  await tx.wait();
  console.log("Token A aprovado:", tx.hash);

  console.log("Aprovando Token B...");
  tx = await tokenBContract.approve(ROUTER, amountB);
  await tx.wait();
  console.log("Token B aprovado:", tx.hash);

  const deadline = Math.floor(Date.now() / 1000) + 20 * 60;

  console.log("\nAdicionando liquidez...");
  tx = await routerC.addLiquidity(
    TOKEN_A,
    TOKEN_B,
    amountA,
    amountB,
    0,
    0,
    deployer.address,
    deadline
  );

  const receipt = await tx.wait();
  console.log("Liquidez adicionada! TX:", tx.hash);
  console.log("Gas usado:", receipt.gasUsed.toString());

  const pairCreatedEvent = receipt.events?.find(e => e.event === "PairCreated");
  let pairAddress = null;
  if (pairCreatedEvent) {
    pairAddress = pairCreatedEvent.args.pair;
    console.log("Novo par LP criado em:", pairAddress);
  } else {
    console.log("Par já existia. Verifique em https://pancakeswap.info/pool");
  }
  return pairAddress;
}

module.exports = { addLiquidity };
