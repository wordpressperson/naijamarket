"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, Trophy, Film, Landmark, Music } from "lucide-react";

const categories = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Politics", icon: Landmark, href: "/politics" },
  { name: "Sports", icon: Trophy, href: "/sports" },
  { name: "Nollywood", icon: Film, href: "/nollywood" },
  { name: "Afrobeats", icon: Music, href: "/afrobeats" },
  { name: "Economy", icon: TrendingUp, href: "/economy" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 px-4 py-6 h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-1">
        {categories.map((category) => {
          const isActive = pathname === category.href;
          return (
            <Link
              key={category.name}
              href={category.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <category.icon className="h-5 w-5" />
              <span>{category.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto space-y-1">
        <Link
          href="/admin"
          className={cn(
            "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors mt-8",
            pathname === "/admin"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          <span>Admin</span>
        </Link>
      </div>
    </div>
  );
}
