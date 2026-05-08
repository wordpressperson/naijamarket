import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PredictionMarket", function () {
  async function deployMarketFixture() {
    const [owner, user1, user2, resolver, feeRecipient] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockUsdc = await MockERC20.deploy();
    await mockUsdc.waitForDeployment();

    const MarketFactory = await ethers.getContractFactory("MarketFactory");
    const factory = await MarketFactory.deploy();
    await factory.waitForDeployment();

    await factory.setFeeRecipient(feeRecipient.address);
    // feePercentage is default 100 (1%)

    const ONE_DAY_IN_SECS = 24 * 60 * 60;
    const endTime = (await time.latest()) + ONE_DAY_IN_SECS;

    const tx = await factory.createMarket(
      await mockUsdc.getAddress(),
      resolver.address,
      "Will it rain tomorrow?",
      "https://example.com/image.png",
      "Weather",
      endTime
    );

    const receipt = await tx.wait();
    const marketAddress = await factory.markets(0);
    const market = await ethers.getContractAt("PredictionMarket", marketAddress);

    // Mint some USDC for testing
    const amount = ethers.parseUnits("1000", 18);
    await mockUsdc.mint(user1.address, amount);
    await mockUsdc.mint(user2.address, amount);

    return { factory, market, mockUsdc, owner, user1, user2, resolver, feeRecipient, endTime };
  }

  it("Should allow users to buy YES and NO shares before end time", async function () {
    const { market, mockUsdc, user1, user2 } = await deployMarketFixture();
    const amount = ethers.parseUnits("100", 18);

    await mockUsdc.connect(user1).approve(await market.getAddress(), amount);
    await market.connect(user1).buyShares(true, amount);

    expect(await market.yesShares(user1.address)).to.equal(amount);
    expect(await market.totalYesPool()).to.equal(amount);

    await mockUsdc.connect(user2).approve(await market.getAddress(), amount);
    await market.connect(user2).buyShares(false, amount);

    expect(await market.noShares(user2.address)).to.equal(amount);
    expect(await market.totalNoPool()).to.equal(amount);
  });

  it("Should correctly resolve and payout with fees", async function () {
    const { market, mockUsdc, user1, user2, resolver, feeRecipient, endTime } = await deployMarketFixture();
    const amount = ethers.parseUnits("100", 18);

    await mockUsdc.connect(user1).approve(await market.getAddress(), amount);
    await market.connect(user1).buyShares(true, amount);

    await mockUsdc.connect(user2).approve(await market.getAddress(), amount);
    await market.connect(user2).buyShares(false, amount);

    // Advance time past end time
    await time.increaseTo(endTime + 1);

    // Resolve market to YES
    await market.connect(resolver).resolveMarket(1); // Outcome.Yes = 1

    expect(await market.state()).to.equal(1); // MarketState.Resolved

    // user1 claims winnings
    const balanceBefore = await mockUsdc.balanceOf(user1.address);
    const feeRecipientBalanceBefore = await mockUsdc.balanceOf(feeRecipient.address);
    
    await market.connect(user1).claimWinnings();
    
    const balanceAfter = await mockUsdc.balanceOf(user1.address);
    const feeRecipientBalanceAfter = await mockUsdc.balanceOf(feeRecipient.address);

    // Since pools were 100/100, total pool is 200. User1 had 100% of YES. 
    // Profit is 100. Fee is 1% of 100 = 1. User gets 199. Fee recipient gets 1.
    const expectedPayout = ethers.parseUnits("199", 18);
    const expectedFee = ethers.parseUnits("1", 18);
    
    expect(balanceAfter - balanceBefore).to.equal(expectedPayout);
    expect(feeRecipientBalanceAfter - feeRecipientBalanceBefore).to.equal(expectedFee);

    // user2 cannot claim
    await expect(market.connect(user2).claimWinnings()).to.be.revertedWith("No winning shares");
  });

  it("Should allow cancellation and 1:1 refunds", async function () {
    const { market, mockUsdc, user1, user2, resolver } = await deployMarketFixture();
    const amount = ethers.parseUnits("100", 18);

    await mockUsdc.connect(user1).approve(await market.getAddress(), amount);
    await market.connect(user1).buyShares(true, amount);

    await mockUsdc.connect(user2).approve(await market.getAddress(), amount);
    await market.connect(user2).buyShares(false, amount);

    // Cancel market
    await market.connect(resolver).cancelMarket();
    expect(await market.state()).to.equal(2); // MarketState.Cancelled

    // users claim refunds
    const balanceBefore1 = await mockUsdc.balanceOf(user1.address);
    await market.connect(user1).claimWinnings();
    const balanceAfter1 = await mockUsdc.balanceOf(user1.address);
    
    expect(balanceAfter1 - balanceBefore1).to.equal(amount); // Got exactly their 100 back
    
    const balanceBefore2 = await mockUsdc.balanceOf(user2.address);
    await market.connect(user2).claimWinnings();
    const balanceAfter2 = await mockUsdc.balanceOf(user2.address);
    
    expect(balanceAfter2 - balanceBefore2).to.equal(amount); // Got exactly their 100 back
  });
});
