import { ethers } from "hardhat";
import { expect } from "chai";
import { ScobyToken } from "../typechain-types";

describe("ScobyToken", () => {
  let token: ScobyToken;
  let owner: any;
  let user1: any;

  const initialSupply = ethers.parseEther("1000000");
  const maxSupply = ethers.parseEther("2000000");

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ScobyToken");
    token = await TokenFactory.deploy();
    await token.waitForDeployment();
  });

  it("should deploy with 1M initial supply", async () => {
    const total = await token.totalSupply();
    expect(total).to.equal(initialSupply);

    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(initialSupply);
  });

  it("should allow owner to mint within max supply", async () => {
    const mintAmount = ethers.parseEther("1000000"); // remaining space to 2M
    await token.mint(user1.address, mintAmount);

    const total = await token.totalSupply();
    expect(total).to.equal(maxSupply);

    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(mintAmount);
  });

  it("should fail if mint exceeds max supply", async () => {
    const overAmount = ethers.parseEther("1000001");
    await expect(token.mint(user1.address, overAmount)).to.be.revertedWith(
      "Exceeds Max Supply"
    );
  });

  it("should allow transfers", async () => {
    const sendAmount = ethers.parseEther("10");
    await token.transfer(user1.address, sendAmount);
    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(sendAmount);
  });

  it("should allow burn", async () => {
    const burnAmount = ethers.parseEther("500");
    const prevTotal = await token.totalSupply();
    await token.burn(burnAmount);

    const total = await token.totalSupply();
    expect(total).to.equal(prevTotal - burnAmount);
  });
});
