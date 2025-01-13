import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Token } from "@/types/types";
import { PortfolioWithToken } from "@/types/database";

// Enhanced color palette with better contrast
const COLOR_PALETTE = [
  "#3B82F6", // Vibrant Blue
  "#10B981", // Emerald Green
  "#F43F5E", // Rose Red
  "#6366F1", // Indigo
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#22D3EE", // Cyan
];

interface PortfolioToken {
  token: Token;
  amount: number;
}

interface PortfolioPieChartProps {
  tokens: PortfolioWithToken [];
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ tokens }) => {
  // Memoize chart data preparation to optimize performance
  const chartData = useMemo(() => {
    return tokens
      .map((item) => ({
        name: item.token.name,
        value: item.token.current_price * item.amount,
        symbol: item.token.symbol,
        image: item.token.image,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [tokens]);

  // Memoize total value calculation
  const totalValue = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  // Enhanced custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(2);

      return (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Image
              src={data.image}
              alt={data.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {data.name} ({data.symbol.toUpperCase()})
            </span>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Value: ${data.value.toLocaleString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Percentage: {percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Portfolio Composition
          <span className="text-sm font-normal text-gray-500">
            Total: ${totalValue.toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[380px] pt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="85%"
                innerRadius="60%"
                dataKey="value"
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
              
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.symbol}`}
                    fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                    className="transition-all hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No tokens in portfolio
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioPieChart;
