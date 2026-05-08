import { useReadContract, useReadContracts } from "wagmi";
import { FACTORY_ADDRESS, FACTORY_ABI, PREDICTION_MARKET_ABI } from "@/lib/constants";
import { formatUnits } from "viem";
import { MarketData } from "@/components/market/MarketCard";

export function useMarkets() {
  // 1. Fetch all market addresses from the factory
  const { 
    data: marketAddresses, 
    isLoading: isLoadingAddresses,
    isError: isErrorAddresses
  } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getMarkets",
  });

  // 2. Prepare multicall configuration for all markets
  const contracts = (marketAddresses as `0x${string}`[] || []).map((address) => ({
    address,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getMarketInfo",
  }));

  // 3. Fetch detailed info for all markets simultaneously
  const {
    data: marketsInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo
  } = useReadContracts({
    // Tell TypeScript to bypass Wagmi's ultra-strict ABI type-checking here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: contracts as any,
  });

  const isLoading = isLoadingAddresses || isLoadingInfo;
  const isError = isErrorAddresses || isErrorInfo;

  // 4. Format the raw blockchain data into our UI MarketData interface
  const markets: MarketData[] = [];

  if (marketsInfo && marketAddresses) {
    marketsInfo.forEach((result, index) => {
      if (result.status === "success" && result.result) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const info = result.result as any; 
        
        const totalYes = info.totalYesPool || 0n;
        const totalNo = info.totalNoPool || 0n;
        const totalPool = totalYes + totalNo;
        
        let yesOdds = 1000;
        let noOdds = 1000;
        
        if (totalPool > 0n) {
            yesOdds = Math.round(Number((totalYes * 2000n) / totalPool));
            noOdds = 2000 - yesOdds;
        }
        
        // Format volume. MockERC20 uses 18 decimals.
        const volumeNum = Number(formatUnits(totalPool, 18));
        const volumeFormatted = volumeNum.toLocaleString(undefined, { maximumFractionDigits: 0 });

        markets.push({
          id: marketAddresses[index] as string, 
          question: info.question,
          imageUrl: info.imageUrl || "", 
          category: info.category,
          volume: volumeFormatted,
          yesOdds,
          noOdds,
        });
      }
    });
  }

  return {
    markets,
    isLoading,
    isError
  };
}
