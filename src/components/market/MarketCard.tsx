"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface MarketData {
  id: string;
  question: string;
  volume: string;
  yesOdds: number;
  noOdds: number;
  imageUrl: string;
  category: string;
  isExpired?: boolean;
}

const IMAGE_OVERRIDES: Record<string, string> = {
  "https://example.com/nollywood.png": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
  "https://example.com/sports.png": "https://images.unsplash.com/photo-1518605368461-1ee120eb7701?w=800&q=80",
  "https://example.com/afrobeats.png": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  "https://example.com/economy.png": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  "https://example.com/lagos-weather.png": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80",
  "https://example.com/weather.png": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80",
};

export function MarketCard({ market }: { market: MarketData }) {
  const router = useRouter();

  const totalOdds = market.yesOdds + market.noOdds;
  const yesPercent = totalOdds > 0 ? Math.round((market.yesOdds / totalOdds) * 100) : 50;
  const noPercent = totalOdds > 0 ? Math.round((market.noOdds / totalOdds) * 100) : 50;

  return (
    <motion.div
      onClick={() => router.push(`/market/${market.id}`)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md hover:border-primary/50 ${
        market.isExpired ? "opacity-60 grayscale-[0.5]" : ""
      }`}
    >
      <div className="flex items-start justify-between space-x-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground font-medium mb-2">
            <span className="uppercase tracking-wider text-primary truncate" title={market.category}>
              {market.category}
            </span>
            {market.isExpired && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] uppercase text-destructive border border-destructive/20">
                Expired
              </span>
            )}
          </div>
          <h3 className="font-semibold leading-tight text-card-foreground line-clamp-4 md:text-lg" title={market.question}>
            {market.question}
          </h3>
        </div>
        <div className="flex-shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted border border-border flex items-center justify-center">
            {market.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={IMAGE_OVERRIDES[market.imageUrl] || market.imageUrl}
                alt={market.category}
                className="h-full w-full object-cover"
              />
            ) : (
              <BarChart2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <TrendingUp className="mr-1 h-3.5 w-3.5" />
          <span>₦{market.volume} Vol.</span>
        </div>

        <div className="flex w-full space-x-2">
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg bg-yes/10 border border-yes/20 py-2 text-yes hover:bg-yes/20 transition-colors">
            <span className="text-xs font-medium uppercase mb-0.5">Yes</span>
            <span className="text-sm font-bold">{yesPercent}%</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg bg-no/10 border border-no/20 py-2 text-no hover:bg-no/20 transition-colors">
            <span className="text-xs font-medium uppercase mb-0.5">No</span>
            <span className="text-sm font-bold">{noPercent}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
