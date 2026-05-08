import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Mock USDC (Collateral Token) for testing
  // Only deploy this on local or testnets. On mainnet, we'd use the real USDC address.
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUsdc = await MockERC20.deploy();
  await mockUsdc.waitForDeployment();
  const mockUsdcAddress = await mockUsdc.getAddress();
  
  console.log("Mock USDC deployed to:", mockUsdcAddress);

  // 2. Deploy MarketFactory
  const MarketFactory = await ethers.getContractFactory("MarketFactory");
  const factory = await MarketFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("MarketFactory deployed to:", factoryAddress);
  
  // 3. Optional: Create an initial test market if we're on a testnet
  if (network.name !== "mainnet" && network.name !== "polygon") {
    console.log("Creating an initial test market...");
    
    // Set end time to 7 days from now
    const ONE_DAY_IN_SECS = 24 * 60 * 60;
    const endTime = Math.floor(Date.now() / 1000) + (7 * ONE_DAY_IN_SECS);

    const tx = await factory.createMarket(
      mockUsdcAddress,
      deployer.address, // Deployer acts as the resolver for the test market
      "Will it rain in Lagos tomorrow?",
      "https://example.com/lagos-weather.png",
      "Weather",
      endTime
    );
    
    await tx.wait();
    
    const marketAddress = await factory.markets(0);
    console.log("Initial Test Market created at:", marketAddress);
  }

  console.log("Deployment complete! 🎉");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
