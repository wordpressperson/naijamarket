"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function TrendingBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-background to-background border border-primary/20 p-6 sm:p-8 mb-8"
    >
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            🚀 Trending Now
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Will Nigeria win AFCON 2025?
          </h1>
          <p className="text-lg text-muted-foreground">
            Over ₦2.5B traded on this market. Place your predictions before the group stage ends.
          </p>
        </div>
        
        <div className="flex shrink-0 items-center gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-card border border-border p-4 min-w-[100px]">
            <span className="text-sm font-medium text-muted-foreground mb-1">Yes</span>
            <span className="text-2xl font-bold text-yes">₦1360</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-card border border-border p-4 min-w-[100px]">
            <span className="text-sm font-medium text-muted-foreground mb-1">No</span>
            <span className="text-2xl font-bold text-no">₦640</span>
          </div>
          <button className="ml-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
