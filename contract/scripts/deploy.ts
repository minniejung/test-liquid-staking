import { ethers } from "hardhat";
import { makeAbi } from "./abiGenerator";

async function main() {
  const tokenName = "ScobyToken";
  const stakingName = "LiquidStaking";

  // ScobyToken
  console.log("Deploying ScobyToken...");
  const TokenFactory = await ethers.getContractFactory(tokenName);
  const token = await TokenFactory.deploy();
  await token.waitForDeployment();
  console.log(`✅ ${tokenName} deployed at: ${token.target}`);
  await makeAbi(tokenName, token.target);

  // LiquidStaking
  console.log("Deploying LiquidStaking...");
  const StakingFactory = await ethers.getContractFactory(stakingName);
  const staking = await StakingFactory.deploy(token.target);
  await staking.waitForDeployment();
  console.log(`✅ ${stakingName} deployed at: ${staking.target}`);
  await makeAbi(stakingName, staking.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
