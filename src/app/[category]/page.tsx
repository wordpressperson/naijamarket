"use client";

import { MarketGrid } from "@/components/market/MarketGrid";
import { useMarkets } from "@/hooks/useMarkets";
import { Loader2 } from "lucide-react";
import { capitalize } from "@/lib/utils"; // Assuming capitalize exists, if not we can use a basic string method

// Capitalize first letter helper
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { markets, isLoading, isError } = useMarkets();
  
  // Filter markets by category
  // Assuming the category in the contract matches the URL exactly (case-insensitive)
  const categoryName = params.category;
  
  const categoryMarkets = markets.filter(
    (market) => market.category.toLowerCase() === categoryName.toLowerCase()
  );

  const displayTitle = capitalizeFirstLetter(categoryName) + " Markets";

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading markets...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20">
              <p className="font-semibold">Failed to load markets</p>
              <p className="text-sm opacity-90 mt-1">Please make sure your wallet is connected to the Polygon network.</p>
            </div>
          </div>
        ) : categoryMarkets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>No markets available in this category at the moment.</p>
          </div>
        ) : (
          <MarketGrid title={displayTitle} markets={categoryMarkets} />
        )}
      </div>
    </div>
  );
}
