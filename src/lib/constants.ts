import MarketFactoryABI from "./abis/MarketFactory.json";
import PredictionMarketABI from "./abis/PredictionMarket.json";

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`;
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`;

export const FACTORY_ABI = MarketFactoryABI.abi;
export const PREDICTION_MARKET_ABI = PredictionMarketABI.abi;
