"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

const getIndexLevel = (index: number) => {
  if (index < 25) return { level: "Extreme Fear", color: "red-500" };
  if (index < 50) return { level: "Fear", color: "orange-400" };
  if (index < 75) return { level: "Greed", color: "green-400" };
  return { level: "Extreme Greed", color: "green-500" };
};

const FearGreedIndexCard = () => {
  const [index, setIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        const response = await fetch("/api/fear-greed");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const { color } = getIndexLevel(Number(data.index));
        setLevel(data.level);
        setColor(color);
        setIndex(Number(data.index));
        setTimestamp(new Date(data.timestamp * 1000).toISOString().split("T",)[0]);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFearGreedIndex();
  }, []);

  // return skeleton if loading
  if (error) return <div className="text-center text-red-500">{error}</div>;


  return (
    <Card className="max-w-sm ">
      <CardHeader className="mb-0 p-2 text-center">
        <CardTitle className="text-base font-bold">
          Fear & Greed Index
        </CardTitle>
      </CardHeader>
      {loading ? (
        <CardContent className="flex items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      ) : (
        <CardContent className="px-4">
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className={`text-3xl font-extrabold text-${color} `}>
              {index??'N/A'}
            </span>
            <span className="text-lg ">{level??"N/A"}</span>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full bg-${color??'gray-400'}`}
                style={{ width: `${index??0}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-center mt-2">
            Last updated: {timestamp??'N/A'}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FearGreedIndexCard;
