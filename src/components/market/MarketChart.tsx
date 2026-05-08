"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface ChartDataPoint {
  time: string;
  price: number;
}

interface MarketChartProps {
  data: ChartDataPoint[];
}

export function MarketChart({ data }: MarketChartProps) {
  // Find min/max for the Y axis to make the chart look dynamic
  const minPrice = useMemo(() => Math.min(...data.map(d => d.price)) - 5, [data]);
  const maxPrice = useMemo(() => Math.max(...data.map(d => d.price)) + 5, [data]);

  return (
    <div className="h-[300px] w-full lg:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={[Math.max(0, minPrice), Math.min(2000, maxPrice)]} 
            hide={true} 
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1b23', borderColor: '#2d2f39', borderRadius: '8px' }}
            itemStyle={{ color: '#10b981' }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [`₦${value}`, "Yes"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
