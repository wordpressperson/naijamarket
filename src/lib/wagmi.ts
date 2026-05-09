import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy, polygon } from "wagmi/chains";
import { http, fallback } from "wagmi";

export const config = getDefaultConfig({
  appName: "NaijaMarket",
  // Fallback to a placeholder so it doesn't crash, but tell user to get one
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "e2b02847d15907997ed7849e7a8fbfe4", 
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: fallback([
      http("https://polygon-rpc.com"),
      http("https://polygon.llamarpc.com"),
      http(),
    ]),
    [polygonAmoy.id]: fallback([
      http("https://rpc-amoy.polygon.technology"),
      http("https://polygon-amoy-bor-rpc.publicnode.com"),
      http(),
    ]),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
