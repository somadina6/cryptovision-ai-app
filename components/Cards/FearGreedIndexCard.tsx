"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface FearGreedData {
  index: number;
  level: string;
  timestamp: number;
}

const INDEX_LEVELS = [
  { min: 0, max: 24, level: "Extreme Fear", color: "text-red-500", barColor: "bg-red-500" },
  { min: 25, max: 49, level: "Fear", color: "text-orange-400", barColor: "bg-orange-400" },
  { min: 50, max: 74, level: "Neutral", color: "text-yellow-500", barColor: "bg-yellow-500" },
  { min: 75, max: 100, level: "Greed", color: "text-green-400", barColor: "bg-green-400" },
  { min: 100, max: Infinity, level: "Extreme Greed", color: "text-green-500", barColor: "bg-green-500" }
];

const getIndexDetails = (index: number) => {
  return INDEX_LEVELS.find(level => index >= level.min && index <= level.max) 
    || { level: "N/A", color: "text-gray-500", barColor: "bg-gray-500" };
};

const FearGreedIndexCard = () => {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        const response = await fetch("/api/fear-greed");
        
        if (!response.ok) {
          throw new Error("Failed to fetch Fear & Greed Index");
        }

        const fetchedData: FearGreedData = await response.json();
        setData(fetchedData);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFearGreedIndex();
  }, []);

  if (error) {
    return (
      <Card className="w-[250px]">
        <CardContent className="text-center text-red-500 p-4">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-[250px]">
        <CardContent className="flex items-center justify-center p-4">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const indexDetails = data ? getIndexDetails(data.index) : null;

  return (
    <Card className="w-[250px]">
      <CardHeader className="p-2 text-center">
        <CardTitle className="text-base font-bold">
          Fear & Greed Index
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <span 
            className={`text-3xl font-extrabold ${indexDetails?.color}`}
          >
            {data?.index ?? "N/A"}
          </span>
          <span className="text-lg font-semibold">
            {indexDetails?.level ?? "N/A"}
          </span>
          <div className="w-full h-2 rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full ${indexDetails?.barColor}`}
              style={{ width: `${data?.index ?? 0}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {data ? new Date(data.timestamp * 1000).toLocaleString() : "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FearGreedIndexCard;