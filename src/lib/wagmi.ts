import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygonAmoy, polygon } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "NaijaMarket",
  // Fallback to a placeholder so it doesn't crash, but tell user to get one
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "e2b02847d15907997ed7849e7a8fbfe4", 
  chains: [polygonAmoy, polygon],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
