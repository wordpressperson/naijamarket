"use client";

import { MarketGrid } from "@/components/market/MarketGrid";
import { TrendingBanner } from "@/components/market/TrendingBanner";
import { useMarkets } from "@/hooks/useMarkets";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { markets, isLoading, isError } = useMarkets();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <TrendingBanner />
      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading live markets...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20">
              <p className="font-semibold">Failed to load markets</p>
              <p className="text-sm opacity-90 mt-1">Please make sure your wallet is connected to the Polygon network.</p>
            </div>
          </div>
        ) : markets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>No markets available at the moment.</p>
          </div>
        ) : (
          <MarketGrid title="Live Markets" markets={markets} />
        )}
      </div>
    </div>
  );
}
