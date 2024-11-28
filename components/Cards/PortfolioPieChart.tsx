import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Token } from '@/types/types';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Color palette for the pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'
];

interface PortfolioPieChartProps {
  tokens: Array<{
    token: Token;
    amount: number;
  }>;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ tokens }) => {
  // Prepare data for the pie chart
  const chartData = tokens.map(item => ({
    name: item.token.name,
    value: item.token.current_price * item.amount,
    symbol: item.token.symbol,
    image: item.token.image
  })).filter(item => item.value > 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Image 
              src={data.image} 
              alt={data.name} 
              className="w-6 h-6 rounded-full" 
            />
            <span className="font-bold">{data.name}</span>
          </div>
          <p className="text-sm">
            Value: ${data.value.toLocaleString()}
          </p>
          <p className="text-sm">
            Percentage: {((data.value / totalValue) * 100).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total portfolio value
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Portfolio Composition</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                // label={({ name, percent }) => 
                //   `${name}`
                // }
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No tokens in portfolio
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioPieChart;