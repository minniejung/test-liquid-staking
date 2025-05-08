import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { abi as stakingAbi } from "../abis/LiquidStaking.json";
import { abi as tokenAbi } from "../abis/ScobyToken.json";
import stakingInfo from "../abis/LiquidStaking.json";
import tokenInfo from "../abis/ScobyToken.json";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY_GANACHE!, provider);

  const staking = new ethers.Contract(stakingInfo.address, stakingAbi, signer);
  const rewardToken = new ethers.Contract(tokenInfo.address, tokenAbi, signer);

  const user = signer.address;
  console.log("🔗 Connected as:", user);

  const initialETH = await provider.getBalance(user);
  console.log(`Initial ETH balance: ${ethers.formatEther(initialETH)} ETH`);
  console.log("-----------------------------------------------");

  const stakeAmount = ethers.parseEther("10");
  console.log("⛏️  Staking 10 ETH...");
  const tx1 = await staking.stake({ value: stakeAmount });
  await tx1.wait();

  const stakedAmount = await staking.getStakedAmount(user);
  const unlockTime = await staking.getUnlockTime(user);
  const isUnlocked = await staking.isUnlocked(user);
  const pending = await staking.getPendingRewards(user);
  const contractBal = await staking.contractBalance();
  const tvl = await staking.getTVL();

  console.log("-----------------------------------------------");
  console.log(`📊 getStakedAmount(): ${ethers.formatEther(stakedAmount)} ETH`);
  console.log(`⏰ getUnlockTime(): ${unlockTime} (Unix)`);
  console.log(`🔓 isUnlocked(): ${isUnlocked}`);
  console.log(`💸 getPendingRewards(): ${ethers.formatEther(pending)} SCOB`);
  console.log(`🏦 contractBalance(): ${ethers.formatEther(contractBal)} ETH`);
  console.log(`📈 getTVL(): ${ethers.formatEther(tvl)} ETH`);

  console.log("-----------------------------------------------");
  console.log("🕒 Waiting 5 seconds...");
  await new Promise((r) => setTimeout(r, 5000));
  console.log("-----------------------------------------------");

  const estimatedGas = await staking.claimRewards.estimateGas();
  const tx2 = await staking.claimRewards({ gasLimit: estimatedGas + 100_000n });
  await tx2.wait();

  const scoBalance = await rewardToken.balanceOf(user);
  console.log(
    `✅ Claimed. Your SCOB balance: ${ethers.formatEther(scoBalance)} SCOB`
  );

  console.log("-----------------------------------------------");
  console.log("📤 Unstaking 1 ETH...");
  const estimatedUnstakeGas = await staking.unstake.estimateGas(stakeAmount);
  const tx3 = await staking.unstake(stakeAmount, {
    gasLimit: estimatedUnstakeGas + 100_000n,
  });
  await tx3.wait();

  const finalETH = await provider.getBalance(user);

  console.log(`💼 Final ETH balance: ${ethers.formatEther(finalETH)} ETH`);
  console.log(`📊 getStakedAmount(): ${ethers.formatEther(stakedAmount)} ETH`);
}

main().catch(console.error);
