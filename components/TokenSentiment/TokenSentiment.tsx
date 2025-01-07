"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, BarChart2, AlertCircle } from "lucide-react";

interface SentimentData {
  score: number;
  summary: string;
  lastUpdated: string;
}

export default function TokenSentiment({ tokenSymbol }: { tokenSymbol: string }) {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch(`/api/ai/token-sentiment/${tokenSymbol}`);
        if (!response.ok) throw new Error("Failed to fetch sentiment");
        const data = await response.json();
        setSentiment(data.sentiment);
      } catch (err) {
        setError("Failed to load sentiment analysis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, [tokenSymbol]);

  if (loading) {
    return (
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-red-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSentimentInfo = (score: number) => {
    if (score > 50)
      return {
        color: "text-green-500",
        bgColor: "bg-green-500",
        gradient: "from-background to-green-500/5",
        icon: <TrendingUp className="h-6 w-6" />,
        label: "Bullish",
      };
    if (score > 0)
      return {
        color: "text-green-400",
        bgColor: "bg-green-400",
        gradient: "from-background to-green-400/5",
        icon: <TrendingUp className="h-6 w-6" />,
        label: "Slightly Bullish",
      };
    if (score > -50)
      return {
        color: "text-red-400",
        bgColor: "bg-red-400",
        gradient: "from-background to-red-400/5",
        icon: <TrendingDown className="h-6 w-6" />,
        label: "Slightly Bearish",
      };
    return {
      color: "text-red-500",
      bgColor: "bg-red-500",
      gradient: "from-background to-red-500/5",
      icon: <TrendingDown className="h-6 w-6" />,
      label: "Bearish",
    };
  };

  const sentimentInfo = getSentimentInfo(sentiment?.score || 0);

  return (
    <Card
      className={`overflow-hidden border-none shadow-lg bg-gradient-to-br ${sentimentInfo.gradient}`}
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Market Sentiment</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`flex items-center space-x-1 ${sentimentInfo.color}`}
              >
                {sentimentInfo.icon}
                <span className="font-semibold">{sentimentInfo.label}</span>
              </span>
              <div
                className={`px-3 py-1 rounded-full ${sentimentInfo.color} bg-opacity-10`}
              >
                <span className="font-bold">{sentiment?.score}</span>
              </div>
            </div>
          </div>

          {/* Sentiment Bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute left-0 h-full transition-all duration-500 ${sentimentInfo.bgColor}`}
              style={{
                width: `${((sentiment?.score || 0) + 100) / 2}%`,
                transform: "translateX(0)",
              }}
            />
          </div>

          {/* Summary Section */}
          <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground">
              AI Analysis Summary
            </h4>
            <p className="text-sm leading-relaxed">{sentiment?.summary}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              Last updated:{" "}
              {new Date(sentiment?.lastUpdated || "").toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
