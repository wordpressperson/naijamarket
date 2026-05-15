"use client";

import { MarketGrid } from "@/components/market/MarketGrid";
import { TrendingBanner } from "@/components/market/TrendingBanner";
import { useMarkets } from "@/hooks/useMarkets";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const { markets, isLoading, isError } = useMarkets();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q")?.toLowerCase() || "";

  const filteredMarkets = markets.filter(market => {
    if (!searchQuery) return true;
    return (
      market.question.toLowerCase().includes(searchQuery) ||
      market.category.toLowerCase().includes(searchQuery)
    );
  });

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
        ) : filteredMarkets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            {searchQuery ? (
              <p>No markets found matching "{searchQuery}".</p>
            ) : (
              <p>No markets available at the moment.</p>
            )}
          </div>
        ) : (
          <MarketGrid title={searchQuery ? `Search Results for "${searchQuery}"` : "Live Markets"} markets={filteredMarkets} />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
