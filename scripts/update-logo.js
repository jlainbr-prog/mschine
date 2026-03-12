const hre = require("hardhat");

async function main() {
  // espera que as variáveis CONTRACT e LOGO_CID estejam definidas em .env
  if (!process.env.CONTRACT) {
    throw new Error("CONTRACT environment variable is not set");
  }
  if (!process.env.LOGO_CID) {
    throw new Error("LOGO_CID environment variable is not set");
  }

  const tokenName = "TokenUSDT"; // atualize se for outro
  const Token = await hre.ethers.getContractAt(tokenName, process.env.CONTRACT);

  console.log(`Chamando setLogoURI com ipfs://${process.env.LOGO_CID}`);
  const tx = await Token.setLogoURI(`ipfs://${process.env.LOGO_CID}`);
  await tx.wait();
  console.log("Logo atualizado → ipfs://" + process.env.LOGO_CID);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
