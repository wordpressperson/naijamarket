import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as path from "path";

// Load the root .env file where NEXT_PUBLIC_FACTORY_ADDRESS is stored
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Creating market with the account:", deployer.address);

  const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
  const mockUsdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS;

  if (!factoryAddress || !mockUsdcAddress) {
    throw new Error("Missing NEXT_PUBLIC_FACTORY_ADDRESS or NEXT_PUBLIC_USDC_ADDRESS in root .env");
  }

  console.log("Using Factory Address:", factoryAddress);
  console.log("Using USDC Address:", mockUsdcAddress);

  const MarketFactory = await ethers.getContractFactory("MarketFactory");
  const factory = MarketFactory.attach(factoryAddress);

  const ONE_DAY_IN_SECS = 24 * 60 * 60;
  const endTime = Math.floor(Date.now() / 1000) + (7 * ONE_DAY_IN_SECS);

  const markets = [
    {
      question: "Will 'A Tribe Called Judah' win Best Picture at AMVCA 2025?",
      image: "https://example.com/nollywood.png",
      category: "Nollywood"
    },
    {
      question: "Will Victor Osimhen be top scorer in Serie A this season?",
      image: "https://example.com/sports.png",
      category: "Sports"
    },
    {
      question: "Will Burna Boy win a Grammy in 2025?",
      image: "https://example.com/afrobeats.png",
      category: "Afrobeats"
    },
    {
      question: "Will the Naira stabilize below ₦1200/USD by Q4 2024?",
      image: "https://example.com/economy.png",
      category: "Economy"
    },
    {
      question: "Will it rain in Lagos tomorrow?",
      image: "https://example.com/weather.png",
      category: "Weather"
    }
  ];

  console.log("Sending transactions to create markets...");
  
  for (const market of markets) {
    console.log(`Creating market: ${market.question} (${market.category})`);
    const tx = await (factory as any).createMarket(
      mockUsdcAddress,
      deployer.address,
      market.question,
      market.image,
      market.category,
      endTime
    );
    await tx.wait();
  }
  
  console.log("All Test Markets created successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

