"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useFearGreedIndex } from "@/lib/hooks/useData";

interface FearGreedData {
  index: string;
  level: string;
  timestamp: number;
}

const INDEX_LEVELS = [
  {
    min: 0,
    max: 24,
    level: "Extreme Fear",
    color: "text-red-500",
    barColor: "bg-red-500",
  },
  {
    min: 25,
    max: 49,
    level: "Fear",
    color: "text-orange-400",
    barColor: "bg-orange-400",
  },
  {
    min: 50,
    max: 74,
    level: "Neutral",
    color: "text-yellow-500",
    barColor: "bg-yellow-500",
  },
  {
    min: 75,
    max: 100,
    level: "Greed",
    color: "text-green-400",
    barColor: "bg-green-400",
  },
  {
    min: 100,
    max: Infinity,
    level: "Extreme Greed",
    color: "text-green-500",
    barColor: "bg-green-500",
  },
];

const getIndexDetails = (index: number) => {
  return (
    INDEX_LEVELS.find((level) => index >= level.min && index <= level.max) || {
      level: "N/A",
      color: "text-gray-500",
      barColor: "bg-gray-500",
    }
  );
};

const FearGreedIndexCard = () => {
  const { data, error, isLoading } = useFearGreedIndex();

  // If we have data, always show it even while revalidating
  if (data) {
    const indexDetails = getIndexDetails(Number(data.index));
    return (
      <Card className="card h-full">
        <CardHeader className="text-center p-0">
          <CardTitle className="text-sm font-normal">
            Fear & Greed Index
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-0">
          <div className="flex flex-col items-center">
            <span className={`text-base font-extrabold ${indexDetails?.color}`}>
              {data.index}
            </span>
            <span className="text-sm">{data.level}</span>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${indexDetails?.barColor}`}
                style={{ width: `${data.index}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error("Fear & Greed Component Error:", error);
    return (
      <Card className="w-[250px]">
        <CardContent className="text-center text-red-500 p-4">
          Unable to load market data
        </CardContent>
      </Card>
    );
  }

  // Only show loading state if we don't have data
  return (
    <Card className="w-[250px]">
      <CardContent className="flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
};

export default FearGreedIndexCard;
