"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface TradingTerminalProps {
  yesOdds: number;
  noOdds: number;
}

export function TradingTerminal({ yesOdds, noOdds }: TradingTerminalProps) {
  const { isConnected } = useAccount();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [outcome, setOutcome] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState<string>("");

  const currentPrice = outcome === "yes" ? yesOdds : noOdds;
  const potentialReturn = amount ? (parseFloat(amount) / (currentPrice / 2000)).toFixed(2) : "0.00";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex space-x-2 rounded-lg bg-muted p-1 mb-6">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
            side === "buy" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
            side === "sell" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <button
            onClick={() => setOutcome("yes")}
            className={`flex flex-1 flex-col items-center rounded-xl border-2 p-3 transition-colors ${
              outcome === "yes" ? "border-yes bg-yes/10 text-yes" : "border-border hover:border-yes/50"
            }`}
          >
            <span className="text-sm font-semibold uppercase mb-1">Yes</span>
            <span className="text-xl font-bold">₦{yesOdds}</span>
          </button>
          <button
            onClick={() => setOutcome("no")}
            className={`flex flex-1 flex-col items-center rounded-xl border-2 p-3 transition-colors ${
              outcome === "no" ? "border-no bg-no/10 text-no" : "border-border hover:border-no/50"
            }`}
          >
            <span className="text-sm font-semibold uppercase mb-1">No</span>
            <span className="text-xl font-bold">₦{noOdds}</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Amount (USDC)</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/50 p-3 text-lg font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            You can bet any amount you like. Your potential return scales proportionally.
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg price</span>
            <span className="font-medium">₦{currentPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shares</span>
            <span className="font-medium">{amount ? potentialReturn : "0.00"}</span>
          </div>
          <div className="flex justify-between text-primary pt-2 border-t border-border/50">
            <span className="font-medium">Potential return</span>
            <span className="font-bold">${potentialReturn}</span>
          </div>
        </div>

        {isConnected ? (
          <button className="w-full rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow transition hover:bg-primary/90">
            Place Order
          </button>
        ) : (
          <div className="flex justify-center w-full mt-4">
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}
