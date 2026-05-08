import { MarketChart, ChartDataPoint } from "@/components/market/MarketChart";
import { TradingTerminal } from "@/components/market/TradingTerminal";
import Link from "next/link";
import { ArrowLeft, Clock, Users, Activity } from "lucide-react";

// Mock data generator for the chart
function generateChartData(currentPrice: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];import { MarketChart, ChartDataPoint } from "@/components/market/MarketChart";
import { TradingTerminal } from "@/components/market/TradingTerminal";
import Link from "next/link";
import { ArrowLeft, Clock, Users, Activity } from "lucide-react";

// Mock data generator for the chart
function generateChartData(currentPrice: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = currentPrice;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Add some random noise
    price = Math.max(1, Math.min(1999, price + (Math.random() * 100 - 50)));
    data.push({
      time: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(price)
    });
  }
  
  // Ensure the last point matches current odds exactly
  data[data.length - 1].price = currentPrice;
  return data;
}

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the specific market
  const market = {
    id: params.id,
    question: "Will Nigeria win AFCON 2025?",
    volume: "2,504,500",
    yesOdds: 1360,
    noOdds: 640,
    category: "Sports",
    resolutionSource: "CAF Official Announcement",
    endDate: "Feb 15, 2025",
  };

  const chartData = generateChartData(market.yesOdds);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Markets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {market.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {market.question}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Activity className="mr-1.5 h-4 w-4" />
                ₦{market.volume} Vol.
              </div>
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                Ends {market.endDate}
              </div>
              <div className="flex items-center">
                <Users className="mr-1.5 h-4 w-4" />
                245 Traders
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span>Price History</span>
              <span className="text-yes text-sm bg-yes/10 px-2 py-1 rounded-md">₦{market.yesOdds}</span>
            </h3>
            <MarketChart data={chartData} />
          </div>

          {/* Rules */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Market Rules</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                This market will resolve to &quot;Yes&quot; if the Nigerian Men&apos;s National Football Team (Super Eagles) wins the 2025 Africa Cup of Nations (AFCON) final match.
              </p>
              <p>
                If any other team wins, or if the tournament is permanently cancelled, this market will resolve to &quot;No&quot;.
              </p>
              <div className="flex items-center pt-4 border-t border-border/50">
                <span className="font-medium text-foreground mr-2">Resolution Source:</span>
                {market.resolutionSource}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Terminal Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TradingTerminal yesOdds={market.yesOdds} noOdds={market.noOdds} />
          </div>
        </div>
      </div>
    </div>
  );
}
  let price = currentPrice;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Add some random noise
    price = Math.max(1, Math.min(1999, price + (Math.random() * 100 - 50)));
    data.push({
      time: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(price)
    });
  }
  
  // Ensure the last point matches current odds exactly
  data[data.length - 1].price = currentPrice;
  return data;
}

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  // Mock data for the specific market
  const market = {
    id: params.id,
    question: "Will Nigeria win AFCON 2025?",
    volume: "2,504,500",
    yesOdds: 1360,
    noOdds: 640,
    category: "Sports",
    resolutionSource: "CAF Official Announcement",
    endDate: "Feb 15, 2025",
  };

  const chartData = generateChartData(market.yesOdds);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Markets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {market.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {market.question}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Activity className="mr-1.5 h-4 w-4" />
                ₦{market.volume} Vol.
              </div>
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                Ends {market.endDate}
              </div>
              <div className="flex items-center">
                <Users className="mr-1.5 h-4 w-4" />
                245 Traders
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span>Price History</span>
              <span className="text-yes text-sm bg-yes/10 px-2 py-1 rounded-md">₦{market.yesOdds}</span>
            </h3>
            <MarketChart data={chartData} />
          </div>

          {/* Rules */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Market Rules</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                This market will resolve to "Yes" if the Nigerian Men's National Football Team (Super Eagles) wins the 2025 Africa Cup of Nations (AFCON) final match.
              </p>
              <p>
                If any other team wins, or if the tournament is permanently cancelled, this market will resolve to "No".
              </p>
              <div className="flex items-center pt-4 border-t border-border/50">
                <span className="font-medium text-foreground mr-2">Resolution Source:</span>
                {market.resolutionSource}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Terminal Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TradingTerminal yesOdds={market.yesOdds} noOdds={market.noOdds} />
          </div>
        </div>
      </div>
    </div>
  );
}
