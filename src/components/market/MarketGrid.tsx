"use client";

import { MarketCard, MarketData } from "./MarketCard";

interface MarketGridProps {
  markets: MarketData[];
  title?: string;
}

export function MarketGrid({ markets, title }: MarketGridProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
}
