import { ethers } from "hardhat";
import { expect } from "chai";
import { ScobyToken, LiquidStaking } from "../typechain-types";

describe("LiquidStaking", () => {
  let token: ScobyToken;
  let staking: LiquidStaking;
  let owner: any;
  let user1: any;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ScobyToken");
    token = await TokenFactory.deploy();
    await token.waitForDeployment();

    const StakingFactory = await ethers.getContractFactory("LiquidStaking");
    staking = await StakingFactory.deploy(await token.getAddress());
    await staking.waitForDeployment();

    // Transfer ownership to staking contract so it can mint
    await token.transferOwnership(await staking.getAddress());
  });

  it("should stake and update balances correctly", async () => {
    const amount = ethers.parseEther("1");

    await staking.connect(user1).stake({ value: amount });

    const staked = await staking.getStakedAmount(user1.address);
    expect(staked).to.equal(amount);

    const tvl = await staking.getTVL();
    expect(tvl).to.equal(amount);
  });

  it("should accrue and claim rewards correctly", async () => {
    const amount = ethers.parseEther("2");
    await staking.connect(user1).stake({ value: amount });

    // Simulate time passage: increase time by 365 days (full APR)
    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    const pending = await staking.getPendingRewards(user1.address);
    expect(pending).to.be.closeTo(
      ethers.parseEther("0.2"),
      ethers.parseEther("0.001")
    );

    await staking.connect(user1).claimRewards();

    const scob = await token.balanceOf(user1.address);
    expect(scob).to.be.closeTo(
      ethers.parseEther("0.2"),
      ethers.parseEther("0.001")
    );
  });

  it('should unstake correctly and update state', async () => {
    const stakeAmount = ethers.parseEther('1');
  
    // 1. Stake
    await staking.connect(user1).stake({ value: stakeAmount });
  
    // 2. Unstake
    const tx = await staking.connect(user1).unstake(stakeAmount);
    const receipt = await tx.wait();
    if (!receipt) throw new Error('No receipt for unstake tx');
  
    // 3. Assertions
    const stakedAfter = await staking.getStakedAmount(user1.address);
    expect(stakedAfter).to.equal(0);
  
    const tvl = await staking.getTVL();
    expect(tvl).to.equal(0);
  
    const contractETH = await ethers.provider.getBalance(await staking.getAddress());
    expect(contractETH).to.equal(0);
  });
});
